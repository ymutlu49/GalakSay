# Galaksay'ı Google Play'e çıkarma rehberi

**Tarih:** 10 Ekim 2026 · **Durum:** Web tarafı yayında; imzalı paket hazır; Play Console adımları sizde (§4).

## 1. Yaklaşım

Play sürümü ayrı bir uygulama değildir. **Trusted Web Activity (TWA)** paketidir: Android uygulaması `https://galaksay.com/oyna/?kaynak=play` adresini adres çubuğu olmadan, tam ekran açar.

- **Tek kod tabanı:** Web'e yapılan her güncelleme uygulamaya da gelir; mağazaya yeniden yüklemek gerekmez. Yalnız simge, ad ya da paket ayarı değişirse yeni sürüm yüklenir.
- **Aynı davranış:** Çevrimdışı çalışma, sesli okuma, Türkçe ve Kurmancî web'deki gibidir.
- **Cihazda kalan veri:** İlerleme, Android'deki Chrome'un bu site için ayırdığı depoda kalır. Uygulama silinirse bu veri de silinebilir. Yedekleme yolu: yetişkin paneli → Ayarlar → Verileri dışa aktar.
- **Bağımsızlık:** Uygulama NuMap'ten bağımsız çalışır. NuMap bağlantısı yalnız öğretmen isterse yetişkin panelinden kurulur.

| Ayar | Değer |
|---|---|
| Paket adı | **`com.galaksay.app`** (ilk yüklemeden sonra değiştirilemez) |
| Başlangıç adresi | `/oyna/?kaynak=play` |
| Ekran | standalone, dikey |
| Bildirim, konum, faturalama | kapalı |

Ayarların tamamı: `twa/twa-manifest.json`.

## 2. Web tarafında yapılanlar (yayında)

| Ne | Nerede | Neden |
|---|---|---|
| **Uygulama kipi** | `oyna/galaksay-ek.js` §11 | `?kaynak=play`, Android uygulamasından açılış ya da ana ekran kipi algılanır. Bu kipte çocuk ekranlarında site dışına giden bağlantı gösterilmez (Google Play aile politikası). |
| Merkezin alt bağlantıları | `kaynak/WelcomeScreen.captain.js` | Uygulama kipinde gizlenir. Kılavuz, gizlilik, kullanım şartları, erişilebilirlik ve tanıtım bağlantıları yetişkin şifreli **Cihaz ayarları → Bilgi ve yasal metinler** bölümüne taşındı. |
| Oyun içi NuMap düğmesi | `kaynak/play_magaza.py` | Sınıf seçme ekranındaki getnumap.com düğmesi uygulama kipinde gösterilmez. |
| Manifest | `manifest.webmanifest` | Açıklamadan "tarama" iddiası çıkarıldı; mağaza önizlemesi için 4 ekran görüntüsü eklendi. |
| Alan adı doğrulaması | `.well-known/assetlinks.json` | Paket adı hazır; parmak izleri §4'te eklenecek. |
| CSP | `_headers` | Kullanılmayan Cloudflare analitik izinleri kaldırıldı ("üçüncü taraf analitik yok" beyanı teknik olarak da güvencede). |
| Gizlilik metni | `gizlilik.html` | "Android uygulaması (Google Play)" bölümü. |

Oyunun yetişkin bölümlerindeki bağlantılar yetişkin şifresinin arkasındadır ve yerinde kalır (örn. Ayarlar → Aydınlatma metinleri).

## 3. Paket (hazır)

Paket bu oturumda Bubblewrap 1.27 ve Android SDK 36 ile derlendi ve imzalandı. Derleme yöntemi: `twa/derle.md`.

| Dosya | Ne için |
|---|---|
| `galaksay-1.0.0.aab` | Play Console'a yüklenecek paket (sürüm 1.0.0, sürüm kodu 1) |
| `galaksay-1.0.0-test.apk` | Telefona doğrudan kurup denemek için (aynı imza) |
| `galaksay-yukleme-anahtari.zip` | Yükleme anahtarı ve parolası. **Yalnız sizde kalmalı; depoya konmadı.** |

Paket bilgileri:
- **Paket adı:** `com.galaksay.app`. Alan adınızdan türetilen standart biçimdir; kısa, dilden bağımsız ve kalıcıdır. Play'de boştaydı.
- **Hedef sürüm:** Android 16 (SDK 36); en düşük sürüm Android 7 (SDK 24).
- **İzinler:** Uygulama İnternet izni bile istemez; içeriği cihazdaki Chrome açar. Yalnız Android'in zorunlu iç izni (`DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`) vardır.
- **Yükleme anahtarı SHA-256:** `2B:35:E3:C1:B3:01:C1:71:BB:C3:F8:71:37:1B:F5:D9:87:D9:95:89:70:E6:41:D2:44:D7:15:19:79:73:4F:AA`. Bu değer `assetlinks.json`'a eklendi ve yayında.

