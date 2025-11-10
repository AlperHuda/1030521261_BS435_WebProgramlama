# Hafta 2 Kurulum ve Kullanım Kılavuzu

## Yeni Özellikler

### Backend
- Kategori ve oyun modu sistemi
- 5 farklı kategori
- Kategori bazlı istatistikler
- CORS desteği

### Frontend
- Ana menü sistemi
- Mod seçim ekranı
- Kategori seçim ekranı
- İstatistik görüntüleme
- Gelişmiş oyun akışı

---

## Kurulum Adımları

### 1. Backend Setup

```bash
cd backend
.venv\Scripts\activate  # Windows: .venv\Scripts\activate
                        # Linux/Mac: source .venv/bin/activate

# Eğer yeni başlıyorsanız
pip install -r requirements.txt

# Kategorileri ve modları ekle
python -m app.scripts.seed_categories

# Görsel verileri ekle (zaten varsa tekrar çalıştırmaya gerek yok)
python -m app.scripts.seed_data

# Sunucuyu başlat
uvicorn app.main:app --reload
```

API: http://localhost:8000
Swagger Docs: http://localhost:8000/docs

### 2. Frontend Setup

```bash
cd frontend

# Eğer yeni başlıyorsanız
npm install

# Development server
npm run dev
```

Uygulama: http://localhost:5173

---

## Oyun Nasıl Oynanır?

1. **Ana Menü**
   - "Oyuna Başla" butonuna tıklayın
   - Veya "İstatistikler" ile geçmiş performansınızı görüntüleyin

2. **Mod Seçimi**
   - "Klasik Mod": İki tahmin hakkı + ipucu sistemi
   - "Zamana Karşı": (Hafta 3'te aktif olacak)

3. **Kategori Seçimi**
   - **Rastgele**: Tüm kategorilerden karışık
   - **Portre**: İnsan yüzleri
   - **Manzara**: Doğa ve manzaralar
   - **Sanat**: Sanat eserleri
   - **Mimari**: Binalar ve yapılar
   - **Hayvanlar**: Hayvan fotoğrafları

4. **Oyun**
   - 3 görsel gösterilir
   - AI tarafından üretilmiş olanı seçin
   - Yanlış yaparsanız ipucu alırsınız
   - İkinci tahmin hakkınız vardır

5. **Sonuç**
   - Başarı durumunuz gösterilir
   - "Yeni Tur" ile devam edin
   - "Ana Menü" ile menüye dönün

---

## API Endpoints (Yeni)

### Kategoriler

**GET /categories**
```bash
curl http://localhost:8000/categories
```

**GET /categories/{name}/stats**
```bash
curl http://localhost:8000/categories/portrait/stats
```

### Oyun Modları

**GET /categories/modes**
```bash
curl http://localhost:8000/categories/modes
```

---

## Test Komutları

### Backend Testleri
```bash
cd backend
pytest                          # Tüm testler
pytest app/tests/test_categories.py  # Sadece kategori testleri
pytest --cov=app --cov-report=html   # Coverage raporu
```

### Frontend Testleri
```bash
cd frontend
npm run test                    # Tüm testler
npm run test -- MenuScreen      # Belirli bir test
npm run test -- --coverage      # Coverage raporu
```

---

## Veritabanı Yapısı

### Yeni Tablolar

**categories**
- id (PK)
- name (unique, indexed)
- display_name
- description
- icon
- created_at

**game_modes**
- id (PK)
- name (unique, indexed)
- display_name
- description
- is_active
- created_at

### Mevcut Tablolar (Güncellenmiş)
- images (category field eklendi)
- game_rounds (category field eklendi)
- guesses

---

## Sorun Giderme

### Backend: "No categories found"
```bash
python -m app.scripts.seed_categories
```

### Frontend: Kategoriler yüklenmiyor
- Backend'in çalıştığından emin olun
- CORS hatası için tarayıcı konsolunu kontrol edin
- API URL'ini kontrol edin: `http://localhost:8000`

### CORS Hatası
Backend `main.py` dosyasında CORS middleware otomatik eklendi:
- localhost:5173 (Vite default)
- localhost:3000 (alternatif)

Farklı bir port kullanıyorsanız, `backend/app/main.py` dosyasındaki `allow_origins` listesine ekleyin.

### Testler başarısız oluyor
```bash
# Frontend
cd frontend
npm ci                    # node_modules'ı temizle ve tekrar yükle
npm run test -- --clearCache

# Backend
cd backend
pytest --cache-clear
```

---

## Geliştirme Notları

### Yeni Kategori Ekleme

1. `seed_categories.py` dosyasına yeni kategori ekleyin
2. `seed_data.py` dosyasında o kategori için görseller ekleyin
3. Seed scriptleri tekrar çalıştırın

### Yeni Oyun Modu Ekleme

1. `seed_categories.py` dosyasına yeni mod ekleyin
2. Frontend'de mod için gerekli logic'i implement edin
3. `is_active=True` yaparak aktif edin

---

## Performans Optimizasyonları (Hafta 2)

- API çağrıları için loading states
- Error handling her endpoint'te
- Responsive card grid layout
- CSS transitions (hover effects)
- Efficient React re-renders (proper state management)

---

## Gelecek Özellikler (Hafta 3+)

- Zamana Karşı mod (timer, countdown)
- Leaderboard sistemi
- Kullanıcı hesapları
- Başarı rozetleri
- Zorluk seviyeleri
- MySQL geçişi

---

## Önemli Dosyalar

### Backend
- `app/models/category.py` - Kategori modeli
- `app/models/game_mode.py` - Oyun modu modeli
- `app/api/categories.py` - Kategori endpoints
- `app/scripts/seed_categories.py` - Seed script
- `app/tests/test_categories.py` - Testler

### Frontend
- `src/components/MenuScreen.tsx` - Ana menü
- `src/components/ModeSelectScreen.tsx` - Mod seçimi
- `src/components/CategorySelectScreen.tsx` - Kategori seçimi
- `src/components/StatsScreen.tsx` - İstatistikler
- `src/hooks/useGame.ts` - Güncellenmiş game hook
- `src/types/game.ts` - Yeni stage'ler

---


Hafta 3'te eklenecek özellikler:
- Timer componenti
- Leaderboard UI
- Skor hesaplama sistemi
- Real-time güncellemeler (opsiyonel)

