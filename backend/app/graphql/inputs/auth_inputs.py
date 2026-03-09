from typing import Optional
import strawberry

from app.extensions.oauth_provider import OAuthProvider


@strawberry.input
class RegisterInput:
    """Входные данные для регистрации"""

    email: str
    password: str


@strawberry.input
class LoginInput:
    """Входные данные для логина"""

    email: str
    password: str


@strawberry.input(description="Input model for oauth login/register")
class OAuthInput:
    """Входные данные для OAuth аутентификации"""

    code: str = strawberry.field(description="Authorization code from OAuth provider")
    state: str = strawberry.field(description="State parameter from OAuth provider")


@strawberry.input
class OAuthUrlInput:
    """Входные данные для получения OAuth URL"""

    provider: OAuthProvider  # google, github, etc.
    redirect_uri: str
