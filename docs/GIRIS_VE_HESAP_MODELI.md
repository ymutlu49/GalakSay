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

## 7. Ek: e-posta doğrulamalı yetişkin hesabı ve çocuk girişi kararı

**Yetişkin hesabı.** Yetişkin girişi artık e-posta doğrulamalı bir hesaba bağlanabiliyor. Sağlayıcı Firebase Authentication'dır ve etkinleştirme adımları `docs/HESAP_KURULUMU.md` dosyasındadır. Model iki katmanlıdır:

- **Hesap:** Yetişkini tanımlar ve cihazı bir kez kurar. E-posta doğrulaması zorunludur. Şifre en az 8 karakterdir ve e-postayla sıfırlanabilir.
- **Cihaz şifresi:** Günlük kullanımda hızlı kilit olarak kalır. Tablet başında her seferinde e-posta ve uzun şifre yazmak gerekmez.

**Çocuk girişi kaldırılmalı mı?** Hayır. Önerim, çocuk girişini korumak ama yetişkin hesabına bağlamaktır. Uygulamada yapılan budur. Gerekçeler:

1. **Hedef yaş:** 5–10 yaş çocukların çoğu e-posta ya da şifre kullanamaz. Okuma güçlüğü ya da diskalkuli riski olan çocuk için bu yük daha da ağırdır.
2. **Doz:** Etkililik haftada 3–4 gün düzenli oynamaya bağlıdır. Her oturumda bir yetişkinin giriş yapması gerekirse doz düşer.
3. **Alan standardı:** Çocuklara yönelik yerleşik eğitim uygulamaları aynı modeli kullanır. Yetişkin hesabı cihazı ya da sınıfı kurar, çocuk resmine ya da sınıf koduna dokunarak girer.
4. **Güvenlik ve KVKK:** Yetişkin doğrulanmış kimlikle kurulum yapar ve aydınlatma metnini onaylar. Çocuğa ait hiçbir kimlik bilgisi toplanmaz.

**Uygulanan kural.** Hesap sistemi etkinken yeni kaptanı yalnız doğrulanmış bir yetişkin oluşturabilir, yetişkin paneli de hesap ister. Var olan kaptanlar ve oyun oynamak hesap gerektirmez.

## 8. İkinci gözden geçirme (10 Ekim 2026): ortak cihaz ve oyuna erişim

Canlı sürümdeki giriş yolları telefon ve masaüstünde baştan sona gezildi:
- tanıtım sayfası,
- giriş merkezi,
- ilk kurulum,
- kaptan oluşturma,
- çocuk değiştirme,
- öğretmen ve ebeveyn girişi,
- NuMap girişi (`/giris`),
- aile bağlantısı (`/aile`).

### 8.1 Bulunan sorunlar

| # | Sorun | Etkisi |
|---|---|---|
| 1 | Merkezdeki büyük "Devam et · son kaptan" düğmesi, cihazda birden çok kaptan olsa da en son oynayanı açıyordu. | Sınıf tabletinde sıradaki çocuk bir öncekinin profilinde oynar. İlerleme, günlük görev, öğretmen raporu ve NuMap'e giden veri karışır. Ölçme açısından en ciddi sorun budur. |
| 2 | Kaptan oluşturma sihirbazında yalnız okul öncesi, 1. ve 2. sınıf vardı. Oyunun kendi yaş grubu "3. sınıf ve üzeri" eksikti. | 3. ve 4. sınıf öğrencisi 2. sınıf düzeyinden başlıyordu. Tanıtımdaki "5–10 yaş" ve "saymadan çarpmaya" ifadeleriyle çelişiyordu. |
| 3 | 12 kaptan resmi vardı; kullanılan resimler seçicide ayırt edilmiyordu. | 20 ve üzeri çocuklu sınıfta resimler çakışır. Okumayan çocuk kendini resminden bulamaz. |
| 4 | İlk kurulumda rol bilinmiyorsa "Ebeveyn Şifresi Oluştur" yazıyordu. | Sınıfı kuran öğretmen ebeveyn dilinde bir panelle karşılaşıyordu. |
| 5 | "Ebeveyn" döşemesiyle açılan girişte başlık "Öğretmen / Uzman Girişi" ve simge 🧑‍🏫 idi. | Rol duyarlı dil başlıkta kırılıyordu. |
| 6 | Yetişkin notu, şifre kurulduktan sonra da "İlk girişte şifre oluşturulur" diyordu. "Yeni Kaptan" düğmesi yetişkin onayı istediğini belirtmiyordu. | Yanlış beklenti oluşuyordu. Çocuk düğmeye basınca şifre ekranıyla karşılaşıyordu. |
| 7 | `/aile` sayfası bağlantısız ya da hatalı açılınca yalnız "Bağlantı eksik." diyordu. | Ebeveyn için çıkmaz yoldu. |

