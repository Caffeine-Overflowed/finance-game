from typing import Optional
from pydantic import BaseModel

from app.extensions.oauth_provider import OAuthProvider


class AuthState(BaseModel):
    """Состояние OAuth авторизации"""
    redirect_uri: str
    provider: OAuthProvider
