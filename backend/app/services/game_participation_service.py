from typing import List

from sqlalchemy.ext.asyncio import AsyncSession

from app.extensions.game_status_enum import GameStatusEnum
from app.extensions.graphql_error_code import GraphqlErrorCode
from app.graphql.types.game_participation_type import GameParticipationType
from app.repositories.game_participation_repository import GameParticipationRepository
from app.repositories.game_repository import GameRepository
from app.utils.graphql_utils import MessageException


class GameParticipationService:
    @staticmethod
    async def get_game_participants(session: AsyncSession, game_id: int, participation_session_id: str) -> List[GameParticipationType]:
        """
        Получить отсортированный список участников для игры в статусе "в лобби".
        Лидер игры всегда будет первым в списке.
        """
        game = await GameRepository.get(session, game_id)
        if not game:
            raise MessageException("Game not found")

        # Проверяем, что игра находится в лобби
        if game.status != GameStatusEnum.in_lobby:
            raise MessageException("Game is not in lobby status")

        participations = await GameParticipationRepository.list_by_game(session, game_id)

        # Сортируем: сначала лидер (leader=True), затем по ID (порядку подключения)
        participations.sort(key=lambda p: (not p.leader, p.id))

        return [GameParticipationType.from_model(p, p.session_id == participation_session_id) for p in participations]

    @staticmethod
    async def join_game(session, game_id: int, participation_name: str,
                        participant_session_id: str) -> GameParticipationType:
        game = await GameRepository.get(session, game_id=game_id, link_participations=True)

        if not game:
            raise MessageException("Game not found", code=GraphqlErrorCode.GAME_UNAVAILABLE)
        if game.status != GameStatusEnum.in_lobby:
            raise MessageException("Game is already started", code=GraphqlErrorCode.GAME_UNAVAILABLE)

        if any(p.session_id == participant_session_id for p in game.participations):
            raise MessageException("You have already joined this game", code=GraphqlErrorCode.ALREADY_JOINED)

        new_participation = await GameParticipationRepository.create_participation(
            session=session,
            game_id=game_id,
            name=participation_name,
            session_id=participant_session_id,
            leader=False
        )
        return GameParticipationType.from_model(new_participation, True)
