from typing import List, Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.game_participation import GameParticipation


class GameParticipationRepository:
    """Repository for managing game participators in the database"""

    @staticmethod
    async def list_by_game(session: AsyncSession, game_id: int) -> List[GameParticipation]:
        """List all participators in a game"""

        result = await session.execute(
            select(GameParticipation).where(GameParticipation.game_id == game_id)
        )
        return list(result.scalars().all())

    @staticmethod
    async def create_participation(
            session: AsyncSession,
            game_id: int,
            name: str, session_id: str, leader: bool = False
    ) -> GameParticipation:
        """Create a game participator"""

        participation = GameParticipation(
            game_id=game_id, name=name, leader=leader, session_id=session_id
        )
        session.add(participation)
        await session.flush()
        return participation

    @staticmethod
    async def get(session: AsyncSession, participation_id: int) -> Optional[GameParticipation]:
        """Get a game participator by ID"""

        result = await session.execute(
            select(GameParticipation).where(GameParticipation.id == participation_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_session_id(session: AsyncSession, game_id: int, session_id: str) -> Optional[GameParticipation]:
        """Get a game participator by session ID"""

        result = await session.execute(
            select(GameParticipation).where(GameParticipation.session_id == session_id)
            .where(
                GameParticipation.game_id == game_id
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def count_by_game(session: AsyncSession, game_id: int) -> int:
        """Эффективно посчитать количество участников в игре."""
        result = await session.execute(
            select(func.count())
            .select_from(GameParticipation)
            .where(GameParticipation.game_id == game_id)
        )
        return result.scalar_one()
