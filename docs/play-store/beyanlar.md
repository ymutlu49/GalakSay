# Galaksay — Play Console beyanları (Uygulama içeriği)

Play Console → Politika → **Uygulama içeriği** bölümündeki formlar için hazır yanıtlar. Yanıtlar 10 Ekim 2026'daki canlı sürüme göredir: lisans kapısı kapalı, Firebase e-posta hesabı kapalı (`hesap-ayar.js` boş). Bunlardan biri değişirse aşağıdaki "değişirse" notlarına bakın.

## 1. Gizlilik politikası

```
https://galaksay.com/gizlilik
```

## 2. Uygulama erişimi

**Seçim:** "Tüm işlevler özel erişim gerektirmez" yerine **"Bazı işlevler kısıtlıdır"**.

Yetişkin paneli ve Cihaz ayarları, kullanıcının ilk açılışta kendisinin oluşturduğu yetişkin şifresiyle korunur. İnceleme ekibine verilecek talimat:

```
Uygulamada hesap yoktur. Yetişkin paneli ve Cihaz ayarları, ilk açılışta kullanıcının kendi oluşturduğu 4–8 rakamlı bir yetişkin şifresiyle korunur.
Test için: Açılış ekranında "Yolculuğa Başla"ya dokunun, "Öğretmen · Uzman"ı seçin ve şifre olarak 582913 girin (iki kez). Gösterilen kurtarma kodunu geçin.
Ardından yetişkin paneline "Öğretmen · Uzman" döşemesinden, Cihaz ayarlarına "⚙️ Cihaz ayarları" düğmesinden aynı şifreyle girilir.
NuMap bağlantısı isteğe bağlıdır ve ayrı bir getnumap.com hesabı gerektirir; uygulamanın temel işlevleri için gerekmez.
```

## 3. Reklamlar

**Hayır**, uygulama reklam içermez.

## 4. İçerik derecelendirmesi (IARC anketi)

- **Kategori:** "Oyun" ya da "Referans, Haber veya Eğitim". Galaksay bir eğitsel oyundur; "Oyun" seçilebilir.
- **Bütün içerik soruları "Hayır":**
  - şiddet, kan,
  - korku (öykü girişindeki "karanlığa gömülen galaksi" yumuşak bir masal öğesidir; korkutucu görüntü yoktur),
  - cinsellik, küfür, uyuşturucu-alkol-tütün,
  - kumar ya da kumar benzeri ödül,
  - kullanıcılar arası etkileşim ya da sohbet, kullanıcı içeriği paylaşımı, konum paylaşımı,
  - dijital satın alma.
- **Beklenen sonuç:** PEGI 3 / ESRB Everyone / USK 0.

## 5. Hedef kitle ve içerik

- **Hedef yaş grupları:** **5 yaş ve altı**, **6–8**, **9–12**. Okul öncesi seçeneği 5–6 yaş içindir. 13+ seçmeyin.
- **Çocuklara hitap eden içerik:** Evet.
- **Sonuç:** Uygulama Google Play **Aile politikası** kapsamına girer. Galaksay bu politikaya göre hazırlandı:
  - reklam ve satın alma yok;
  - çocuk ekranlarında site dışı bağlantı yok (uygulama kipinde gizlenir; `galaksay-ek.js` §11);
  - yasal metinler yetişkin şifreli Cihaz ayarlarında;
  - kişisel veri istenmiyor (çocuk yalnız resim, takma ad ve yaş grubu seçer; bunlar cihazda kalır);
  - üçüncü taraf SDK ya da analitik yok;
  - konum, kamera, mikrofon ya da reklam kimliği izni yok.
- **Öğretmen Onaylı (Teacher Approved):** Aile politikasına uyan uygulamalar Google'ın öğretmen değerlendirmesine alınabilir. Ayrı bir başvuru yolu yoktur; uygulama kriterleri karşılıyorsa değerlendirilir.

## 6. Veri güvenliği formu

**Genel durum:** Oyun verisi varsayılan olarak cihazdan çıkmaz. Yalnız iki **isteğe bağlı** durumda veri gönderilir:
- **(a)** Öğretmen yetişkin panelinde kendi NuMap hesabıyla giriş yapar.
- **(b)** Öğretmenin NuMap kaydı bağlıdır ya da ebeveyn aile bağlantısında açıkça izin vermiştir. Bu durumda oyun ilerlemesi NuMap'e (getnumap.com) iletilir.

