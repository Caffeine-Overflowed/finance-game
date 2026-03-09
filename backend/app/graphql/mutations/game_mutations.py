import strawberry

from app.graphql.context import Context
from app.graphql.extensions.permissions import IsParticipantAuthenticated
from app.graphql.inputs.game_inputs import CreateGameInput
from app.graphql.types.game_type import GameType
from app.services.game_service import GameService
from app.utils.database import Database


@strawberry.type
class GameMutations:
    """Мутации для игр"""

    @strawberry.mutation(description="create a new game (lobby), set name to the leader", permission_classes=[IsParticipantAuthenticated])
    async def create_game(
            self,
            info: strawberry.Info[Context],
            data: CreateGameInput
    ) -> GameType:
        """Создать новую игру (лобби) и задать имя пользователя"""


        async with Database.get_session() as session:
            return await GameService.create_game(
                session=session,
                participant_session_id=info.context.participant_session_id,
                leader_name=data.leader_name
            )

    @strawberry.mutation(description="start a new game (lobby)", permission_classes=[IsParticipantAuthenticated])
    async def start_game(
            self,
            info: strawberry.Info[Context],
            game_id: int
    ) -> GameType:
        """Создать новую игру (лобби)"""
        async with Database.get_session() as session:
            return await GameService.start_game(
                session=session,
                session_id=info.context.participant_session_id,
                game_id=game_id
            )
