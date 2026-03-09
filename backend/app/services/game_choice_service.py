import asyncio
from typing import List

from sqlalchemy.ext.asyncio import AsyncSession

from app.extensions.game_status_enum import GameStatusEnum
from app.extensions.turn_status_enum import TurnStatusEnum
from app.graphql.types.game_choice_type import GameChoiceType
from app.graphql.types.game_chosen_choice_type import GameChosenChoiceType
from app.graphql.types.game_participation_type import GameParticipationType
from app.repositories.game_choice_repository import GameChoiceRepository
from app.repositories.game_participation_repository import GameParticipationRepository
from app.repositories.game_turn_repository import GameTurnRepository
from app.services.background_game_service import BackgroundGameService
from app.utils.graphql_utils import MessageException


class GameChoiceService:
    @staticmethod
    async def get_turn_chosen_choices(session: AsyncSession, game_id: int, participant_session_id: str) -> List[
        GameChosenChoiceType]:
        """получить выбранные варианты для текущего хода"""
        answered_turn = await GameTurnRepository.get_current_turn_by_status(
            session, game_id, TurnStatusEnum.answered
        )
        if not answered_turn:
            raise MessageException("No answered turn found")

        chosen_choices = await GameChoiceRepository.list_chosen_by_turn(session, answered_turn.id)

        result_list = []
        for choice in chosen_choices:
            participation_model = choice.question.participation
            is_self = participation_model.session_id == participant_session_id

            result_list.append(
                GameChosenChoiceType(
                    participation=GameParticipationType.from_model(participation_model, is_self),
                    title_for_everyone=choice.title_for_everyone,
                    self=is_self,
                    result=choice.result if is_self else None,
                    result_tags=choice.result_tags
                )
            )
        return result_list

    @staticmethod
    async def choose_option(session: AsyncSession, choice_id: int) -> GameChoiceType:
        """участник выбирает вариант ответа на вопрос для текущего хода"""
        choice = await GameChoiceRepository.get_with_turn(session, choice_id)
        if not choice:
            raise MessageException("Choice not found")

        already_answered = await GameChoiceRepository.have_answered_choice(
            session, choice.game_question_id
        )
        if already_answered:
            raise MessageException("You have already answered this question")

        choice.chosen = True
        question = choice.question
        turn = question.turn
        game = turn.game

        answered_count = await GameChoiceRepository.count_answered_in_turn(session, turn.id)
        len_participations = await GameParticipationRepository.count_by_game(session, turn.game_id)
        len_turns = await GameTurnRepository.count_turns_in_game(session, turn.game_id)

        if answered_count >= len_participations:
            turn.status = TurnStatusEnum.answered if turn.index < len_turns else TurnStatusEnum.confirmed

        if turn.index >= len_turns:
            game.status = GameStatusEnum.generating_results
            asyncio.create_task(
                BackgroundGameService.process_generate_result(
                    game_id=turn.game_id,
                    participation_id=question.participation_id,
                )
            )
        else:
            next_turn = await GameTurnRepository.get_by_index_and_game(
                session, index= turn.index + 1, game_id=turn.game_id
            )
            next_turn.status = TurnStatusEnum.generating

            asyncio.create_task(
                BackgroundGameService.process_generate_new_question(
                    game_id=turn.game_id,
                    turn_id=next_turn.id,  # noqa:
                    participation_id=question.participation_id,
                )
            )

        return GameChoiceType.from_model(choice)
