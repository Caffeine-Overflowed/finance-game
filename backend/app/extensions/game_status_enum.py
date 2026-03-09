from enum import Enum


class GameStatusEnum(Enum):
    in_lobby = "in_lobby"
    in_progress = "in_progress"
    generating_results = "generating_results"
    ended = "ended"
