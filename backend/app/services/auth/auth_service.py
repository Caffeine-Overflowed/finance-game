from sqlalchemy.ext.asyncio import AsyncSession

from app.graphql.types.user_type import UserType
from app.graphql.types.auth_type import AuthenticateType
from app.repositories.user_repository import UserRepository
from app.services.auth.google_auth_strategy import GoogleAuthStrategy
from app.services.redis_service import RedisService
from app.extensions.oauth_provider import OAuthProvider
from app.extensions.auth_state import AuthState
from app.utils.auth import AuthUtils
from app.utils.graphql_utils import MessageException
from app.utils.logging import StructuredLogger


class AuthService:
    """Сервис для бизнес-логики аутентификации"""

    # Маппинг провайдеров на стратегии
    OAUTH_STRATEGIES = {
        OAuthProvider.GOOGLE: GoogleAuthStrategy
    }

    @staticmethod
    async def register_user(session: AsyncSession, email: str, password: str) -> AuthenticateType:
        """Регистрация нового пользователя"""

        existing_user = await UserRepository.find_by_email(session, email)
        if existing_user:
            StructuredLogger.warning("auth.register.user_exists", email=email)
            raise MessageException("This email is already associated with an account.")

        password_hash = AuthUtils.hash_password(password)

        # Создаем пользователя
        user = await UserRepository.create_user(
            session=session,
            email=email,
            password_hash=password_hash
        )

        # Генерируем токен
        access_token = AuthUtils.create_token(user.id)

        StructuredLogger.info("auth.register.success", user_id=user.id, email=email)
        return AuthenticateType(
            user=UserType.from_model(user),
            access_token=access_token
        )

    @staticmethod
    async def login_user(session: AsyncSession, email: str, password: str) -> AuthenticateType:
        """Аутентификация пользователя по email и паролю"""

        user = await UserRepository.find_by_email(session, email)
        if not user or not user.password_hash:
            StructuredLogger.warning("auth.login.user_not_found", email=email)
            raise MessageException("Invalid email or password.")

        if not await AuthUtils.verify_password(password, user.password_hash):
            StructuredLogger.warning("auth.login.invalid_password", email=email)
            raise MessageException("Invalid email or password.")

        access_token = AuthUtils.create_token(user.id)

        StructuredLogger.info("auth.login.success", user_id=user.id, email=email)
        return AuthenticateType(
            user=UserType.from_model(user),
            access_token=access_token
        )

    @staticmethod
    async def get_oauth_authorization_url(provider: OAuthProvider, redirect_uri: str) -> str:
        """
        Получить URL для OAuth авторизации
        Returns: (url, state, error)
        """

        strategy_class = AuthService._get_oauth_strategy(provider)
        if not strategy_class:
            raise MessageException("Invalid oauth provider.")

        authorization_url, state = await strategy_class.get_authorization_url(redirect_uri)

        auth_state = AuthState(redirect_uri=redirect_uri, provider=provider)
        await RedisService.set_auth_state(state, auth_state)

        StructuredLogger.info("oauth.url_generated", provider=provider, state=state[:8])
        return authorization_url

    @staticmethod
    async def oauth_authenticate(
            session: AsyncSession,
            code: str,
            state: str
    ) -> AuthenticateType:
        """OAuth аутентификация"""

        state_data = await RedisService.get_auth_state(state)
        if not state_data:
            StructuredLogger.warning("oauth.invalid_state", state=state[:8])
            raise MessageException("Invalid session, please try again.")

        # Получаем стратегию
        strategy_class = AuthService._get_oauth_strategy(state_data.provider)

        # Получаем информацию о пользователе
        user_info = await strategy_class.get_user_info(code, state_data)

        # Ищем существующего пользователя
        user = await UserRepository.find_by_oauth_or_email(
            session=session,
            provider=user_info.provider,
            oauth_id=user_info.oauth_id,
            email=user_info.email
        )

        if user:
            if not user.oauth_provider:
                user = await UserRepository.update_oauth_info(
                    session=session,
                    user=user,
                    provider=user_info.provider,
                    oauth_id=user_info.oauth_id
                )
                StructuredLogger.info("oauth.user_updated", user_id=user.id, provider=state_data.provider)
        else:
            # Создаем нового пользователя
            user = await UserRepository.create_user(
                session=session,
                email=user_info.email,
                oauth_provider=user_info.provider,
                oauth_id=user_info.oauth_id
            )
            StructuredLogger.info("oauth.user_created", user_id=user.id, provider=state_data.provider)

        access_token = AuthUtils.create_token(user.id)

        return AuthenticateType(
            user=UserType.from_model(user),
            access_token=access_token
        )

    @staticmethod
    def _get_oauth_strategy(provider_name: OAuthProvider):
        """Получить стратегию OAuth по провайдеру"""
        return AuthService.OAUTH_STRATEGIES.get(provider_name)
