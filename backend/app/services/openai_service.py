import openai
import random
import os
from pathlib import Path
from ..core.config import settings

class OpenAIService:
    # Statik AI görselleri dizini
    STATIC_AI_DIR = Path(__file__).parent.parent / "static" / "images" / "ai"
    
    @staticmethod
    def generate_image(prompt: str) -> str:
        """
        Generate an image using OpenAI DALL-E 3 API or return a static image.
        
        If DYNAMIC_AI is False (default), returns a random static AI image.
        If DYNAMIC_AI is True and API key is available, generates a new image via DALL-E.
        
        Returns the URL of the image.
        """
        # Check if dynamic AI mode is enabled
        if not settings.dynamic_ai:
            # Static mode: return a random pre-generated AI image
            return OpenAIService._get_static_ai_image()
        
        # Dynamic mode: Generate via OpenAI API
        if not settings.openai_api_key:
            # No API key, fallback to static images
            print("WARNING: DYNAMIC_AI=true but no OpenAI API Key found. Falling back to static images.")
            return OpenAIService._get_static_ai_image()

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
            # Return static image on error to not break the game flow
            return OpenAIService._get_static_ai_image()
    
    @staticmethod
    def _get_static_ai_image() -> str:
        """
        Return a random static AI image from the static/images/ai/ directory.
        Falls back to placeholder if no images are found.
        """
        try:
            # Ensure directory exists
            if not OpenAIService.STATIC_AI_DIR.exists():
                OpenAIService.STATIC_AI_DIR.mkdir(parents=True, exist_ok=True)
                print(f"Created static AI images directory: {OpenAIService.STATIC_AI_DIR}")
            
            # Get all image files
            image_extensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif']
            images = []
            for ext in image_extensions:
                images.extend(OpenAIService.STATIC_AI_DIR.glob(f"*{ext}"))
            
            if images:
                # Return a random image
                selected = random.choice(images)
                return f"/static/images/ai/{selected.name}"
            else:
                print("WARNING: No static AI images found in static/images/ai/")
                return "https://via.placeholder.com/1024x1024/8B5CF6/FFFFFF?text=AI+Image+(No+Static+Images)"
                
        except Exception as e:
            print(f"Error getting static AI image: {str(e)}")
            return "https://via.placeholder.com/1024x1024/8B5CF6/FFFFFF?text=AI+Image+Error"
    
    @staticmethod
    def get_available_static_images() -> list[str]:
        """
        Return list of all available static AI image filenames.
        Useful for seeding scenarios.
        """
        try:
            if not OpenAIService.STATIC_AI_DIR.exists():
                return []
            
            image_extensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif']
            images = []
            for ext in image_extensions:
                images.extend([f.name for f in OpenAIService.STATIC_AI_DIR.glob(f"*{ext}")])
            
            return images
        except Exception as e:
            print(f"Error listing static AI images: {str(e)}")
            return []
