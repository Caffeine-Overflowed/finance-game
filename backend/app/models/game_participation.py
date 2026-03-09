from typing import List

from sqlalchemy import (Boolean, ForeignKey, String)
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import (
    Mapped, mapped_column, relationship
)

from app.utils.database import Base


class GameParticipation(Base):
    __tablename__ = "game_participations"

    id: Mapped[int] = mapped_column(primary_key=True)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    leader: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    session_id: Mapped[str] = mapped_column(PGUUID(as_uuid=False), nullable=True)

    game: Mapped["Game"] = relationship(back_populates="participations")
    results: Mapped[List["GameResult"]] = relationship(
        back_populates="participation", cascade="all, delete-orphan", passive_deletes=True
    )
    questions: Mapped[List["GameQuestion"]] = relationship(
        back_populates="participation", cascade="all, delete-orphan", passive_deletes=True
    )
