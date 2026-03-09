from datetime import datetime, timedelta, UTC
from typing import Optional

import bcrypt
from authlib.jose import errors, jwt

from ..config.config import Config
from ..graphql.context.user_context import UserContext
from ..utils.logging import StructuredLogger  # Новый логгер


class AuthUtils:
    """Класс для работы с аутентификацией пользователей."""

    @staticmethod
    def create_token(user_id: int) -> str:
        """Создать токен для пользователя."""
        now = datetime.now(UTC)
        exp = (now + timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES)).timestamp()
        iat = (now - timedelta(minutes=1)).timestamp()
        claims = {
            "sub": user_id,
            "exp": exp,
            "iss": Config.APP_NAME,
            "iat": iat
        }

        token: bytes = jwt.encode(
            {"alg": "HS256"},
            claims,
            Config.APP_SECRET_KEY
        )

        StructuredLogger.debug(
            "auth.create_token.success",
            user_id=user_id,
            expires_at=datetime.fromtimestamp(claims["exp"]).isoformat()
        )

        return token.decode("utf-8")

    @staticmethod
    def decode_token(token: str) -> Optional[UserContext]:
        """Декодировать токен и получить информацию о пользователе."""
        try:
            decoded_token = jwt.decode(token, key=Config.APP_SECRET_KEY, claims_options={
                "exp": {"required": True},
                "iss": {"required": True},
                "sub": {"required": True},
                "iat": {"required": True},
            })
            decoded_token.validate()

            # Проверяем issuer
            if decoded_token.get("iss") != Config.APP_NAME:
                StructuredLogger.error(
                    "auth.decode_token.invalid_iss",
                    expected_iss=Config.APP_NAME,
                    received_iss=decoded_token.get("iss")
                )
                return None

            StructuredLogger.debug(
                "auth.decode_token.success",
                user_id=decoded_token["sub"]
            )

            return UserContext.model_validate(decoded_token)

        except errors.ExpiredTokenError:
            StructuredLogger.warning("auth.decode_token.expired")
            return None

        except errors.DecodeError as e:
            StructuredLogger.warning("auth.decode_token.decode_error", error=e)
            return None
        except errors.BadSignatureError as e:
            StructuredLogger.warning("auth.decode_token.bad_signature", error=str(e))
            return None

        except Exception as e:
            StructuredLogger.exception("auth.decode_token.unexpected_error", error=str(e))
            return None

    @staticmethod
    def get_user_from_token(token: str) -> Optional[UserContext]:
        """Получить информацию о пользователе из токена."""
        return AuthUtils.decode_token(token)

    @staticmethod
    async def verify_password(
            password: str,
            hashed_password: str
    ) -> bool:
        """Проверить пароль пользователя."""

        try:
            is_valid = bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
            StructuredLogger.debug(
                "auth.password_verification.result",
                result="success" if is_valid else "failure"
            )
            return is_valid
        except Exception as e:
            StructuredLogger.exception("auth.password_verification.unexpected_error", error=e)
            return False

    @staticmethod
    def hash_password(password: str) -> str:
        """Хеширование пароля"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
