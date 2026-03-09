import strawberry

from app.graphql.extensions.error_middleware import MaskErrors
from .mutations.auth_mutations import AuthMutations
from .mutations.game_choice_mutations import GameChoiceMutations
from .mutations.game_mutations import GameMutations
from .mutations.game_participation_mutations import GameParticipationMutations
from .mutations.game_turn_mutations import GameTurnMutations
from .queries.auth_queries import AuthQueries
from .queries.game_choice_queries import GameChoiceQueries
from .queries.game_participation_queries import GameParticipationQueries
from .queries.game_queries import GameQueries
from .queries.game_question_queries import GameQuestionQueries
from .queries.game_result_queries import GameResultQueries


@strawberry.type
class Query(AuthQueries, GameQueries, GameChoiceQueries, GameParticipationQueries, GameQuestionQueries,
            GameResultQueries):
    """Корневой тип для всех запросов"""
    pass


@strawberry.type
class Mutation(AuthMutations, GameMutations, GameParticipationMutations, GameTurnMutations, GameChoiceMutations):
    """Корневой тип для всех мутаций"""
    pass


schema = strawberry.Schema(query=Query, mutation=Mutation,
                           extensions=[MaskErrors])
