import base64
import hashlib
import random
import string
from typing import Optional, Dict, Any
from urllib.parse import urlencode
import httpx

from ..config.config import Config


class OAuthUtils:
    @staticmethod
    def generate_state():
        return "".join(random.choices(string.ascii_letters + string.digits, k=32))

    @staticmethod
    def generate_code_verifier():
        return "".join(random.choices(string.ascii_letters + string.digits + "-_~.", k=64))

    @staticmethod
    def generate_code_challenge(code_verifier):
        sha256_digest = hashlib.sha256(code_verifier.encode('ascii')).digest()
        code_challenge = base64.urlsafe_b64encode(sha256_digest).decode('ascii').rstrip('=')
        return code_challenge
