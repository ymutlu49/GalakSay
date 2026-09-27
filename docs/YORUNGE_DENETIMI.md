# GalakSay — Öğrenme yörüngesi denetimi (27 Eylül 2026)

Kapsam: canlı sürümdeki (galaksay.com, masaüstü v5.10 çizgisi) **73 görevin tamamı**. Her görev için
yörünge eşlemesi (yörünge, basamak, basamak numarası, yaş), gezegen yerleşimi ve dört yaş grubunun
yolculuk durakları Clements ve Sarama’nın öğrenme yörüngeleriyle (Learning and Teaching Early Math,
2. baskı, 2014; LearningTrajectories.org) karşılaştırıldı. Seviye sayı aralıkları oyundaki seviye tablosundan
alındı: Seviye 1 → 5, 2 → 10, 3 → 15, 4 → 20, 5 → 20; yaş gruplarının kullandığı seviyeler okul öncesi 1-2,
1. sınıf 2-3, 2. ve 3. sınıf 3-4.

## Sonuç

| Karar | Görev sayısı |
|---|---|
| Uygun | 41 |
| Düzeltildi | 21 |
| Öneri (kodda değişiklik gerektirir) | 11 |

Düzeltmeler yalnız veri düzeyindedir: yörünge etiketleri (öğretmen ekranı ve raporlarda görünür) ve yolculuk
duraklarının görev listeleri. Uygulama betiği: `canli-surum/kaynak/yorunge_duzeltmeleri.py`.

### Yapılan düzeltmelerin özeti

1. **Kanonik olmayan basamak adı.** "Kavramsal Sanbil (7’ye kadar)" diye bir basamak yok; basamaklar Algısal (4),
   Algısal (5), Kavramsal (5), Kavramsal (10), Kavramsal (20). Dört görev düzeltildi.
2. **Yanlış yörünge.** Tahmin (Sanbil → Karşılaştırma-Tahmin), önce/sonra (Karşılaştırma → Sayma), onluk geçişi,
   sayı içinde sayılar, çubuk ayırma, ölçme bölmesi ve tekrarlı toplama doğru basamaklara taşındı.
3. **Kod çakışması.** Ölçme ve Örüntü aynı kodu (Y08) paylaşıyordu; Ölçme Y07 oldu. Bir toplama-çıkarma görevi
   Y05 koduyla işaretliydi; Y04 oldu.
4. **Eksik kayıt.** Saat okuma ve para sayma görevlerinin yörünge kaydı yoktu; eklendi.
5. **Ön koşul sırası.** 1. sınıf yolunda "üzerine sayarak toplama" 5. durakta, ön koşulu "istenen sayıdan sayma"
   10. durakta idi. İkincisi 5. durağa da eklendi.
6. **Okul öncesi örüntü boşluğu.** Okul öncesi yolunda hiç örüntü görevi yoktu; AB örüntüsü ve örüntü aktarma
   4. durağa eklendi.

### Kod değişikliği gerektiren öneriler

- **2. sınıfta sayı aralığı.** Toplama ve çıkarmada sayılar 20’yi geçmiyor; iki basamaklı işlemler için üreteç
  aralığı 100’e genişletilmeli.
- **Gezegen yerleşimi.** Saat okuma Sayma gezegeninde, takvim okuma Toplama-Çıkarma gezegeninde, geometri görevi
  Örüntü gezegeninde, tahmin görevi Sanbil gezegeninde. Ölçme ve geometri görevleri için ayrı bir durak ya da
  Terazya daha tutarlı.
- **Sayı korunumu.** Clements–Sarama’da 7 yaş basamağı; okul öncesi yolunda keşif olarak kalabilir, geçiş ölçütü
  olmamalı.
- **Yaş etiketleri.** Satır-sütun düzeni, bildiklerinden türeten çarpma-bölme ve paylaştırarak bölme için
  etiketlerdeki 7 yaş, yörüngedeki 8 yaşa göre iyimser.

## Görev görev tablo

Durak sütunu: yaş grubu ve durak numarası (OÖ = okul öncesi; 1., 2., 3. = sınıf).

