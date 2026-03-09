import hashlib
from typing import Optional
from redis.asyncio import Redis

from ..config.config import Config
from ..extensions.auth_state import AuthState
from ..utils.logging import StructuredLogger


class RedisService:
    _redis: Redis = None
    auth_state_prefix = "auth_state:"

    @classmethod
    async def init(cls):
        """Инициализация пула соединений с Redis."""
        cls._redis = Redis(
            host=Config.REDIS_HOST,
            port=Config.REDIS_PORT,
            decode_responses=True,
            max_connections=20
        )
        try:
            if await cls._redis.ping():
                StructuredLogger.debug("redis.connected")
        except Exception as e:
            StructuredLogger.exception("redis.connection_error", error=str(e))
            raise e

    @classmethod
    async def close(cls):
        """Закрытие соединения с Redis."""
        if cls._redis:
            await cls._redis.close()
            StructuredLogger.info("redis.closed")

    @classmethod
    async def set_auth_state(cls, state: str, value: AuthState):
        """Сохранить состояние OAuth авторизации"""
        if not cls._redis:
            await cls.init()
            
        hashed_state = hashlib.sha256(state.encode()).hexdigest()
        key = cls.auth_state_prefix + hashed_state
        await cls._redis.set(key, value.model_dump_json(), ex=600)
        
        StructuredLogger.debug("redis.auth_state.set", state_hash=hashed_state[:8])

    @classmethod
    async def get_auth_state(cls, state: str) -> Optional[AuthState]:
        """Получить состояние OAuth авторизации"""
        if not cls._redis:
            await cls.init()
            
        hashed_state = hashlib.sha256(state.encode()).hexdigest()
        key = cls.auth_state_prefix + hashed_state
        value = await cls._redis.get(key)
        
        if not value:
            StructuredLogger.warning("redis.auth_state.not_found", state_hash=hashed_state[:8])
            return None
        
        # Удаляем после использования (одноразовое состояние)
        await cls._redis.delete(key)
        
        StructuredLogger.debug("redis.auth_state.get", state_hash=hashed_state[:8])
        return AuthState.model_validate_json(value)
