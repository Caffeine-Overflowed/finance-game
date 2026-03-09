from typing import List

from sqlalchemy import (Enum as SAEnum, ForeignKey, Integer, UniqueConstraint, ARRAY, String)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions.turn_status_enum import TurnStatusEnum
from app.utils.database import Base


class GameTurn(Base):
    __tablename__ = "game_turns"

    id: Mapped[int] = mapped_column(primary_key=True)
    status: Mapped[TurnStatusEnum] = mapped_column(
        SAEnum(TurnStatusEnum),
        nullable=False,
        default=TurnStatusEnum.not_started
    )
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id"), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    index: Mapped[int] = mapped_column(Integer, nullable=False)
    confirmed_by: Mapped[List[int]] = mapped_column(ARRAY(Integer), nullable=False, default=list, server_default="{}")

    game: Mapped["Game"] = relationship(back_populates="turns")
    questions: Mapped[List["GameQuestion"]] = relationship(back_populates="turn")

    __table_args__ = (
        UniqueConstraint("game_id", "index", name="uq_turn_game_index"),
    )
