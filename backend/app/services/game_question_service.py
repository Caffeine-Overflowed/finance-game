from typing import List

from sqlalchemy.ext.asyncio import AsyncSession

from app.extensions.game_status_enum import GameStatusEnum
from app.extensions.turn_status_enum import TurnStatusEnum
from app.graphql.types.game_question_type import GameQuestionType
from app.repositories.game_participation_repository import GameParticipationRepository
from app.repositories.game_question_repository import GameQuestionRepository
from app.repositories.game_repository import GameRepository
from app.repositories.game_turn_repository import GameTurnRepository
from app.utils.graphql_utils import MessageException

class GameQuestionService:
    @staticmethod
    async def get_current_questions(
            session: AsyncSession, game_id: int, participant_session_id: str
    ) -> List[GameQuestionType]:
        """
        Получить список текущих вопросов для участника.
        Вызывается, когда ход переходит в статус waiting_for_answers.
        """
        game = await GameRepository.get(session, game_id)
        if not game:
            raise MessageException("Game not found")
        if game.status != GameStatusEnum.in_progress:
            raise MessageException("Game is not in progress")

        participation = await GameParticipationRepository.get_by_session_id(
            session, game_id, participant_session_id
        )
        if not participation:
            raise MessageException("Participant not found in this game")

        current_turn = await GameTurnRepository.get_current_turn_by_status(
            session, game_id, TurnStatusEnum.waiting_for_answers
        )
        if not current_turn:
            return []

        questions = await GameQuestionRepository.list_by_turn_and_participation(
            session, current_turn.id, participation.id
        )
        return [GameQuestionType.from_model(q) for q in questions]
