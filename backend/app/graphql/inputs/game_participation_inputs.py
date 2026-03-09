import strawberry


@strawberry.input
class JoinGameInput:
    """Входные данные для присоединения к игре (лобби)"""
    game_id: int
    participation_name: str