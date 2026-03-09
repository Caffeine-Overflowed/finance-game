from typing import List
import strawberry
from app.graphql.context import Context
from app.graphql.extensions.permissions import IsParticipantAuthenticated
from app.graphql.types.game_question_type import GameQuestionType
from app.services.game_question_service import GameQuestionService
from app.utils.database import Database

@strawberry.type
class GameQuestionQueries:
    @strawberry.field(
        description="Get current questions for the participant.",
        permission_classes=[IsParticipantAuthenticated]
    )
    async def current_game_questions(self, info: strawberry.Info[Context], game_id: int) -> List[GameQuestionType]:
        async with Database.get_session() as session:
            return await GameQuestionService.get_current_questions(
                session=session,
                game_id=game_id,
                participant_session_id=info.context.participant_session_id
            )