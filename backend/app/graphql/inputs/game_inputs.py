import strawberry


@strawberry.input
class CreateGameInput:
    """Входные данные для создания игры"""
    leader_name: str