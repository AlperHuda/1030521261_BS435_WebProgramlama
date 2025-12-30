from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI Visual Guess Game API"
    database_url: str = "sqlite:///./app.db"
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # OpenAI
    openai_api_key: str | None = None
    
    # AI Görsel Modu
    # true: Her oyunda OpenAI DALL-E ile yeni görsel üretir (API key gerekli)
    # false: Önceden üretilmiş statik görsellerden seçer (varsayılan)
    dynamic_ai: bool = False

    class Config:
        env_file = ".env"
        env_prefix = ""


settings = Settings()
