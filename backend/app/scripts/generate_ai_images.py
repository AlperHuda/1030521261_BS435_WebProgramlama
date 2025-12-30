"""
Script to generate remaining AI images using OpenAI DALL-E API.
Run: python -m app.scripts.generate_ai_images
Requires OPENAI_API_KEY in .env file
"""
import os
import requests
import openai
from pathlib import Path

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Configuration
AI_IMAGES_DIR = Path(__file__).parent.parent / "static" / "images" / "ai"
AI_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# All 30 prompts from scenarios - we'll generate for those that don't exist yet
PROMPTS = {
    "cyberpunk_city": "A cyberpunk city at night during rain, neon lights reflecting on wet streets, futuristic skyscrapers with holographic advertisements, atmospheric fog, highly detailed digital art, 4K quality",
    "medieval_castle": "A medieval castle on a hilltop during a foggy morning, stone walls covered with moss, mysterious atmosphere, gothic architecture, dramatic lighting, photorealistic digital painting",
    "underwater_diver": "Deep sea diver exploring colorful coral reefs, tropical fish swimming around, sunlight rays penetrating the blue water, underwater photography style, vibrant colors, highly detailed",
    "space_station": "Interior of a futuristic space station, astronaut floating in zero gravity, control panels with glowing screens, Earth visible through windows, sci-fi movie style, cinematic lighting",
    "renaissance_portrait": "Renaissance style self-portrait painting, classical oil painting technique, golden frame effect, Rembrandt lighting, museum quality, highly detailed brushstrokes, 4K quality",
    "steampunk_workshop": "Steampunk workshop interior with brass gears, copper pipes, steam vents, Victorian era machinery, warm orange lighting, detailed mechanical parts, industrial fantasy art",
    "zen_garden": "Japanese Zen garden with cherry blossoms in full bloom, raked sand patterns, stone lanterns, peaceful atmosphere, morning mist, traditional Japanese aesthetic, serene and calming",
    "post_apocalypse": "Post-apocalyptic wasteland with abandoned rusty cars, dusty desert road, destroyed buildings, dramatic clouds, desolate atmosphere, cinematic lighting, highly detailed",
    "candy_land": "Fantasy candy land with giant lollipops, pink sky, cotton candy clouds, colorful candy houses, whimsical surreal landscape, pastel colors, dreamy atmosphere",
    "wild_west": "Wild west saloon interior with cowboys, wooden tables and chairs, vintage bar, swinging doors, warm lamp lighting, dusty atmosphere, western movie style",
    "alien_sunset": "Sunset on an alien planet with two suns, purple mountains, exotic alien vegetation, orange and pink sky, science fiction landscape, otherworldly atmosphere",
    "noir_detective": "Film noir detective office, dramatic shadows, venetian blinds light, vintage desk with lamp, cigarette smoke, black and white photography style, moody atmosphere",
    "egypt_temple": "Ancient Egyptian temple interior with hieroglyphics on walls, golden statues, torch lighting, sandstorm visible outside, mysterious atmosphere, archaeological discovery scene",
    "viking_ship": "Viking longship sailing through stormy seas, dramatic waves, lightning in dark sky, Norse warriors on deck, epic battle scene, cinematic movie style",
    "robot_factory": "Robot assembly line in a futuristic factory, industrial robotic arms, metallic surfaces, blue LED lights, high-tech manufacturing, sci-fi industrial scene",
    "magical_forest": "Magical enchanted forest with glowing mushrooms, bioluminescent plants, fairy tale atmosphere, mystical fog, fantasy art style, vibrant colors",
    "f1_race": "Formula 1 race track with speeding cars, motion blur effect, crowded grandstands, dramatic racing action, sports photography style",
    "haunted_mansion": "Haunted Victorian mansion at night, gothic architecture, dark windows, moonlight, creepy atmosphere, overgrown garden, horror movie aesthetic",
    "arctic_expedition": "Arctic expedition team on glacier, penguins, icebergs, cold blue tones, polar exploration, dramatic landscape, National Geographic style",
    "volcano_eruption": "Volcanic eruption with flowing lava, smoke and ash clouds, dangerous natural phenomenon, dramatic lighting, powerful nature scene",
    "tropical_beach": "Tropical beach at golden hour sunset, palm trees silhouettes, calm ocean waves, paradise vacation scene, warm colors, relaxing atmosphere",
    "cyber_lab": "Futuristic cybernetic laboratory, holographic displays, high-tech interfaces, blue neon lights, sci-fi research facility",
    "autumn_forest": "Autumn forest path with falling leaves, golden and orange colors, misty morning light, peaceful nature scene, romantic atmosphere",
    "tokyo_street": "Crowded Tokyo street at night, neon signs, busy pedestrians, Japanese urban culture, vibrant city life, street photography style",
    "abstract_3d": "Abstract geometric 3D shapes, colorful render, modern digital art, floating cubes and spheres, gradient backgrounds",
    "classic_library": "Classic old library with wooden bookshelves, spiral staircase, antique books, warm lighting, academic atmosphere, heritage architecture",
    "mountain_climber": "Mountain climber on snowy peak, extreme sport, dramatic altitude, adventure photography, challenging conditions, epic landscape",
    "underwater_shipwreck": "Underwater shipwreck exploration, schools of fish, mysterious sunken vessel, deep sea atmosphere, underwater photography",
    "flying_car": "Futuristic flying car above city skyline, sunset clouds, advanced technology, sci-fi transportation, cinematic view",
    "medieval_market": "Medieval marketplace with fruit vendors, bustling crowd, wooden stalls, historical scene, vibrant colors, period accurate details"
}


