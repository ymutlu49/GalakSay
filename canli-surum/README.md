# Canlı sürüm kopyası (galaksay.com)

Bu klasör, galaksay.com'da yayında olan **masaüstü (Jimaro) v5.10.0** derlemesinin birebir
kopyasıdır. Kaynak kodu bu depoda olmadığı için canlı hatalar bu kopya üzerinde düzeltilir ve
buradan yayımlanır. Masaüstü kaynağı depoya geldiğinde bu klasör kaldırılır.

- Kaynak: Cloudflare Pages dağıtımı `104bd678` (25 Eyl 2026 15:04), `crawl.py` ile eksiksiz indirildi.
- `_headers`: canlı yanıtlardaki güvenlik başlıklarından birebir yeniden kuruldu.
- Yayın: GitHub → Actions → "Canlı kopyayı yayınla" → hedef `onizleme` (önizleme) ya da `main` (galaksay.com).

## Kopya üzerindeki düzeltmeler

| Tarih | Dosya | Değişiklik |
|---|---|---|
| 27 Eyl 2026 | `site/oyna/index.html` | `.space-btn-hover` için `position: relative`, `::after` için `pointer-events: none`. Basma efekti katmanı tüm ekranı kaplayıp "Öğrenci Girişi" ve öğrenci kartı tıklamalarını yutuyordu; "Devam et" çalışmıyordu. |
| 27 Eyl 2026 | `site/sw.js` | Sürüm etiketi `galaksay-v5.10.1-20260927-tiklama`: tarayıcılar yeni sürümü hemen alır. |
| 27 Eyl 2026 | `site/oyna/assets/WelcomeScreen-BD-9Cs8v.js` | Karşılama parçası **hesapsız kaptan girişiyle** değiştirildi (okunur kaynak: `kaynak/WelcomeScreen.captain.js`). Açılış: "Yolculuğa Başla" ya da "Devam et · son kaptan"; 3 adımlı kaptan oluşturma (avatar → ad → yaş); "Kaptanlar" listesi ve "Yeni Kaptan"; TR/KU/EN dil döngüsü; sesli yönergeler. Şifreli profiller kilit korumalı eski seçiciye yönlenir. |
| 27 Eyl 2026 | `site/oyna/assets/index-pKper_0i.js` | Karşılama bileşenine `onPick` bağlantısı eklendi (`Pe(_,{directPlay:!0})`): kaptan seçimi/oluşturma çocuğu doğrudan oyuna alır. Tek ifade değişikliği. |
| 27 Eyl 2026 | `site/sw.js` | Sürüm etiketi `galaksay-v5.11.0-20260927-kaptan`. |

## Doğrulama (yerel, gerçek fare ve dokunuş tıklamasıyla)

- Masaüstü, telefon ve tablette 45 denetim: kaptan oluşturma, doğrudan oyuna geçiş, harita, çocuk değiştirme, "Devam et", kaptan listesi, TR/KU/EN, öğretmen girişi, sayfa hatası yok.
- 20 öğrencili liste: her kart kendi çocuğunu açıyor; "Kaldığın yerden devam" görevi açıyor; şifreli profil kilit korumalı seçiciye gidiyor.

## 27 Eylül 2026 (öğleden sonra): sığdırma, görev seçimi, yörünge denetimi, tanıtım görselleri

| Dosya | Değişiklik |
|---|---|
| `site/oyna/index.html` | Telefon/tablet (≤1024 px): içeriğe binen yüzen süs gezegenleri, ay ve matematik simgeleri gizlendi; nebula lekeleri soluklaştırıldı. Çocuk merkezindeki gezegen sırası taşıyordu → 4+4 ızgara. Görev seçim kartları koyu temadan kalan yarı saydam lacivert zeminden beyaz karta; "Sıradaki" kart vurgulu. |
| `site/oyna/assets/GalakSay-hIWssnXL.js` | Öğrenme yörüngesi düzeltmeleri (19 veri değişikliği; `kaynak/yorunge_duzeltmeleri.py`, gerekçeler `docs/YORUNGE_DENETIMI.md`). |
| `site/index.html`, `site/img/ekran/*.webp` | "Uygulamadan Görüntüler" galerisi (7 telefon ekranı), menüde "Görüntüler"; "Nasıl Çalışır" 1. adım yeni hesapsız girişe göre güncellendi. |
| `site/sw.js` | Sürüm etiketi `galaksay-v5.12.0-20260927-yorunge`. |

## 27 Eylül 2026 (akşam): madde ve seçenek denetimi

