from typing import List
from uuid import uuid4

from sqlalchemy import (Enum as SAEnum, ForeignKey)
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions.game_status_enum import GameStatusEnum
from app.utils.database import Base


class Game(Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(
        PGUUID(as_uuid=False), unique=True, default=lambda: str(uuid4())
    )
    status: Mapped[GameStatusEnum] = mapped_column(
        SAEnum(GameStatusEnum), nullable=False,
        default=GameStatusEnum.in_lobby
    )
    game_setting_id: Mapped[int] = mapped_column(
        ForeignKey("game_settings.id"), nullable=False
    )

    setting: Mapped["GameSetting"] = relationship(back_populates="games")

    participations: Mapped[List["GameParticipation"]] = relationship(
        back_populates="game",
    )
    turns: Mapped[List["GameTurn"]] = relationship(
        back_populates="game",
        order_by="GameTurn.index",
    )
    results: Mapped[List["GameResult"]] = relationship(
        back_populates="game",
    )
    questions: Mapped[List["GameQuestion"]] = relationship(
        back_populates="game",
    )
