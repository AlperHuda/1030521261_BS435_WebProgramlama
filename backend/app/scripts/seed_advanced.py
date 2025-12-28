"""
Seed script to populate database with 20 distinct scenarios and download real images locally.
Run: python -m app.scripts.seed_advanced
"""
import os
import requests
import time
import hashlib
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.models.scenario import Scenario
from app.models.game import Image

# Ensure static directory exists
STATIC_DIR = os.path.join("app", "static", "images", "real")
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR)

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

# 20 Scenarios with high quality Unsplash Source IDs or Keywords
# Note: source.unsplash.com is deprecated, using images.unsplash.com or reliable direct links where possible.
# For this script, we will use a list of specific photo IDs from Unsplash to ensure quality.
SCENARIOS = [
    {
        "prompt": "Siberpunk şehrinde yağmurlu bir gece, neon ışıklar.",
        "category": "landscape",
        "difficulty": "medium",
        "keywords": ["cyberpunk", "neon", "city"],
        "ids": ["1515630267754-31d29435b076", "1539721972319-f0e80a00d424", "1542831371-29b0f74f9713"]
    },
    {
        "prompt": "Orta çağ kalesi, sisli bir sabah manzara.",
        "category": "landscape",
        "difficulty": "hard",
        "keywords": ["medieval", "castle", "fog"],
        "ids": ["1599739527670-3d75727195c6", "1533158326339-7f3c2a380485", "1518709268805-4e9042af9f23"]
    },
    {
        "prompt": "Derin deniz dalgıcı, mercan resifleri, su altı keşfi.",
        "category": "nature",
        "difficulty": "medium",
        "keywords": ["diver", "underwater", "coral"],
        "ids": ["1544551763-8dd40b991da8", "1582234057630-9fc62678da4b", "1682687220509-0d293d6e3cce"]
    },
    {
        "prompt": "Uzay istasyonu içi, astronot süzülüyor, bilim kurgu.",
        "category": "sci-fi",
        "difficulty": "hard",
        "keywords": ["space station", "astronaut", "iss"],
        "ids": ["1446776811953-d23dc525c564", "1451187580459-43490279c0fa", "1541873893134-b313aa515311"]
    },
    {
        "prompt": "Rönesans tarzı otoportre, klasik sanat, yağlı boya hissi.",
        "category": "art",
        "difficulty": "easy",
        "keywords": ["renaissance", "portrait", "painting"],
        "ids": ["1578301978693-858fa30a001a", "1580133318324-f5f7ad8dffdf", "1544005313-94ddf0286df2"]
    },
    {
        "prompt": "Steampunk atölyesi, dişliler, bakır borular, buhar.",
        "category": "fantasy",
        "difficulty": "hard",
        "keywords": ["steampunk", "gears", "clockwork"],
        "ids": ["1568607617707-a60421ee9879", "1581291599198-ef7070a25695", "1564998725-d72111818274"]
    },
    {
        "prompt": "Japon Zen bahçesi, kiraz çiçekleri, huzurlu atmosfer.",
        "category": "nature",
        "difficulty": "easy",
        "keywords": ["zen garden", "cherry blossom", "japan"],
        "ids": ["1558226027-463d6f1bf93a", "1528360983277-13d9b152c67b", "1524413840807-0c3eb797c456"]
    },
    {
        "prompt": "Kıyamet sonrası çorak arazi, terkedilmiş arabalar, tozlu yol.",
        "category": "landscape",
        "difficulty": "medium",
        "keywords": ["wasteland", "apocalypse", "desert"],
        "ids": ["1534237710405-c5460e48ba2e", "1469504512102-c00f90aa91f4", "1508138221679-760a23a2285b"]
    },
    {
        "prompt": "Şeker diyarı, dev lolipoplar, pembe gökyüzü, sürreal.",
        "category": "fantasy",
        "difficulty": "easy",
        "keywords": ["candy", "sweets", "pastel"],
        "ids": ["1528821128474-c770c954e384", "1532153354457-5fbe1a9dd650", "1582061596959-1e428c5a2c20"]
    },
    {
        "prompt": "Vahşi batı salonu, kovboylar, eski ahşap bina.",
        "category": "historical",
        "difficulty": "medium",
        "keywords": ["wild west", "saloon", "cowboy"],
        "ids": ["1544558235-968600d832d2", "1598556857208-48b48f69666c", "1554160472-a2790757a70a"]
    },
    {
        "prompt": "Yabancı bir gezegende gün batımı, iki güneş, mor dağlar.",
        "category": "sci-fi",
        "difficulty": "hard",
        "keywords": ["alien planet", "surreal landscape", "space"],
        "ids": ["1614730370868-e644d673199c", "1451187580459-43490279c0fa", "1446776811953-d23dc525c564"] # Reusing some space checks
    },
    {
        "prompt": "Kara film (Noir) dedektif ofisi, gölgeler, dumanlı hava, siyah beyaz.",
        "category": "art",
        "difficulty": "medium",
        "keywords": ["noir", "detective", "black and white"],
        "ids": ["1595856424364-706d953d6911", "1500462918059-b1a0cb512f1d", "1605379399642-870262d3d051"]
    },
    {
        "prompt": "Antik Mısır tapınağı, hiyeroglifler, kum fırtınası.",
        "category": "historical",
        "difficulty": "hard",
        "keywords": ["egypt", "pyramid", "temple"],
        "ids": ["1560157975-d227dce7612b", "1518884964640-5712e128148b", "1645524827058-2996c56db322"]
    },
    {
        "prompt": "Fırtınalı denizde Viking gemisi, dramatik dalgalar.",
        "category": "historical",
        "difficulty": "hard",
        "keywords": ["viking", "ship", "storm"],
        "ids": ["1517260739337-6799d2cc4fea", "1605218427306-056580f83732", "1500642879555-520f9c2d15fb"]
    },
    {
        "prompt": "Robot montaj hattı, endüstriyel kollar, metalik yüzeyler.",
        "category": "sci-fi",
        "difficulty": "medium",
        "keywords": ["robot", "factory", "industrial"],
        "ids": ["1565514020176-a0f1883dd844", "1581091226825-a6a2a5aee158", "1593979878171-460655823cb2"]
    },
    {
        "prompt": "Büyülü orman, parlayan mantarlar, peri masalı atmosferi.",
        "category": "fantasy",
        "difficulty": "easy",
        "keywords": ["magical forest", "mushroom", "bioluminescent"],
        "ids": ["1528641973656-5590c68be1f6", "1511497584788-876760111969", "1550684848-fac1c5b4e853"]
    },
    {
        "prompt": "Formula 1 yarış pisti, hız yapan arabalar, tribünler.",
        "category": "sports",
        "difficulty": "easy",
        "keywords": ["f1", "race car", "formula 1"],
        "ids": ["1568605117036-5fe5e7bab0b7", "1532906233215-bec55c0e176b", "1592312674239-0bd9f16ea4bc"]
    },
    {
        "prompt": "Perili köşk, terk edilmiş, karanlık pencereler, gotik mimari.",
        "category": "fantasy",
        "difficulty": "easy",
        "keywords": ["haunted house", "creepy", "gothic"],
        "ids": ["1505562723652-32130541d087", "1519074069444-1ba4fff66d16", "1518428842426-3cc220b33c04"]
    },
    {
        "prompt": "Kutup keşif ekibi, buzullar, penguenler, soğuk mavi.",
        "category": "nature",
        "difficulty": "medium",
        "keywords": ["artic", "glacier", "ice"],
        "ids": ["1478546123479-22442cf28d11", "1548396558-75fdc35414ce", "1464739111451-2475529f7f45"]
    },
    {
        "prompt": "Volkanik patlama, lav akıntısı, dumanlar, tehlikeli doğa.",
        "category": "nature",
        "difficulty": "hard",
        "keywords": ["volcano", "lava", "eruption"],
        "ids": ["1462331940023-8630676882f8", "1518182195610-1845bb08c028", "1631551107579-3d1490231934"]
    },
    {
        "prompt": "Tropikal plajda gün batımı, palmiye ağaçları, altın saat.",
        "category": "nature",
        "difficulty": "easy",
        "keywords": ["tropical", "beach", "sunset"],
        "ids": []
    },
    {
        "prompt": "Sibernetik laboratuvar, yüksek teknoloji arayüz, hologram.",
        "category": "sci-fi",
        "difficulty": "medium",
        "keywords": ["cybernetic", "lab", "hologram"],
        "ids": []
    },
    {
        "prompt": "Sonbahar ormanında antik yol, dökülen yapraklar.",
        "category": "nature",
        "difficulty": "easy",
        "keywords": ["autumn", "forest", "path"],
        "ids": []
    },
    {
        "prompt": "Kalabalık Tokyo caddesi, insan seli, şehir ışıkları.",
        "category": "landscape",
        "difficulty": "hard",
        "keywords": ["tokyo", "street", "crowd"],
        "ids": []
    },
    {
        "prompt": "Soyut geometrik şekiller, 3D render, renkli.",
        "category": "art",
        "difficulty": "hard",
        "keywords": ["abstract", "geometric", "3d"],
        "ids": []
    },
    {
        "prompt": "Klasik kütüphane, eski kitaplar, ahşap merdiven.",
        "category": "historical",
        "difficulty": "medium",
        "keywords": ["library", "books", "shelf"],
        "ids": []
    },
    {
        "prompt": "Karlı dağ zirvesi, tırmanıcı, ekstrem spor.",
        "category": "sports",
        "difficulty": "hard",
        "keywords": ["mountain", "climber", "snow"],
        "ids": []
    },
    {
        "prompt": "Su altı batığı, balıklar, gizemli.",
        "category": "nature",
        "difficulty": "medium",
        "keywords": ["shipwreck", "underwater", "ocean"],
        "ids": []
    },
    {
        "prompt": "Fütüristik uçan araba, gökdelenler, bulutlar.",
        "category": "sci-fi",
        "difficulty": "medium",
        "keywords": ["flying car", "future", "skyline"],
        "ids": []
    },
    {
        "prompt": "Orta çağ pazar tezgahı, meyveler, tüccar.",
        "category": "historical",
        "difficulty": "easy",
        "keywords": ["medieval", "market", "fruit"],
        "ids": []
    }
]

