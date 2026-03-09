from sqlalchemy.ext.asyncio import AsyncSession

from app.graphql.types.game_turn_type import GameTurnType
from app.repositories.game_participation_repository import GameParticipationRepository
from app.repositories.game_turn_repository import GameTurnRepository
from app.utils.graphql_utils import MessageException
from app.extensions.turn_status_enum import TurnStatusEnum


class GameTurnService:
    @staticmethod
    async def confirm_turn(session: AsyncSession, game_id, participant_session_id: str) -> GameTurnType:
        """
        Confirm turn by player.
        If all players have confirmed, turn status changes to 'confirmed'.
        """

        turn = await GameTurnRepository.get_current_turn_by_status(session, game_id, TurnStatusEnum.answered)
        if not turn:
            raise MessageException("Turn not found")

        # Проверка: можно подтверждать только ход, ожидающий подтверждения (например, answered)
        if turn.status != TurnStatusEnum.answered:
            raise MessageException(f"Cannot confirm turn with status '{turn.status.value}'")

        # Убедимся, что участник состоит в этой игре
        participant = await GameParticipationRepository.get_by_session_id(session, turn.game_id, participant_session_id)
        if not participant:
            raise MessageException("You are not a participant of this game")

        if participant.id in turn.confirmed_by:
            raise MessageException(f"Already confirmed that turn from participant '{participant_session_id}'")


        new_confirmed_by = turn.confirmed_by + [participant.id]
        turn.confirmed_by = new_confirmed_by

        total_participants = await GameParticipationRepository.count_by_game(session, turn.game_id)

        if len(turn.confirmed_by) >= total_participants: # noqa:
            turn.status = TurnStatusEnum.confirmed

        return GameTurnType.from_model(turn, participant.id)