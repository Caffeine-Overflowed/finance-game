import strawberry

from ..types.auth_type import AuthenticateType
from ...utils.database import Database
from app.services.auth.auth_service import AuthService


@strawberry.type
class AuthQueries:
    @strawberry.field(description="Login with credentials")
    async def login(
            self,
            email: str,
            password: str
    ) -> AuthenticateType:
        """Логин пользователя"""

        async with Database.get_session() as session:
            return await AuthService.login_user(
                session=session,
                email=email,
                password=password
            )
