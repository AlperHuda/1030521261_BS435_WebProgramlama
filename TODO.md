# AI Görsel Tahmin Oyunu - Proje TODO Listesi

## Hafta 0: Proje İskeleti - TAMAMLANDI
- [x] Frontend (React + Vite + TypeScript) iskelet yapısı
- [x] Backend (FastAPI + SQLAlchemy) iskelet yapısı
- [x] Temel componentler (StartScreen, GameBoard, ResultScreen)
- [x] Temel test dosyaları (3 component testi)
- [x] Git repository başlatma
- [x] .gitignore ve temel konfigürasyon dosyaları

---

## Hafta 1: Temel Oyun Mekanikleri ve Backend Entegrasyonu - TAMAMLANDI
### Backend
- [x] GameRound ve Guess modellerini tamamla
- [x] Görsel veri yapısını tanımla (Image model/schema)
- [x] `/rounds` endpoint'ini implement et (yeni tur oluştur)
- [x] `/rounds/{id}/guess` endpoint'ini implement et (tahmin değerlendir)
- [x] İpucu sistemi backend logic
- [x] Backend testlerini genişlet (CRUD operations)

### Frontend
- [x] API servisi oluştur (axios/fetch wrapper)
- [x] Backend ile entegrasyon
- [x] Oyun state management (useState/useContext)
- [x] İlk tahmin ve ikinci şans mekanikleri
- [x] İpucu gösterimi
- [x] Loading states ve error handling

### Test
- [x] API integration testleri
- [x] Component testlerini genişlet
- [x] E2E test setup (opsiyonel)

---

## Hafta 2: Oyun Modu #1 - Klasik Mod - TAMAMLANDI
### Backend
- [x] Kategori sistemi (Portre, Manzara, Sanat, vb.)
- [x] Görsel veritabanı yapısı
- [x] Kategori bazlı round oluşturma
- [x] `/categories` endpoint
- [x] `/categories/modes` endpoint
- [x] CORS middleware

### Frontend
- [x] Mod seçim ekranı componenti
- [x] Klasik mod UI/UX
- [x] Kategori seçimi
- [x] Görsel grid layout iyileştirmeleri
- [x] Responsive tasarım
- [x] Ana menü ekranı
- [x] İstatistik ekranı

### Test
- [x] Kategori testleri
- [x] Mod seçim testleri
- [x] Backend kategori endpoint testleri

---

## Hafta 3: Oyun Modu #2 - Zamana Karşı Mod - TAMAMLANDI
### Backend
- [x] Timer mekanizması için timestamp tracking
- [x] Zaman bazlı skorlama sistemi
- [x] Leaderboard modeli (User, Score, Timestamp)
- [x] `/leaderboard` endpoint (POST, GET, GET /top/{mode}, GET /player/{name})
- [x] GameRound modelinde game_mode, start_time, end_time, time_limit
- [x] Leaderboard ranking sistemi

### Frontend
- [x] Timer componenti (countdown, progress bar, color changes)
- [x] Zamana karşı mod UI
- [x] Countdown animasyonları
- [x] Zaman dolunca otomatik sonuç ekranı
- [x] Skor hesaplama ve gösterim
- [x] PlayerNameModal componenti
- [x] LeaderboardScreen componenti
- [x] Sıralama tablosu gösterimi

### Test
- [x] Timer testleri (4 test)
- [x] Skor hesaplama testleri
- [x] Leaderboard testleri (4 backend test)
- [x] LeaderboardScreen testleri (3 frontend test)

---

## Hafta 4: Kullanıcı Sistemi ve İstatistikler
### Backend
- [ ] User modeli (kullanıcı adı, istatistikler)
- [ ] Session/Authentication (basit token sistemi)
- [ ] `/auth/register` ve `/auth/login` endpoints
- [ ] Kullanıcı bazlı istatistikler
- [ ] `/users/{id}/stats` endpoint

### Frontend
- [ ] Login/Register formları
- [ ] User context/provider
- [ ] Profil sayfası
- [ ] İstatistik dashboard (doğruluk oranı, toplam oyun, vb.)
- [ ] LocalStorage ile session yönetimi

### Test
- [ ] Authentication testleri
- [ ] User stats testleri
- [ ] Form validation testleri

---

## Hafta 5: Başarı Rozetleri ve Gamification
### Backend
- [ ] Achievement modeli
- [ ] Rozet kazanma logic
- [ ] `/users/{id}/achievements` endpoint
- [ ] Rozet kategorileri (İlk oyun, 10 doğru tahmin, vb.)

### Frontend
- [ ] Achievement/Badge componenti
- [ ] Rozet galeri sayfası
- [ ] Rozet kazanma animasyonu/modal
- [ ] Progress bar componentleri
- [ ] Bildirim sistemi

### Test
- [ ] Achievement logic testleri
- [ ] Badge component testleri
- [ ] Progress tracking testleri

---

## Hafta 6: Zorluk Seviyeleri ve Gelişmiş Özellikler
### Backend
- [ ] Difficulty seviyeleri (Kolay, Orta, Zor)
- [ ] Zorluk bazlı görsel seçimi
- [ ] Hint sayısı ve kalitesi ayarları
- [ ] `/settings` endpoint

### Frontend
- [ ] Zorluk seçim UI
- [ ] Settings/Ayarlar sayfası
- [ ] Hint limitleri ve gösterimi
- [ ] Zorluk bazlı UI değişimleri
- [ ] Erişilebilirlik iyileştirmeleri (a11y)

### Test
- [ ] Zorluk seviyesi testleri
- [ ] Settings testleri
- [ ] Accessibility testleri

---

## Hafta 7: Polish, Optimizasyon ve MySQL Geçişi
### Backend
- [ ] SQLite'dan MySQL'e geçiş
- [ ] Database migration scripts
- [ ] Performance optimizasyonları (indexing, query optimization)
- [ ] API rate limiting
- [ ] CORS konfigürasyonu
- [ ] Production hazırlıkları

### Frontend
- [ ] UI/UX polish (animasyonlar, transitions)
- [ ] Error boundary implementation
- [ ] Loading skeletons
- [ ] Image lazy loading
- [ ] Performance optimizasyonları (code splitting, memoization)
- [ ] SEO meta tags

### Test
- [ ] Test coverage %70+ hedefi
- [ ] Integration testleri
- [ ] Performance testleri

---

## Hafta 8: Bonus Özellikler ve Deployment (Opsiyonel)
### Backend
- [ ] Çoklu oyuncu (multiplayer) altyapısı (WebSocket)
- [ ] Real-time leaderboard
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Docker containerization
- [ ] CI/CD pipeline

### Frontend
- [ ] Multiplayer lobby sistemi
- [ ] Real-time güncellemeler
- [ ] Dark mode
- [ ] Çoklu dil desteği (i18n)
- [ ] PWA özellikleri
- [ ] Build ve deployment

### Test & Dokümantasyon
- [ ] Tüm testlerin gözden geçirilmesi
- [ ] Kullanıcı dokümantasyonu
- [ ] Geliştirici dokümantasyonu
- [ ] Video demo hazırlığı

---

## Notlandırma Kriterleri Kontrol Listesi
- [ ] En az 2 oyun modu (Klasik + Zamana Karşı)
- [ ] Tüm componentler fonksiyonel (class-based yok)
- [ ] En az %70 test coverage (en az 3 component)
- [ ] Backend ile veritabanı entegrasyonu
- [ ] SQLite + MySQL geçiş desteği

---

## Notlar
- Her mod için en az 1 test yazılacak
- Backend endpoint'leri Postman/Thunder Client ile test edilecek

