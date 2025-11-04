# Hafta 1 Kurulum ve Test Talimatları

## Backend Kurulumu

### 1. Virtual Environment Oluştur ve Activate Et
```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate
```

### 2. Bağımlılıkları Yükle
```bash
pip install -r requirements.txt
```

### 3. Veritabanını Seed Et (Örnek Görsel Verileri)
```bash
python -m app.scripts.seed_data
```

### 4. Sunucuyu Başlat
```bash
uvicorn app.main:app --reload
```

API: http://localhost:8000
Swagger Docs: http://localhost:8000/docs

### 5. Backend Testlerini Çalıştır
```bash
pytest
# veya coverage ile:
pytest --cov=app --cov-report=html
```

---

## Frontend Kurulumu

### 1. Bağımlılıkları Yükle
```bash
cd frontend
npm install
```

### 2. Development Server Başlat
```bash
npm run dev
```

Uygulama: http://localhost:5173

### 3. Frontend Testlerini Çalıştır
```bash
npm run test

# Coverage ile:
npm run test -- --coverage
```

---

## API Endpoints (Hafta 1)

### `GET /health`
Sistem sağlık kontrolü

### `POST /rounds`
Yeni oyun turu başlat
```json
{
  "category": "portrait",
  "difficulty": "medium"
}
```

### `POST /rounds/{round_id}/guess`
Tahmin gönder
```json
{
  "selected_index": 1
}
```

### `GET /stats`
Genel istatistikler

---

## Hafta 1 Özellikleri

### Backend
- [x] Gelişmiş GameRound, Guess, Image modelleri
- [x] Game service layer (business logic)
- [x] Tam fonksiyonel CRUD endpoints
- [x] İpucu sistemi
- [x] İlk ve ikinci tahmin mekanikleri
- [x] İstatistik hesaplama
- [x] Seed script (örnek veriler)
- [x] Pytest testleri (service + API)

### Frontend
- [x] API servisi (TypeScript)
- [x] Custom useGame hook (state management)
- [x] Tam entegre StartScreen, GameBoard, ResultScreen
- [x] ErrorDisplay componenti
- [x] Loading states
- [x] İki tahmin hakkı mekanikleri
- [x] İpucu gösterimi
- [x] Vitest testleri (4+ component)

### Test Coverage
- Frontend: 4 component test dosyası (StartScreen, GameBoard, ResultScreen, ErrorDisplay)
- Backend: 3 test dosyası (health, game_service, api)
- Hedef: %70+ coverage

---

## Gelecek Haftalar İçin Notlar

**Hafta 2:** Klasik mod, kategori sistemi
**Hafta 3:** Zamana karşı mod, leaderboard
**Hafta 4:** Kullanıcı sistemi
**Hafta 5:** Başarı rozetleri
**Hafta 6:** Zorluk seviyeleri
**Hafta 7:** MySQL geçişi, optimizasyonlar
**Hafta 8:** Multiplayer, PWA (bonus)

---

## Sorun Giderme

### Backend: "Not enough images in database"
- Çözüm: `python -m app.scripts.seed_data` çalıştırın

### Frontend: CORS hatası
- Backend'in çalıştığından emin olun
- VITE_API_URL environment variable'ını kontrol edin

### Test hataları
- Node modüllerini temizleyin: `npm ci`
- Python cache temizle: `pytest --cache-clear`