### 8.2 Yapılanlar

| # | Çözüm |
|---|---|
| 1 | **İki ya da daha çok kaptanda merkez doğrudan "Kim oynuyor?" diye sorar.** En son oynayan altı kaptanın resmi ızgarada görünür. Her resimde ad ve bugünkü durum yazar: ✅ bugün tamam, ⭐ yıldız ya da "Yeni". Daha çok kaptan varsa "Tümü" kartı tam listeyi açar. Cihazda tek kaptan varsa "Devam et" kartı korunur; bu çoğunlukla ev kullanımıdır. |
| 2 | Sihirbaza "🛸 3. sınıf ve üzeri · 8–10 yaş" eklendi. Oyunun `sinif3` grubudur. |
| 3 | Resim sayısı 24'e çıktı. Kullanılan resim seçicide soluk görünür ve sahibinin adını taşır. Altında çocuğa yönelik kısa bir not var: "Yalnız sana ait bir resim seçersen kendini daha kolay bulursun." Seçim engellenmez. |
| 4 | Rol bilinmiyorsa ilk şifre ekranı "Yetişkin Şifresi Oluştur" der ve "Bu cihazı kim kuruyor? Öğretmen · Uzman / Ebeveyn" diye sorar. Seçim zorunludur ve kaydedilir; başlık ve panel dili buna uyar. |
| 5 | Ebeveyn girişinin başlığı "Ebeveyn Girişi", simgesi 👪 oldu. |
| 6 | Şifre kurulduktan sonra not "Yetişkin paneli bu cihazın yetişkin şifresiyle açılır" der. "Yeni Kaptan" düğmesinde 🔐 işareti ve "yetişkin onayıyla" erişilebilir etiketi var. |
| 7 | `/aile` hata durumunda ne yapılacağını söyler: bağlantıyı yeniden açın, bağlantının tamamını yapıştırın ya da yenisini isteyin. Ayrıca "GalakSay'ı bu cihazda aç" ve "Öğretmen girişi" bağlantıları gösterilir. |

Dosyalar:
- `canli-surum/kaynak/WelcomeScreen.captain.js` (1–4, 6)
- `canli-surum/kaynak/giris_erisim.py` (5: simge)
- `site/oyna/galaksay-ek.js` (5: başlık)
- `site/aile.html` ve `site/aile.js` (7)

### 8.3 Doğrulama

Gerçek tarayıcıda, telefon (390 px) ve masaüstü (1280 px) boyutunda 26'şar uçtan uca denetim yapıldı:
- rol sorusu ve zorunluluğu,
- 24 resim ve çakışma notu,
- 3. sınıf seçeneği,
- tek kaptanda "Devam et", iki kaptanda "Kim oynuyor?",
- ızgaradan doğru çocuğun açılması,
- yedi kaptanda "Tümü" ve tam liste,
- ebeveyn ve öğretmen başlıkları,
- öğretmen şifresiyle panele giriş,
- aile sayfasının yönlendirmesi.

Sayfa hatası çıkmadı. Kurmancî ekranlarda taşma yok.

### 8.4 Yaklaşım üzerine öneriler (§9'da uygulandı)

- **Lisans kapısı açıldığında deneme yolu.** Kapı açıkken NuMap hesabı ya da aile daveti olmayan bir ebeveynin oyunu deneyebileceği bir yol yok. Kısa bir tanıtım oturumu düşünülebilir; örneğin tek gezegen ve ilerleme kaydı olmadan. Bu bir ürün kararıdır; kapı bugün kapalıdır.
- **Sınıf kodu.** 25 ve üzeri çocuklu sınıflarda resim ızgarası uzar. NuMap öğrencisiyle açma (`?ogrenci=`) bugün tek öğrenci için var. Öğretmenin tahtaya yazdığı kısa bir sınıf kodu ve ardından o sınıfın resim ızgarası, ortak cihazı daha da kolaylaştırır. Bu sunucu tarafı ve KVKK değerlendirmesi ister.
- **Kilit süresinin ayarlanması.** Yetişkin paneli 10 dakikada kilitleniyor. Ayarlardan seçilebilir yapılabilir.

