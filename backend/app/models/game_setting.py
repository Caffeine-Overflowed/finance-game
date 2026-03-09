from typing import List

from sqlalchemy import ARRAY, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..utils.database import Base


class GameSetting(Base):
    __tablename__ = "game_settings"

    id: Mapped[int] = mapped_column(primary_key=True)
    # возраста по ходам, отсортированный список целых
    years: Mapped[List[int]] = mapped_column(ARRAY(Integer), nullable=False)

    games: Mapped[List["Game"]] = relationship(
        back_populates="setting",
    )
