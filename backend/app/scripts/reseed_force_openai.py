
import os
import requests
import time
import shutil
import glob
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.scenario import Scenario
from app.models.game import Image, Guess, GameRound
from app.services.openai_service import OpenAIService
from app.core.config import settings

# Configuration
REAL_IMG_DIR = os.path.join("app", "static", "images", "real")
AI_IMG_DIR = os.path.join("app", "static", "images", "ai")

# 30 Curated Scenarios
SCENARIOS = [
    {"prompt": "Siberpunk şehrinde yağmurlu bir gece, neon ışıklar.", "category": "landscape", "difficulty": "medium", "keywords": ["cyberpunk", "neon", "city"]},
    {"prompt": "Orta çağ kalesi, sisli bir sabah manzara.", "category": "landscape", "difficulty": "hard", "keywords": ["medieval", "castle", "fog"]},
    {"prompt": "Derin deniz dalgıcı, mercan resifleri, su altı keşfi.", "category": "nature", "difficulty": "medium", "keywords": ["diver", "underwater", "coral"]},
    {"prompt": "Uzay istasyonu içi, astronot süzülüyor, bilim kurgu.", "category": "sci-fi", "difficulty": "hard", "keywords": ["space station", "astronaut", "iss"]},
    {"prompt": "Rönesans tarzı otoportre, klasik sanat, yağlı boya hissi.", "category": "art", "difficulty": "easy", "keywords": ["renaissance", "portrait", "painting"]},
    {"prompt": "Steampunk atölyesi, dişliler, bakır borular, buhar.", "category": "fantasy", "difficulty": "hard", "keywords": ["steampunk", "gears", "clockwork"]},
    {"prompt": "Japon Zen bahçesi, kiraz çiçekleri, huzurlu atmosfer.", "category": "nature", "difficulty": "easy", "keywords": ["zen garden", "cherry blossom", "japan"]},
    {"prompt": "Kıyamet sonrası çorak arazi, terkedilmiş arabalar, tozlu yol.", "category": "landscape", "difficulty": "medium", "keywords": ["wasteland", "apocalypse", "desert"]},
    {"prompt": "Şeker diyarı, dev lolipoplar, pembe gökyüzü, sürreal.", "category": "fantasy", "difficulty": "easy", "keywords": ["candy", "sweets", "pastel"]},
    {"prompt": "Vahşi batı salonu, kovboylar, eski ahşap bina.", "category": "historical", "difficulty": "medium", "keywords": ["wild west", "saloon", "cowboy"]},
    {"prompt": "Yabancı bir gezegende gün batımı, iki güneş, mor dağlar.", "category": "sci-fi", "difficulty": "hard", "keywords": ["alien planet", "surreal landscape", "space"]},
    {"prompt": "Kara film (Noir) dedektif ofisi, gölgeler, dumanlı hava.", "category": "art", "difficulty": "medium", "keywords": ["noir", "detective", "black and white"]},
    {"prompt": "Antik Mısır tapınağı, hiyeroglifler, kum fırtınası.", "category": "historical", "difficulty": "hard", "keywords": ["egypt", "pyramid", "temple"]},
    {"prompt": "Fırtınalı denizde Viking gemisi, dramatik dalgalar.", "category": "historical", "difficulty": "hard", "keywords": ["viking", "ship", "storm"]},
    {"prompt": "Robot montaj hattı, endüstriyel kollar, metalik yüzeyler.", "category": "sci-fi", "difficulty": "medium", "keywords": ["robot", "factory", "industrial"]},
    {"prompt": "Büyülü orman, parlayan mantarlar, peri masalı atmosferi.", "category": "fantasy", "difficulty": "easy", "keywords": ["magical forest", "mushroom", "bioluminescent"]},
    {"prompt": "Formula 1 yarış pisti, hız yapan arabalar, tribünler.", "category": "sports", "difficulty": "easy", "keywords": ["f1", "race car", "formula 1"]},
    {"prompt": "Perili köşk, terk edilmiş, karanlık pencereler, gotik mimari.", "category": "fantasy", "difficulty": "easy", "keywords": ["haunted house", "creepy", "gothic"]},
    {"prompt": "Kutup keşif ekibi, buzullar, penguenler, soğuk mavi.", "category": "nature", "difficulty": "medium", "keywords": ["artic", "glacier", "ice"]},
    {"prompt": "Volkanik patlama, lav akıntısı, dumanlar, tehlikeli doğa.", "category": "nature", "difficulty": "hard", "keywords": ["volcano", "lava", "eruption"]},
    {"prompt": "Tropikal plajda gün batımı, palmiye ağaçları, altın saat.", "category": "nature", "difficulty": "easy", "keywords": ["tropical", "beach", "sunset"]},
    {"prompt": "Sibernetik laboratuvar, yüksek teknoloji arayüz, hologram.", "category": "sci-fi", "difficulty": "medium", "keywords": ["cybernetic", "lab", "hologram"]},
    {"prompt": "Sonbahar ormanında antik yol, dökülen yapraklar.", "category": "nature", "difficulty": "easy", "keywords": ["autumn", "forest", "path"]},
    {"prompt": "Kalabalık Tokyo caddesi, insan seli, şehir ışıkları.", "category": "landscape", "difficulty": "hard", "keywords": ["tokyo", "street", "crowd"]},
    {"prompt": "Soyut geometrik şekiller, 3D render, renkli.", "category": "art", "difficulty": "hard", "keywords": ["abstract", "geometric", "3d"]},
    {"prompt": "Klasik kütüphane, eski kitaplar, ahşap merdiven.", "category": "historical", "difficulty": "medium", "keywords": ["library", "books", "shelf"]},
    {"prompt": "Karlı dağ zirvesi, tırmanıcı, ekstrem spor.", "category": "sports", "difficulty": "hard", "keywords": ["mountain", "climber", "snow"]},
    {"prompt": "Su altı batığı, balıklar, gizemli.", "category": "nature", "difficulty": "medium", "keywords": ["shipwreck", "underwater", "ocean"]},
    {"prompt": "Fütüristik uçan araba, gökdelenler, bulutlar.", "category": "sci-fi", "difficulty": "medium", "keywords": ["flying car", "future", "skyline"]},
    {"prompt": "Orta çağ pazar tezgahı, meyveler, tüccar.", "category": "historical", "difficulty": "easy", "keywords": ["medieval", "market", "fruit"]},
]