## 9. Deneme yolu, sınıf kodu ve kilit süresi (10 Ekim 2026)

§8.4'teki üç öneri uygulandı. Lisans kapısı bugün **kapalı** yayında. Deneme yolu kapı açıldığında devreye girer; sınıf kodu ve kilit süresi şimdiden çalışır.

### 9.1 Deneme yolu

Kapı açıkken NuMap hesabı ya da aile bağlantısı olmayan bir ebeveyn ya da öğretmen oyunu deneyemiyordu.

**Nasıl çalışır:**
1. Kapı açıkken `/oyna/` lisanssız ziyaretçiyi `/giris`'e yönlendirir.
2. Giriş sayfasında "Önce denemek ister misiniz? · **Ücretsiz dene (7 gün)**" bölümü var.
3. Düğmeye basınca hesap gerekmeden 7 gün boyunca bu cihazda oyunun tamamı açılır.
4. Merkezde bir bant kalan günü gösterir ve "Lisansla gir →" bağlantısını verir.
5. Süre dolunca `/oyna/` açılmaz. Kullanıcı "Deneme süreniz doldu…" iletisiyle giriş sayfasına yönlendirilir.

**Neden süreyle sınırlı, içerik olarak tam?** Ürünün değeri günlük görev, aralıklı tekrar ve uyarlanan düzey döngüsündedir. Tek gezegenlik ve kayıtsız bir tanıtım bu döngüyü göstermez. Deneme boyunca ilerleme cihazda kalır. Lisansla girildiğinde aynen sürer, çocuk baştan başlamaz.

**Teknik ayrıntılar:**
- Çerez `gs_lis = d.<bitiş>` biçimindedir; HttpOnly ve Secure'dur. NuMap'e istek gitmez.
- Cihaz başına bir deneme verilir. İkinci denemeyi `gs_deneme` izi engeller (HttpOnly, 400 gün).
- Geçerli bir NuMap ya da aile lisansı varsa deneme ona dokunmaz. NuMap girişi deneme çerezinin yerini alır.
- Süre `DENEME_GUN` ortam değişkeniyle değiştirilebilir (1–30, varsayılan 7).
- **İmzalama (isteğe bağlı):** Cloudflare Pages ortamına `DENEME_SIRRI` gizli değeri eklenirse bitiş tarihi HMAC-SHA256 ile imzalanır. O zaman elle yazılmış ya da uzatılmış çerez reddedilir.
- `DENEME_SIRRI` olmadan da süresi geçmiş ya da süreden uzun bitiş tarihi reddedilir.

**Bilinen sınır:** Kapı yumuşaktır. Oyun dosyaları zaten herkese açıktır ve kapı yalnız sayfayı korur. Çerezlerini silen bir cihaz yeniden deneme alabilir. Bu bilinçli bir tercihtir: deneme bir satış kapısıdır, güvenlik sınırı değildir.

Dosyalar:
- `canli-surum/functions/_lisans.js`
- `functions/api/lisans/deneme.js` (yeni)
- `functions/oyna/_middleware.js`
- `site/giris.html`, `site/giris.js`, `site/giris.css`
- `kaynak/WelcomeScreen.captain.js` (bant)

### 9.2 Sınıf kodu

**Sorun:** Kalabalık sınıfta resim ızgarası uzar. Birden çok sınıfın kullandığı cihazda (bilgisayar sınıfı, ortak tablet) çocuk kendi resmini başka sınıfların resimleri arasında arar.

**Nasıl çalışır:**
1. **Öğretmen sınıfı kurar.** Merkezdeki "⚙️ Cihaz ayarları" yetişkin şifresiyle açılır. "Sınıflar ve sınıf kodları" bölümünde sınıf eklenir (ör. 2-B). Cihaz 4 rakamlı bir kod önerir; kod değiştirilebilir. Tekrar eden (1111) ve sıralı (1234) kodlar önerilmez. Aynı kod iki sınıfa verilemez.
2. **Kaptanlar sınıfa atanır.** "Kaptanları seç" ile her kaptan bir sınıfa atanır. Bir kaptan aynı anda tek sınıftadır.
3. **Çocuk kodu yazar.** Cihazda sınıf varsa merkez "🏫 Sınıf kodunu yaz" der. Dört büyük kutu ve 0–9 tuş takımı var; yönerge sesli dinlenebilir.
4. **Doğru kod:** Merkez yalnız o sınıfın resimlerini gösterir ("Kim oynuyor?"). Cihaz sınıfı hatırlar.
5. **Yanlış kod:** "Bu kod bu cihazda yok. Tahtadaki kodu yeniden yaz." iletisi çıkar.

