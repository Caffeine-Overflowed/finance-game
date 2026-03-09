from typing import List
import strawberry
from app.graphql.context import Context
from app.graphql.extensions.permissions import IsParticipantAuthenticated
from app.graphql.types.game_participation_type import GameParticipationType
from app.services.game_participation_service import GameParticipationService
from app.utils.database import Database

@strawberry.type
class GameParticipationQueries:
    @strawberry.field(
        description="Get a sorted list of participants for a game in lobby.",
        permission_classes=[IsParticipantAuthenticated]
    )
    async def game_participants(self, info: strawberry.Info[Context], game_id: int) -> List[GameParticipationType]:
        async with Database.get_session() as session:
            return await GameParticipationService.get_game_participants(
                session=session, game_id=game_id, participation_session_id=info.context.participant_session_id
            )