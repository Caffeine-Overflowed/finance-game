from typing import List

from sqlalchemy.ext.asyncio import AsyncSession

from app.graphql.types.game_result_type import GameResultType
from app.repositories.game_result_repository import GameResultRepository


class GameResultService:
    @staticmethod
    async def get_game_results(
            session: AsyncSession,
            game_id: int,
            participant_session_id: str
    ) -> List[GameResultType]:
        """
        Получить результаты игры для участника.
        Вызывается, когда игра завершена.
        """

        results = await GameResultRepository.list_by_game_id(
            session,
            game_id,
            link_participation=True
        )

        return [
            GameResultType.from_model(result, participant_session_id)
            for result in results
        ]