def seed_advanced(db: Session):
    print("Starting advanced seed process (Adaptive Mode)...")
    print("Target: 20 successful scenarios with 3 unique images each.")
    
    successful_scenarios_count = 0
    total_processed = 0
    
    for i, data in enumerate(SCENARIOS):
        if successful_scenarios_count >= 20:
            print(f"Goal reached! {successful_scenarios_count} scenarios seeded successfully.")
            break
            
        print(f"[{total_processed+1}/{len(SCENARIOS)}] Processing candidate: {data['prompt']}")
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
        
        # Cleanup existing images for a clean retry
        existing_images = db.query(Image).filter(Image.scenario_id == scenario.id, Image.is_ai_generated == False).all()
        for img in existing_images:
            if img.url.startswith("/static/"):
                relative_path = img.url.lstrip("/")
                full_path = os.path.join("app", relative_path)
                if os.path.exists(full_path):
                    try:
                        os.remove(full_path)
                    except:
                        pass
            db.delete(img)
        db.commit()

        print("  - Attempting to download 3 unique images...")
        
        # Sanitize keywords
        sanitized_keywords = []
        for k in data["keywords"]:
            sanitized_keywords.extend(k.split())
        base_keywords = ",".join(sanitized_keywords)
        
        scenario_hashes = set()
        count = 0
        attempts = 0
        max_attempts = 15 # Increased for better chance
        
        current_scenario_images = [] # Track images for this specific scenario attempt

        while count < 3 and attempts < max_attempts:
             attempts += 1
             unique_seed = i * 1000 + count * 100 + attempts
             
             # Primary Source: LoremFlickr
             url = f"https://loremflickr.com/800/600/{base_keywords}/all?lock={unique_seed}"
             filename = f"sc{scenario.id}_img{count+1}_{int(time.time())}_{attempts}.jpg"
             
             # Download
             saved_path = download_image(url, filename)
             
             # Fallback Source: Picsum
             if not saved_path.startswith("/static/"):
                 print(f"    Fallback to Picsum...")
                 fallback_url = f"https://picsum.photos/800/600?random={unique_seed}"
                 saved_path = download_image(fallback_url, filename)

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
                     continue # Skip this file if we can't verify it
             
                 # Add to DB buffer (not committed yet if we want transactional, but here we commit per image)
                 # Better: Add to list, commit later? No, we need DB IDs. 
                 # We will delete them if total count < 3 at the end.
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
                 time.sleep(0.8)

        if count == 3:
            print(f"  [OK] Scenario '{data['prompt'][:30]}...' seeded successfully.")
            successful_scenarios_count += 1
        else:
            print(f"  [FIX] Failed to get 3 unique images (Got {count}). Rolling back this scenario...")
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

    if successful_scenarios_count < 20:
        print(f"WARNING: Only managed to seed {successful_scenarios_count}/20 scenarios.")
    else:
        print("Advanced seed complete! 20 Scenarios ready.")

def main():
    db = SessionLocal()
    try:
        seed_advanced(db)
    finally:
        db.close()

if __name__ == "__main__":
    main()
