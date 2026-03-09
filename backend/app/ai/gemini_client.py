from google import genai
from pydantic import BaseModel, Field
from typing import List, Literal, Optional



# Единая точка входа
client = genai.Client()          # синхронный
aio_client = client.aio          # асинхронный интерфейс
MODEL_FAST = "gemini-2.5-flash"
MODEL_SMART = "gemini-2.5-pro"
