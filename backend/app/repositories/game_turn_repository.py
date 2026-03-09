from typing import List, Optional

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.extensions.turn_status_enum import TurnStatusEnum
from app.models.game_turn import GameTurn


class GameTurnRepository:
    @staticmethod
    async def create_turns_for_game(
            session: AsyncSession,
            turns: List[GameTurn],
    ) -> List[GameTurn]:
        session.add_all(turns)
        await session.flush()

        return turns

    @staticmethod
    async def get(
            session: AsyncSession,
            turn_id: int,
    ) -> GameTurn | None:
        result = await session.get(GameTurn, turn_id)
        return result

    @staticmethod
    async def list_by_game_for_generating(
            session: AsyncSession,
            game_id: int,
    ) -> List[GameTurn]:
        result = await session.execute(
            select(GameTurn).where(GameTurn.game_id == game_id).where(
                or_(
                    GameTurn.status == TurnStatusEnum.waiting_for_answers,
                    GameTurn.status == TurnStatusEnum.answered,
                    GameTurn.status == TurnStatusEnum.confirmed,
                )
            )
            .order_by(GameTurn.index)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_current_turn_by_status(
            session: AsyncSession, game_id: int, status: TurnStatusEnum
    ) -> Optional[GameTurn]:
        """Найти ход для игры в определенном статусе. Предполагается, что такой ход только один."""
        result = await session.execute(
            select(GameTurn)
            .where(GameTurn.game_id == game_id)
            .where(GameTurn.status == status)
            .order_by(GameTurn.index)
            .limit(1)
            .with_for_update(of=GameTurn)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def count_turns_in_game(
            session: AsyncSession,
            game_id: int,
    ) -> int:
        result = await session.execute(
            select(func.count(GameTurn.id)).where(GameTurn.game_id == game_id)
        )
        return result.scalar_one()

    @staticmethod
    async def get_by_index_and_game(
            session: AsyncSession,
            game_id: int,
            index: int,
    ) -> Optional[GameTurn]:
        result = await session.execute(
            select(GameTurn)
            .where(GameTurn.game_id == game_id)
            .where(GameTurn.index == index)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def list_years_by_game_for_generating(
            session: AsyncSession,
            game_id: int,
    ) -> List[int]:
        result = await session.execute(
            select(GameTurn.year)
            .where(GameTurn.game_id == game_id)
            .order_by(GameTurn.year)
        )
        years = result.scalars().all()
        return list(years)