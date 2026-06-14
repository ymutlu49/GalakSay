# Kürtçe (Kurmancî) Gerçek Ses — Klip Üretimi

Tarayıcılarda Kürtçe TTS sesi **yoktur** (KU metinler yanlışlıkla tr-TR sesiyle okunur).
Bu pipeline, **facebook/mms-tts-kmr-script_latin** (Latin Kurmancî, VITS) modeliyle
uygulamanın sınırlı KU kelime dağarcığı için statik ses klipleri üretir. Uygulama
(`src/audio/kuAudio.js`) bu klipleri çalar; klip yoksa tarayıcı TTS'e düşer (güvenli).

## Adımlar

1. **Manifest'i üret** (uygulamanın veri kaynağından sayı + işlem kelimeleri):
   ```
   node scripts/ku-tts/build-manifest.mjs
   ```
   → `scripts/ku-tts/manifest.json` (şu an 114 klip: sayılar 0-100 + zêde/kêm/car/dabeş + parçalar)

2. **Python bağımlılıkları** (tek seferlik):
   ```
   pip install torch transformers scipy
   ```

3. **Klipleri üret** (ilk çalıştırmada model ~150 MB iner, internet gerekir):
   ```
   python scripts/ku-tts/generate.py
   ```
   → `public/audio/ku/<id>.wav` + `public/audio/ku/index.json`

4. **Uygulamayı yeniden başlat** — `kuAudio` `index.json`'ı okur, klipleri çalar.

## Genişletme

Yeni klipler (cümle parçaları, rehber selamları, geri bildirimler) için:
`build-manifest.mjs` içindeki `clips`/`words` nesnesine ekle → 1-3. adımları tekrarla.
Klip id'sindeki `/` klasör olur (örn. `num/21` → `public/audio/ku/num/21.wav`).

## Özel ses (opsiyonel, sonra)

Daha doğal/yerel ses için `muzaffercky/azadiya-welat-kurdish-kurmanji-voice-v2`
veri setiyle bir VITS/MMS modelini fine-tune edip `manifest.json`'daki `model`
alanını yerel model yoluna çevir. (GPU + eğitim gerekir.)

## Lisans notu

MMS-TTS = **CC-BY-NC** (ticari olmayan). Ticari kullanım gerekiyorsa kendi
veri setinizle eğitilmiş model kullanın.
