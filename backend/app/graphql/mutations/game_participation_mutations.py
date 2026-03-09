import strawberry

from app.graphql.context import Context
from app.graphql.extensions.permissions import IsParticipantAuthenticated
from app.graphql.inputs.game_participation_inputs import JoinGameInput
from app.graphql.types.game_participation_type import GameParticipationType
from app.services.game_participation_service import GameParticipationService
from app.utils.database import Database


@strawberry.type
class GameParticipationMutations:
    @strawberry.mutation(
        description="Join a game (lobby)",
        permission_classes=[IsParticipantAuthenticated]
    )
    async def join_game(
            self,
            info: strawberry.Info[Context],
            data: JoinGameInput,
    ) -> GameParticipationType:
        """Присоединиться к игре (лобби)"""
        async with Database.get_session() as session:
            return await GameParticipationService.join_game(
                session=session,
                game_id=data.game_id,
                participation_name=data.participation_name,
                participant_session_id=info.context.participant_session_id
            )
