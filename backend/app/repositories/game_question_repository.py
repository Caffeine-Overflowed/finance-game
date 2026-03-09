from typing import List

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import GameChoice, GameQuestion


class GameQuestionRepository:
    @staticmethod
    async def create_question(
            session: AsyncSession,
            game_id: int,
            turn_id: int,
            participation_id: int,
            title: str,
    ) -> int:
        question = GameQuestion(
            game_id=game_id,
            turn_id=turn_id,
            participation_id=participation_id,
            title=title
        )

        session.add(question)
        await session.flush()

        return question.id

    @staticmethod
    async def list_by_turn_and_participation(
            session: AsyncSession, turn_id: int, participation_id: int
    ) -> List[GameQuestion]:
        """Получить список вопросов для хода и участника с предзагрузкой вариантов."""
        result = await session.execute(
            select(GameQuestion)
            .where(GameQuestion.turn_id == turn_id)
            .where(GameQuestion.participation_id == participation_id)
            .options(selectinload(GameQuestion.choices))  # <-- Важная оптимизация!
        )
        return list(result.scalars().all())

    @staticmethod
    async def list_by_turn_and_game_id(
            session: AsyncSession, turn_id: int
    ) -> List[GameQuestion]:
        """Получить список вопросов для хода и игры с предзагрузкой вариантов."""
        result = await session.execute(
            select(GameQuestion)
            .where(GameQuestion.turn_id == turn_id)
        )
        return list(result.scalars().all())

    @staticmethod
    async def count_list_by_turn(
            session: AsyncSession, turn_id: int
    ) -> int:
        result = await session.execute(
            select(func.count(GameQuestion.id))
            .where(GameQuestion.turn_id == turn_id)
        )
        return result.scalar()


    @staticmethod
    async def list_by_game_and_participation(
            session: AsyncSession, game_id: int, participation_id: int
    ) -> List[GameQuestion]:
        stmt = (
            select(GameQuestion)
            .where(GameQuestion.game_id == game_id)
            .where(GameQuestion.participation_id == participation_id)
            .options(
                selectinload(GameQuestion.choices),
                selectinload(GameQuestion.turn),
            )
        )
        result = await session.execute(stmt)
        return list(result.scalars().all())
