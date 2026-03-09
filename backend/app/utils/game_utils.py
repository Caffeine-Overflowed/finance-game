from typing import Optional

from app.extensions.turn_status_enum import TurnStatusEnum
from app.models import GameTurn


def get_current_turn_index(turns) -> int:
    if not turns:
        return 0

    # Активные ходы
    active_turns = [
        t for t in turns
        if t.status in (
            TurnStatusEnum.waiting_for_answers,
            TurnStatusEnum.generating,
            TurnStatusEnum.answered
        )
    ]
    if active_turns:
        return active_turns[0].index

    # Если есть not_started → первый
    not_started_turns = [t for t in turns if t.status == TurnStatusEnum.not_started]
    if not_started_turns:
        return not_started_turns[0].index

    # Иначе считаем, что все ended → последний
    return turns[-1].index
