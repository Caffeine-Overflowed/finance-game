from typing import List, Optional
from app.graphql.types.game_participation_type import  GameParticipationType
import strawberry

@strawberry.type
class GameChosenChoiceType:
    """Тип для представления выбранного варианта ответа участника по завершении хода"""
    participation: GameParticipationType
    title_for_everyone: str
    self: bool
    result: Optional[str]
    result_tags: List[str]