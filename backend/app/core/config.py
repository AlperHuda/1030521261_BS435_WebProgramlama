from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI Visual Guess Game API"
    database_url: str = "sqlite:///./app.db"

    class Config:
        env_file = ".env"
        env_prefix = ""


settings = Settings()
