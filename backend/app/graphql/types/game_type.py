from typing import List

import strawberry

from app.extensions.game_status_enum import GameStatusEnum
from app.extensions.turn_status_enum import TurnStatusEnum
from app.graphql.types.game_turn_type import GameTurnType
from app.models import Game
from app.utils.game_utils import get_current_turn_index


@strawberry.type
class GameType:
    """Тип игры для GraphQL"""
    id: int
    code: str
    status: GameStatusEnum
    game_setting_id: int

    @classmethod
    def from_model(cls, game: Game) -> "GameType":
        """Создать GameType из модели Game"""
        return cls(
            id=game.id,
            code=str(game.code),
            status=game.status,
            game_setting_id=game.game_setting_id
        )


@strawberry.type
class GameStateType:
    """Тип состояния игры для GraphQL"""
    id: int
    code: str
    status: GameStatusEnum
    current_turn_index: int
    total_turns: int
    turns: List[GameTurnType]
    is_leader: bool

    @staticmethod
    def from_model(game, participation_id, is_leader) -> "GameStateType":
        """Создать GameStateType из модели Game и списка ходов"""
        turns = sorted(game.turns, key=lambda t: t.index)

        current_turn_index = get_current_turn_index(turns)
        total_turns = len(turns)

        return GameStateType(
            id=game.id,
            code=str(game.code),
            status=game.status,
            current_turn_index=current_turn_index,
            total_turns=total_turns,
            turns=[
                GameTurnType.from_model(turn, participation_id) for turn in turns
            ],
            is_leader=is_leader,
        )
