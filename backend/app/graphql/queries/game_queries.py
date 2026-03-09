from typing import List

import strawberry

from app.graphql.context import Context
from app.graphql.extensions.permissions import IsParticipantAuthenticated
from app.graphql.types.game_chosen_choice_type import GameChosenChoiceType
from app.graphql.types.game_participation_type import GameParticipationType
from app.graphql.types.game_type import GameStateType
from app.graphql.types.game_question_type import GameQuestionType
from app.services.game_service import GameService
from app.utils.database import Database


@strawberry.type
class GameQueries:
    """Запросы для игр"""
    @strawberry.field(
        description="Get the current state of the game. Polled while game.status = in_progress, and getting on refresh",
        permission_classes=[IsParticipantAuthenticated]
    )
    async def game_state(
            self,
            info: strawberry.Info[Context],
            game_id: int
    ) -> GameStateType:
        """Получить текущее состояние игры"""
        async with Database.get_session() as session:
            return await GameService.get_game_state(
                session=session,
                game_id=game_id,
                participant_session_id=info.context.participant_session_id
            )
    @strawberry.field(
        description="Get game state by game code. Allows access to lobby for non-participants.",
        permission_classes=[IsParticipantAuthenticated] # <-- Все равно нужна сессия, чтобы понять, участник он или нет
    )
    async def game_state_by_code(self, info: strawberry.Info[Context], game_code: str) -> GameStateType:
        """Получить состояние игры по коду. Позволяет зайти в лобби не-участникам."""
        async with Database.get_session() as session:
            return await GameService.get_game_state_by_code(
                session=session,
                game_code=game_code,
                participant_session_id=info.context.participant_session_id
            )