**Ayrıntılar:**
- Etkin sınıfta oluşturulan yeni kaptan kendiliğinden o sınıfa atanır.
- "Sınıfı değiştir" tuş takımına döner. "Bütün kaptanlar" tam listeyi açar.
- Öğretmen sınıfı ayarlardan doğrudan "Bu cihazda aç" ile de açabilir.
- Sınıf silinirse kaptanlar silinmez, yalnız sınıfsız kalır.

**Güvenlik ve KVKK:**
- Kod bir şifre değildir. Kaptan seçmek zaten şifresizdir; kod doğru ızgarayı açan bir kısayoldur.
- Sınıflar, kodlar ve atamalar yalnız bu cihazda saklanır ve sunucuya gitmez. Bu yüzden yeni bir kişisel veri akışı ve ek bir KVKK yükü doğmaz.
- Cihaz yedeğine (Ayarlar → Verileri dışa aktar) girerler.

**Bilinçli olarak yapılmayan: sunucudan sınıf listesi.** NuMap'teki sınıf listesini koda bağlayıp her cihazda aynı ızgarayı açmak mümkündür. Ancak GalakSay ilerlemesi bugün NuMap'e yalnız gönderiliyor, geri yüklenmiyor. Çocuk başka cihazda oyunu açınca düzeyi ve yıldızları baştan başlar. Önce oyun durumunun NuMap'te saklanıp geri yüklenmesi tasarlanmalıdır. Bu ayrı bir iştir; NuMap'te tablo, uç ve KVKK aydınlatması gerektirir. O yapıldığında aynı tuş takımı sunucu koduyla çalışacak biçimde genişletilebilir.

### 9.3 Yetişkin paneli kilit süresi

"⚙️ Cihaz ayarları → Yetişkin paneli kilidi" ekranından **5, 10, 15 ya da 30 dakika** seçilir; varsayılan 10 dakikadır.
- Panelin hareketsizlik kilidi süreyi `galaksay-ek.js` §10'daki `window.__gsIdleMs` kancasından okur. Seçim yeni girişte geçerli olur.
- Kilit notu seçilen süreyi yazar ("… 5 dakika işlem yapılmadığı için …").
- Çocuğun oyun oturumu kilitten etkilenmez.
- Kilitsiz seçenek bilinçli olarak yoktur: tablet çocuğa verildiğinde raporlar ve "tüm verileri sil" açık kalmamalıdır.

### 9.4 Doğrulama

Yerel bir Cloudflare Pages taklidiyle işlevler ve sayfalar birlikte çalıştırıldı. İki durum denendi: kapı açık (imzalı ve imzasız) ve kapı kapalı.

**Sunucu senaryoları (curl):**
- ilk deneme, durum sorgusu ve oyunun açılması,
- geçerli denemenin yinelenmesi,
- iz varken ikinci deneme (409),
- yabancı köken (403),
- elle uzatılmış çerez, süresi dolmuş çerez ve sır tanımlıyken imzasız çerez (hepsi reddedildi),
- kapı kapalıyken denemenin gereksizliği.

**Uçtan uca (gerçek tarayıcı; telefon ve masaüstü boyutu; 34'er denetim):**
- yönlendirme, deneme düğmesi ve deneme bandı,
- banttan girişe gidip denemeye dönüş,
- ikinci denemenin reddi ve süresi dolan denemenin iletisi,
- kapı kapalıyken ne kutu ne bant görünmesi,
- sınıf ekleme, ad zorunluluğu ve yinelenen kodun reddi,
- kaptan atama, yanlış ve doğru kod, sınıf filtresi,
- yeni kaptanın etkin sınıfa atanması, sınıfın kalıcılığı, "Sınıfı değiştir" ve "Bütün kaptanlar",
- kilit süresi 5 dakika: panel 4 dk 30 sn'de açık, 5 dk 30 sn'de kilitli ve not "5 dakika" diyor (saat taklidiyle).

Testler altı ardışık koşuda kararlı geçti. §8'in 26 denetimi iki ekran boyutunda yeniden geçti. Kurmancî ekranlarda 360 px'te taşma yok.
