import os

from ..utils.config_loader import ConfigLoader

ConfigLoader.import_env()


class Config:
    """
    Конфигурация приложения, загружаемая из переменных окружения.
    Атрибуты доступны напрямую без создания экземпляра класса.
    """
    # Настройки базы данных
    DATABASE_USERNAME = os.getenv("DATABASE_USERNAME")
    DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
    DATABASE_HOST = os.getenv("DATABASE_HOST")
    DATABASE_PORT = os.getenv("DATABASE_PORT")
    DATABASE_NAME = os.getenv("DATABASE_NAME")
    DATABASE_URL = (f"postgresql+asyncpg://{DATABASE_USERNAME}:{DATABASE_PASSWORD}"
                    f"@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}")

    REDIS_HOST = os.getenv("REDIS_HOST")
    REDIS_PORT = os.getenv("REDIS_PORT")

    # Настройки приложения
    APP_NAME = os.getenv("APP_NAME")
    APP_SECRET_KEY = os.getenv("APP_SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")