# GalakSay — Diskalkuli için Uzay Temalı Matematik Oyunu

GalakSay, diskalkuli riski taşıyan ve tipik gelişen okul öncesi / ilkokul çocukları için
öğrenme yörüngelerine (Clements–Sarama) dayalı, oyunlaştırılmış bir erken matematik
müdahale uygulamasıdır. **Her Çocuk Matematik Öğrenebilir** platformunun oyun/müdahale
ayağıdır; tarama ve profil NuMap'ten (getnumap.com), somut materyal DokunSay'dan gelir.

- Canlı: <https://galaksay.com> (uygulama `/oyna/`, tanıtım kökte)
- Üst platform: <https://hercocukmatematikogrenebilir.com>

## Hızlı başlangıç

```bash
npm ci            # bağımlılıklar
npm run dev       # http://localhost:5173/galaksay/
npm run check     # lint + 83 birim testi + derleme (gönderim öncesi kalite kapısı)
```

Ortam değişkenleri `.env.example` dosyasında; gerçek değerler `.env.local`'a yazılır
(git'e girmez). `VITE_NUMAP_API` boş bırakılırsa üretim adresi kullanılır.

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Vite geliştirme sunucusu |
| `npm run lint` | ESLint (react, react-hooks, jsx-a11y); hata sıfır olmalı |
| `npm test` / `npm run test:watch` | Vitest (jsdom) |
| `npm run build` | Umbrella derlemesi, `base=/galaksay/` → `dist/` |
| `npm run build:cf` | galaksay.com derlemesi: tanıtım sayfası kökte, uygulama `/oyna/`, PWA → `cf-deploy/` |
| `npm run preview` | `dist/` önizlemesi |

## Mimari

```
index.html            Kabuk: global CSS (uzay teması, erişilebilirlik sınıfları), HÇMÖ a11y widget'ı
src/main.jsx          Giriş kapısı: splash → rıza → karşılama → öğrenci/öğretmen girişi → çocuk seçimi → oyun
GalakSay.jsx          Oyun motoru (tek dosya): 65 mod (9 gezegen, `MODE_COUNT` ile hesaplanır), soru üretimi, adaptif zorluk, ipucu, TTS, hikâye, ödüller
src/screens/          Karşılama, öğretmen girişi, öğrenci seçici, çocuk formu, sınıf paneli, ayarlar, galaksi haritası
src/systems/          adaptiveEngine, hintManager, fluencyEngine, frustrationDetection, anxietyTracker, numapProfile
src/data/             modeStories (TR/KU), ltTrajectories (yörünge eşlemesi), mebKazanim, numWords, wordProblemTemplates
src/services/         localProfiles (yerel çocuk/kullanıcı, PBKDF2 PIN), numapApi, portalBridge, syncEngine
src/analytics/        Oturum olayları, performans analizi, risk sınıflandırma, PDF/CSV rapor
src/audio/            SFX (Web Audio), TTS (Web Speech), Kürtçe ses paketi (public/audio/ku)
src/components/math/  Üçlü kod (somut–görsel–sembolik) katmanları, didaktik animasyonlar
src/core/DokunSayKit/ Enerji kapsülü, pul, materyal fiziği (DokunSay somut materyal karşılıkları)
site/                 galaksay.com tanıtım sayfası + manifest + sw.js + ikonlar
scripts/build-cf.mjs  Cloudflare Pages derleme betiği
```

Dil desteği: Türkçe ve Kürtçe (Kurmancî). Kürtçe sözlükler `*_KU` sabitleriyle Türkçe
anahtarlarıyla birebir eşleşir.

## Kimlik ve veri

- **Öğretmen / uzman:** NuMap hesabı (Bearer token, `?sso=` bileti ile tek oturum) ya da
  cihazda yerel hesap (yönetici PIN'i + yerel kullanıcılar).
- **Çocuk:** takma ad + isteğe bağlı 4 haneli PIN; PIN PBKDF2 ile hash'lenir, düz metin saklanmaz.
- Çocuk ilerlemesi cihazda (localStorage/IndexedDB) tutulur; rıza verilmişse NuMap'e ve
  HÇMÖ portalının ortak sonuç havuzuna (`/api/app-results`) eşitlenir.
- "Verileri sil" akışı çocuğa ait tüm anahtarları temizler (sonek çakışması testli).

## Dağıtım

- **galaksay.com (Cloudflare Pages, proje `galaksay`):** `main`'e her gönderimde
  `.github/workflows/deploy-cloudflare.yml` çalışır: lint → test → `build:cf` → wrangler.
  Depo sırları `CLOUDFLARE_API_TOKEN` ve `CLOUDFLARE_ACCOUNT_ID` girilene kadar dağıtım adımı atlanır.
- **GitHub Pages aynası:** `.github/workflows/deploy.yml` (`base=/galaksay/`).
- Elle: `npm run build:cf && npx wrangler pages deploy cf-deploy --project-name galaksay`.

## Test ve denetim

Birim testleri `src/**/*.test.js` altında (localProfiles, adaptiveEngine, crypto, consent,
dataExport, errorClassifier, numWords, useAutoSave, ParentalGate). Tarayıcı duman testi için
Playwright ile karşılama → yönetici PIN → öğrenci ekle → hikâye → gezegen → görev akışı
sıfır çalışma zamanı hatasıyla doğrulanmıştır.

## Sunum ve demo

- `docs/SUNUM_REHBERI.md`: sunum öncesi kontrol listesi, 12 dakikalık gösterim akışı, soru-yanıt ve acil durum planı.
- `docs/booklet/`: basılabilir A4 tanıtım kitapçığı (HTML + PDF).
- **Demo sınıfı:** Yerel Yönetim ekranının altındaki "Demo sınıfını yükle" 4 örnek öğrenci ve 24 günlük
  gerçekçi geçmiş oluşturur (`demo: true` ile işaretli, "Demo sınıfını kaldır" ile izsiz silinir).
- **Keşif Uçuşu:** Numap taraması olmayan çocuk için 8 maddelik başlangıç değerlendirmesi (sanal mod
  `calibration`, `CALIB_SEQ`); sonuç `ds_placement_<ns>` anahtarında ve roster kaydında (`placement.riskFlag`)
  tutulur, `resolveStartLevel` ilk düzeyi buna göre seçer; oyun istatistiğine/rozete yazılmaz.
- **Bilimsel temel:** Yönetici Ayarlar › Hakkında › "Bilimsel temel ve kaynaklar" (`src/screens/EvidenceBase.jsx`);
  araştırma dayanağı `site/index.html` "Kanıt temeli" bölümünde de yayımlanır.

## Analitik ve raporlama ilkeleri

- Risk ölçeği 1–6 (1–2 düşük, 3–4 orta, 5–6 yüksek); bir alan en az 8 madde, genel düzey en az 15 madde
  ile hesaplanır; altındaki durumlar "yetersiz veri" olarak raporlanır.
- Doz hedefi 42 oturum / haftada 3 oturum (Kohn ve ark., 2020); ilerleme grafiğinde hedef çizgisi ve
  NCII 4-nokta kuralı (≥6 oturum) uygulanır.
- CSV dışa aktarımı uzun formatta, BOM'lu ve formül enjeksiyonuna karşı korumalıdır; `events.csv`
  madde düzeyinde `moduleId`, `questionType`, `errorType`, `localDate`; `sessions.csv` `isRealSession`
  (soru yanıtlanmamış <1 dk oturumlar 0) taşır. Anonim CSV takma kimlik kullanır.

## Sürüm

`package.json` içindeki sürüm tek kaynaktır (`__APP_VERSION__` → `src/version.js`, sw.js damgası, PDF altbilgisi, olay kayıtları); değişiklik notları commit geçmişindedir.
