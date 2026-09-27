# GalakSay Giriş ve Hesap Modeli: Eleştiri ve İyileştirmeler

**Tarih:** 27 Eylül 2026 · **Kapsam:** galaksay.com canlı sürümü · **İlgili dosyalar:** `canli-surum/kaynak/WelcomeScreen.captain.js`, `canli-surum/kaynak/giris_merkezi.py`, `canli-surum/site/oyna/galaksay-ek.js`

## 1. Model ne?

GalakSay'de çevrimiçi bir hesap yoktur. Bütün kimlikler cihazdadır.

| Kim | Nasıl girer | Nerede saklanır |
|---|---|---|
| Çocuk (kaptan) | Kendi resmine dokunur. İsteğe bağlı çocuk şifresi eklenebilir. | Bu cihaz |
| Cihaz yöneticisi (ebeveyn ya da öğretmen) | 4–8 rakamlı şifre ve bir kez gösterilen kurtarma kodu | Bu cihaz, PBKDF2 ile türetilmiş özet |
| Ek öğretmen ya da uzman | Yöneticinin tanımladığı kullanıcı adı ve şifre | Bu cihaz |
| Numap kullanıcısı | getnumap.com hesabı. İsteğe bağlıdır, merkezi senkron için gerekir. | Numap sunucusu |

## 2. Güçlü yanlar (korundu)

- **Çocuklara şifre yok:** 5–10 yaş için doğru bir karardır. Resimle seçim hem okuma bilmeyen çocuğa uygundur hem de KVKK'nın veri en azlığı ilkesine uyar.
- **Parola güvenliği:** Yetişkin şifresi 100.000 turluk PBKDF2 ile tuzlanarak saklanır. Hassas alanlar AES-GCM ile şifrelenir.
- **Deneme sınırı:** Kolay tahmin edilen şifreler (1234, 1111, doğum yılı) reddedilir. Hatalı denemeler zaman kilidine takılır. Kurtarma kodu bir kez gösterilir.
- **Devretme:** Yetişkinin başlattığı bir oyundan çocuk çıkarsa şifre yeniden istenir. Sayfa yenilenince yetişkin oturumu kapanır.

## 3. Eleştiri: bulunan sorunlar

1. **Kavram karmaşası.** Ekranlarda "Cihaz Hesabı Oluştur", "İlk hesabı oluştur" ve "Kullanıcı girişi" yazıyordu. Oysa oluşturulan şey bu cihaza ait bir şifredir. "Hesap" sözcüğü ebeveyne e-posta, bulut ve verilerin yedeklendiği izlenimini verir. Bunların hiçbiri doğru değildir.
2. **Tek rol dili.** Bir ebeveyn de "Yerel Yönetim", "Öğrencilerim", "Öğrenci Seç & Oynat" ve "Sınıf İlerlemesi" görüyordu. Model yalnız okul için tasarlanmış gibi davranıyordu.
3. **Dağınık girişler.** Yetişkin girişi açılışın dibinde küçük bir bağlantıydı. Yetişkin ekranındaki "Öğrenci Girişi" düğmesi farklı tasarımda ikinci bir çocuk seçicisine gidiyordu. Tanıtım sayfasında öğretmen ya da ebeveyn girişi hiç yoktu.
4. **Açıklamasız ilk kurulum.** Yetişkin ilk girişte doğrudan şifre formuyla karşılaşıyordu. Ne kurduğu, verinin nerede durduğu ve çocukların neye erişemeyeceği söylenmiyordu.
5. **Kilitlenmeyen panel.** Açık bırakılan yetişkin paneli süresiz açık kalıyordu. Tablet çocuğa verildiğinde raporlar, ayarlar ve "tüm verileri sil" erişilebilir durumdaydı.
6. **Yanlış etiket.** Yetişkin yokken çocuk merkezinde çocuğun adının altında "Öğretmen" yazıyordu.
7. **Gereksiz bilgi.** Numap notu, hiç ilgisi olmayan ebeveynlere de gösteriliyordu.

## 4. Yapılan iyileştirmeler

