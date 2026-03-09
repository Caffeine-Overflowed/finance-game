import strawberry

from app.graphql.context import Context
from app.graphql.extensions.permissions import IsParticipantAuthenticated
from app.graphql.types.game_choice_type import GameChoiceType
from app.services.game_choice_service import GameChoiceService
from app.utils.database import Database


@strawberry.type
class GameChoiceMutations:
    @strawberry.mutation(
        description="Make a choice for the current question",
        permission_classes=[IsParticipantAuthenticated]
    )
    async def choose_option(
            self,
            choice_id: int
    ) -> GameChoiceType:
        async with Database.get_session() as session:
            return await GameChoiceService.choose_option(
                session=session,
                choice_id=choice_id,
            )