import sys

def clean_data(db: Session):
    print("WARNING: Deleting ALL game data (Rounds, Guesses, Images, Scenarios) and LOCAL FILES...", flush=True)
    # Delete DB records
    db.query(Guess).delete()
    db.query(GameRound).delete()
    db.query(Image).delete()
    db.query(Scenario).delete()
    db.commit()
    print("  [OK] Database cleared.", flush=True)

    # Delete local files
    for folder in [REAL_IMG_DIR, AI_IMG_DIR]:
        if os.path.exists(folder):
            files = glob.glob(os.path.join(folder, "*"))
            for f in files:
                try:
                    os.remove(f)
                except Exception as e:
                    print(f"  [!] Failed to delete {f}: {e}")
    print("  [OK] Local static files cleared.")

    # Re-create directories
    os.makedirs(REAL_IMG_DIR, exist_ok=True)
    os.makedirs(AI_IMG_DIR, exist_ok=True)

def download_and_save(url: str, filepath: str) -> bool:
    try:
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(response.content)
            return True
        else:
            print(f"    [!] Download failed: Status {response.status_code}")
    except Exception as e:
        print(f"    [!] Download failed: {e}")
    return False

def reseed_force(db: Session):
    if not settings.openai_api_key:
        print("ERROR: OpenAI API Key is missing! Cannot proceed with generation.")
        return

    # Enable Dynamic AI temporarily for this script just in case logic depends on it
    # But OpenAIService usually checks the setting. We will bypass or ensure it's on.
    settings.dynamic_ai = True 

    clean_data(db)

    print(f"\nStarting Fresh Seed for {len(SCENARIOS)} Scenarios...")
    print("This will consume OpenAI credits for 30 images. Please wait...\n")

    for i, data in enumerate(SCENARIOS):
        print(f"[{i+1}/{len(SCENARIOS)}] Processing: {data['prompt'][:30]}...")
        
        # 1. Create Scenario
        scenario = Scenario(
            prompt_text=data["prompt"],
            category=data["category"],
            difficulty=data["difficulty"]
        )
        db.add(scenario)
        db.commit()
        db.refresh(scenario) # Get ID

        # 2. Download 2 Real Images
        real_count = 0
        keywords = ",".join(data["keywords"])
        
        retry_limit = 5
        attempts = 0
        
        while real_count < 2 and attempts < retry_limit:
            attempts += 1
            # Unique lock for randomness
            lock = f"{i}{real_count}{attempts}{int(time.time())}"
            url = f"https://loremflickr.com/800/600/{keywords}/all?lock={lock}"
            
            filename = f"sc{scenario.id}_real_{real_count+1}.jpg"
            filepath = os.path.join(REAL_IMG_DIR, filename)
            
            if download_and_save(url, filepath):
                img = Image(
                    url=f"/static/images/real/{filename}",
                    is_ai_generated=False,
                    category=data["category"],
                    difficulty=data["difficulty"],
                    scenario_id=scenario.id
                )
                db.add(img)
                real_count += 1
                time.sleep(0.5) # Be nice to LoremFlickr
            else:
                print("    [!] Real image download failed, retrying...")
        
        if real_count < 2:
            print(f"    [FAIL] Could not get enough real images for scenario {i+1}. Skipping.")
            continue

        # 3. Generate and Save AI Image
        print("    -> Generating AI Image with DALL-E 3...")
        try:
            # We call OpenAIService but we need it to return URL, which it does.
            # We must be careful if OpenAIService falls back to static.
            # We will force generation by directly using the underlying logic or ensuring settings.
            
            ai_url = OpenAIService.generate_image(data["prompt"])
            
            # Check if it returned a placeholder or static path (we don't want that)
            if "placeholder" in ai_url or ai_url.startswith("/static/"):
                # DALL-E generation failed or dynamic_ai was false
                print("    [!] Failed to generate real AI image (returned placeholder/static).")
                # Try to re-enable DYNAMIC_AI manually if service logic was strict
                # Actually, let's just assume generate_image works if API key is present.
                pass
            
            # It's an OpenAI URL (usually starts with https://oaidalleapiprod...)
            # Download it to make it permanent
            ai_filename = f"sc{scenario.id}_ai_gen.png"
            ai_filepath = os.path.join(AI_IMG_DIR, ai_filename)
            
            if download_and_save(ai_url, ai_filepath):
                ai_img_db = Image(
                    url=f"/static/images/ai/{ai_filename}", # Local path!
                    is_ai_generated=True,
                    category=data["category"],
                    difficulty=data["difficulty"],
                    scenario_id=scenario.id,
                    hint=f"AI tarafindan uretildi: {data['prompt'][:40]}..."
                )
                db.add(ai_img_db)
                print("    [OK] AI Image Generated & Saved.")
            else:
                print("    [!] Could not download generated AI image.")

        except Exception as e:
            print(f"    [!] AI Generation Error: {e}")

        db.commit()

    print("\n==================================")
    print("Force Seed Complete!")
    print("==================================")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        reseed_force(db)
    finally:
        db.close()
