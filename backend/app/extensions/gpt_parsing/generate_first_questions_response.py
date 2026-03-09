from pydantic import BaseModel


class GPTGenerateFirstQuestionsResponse(BaseModel):
    questions: list[GPTQuestionResponse]