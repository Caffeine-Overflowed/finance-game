import typing

from strawberry import BasePermission, Info

from ..context import UserContext
from ...extensions.graphql_error_code import GraphqlErrorCode
from ...utils.logging import StructuredLogger


class IsAuthenticated(BasePermission):
    message = "User is not authenticated"
    error_extensions = {"code": GraphqlErrorCode.UNAUTHORIZED}

    async def has_permission(self, source: typing.Any, info: Info, **kwargs) -> bool:
        user: UserContext = info.context.user
        if not user:
            StructuredLogger.warning("auth.no_user_context")
            return False

        StructuredLogger.debug(
            "auth.user_context_exists",
            user_id=user.sub
        )
        return True


class IsParticipantAuthenticated(BasePermission):
    message = "Participant is not authenticated, please try refreshing the page"
    error_extensions = {"code": GraphqlErrorCode.PARTICIPANT_UNAUTHORIZED}

    async def has_permission(self, source: typing.Any, info: Info, **kwargs) -> bool:
        session_id = info.context.participant_session_id
        if not session_id:
            StructuredLogger.warning("participant.auth.no_session_id_context")
            return False

        StructuredLogger.debug(
            "participant.auth.session_id_context_exists",
            participant_session_id=session_id
        )
        return True
