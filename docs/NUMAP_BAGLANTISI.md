# NuMap bağlantısı ve giriş güvenliği

28 Eylül 2026. Kapsam: galaksay.com canlı sürümü (`canli-surum/site`) ve NuMap API'si (`getnumap.com/api`, kaynak: `ymutlu49/numap-app`).

## 1. Bağlantının bugünkü yapısı

GalakSay, NuMap'i tek kimlik merkezi olarak kullanır. Dört temas noktası vardır:

| Temas noktası | Yön | Uç nokta |
|---|---|---|
| Öğretmen girişi | GalakSay → NuMap | `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` |
| Tek oturum (SSO) | NuMap → GalakSay | NuMap `POST /auth/sso/issue` ile 90 sn'lik HMAC bileti üretir ve `galaksay.com/oyna/?sso=<bilet>` adresini açar. GalakSay bileti `POST /auth/sso/exchange` ile oturuma çevirir. |
| Öğrenci listesi | NuMap → GalakSay | `GET /sessions` (öğretmenin taradığı çocuklar, `studentKey` ile) |
| Oyun ilerlemesi | GalakSay → NuMap | `POST /game-progress` (oturum, madde, düzey geçişi, günlük özet). NuMap bunu "Müdahale → GalakSay" sayfasında ve bireysel planda (BÖP) gösterir. |

Canlı ortamdaki durum:
- NuMap API'si çalışıyor (`/api/health` 200).
- CORS yalnız `galaksay.com` ve `www.galaksay.com` kaynaklarına izin veriyor.
- İçerik güvenliği politikası `getnumap.com`'a bağlantıya izin veriyor.

## 2. Bulunan ve giderilen bağlantı sorunları

| # | Sorun | Etki | Düzeltme |
|---|---|---|---|
| 1 | Oyun ana ekranındaki NuMap düğmesi `numap.netlify.app` adresini açıyordu. Bu adres NuMap değil, ilgisiz bir üniversite ders planlayıcısı ("NU Map"). | Çocuk ya da öğretmen yabancı bir siteye gidiyordu. | Düğme `getnumap.com`'u `noopener` ile açar. |
| 2 | NuMap giriş, doğrulama ve SSO yanıtlarındaki `plan` ve `entitlements` alanları atılıyordu. | GalakSay yetkisi olmayan bir NuMap hesabı (ör. yalnız ABMATO planı) öğretmen merkezine girebiliyordu. | Yetkiler saklanır. Liste varsa ve `galaksay` içermiyorsa giriş 403 ile reddedilir. Yetkisi sonradan kaldırılan hesabın oturumu açılışta kapanır. Liste tanımsızsa NuMap'teki gibi her şey açık sayılır. |
| 3 | NuMap'ten gelişte bilet geçersiz ya da süresi dolmuşsa kullanıcı nedenini göremiyordu. | Sessiz başarısızlık. | Açılışta Türkçe, Kurmancî ya da İngilizce bir uyarı gösterilir. |
| 4 | NuMap taramasına bağlanan yerel çocuğun verisi `local_N` kimliğiyle gönderiliyordu. Sunucu öğrenciyi yalnız `numap_<16 onaltılık>` biçiminden tanıyor. | Bu çocukların ilerlemesi NuMap'te hiçbir öğrenciye bağlanamıyordu. | Gönderilen kopyada kimlik `numap_<studentKey>` olur; cihazdaki kayıt değişmez. Canlı sürümde bağlama ekranı henüz yok, bu yüzden düzeltme hem canlı pakete hem kaynak koda (`src/services/syncEngine.js`) işlendi. |
| 5 | SSO bileti taşıyan adres çevrimdışı önbelleğe yazılıyordu. | Bilet 90 sn sonra geçersiz olsa da tarayıcıda kalıyordu. | `sw.js` `?sso=` içeren adresi önbelleğe almaz. |

Uygulama: `canli-surum/kaynak/numap_baglantisi.py` (8 değişiklik), `oyna/galaksay-ek.js` §7, `sw.js`. Kaynak koda da işlendi: `src/services/numapApi.js` (lisans denetimi) ve `src/services/syncEngine.js`.

## 3. Giriş güvenliği denetimi

GalakSay ücretli olacağı için bütün giriş yolları incelendi: kaptan PIN'i, cihaz (yönetici) şifresi, yerel öğretmen hesapları, NuMap girişi ve SSO, e-posta doğrulamalı hesap, yedekleme.

