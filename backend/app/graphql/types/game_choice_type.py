import strawberry

from app.models import GameChoice


@strawberry.type
class GameChoiceType:
    """Тип варианта ответа для GraphQL"""
    id: int
    title: str
    chosen: bool

    @classmethod
    def from_model(cls, choice: GameChoice):
        """Создать GameChoiceType из модели GameChoice"""
        return cls(
            id=choice.id,
            title=choice.title,
            chosen=choice.chosen
        )