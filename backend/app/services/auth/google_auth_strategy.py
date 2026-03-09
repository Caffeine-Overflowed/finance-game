import base64
import json
from typing import Dict, Any
from authlib.common.urls import url_decode
from authlib.integrations.base_client import OAuthError
from authlib.integrations.httpx_client import AsyncOAuth2Client
from authlib.oauth2.rfc6749 import OAuth2Token

from .base_auth_strategy import BaseAuthStrategy
from ...config.config import Config
from ...extensions.auth_state import AuthState
from ...extensions.user_info import UserInfo
from ...extensions.oauth_provider import OAuthProvider
from ...utils.logging import StructuredLogger


class GoogleAuthStrategy(BaseAuthStrategy):
    """Стратегия авторизации через Google OAuth2"""

    AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/auth"
    TOKEN_URL = "https://oauth2.googleapis.com/token"
    USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

    SCOPES = ["openid", "email", "profile"]

    @staticmethod
    async def get_authorization_url(redirect_uri: str) -> tuple[str, str]:
        """Создает URL для авторизации через Google"""

        client = GoogleAuthStrategy._create_client()
        authorization_url, state = client.create_authorization_url(
            "https://accounts.google.com/o/oauth2/auth",
            redirect_uri=redirect_uri,
        )

        StructuredLogger.info(
            "oauth.google.authorization_url_created",
            state=state,
            redirect_uri=redirect_uri,
            authorization_url=authorization_url
        )

        return authorization_url, state

    @staticmethod
    def _decode_jwt_payload(token: str) -> Dict[str, Any]:
        """Декодирует payload из JWT токена"""
        try:
            payload_b64 = token.split('.')[1]
            # Добавляем padding для base64url
            padding = '=' * (-len(payload_b64) % 4)
            payload_bytes = base64.urlsafe_b64decode(payload_b64 + padding)
            return json.loads(payload_bytes)
        except (ValueError, json.JSONDecodeError) as e:
            StructuredLogger.error("oauth.google.jwt_decode_error", error=str(e))
            raise ValueError("Ошибка декодирования JWT токена")

    @staticmethod
    def _create_client(token: OAuth2Token = None) -> AsyncOAuth2Client:
        """Создаёт OAuth2-клиент с токеном (если есть)"""
        return AsyncOAuth2Client(
            client_id=Config.GOOGLE_CLIENT_ID,
            client_secret=Config.GOOGLE_CLIENT_SECRET,
            token=token,
            scope=["openid", "email", "profile"]
        )

    @staticmethod
    async def _fetch_token(code: str, redirect_uri: str) -> OAuth2Token:
        """Обменивает `code` на `access_token`"""
        code = url_decode(code)[0][0]
        async with GoogleAuthStrategy._create_client() as client:
            token = await client.fetch_token(
                "https://oauth2.googleapis.com/token",
                code=code,
                redirect_uri=redirect_uri
            )
        StructuredLogger.debug(
            "auth.google.token_fetched"
        )

        return token

    @staticmethod
    async def get_user_info(code: str, state_data: AuthState) -> UserInfo:
        """Получает токен и информацию о пользователе"""
        try:
            token = await GoogleAuthStrategy._fetch_token(code, state_data.redirect_uri)
        except OAuthError as e:
            StructuredLogger.warning(
                "auth.google.token_fetch_error",
                error=str(e),
            )
            raise ValueError("Ошибка авторизации")

        id_token = token.get("id_token")
        if not id_token:
            StructuredLogger.error(
                "auth.google.id_token_missing",
                data=token
            )
            raise ValueError("Ошибка авторизации")

        claims = GoogleAuthStrategy._decode_jwt_payload(id_token)

        StructuredLogger.debug(
            "auth.google.claims_decoded",
            google_id=claims["sub"],
            email=claims["email"],
        )

        user_name = (
                claims.get("name")
                or " ".join(part for part in [claims.get("given_name"), claims.get("family_name")] if part)
                or None
        )

        return UserInfo(
            oauth_id=claims["sub"],
            email=claims["email"],
            avatar_url=claims.get("picture"),
            name=user_name,
            provider=OAuthProvider.GOOGLE
        )
