from typing import List, Dict, Any, Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import GameResult


class GameResultRepository:
    @staticmethod
    async def list_by_game_id(
            session: AsyncSession,
            game_id: int,
            link_participation: bool = False
    ) -> List[GameResult]:
        q = select(GameResult).where(GameResult.game_id == game_id).order_by(GameResult.score.desc())
        if link_participation:
            q = q.options(selectinload(GameResult.participation))
        result = await session.execute(q)
        return list(result.scalars().all())

    @staticmethod
    async def create_result(
            session: AsyncSession,
            game_id: int,
            participation_id: int,
            score: int,
            description: str,
            additional_results: Optional[List[Dict[str, Any]]] = None
    ) -> GameResult:
        result = GameResult(
            game_id=game_id,
            participation_id=participation_id,
            score=score,
            description=description,
            additional_results=additional_results,
        )
        session.add(result)
        await session.flush()
        return result

    @staticmethod
    async def count_by_game_id(
            session: AsyncSession,
            game_id: int
    ) -> int:
        q = select(func.count(GameResult.id)).where(GameResult.game_id == game_id)
        result = await session.execute(q)
        return result.scalar_one()
