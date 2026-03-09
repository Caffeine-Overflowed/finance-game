from typing import List

from pydantic import BaseModel


class GPTChoiceResponse(BaseModel):
    title: str
    title_for_everyone: str
    description: str
    result: str
    result_tags: List[str]

