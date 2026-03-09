from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Game


class GameRepository:
    @staticmethod
    async def get(
            session: AsyncSession,
            game_id: int,
            link_setting: bool = False,
            link_turns: bool = False,
            link_participations: bool = False,
    ) -> Optional[Game]:
        q = select(Game).where(Game.id == game_id)

        if link_setting:
            q = q.options(selectinload(Game.setting))
        if link_turns:
            q = q.options(selectinload(Game.turns))
        if link_participations:
            q = q.options(selectinload(Game.participations))

        result = await session.execute(q)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_code(
            session: AsyncSession,
            game_code: str,
            link_turns: bool = False
    ) -> Optional[Game]:
        """Получить игру по её уникальному коду."""
        q = select(Game).where(Game.code == game_code)

        if link_turns:
            q = q.options(selectinload(Game.turns))

        result = await session.execute(q)
        return result.scalar_one_or_none()

    @staticmethod
    async def create_game(session: AsyncSession, game_setting_id: int) -> Game:
        """Create a new game"""
        game = Game(game_setting_id=game_setting_id)
        session.add(game)
        await session.flush()
        await session.refresh(game)
        return game
