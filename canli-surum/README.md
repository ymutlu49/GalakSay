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