> **Yükleme anahtarını kaybetmeyin.** İki ayrı yerde saklayın (ör. şifreli bir USB bellek ve parola yöneticisi). Play App Signing açık olduğu için uygulamayı Google'ın anahtarı imzalar. Bu dosya yalnız sizin yükleme yaptığınızı kanıtlar; kaybolursa Play Console → Uygulama bütünlüğü üzerinden sıfırlatılabilir. Sonraki güncellemeler de bu anahtarla imzalanır.

## 4. Play Console'da yapılacaklar (sizin hesabınızla)

Play Console'a sizin adınıza giriş yapamıyorum. Hesabınıza erişimim yok ve Google parolanızı istemem doğru olmaz. Aşağıdaki adımlar yaklaşık 30–45 dakika sürer; bütün metin ve yanıtlar hazır.

1. **Uygulama oluştur** (Tüm uygulamalar → Uygulama oluştur):
   - ad: `Galaksay: Sayılar Galaksisi`
   - varsayılan dil: Türkçe – tr-TR
   - Oyun, Ücretsiz
   - beyan kutularını işaretleyin.
2. **Dahili test → Yeni sürüm oluştur:**
   - "Play App Signing"i varsayılan haliyle kabul edin (Google imzalasın).
   - `galaksay-1.0.0.aab` dosyasını yükleyin. Sürüm notu: `İlk sürüm.`
   - Kendi e-postanızı test kullanıcısı olarak ekleyip yayınlayın. Dahili test dakikalar içinde telefonunuza gelir.
3. **Kurulum → Uygulama bütünlüğü → Uygulama imzalama anahtarı sertifikası** altındaki **SHA-256** değerini bana iletin. Bu değer gizli değildir. `assetlinks.json`'a eklerim; uygulama Play'den kurulduğunda üstteki adres çubuğu kalkar.
4. **Politika → Uygulama içeriği:** `beyanlar.md`'deki yanıtlarla doldurun. Bölümler: gizlilik, uygulama erişimi, reklam, içerik derecelendirmesi, hedef kitle, veri güvenliği, devlet/finans/sağlık.
5. **Büyüme → Mağaza girişi:** `magaza-metinleri.md` ve `gorseller/` dosyalarını kullanın. İletişim e-postası: `y.mutlu@alparslan.edu.tr`, web sitesi: `https://galaksay.com`.
6. **Kapalı test ve üretim:**
   - Hesabınız 13 Kasım 2023'ten sonra açılmış bir kişisel hesapsa, üretimden önce kapalı test şartı vardır (bugün en az 12 test kullanıcısı, 14 gün; güncel koşulu Play Console gösterir).
   - Daha eski bir hesap ya da kurum hesabıysa bu şart yoktur; "Üretim → Yeni sürüm" ile aynı `.aab` yayına gönderilebilir.

**İsteğe bağlı: sonraki güncellemeleri benim yüklemem için.**
1. Google Cloud'da bir hizmet hesabı açılır ve Play Console → Kullanıcılar ve izinler'den bu uygulama için yetki verilir.
2. Hizmet hesabının JSON anahtarı GitHub deposuna `PLAY_HIZMET_HESABI` gizli değeri olarak eklenir. Bu anahtarı sohbete yazmayın.
3. Bundan sonra yeni paket ve mağaza metni güncellemelerini bir iş akışıyla ben yükleyebilirim.

İlk yükleme ve "Uygulama içeriği" formları bu yolla da yapılamaz; onlar her zaman Console'dan yapılır.

## 4a. Adres çubuğu doğrulaması

Google'ın imza parmak izi eklendikten sonra doğrulamak için:
- https://developers.google.com/digital-asset-links/tools/generator adresine gidin.
- Alan adı `galaksay.com`, paket `com.galaksay.app` ve parmak izini girip "Test statement" yapın.
- Doğrulama tutarsa uygulama tam ekran açılır.

## 5. Bilinen sınırlar ve sonraki adımlar

- **iOS:** Apple, web sarmalayıcı uygulamaları sık reddediyor. iPhone ve iPad için şimdilik Safari → Paylaş → "Ana Ekrana Ekle" yolu öneriliyor (aynı uygulama kipi çalışır).
- **Tablet yönü:** Paket dikey kilitli. Sınıfta yatay tabletler yaygınsa `orientation` değeri `default` yapılıp yatay ekran denetimiyle yeni sürüm çıkarılabilir.
- **Kurmancî mağaza girişi:** Play Console'un dil listesinde yoksa Kurmancî tanıtım, Türkçe açıklamanın içinde kısa bir paragraf olarak eklenebilir.
- **Sürüm güncellemesi:** Web güncellemeleri kendiliğinden gelir. Paket ayarı değişirse `appVersionCode` bir artırılarak yeni `.aab` yüklenir.
