import strawberry

from app.models import GameParticipation


@strawberry.type
class GameParticipationType:
    """Тип участника игры для GraphQL"""
    id: int
    name: str
    leader: bool
    self: bool

    @classmethod
    def from_model(cls, participation: GameParticipation, self: bool) -> "GameParticipationType":
        """Создать GameParticipationType из модели GameParticipation"""
        return cls(
            id=participation.id,
            name=participation.name,
            leader=participation.leader,
            self=self
        )