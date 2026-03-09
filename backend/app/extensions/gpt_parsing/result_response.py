from typing import List, Optional
from pydantic import BaseModel

class AdditionalResultItem(BaseModel):
    id: int
    title: str
    description: str
