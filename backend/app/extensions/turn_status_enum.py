from enum import Enum


class TurnStatusEnum(Enum):
    not_started = "not_started"
    generating = "generating"
    waiting_for_answers = "waiting_for_answers"
    answered = "answered"
    confirmed = "confirmed"