| Gezegen | Görev | Yörünge | Basamak | No | Yaş | Durak | Karar | Not |
|---|---|---|---|---|---|---|---|---|
| Sayalon | Yıldız Eşle! (`matching`) | Y02 Sayma | Birebir Eşleyerek Sayan → Sayıp Veren (10 ve ötesi) | 4–8 | 3-6 | OÖ3 | **Uygun** |  |
| Sayalon | Göktaşı Eşle! (`quantityMatch`) | Y02 Sayma | Birebir Eşleyerek Sayan → Sayıp Veren (10 ve ötesi) | 4–8 | 3-6 | OÖ1, 1.1 | **Uygun** |  |
| Sayalon | Göktaşı Say! (`counting`) | Y02 Sayma | Küçük Sayıları Sayan (Kardinal Değer) → Sayıp Veren (10 ve ötesi) | 5–8 | 4-6 | OÖ1, 1.1 | **Uygun** |  |
| Sayalon | Yıldız Taşı Diz! (`buildNumber`) | Y02 Sayma | İstenen Sayıda Nesne Veren (Küçük Sayılar) | 7 | 4 | OÖ5, 1.4 | **Uygun** |  |
| Sayalon | Sıra Keşfi! (`ordinalCount`) | Y03 Karşılaştırma ve Sıralama | İlk-İkinci Sıra Sayan → Sıra Sayan (Ordinal Counter) | 4–13 | 4-6 | OÖ4, 1.1 | **Öneri** | Sıra sayıları Karşılaştırma-Sıralama yörüngesinde; Sayma gezegeninde durması kabul edilebilir. |
| Sayalon | Geri Sayım! (`backwardCount`) | Y02 Sayma | 10’dan Geriye Sayan (oyunda 20’ye dek genişletilmiş) | 9 | 5-6 | 1.6 | **Uygun** |  |
| Sayalon | Yörüngeden Say! (`counterFromN`) | Y02 Sayma | İstenen Sayıdan Sayan (öncesi/sonrası) | 10 | 6 | OÖ4, 1.5, 1.10, 2.5b | **Düzeltildi** | 1. sınıf yolunda ön koşul olduğu "üzerine sayarak toplama"dan (5. durak) sonra, 10. durakta geliyordu; 5. durağa da eklendi. |
| Sayalon | Galaktik Ritim! (`skipCount`) | Y02 Sayma | Onar Ritmik Sayan (100’e kadar) → Ritmik Sayan (Beşer/İkişer) | 11–14 | 6-7 | 1.10, 2.6, 3.6 | **Uygun** |  |
| Sayalon | Onluk Geçidi! (`decadeCount`) | Y02 Sayma | 100’e Kadar Sayan (onluk geçişleri) | 12 | 6 | 1.10, 2.5b | **Düzeltildi** | Onluk geçişi "100’e Kadar Sayan" basamağıdır; "Ritim Tutarak Üzerine Sayan" yanlış etiketti. |
| Sayalon | Yanılsama mı? (`conservation`) | Y02 Sayma | Sayının Korunduğunu Bilen | 18 | 7 | OÖ8, 1.3, 2.10, 3.10 | **Öneri** | Sayı korunumu Clements–Sarama’da 7 yaş basamağıdır; okul öncesi yolunun 8. durağında yer alıyor. Keşif amaçlı kalabilir, başarı ölçütü olarak kullanılmamalı. |
| Sayalon | Görev Saati! (`clockRead`) | Y07 Ölçme (Zaman) | Tam ve Yarım Saati Okuyan | 2–4 | 6-8 | 1.10, 2.5b, 3.6 | **Düzeltildi** | Yörünge kaydı yoktu; Ölçme (Zaman) kaydı eklendi (Clements–Sarama dışı, MEB zaman ölçme). Saat okuma Sayma gezegeninde (Sayalon); ölçme görevleriyle birlikte Terazya’da olması daha tutarlı. |
| Şimşeron | Işık Hızı! (`subitizing`) | Y01 Saymadan Anlık Bilme (Sanbil) | Algısal Sanbil (4’e kadar) → Kavramsal Sanbil (10’a kadar) | 5–8 | 4-6 | OÖ2, 1.1, 2.1, 3.1 | **Düzeltildi** | Basamak adı kanonik değildi ("Kavramsal Sanbil 7’ye kadar" yok); "10’a kadar" yapıldı. |
| Şimşeron | Beşli Radar! (`fivesFrame`) | Y01 Saymadan Anlık Bilme (Sanbil) | Algısal Sanbil (5’e kadar) | 6 | 4-5 | OÖ2, 1.2 | **Uygun** |  |
| Şimşeron | Onlu Radar! (`tensFrame`) | Y01 Saymadan Anlık Bilme (Sanbil) | Kavramsal Sanbil (10’a kadar) | 8 | 5-6 | 1.2, 2.1 | **Düzeltildi** | Basamak adı "Kavramsal Sanbil (10’a kadar)" olarak düzeltildi. |
| Şimşeron | Uzay Hafızası! (`chipGuess`) | Y01 Saymadan Anlık Bilme (Sanbil) | Kavramsal Sanbil (5’e kadar) → Kavramsal Sanbil (10’a kadar) | 8–9 | 5-7 | OÖ9, 1.12, 2.11, 3.10 | **Düzeltildi** | Alt basamak "Kavramsal Sanbil (5’e kadar)" olarak düzeltildi. |
| Şimşeron | Hafıza Şimşeği! (`rodBack`) | Y01 Saymadan Anlık Bilme (Sanbil) | Kavramsal Sanbil (5’e kadar) → Kavramsal Sanbil (10’a kadar) | 8–9 | 5-7 | OÖ9, 1.12, 2.11, 3.10 | **Düzeltildi** | Alt basamak "Kavramsal Sanbil (5’e kadar)" olarak düzeltildi. |
| Şimşeron | Galaktik Tahmin! (`estimateCount`) | Y03 Karşılaştırma, Sıralama ve Tahmin | Kapladığı Yere Bakıp Tahmin Eden → Referans Kümeyle Tahmin Eden (5/10) | 17–22 | 6-7 | 1.11, 2.10, 3.9 | **Düzeltildi** | Yapılandırılmamış kümeyi tahmin sanbil değildir; Karşılaştırma-Sıralama-Tahmin (Y03) yörüngesine taşındı. Görev Sanbil gezegeninde (Şimşeron) duruyor; etiket düzeldi, gezegen yerleşimi Terazya olmalı. |
| Şimşeron | Çift Onlu Radar! (`doubleTensFrame`) | Y01 Saymadan Anlık Bilme (Sanbil) | Kavramsal Sanbil (20’ye kadar) | 10 | 6-7 | 1.2, 2.1, 3.1 | **Uygun** |  |
| Terazya | Kozmik Terazi! (`lessMoreEqual`) | Y03 Karşılaştırma ve Sıralama | Aynı Tür Nesneleri Karşılaştıran → Eşleyerek Karşılaştıran | 5–7 | 4-5 | OÖ3, 1.3, 2.2 | **Uygun** |  |
| Terazya | Yörünge Komşusu! (`beforeAfter`) | Y02 Sayma | 10’a Kadar Sayan → İstenen Sayıdan Sayan (öncesi/sonrası: N+1, N−1) | 8–10 | 4-6 | OÖ4 | **Düzeltildi** | Öncesi/sonrası Sayma yörüngesinin "İstenen Sayıdan Sayan (N±1)" basamağıdır; Y03’ten Y02’ye alındı. |
| Terazya | Gezegen Düellosu! (`comparison`) | Y03 Karşılaştırma ve Sıralama | Sayarak Karşılaştıran (5’e kadar) → Basamak Değeriyle Karşılaştıran | 10–18 | 5-7 | OÖ3, 1.3, 2.2, 3.1 | **Öneri** | Üst basamak "Basamak Değeriyle Karşılaştıran" seçilmiş; oyunda sayılar 20’yi geçmediği için bu basamağa ulaşılmıyor. |
| Terazya | Cetvel Oku! (`rulerRead`) | Y07 Ölçme (Uzunluk) | Uçtan Uca Ölçen → Birimle Ölçen (cetvel) | 4–6 | 6-8 | 1.3, 2.2, 3.1 | **Düzeltildi** | Kod çakışması: Ölçme ile Örüntü aynı koddaydı (Y08); Ölçme Y07 yapıldı. |
| Terazya | Uzunluk Dedektifi! (`lengthCompare`) | Y07 Ölçme (Uzunluk) | Doğrudan Karşılaştıran → Dolaylı Karşılaştıran → Uçtan Uca Ölçen → Birim İlişkilendiren | 2–6 | 5-8 | 1.3, 2.2, 3.1 | **Düzeltildi** | Kod Y08 → Y07 (Ölçme). |
| Terazya | 5 Yıldız Skalası! (`fiveMore`) | Y03 Karşılaştırma ve Sıralama | Zihinsel Sayı Doğrusu (5’e kadar) → Basamak Değeriyle Karşılaştıran | 11–18 | 5-7 | OÖ5, 1.4 | **Uygun** |  |
| Terazya | Yörünge Sırala! (`ordering`) | Y03 Karşılaştırma ve Sıralama | Büyüklük Sırasına Dizen (5’e kadar) → Büyüklük Sırasına Dizen (6 ve ötesi) | 12–16 | 5-6 | OÖ4, 1.3, 2.2 | **Uygun** |  |
| Terazya | Galaktik Konum! (`numberLineEstimate`) | Y03 Karşılaştırma ve Sıralama | Zihinsel Sayı Doğrusu (10’a kadar) | 15 | 6-7 | 1.11, 2.10, 3.9 | **Uygun** |  |
| Terazya | Yörüngeye Yerleştir! (`nlPlacement`) | Y03 Karşılaştırma ve Sıralama | Zihinsel Sayı Doğrusu (10’a kadar) → Basamak Değeriyle Karşılaştıran | 15–18 | 6-7 | 1.11, 2.10, 3.9 | **Uygun** |  |
| Terazya | Kayıp Kapsül! (`numberLine`) | Y03 Karşılaştırma ve Sıralama | Zihinsel Sayı Doğrusu (5’e kadar) → Büyüklük Sırasına Dizen (6 ve ötesi) | 11–16 | 5-7 | 1.12, 2.11, 3.10 | **Uygun** |  |
| Terazya | Gizli Nebula! (`lengthGuess`) | Y03 Karşılaştırma ve Sıralama | Kapladığı Yere Bakıp Tahmin Eden | 17 | 6-7 | 1.12, 2.11, 3.9 | **Uygun** |  |
| Bileşya | 5 Yıldız Taşı Topla! (`makeFive`) | Y05 Sayı Birleştirme (Parça-Bütün) | Sayı Kuran (önce 4, sonra 5) | 4 | 4-5 | OÖ5, 1.4 | **Uygun** |  |
| Bileşya | Parça-Bütün Puzzle! (`partWhole`) | Y05 Sayı Birleştirme (Parça-Bütün) | Sayı Kuran (7’ye kadar) → Sayı Kuran (10’a kadar) | 5–6 | 5-6 | 1.8, 2.5 | **Uygun** |  |
| Bileşya | 10 Yıldız Taşı Topla! (`makeTen`) | Y05 Sayı Birleştirme (Parça-Bütün) | Sayı Kuran (10’a kadar) | 6 | 5-6 | 1.4, 2.1, 3.1 | **Uygun** |  |
| Bileşya | Uzay Mutfağı! (`spaceKitchen`) | Y05 Sayı Birleştirme (Parça-Bütün) | Sayı Kuran (önce 4, sonra 5) → Sayı Kuran (10’a kadar) | 4–6 | 4-6 | OÖ5, 1.4, 2.5 | **Uygun** |  |
| Bileşya | Sayı Galaksisi! (`numbersInNumbers`) | Y05 Sayı Birleştirme (Parça-Bütün) | Sayı Kuran (5’e kadar) → Sayı Kuran (10’a kadar): tüm ayrışımlar | 4–6 | 6-7 | 1.4, 2.5 | **Düzeltildi** | "Bildiklerinden Türeten" toplama-çıkarma basamağıdır; "Sayı Kuran (5→10)" yapıldı. |
| Bileşya | İkili Görev! (`rodSplit`) | Y05 Sayı Birleştirme (Parça-Bütün) | Sayı Kuran (7’ye kadar) → Sayı Kuran (10’a kadar): sistematik ayrışım | 5–6 | 5-7 | 1.4, 2.5 | **Düzeltildi** | "Sayı Kuran (7→10): sistematik ayrışım" yapıldı. |
| Basamara | Onluk Nebula! (`bundleTens`) | Y02 Sayma | Basamak Değerini Kavrayan | 16 | 6-7 | 2.3, 3.2 | **Uygun** |  |
| Basamara | Katman Keşfet! (`placeValue`) | Y02 Sayma | Basamak Değerini Kavrayan | 16 | 6-7 | 2.3, 3.2 | **Uygun** |  |
| Basamara | Gezegen Oluştur! (`composeNumber`) | Y05 Sayı Birleştirme (Parça-Bütün) | Onluk ve Birliklerle Sayı Kuran | 7 | 7 | 2.3, 3.2 | **Öneri** | Seviye 5’te 100-399 aralığı 2. sınıf yolunun (seviye 3-4) dışında kalır; sorun değil, ileri düzey. |
| Basamara | Galaktik Açılım! (`expandForm`) | Y05 Sayı Birleştirme (Parça-Bütün) | Onluk ve Birliklerle Sayı Kuran | 7 | 7 | 2.3, 3.2 | **Uygun** |  |
| Toplarya | Yıldız Taşı Birleştir! (`addChips`) | Y04 Toplama ve Çıkarma | Sonucu Bulan | 4 | 4-5 | OÖ6, 1.5 | **Uygun** |  |
| Toplarya | Büyükten Say! (`countOnAdd`) | Y04 Toplama ve Çıkarma | Sayma Stratejileriyle Çözen | 7 | 5-6 | 1.5, 2.4 | **Uygun** |  |
| Toplarya | Güç Birleştir! (`addition`) | Y04 Toplama ve Çıkarma | Sayma Stratejileriyle Çözen → Bildiklerinden Türeten | 7–10 | 5-7 | 1.5, 2.4, 3.3 | **Öneri** | 2. sınıf yolunda sayı aralığı seviye 3-4 ile en çok 20; 2. sınıf programı ve yörüngede iki basamaklı toplama-çıkarma var. Üreteç aralığı 100’e genişletilmeli. |
| Toplarya | Toplama Problemi (`wpAdd`) | Y04 Toplama ve Çıkarma | Sonucu Bulan → Her Tür Problemi Çözen | 4–11 | 4-7 | 1.7, 2.9, 3.8 | **Uygun** |  |
| Toplarya | Hangi Şema? (`wpSchema`) | Y04 Toplama ve Çıkarma | Problem Şemasını Tanıyan (birleştir/ayır/karşılaştır) | 6–9 | 7-9 | 1.7, 2.9, 3.8 | **Düzeltildi** | Toplama-Çıkarma yörüngesi Y05 koduyla işaretliydi; Y04 yapıldı. |
| Toplarya | Takvim Yolcusu! (`calendarRead`) | Y07 Ölçme (Zaman) | Hafta Günlerini Sıralayan | 3–5 | 6-8 | 1.9, 2.5b, 3.7 | **Düzeltildi** | Kod Y08 → Y07 (Ölçme). Takvim okuma Toplama-Çıkarma gezegeninde (Toplarya); ölçme ile birlikte olmalı. |
| Toplarya | Yıldız Taşı Ayır! (`removeChips`) | Y04 Toplama ve Çıkarma | Sonucu Bulan | 4 | 4-5 | OÖ7, 1.6 | **Uygun** |  |
| Toplarya | Mesafe Ölç! (`difference`) | Y04 Toplama ve Çıkarma | Eksik Olanı Bulan | 6 | 5-6 | 1.8, 2.5 | **Uygun** |  |
| Toplarya | Enerji Ayır! (`subtraction`) | Y04 Toplama ve Çıkarma | Sayma Stratejileriyle Çözen → Bildiklerinden Türeten | 7–10 | 5-7 | 1.6, 2.4, 3.3 | **Öneri** | Toplama ile aynı: 2. sınıfta aralık 20 ile sınırlı. |
| Toplarya | Ters Düşün! (`inversePractice`) | Y04 Toplama ve Çıkarma | Parça-Bütün İlişkisi Kuran → Parçayı ve Bütünü Birlikte Düşünen | 8–9 | 6-7 | 1.8, 2.5, 3.3 | **Uygun** |  |
| Toplarya | Çıkarma Problemi (`wpSub`) | Y04 Toplama ve Çıkarma | Eksik Olanı Bulan → Her Tür Problemi Çözen | 6–11 | 5-7 | 1.7, 2.9, 3.8 | **Uygun** |  |
| Toplarya | Karşılaştırma Problemi (`wpCompare`) | Y04 Toplama ve Çıkarma | Parça-Bütün İlişkisi Kuran → Her Tür Problemi Çözen | 8–11 | 6-7 | 2.9, 3.8 | **Uygun** |  |
| Toplarya | Uzay Marketi! (`coinCount`) | Y02 Sayma | Ritmik Sayan (5’er, 10’ar) → Nicel Birimleri Sayan (para değerleri) | 14–16 | 6-8 | 1.5, 2.4, 3.3 | **Düzeltildi** | Yörünge kaydı yoktu; Sayma: ritmik sayma → nicel birimleri sayma kaydı eklendi. |
| Çarpanya | Galaktik Paylaşım! (`equalShare`) | Y06 Çarpma ve Bölme | Eşit Dağıtan ve Küçük Gruplar Kuran | 3 | 5-6 | 2.8, 3.5 | **Uygun** |  |
| Çarpanya | Filo Grupla! (`groupCount`) | Y06 Çarpma ve Bölme | Somut Modelleyen (×/÷) → Ritmik Sayarak Çözen (×/÷): ölçme bölmesi | 4–6 | 6 | 2.8, 3.5 | **Düzeltildi** | Ölçme bölmesi (kaç grup?) "Somut Modelleyen → Ritmik Sayarak Çözen" basamaklarıdır. |
| Çarpanya | Galaktik Tekrar! (`repeatAdd`) | Y06 Çarpma ve Bölme | Somut Modelleyen (×/÷) → Ritmik Sayarak Çözen (×/÷) | 4–6 | 5-6 | 2.6, 3.4 | **Düzeltildi** | Alt sınır dağıtma basamağıydı; "Somut Modelleyen → Ritmik Sayarak Çözen" yapıldı. |
| Çarpanya | Çarpım Gücü! (`multiplyVisual`) | Y06 Çarpma ve Bölme | Somut Modelleyen (×/÷) | 4 | 6 | 2.7, 3.4 | **Uygun** |  |
| Çarpanya | Kesir Parçası! (`fractionPart`) | Y06 Çarpma ve Bölme | Eşit Paylaştıran → Birim Kesri Adlandıran (eşit paylaştırma yörüngesiyle birlikte) | 4–7 | 7-9 | 2.8, 3.5 | **Düzeltildi** | Kesirler Clements–Sarama ×/÷ yörüngesinde değil; eşit paylaştırma yörüngesine atıf eklendi. |
| Çarpanya | Bölün-İkilen! (`halfDouble`) | Y06 Çarpma ve Bölme | Ritmik Sayarak Çözen (×/÷) | 6 | 6-7 | 2.8, 3.6 | **Uygun** |  |
| Çarpanya | Yıldız Dizisi! (`arrayDots`) | Y06 Çarpma ve Bölme | Ritmik Sayarak Çözen (×/÷) → Satır-Sütun Düzeniyle Çözen (×/÷) | 6–8 | 6-7 | 2.6, 3.4 | **Öneri** | "Satır-Sütun Düzeniyle Çözen" 8 yaş basamağıdır; etiketteki yaş (6-7) iyimser. |
| Çarpanya | Strateji Ustası! (`timesTable`) | Y06 Çarpma ve Bölme | Bildiklerinden Türeten (×/÷) | 7 | 7 | 2.7, 3.4 | **Öneri** | "Bildiklerinden Türeten (×/÷)" 8 yaş civarı; etikette 7. |
| Çarpanya | Bölme Ustası! (`divisionBasic`) | Y06 Çarpma ve Bölme | Bildiklerinden Türeten (×/÷) | 7 | 7 | 2.8, 3.5 | **Öneri** | Aynı: 8 yaş civarı; etikette 7. |
| Çarpanya | Ters Bağlantı! (`mulDivInverse`) | Y06 Çarpma ve Bölme | Kişi Artarsa Payın Azalacağını Bilen → Bildiklerinden Türeten (×/÷) | 5–7 | 6-7 | 2.8, 3.5 | **Uygun** |  |
| Çarpanya | Kaç Kat? (`katConcept`) | Y06 Çarpma ve Bölme | Ritmik Sayarak Çözen (×/÷) → Bildiklerinden Türeten (×/÷) | 6–7 | 7 | 2.7, 3.6 | **Uygun** |  |
| Çarpanya | Çarpma Problemi (`wpMul`) | Y06 Çarpma ve Bölme | Somut Modelleyen (×/÷) → Satır-Sütun Düzeniyle Çözen (×/÷) | 4–8 | 6-7 | 2.9, 3.8 | **Uygun** |  |
| Çarpanya | Bölme Problemi (`wpDiv`) | Y06 Çarpma ve Bölme | Paylaştırarak Bölen | 9 | 7 | 2.9, 3.8 | **Öneri** | "Paylaştırarak Bölen" 8 yaş; etikette 7. |
| Örünya | Şekil Dedektifi! (`shapeCorners`) | Y09 Şekiller | Şekil Tanıyan → Köşe-Kenar Sayan (Part Comparer) | 4–6 | 6-8 | 1.9, 2.5b, 3.7 | **Öneri** | Geometri görevi Örüntü gezegeninde (Örünya); ayrı bir geometri durağı ya da Terazya daha tutarlı. |
| Örünya | Şekil Grafiği! (`pictograph`) | Y02 Sayma | Sayıp Karşılaştıran (veri) | 6–8 | 6-8 | 1.3, 2.2, 3.1 | **Uygun** |  |
| Örünya | Galaktik Desen! (`patternAB`) | Y08 Örüntü, Yapı ve Cebirsel Düşünme | AB Örüntüsü Kuran → Çeşitli Örüntüler Kuran (AAB/ABC) | 3–4 | 3-5 | OÖ4, 1.9, 2.5b, 3.7 | **Düzeltildi** | Okul öncesi yolunda hiç örüntü görevi yoktu (AB örüntüsü 3-5 yaş); 4. durağa eklendi. |
| Örünya | Desen Çevirmen! (`patternTranslate`) | Y08 Örüntü, Yapı ve Cebirsel Düşünme | Örüntüyü Aktaran ve Birimini Bulan | 5 | 4-5 | OÖ4, 1.9, 2.5b, 3.7 | **Düzeltildi** | Okul öncesi yolunun 4. durağına eklendi (4-5 yaş). |
| Örünya | Büyüyen Desen! (`growingPattern`) | Y08 Örüntü, Yapı ve Cebirsel Düşünme | Sayı Örüntüsü Kuran → İşlem Örüntülerini Fark Eden | 6–7 | 5-7 | 1.9, 2.5b, 3.7 | **Uygun** |  |
| Örünya | Denklem Dedektifi! (`trueFalse`) | Y08 Örüntü, Yapı ve Cebirsel Düşünme | İşlem Örüntülerini Fark Eden → İlişkisel Düşünen (+/−) | 7–8 | 5-7 | 1.9, 2.5, 3.7 | **Uygun** |  |
| Örünya | Uzay Terazisi! (`spaceBalance`) | Y08 Örüntü, Yapı ve Cebirsel Düşünme | İşlem Örüntülerini Fark Eden → İlişkisel Düşünen (+/−) | 7–8 | 5-7 | 1.8, 2.5, 3.7 | **Uygun** |  |
| Örünya | Kayıp Yıldız! (`missingNumber`) | Y08 Örüntü, Yapı ve Cebirsel Düşünme | İlişkisel Düşünen (+/−) | 8 | 6-7 | 1.8, 2.4, 3.3 | **Uygun** |  |
