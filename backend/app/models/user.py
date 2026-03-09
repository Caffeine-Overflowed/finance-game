from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, func, Enum, Index, and_
from sqlalchemy.orm import Mapped, mapped_column

from ..extensions.oauth_provider import OAuthProvider
from ..utils.database import Base


class User(Base):
    """Модель пользователя"""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    oauth_provider: Mapped[Optional[str]] = mapped_column(Enum(OAuthProvider), nullable=True)
    oauth_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        Index("idx_email_provider", "email", "oauth_provider", "oauth_id", unique=True),
        Index(
            "uq_oauth_provider_id",
            "oauth_provider",
            "oauth_id",
            unique=True,
            postgresql_where=and_(
                oauth_provider.isnot(None),
                oauth_id.isnot(None),
            ),
        ),
    )

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
