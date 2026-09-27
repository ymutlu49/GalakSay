# GalakSay Madde ve Seçenek Denetimi

**Tarih:** 27 Eylül 2026 · **Kapsam:** galaksay.com'daki canlı sürüm (masaüstü derlemesi v5.10, `canli-surum/site`) · **İlgili rapor:** [YORUNGE_DENETIMI.md](YORUNGE_DENETIMI.md)

## 1. Amaç ve yöntem

Öğrenme yörüngesi denetimi görevlerin *hangi basamağı* hedeflediğini inceledi. Bu denetim ise çocuğun gerçekte karşılaştığı maddeleri ele alır. İki soru sorulmuştur:

1. **Madde uygunluğu:** Üretilen her madde matematiksel olarak doğru, tek yanıtlı ve görevin seviyesine uygun mu?
2. **Seçenek uygunluğu:** Çeldiriciler anlamlı mı, yoksa çocuğun matematiği bilmeden doğru seçeneği bulmasına yol açan bir ipucu taşıyor mu?

Maddeler oyunun kendi soru üreticisinden toplanmıştır. Canlı paketin yerel bir deneme kopyasında üretici dışarı açılmış ve her görev × seviye hücresi için 40 madde üretilmiştir. Toplam 73 görev, 5 seviye ve **14.600 madde** incelenmiştir. Her madde için soru alanları, kayıtlı doğru yanıt ve ekranda gösterilen seçenekler saklanmıştır.

Denetim ölçütleri:

| Ölçüt | Tanım | Kabul düzeyi |
|---|---|---|
| Yanıt doğruluğu | Soru alanlarından bağımsız olarak yeniden hesaplanan yanıt kayıtlı yanıtla aynı mı? | Hatasız |
| Yanıt seçeneklerde | Doğru yanıt seçenekler arasında mı? | Her maddede |
| Tekrarlı / negatif seçenek | Aynı seçenek iki kez ya da negatif sayı var mı? | Hiç |
| İç tutarlılık | Dizilerin adımı, terazinin dengesi, bölmenin kalansızlığı, doğru/yanlış etiketi vb. | Hatasız |
| **Ortadakini seç ipucu** | Üç sayısal seçenekte doğru yanıtın ortanca değer olma oranı | Yaklaşık %33 |
| **Uçtakini seç ipucu** | Doğru yanıtın hep en küçük ya da en büyük seçenek olması | Tek yönde %90'ı aşmamalı |
| Konum yanlılığı | Doğru yanıtın ekranda hep aynı sırada çıkması | Hiçbir konum %70'i aşmamalı |
| Tahmin aralığı | Tahmin görevlerinde çeldiricilerin doğru yanıttan uzaklığı | Algısal olarak ayırt edilebilir |
| Çeşitlilik | Bir hücrede birbirinden farklı madde sayısı | Seviye sınırına göre yorumlanır |

Ortadakini seç ipucu çoktan seçmeli madde yazımında bilinen bir kusurdur. Doğru yanıtın hep ortada durduğu bir madde havuzunda çocuk, sayıyı hiç işlemeden "ortancayı seç" stratejisiyle başarılı olabilir. Diskalkuli riski taşıyan çocuklarda bu durum iki sorun yaratır. Birincisi, uygulamanın ustalık kararları şişer. İkincisi, çocuk sayı büyüklüğünü değil seçeneklerin dizilişini öğrenir.

## 2. Madde uygunluğu bulguları

**Matematiksel doğruluk hatası bulunmadı.** 14.600 maddenin hepsinde doğru yanıt seçenekler arasındadır. Tekrarlı seçenek ve negatif seçenek yoktur. Denetim betiği yalnız bir hücrede uyarı vermiştir. Filo Grupla 5. seviyedeki kalan sorularında ("kaç tane artar?") yanıt kalandır, betik ise bölümü beklemiştir. Bu uyarılar denetim betiğinden kaynaklanır, maddeler doğrudur. Sayı Doğrusu Yerleştirme ve Desen Aktarma görevlerindeki uyarılar da aynı nedenle yanlış alarm olarak doğrulanmıştır.

