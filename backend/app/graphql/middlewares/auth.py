from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from ...utils.auth import AuthUtils
from ...utils.logging import StructuredLogger


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")

        if not token:
            StructuredLogger.warning("auth.no_token")
            request.state.user = None
            return await call_next(request)

        user = AuthUtils.get_user_from_token(token)

        if user:
            StructuredLogger.debug(
                "auth.success",
                user_id=user.sub
            )
        else:
            StructuredLogger.warning("auth.failed")

        request.state.user = user
        return await call_next(request)
