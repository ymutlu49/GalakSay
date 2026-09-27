# E-posta Doğrulamalı Yetişkin Hesabını Etkinleştirme

**Durum:** Kod yayında, hesap sistemi **kapalı**. Anahtar tanımlanınca kendiliğinden açılır. Anahtar yokken giriş eskisi gibi yalnız cihaz şifresiyle çalışır.

## Neden dış hizmet gerekiyor?

E-posta doğrulaması, kullanıcıya bağlantı gönderebilen bir e-posta altyapısı ister. galaksay.com durağan bir sitedir ve kendi sunucusu yoktur. Bu yüzden kimlik doğrulama için Google Firebase Authentication seçildi:

- Doğrulama ve şifre sıfırlama e-postalarını kendisi gönderir.
- Ayda 50.000 etkin kullanıcıya kadar ücretsizdir.
- Sunucu kodu gerektirmez.

Hesap, projenin sahibi adına açılmalıdır, çünkü KVKK açısından veri sorumlusu odur.

## Bir kerelik kurulum (yaklaşık 10 dakika)

1. [console.firebase.google.com](https://console.firebase.google.com) adresinde **Proje ekle**'yi seçin. Ad olarak "galaksay" yazın. Google Analytics'i kapatın.
2. **Build → Authentication → Başlayın → Sign-in method** bölümünde **E-posta/Şifre** yöntemini etkinleştirin. "E-posta bağlantısı" seçeneği kapalı kalabilir.
3. **Authentication → Ayarlar → Yetkili alan adları** bölümüne `galaksay.com` ve `onizleme.galaksay.pages.dev` alan adlarını ekleyin.
4. **Authentication → Templates** bölümünde şablon dilini **Türkçe**, gönderen adını **GalakSay** yapın. Bu adım isteğe bağlıdır.
5. **Proje ayarları → Genel** bölümünden **Web API anahtarı**nı kopyalayın. Bu anahtar gizli değildir; tarayıcıya zaten gider.
6. GitHub'da depo sayfasında **Settings → Secrets and variables → Actions → Variables → New repository variable** yolunu izleyin. Ad olarak `FIREBASE_API_KEY` yazın, değer olarak anahtarı yapıştırın.
7. **Actions → "Canlı kopyayı yayınla"** iş akışını önce `onizleme`, sonra `main` hedefiyle çalıştırın. İş akışı anahtarı `oyna/hesap-ayar.js` dosyasına yazar ve önbellek sürümünü yükseltir.

İsteğe bağlı bir güvenlik adımı daha var. Google Cloud Console'da **APIs & Services → Credentials** bölümüne gidin. Anahtarı yalnız `galaksay.com/*` ve `onizleme.galaksay.pages.dev/*` yönlendirenleriyle sınırlayın.

## Etkinleşince akış

| Durum | Ne olur |
|---|---|
| Yeni cihaz, hiç kaptan yok | "Yolculuğa Başla" önce yetişkin hesabı ister. Yetişkin kayıt olur, e-postasını doğrular, ardından çocuğun kaptanını oluşturur. |
| Yetişkin paneli | Bu cihazda doğrulanmış hesap yoksa önce hesap girişi istenir. Hesap bir kez doğrulanınca cihazın kısa yetişkin şifresi hızlı kilit olarak kullanılır. |
| Var olan kaptanlar | Hesap olmadan oynamaya devam eder. Çocuklar hiçbir zaman e-posta ya da şifre kullanmaz. |
| Şifremi unuttum | Hesap şifresi e-postayla sıfırlanır. Cihaz şifresi için kurtarma kodu yolu sürer. |
| İnternet yok | Oyun ve cihaz şifresi çevrimdışı çalışır. Yalnız kayıt, giriş ve doğrulama bağlantı ister. |

Hesaba giden bilgiler yalnız şunlardır: ad soyad, e-posta, rol ve Firebase'in tuttuğu şifre özeti. Çocuk adı, oyun cevapları ve destek bayrakları hesaba gönderilmez. Gizlilik sayfasına bu bölüm eklendi.

## Teknik ayrıntı

| Dosya | Görev |
|---|---|
| `canli-surum/site/oyna/hesap-ayar.js` | Anahtar. Boşsa sistem kapalıdır. |
| `canli-surum/site/oyna/galaksay-hesap.js` | Firebase REST istemcisi: kayıt, giriş, doğrulama, şifre sıfırlama, oturum yenileme. |
| `canli-surum/kaynak/WelcomeScreen.captain.js` | Hesap ekranları ve kurulum kapısı. |
| `canli-surum/site/_headers` | Güvenlik politikasında yalnız `identitytoolkit.googleapis.com` ve `securetoken.googleapis.com` adreslerine izin verilir. |

Akış, Firebase uçları taklit edilerek uçtan uca test edildi. Denenenler şunlardır:
- kayıt, kısa şifre ve onaysız kayıt engeli
- doğrulanmadan devam edememe
- doğrulama sonrası kaptan oluşturma
- hesap rozeti
- çıkış, yanlış ve doğru şifreyle giriş
- şifre sıfırlama
- bağlantısızlık mesajı
- var olan kaptanların hesapsız oynaması
- anahtar yokken eski akış
