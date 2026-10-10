# Galaksay'ı Google Play'e çıkarma rehberi

**Tarih:** 10 Ekim 2026 · **Durum:** Web tarafı hazır ve yayında; paketleme ve mağaza adımları sizde.

## 1. Yaklaşım

Play sürümü ayrı bir uygulama değildir. **Trusted Web Activity (TWA)** paketidir: Android uygulaması `https://galaksay.com/oyna/?kaynak=play` adresini adres çubuğu olmadan, tam ekran açar.

- **Tek kod tabanı:** Web'e yapılan her güncelleme uygulamaya da gelir; mağazaya yeniden yüklemek gerekmez. Yalnız simge, ad ya da paket ayarı değişirse yeni sürüm yüklenir.
- **Aynı davranış:** Çevrimdışı çalışma, sesli okuma, Türkçe ve Kurmancî web'deki gibidir.
- **Cihazda kalan veri:** İlerleme, Android'deki Chrome'un bu site için ayırdığı depoda kalır. Uygulama silinirse bu veri de silinebilir. Yedekleme yolu: yetişkin paneli → Ayarlar → Verileri dışa aktar.
- **Bağımsızlık:** Uygulama NuMap'ten bağımsız çalışır. NuMap bağlantısı yalnız öğretmen isterse yetişkin panelinden kurulur.

| Ayar | Değer |
|---|---|
| Paket adı | **`com.galaksay.oyun`** (ilk yüklemeden sonra değiştirilemez; başka bir ad isterseniz şimdi söyleyin) |
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

## 3. Sizin adımlarınız

### 3.1 Geliştirici hesabı
1. https://play.google.com/console adresinde geliştirici hesabı açın. Tek seferlik kayıt ücreti vardır.
2. **Hesap türü:**
   - *Kişisel hesap:* Kimlik doğrulaması gerekir. Yeni kişisel hesaplardan, üretime çıkmadan önce bir **kapalı test** istenir. Bugünkü koşul en az 12 test kullanıcısı ve 14 gündür; güncel koşulu Play Console'da teyit edin.
   - *Kurum hesabı:* Üniversite ya da şirket adına yayın için. D-U-N-S numarası gerekir. Önce Teknoloji Transfer Ofisi ile hak sahipliğini netleştirin.

### 3.2 Paketi oluşturma (komut satırı gerekmez)
1. https://www.pwabuilder.com adresine `https://galaksay.com/oyna/` yazın → **Package for stores** → **Android** → **Generate Package**.
2. "Options"ta şunları girin:
   - **Package ID:** `com.galaksay.oyun`
   - **App name:** `Galaksay: Sayılar Galaksisi`
   - **Launcher name:** `Galaksay`
   - **App version:** `1.0.0` · **Version code:** `1`
   - **Host:** `galaksay.com` · **Start URL:** `/oyna/?kaynak=play`
   - **Theme / Background / Nav color:** `#FAF9FF`
   - **Display:** Standalone · **Orientation:** Portrait
   - **Notifications:** kapalı · **Location delegation:** kapalı · **Google Play billing:** kapalı
   - **Fallback behavior:** Custom Tabs
   - **Signing key:** *Create new*
3. İnen zip dosyasında şunlar vardır:
   - `app-release-bundle.aab` (Play'e yüklenecek paket),
   - `assetlinks.json`,
   - imzalama anahtarı (`signing.keystore`) ve parolalarının yazılı olduğu bir metin dosyası.

> **İmzalama anahtarını kaybetmeyin ve kimseyle paylaşmayın** (bu sohbete de yazmayın). İki ayrı yerde, örneğin şifreli bir USB bellek ve parola yöneticisi, saklayın. Play App Signing açık olduğu için bu anahtar bir "yükleme anahtarı"dır. Kaybolursa Google desteğiyle sıfırlanabilir, ama süreç uzundur.

Alternatif: Bilgisayarınızda Node.js ve JDK varsa `npx @bubblewrap/cli init --manifest https://galaksay.com/manifest.webmanifest` ile, `twa/twa-manifest.json`'daki değerlerle aynı paket üretilebilir.

### 3.3 Play Console'da uygulama
1. **Uygulama oluştur:**
   - Ad: `Galaksay: Sayılar Galaksisi`
   - Varsayılan dil: Türkçe
   - Tür: Oyun
   - Ücretsiz
2. **Uygulama içeriği** formları: `beyanlar.md`'deki yanıtlarla doldurun. Bu formlar gizlilik, uygulama erişimi, reklam, içerik derecelendirmesi, hedef kitle ve veri güvenliğidir.
3. **Mağaza girişi:** `magaza-metinleri.md` ve `gorseller/` klasörünü kullanın.
4. **Test → Kapalı test:** Yeni bir parça açın, `app-release-bundle.aab`'yi yükleyin ve test kullanıcılarının e-postalarını ekleyin.
   - Pilot okuldaki öğretmenler bu test grubu olabilir; pilot ve mağaza hazırlığı böylece birleşir.
5. Kapalı test süresi dolunca **Üretim** için başvurun.

## 4. Adres çubuğunu kaldırmak: parmak izleri

TWA, sitenin uygulamayı "tanıdığını" `assetlinks.json` ile doğrular. Doğrulama olmazsa uygulama üstte bir adres çubuğuyla açılır. Çalışır ama mağaza incelemesinde ve kullanıcıda kötü izlenim bırakır.

1. Play Console → Kurulum → **Uygulama bütünlüğü** → "Uygulama imzalama anahtarı sertifikası" altındaki **SHA-256** değerini kopyalayın.
2. PWABuilder zip'indeki `assetlinks.json` içinde yükleme anahtarının SHA-256 değeri vardır; onu da alın.
3. **İki değeri bana iletin.** Parmak izleri gizli değildir; herkese açık bir doğrulama dosyasına yazılır, sohbete yapıştırılabilir. Ben `canli-surum/site/.well-known/assetlinks.json`'a ekleyip yayınlarım.
4. **Doğrulama:** https://developers.google.com/digital-asset-links/tools/generator aracında alan adı `galaksay.com`, paket `com.galaksay.oyun` ve parmak iziyle "Test statement" yapın. Uygulamayı yeniden açınca adres çubuğu kaybolmalı.

## 5. Bilinen sınırlar ve sonraki adımlar

- **iOS:** Apple, web sarmalayıcı uygulamaları sık reddediyor. iPhone ve iPad için şimdilik Safari → Paylaş → "Ana Ekrana Ekle" yolu öneriliyor (aynı uygulama kipi çalışır).
- **Tablet yönü:** Paket dikey kilitli. Sınıfta yatay tabletler yaygınsa `orientation` değeri `default` yapılıp yatay ekran denetimiyle yeni sürüm çıkarılabilir.
- **Kurmancî mağaza girişi:** Play Console'un dil listesinde yoksa Kurmancî tanıtım, Türkçe açıklamanın içinde kısa bir paragraf olarak eklenebilir.
- **Sürüm güncellemesi:** Web güncellemeleri kendiliğinden gelir. Paket ayarı değişirse `appVersionCode` bir artırılarak yeni `.aab` yüklenir.
