from typing import List, Optional
import strawberry

from app.graphql.types.game_participation_type import GameParticipationType
from app.models import GameResult


@strawberry.type
class AdditionalResultItemType:
    """Тип для дополнительной информации по периодам жизни"""
    id: int
    title: str
    description: str


@strawberry.type
class GameResultType:
    """Тип результата игры для GraphQL"""
    participant: GameParticipationType
    score: int
    description: str
    additional_results: Optional[List[AdditionalResultItemType]] = None

    @classmethod
    def from_model(cls, result: GameResult, participant_session_id: str) -> "GameResultType":
        """Создать GameResultType из модели результата"""
        # Конвертируем additional_results из JSON в GraphQL типы
        additional_results = None
        if result.additional_results:
            additional_results = [
                AdditionalResultItemType(
                    id=item["id"],
                    title=item["title"],
                    description=item["description"]
                )
                for item in result.additional_results
            ]
        
        return cls(
            participant=GameParticipationType.from_model(
                result.participation,
                self=result.participation.session_id == participant_session_id
            ),
            score=result.score,
            description=result.description,
            additional_results=additional_results,
        )