**Seviye uygunluğu.** Yanıt aralıkları seviye tablosuyla uyumludur. Seviye 1'de en büyük sayı 5, seviye 2'de 10, seviye 3'te 15, seviye 4–5'te 20'dir. Toplama, çarpma ve basamak değeri görevlerinde bilinçli olarak 20'nin üzerine çıkılır. Seviyeler arasındaki küçük düşüşler örneklem gürültüsü ya da doğal üst sınırlardır.

**Düzeltilen madde dengesi sorunu.** Enerji Ayır (çıkarma) 2. seviyesinde maddelerin yarısı sıfır kuralıydı (n − n = 0 ya da n − 0 = n). Sıfır kuralı Matematik Dersi Öğretim Programı'nda yer alır. Ancak bir seviyenin yarısını kaplaması temel çıkarma pratiğini azaltır. Bu pay 3. seviyedeki gibi dörtte bire indirilmiştir.

**Düzeltme gerektirmeyen tasarım tercihleri:**

- **Uzay Hafızası** yalnız 6–10 sayılarını sorar. Görev 5+n yapısıyla kavramsal sanbili hedefler, 1–5 algısal sanbil görevlerinde çalışılır. Bu nedenle 1–2. seviyelerde yalnız 6 ve 7 görülür.
- **Çubuk Ayırma** seçeneksiz, etkileşimli bir görevdir. Çocuk bir sayının bütün ayrışımlarını bulur. Kayıtlı "yanıt" bulunması gereken ayrışım sayısıdır, bu yüzden 1. seviyede hep 2'dir.
- **5 Yıldız Taşı Topla** 1. seviyede yalnız 1+4 ve 4+1 ayrışımlarını sorar. Yanıt 1–4 aralığının ucunda kaldığından uç konumda olması kaçınılmazdır.
- **Korunum**, **Karşılaştırma** ve **Doğru mu Yanlış mı?** görevleri iki seçeneklidir. Bu görevlerin yapısına uygundur. Şans başarısı %50 olduğundan ustalık kararlarında bu görevlere daha fazla madde istenmesi önerilir.
- Sözel problemler dört seçeneklidir ve ortanca ölçütünün dışında kalır.

## 3. Seçenek uygunluğu bulguları

### 3.1 Ortadakini seç ipucu

Düzeltmeden önce ipucu yaygındı. Üç sayısal seçenekli 262 görev × seviye hücresinin 92'sinde doğru yanıt %80 ya da daha sık ortadaydı. Galaktik Tahmin ve Büyükten Say görevlerinde bu oran %100'dü.

Nedeni tekti. Merkezi seçenek üreticisi aday listesinden ilk iki değeri sırayla alıyordu. Görevlerin çoğu listeye önce "doğru + 1", sonra "doğru − 1" yazdığı için doğru yanıt hep iki çeldiricinin arasında kalıyordu. Çıkarma ve farkta ise kavram yanılgısı çeldiricileri, örneğin eksileni ya da toplamı, hep büyük tarafta olduğundan doğru yanıt %90–100 oranında en küçük seçenekti.

| Özet ölçü (262 hücre) | Önce | Sonra | İdeal |
|---|---:|---:|---:|
| Ortada olma oranı, ortalama | %59,6 | %33,4 | %33 |
| Uçta olma oranı, ortalama | %34,8 | %61,0 | %67 |
| %80 ve üzeri ortada olan hücre | 92 | 0 | 0 |
| %60 ve üzeri ortada olan hücre | 147 | 8 | az |
| Yanıt hatası, eksik yanıt, tekrar, negatif | 0 | 0 | 0 |

