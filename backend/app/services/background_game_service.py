import asyncio
import json

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.gemini_generation import Choice, generate_opening_question, generate_questions_for_player, \
    generate_turn_result, \
    Question, TurnResult
from app.extensions.game_status_enum import GameStatusEnum
from app.extensions.gpt_parsing.result_response import AdditionalResultItem
from app.extensions.turn_status_enum import TurnStatusEnum
from app.models import GameChoice, GameParticipation
from app.repositories.game_choice_repository import GameChoiceRepository
from app.repositories.game_participation_repository import GameParticipationRepository
from app.repositories.game_question_repository import GameQuestionRepository
from app.repositories.game_repository import GameRepository
from app.repositories.game_result_repository import GameResultRepository
from app.repositories.game_turn_repository import GameTurnRepository
from app.utils.database import Database
from app.utils.logging import StructuredLogger


class BackgroundGameService:
    @staticmethod
    async def process_game_start(game_id: int, turn_id: int, age_track: list[int]):
        async with Database.get_session() as session:
            rows = await session.execute(
                select(GameParticipation.id).where(GameParticipation.game_id == game_id)
            )
            participant_ids = [pid for (pid,) in rows.all()]

            turn = await GameTurnRepository.get(session, turn_id)
            if turn is None:
                raise RuntimeError(f"Turn {turn_id} not found for game {game_id}")
            current_age = turn.year

        try:
            idx = age_track.index(current_age)
        except ValueError:
            raise RuntimeError(f"current_age {current_age} is not in age_track {age_track}")

        next_age = age_track[idx + 1] if idx + 1 < len(age_track) else None
        final_age = age_track[-1]
        time_span_years = (next_age - current_age) if next_age is not None else 0

        opening_context = json.dumps(
            {
                "current_age": current_age,
                "next_age": next_age,
                "final_age": final_age,
                "time_span_years": time_span_years,
                "age_track": age_track,
            },
            ensure_ascii=False,
        )

        try:
            q = await generate_opening_question(opening_context)
        except Exception as e:
            raise RuntimeError(f"Gemini opening question failed: {e}") from e

        async with Database.get_session() as session:
            for pid in participant_ids:
                q_id = await GameQuestionRepository.create_question(
                    session, game_id=game_id, turn_id=turn_id,
                    participation_id=pid, title=q.title
                )
                await GameChoiceRepository.create_choices(session, [
                    GameChoice(
                        game_question_id=q_id,
                        title=c.title,
                        title_for_everyone=c.title_for_everyone,
                        result=c.result,
                        result_tags=c.result_tags,
                    ) for c in q.choices
                ])

            turn = await GameTurnRepository.get(session, turn_id)
            turn.status = TurnStatusEnum.waiting_for_answers

    @staticmethod
    async def generate_context_ext(session: AsyncSession, game_id, participation_id: int) -> str:

        questions = await GameQuestionRepository.list_by_game_and_participation(session, game_id, participation_id)
        questions_dumped = []

        for q in questions:
            choices_dumped = []
            for choice in q.choices:
                choices_dumped.append({
                    "title": choice.title,
                    "result_tags": choice.result_tags,
                    "consequences": choice.result,
                    "chosen": choice.chosen,
                })
            questions_dumped.append({
                "age": q.turn.year,
                "title": q.title,
                "choices": choices_dumped
            })

        return json.dumps(questions_dumped)

    @staticmethod
    async def process_generate_new_question(game_id: int, turn_id: int, participation_id: int):
        # --- 1) Собираем историю, возраст и таймлайн ---
        async with Database.get_session() as session:
            dumped_history = await BackgroundGameService.generate_context_ext(session, game_id, participation_id)
            history = json.loads(dumped_history)

            turn = await GameTurnRepository.get(session, turn_id)
            current_age = turn.year
            age_track = await GameTurnRepository.list_years_by_game_for_generating(session, game_id)

        try:
            idx = age_track.index(current_age)  # type: ignore
        except ValueError:
            raise RuntimeError(f"current_age {current_age} is not in age_track {age_track}")

        next_age = age_track[idx + 1] if idx + 1 < len(age_track) else None
        final_age = age_track[-1]
        time_span_years = (next_age - current_age) if next_age is not None else 0

        context_payload = {
            "current_age": current_age,
            "next_age": next_age,
            "final_age": final_age,
            "time_span_years": time_span_years,
            "age_track": age_track,
            "history": history,
        }
        context = json.dumps(context_payload, ensure_ascii=False)

        for i in range(5):
            try:
                q = await generate_questions_for_player(context)
                break
            except Exception as e:
                StructuredLogger.exception("ai.generating_question.exception", error=str(e))
                await asyncio.sleep(i * 0.8)
                if i == 4:
                    q = Question(
                        title="AI Unavailable. Wait some minutes",
                        choices=[
                            Choice(
                                title="I have waited, continue",
                                result_tags=["AI Unavailable"],
                                result="AI Unavailable",
                                title_for_everyone="AI Unavailable",
                            )
                        ]
                    )

        # --- 3) Сохраняем в БД ---
        async with Database.get_session() as session:
            q_id = await GameQuestionRepository.create_question(
                session, game_id=game_id, turn_id=turn_id,
                participation_id=participation_id, title=q.title
            )
            await GameChoiceRepository.create_choices(session, [
                GameChoice(
                    game_question_id=q_id,
                    title=c.title,
                    title_for_everyone=c.title_for_everyone,
                    result=c.result,
                    result_tags=c.result_tags,
                ) for c in q.choices
            ])

            total_participants = await GameParticipationRepository.count_by_game(session, game_id)
            generated_questions = await GameQuestionRepository.count_list_by_turn(session, turn_id)

            if generated_questions == total_participants:
                turn = await GameTurnRepository.get(session, turn_id)
                turn.status = TurnStatusEnum.waiting_for_answers

    @staticmethod
    async def process_generate_result(game_id: int, participation_id: int):
        # --- 1) Собираем историю ---
        async with Database.get_session() as session:
            player_trace = await BackgroundGameService.generate_context_ext(session, game_id, participation_id)

        for i in range(5):
            try:
                r = await generate_turn_result(player_trace)
                break
            except Exception as e:
                StructuredLogger.exception(f"ai.generating_result.exception", error=str(e))
                await asyncio.sleep(i * 0.8)
                if i == 4:
                    r = TurnResult(
                        score=0,
                        description="AI unavailable",
                        additional_results=[
                            AdditionalResultItem(
                                title="AI UnAvailable",
                                description="AI unavailable",
                                id=1,
                            )
                        ]
                    )

        # --- 3) Сохраняем результат ---
        async with Database.get_session() as session:
            # Конвертируем Pydantic модели в dict для JSON поля
            additional_results_data = None
            if r.additional_results:
                additional_results_data = [item.model_dump() for item in r.additional_results]

            await GameResultRepository.create_result(
                session, game_id=game_id, participation_id=participation_id,
                score=r.score, description=r.description,
                additional_results=additional_results_data
            )

            total_participants = await GameParticipationRepository.count_by_game(session, game_id)
            generated_results = await GameResultRepository.count_by_game_id(session, game_id)
            if generated_results == total_participants:
                game = await GameRepository.get(session, game_id)
                game.status = GameStatusEnum.ended
