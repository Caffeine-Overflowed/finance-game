from contextlib import asynccontextmanager
from typing import AsyncGenerator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from .logging import StructuredLogger
from ..config.config import Config


class Base(DeclarativeBase):
    """Базовый класс для всех моделей"""
    pass


class Database:
    _engine: AsyncEngine = None
    _SessionLocal: async_sessionmaker = None  # Теперь pool соединений работает правильно

    @classmethod
    async def init(cls):
        """
        Инициализирует базу данных, создавая движок и фабрику сессий.
        """
        if cls._engine is None:
            cls._engine = create_async_engine(
                Config.DATABASE_URL,
                echo=False,
                future=True,
                pool_size=20,  # минимальное число соединений в пуле
                max_overflow=10,  # дополнительные соединения сверх pool_size, если нужно
                pool_timeout=10,  # время ожидания получения соединения (в секундах)
                pool_use_lifo=True,
            )
            cls._SessionLocal = async_sessionmaker(bind=cls._engine, class_=AsyncSession, expire_on_commit=True)
            StructuredLogger.info("database_initialized")

    @classmethod
    @asynccontextmanager
    async def get_session(cls) -> AsyncGenerator[AsyncSession, None]:
        """
        Создает и возвращает асинхронную сессию SQLAlchemy.
        """
        if cls._SessionLocal is None:
            raise RuntimeError("Database is not initialized. Call Database.init() first.")

        async with cls._SessionLocal() as session:
            StructuredLogger.info("session_created")
            async with session.begin():
                yield session  # Сессия создается здесь

    @classmethod
    async def close(cls):
        """
        Закрывает соединение с базой данных.
        """
        if cls._engine:
            await cls._engine.dispose()

    @classmethod
    async def test_connection(cls) -> bool:
        """
        Тестирует соединение с базой данных.
        """
        try:
            async with cls.get_session() as session:
                await session.execute(text("SELECT 1"))
            StructuredLogger.info("database_connection_successful")
            return True
        except Exception as e:
            StructuredLogger.exception("database_connection_failed", error=str(e))
            return False
