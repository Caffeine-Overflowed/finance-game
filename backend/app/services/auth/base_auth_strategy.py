from abc import ABC, abstractmethod
from typing import Dict, Any

from ...extensions.auth_state import AuthState
from ...extensions.user_info import UserInfo


class BaseAuthStrategy(ABC):
    """Базовый класс для стратегий OAuth аутентификации"""

    @staticmethod
    @abstractmethod
    async def get_authorization_url(redirect_uri: str) -> tuple[str, str]:
        """
        Получить URL для авторизации и state
        Returns: (authorization_url, state)
        """
        pass

    @staticmethod
    @abstractmethod
    async def get_user_info(code: str, state_data: AuthState) -> UserInfo:
        """
        Получить информацию о пользователе по коду авторизации
        """
        pass
