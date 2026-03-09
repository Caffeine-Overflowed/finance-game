from typing import List
import strawberry
from app.graphql.context import Context
from app.graphql.extensions.permissions import IsParticipantAuthenticated
from app.graphql.types.game_chosen_choice_type import GameChosenChoiceType
from app.services.game_choice_service import GameChoiceService
from app.utils.database import Database

@strawberry.type
class GameChoiceQueries:
    @strawberry.field(
        description="Get chosen choices by all participants for the last completed turn.",
        permission_classes=[IsParticipantAuthenticated]
    )
    async def game_turn_choices(self, info: strawberry.Info[Context], game_id: int) -> List[GameChosenChoiceType]:
        async with Database.get_session() as session:
            return await GameChoiceService.get_turn_chosen_choices(
                session=session,
                game_id=game_id,
                participant_session_id=info.context.participant_session_id
            )