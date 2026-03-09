import strawberry

from app.extensions.turn_status_enum import TurnStatusEnum
from app.models import GameTurn


@strawberry.type
class GameTurnType:
    id: int
    status: TurnStatusEnum
    year: int
    index: int
    count_confirmed: int
    has_confirmed: bool

    @classmethod
    def from_model(cls, turn: GameTurn, participation_id: int):
        """Создать GameTurnType из модели GameTurn"""
        return cls(
            id=turn.id,
            status=turn.status,
            year=turn.year,
            index=turn.index,
            count_confirmed=len(turn.confirmed_by),
            has_confirmed=participation_id in turn.confirmed_by
        )
