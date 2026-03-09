import strawberry

from app.graphql.context import Context
from app.graphql.extensions.permissions import IsParticipantAuthenticated
from app.graphql.types.game_turn_type import GameTurnType
from app.services.game_turn_service import GameTurnService
from app.utils.database import Database


@strawberry.type
class GameTurnMutations:
    """Game turn mutations"""

    @strawberry.mutation(
        description="Confirm the turn has been viewed by the participant.",
        permission_classes=[IsParticipantAuthenticated]
    )
    async def confirm_turn(
            self,
            info: strawberry.Info[Context],
            game_id: int
    ) -> GameTurnType:
        """Подтвердить ход. Когда все участники подтвердят, статус хода изменится."""
        async with Database.get_session() as session:
            return await GameTurnService.confirm_turn(
                session=session,
                game_id=game_id,
                participant_session_id=info.context.participant_session_id
            )
