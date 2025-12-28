import openai
from ..core.config import settings

class OpenAIService:
    @staticmethod
    def generate_image(prompt: str) -> str:
        """
        Generate an image using OpenAI DALL-E 3 (or 2) API.
        Returns the URL of the generated image.
        """
        # Ensure API key is set
        if not settings.openai_api_key:
            # Fallback for development/demo without key
            print("WARNING: No OpenAI API Key found. Returning placeholder.")
            return "https://via.placeholder.com/1024x1024/FF6B6B/FFFFFF?text=AI+Generated+Image+(No+Key)"

        try:
            client = openai.OpenAI(api_key=settings.openai_api_key)
            
            response = client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1,
            )

            image_url = response.data[0].url
            return image_url
            
        except Exception as e:
            print(f"Error generating image: {str(e)}")
            # Return placeholder on error to not break the game flow
            return "https://via.placeholder.com/1024x1024/FF6B6B/FFFFFF?text=Error+Generating+Image"
