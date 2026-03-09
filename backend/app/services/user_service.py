from sqlalchemy.ext.asyncio import AsyncSession

from app.graphql.types.user_type import UserType
from app.repositories.user_repository import UserRepository


class UserService:
    @staticmethod
    async def get_me(session: AsyncSession, user_id: int) -> UserType:
        """Получить информацию о текущем пользователе по ID"""
        result = await UserRepository.get(session, user_id)
        return UserType.from_model(result)
