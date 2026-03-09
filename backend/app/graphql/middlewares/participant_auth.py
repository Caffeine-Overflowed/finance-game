from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from ...utils.logging import StructuredLogger


class ParticipantAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        token = request.headers.get("ParticipantSessionId")

        if not token:
            StructuredLogger.warning("participant_auth.no_token")

        request.state.participant_session_id = token
        return await call_next(request)
