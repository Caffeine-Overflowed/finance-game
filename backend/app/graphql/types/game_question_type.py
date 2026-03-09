from typing import List
import strawberry

from app.graphql.types.game_choice_type import GameChoiceType
from app.models import GameQuestion


@strawberry.type
class GameQuestionType:
    """Тип вопроса для GraphQL"""
    id: int
    title: str
    choices: List[GameChoiceType]
    answered: bool
    @classmethod
    def from_model(cls, question: GameQuestion):

        is_answered = any(choice.chosen for choice in question.choices)
        """Создать GameQuestionType из модели GameQuestion"""
        return cls(
            id=question.id,
            title=question.title,
            choices=[GameChoiceType.from_model(c) for c in question.choices],
            answered=is_answered
        )
