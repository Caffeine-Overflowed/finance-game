import strawberry

from ..types.auth_type import AuthenticateType
from ...utils.database import Database
from app.services.auth.auth_service import AuthService
from ..types.user_type import UserType
from ..inputs.auth_inputs import RegisterInput, OAuthUrlInput, OAuthInput


@strawberry.type
class AuthMutations:
    """Мутации для аутентификации (тонкий контроллер)"""

    @strawberry.mutation(description="Регистрация нового пользователя")
    async def register(self, data: RegisterInput) -> AuthenticateType:
        async with Database.get_session() as session:
            return await AuthService.register_user(
                session=session,
                email=data.email,
                password=data.password
            )

    @strawberry.mutation(description="Получить URL для OAuth авторизации")
    async def create_oauth_url(self, data: OAuthUrlInput) -> str:
        """Получение OAuth URL для авторизации"""

        return await AuthService.get_oauth_authorization_url(
            provider=data.provider,
            redirect_uri=data.redirect_uri
        )

    @strawberry.mutation(description="Вход через OAuth")
    async def oauth_authenticate(self, data: OAuthInput) -> AuthenticateType:
        """Логин/регистрация через OAuth"""

        async with Database.get_session() as session:
            return await AuthService.oauth_authenticate(
                session=session,
                code=data.code,
                state=data.state
            )