14.600 üretilmiş madde denetlendi. Gerekçeler ve ölçümler `docs/MADDE_DENETIMI.md` dosyasındadır.

| Dosya | Değişiklik |
|---|---|
| `site/oyna/assets/GalakSay-hIWssnXL.js` | Seçenek ve madde dengesi düzeltmeleri (8 değişiklik; `kaynak/secenek_duzeltmeleri.py`). Doğru yanıt artık %33 oranında ortada; önce %60 idi. Tahmin çeldiricileri ayırt edilebilir aralıkta. 2. seviye çıkarmada sıfır kuralı payı %25. |
| `site/sw.js` | Sürüm etiketi `galaksay-v5.13.0-20260927-secenek`. |

Betik yörünge düzeltmelerinden sonra uygulanır: önce `yorunge_duzeltmeleri.py`, sonra `secenek_duzeltmeleri.py`.

## 27 Eylül 2026 (gece): kullanılabilirlik ve ölçme iyileştirmeleri

Ayrıntı ve gerekçeler `docs/IYILESTIRMELER.md` dosyasındadır.

| Dosya | Değişiklik |
|---|---|
| `site/oyna/galaksay-ek.js` (yeni) | Okunur ek betik. Kurmancîde oyun artık Türkçe sesle okumuyor. Cihazda Kurmancî ses varsa onu kullanıyor, yoksa sessiz kalıp konuşma zamanlamasını koruyor. |
| `site/oyna/index.html` | Ek betik oyundan önce yükleniyor. |
| `site/oyna/assets/GalakSay-hIWssnXL.js` | `kaynak/iyilestirmeler.py`: tek dokunuşla Bugünün Görevi düğmesi, günlük tekrar görevinin en zayıf üç görev arasında dönmesi, iki seçenekli görevlerde 8 soruluk Kaptan Sınavı. |
| `site/oyna/assets/WelcomeScreen-BD-9Cs8v.js` | Kaptan listesinde yedekleme yolunu gösteren not (`kaynak/WelcomeScreen.captain.js`). |
| `site/sw.js` | Sürüm etiketi `galaksay-v5.14.0-20260927-iyilestirme`. |

Uygulama sırası: `yorunge_duzeltmeleri.py` → `secenek_duzeltmeleri.py` → `iyilestirmeler.py`.

## 27 Eylül 2026 (gece, 2): tek giriş merkezi ve rol duyarlı yetişkin girişi

Eleştiri ve gerekçeler `docs/GIRIS_VE_HESAP_MODELI.md` dosyasındadır.

| Dosya | Değişiklik |
|---|---|
| `site/oyna/assets/WelcomeScreen-BD-9Cs8v.js` | Giriş merkezi (`kaynak/WelcomeScreen.captain.js`). Çocuklar için açıklayıcı "Devam et" kartı, ilk kez gelen için üç adım. Yetişkinler için "Öğretmen · Uzman" ve "Ebeveyn" döşemeleri. `?giris=` derin bağlantıları ve kilit notu. |
| `site/oyna/galaksay-ek.js` | Rol duyarlı metin tablosu (`window.__gsRoleText`). |
| `site/oyna/assets/{GalakSay,index,TeacherLogin,ChildSelect}-*.js` | `kaynak/giris_merkezi.py`: çocuk merkezinde karşılama kartı ve kart sırası, başlık etiketleri, "Çocuk girişi" düğmesinin merkeze dönmesi, yetişkin panelinde 10 dakikalık hareketsizlik kilidi, çeviri işlevinin rol tablosundan geçmesi. |
| `site/index.html` | "Öğretmen Girişi", "Öğretmen / Uzman Girişi" ve "Ebeveyn Girişi" bağlantıları. |
| `site/sw.js` | Sürüm etiketi `galaksay-v5.15.0-20260927-giris`. |

Uygulama sırası: `yorunge_duzeltmeleri.py` → `secenek_duzeltmeleri.py` → `iyilestirmeler.py` → `giris_merkezi.py`.

## 27 Eylül 2026 (gece, 3): e-posta doğrulamalı yetişkin hesabı (anahtar tanımlanınca etkin)