%60'ın üzerinde kalan 8 hücre dar sayı aralıklı alt seviyelerdir. Bu değerler 40 maddelik örneklemde beklenen dalgalanma sınırındadır.

Çıkarma ve farkta en küçük seçenek olma oranı 4. seviyede, 40 maddede, çıkarmada 39'dan 22'ye, farkta 38'den 20'ye inmiştir. Alt seviyelerde bu oran üçte iki civarında kalır. Nedeni, sıfır kuralı maddelerinde yanıtın zorunlu olarak en küçük değer olmasıdır.

### 3.2 Görev bazında sonuçlar

"Önce" ve "sonra" sütunları, doğru yanıtın üç seçeneğin ortasında olma oranıdır. Oran beş seviyenin ortalaması ve en yüksek seviyesi olarak verilmiştir. Hedef yaklaşık %33'tür. Dört seçenekli sözel problemler bu ölçütün dışındadır.

| Görev | Kod | Önce: ortalama | Önce: en yüksek | Sonra: ortalama | Sonra: en yüksek | Yanıt aralığı |
|---|---|---:|---:|---:|---:|---|
| Galaktik Tahmin! | `estimateCount` | %100 | %100 | %37 | %42 | 6–20 |
| Büyükten Say! | `countOnAdd` | %100 | %100 | %53 | %58 | 4–24 |
| Onluk Geçidi! | `decadeCount` | %95 | %98 | %28 | %32 | 9–91 |
| Uzay Hafızası! | `chipGuess` | %92 | %100 | %36 | %58 | 6–10 |
| Galaktik Ritim! | `skipCount` | %91 | %100 | %44 | %62 | 4–70 |
| Hafıza Şimşeği! | `rodBack` | %90 | %100 | %36 | %55 | 6–10 |
| Güç Birleştir! | `addition` | %88 | %100 | %48 | %65 | 1–36 |
| Çift Onlu Radar! | `doubleTensFrame` | %87 | %100 | %42 | %52 | 11–20 |
| Ters Bağlantı! | `mulDivInverse` | %87 | %100 | %34 | %45 | 2–36 |
| Kaç Kat? | `katConcept` | %87 | %100 | %42 | %50 | 2–30 |
| Galaktik Tekrar! | `repeatAdd` | %85 | %100 | %34 | %38 | 4–30 |
| Galaktik Paylaşım! | `equalShare` | %83 | %100 | %51 | %68 | 2–6 |
| Filo Grupla! | `groupCount` | %83 | %100 | %50 | %62 | 1–6 |
| Yıldız Dizisi! | `arrayDots` | %83 | %100 | %32 | %38 | 4–30 |
| Bölme Ustası! | `divisionBasic` | %81 | %100 | %40 | %58 | 1–20 |
| Onluk Nebula! | `bundleTens` | %80 | %100 | %36 | %48 | 1–9 |
| Şekil Dedektifi! | `shapeCorners` | %80 | %90 | %24 | %30 | 0–8 |
| Işık Hızı! | `subitizing` | %78 | %100 | %36 | %42 | 1–10 |
| Bölün-İkilen! | `halfDouble` | %78 | %98 | %24 | %35 | 1–24 |
| Katman Keşfet! | `placeValue` | %77 | %92 | %34 | %45 | 0–9 |
| Göktaşı Say! | `counting` | %75 | %92 | %35 | %45 | 1–20 |
| Yıldız Eşle! | `matching` | %72 | %92 | %35 | %52 | 1–20 |
| Göktaşı Eşle! | `quantityMatch` | %72 | %88 | %34 | %42 | 1–20 |
| Yörüngeden Say! | `counterFromN` | %71 | %90 | %29 | %40 | 3–20 |
| Uzay Terazisi! | `spaceBalance` | %69 | %95 | %31 | %40 | 1–13 |
| 10 Yıldız Taşı Topla! | `makeTen` | %67 | %95 | %27 | %32 | 1–9 |
| Onlu Radar! | `tensFrame` | %64 | %85 | %30 | %38 | 1–10 |
| Strateji Ustası! | `timesTable` | %64 | %98 | %35 | %50 | 0–45 |
| Galaktik Konum! | `numberLineEstimate` | %63 | %80 | %30 | %35 | 1–19 |
| Şekil Grafiği! | `pictograph` | %61 | %65 | %37 | %58 | 1–26 |
| Gizli Nebula! | `lengthGuess` | %60 | %85 | %29 | %38 | 1–20 |
| Ters Düşün! | `inversePractice` | %57 | %68 | %35 | %45 | 1–20 |
| Beşli Radar! | `fivesFrame` | %54 | %72 | %31 | %35 | 1–5 |
| Uzay Marketi! | `coinCount` | %53 | %82 | %49 | %70 | 2–100 |
| Geri Sayım! | `backwardCount` | %52 | %72 | %48 | %52 | 1–19 |
| Cetvel Oku! | `rulerRead` | %47 | %62 | %38 | %50 | 1–15 |
| 5 Yıldız Taşı Topla! | `makeFive` | %45 | %75 | %21 | %32 | 1–4 |
| Uzunluk Dedektifi! | `lengthCompare` | %44 | %88 | %48 | %50 | 1–9 |
| Galaktik Açılım! | `expandForm` | %44 | %62 | %42 | %58 | 10–90 |
| Yörünge Komşusu! | `beforeAfter` | %35 | %48 | %35 | %45 | 1–20 |
| Kayıp Yıldız! | `missingNumber` | %34 | %40 | %32 | %45 | 1–20 |
| Büyüyen Desen! | `growingPattern` | %33 | %78 | %29 | %45 | 2–28 |
| Çarpım Gücü! | `multiplyVisual` | %32 | %48 | %28 | %38 | 4–30 |
| Kayıp Kapsül! | `numberLine` | %30 | %50 | %30 | %40 | 1–20 |
| Gezegen Oluştur! | `composeNumber` | %27 | %42 | %34 | %42 | 10–391 |
| Sıra Keşfi! | `ordinalCount` | %25 | %32 | %36 | %38 | 1–9 |
| Toplama Problemi | `wpAdd` | %23 | %60 | %25 | %65 | 1–20 |
| Karşılaştırma Problemi | `wpCompare` | %16 | %45 | %24 | %60 | 1–20 |
| Çıkarma Problemi | `wpSub` | %15 | %40 | %12 | %32 | 1–18 |
| Mesafe Ölç! | `difference` | %11 | %22 | %37 | %50 | 1–19 |
| Enerji Ayır! | `subtraction` | %9 | %28 | %34 | %55 | 0–15 |
| Çarpma Problemi | `wpMul` | %0 | %0 | %0 | %0 | 4–20 |
| Bölme Problemi | `wpDiv` | %0 | %0 | %0 | %0 | 2–6 |

