from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import joinedload, selectinload

from app.models import GameChoice, GameQuestion, GameTurn


class GameChoiceRepository:
    @staticmethod
    async def create_choices(
            session,
            choices: list[GameChoice]
    ) -> list[GameChoice]:
        session.add_all(choices)
        await session.flush()

        return choices

    @staticmethod
    async def list_chosen_by_turn(session, turn_id: int) -> list[GameChoice]:
        """Получить список выбраненых вариантов ответа для хода с предзагрузкой участника."""
        result = await session.execute(
            select(GameChoice)
            .join(GameChoice.question)
            .where(GameQuestion.turn_id == turn_id)
            .where(GameChoice.chosen == True)
            .options(
                selectinload(GameChoice.question)
                .selectinload(GameQuestion.participation)
            )
        )
        return list(result.scalars().all())

    @staticmethod
    async def get(session, choice_id: int) -> Optional[GameChoice]:
        result = await session.execute(
            select(GameChoice)
            .where(GameChoice.id == choice_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_with_turn(session, choice_id: int) -> Optional[GameChoice]:
        result = await session.execute(
            select(GameChoice)
            .where(GameChoice.id == choice_id)
            .options(
                joinedload(GameChoice.question),
                joinedload(GameChoice.question, GameQuestion.turn),
                joinedload(GameChoice.question, GameQuestion.game),
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def have_answered_choice(
            session,
            question_id: int,
    ) -> bool:
        result = await session.execute(
            select(GameChoice)
            .where(GameChoice.game_question_id == question_id)
            .where(GameChoice.chosen == True)
        )
        return result.scalar_one_or_none() is not None

    @staticmethod
    async def count_answered_in_turn(
            session,
            turn_id: int,
    ) -> int:
        result = await session.execute(
            select(func.count(GameChoice.id))
            .join(GameChoice.question)
            .where(GameQuestion.turn_id == turn_id)
            .where(GameChoice.chosen == True)
        )
        return result.scalar_one()
