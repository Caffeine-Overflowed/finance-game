from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import GameSetting


class GameSettingRepository:
    @staticmethod
    async def get_random_setting(session: AsyncSession) -> Optional[GameSetting]:
        """Получить случайные настройки игры"""
        result = await session.execute(
            select(GameSetting).order_by(func.random()).limit(1)
        )
        return result.scalar_one_or_none()
