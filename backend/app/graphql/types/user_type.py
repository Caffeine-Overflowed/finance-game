from datetime import datetime
from typing import Optional
import strawberry

from ...models.user import User


@strawberry.type
class UserType:
    """GraphQL тип пользователя"""
    
    id: int
    email: str
    created_at: datetime

    @classmethod
    def from_model(cls, user: User) -> "UserType":
        """Создает GraphQL тип из модели"""
        return cls(
            id=user.id,
            email=user.email,
            created_at=user.created_at,
        )



