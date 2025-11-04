# AI Görsel Tahmin Oyunu - Proje TODO Listesi

## Hafta 0: Proje İskeleti - TAMAMLANDI
- [x] Frontend (React + Vite + TypeScript) iskelet yapısı
- [x] Backend (FastAPI + SQLAlchemy) iskelet yapısı
- [x] Temel componentler (StartScreen, GameBoard, ResultScreen)
- [x] Temel test dosyaları (3 component testi)
- [x] Git repository başlatma
- [x] .gitignore ve temel konfigürasyon dosyaları

---

## Hafta 1: Temel Oyun Mekanikleri ve Backend Entegrasyonu
### Backend
- [ ] GameRound ve Guess modellerini tamamla
- [ ] Görsel veri yapısını tanımla (Image model/schema)
- [ ] `/rounds` endpoint'ini implement et (yeni tur oluştur)
- [ ] `/rounds/{id}/guess` endpoint'ini implement et (tahmin değerlendir)
- [ ] İpucu sistemi backend logic
- [ ] Backend testlerini genişlet (CRUD operations)

### Frontend
- [ ] API servisi oluştur (axios/fetch wrapper)
- [ ] Backend ile entegrasyon
- [ ] Oyun state management (useState/useContext)
- [ ] İlk tahmin ve ikinci şans mekanikleri
- [ ] İpucu gösterimi
- [ ] Loading states ve error handling

### Test
- [ ] API integration testleri
- [ ] Component testlerini genişlet
- [ ] E2E test setup (opsiyonel)

---

## Hafta 2: Oyun Modu #1 - Klasik Mod
### Backend
- [ ] Kategori sistemi (Portre, Manzara, Sanat, vb.)
- [ ] Görsel veritabanı yapısı
- [ ] Kategori bazlı round oluşturma
- [ ] `/categories` endpoint

### Frontend
- [ ] Mod seçim ekranı componenti
- [ ] Klasik mod UI/UX
- [ ] Kategori seçimi
- [ ] Görsel grid layout iyileştirmeleri
- [ ] Responsive tasarım

### Test
- [ ] Kategori testleri
- [ ] Mod seçim testleri

---

## Hafta 3: Oyun Modu #2 - Zamana Karşı Mod
### Backend
- [ ] Timer mekanizması için timestamp tracking
- [ ] Zaman bazlı skorlama sistemi
- [ ] Leaderboard modeli (User, Score, Timestamp)
- [ ] `/leaderboard` endpoint

### Frontend
- [ ] Timer componenti
- [ ] Zamana karşı mod UI
- [ ] Countdown animasyonları
- [ ] Zaman dolunca otomatik sonuç ekranı
- [ ] Skor hesaplama ve gösterim

### Test
- [ ] Timer testleri
- [ ] Skor hesaplama testleri
- [ ] Leaderboard testleri

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

