from typing import List

import strawberry

from app.graphql.context import Context
from app.graphql.extensions.permissions import IsParticipantAuthenticated
from app.graphql.types.game_result_type import GameResultType
from app.services.game_result_service import GameResultService
from app.utils.database import Database


@strawberry.type
class GameResultQueries:
    @strawberry.field(
        description="Result of a game for a participant after the game ends",
        permission_classes=[IsParticipantAuthenticated]
    )
    async def game_result(
            self,
            game_id: int,
            info: strawberry.Info[Context]
    ) -> List[GameResultType]:
        """Получить результат игры для участника после окончания игры"""

        async with Database.get_session() as session:
            return await GameResultService.get_game_results(
                session=session,
                game_id=game_id,
                participant_session_id=info.context.participant_session_id
            )
