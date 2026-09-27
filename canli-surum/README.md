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
