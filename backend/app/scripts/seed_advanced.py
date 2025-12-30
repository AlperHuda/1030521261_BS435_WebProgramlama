"""
Seed script to populate database with 20 distinct scenarios and download real images locally.
Also seeds AI images from the static/images/ai/ folder for each successful scenario.
Run: python -m app.scripts.seed_advanced
"""
import os
import requests
import time
import hashlib
import random
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.models.scenario import Scenario
from app.models.game import Image
from app.services.openai_service import OpenAIService

# Ensure static directory exists
STATIC_DIR = os.path.join("app", "static", "images", "real")
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)

# AI images directory
AI_STATIC_DIR = os.path.join("app", "static", "images", "ai")

def download_image(url: str, filename: str) -> str:
    """Download image and return local path"""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            filepath = os.path.join(STATIC_DIR, filename)
            with open(filepath, "wb") as f:
                f.write(response.content)
            # Return web-accessible path
            return f"/static/images/real/{filename}"
        else:
            print(f"  [X] Status Code {response.status_code} for {url}")
    except Exception as e:
        print(f"  [X] Failed to download {url}: {e}")
    # Fallback to original URL if download fails
    return url


def seed_ai_image_for_scenario(db: Session, scenario: Scenario, data: dict) -> bool:
    """
    Seed the specific AI image for a scenario.
    If file exists, use it. If not, generate it via OpenAI.
    """
    ai_image_filename = data.get("ai_image")
    if not ai_image_filename:
        print(f"  [!] No AI image defined for this scenario")
        return False
    
    ai_image_path = os.path.join(AI_STATIC_DIR, ai_image_filename)
    ai_image_url = f"/static/images/ai/{ai_image_filename}"
    
    # 1. Check if file exists locally
    if not os.path.exists(ai_image_path):
        print(f"  [i] AI image missing locally: {ai_image_filename}")
        print(f"  [>] Generating new AI image for: {data['prompt'][:30]}...")
        
        try:
            # Generate new image
            generated_url = OpenAIService.generate_image(data["prompt"])
            
            # If generated_url is a remote URL (DALL-E), download it
            if generated_url.startswith("http"):
                response = requests.get(generated_url, timeout=30)
                if response.status_code == 200:
                    with open(ai_image_path, "wb") as f:
                        f.write(response.content)
                    print(f"  [OK] Generated and saved: {ai_image_filename}")
                else:
                    print(f"  [!] Failed to download generated image: {response.status_code}")
                    return False
            elif generated_url.startswith("/static/"):
                 # Should not happen if DYNAMIC_AI is True and key is valid, but handle fallback
                 print("  [!] Warning: Service returned static path, but we wanted to generate.")
                 return False
            else:
                 print("  [!] Unknown URL format returned.")
                 return False
                 
        except Exception as e:
            print(f"  [!] AI Generation failed: {e}")
            return False

    # 2. Register to DB
    existing_ai = db.query(Image).filter(
        Image.scenario_id == scenario.id,
        Image.is_ai_generated == True
    ).first()
    
    if existing_ai:
        if existing_ai.url != ai_image_url:
            existing_ai.url = ai_image_url
            db.commit()
            print(f"  [i] Updated AI image record: {ai_image_filename}")
    else:
        # Create hint based on scenario prompt
        hint = f"AI tarafindan uretildi: {data['prompt'][:50]}..."
        
        ai_image = Image(
            url=ai_image_url,
            is_ai_generated=True,
            category=data["category"],
            difficulty=data["difficulty"],
            scenario_id=scenario.id,
            hint=hint
        )
        db.add(ai_image)
        db.commit()
        print(f"  [+] Registered AI image: {ai_image_filename}")
        
    return True


