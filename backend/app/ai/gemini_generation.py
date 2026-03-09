# app/ai/gemini_generation.py
from typing import List, Optional
from pydantic import BaseModel, Field
from google import genai
from google.genai import types  # <- важно

from app.ai.prompts import QUESTION_PROMPT, RESULT_PROMPT, SYSTEM_PROMPT, STARTING_PROMPT
from app.extensions.gpt_parsing.result_response import AdditionalResultItem
from app.utils.logging import StructuredLogger


# Модели ответа
class Choice(BaseModel):
    title: str
    title_for_everyone: str
    result: str
    result_tags: List[str]

class Question(BaseModel):
    title: str
    choices: List[Choice] = Field(default_factory=list)

class TurnResult(BaseModel):
    score: int
    description: str
    additional_results: Optional[List[AdditionalResultItem]] = None

# Клиент
client = genai.Client()      # sync при желании
aio_client = client.aio      # async интерфейс

MODEL_FAST = "gemini-2.5-flash"
MODEL_SMART = "gemini-2.5-pro"

async def generate_opening_question(context: str, model: str = MODEL_FAST) -> Question:
    resp = await aio_client.models.generate_content(
        model=model,
        contents=[STARTING_PROMPT, context],
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            response_schema=Question,
            temperature=0.9,
            top_p=0.95,
        ),
    )
    StructuredLogger.info("ai.opening_question.generated", content=resp.text)
    return Question.model_validate_json(resp.text)

async def generate_questions_for_player(context: str, model: str = MODEL_FAST) -> Question:
    StructuredLogger.info("ai.questions_for_player.starting")
    resp = await aio_client.models.generate_content(
        model=model,
        contents=[QUESTION_PROMPT, context],
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            response_schema=Question,
            temperature=0.9,
            top_p=0.95,
        ),
    )
    StructuredLogger.info("ai.questions_for_player.generated", content=resp.text)
    return Question.model_validate_json(resp.text)

async def generate_turn_result(player_trace: str, model: str = MODEL_FAST) -> TurnResult:
    resp = await aio_client.models.generate_content(
        model=model,
        contents=[RESULT_PROMPT, player_trace],
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            response_schema=TurnResult,
            temperature=0.9,
            top_p=0.9,
        ),
    )
    StructuredLogger.info("ai.turn_result.generated", content=resp.text)
    return TurnResult.model_validate_json(resp.text)
