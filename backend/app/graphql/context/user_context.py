from pydantic import BaseModel


class UserContext(BaseModel):
    """Information about the user from authorization token"""

    sub: int
    exp: float
    iat: float
    iss: str
