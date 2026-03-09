from dataclasses import dataclass
from typing import Optional

from app.extensions.oauth_provider import OAuthProvider


@dataclass
class UserInfo:
    """Информация о пользователе от OAuth провайдера"""
    email: str
    oauth_id: str
    provider: OAuthProvider
    name: Optional[str] = None
    avatar_url: Optional[str] = None
