from typing import List

from pydantic import BaseModel

from app.extensions.gpt_parsing.choice_response import GPTChoiceResponse


class GPTQuestionResponse(BaseModel):
    title: str
    choices: List[GPTChoiceResponse]