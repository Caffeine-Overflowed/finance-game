from contextlib import asynccontextmanager

from .database import Database
from .logging import StructuredLogger
from ..services import RedisService


@asynccontextmanager
async def lifespan(_):
    StructuredLogger.setup()
    try:
        await Database.init()
        await Database.test_connection()
        await RedisService.init() # Отключен в шаблоне по умолчанию
        yield
    except Exception as e:
        StructuredLogger.exception("init.error", error=str(e))
        raise e
    finally:
        await Database.close()
        await RedisService.close() # Отключен в шаблоне по умолчанию
