from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Legacy Gemini fields kept for backward compatibility; no longer used for generation.
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"

    # OpenRouter (active provider).
    openrouter_api_key: str = ""
    openrouter_model: str = "nex-agi/nex-n2-pro:free"

    class Config:
        env_file = ".env"

import os

settings = Settings()

print("PWD =", os.getcwd())
print("OPENROUTER KEY =", settings.openrouter_api_key)
