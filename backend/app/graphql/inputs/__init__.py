import strawberry
from .auth_inputs import RegisterInput, LoginInput


@strawberry.input(description="Параметры пагинации")
class PaginationInput:
    limit: int = strawberry.field(description="Сколько записей вернуть")
    offset: int = strawberry.field(description="Сколько записей пропустить")


__all__ = ["PaginationInput", "RegisterInput", "LoginInput"]
