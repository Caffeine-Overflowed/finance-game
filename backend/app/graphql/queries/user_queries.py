from typing import Optional

import strawberry
from strawberry import Info

from app.graphql.context import Context
from app.graphql.extensions.permissions import IsAuthenticated
from app.graphql.types.user_type import UserType
from app.services.user_service import UserService
from app.utils.database import Database


class UserQueries:
    @strawberry.field(description="Get self profile", permission_classes=[IsAuthenticated])
    async def me(
            self,
            info: Info[Context],
    ) -> UserType:
        context: Context = info.context
        user_id = context.user.sub

        async with Database.get_session() as session:
            return await UserService.get_me(session, user_id)