| Dosya | Değişiklik |
|---|---|
| `site/oyna/galaksay-hesap.js` (yeni) | Firebase Authentication REST istemcisi: kayıt, giriş, doğrulama e-postası, doğrulama denetimi, şifre sıfırlama. |
| `site/oyna/hesap-ayar.js` (yeni) | Web API anahtarı. Boşsa sistem kapalı; yayın akışı `FIREBASE_API_KEY` depo değişkeninden doldurur. |
| `site/oyna/assets/WelcomeScreen-BD-9Cs8v.js` | Hesap ekranları: hesap oluştur, giriş yap, e-postanı doğrula, şifremi unuttum. Kurulum kapısı: yeni kaptan ve yetişkin paneli doğrulanmış hesap ister. Merkezde hesap rozeti. |
| `site/oyna/index.html` | Hesap betikleri. |
| `site/_headers` | connect-src'ye Google kimlik uçları eklendi. |
| `site/gizlilik.html` | Aydınlatma metnine yetişkin hesabı bölümü. |
| `.github/workflows/deploy-live-snapshot.yml` | Hesap ayarı adımı. |
| `site/sw.js` | Sürüm etiketi `galaksay-v5.16.0-20260927-hesap`. |

Etkinleştirme: `docs/HESAP_KURULUMU.md`.

## 27 Eylül 2026 (gece, 4): çocuk girişinin yetişkine bağlanması, dikey ortalama

| Dosya | Değişiklik |
|---|---|
| `site/oyna/assets/WelcomeScreen-BD-9Cs8v.js`, `kaynak/cocuk_baglama.py` | Yeni kaptanı yetişkin kurar ve kaptan o yetişkinin hesabına bağlanır. Yetişkin panelinde oluşturulan çocuklar da bağlanır. |
| `site/oyna/index.html` | Kaydırılabilir sütun düzenlerinde içerik dikeyde ortalanır (giriş ekranları ve oyunlar). |

## 27 Eylül 2026 (gece, 5): görüntü düzeyinde madde denetimi ve isteğe bağlı seslendirme

73 görevin her seviyesi gerçek oyun ekranında, Türkçe ve Kurmancî olarak oynatıldı. Kaydedilenler: kök, şıklar, 🗣️ ile okunan metin, geri bildirim ve ipucu. Yöntem, bulgular ve önce/sonra ölçümü `docs/MADDE_GORUNTU_DENETIMI.md` dosyasındadır.

| Dosya | Değişiklik |
|---|---|
| `site/oyna/assets/GalakSay-hIWssnXL.js` | `kaynak/madde_denetimi_duzeltmeleri.py` ile metin, ses, geri bildirim ve Kurmancî düzeltmeleri. Başlıcaları: çıkarmada görünmeyen işlenen, saat düzeltme satırı, ad ve renk ekleri, desen sesi, şekil alt yazısı, 7 görevin Kurmancî/İngilizce açıklaması, Kurmancî düzeltme satırları, "Soruyu dinle" düğmesinin her çocukta görünmesi. |
| `site/oyna/galaksay-ek.js` | Bölümler: 0 seslendirme yalnız istenince; 3 göreve ve sorunun sayılarına uygun ipucu; 4 göreve uygun maskot öyküsü; 5 Kurmancî oyunda Türkçe kalan maskot cümleleri; 6 şık yazısının düğmeye sığması. |
| `site/oyna/index.html` | `galaksay-ek.js?v=4`. |
| `site/sw.js` | Sürüm etiketi `galaksay-v5.17.0-20260927-madde`. |

Uygulama sırası: `yorunge_duzeltmeleri.py` → `secenek_duzeltmeleri.py` → `iyilestirmeler.py` → `giris_merkezi.py` → `cocuk_baglama.py` → `madde_denetimi_duzeltmeleri.py`.

## 27 Eylül 2026 (gece, 6): içerik iyileştirmeleri (planın ilk altı maddesi)

Gerekçeler `docs/ICERIK_IYILESTIRME_PLANI.md` dosyasındadır; uygulama durumu ve ölçüm aynı belgenin §5 bölümündedir.

| Dosya | Değişiklik |
|---|---|
| `site/oyna/assets/GalakSay-hIWssnXL.js` | `kaynak/icerik_iyilestirmeleri.py` ile yapılanlar: övgü ve açıklama metinleri çocuk dilinde ve süreç odaklı (TR, KU, EN); ipucu başlığı "İpucu 1 — Kendine sor"; karşılaştırmada uyumsuz (boyut yanılsamalı) maddeler açıldı ve şıklarda sayı yanıttan önce gizlendi; strateji kuralı ipucu istenince ya da yanıttan sonra görünür; sözel problemlerde sayılar rakamla, her cümle ayrı satırda, işlem adımında şerit model. |
| `site/oyna/assets/ChildSelect-B-s0Bh40.js` | Çocuk formunda "Sesli yönergeler (henüz okumuyor)" destek bayrağı. |
| `site/oyna/assets/WelcomeScreen-BD-9Cs8v.js` | Kaptan oluşturmada "Yönergeleri kendiliğinden sesli oku" seçeneği; okul öncesinde kendiliğinden açık. |
| `site/oyna/galaksay-ek.js` | Seslendirme kapısı çocuğun "Sesli yönergeler" ya da "Okuma güçlüğü" bayrağını tanır. |
| `site/oyna/index.html` | `galaksay-ek.js?v=5`. |
| `site/sw.js` | Sürüm etiketi `galaksay-v5.18.0-20260927-icerik`. |