### 3.3 Tahmin görevlerinde çeldirici aralığı

Tahmin maddelerinde çeldiricinin doğru yanıta çok yakın olması maddeyi tahmin olmaktan çıkarıp sayma işine dönüştürür. Sayı doğrusunda ±1 uzaklıktaki bir işaret 5–6 yaşındaki bir çocuk için algısal olarak ayırt edilemez. Weber oranı çalışmaları bu yaşta küçük farkların ayırt edilemeyeceğini gösterir.

| Görev | Seviye | Çeldirici uzaklığı, medyan (önce → sonra) | Ortada olma (önce → sonra) |
|---|---|---|---|
| Galaktik Konum (sayı doğrusu tahmini) | 2 | 1 → 3 | %62 → %25 |
| Galaktik Konum (sayı doğrusu tahmini) | 3 | 1 → 3 | %75 → %35 |
| Galaktik Konum (sayı doğrusu tahmini) | 4 | 2 → 5 | %80 → %35 |
| Galaktik Konum (sayı doğrusu tahmini) | 5 | 2 → 4 | %62 → %28 |
| Galaktik Tahmin (nokta tahmini) | 3 | 3 → 6 | %100 → %38 |
| Galaktik Tahmin (nokta tahmini) | 5 | 4 → 8 | %100 → %32 |
| Gizli Nebula (uzunluk tahmini) | 4 | 2 → 4 | %85 → %35 |
| Gizli Nebula (uzunluk tahmini) | 5 | 2 → 4 | %72 → %38 |

