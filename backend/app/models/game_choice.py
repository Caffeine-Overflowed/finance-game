from typing import List

from sqlalchemy import (ARRAY, Boolean, ForeignKey, String, Text)
from sqlalchemy.orm import (
    Mapped, mapped_column, relationship
)

from app.utils.database import Base


class GameChoice(Base):
    __tablename__ = "game_choices"

    id: Mapped[int] = mapped_column(primary_key=True)
    game_question_id: Mapped[int] = mapped_column(ForeignKey("game_questions.id"), nullable=False)
    chosen: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    title_for_everyone: Mapped[str] = mapped_column(String(255), nullable=False)
    result: Mapped[str] = mapped_column(Text, nullable=False)
    result_tags: Mapped[List[str]] = mapped_column(ARRAY(String), nullable=False)

    question: Mapped["GameQuestion"] = relationship(back_populates="choices")
