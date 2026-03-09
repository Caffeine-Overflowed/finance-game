import asyncio

from sqlalchemy.ext.asyncio import AsyncSession

from app.extensions.game_status_enum import GameStatusEnum
from app.extensions.graphql_error_code import GraphqlErrorCode
from app.extensions.turn_status_enum import TurnStatusEnum
from app.graphql.types.game_type import GameStateType, GameType
from app.models import GameTurn
from app.repositories.game_participation_repository import GameParticipationRepository
from app.repositories.game_repository import GameRepository
from app.repositories.game_setting_repository import GameSettingRepository
from app.repositories.game_turn_repository import GameTurnRepository
from app.services.background_game_service import BackgroundGameService
from app.utils.graphql_utils import MessageException


class GameService:
    @staticmethod
    async def start_game(session: AsyncSession, session_id: str, game_id: int) -> GameType:
        game = await GameRepository.get(session, game_id, link_setting=True)
        if not game:
            raise MessageException("Game not found")
        if game.status != GameStatusEnum.in_lobby:
            raise MessageException("Game has already started or finished")

        participation = await GameParticipationRepository.get_by_session_id(session, game_id, session_id)
        if not participation or not participation.leader:
            raise MessageException("Only the game leader can start the game")

        years = sorted(game.setting.years)
        generator = enumerate(years, start=1)

        turns = [
            GameTurn(
                game_id=game_id,
                index=i,
                year=year,
            ) for i, year in generator
        ]
        generating_turn = turns[0]

        generating_turn.status = TurnStatusEnum.generating

        await GameTurnRepository.create_turns_for_game(session, turns)

        game.status = GameStatusEnum.in_progress

        asyncio.create_task(
            BackgroundGameService.process_game_start(
                game_id,
                generating_turn.id,
                years
            )
        )

        return GameType.from_model(game)

    @staticmethod
    async def create_game(session: AsyncSession, participant_session_id: str, leader_name: str) -> GameType:
        """
        Создать новую игру в статусе лобби
        Args:
            session: Сессия базы данных
            participant_session_id: ID сессии участника (создателя игры)
            leader_name: Имя лидера игры
        Returns:
            GameType: Созданная игра со статусом in_lobby
        """

        game_setting = await GameSettingRepository.get_random_setting(session)
        if not game_setting:
            raise MessageException("No game settings available to create a game")

        game = await GameRepository.create_game(session, game_setting.id)

        await GameParticipationRepository.create_participation(
            session=session,
            game_id=game.id,
            name=leader_name,
            session_id=participant_session_id,
            leader=True
        )

        # Создаем GameType внутри транзакции (как в Auth)
        return GameType.from_model(game)

    @staticmethod
    async def get_game_state(session: AsyncSession, game_id: int, participant_session_id: str) -> GameStateType:
        participation = await GameParticipationRepository.get_by_session_id(session, game_id, participant_session_id)
        if not participation:
            raise MessageException("You are not a participant of this game", code=GraphqlErrorCode.GAME_UNAVAILABLE)

        game = await GameRepository.get(session, game_id, link_turns=True)
        if not game:
            raise MessageException("Game not found")
        is_leader = participation.leader

        return GameStateType.from_model(game, participation.id, is_leader)

    @staticmethod
    async def get_game_state_by_code(session: AsyncSession, game_code: str, participant_session_id) -> GameStateType:
        """
        Получить состояние игры по её коду.
        Применяет особые правила доступа для пользователей, которые еще не являются участниками.
        """
        game = await GameRepository.get_by_code(session, game_code, link_turns=True)
        if not game:
            raise MessageException("Game not found", code=GraphqlErrorCode.NOT_FOUND)

        participation = await GameParticipationRepository.get_by_session_id(
            session, game.id, participant_session_id
        )

        if not participation and game.status != GameStatusEnum.in_lobby:
            raise MessageException("You are not a participant of this game", code=GraphqlErrorCode.GAME_UNAVAILABLE)

        participation_id = participation.id if participation else 0
        is_leader = participation.leader if participation else False
        return GameStateType.from_model(game, participation_id, is_leader)
