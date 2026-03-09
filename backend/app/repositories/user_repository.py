from typing import Optional
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from ..extensions.oauth_provider import OAuthProvider
from ..models.user import User


class UserRepository:
    """Репозиторий для работы с пользователями в БД"""

    @staticmethod
    async def create_user(
        session: AsyncSession, 
        email: str, 
        password_hash: Optional[str] = None,
        oauth_provider: Optional[OAuthProvider] = None,
        oauth_id: Optional[str] = None
    ) -> User:
        user = User(
            email=email,
            password_hash=password_hash,
            oauth_provider=oauth_provider,
            oauth_id=oauth_id
        )
        
        session.add(user)
        await session.flush()
        return user

    @staticmethod
    async def find_by_email(session: AsyncSession, email: str) -> Optional[User]:
        """Поиск пользователя по email"""
        result = await session.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get(session: AsyncSession, user_id: int) -> Optional[User]:
        """Поиск пользователя по ID"""
        result = await session.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def find_by_oauth_or_email(
        session: AsyncSession,
        provider: OAuthProvider,
        oauth_id: str,
        email: str
    ) -> Optional[User]:
        """Поиск пользователя по OAuth данным или email"""
        result = await session.execute(
            select(User).where(
                or_(
                    (User.oauth_provider == provider) & (User.oauth_id == oauth_id),
                    User.email == email
                )
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def update_oauth_info(
        session: AsyncSession,
        user: User,
        provider: OAuthProvider,
        oauth_id: str
    ) -> User:
        """Обновление OAuth информации пользователя"""
        user.oauth_provider = provider
        user.oauth_id = oauth_id
        await session.flush()
        return user