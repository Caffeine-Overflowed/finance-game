from typing import List, Optional

from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.utils.database import Base


class GameQuestion(Base):
    __tablename__ = "game_questions"

    id: Mapped[int] = mapped_column(primary_key=True)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id"), nullable=False)
    participation_id: Mapped[int] = mapped_column(ForeignKey("game_participations.id"))
    turn_id: Mapped[int] = mapped_column(ForeignKey("game_turns.id"), nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)

    game: Mapped["Game"] = relationship(back_populates="questions")
    participation: Mapped[Optional["GameParticipation"]] = relationship(back_populates="questions")
    turn: Mapped["GameTurn"] = relationship(back_populates="questions")
    choices: Mapped[List["GameChoice"]] = relationship(back_populates="question")