Formda bunlar **"isteğe bağlı"** olarak beyan edilmelidir.

**Önemli:** NuMap'i siz işletiyorsanız bu aktarım **"toplama"** sayılır, "paylaşım" değil. NuMap başka bir tüzel kişiye aitse aşağıdaki iki satır **"paylaşılan"** olarak da işaretlenmelidir.

| Soru | Yanıt |
|---|---|
| Uygulama gerekli kullanıcı verisi türlerini topluyor ya da paylaşıyor mu? | **Evet** (yalnız isteğe bağlı NuMap bağlantısı nedeniyle) |
| Aktarımda şifreleniyor mu? | **Evet** (HTTPS) |
| Kullanıcılar verilerinin silinmesini isteyebilir mi? | **Evet**. Cihazdaki veri: yetişkin paneli → Ayarlar → öğrenci ya da tüm veriyi silme. NuMap'teki veri: NuMap hesabından ya da galaksay.com/gizlilik'teki başvuru yolu. |

**Beyan edilecek veri türleri:**

| Veri türü | Toplanıyor mu | Paylaşılıyor mu | İsteğe bağlı mı | Amaç |
|---|---|---|---|---|
| Kişisel bilgiler → **Ad** | Evet (öğretmenin NuMap hesabındaki adı) | Hayır | **İsteğe bağlı** | Hesap yönetimi |
| Kişisel bilgiler → **E-posta adresi** | Evet (öğretmenin NuMap girişi) | Hayır | **İsteğe bağlı** | Hesap yönetimi |
| Uygulama etkinliği → **Uygulama içi etkileşimler** (yanıtlar, süre, ipucu, düzey) | Evet | Hayır | **İsteğe bağlı** | Uygulama işlevselliği (öğretmenin ilerleme raporu) |

**Beyan edilmeyenler (toplanmıyor):**
- konum,
- kişiler,
- fotoğraf ve video,
- ses,
- dosyalar,
- takvim,
- web tarama geçmişi,
- cihaz ya da diğer kimlikler (reklam kimliği dahil),
- finansal bilgi,
- sağlık ve fitness,
- mesajlar,
- uygulama bilgileri ve performans (kilitlenme günlüğü gönderilmez).

**Notlar:**
- **Çocuk verisi:** Çocuğun adı ve fotoğrafı NuMap'e gönderilmez. İlerleme, öğrencinin NuMap anahtarıyla öğretmenin kaydına yazılır.
- **Sesli okuma:** Cihazın kendi konuşma motoruyla yapılır. Uygulama ses kaydetmez ve mikrofon kullanmaz.
- **Değişirse (Firebase hesabı):** Firebase e-posta hesabı (`FIREBASE_API_KEY`) etkinleştirilirse ad, e-posta ve kullanıcı kimliği uygulamada oluşturulan bir hesap için toplanır. Bu durumda Google Play'in **hesap silme** kuralı da uygulanır: uygulama içinde ve web'de hesap silme yolu gerekir. Bu sistemi Play sürümünde kapalı tutmanızı öneririm.
- **Değişirse (lisans kapısı):** Lisans kapısı açılırsa deneme ve lisans çerezleri kişisel veri içermez. NuMap girişi yukarıdaki "Ad" ve "E-posta" satırlarında zaten beyan edilmiştir.

## 7. Diğer beyanlar

| Form | Yanıt |
|---|---|
| Haber uygulaması | Hayır |
| COVID-19 izleme | Hayır |
| Devlet uygulaması | Hayır |
| Finansal özellikler | Yok |
| Sağlık uygulaması | **Hayır.** Galaksay eğitsel bir oyundur; tanı, tarama ya da tedavi işlevi yoktur. |
| Hesap silme | Uygulamada hesap oluşturulmuyor (bkz. §6 notu) |
| Uygulama izinleri | TWA paketi yalnız İnternet iznini kullanır |

## 8. Mağaza ayarları

- **Uygulama mı, oyun mu:** Oyun. Kategori: **Eğitici**. Alternatif: Uygulama → Eğitim.
- **Etiketler:** Eğitici, Matematik, Çocuk, Bulmaca (en çok 5).
- **İletişim e-postası (zorunlu, herkese açık):** `y.mutlu@alparslan.edu.tr`. Gizlilik sayfasına da eklendi.
- **Web sitesi:** `https://galaksay.com`