Uygulama sırası: … → `madde_denetimi_duzeltmeleri.py` → `icerik_iyilestirmeleri.py`.

## 28 Eylül 2026: NuMap bağlantısı ve giriş güvenliği

Ayrıntı ve gerekçeler: [docs/NUMAP_BAGLANTISI.md](../docs/NUMAP_BAGLANTISI.md).

| Dosya | Değişiklik |
|---|---|
| `site/oyna/assets/GalakSay-hIWssnXL.js` | NuMap düğmesi `numap.netlify.app` (ilgisiz site) yerine `getnumap.com`'u açar. |
| `site/oyna/assets/index-pKper_0i.js` | NuMap giriş, doğrulama ve SSO yanıtlarında GalakSay yetkisi denetlenir; plan ve yetkiler saklanır. Başarısız SSO iletisi gösterilir. NuMap çıkışında öğrenci önbelleği silinir. Cihaz şifresi yoksa boşta kilit NuMap oturumunu kapatır. Eski biçimli yönetici şifresi PBKDF2'ye yükseltilir. |
| `site/oyna/assets/syncEngine-DrzZ2bLj.js` | NuMap'e bağlı yerel çocuğun verisi `numap_<studentKey>` kimliğiyle gönderilir; hata ayıklama günlüğü kapatıldı. |
| `site/oyna/assets/ChildSelect-B-s0Bh40.js` | Tüm veriyi silme, geri yükleme ve dışa aktarma yalnız cihaz yöneticisinde. E-posta hesabı belirteçleri yedeğe girmez. |
| `site/oyna/galaksay-ek.js` | §7 NuMap iletisi, §8 service worker kaydı (satır içi betikten taşındı). |
| `site/index.html`, `site/site.js`, `site/oyna/index.html`, `site/_headers` | Satır içi betik kalmadı; CSP `script-src`'den `'unsafe-inline'` çıkarıldı; HSTS eklendi. |
| `site/sw.js` | `?sso=` içeren adres önbelleğe yazılmaz; sürüm `galaksay-v5.19.0-20260928-numap`. |

Uygulama sırası: … → `icerik_iyilestirmeleri.py` → `numap_baglantisi.py` → `giris_guvenligi.py`.

## 28 Eylül 2026 (öğleden sonra): lisans kapısı ve NuMap bütünleşmesi

Ayrıntı: [docs/NUMAP_BAGLANTISI.md](../docs/NUMAP_BAGLANTISI.md) §6.

| Dosya | Değişiklik |
|---|---|
| `functions/` (Pages Functions) | Lisans kapısı: `oyna/_middleware.js` (kapı açıksa `/oyna/` lisans çerezi ister; `?sso=` sunucuda değişir), `api/lisans/oturum` (NuMap belirteci → lisans çerezi), `aile` (aile daveti), `durum`, `cikis`, `ilerleme` (aile cihazından NuMap'e). `_ayar.js` kapı bayrağı (varsayılan kapalı). |
| `site/giris.html`, `giris.js`, `giris.css` | NuMap hesabıyla giriş sayfası; giriş tarayıcıdan NuMap'e yapılır. |
| `site/aile.html`, `aile.js` | Aile bağlantısı sayfası (`/aile#…`); açık rıza seçimi. |
| `site/_routes.json` | Kapı kapalıyken yalnız `/api/lisans/*` işlevlere gider. |
| `site/oyna/assets/*` | `kaynak/lisans_kapisi.py`: aile cihazından ilerleme, `?ogrenci=` ile öğrenci seçimi, NuMap çıkışında lisans çerezinin silinmesi, taze girişte öğretmen merkezi, karşılaştırma maddelerinde `incongruent` işareti. |
| `site/oyna/galaksay-ek.js` | §9 devir çerezi ve `?ogrenci=`. |
| `site/gizlilik.html` | NuMap hesabı ve aile bağlantısıyla aktarım. |
| `.github/workflows/deploy-live-snapshot.yml` | `lisans_kapisi` girdisi (kapali/acik); wrangler `canli-surum`'dan çalışır (`functions/` dahil). |

Uygulama sırası: … → `giris_guvenligi.py` → `lisans_kapisi.py`.
