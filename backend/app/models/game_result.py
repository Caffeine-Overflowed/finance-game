from typing import List, Dict, Any, Optional
from sqlalchemy import (ForeignKey, Integer, Text, UniqueConstraint, JSON)
from sqlalchemy.orm import (
    Mapped, mapped_column, relationship
)

from app.utils.database import Base


class GameResult(Base):
    __tablename__ = "game_results"

    id: Mapped[int] = mapped_column(primary_key=True)
    participation_id: Mapped[int] = mapped_column(ForeignKey("game_participations.id"), nullable=False)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id"), nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    description: Mapped[str] = mapped_column(Text)
    additional_results: Mapped[Optional[List[Dict[str, Any]]]] = mapped_column(JSON, nullable=True, default=None)

    game: Mapped["Game"] = relationship(back_populates="results")
    participation: Mapped["GameParticipation"] = relationship(back_populates="results")

    __table_args__ = (
        UniqueConstraint("game_id", "participation_id", name="uq_result_game_participation"),
    )
