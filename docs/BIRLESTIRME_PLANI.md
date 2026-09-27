# GalakSay — İki kod tabanının birleştirme planı (27 Eylül 2026)

## Durum

GalakSay iki ayrı çizgide gelişti ve bu çizgiler Ağustos başında ayrıldı.

| Çizgi | Nerede | Son sürüm | Tema |
|---|---|---|---|
| Masaüstü (Jimaro) | Yerel bilgisayar; GitHub'da yok | v5.10.0, 25 Eyl 2026 15:04'te galaksay.com'a yayımlandı | Açık renk |
| GitHub | `ymutlu49/GalakSay`, `main` | v6.0.0, 26 Eyl 2026 | Koyu uzay |

Cloudflare dağıtım geçmişinde masaüstü çizgisinden 15 commit görünüyor. Bunların hiçbiri
GitHub deposunda yok. Yayımlanan paketlerde kaynak haritası bulunmadığı için kaynak kodu
yayından geri çıkarılamaz.

## Özellik karşılaştırması

Karşılaştırma, iki derlenmiş paketteki kullanıcıya görünen metinlerden yapılmıştır.
Masaüstü paketinde yaklaşık 7.850, GitHub paketinde yaklaşık 4.570 ayrı arayüz metni vardır.

| Özellik | Masaüstü | GitHub |
|---|---|---|
| Açık renk tasarım (giriş, çocuk merkezi, harita) | var | yok |
| İngilizce arayüz | var | yok |
| Para (lira) ve cetvel görevleri | var | yok |
| Kart koleksiyonu, kaptan karnesi | var | yok |
| Tekrar Durağı, Hızlı Keşif, Bugünün Görevi | var | yok |
| Yönetici şifresi için kurtarma kodu | var | yok |
| Araştırma onamı, isteğe bağlı NuMap bağlama | var | yok |
| Kesirya gezegeni ve kesir görevleri | yok | var |
| Keşif Uçuşu: 8 soruluk başlangıç değerlendirmesi | yok | var |
| Hesapsız giriş: açılış ekranı ve kaptan oluşturma sihirbazı | yok | var |
| Demo sınıfı: 4 çocuk ve 24 günlük geçmiş | yok | var |
| Analitik: hedef çizgisi, örneklem eşikleri, risk 1–6, bireysel PDF raporu | yok | var |
| Kanıt temeli ekranı ve kaynakçalı tanıtım sayfası | yok | var |
| "Anlık Algılama" terim birliği | yok | var |

## Karar

Masaüstü çizgisi daha zengin olduğu için temel o olmalıdır. GitHub çizgisindeki özellikler
masaüstü koduna taşınır. Taşınacaklar, kendi dosyalarında durdukları için büyük ölçüde
bağımsızdır:

1. `src/screens/TitleScreen.jsx`, `CaptainCreate.jsx`, `CaptainPicker.jsx`, `entryStrings.js`,
   `src/utils/speak.js` ve `src/main.jsx` içindeki giriş yönlendirmesi. Açık temaya uyarlanır.
2. Keşif Uçuşu: `GalakSay.jsx` içindeki `CALIB_SEQ`, `startCalibration` ve sonuç ekranı;
   `src/data/categories.js` içindeki `CALIBRATION_MODE`.
3. Analitik: `src/analytics/*`, `src/screens/Dashboard.jsx`, `ClassPanel.jsx`,
   `NuMapComparison.jsx`, `CategoryDetail.jsx`, `src/utils/csvExport.js`.
4. Demo sınıfı: `src/services/demoData.js` ve testi.
5. Kesirya ve kesir görevleri.
6. Kanıt temeli: `src/screens/EvidenceBase.jsx`, tanıtım sayfasının kanıt bölümü.

## Gereken tek adım

Masaüstündeki Jimaro içindeki GalakSay proje klasöründe:

```
git add -A
git commit -m "Jimaro guncel surum"
git push https://github.com/ymutlu49/GalakSay.git HEAD:jimaro
```

Git kullanılmayacaksa klasör `node_modules` olmadan zip'lenip Google Drive'a yüklenir.

## Dağıtım

- `main` dalına gönderim artık galaksay.com'u güncellemez. Birleştirme bitene kadar dağıtım
  yalnız elle yapılır: GitHub, Actions, "Deploy to Cloudflare Pages", Run workflow.
- "Cloudflare Pages teşhis" iş akışı dağıtım geçmişini listeler.
- "Cloudflare Pages geri alma" iş akışı üretimi seçilen bir dağıtıma döndürür.
