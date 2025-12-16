from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI Visual Guess Game API"
    database_url: str = "sqlite:///./app.db"
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]


    class Config:
        env_file = ".env"
        env_prefix = ""


settings = Settings()
