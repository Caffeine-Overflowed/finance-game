import strawberry

from app.graphql.types.user_type import UserType


@strawberry.type
class AuthenticateType:
    """Ответ при аутентификации"""

    user: UserType
    access_token: str