# 30 Scenarios - Each with its specific AI image
SCENARIOS = [
    {
        "prompt": "Siberpunk sehrinde yagmurlu bir gece, neon isiklar.",
        "category": "landscape",
        "difficulty": "medium",
        "keywords": ["cyberpunk", "neon", "city"],
        "ai_image": "cyberpunk_city.png"
    },
    {
        "prompt": "Orta cag kalesi, sisli bir sabah manzara.",
        "category": "landscape",
        "difficulty": "hard",
        "keywords": ["medieval", "castle", "fog"],
        "ai_image": "medieval_castle.png"
    },
    {
        "prompt": "Derin deniz dalgici, mercan resifleri, su alti kesfi.",
        "category": "nature",
        "difficulty": "medium",
        "keywords": ["diver", "underwater", "coral"],
        "ai_image": "underwater_diver.png"
    },
    {
        "prompt": "Uzay istasyonu ici, astronot suzuluyor, bilim kurgu.",
        "category": "sci-fi",
        "difficulty": "hard",
        "keywords": ["space station", "astronaut", "iss"],
        "ai_image": "space_station.png"
    },
    {
        "prompt": "Ronesans tarzi otoportre, klasik sanat, yagli boya hissi.",
        "category": "art",
        "difficulty": "easy",
        "keywords": ["renaissance", "portrait", "painting"],
        "ai_image": "renaissance_portrait.png"
    },
    {
        "prompt": "Steampunk atolyesi, disliler, bakir borular, buhar.",
        "category": "fantasy",
        "difficulty": "hard",
        "keywords": ["steampunk", "gears", "clockwork"],
        "ai_image": "steampunk_workshop.png"
    },
    {
        "prompt": "Japon Zen bahcesi, kiraz cicekleri, huzurlu atmosfer.",
        "category": "nature",
        "difficulty": "easy",
        "keywords": ["zen garden", "cherry blossom", "japan"],
        "ai_image": "zen_garden.png"
    },
    {
        "prompt": "Kiyamet sonrasi corak arazi, terkedilmis arabalar, tozlu yol.",
        "category": "landscape",
        "difficulty": "medium",
        "keywords": ["wasteland", "apocalypse", "desert"],
        "ai_image": "post_apocalypse.png"
    },
    {
        "prompt": "Seker diyari, dev lolipoplar, pembe gokyuzu, surreal.",
        "category": "fantasy",
        "difficulty": "easy",
        "keywords": ["candy", "sweets", "pastel"],
        "ai_image": "candy_land.png"
    },
    {
        "prompt": "Vahsi bati salonu, kovboylar, eski ahsap bina.",
        "category": "historical",
        "difficulty": "medium",
        "keywords": ["wild west", "saloon", "cowboy"],
        "ai_image": "wild_west.png"
    },
    {
        "prompt": "Yabanci bir gezegende gun batimi, iki gunes, mor daglar.",
        "category": "sci-fi",
        "difficulty": "hard",
        "keywords": ["alien planet", "surreal landscape", "space"],
        "ai_image": "alien_sunset.png"
    },
    {
        "prompt": "Kara film (Noir) dedektif ofisi, golgeler, dumanli hava.",
        "category": "art",
        "difficulty": "medium",
        "keywords": ["noir", "detective", "black and white"],
        "ai_image": "noir_detective.png"
    },
    {
        "prompt": "Antik Misir tapinagi, hiyeroglifler, kum firtinasi.",
        "category": "historical",
        "difficulty": "hard",
        "keywords": ["egypt", "pyramid", "temple"],
        "ai_image": "egypt_temple.png"
    },
    {
        "prompt": "Firtinali denizde Viking gemisi, dramatik dalgalar.",
        "category": "historical",
        "difficulty": "hard",
        "keywords": ["viking", "ship", "storm"],
        "ai_image": "viking_ship.png"
    },
    {
        "prompt": "Robot montaj hatti, endustriyel kollar, metalik yuzeyler.",
        "category": "sci-fi",
        "difficulty": "medium",
        "keywords": ["robot", "factory", "industrial"],
        "ai_image": "robot_factory.png"
    },
    {
        "prompt": "Buyulu orman, parlayan mantarlar, peri masali atmosferi.",
        "category": "fantasy",
        "difficulty": "easy",
        "keywords": ["magical forest", "mushroom", "bioluminescent"],
        "ai_image": "magical_forest.png"
    },
    {
        "prompt": "Formula 1 yaris pisti, hiz yapan arabalar, tribunler.",
        "category": "sports",
        "difficulty": "easy",
        "keywords": ["f1", "race car", "formula 1"],
        "ai_image": "f1_race.png"
    },
    {
        "prompt": "Perili kosk, terk edilmis, karanlik pencereler, gotik mimari.",
        "category": "fantasy",
        "difficulty": "easy",
        "keywords": ["haunted house", "creepy", "gothic"],
        "ai_image": "haunted_mansion.png"
    },
    {
        "prompt": "Kutup kesif ekibi, buzullar, penguenler, soguk mavi.",
        "category": "nature",
        "difficulty": "medium",
        "keywords": ["artic", "glacier", "ice"],
        "ai_image": "arctic_expedition.png"
    },
    {
        "prompt": "Volkanik patlama, lav akintisi, dumanlar, tehlikeli doga.",
        "category": "nature",
        "difficulty": "hard",
        "keywords": ["volcano", "lava", "eruption"],
        "ai_image": "volcano_eruption.png"
    },
    {
        "prompt": "Tropikal plajda gun batimi, palmiye agaclari, altin saat.",
        "category": "nature",
        "difficulty": "easy",
        "keywords": ["tropical", "beach", "sunset"],
        "ai_image": "tropical_beach.png"
    },
    {
        "prompt": "Sibernetik laboratuvar, yuksek teknoloji arayuz, hologram.",
        "category": "sci-fi",
        "difficulty": "medium",
        "keywords": ["cybernetic", "lab", "hologram"],
        "ai_image": "cyber_lab.png"
    },
    {
        "prompt": "Sonbahar ormaninda antik yol, dokulen yapraklar.",
        "category": "nature",
        "difficulty": "easy",
        "keywords": ["autumn", "forest", "path"],
        "ai_image": "autumn_forest.png"
    },
    {
        "prompt": "Kalabalik Tokyo caddesi, insan seli, sehir isiklari.",
        "category": "landscape",
        "difficulty": "hard",
        "keywords": ["tokyo", "street", "crowd"],
        "ai_image": "tokyo_street.png"
    },
    {
        "prompt": "Soyut geometrik sekiller, 3D render, renkli.",
        "category": "art",
        "difficulty": "hard",
        "keywords": ["abstract", "geometric", "3d"],
        "ai_image": "abstract_3d.png"
    },
    {
        "prompt": "Klasik kutuphane, eski kitaplar, ahsap merdiven.",
        "category": "historical",
        "difficulty": "medium",
        "keywords": ["library", "books", "shelf"],
        "ai_image": "classic_library.png"
    },
    {
        "prompt": "Karli dag zirvesi, tirmanici, ekstrem spor.",
        "category": "sports",
        "difficulty": "hard",
        "keywords": ["mountain", "climber", "snow"],
        "ai_image": "mountain_climber.png"
    },
    {
        "prompt": "Su alti batigi, baliklar, gizemli.",
        "category": "nature",
        "difficulty": "medium",
        "keywords": ["shipwreck", "underwater", "ocean"],
        "ai_image": "underwater_shipwreck.png"
    },
    {
        "prompt": "Futuristik ucan araba, gokdelenler, bulutlar.",
        "category": "sci-fi",
        "difficulty": "medium",
        "keywords": ["flying car", "future", "skyline"],
        "ai_image": "flying_car.png"
    },
    {
        "prompt": "Orta cag pazar tezgahi, meyveler, tuccar.",
        "category": "historical",
        "difficulty": "easy",
        "keywords": ["medieval", "market", "fruit"],
        "ai_image": "medieval_market.png"
    }
]