| Sorun | Çözüm |
|---|---|
| Dağınık girişler | Tek giriş merkezi kuruldu (`/oyna/`). Üstte çocuklar için "Devam et", "Kaptanlar" ve "Yeni Kaptan" yer alıyor. Altta yetişkinler için "Öğretmen · Uzman" ve "Ebeveyn" döşemeleri var. Yetişkin ekranındaki "Çocuk girişi" artık merkeze dönüyor. Eski seçici yalnız şifreli çocuk profilleri için kullanılıyor. |
| Tanıtım sayfası | Gezinme çubuğuna "Öğretmen Girişi" eklendi. Eğitimciler bölümüne "Öğretmen / Uzman Girişi" ve "Ebeveyn Girişi" eklendi. Bağlantılar `/oyna/?giris=ogretmen` ve `?giris=ebeveyn` biçimindedir. Merkez ilgili girişi açıp adresi temizler. |
| Kavram karmaşası | "Cihaz Hesabı" yerine öğretmende "Yönetici Şifresi", ebeveynde "Ebeveyn Şifresi" yazıyor. Açıklama şöyle: "Hesap ya da e-posta gerekmez: şifre yalnız bu cihazda, şifrelenmiş olarak saklanır. Çocuklar paneli açamaz." "Kullanıcı girişi" yerine "Kayıtlı öğretmen / uzman girişi" yazıyor. |
| Tek rol dili | Seçilen rol cihazda hatırlanıyor. Ebeveyn paneli "👪 Ebeveyn Paneli", "Çocuklarım", "Çocuk Seç & Oynat" ve "Gelişim Özeti" diyor. Öğretmen paneli okul dilini koruyor. Metinler tek bir okunur tablodadır (`galaksay-ek.js`). |
| Açıklamasız kurulum | Giriş merkezinde yetişkin döşemelerinin altında ilk girişte ne olacağı yazıyor. İlk kez gelen çocuk için üç adımlı "nasıl başlarsın" kartı eklendi. |
| Kilitlenmeyen panel | Yetişkin paneli ekrandayken 10 dakika dokunulmazsa kapanıyor ve merkez bir kez bilgi notu gösteriyor. Çocuğun oyun oturumu bu kilitten etkilenmiyor. |
| Yanlış etiket | Çocuk girişinde "Kaptan", yetişkinin başlattığı oturumda "Yetişkin" yazıyor. "Çocuk" düğmesinin adı "Değiştir" oldu. |
| Numap notu | Yalnız öğretmen ve uzman girişinde görünüyor. |
| Kurmancî büyük harf | Giriş merkezi sayfa dilini seçilen dile göre işaretliyor. Böylece Kurmancî büyük harfler Türkçe noktalı "İ" ile yazılmıyor. |

Sürdürme ekranı da düzenlendi. En üstte "Tekrar hoş geldin, Ada!" kartı var: yıldızlar, bugünkü görev durumu, ne yapılacağını söyleyen tek cümle ve sesli dinleme düğmesi. Günlük görev ve büyük düğme onun hemen altında. 12 dakikalık ölçüm kartı en üstten aşağı taşındı. Giriş merkezindeki "Devam et" kartı yıldızı, görev sayısını, son oyun gününü, son görevi ve seviyesini ve bugünkü görev durumunu gösteriyor.

## 5. Bilinçli olarak değiştirilmeyenler ve öneriler

- **Bulut hesabı:** Cihaza bağlı model KVKK açısından en güvenli seçenektir ve korunmalıdır. Birden çok cihazda çalışan okullar için mevcut yol Numap senkronudur. Kendi sunucumuzla bir "sınıf kodu" senkronu ancak sunucu, yedekleme ve veri işleme sözleşmesiyle birlikte düşünülmelidir.
- **Rakamsal yönetici şifresi (4–8 hane):** Tablet ortamında kullanımı kolaydır ve deneme sınırıyla korunur. Ekran 6 ya da daha fazla hane önerir. Ek öğretmen kullanıcıları için kullanıcı adı ve şifre zaten var.
- **Şifreli çocuk profilleri:** Kilit korumalı eski seçiciden girmeye devam ediyorlar. İleride şifre kutusu doğrudan giriş merkezine alınabilir.
- **Kilit süresi:** Şimdilik 10 dakika. Ayarlar ekranından seçilebilir yapılabilir.

## 6. Doğrulama

Aşağıdakiler tarayıcıda uçtan uca denendi:
- **Ebeveyn yolu:** şifre oluşturma, kurtarma kodu ve panel dili.
- **Öğretmen yolu:** şifre oluşturma ve ikinci girişte şifre sorma.
- **Yönlendirmeler:** "Çocuk girişi" ile merkeze dönüş, derin bağlantılar ve "Geri".
- **Güvenlik:** hareketsizlik kilidi ve bu kilidin çocuk oturumunu etkilememesi, çocuk çıkınca yetişkin şifresi istenmesi.
- **Görünüm:** Kurmancî metinler ve tablette taşma olmaması.

Önceki testler de yeniden geçti: kaptan akışı telefon, tablet ve masaüstünde, 20 öğrencili liste, günlük görev, Kurmancî ses ve yedekten geri yükleme.
