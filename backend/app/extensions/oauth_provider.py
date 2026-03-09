from enum import Enum


class OAuthProvider(str, Enum):
    """OAuth провайдеры"""
    GOOGLE = "GOOGLE"