Sağlam bulunanlar:
- **Yönetici kilitleme:** 5 hatalı denemeden sonra artan bekleme süresi (30 sn'den 15 dk'ya kadar).
- **Parolalar:** Zayıf PIN listesi, tek kullanımlık kurtarma kodu. Öğretmen parolaları PBKDF2-SHA256 (100.000 tur, rastgele tuz) ile saklanıyor.
- **NuMap istekleri:** Çerez gönderilmiyor (`credentials: omit`), 5 sn zaman aşımı var, 401/403 yanıtında oturum temizleniyor.
- **Kısayollar:** Demo, hata ayıklama ya da adres parametresiyle şifre atlanamıyor.

Giderilenler:

| Önem | Bulgu | Düzeltme |
|---|---|---|
| Yüksek | NuMap oturumuyla açılan merkezde "Tüm veriyi sil" ve "Yedekten geri yükle" görünüyordu. Silme cihaz şifresini de kaldırdığı için ardından herkes yeni bir yönetici şifresi koyup cihazı ele geçirebiliyordu. | İkisi de yalnız cihaz yöneticisi oturumunda görünür. |
| Orta | Dışa aktarma her yerel öğretmene açıktı; dosyaya cihazdaki bütün çocukların verisi ve e-posta hesabı belirteçleri (`galaksay_hesap`) giriyordu. | Dışa aktarma yalnız yöneticide. `galaksay_hesap` gizli anahtarlara eklendi: dışa aktarılmaz, geri yüklemede üzerine yazılmaz. |
| Orta | NuMap çıkışında öğrenci önbelleği (ad, doğum tarihi, okul, yanıtlar) cihazda kalıyordu. | Çıkışta silinir (KVKK). |
| Orta | Cihaz şifresi yokken boşta kilitten dönüş yalnız 2 sn basılı tutmayla açılıyordu. NuMap öğrenci listesi gözetimsiz cihazda erişilebilir kalıyordu. | Bu durumda boşta kilit NuMap oturumunu da kapatır. |
| Orta | İçerik güvenliği politikası satır içi betiklere izin veriyordu (`'unsafe-inline'`). | Üç satır içi betik dış dosyalara taşındı (`/site.js`, `galaksay-ek.js` §8). Politika artık satır içi betik çalıştırmaz. `Strict-Transport-Security` eklendi. |
| Düşük | Eski biçimde (düz ya da tuzsuz) saklanmış yönetici şifresi kabul ediliyor ama yükseltilmiyordu. | İlk doğru girişte PBKDF2'ye yükseltilir. |

Uygulama: `canli-surum/kaynak/giris_guvenligi.py` (6 değişiklik), `_headers`, `index.html`, `oyna/index.html`.

Doğrulama: `numap-check` (26 denetim), taklit NuMap sunucusuyla. Mevcut testlerin hepsi de yeniden geçti: hesap, bağlama, yedekleme, kaptan, liste, seslendirme, içerik, sesli yönerge.

## 4. Kalan sınırlılık: lisans henüz sunucuda denetlenmiyor

GalakSay durağan dosyalardan oluşan bir sitedir. Bu yüzden bütün denetimler tarayıcıda çalışır:
- **Hesapsız kaptan girişi:** Kaptan akışı hesapsız oynatır.
- **Cihaz şifresi:** Tarayıcı geliştirici araçlarıyla atlanabilir. Bu şifre bir çocuk ve paylaşılan cihaz kilidi olarak düşünülmelidir, güvenlik sınırı olarak değil.

Gerçek koruma yalnız sunucuda sağlanabilir. Önerilen tasarım (Cloudflare Pages Functions, NuMap hesabıyla):
1. **Kapı ara katmanı.** `functions/oyna/_middleware.js`, `/oyna/*` isteklerinde imzalı ve `HttpOnly` bir lisans çerezi arar. Çerez yoksa istek giriş sayfasına yönlenir.
2. **Çerezin verilmesi.** `functions/api/lisans/giris` ve `…/sso`, NuMap'e giriş ya da bilet değişimi yapar ve yetkide `galaksay` arar. Yetki listesi tanımsız olan hesap reddedilir. Geçerli hesaba 7 günlük çerez verilir.
3. **Yeniden denetim.** Çerez 24 saatten eskiyse `/auth/me` ile yeniden denetlenir; iptal edilen lisans böylece bir gün içinde düşer.
4. **Çevrimdışı kullanım.** Okullarda bağlantı kesintisi için 7 günlük çevrimdışı hoşgörü tanınır; service worker çerezin süresini denetler.

