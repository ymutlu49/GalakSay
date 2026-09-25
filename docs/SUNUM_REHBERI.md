# GalakSay — Sunum Rehberi

Bu rehber, GalakSay'ı bir konferans/tanıtım ortamında 12–15 dakikada, hatasız ve kanıt temelli
biçimde göstermek için hazırlanmıştır. Adımlar uygulamanın gerçek akışını izler; her adımda
"ne gösterilir" ve "ne söylenir" birlikte verilir.

---

## 0. Sunumdan önce (kontrol listesi)

| # | Kontrol | Nasıl |
|---|---------|-------|
| 1 | **galaksay.com güncel mi?** | Sürüm kontrolü: uygulamada *Yönetici → Ayarlar → Hakkında* sürüm numarası `package.json` ile aynı olmalı. Otomatik dağıtım için GitHub → GalakSay deposu → *Settings → Secrets and variables → Actions* içine `CLOUDFLARE_API_TOKEN` ve `CLOUDFLARE_ACCOUNT_ID` girin; girilene kadar iş akışı "yeşil" görünse de dağıtım adımı **atlanır** (25 Eyl 2026'da bu yüzden site 6 Ağustos sürümünde kalmıştı). Elle dağıtım: `npm run build:cf && npx wrangler pages deploy cf-deploy --project-name galaksay --branch main`. |
| 2 | Yedek adres | `https://ymutlu49.github.io/GalakSay/` (GitHub Pages aynası; aynı uygulama, tanıtım sayfası yok). |
| 3 | Çevrimdışı güvence | Sunum cihazında uygulamayı bir kez açıp bir görev oynayın; uygulama kabuğu cihaza önbelleğe alınır, salon interneti kesilse de çalışır. Kürtçe ses paketi ilk kullanımda iner; Kürtçe gösterecekseniz bir kez Kürtçe bir görev oynayın. |
| 4 | Demo sınıfı | *Öğretmen / Uzman Girişi → Yerel Hesap → Yönetici PIN → Yerel Yönetim* ekranının altındaki **"Demo sınıfını yükle"**. 4 öğrenci ve 24 günlük gerçekçi geçmiş yüklenir; sunum sonrası **"Demo sınıfını kaldır"** ile iz bırakmadan silinir. |
| 5 | Ses | Cihaz sesi açık; *Ayarlar → Sesli Yönergeler* açık (okuma bilmeyen çocuk deneyimi için). Öğretmen başlattığı oturumda Ayarlar ebeveyn kapısı sormaz; çocuğun kendi girişinde sorar. |
| 5b | Tarayıcı önbelleği | Sunum cihazında galaksay.com daha önce açıldıysa **iki kez yenileyin** (service worker yeni sürümü ikinci yüklemede etkinleştirir) ya da gizli pencere kullanın. |
| 6 | Ekran | Tablet yatay ya da dizüstü + projeksiyon; tarayıcı tam ekran (F11). Metin büyütme gerekiyorsa *Ayarlar → Büyük metin*. |
| 7 | Tarayıcı | Güncel Chrome/Safari/Edge. Sekmede başka uygulama açık olmasın. |

---

## 1. Açılış — Sorun ve iddia (1 dk)

**Göster:** galaksay.com tanıtım sayfası, "Kanıt temeli" bölümü.

**Söyle:** "Her 100 çocuktan 3–7'si sayı ve nicelikleri işlemede kalıcı güçlük yaşıyor
(Morsanyi ve ark., 2018: %5,7). Bu bir zekâ sorunu değil. Meta-analizler, doğru tasarlanmış
müdahalelerin büyük etki ürettiğini gösteriyor (Chodura ve ark., 2015: d = 0,83). GalakSay bir
oyun değil; oyun görünümlü bir öğretim programı."

---

## 2. Öğretmen girişi ve sınıf panosu (2 dk)

**Göster:** *Öğretmen / Uzman Girişi → Yerel Hesap → Yönetici → Sınıf İlerlemesi*.

- 4 demo öğrenci: **Elif** (güçlü ilerleme), **Yusuf** (diskalkuli risk profili), **Zeynep**
  (okul öncesi), **Mert** (2. sınıf, akıcılık sorunu).
- Yusuf satırını açın: düşük doğruluk, yüksek risk (6/6), öncelikli alanlar, kategori çubukları.
- Satırın altındaki **"📊 Gelişim paneli ve PDF"** düğmesi çocuğun tam analitik panelini doğrudan açar
  (hub'a uğramadan); **"▶ Yusuf ile oyna"** ise çocuk merkezine götürür.
- **"Sınıf raporu (PDF)"** ve **"Veri (CSV)"** düğmelerini gösterin (anonim CSV: KVKK).

**Söyle:** "Öğretmen için erken sayı becerilerinde müfredata dayalı ölçmeden esinlenen
göstergeler: doğruluk, hız, ipucu kullanımı, hata tipi ve öğrenme yörüngesi düzeyi. Veri
cihazda kalır; rıza verilirse NuMap'e eşitlenir."

---

## 3. Çocuk gözünden bir görev (5 dk) — sunumun kalbi

**Göster:** Ana ekran → *Öğrenci Girişi* → **Elif**'e dokun → *Elif ile Keşfet* → Galaksi
Haritası.

1. **Harita:** "Yıldız Keşfi" tamamlanmış, "Gezegen Düellosu" açık. Kilitli gezegenler
   Clements–Sarama sırasını temsil eder: sayma → nicelik → karşılaştırma → parça-bütün → işlem.
2. **Kaptan Köşesi**'ni açın: kristaller, günlük, eserler → motivasyon sistemi öğrenme eylemine
   bağlı, rastgele ödül yok.
3. Gezegen paneli → **Göktaşı Say!** → *Göreve Başla* → **"Kısa"** (5 soru) → *Başla*.
4. Soruda: **🗣️ Soruyu dinle** (sesli yönerge), seçeneklerde rakam + yazı ("5 beş").
5. **Bilerek yanlış cevap verin:** turuncu şerit doğru cevabı ve stratejiyi açıklar
   ("her taşı tek tek say, son söylediğin sayı cevaptır").
   *Söyle:* "Açıklayıcı geri bildirim ES 0,49; yalnız doğru/yanlış 0,05 (Van der Kleij, 2015)."
6. **İpucu** düğmesi: somut → görsel → sembolik kademeler (CRA). **Nesnelerle Göster** ile
   manipülatifi açın.
7. Görevi bitirin: sonuç ekranı → yıldızlar, yörünge ilerlemesi, "Seviye 3'e yüksel" (adaptif
   zorluk), "Detaylar".

---

## 3b. Keşif Uçuşu — 90 saniyelik başlangıç değerlendirmesi (isteğe bağlı, 2 dk)

**Göster:** Yeni bir öğrenci ekleyin (ör. "Ada") → Çocuk Merkezi → **"🧭 Keşif Uçuşu ile başla"**
(ya da haritadaki davet). 8 kısa soru: sayma, anlık algılama, karşılaştırma, sayı doğrusu, geriye
sayma, komşu sayı, onluk çerçeve. Sonuç ekranı alan bazlı çubuklar, "güçlü olduğun alanlar" ve
"birlikte çalışacağımız alanlar" gösterir; başlangıç düzeyleri buna göre ayarlanır, %50 altı
doğrulukta öğretmen panosunda "🧭 destek" bayrağı çıkar.

**Söyle:** "Kısa uyarlanabilir başlangıç değerlendirmesi, erken sayı becerileri için tarama
literatüründeki en yordayıcı görevlere (miktar ayrımı, eksik sayı, sayma) dayanır; tanı koymaz,
başlangıç noktasını belirler."

## 4. Uyarlanabilirlik ve kaygıya duyarlılık (2 dk)

**Göster:** Aynı görevi **Yusuf** ile açın (risk profili). Üst üste iki yanlış yapın.

- Hayal kırıklığı algılama devreye girer: bir çeldirici elenir, rehber karakter destek verir.
- Seviye seçim ekranında "Seviye 3 için %60 başarı gerekli" kilidi: ustalaşmadan ilerleme yok.
- *Ayarlar → Oturum süresi hatırlatması / Mola*: doz ve süre sınırı.

**Söyle:** "Diskalkulik çocuklarda yüksek matematik kaygısı iki kat yaygın (Devine ve ark.,
2018). Ceza yok, olumsuz ses yok, hız baskısı yalnızca öğrenilmiş becerilerde (Akıcılık Modu)."

---

## 5. Dil ve erişilebilirlik (1 dk)

**Göster:** *Ayarlar → Dil → Kurmancî* → bir görev başlığı ve sesli yönerge.
*Ayarlar → Büyük metin / Yüksek kontrast*.

**Söyle:** "Türkçe ve Kürtçe; 44 px dokunma hedefleri, ekran okuyucu başlıkları, kendi
sunduğumuz yazı tipleri. Üçüncü taraf izleme yok."

---

## 6. Rapor ve kapanış (2 dk)

**Göster:** *Sınıf İlerlemesi* → Elif satırı → **"📊 Gelişim paneli ve PDF"** → sağ üstte **PDF rapor**.
(Alternatif yol: Çocuk Merkezi → Analiz & Takip → Gelişim Paneli.)

**Söyle:** "Öğretmenin cebinde: kategori bazlı doğruluk ve hız eğilimleri, yörünge düzeyi,
güçlü/zayıf alanlar, risk göstergesi ve somut sonraki adım. MEB 2024 öğrenme çıktılarıyla eşli."

Kapanış cümlesi: "Öğrenme yörüngeleri, hataya özgü CRA ipuçları, uyarlanabilir zorluk ve veri
temelli öğretmen izlemesi; Türkçe–Kürtçe, tamamen tarayıcıda, veriler cihazda."

---

## 7. Olası sorular ve kısa yanıtlar

- **"Etkililik çalışmanız var mı?"** — Henüz yayımlanmış bir GalakSay etki çalışması yok;
  tasarım bileşenleri meta-analiz ve uygulama kılavuzlarına dayanıyor. Uygulama, etki çalışması
  için gereken oturum bazlı veriyi (CSV/PDF) üretir.
- **"Ne kadar kullanılmalı?"** — Haftada 3–5 kez, 15–20 dakika; literatürde kalıcı kazanım için
  ≈42 oturum (Kohn ve ark., 2020).
- **"Veri nereye gidiyor?"** — Cihaza. Rıza verilirse NuMap ve HÇMÖ platform havuzuna;
  "Verileri sil" tüm kayıtları (localStorage + IndexedDB) temizler.
- **"Tanı koyuyor mu?"** — Hayır; tarama ve ilerleme verisi uzman değerlendirmesini destekler.
- **"Kürtçe içerik tam mı?"** — Görevler, hikâyeler, sözel problemler ve sesli yönergeler
  Kurmancî; Öğren modülünün bazı adımları Türkçeye düşer.

---

## 8. Acil durum planı

| Sorun | Çözüm |
|-------|-------|
| İnternet yok | Uygulama önbellekten açılır (adım 0.3 yapıldıysa). Tanıtım sayfası yerine doğrudan `/oyna/`. |
| galaksay.com eski sürüm | `https://ymutlu49.github.io/GalakSay/` |
| Ses çıkmıyor | Sekmede bir kez dokunma gerekir (tarayıcı ses kilidi); *Ayarlar → Ses Efektleri* açık mı? |
| Ekran donuk göründü | Sayfayı yenileyin; oturum kaldığı yerden devam eder (otomatik kayıt). |
| Demo verisi bozuldu | *Yerel Yönetim → Demo sınıfını kaldır → Demo sınıfını yükle*. |