### 3.4 Konum yanlılığı

Hiçbir hücrede doğru yanıt ekranda %70'ten fazla aynı sırada çıkmamaktadır. Seçenekler gösterimden önce karıştırılmaktadır.

## 4. Yapılan düzeltmeler

Düzeltmeler `canli-surum/kaynak/secenek_duzeltmeleri.py` betiğiyle canlı pakete uygulanmıştır. Betik her değişikliği birebir metin eşleşmesiyle ve tam bir kez yapar. Eşleşme bulamazsa dosyaya dokunmadan durur.

1. **Merkezi seçenek üreticisi.** Doğru yanıtın üç seçenek içindeki sırası (en küçük, orta, en büyük) eşit olasılıkla seçilir. Görevin verdiği kavram yanılgısı çeldiricileri önceliklidir. Eksik yön bitişik değerlerle (±1, ±2 ...) doldurulur.
2. **Alt seviyelerdeki uzak çeldirici dalı.** Küçük yaşlarda bir çeldiriciyi bilerek uzak (±3–5) seçen dal korunmuştur. Bu dal da aynı sıra dengesine bağlanmıştır.
3. **Galaktik Tahmin.** Çeldiricilerin yönü rastgeledir: ikisi üstte, ikisi altta ya da birer yanda.
4. **Galaktik Konum.** Çeldirici aralığı 0–10 doğrusunda en az 2, 0–20 doğrusunda en az 3 birimdir.
5. **Onluk Geçidi.** "±10" onluk hatası çeldiricileri korunmuş, yönleri rastgele yapılmıştır.
6. **Gizli Nebula (üst seviyeler).** Çeldiricilerin yönü rastgeledir.
7. **Enerji Ayır, 2. seviye.** Sıfır kuralı maddelerinin payı %50'den %25'e indirilmiştir.

Doğrulama:

- Düzeltmelerden sonra 14.600 madde yeniden üretilmiş ve aynı ölçütlerle denetlenmiştir. Sayfa hatası ve madde üretim hatası yoktur.
- Kaptan girişi ile telefon ve tablet uçtan uca testleri geçmiştir.
- Öğrenci listesi ve şifreli profil testi geçmiştir.
- Önbellek sürümü `galaksay-v5.13.0-20260927-secenek` olarak yükseltilmiştir. Böylece kullanıcıların cihazındaki eski paket kendiliğinden yenilenir.

## 5. Kalan öneriler

- **İki seçenekli görevler.** Korunum, Karşılaştırma ve Doğru mu Yanlış mı? görevlerinde ustalık kararı için daha uzun seri istenmelidir. Örneğin art arda 3 yerine 5 doğru istenebilir.
- **Dar aralıklı alt seviyeler.** Galaktik Paylaşım 1. seviye ve Büyükten Say 1. seviyede yanıt 2–7 aralığındadır. Bu dar aralıkta ortanca oranı %65–78'e çıkabilir. Kavram yanılgısı çeldiricileri, örneğin başlangıç sayısını tekrar sayma, bu seviyelerde bilerek korunmuştur.
- **Kaynak kodla birleştirme.** Aynı düzeltmelerin GitHub'daki kaynak koda da işlenmesi gerekir. Kaynak kodda üretici `gen3` adını taşır. Bu iş [BIRLESTIRME_PLANI.md](BIRLESTIRME_PLANI.md) kapsamındadır.