Karar gerektiren nokta: aileler ve bireysel kullanıcılar (kaptan girişi) nasıl lisanslanacak? Seçenekler:
- **(a)** Her kullanıcı bir NuMap hesabı açar (ABMATO veli planı gibi).
- **(b)** Kurum lisansı altında ailelere davet bağlantısı verilir.
- **(c)** GalakSay'ın kendi e-posta hesabı (hazır, şu an kapalı) sunucu tarafında Firebase belirteci ve lisans alanıyla doğrulanır.

Sunumdan önce kapının açılması önerilmez: yanlış yapılandırma sunum sırasında oyunu kilitleyebilir.

## 5. NuMap ilişkisini güçlendirme önerileri

### 5.1 NuMap sunucusunda (numap-app)

| Öneri | Gerekçe | İş |
|---|---|---|
| SSO biletine hedef uygulama (`aud: galaksay`) eklemek; bilet değişiminde bu uygulamanın yetkisini denetlemek | Bugün bilet hangi uygulama için üretildiğini taşımıyor; yetki denetimi yalnız istemcide. | `_lib/sso.ts`, `sso/issue.ts`, `sso/exchange.ts` |
| Bileti tek kullanımlık yapmak (tek kullanımlık sayı D1 ya da KV'de tutulur, ömür 60 sn) | 90 sn içinde aynı bilet yeniden kullanılabiliyor. Başkasının bileti bir cihazı onun hesabına bağlayabilir; bu tür saldırıya login CSRF denir. | `_lib/sso.ts` (kodda "ileride" diye not düşülmüş) |
| `/game-progress` ve `/sessions` isteklerinde GalakSay yetkisini denetlemek (`userHasEntitlement(env, user, 'galaksay')`) | Lisans sunucuda da uygulanır; istemci atlatılsa bile veri akmaz. | `api/game-progress.ts` |
| Tarama anahtarını (`studentKey`) GalakSay'a SSO ile birlikte göndermek: `?sso=…&ogrenci=<key>` | Öğretmen NuMap'te bir çocuğun sayfasından "GalakSay'da aç" dediğinde oyun doğrudan o çocukla açılır; listeden yeniden seçmek gerekmez. | NuMap `GameProgressPage`, GalakSay açılış |

### 5.2 Pedagojik bütünleşme

1. **Tarama → müdahale planı → oyun.** NuMap'in alan puanları (sayı hissi, hesaplama, sıralama) GalakSay'ın başlangıç düzeyini ve öncelikli gezegenlerini belirler. GalakSay'da bu eşleme var (`numapAdapter`); NuMap arayüzünde "önerilen GalakSay rotası" olarak gösterilirse öğretmen ilişkiyi görür.
2. **Ön test ve son test.** GalakSay raporundaki "NuMap ön–son karşılaştırması" (aynı 1–6 risk ölçeği) NuMap'teki yörünge sayfasına geri yazılabilir. Böylece müdahalenin etkisi tek yerde izlenir: tarama, 42 oturum ve yeniden tarama (Kohn ve ark., 2020 doz ölçütü).
3. **Yeniden tarama hatırlatması.** Hedef doza ulaşan çocuk için NuMap'te "yeniden tarama zamanı" uyarısı üretmek.
4. **Uyumsuz karşılaştırma maddeleri.** GalakSay'daki yeni uyumsuz karşılaştırma maddelerinin (boyut yanılsaması) doğruluğunu `/game-progress` içinde ayrı bir alan olarak göndermek. Bu, NuMap'teki sayı hissi alt testine ek bir işaret sağlar.
5. **Tek marka ve tek giriş.** GalakSay giriş ekranında "NuMap ile giriş" birincil düğme olur. Kurum lisansı NuMap'te yönetilir; GalakSay'da ayrı bir hesap sistemi gerekmez. Bu, §4'teki (a) ya da (b) seçeneğiyle uyumludur.

## 6. Uygulama sırası

1. **Yapıldı:** §2 ve §3.
2. **Sunumdan sonra:** NuMap tarafında §5.1'in ilk üç maddesi (sunucu değişikliği, küçük).
3. **Lisans modeline karar verildikten sonra:** §4'teki sunucu kapısı.
4. **Pilot çalışma ile birlikte:** §5.2.