def get_existing_images() -> set:
    """Get set of existing image basenames (without extension)"""
    existing = set()
    if AI_IMAGES_DIR.exists():
        for f in AI_IMAGES_DIR.iterdir():
            if f.suffix.lower() in ['.png', '.jpg', '.jpeg', '.webp']:
                existing.add(f.stem)
    return existing


def generate_image(prompt: str, filename: str) -> bool:
    """Generate an image using DALL-E and save it"""
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        print("ERROR: OPENAI_API_KEY not found in environment variables")
        return False
    
    try:
        client = openai.OpenAI(api_key=api_key)
        
        print(f"  Generating with DALL-E 3...")
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        
        image_url = response.data[0].url
        
        # Download the image
        print(f"  Downloading image...")
        img_response = requests.get(image_url, timeout=60)
        if img_response.status_code == 200:
            filepath = AI_IMAGES_DIR / f"{filename}.png"
            with open(filepath, "wb") as f:
                f.write(img_response.content)
            print(f"  Saved to: {filepath}")
            return True
        else:
            print(f"  Failed to download: HTTP {img_response.status_code}")
            return False
            
    except Exception as e:
        print(f"  ERROR: {str(e)}")
        return False


def main():
    print("=" * 60)
    print("AI Image Generator using OpenAI DALL-E")
    print("=" * 60)
    
    existing = get_existing_images()
    print(f"\nExisting images: {len(existing)}")
    print(f"Total prompts: {len(PROMPTS)}")
    
    # Find missing images
    missing = {k: v for k, v in PROMPTS.items() if k not in existing}
    print(f"Missing images: {len(missing)}")
    
    if not missing:
        print("\nAll images already exist!")
        return
    
    print(f"\nGenerating {len(missing)} images...\n")
    
    success_count = 0
    fail_count = 0
    
    for i, (filename, prompt) in enumerate(missing.items(), 1):
        print(f"[{i}/{len(missing)}] {filename}")
        print(f"  Prompt: {prompt[:60]}...")
        
        if generate_image(prompt, filename):
            success_count += 1
            print(f"  [OK] Success!")
        else:
            fail_count += 1
            print(f"  [X] Failed!")
        
        print()
    
    print("=" * 60)
    print(f"Complete! Success: {success_count}, Failed: {fail_count}")
    print(f"Total images now: {len(get_existing_images())}")
    print("=" * 60)


if __name__ == "__main__":
    main()
