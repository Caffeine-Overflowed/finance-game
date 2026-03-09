from starlette.requests import Request

from . import Context


def context_getter(request: Request) -> Context:
    user = request.state.user  # Предположим, вы уже установили пользователя в состоянии
    ip = request.state.ip
    trace_id = request.state.trace_id
    participant_session_id = request.state.participant_session_id
    return Context(user=user, request=request, ip=ip, trace_id=trace_id, participant_session_id=participant_session_id)
