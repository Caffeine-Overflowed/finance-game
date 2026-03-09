from typing import Optional

from starlette.requests import Request
from strawberry.fastapi import BaseContext

from ...graphql.context.user_context import UserContext


class Context(BaseContext):
    """ Request GraphQL context """

    request: Request
    user: Optional[UserContext]
    ip: str
    trace_id: str
    participant_session_id: Optional[str]

    def __init__(
            self,
            request, ip: str,
            trace_id: str,
            user: Optional[UserContext],
            participant_session_id: Optional[str]
    ):
        super().__init__()
        self.request = request
        self.user = user
        self.ip = ip
        self.trace_id = trace_id
        self.participant_session_id = participant_session_id