def seed_advanced(db: Session):
    print("Starting advanced seed process...")
    print("Target: 20 successful scenarios with 2 unique real images + 1 AI image each.")
    print(f"Total scenarios available: {len(SCENARIOS)}")
    
    successful_scenarios_count = 0
    total_processed = 0
    
    for i, data in enumerate(SCENARIOS):
        if successful_scenarios_count >= 20:
            print(f"\nGoal reached! {successful_scenarios_count} scenarios seeded successfully.")
            break
            
        print(f"\n[{total_processed+1}/{len(SCENARIOS)}] Processing: {data['prompt'][:50]}...")
        total_processed += 1
        
        # Check if scenario exists
        scenario = db.query(Scenario).filter(Scenario.prompt_text == data["prompt"]).first()
        if not scenario:
            scenario = Scenario(
                prompt_text=data["prompt"],
                category=data["category"],
                difficulty=data["difficulty"]
            )
            db.add(scenario)
            db.commit()
            db.refresh(scenario)
        
        # Check if scenario already has enough real images
        existing_real_count = db.query(Image).filter(
            Image.scenario_id == scenario.id, 
            Image.is_ai_generated == False
        ).count()
        
        if existing_real_count >= 2:
            # Check if already has AI image too
            existing_ai = db.query(Image).filter(
                Image.scenario_id == scenario.id, 
                Image.is_ai_generated == True
            ).first()
            
            if existing_ai:
                print(f"  [SKIP] Already complete with {existing_real_count} real + AI image")
                successful_scenarios_count += 1
                continue
            else:
                # Just add AI image
                if seed_ai_image_for_scenario(db, scenario, data):
                    print(f"  [OK] Added AI image to existing scenario")
                    successful_scenarios_count += 1
                continue
        
        # Cleanup existing images for a clean retry ONLY if we are re-downloading
        # But here we want to check locals first
        
        print("  - Checking for existing local images...")
        import glob
        existing_files = glob.glob(os.path.join(STATIC_DIR, f"sc{scenario.id}_*.jpg"))
        
        found_local_count = 0
        current_scenario_images = []
        
        # If we have local files, use them
        if len(existing_files) >= 2:
            print(f"    Found {len(existing_files)} local images. Registering to DB without download...")
            for filepath in existing_files[:2]:
                filename = os.path.basename(filepath)
                img = Image(
                     url=f"/static/images/real/{filename}",
                     is_ai_generated=False,
                     category=data["category"],
                     difficulty=data["difficulty"],
                     scenario_id=scenario.id
                )
                db.add(img)
                current_scenario_images.append(img)
                found_local_count += 1
            db.commit()
            count = found_local_count
        else:
            # Need to download
            print("  - Downloading 2 unique real images...")
            
            # Sanitize keywords
            sanitized_keywords = []
            for k in data["keywords"]:
                sanitized_keywords.extend(k.split())
            base_keywords = ",".join(sanitized_keywords)
            
            scenario_hashes = set()
            count = 0
            attempts = 0
            max_attempts = 15
            
            while count < 2 and attempts < max_attempts:
                 attempts += 1
                 unique_seed = i * 1000 + count * 100 + attempts + int(time.time()*100)
                 
                 # Primary Source: LoremFlickr
                 # Try to force unique images with lock and timestamp
                 if attempts < 8:
                     url = f"https://loremflickr.com/800/600/{base_keywords}/all?lock={unique_seed}"
                 else:
                     # Fallback to Picsum earlier if LoremFlickr keeps sending duplicates
                     print(f"    Fallback to Picsum (too many attempts)...")
                     url = f"https://picsum.photos/800/600?random={unique_seed}"

                 filename = f"sc{scenario.id}_real_{count+1}_{int(time.time())}_{attempts}.jpg"
                 
                 # Download
                 saved_path = download_image(url, filename)
                 
                 # Validate Uniqueness
                 if saved_path.startswith("/static/"):
                     full_path = os.path.join(STATIC_DIR, filename)
                     try:
                         with open(full_path, "rb") as f:
                             content = f.read()
                             file_hash = hashlib.md5(content).hexdigest()
                         
                         if file_hash in scenario_hashes:
                             print(f"    [!] Duplicate content (Hash: {file_hash[:8]}). Retrying...")
                             os.remove(full_path)
                             continue
                         
                         scenario_hashes.add(file_hash)
                     except Exception as e:
                         print(f"    [!] Hashing error: {e}")
                         continue
                 
                     img = Image(
                         url=saved_path,
                         is_ai_generated=False,
                         category=data["category"],
                         difficulty=data["difficulty"],
                         scenario_id=scenario.id
                     )
                     db.add(img)
                     db.commit() 
                     current_scenario_images.append(img)
                     count += 1
                     time.sleep(1.5) # Increased delay to reduce rate limiting randomness

        if count >= 2:
            # Successfully got 2 real images, now add AI image
            print(f"  [OK] Got {count} real images, adding AI image...")
            ai_success = seed_ai_image_for_scenario(db, scenario, data)
            
            if ai_success:
                print(f"  [OK] Scenario seeded successfully!")
                successful_scenarios_count += 1
            else:
                print(f"  [!] Scenario has real images but AI image failed")
                successful_scenarios_count += 1
        else:
            print(f"  [FAIL] Failed to get 2 unique real images (Got {count}). Rolling back...")
            # Delete images from DB and Disk
            for img in current_scenario_images:
                if img.url.startswith("/static/"):
                    full_path = os.path.join("app", img.url.lstrip("/"))
                    if os.path.exists(full_path):
                        os.remove(full_path)
                db.delete(img)
            
            # Delete scenario from DB
            db.delete(scenario)
            db.commit()

    print("\n" + "=" * 60)
    if successful_scenarios_count < 20:
        print(f"WARNING: Only managed to seed {successful_scenarios_count}/20 scenarios.")
    else:
        print(f"Advanced seed complete! {successful_scenarios_count} scenarios ready.")
    print("=" * 60)


def main():
    db = SessionLocal()
    try:
        seed_advanced(db)
    finally:
        db.close()

if __name__ == "__main__":
    main()
