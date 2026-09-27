# GalakSay Görüntü Düzeyinde Madde Denetimi

**Tarih:** 27 Eylül 2026 · **Kapsam:** galaksay.com canlı sürümü (`canli-surum/site`), 8 gezegen, 73 görev, 5 seviye, Türkçe ve Kurmancî · **Önceki raporlar:** [MADDE_DENETIMI.md](MADDE_DENETIMI.md) (üretici düzeyi), [YORUNGE_DENETIMI.md](YORUNGE_DENETIMI.md)

## 1. Neden yeni bir denetim?

Önceki madde denetimi maddeleri oyunun soru üreticisinden aldı. Böyle bir denetim yanıtın ve seçeneklerin doğruluğunu ölçer. Ama çocuğun gördüğünü ve duyduğunu ölçmez. Sahada bildirilen hatalar da tam bu arada kalıyordu: seslendirme ile ekran metninin uyuşmaması, geri bildirimin soruyla ilgisiz olması, şıkların düğmeye sığmaması, ekranda görünmeyen bir sayı.

Bu nedenle denetim, üreticiden ekrana kadar bütün zinciri kapsayacak biçimde yeniden kuruldu. Her madde gerçek oyun ekranında oynatıldı ve çocuğun karşılaştığı her katman kaydedildi.

## 2. Yöntem

**Ortam.** Canlı paketin yerel bir kopyası kullanıldı. Kopyaya yalnız iki gözlem kancası eklendi: üretilen maddeyi kaydeden ve görev ile seviyeyi seçen kancalar. Oyun kodu değiştirilmedi. Tarayıcı Chromium'du; ekran telefon boyutundaydı (430 × 932).

**Örneklem.**

| Dil | Madde / hücre | Toplam |
|---|---|---|
| Türkçe | 3 | 73 görev × 5 seviye × 3 = 1.095 |
| Kurmancî | 1 | 73 × 5 × 1 = 365 |

**Her madde için kaydedilenler.**

1. **Madde kaydı:** üretilen soru nesnesi, doğru yanıt ve seçenekler.
2. **Ekran:** ekrandaki kök ve bütün görünür metin.
3. **Şıklar:** etiketleri ve düğmeye sığıp sığmadıkları.
4. **Ses:** "Soruyu dinle" (🗣️) düğmesine basınca okunan metin.
5. **İpucu:** ipucu düğmesinin getirdiği yönlendirme.
6. **Yanıt sonrası:** geri bildirim. Maddeler dönüşümlü olarak yanlış ve doğru yanıtlandı. Yanlış yanıttan sonraki düzeltme satırı, yanılgı ipucu ve maskot cümlesi; doğru yanıttan sonraki övgü ve açıklama kaydedildi.
7. **Görüntü:** her görev ve seviye için bir ekran görüntüsü.

**Çözümleme.** Üç katmanda yapıldı:

1. **Otomatik denetimler:**
   - yer tutucu ya da bozuk değer (`undefined`, `NaN`)
   - doğru yanıtın şıklarda bulunmaması, aynı şıkkın iki kez çıkması
   - rakam ile yazının uyuşmaması
   - sesli metindeki sayının ekranda bulunmaması
   - düzeltme satırındaki yanıtın doğru yanıtla çelişmesi
   - yön çelişkisi (sağdan / soldan)
   - Kurmancî ekranda Türkçe kalmış metin
   - şık yazısının düğmeden taşması
2. **Kalıp incelemesi:** Her görevde sayılar "N" ile soyutlandı. Farklı kök, ses, geri bildirim ve ipucu kalıpları görev görev okundu. Bu yolla 1.095 madde, yüzlerce kalıba iner ve her kalıp tek tek değerlendirilebilir.
3. **Görsel inceleme:** Bütün görevlerin ekran görüntüleri temas sayfalarında tarandı. Kuşkulu maddeler ayrıca yeniden üretilip incelendi.

## 3. Bulgular ve düzeltmeler

### 3.1 Madde içeriği: ekranda görünmeyen bilgi

| Görev | Bulgu | Düzeltme |
|---|---|---|
| Enerji Ayır (çıkarma), "toplamadan düşün" ve "10 üzerinden çıkar" stratejileri | Çıkan sayının çubuğu boş (gri, boncuksuz) çiziliyordu. Sayılar 10'u geçince yazılı satır da gizlendiği için, örneğin 17 − 9 sorusunda 9 ekranın hiçbir yerinde yoktu. Madde yalnız dinleyerek çözülebiliyordu. | Çubuk doluyla gösteriliyor. |
| Çubuklu işlem gösterimi (çıkarma, Kayıp Yıldız vb.) | 3. seviyeden sonra ve sayılar 10'u geçince "on yedi eksi sekiz = ?" satırı gizleniyordu. İşlenenler yalnız minik boncuklarla görünüyordu. | Satır her seviyede gösteriliyor (küçük yaş kipi hariç). |

Seslendirme artık isteğe bağlı olduğu için ilke şudur: çözüm için gereken her bilgi ekranda görünür olmalıdır.

### 3.2 Metin, ses ve kök uyumu

| Görev | Bulgu | Düzeltme |
|---|---|---|
| Görev Saati (dijital → analog) | Düzeltme satırı seçeneğin sıra numarasını saat diye söylüyordu: "Saat 2 gösteriyor (bir yirmi beş)". Kurmancî satır Türkçeydi. | "Saat 1:25 gösteriyor (bir yirmi beş)"; Kurmancîsi "Saet 1:25 nîşan dide". |
| Hangi Şema? | Adlara sabit ek ekleniyordu: "Ali'nın", "Kerem'ya". | Eklerle uyumlu adlar kullanılıyor (Ada, Arda, Ela, Tolga). |
| Şekil Grafiği | "kaç fazla" sorusunda renk adına sabit "-den" eki ekleniyordu ("kırmızıden"). Cümle küçük harfle başlıyor, ses ile kök farklı. | Ekran ve ses aynı: "Grafikte mavi taşlar, yeşil taşlardan kaç fazla?" |
| Galaktik Desen | Kök "Sıradaki ne olmalı?" iken ses "eksik parçayı bul" diyordu. | Ses: "Tekrar eden desene bak. Sıradaki ne olmalı?" |
| Şekil Dedektifi | "Kaç kenarı var?" sorusunda alt yazı "köşe sayısı değişmez" diyordu. | Soruya göre köşe ya da kenar (TR, KU, EN). |
| Saat okuma (önceki tur) | Kök sesli metinden farklıydı. | "Hangi saat aynı zamanı gösteriyor?" |
| Parmak kalıpları (önceki tur) | Saymadan tanıma görevinde kök "Parmakları say" diyordu. | "Parmaklara bak". |

### 3.3 Geri bildirim ve ipucunun göreve uygunluğu

Oyunun yanılgı ipuçları tek bir tablodan geliyordu ve göreve bakmıyordu. Örneğin "bir fazla ya da bir eksik" yanılgısında her görevde "her taşa bir sayı" deniyordu. Bunun yerine ipucu artık göreve ve sorunun kendi sayılarına göre seçiliyor (`oyna/galaksay-ek.js`, `window.__gsTip`). Görev aileleri şunlardır:

| Aile | İpucu |
|---|---|
| sayma | tek tek say |
| işlem | işlemi adım adım kontrol et |
| ölçme | başlangıç çizgisinden aralıkları say |
| sayı doğrusu | bilinen sayıdan çentikleri say |
| saat | akrep saati, yelkovan dakikayı gösterir |
| takvim | günleri parmakla say |
| basamak | onlukları ve birlikleri ayrı say |
| desen | kuralı kontrol et |
| şekil | köşe ya da kenara göre |
| saymadan tanıma | bir bakışta gör |

Bu turda düzeltilenler:

- **Görev Saati:** cetvel ipucu ("başlangıç çizgisinden aralıkları say") saat sorusunda çıkıyordu.
- **Beşli Radar ve Uzay Hafızası:** düzeltme ipucu "her taşı tek tek say" diyordu. Görevin amacı saymadan tanımaktır.
- **Katman Keşfet, Gezegen Oluştur, Galaktik Açılım, Onluk Nebula:** "işlemi adım adım kontrol et" deniyordu. Artık onluk ve birlik odaklı ipucu veriliyor.
- **Desen görevleri:** "tek tek say" ipucu çıkıyordu. Artık kural odaklı ipucu veriliyor.
- **Denklem Dedektifi (doğru mu?):** iki seçenekli maddede her yanlış yanıt "bir fark" sayılıyordu. İpucu artık "iki tarafı ayrı hesapla, karşılaştır".
- **Mesafe Ölç:** "kaç fazla" sorusunda ipucu "İşarete dikkat! + mı, − mi?" diyordu, oysa ekranda işaret yok. Artık "eşleştir, artanları say" deniyor.
- **Hangi Şema?:** geri bildirim "verdi" sözcüğünü hem birleştir hem ayır için örnek veriyordu. Bu çelişki giderildi.
- **Nokta Dizisi:** satır ve sütun sayısı eşitken "ikişer ya da ikişer ritmik say" deniyordu.
- **Galaktik Açılım:** ipucu henüz öğretilmemiş çarpmaya dayanıyordu ("10 ile çarp"). Artık "onar onar say".
- **Şekil Grafiği:** "kaç tane" sorusunda da "'kaç fazla' için yan yana koy" ipucu çıkıyordu. İpucu koşullu yazıldı.

Önceki turda düzeltilenler:

- Sıra sayısı görevinde karşılaştırma ipucu çıkıyordu.
- Geri saymada ileri sayma örneği veriliyordu.
- Onluk örneği hep "on-dört" idi.
- Korunum övgüsü, gruplar farklıyken de "sayı korunuyor" diyordu.
- Maskotun hata öyküleri göreve uygun değildi.

### 3.4 Kurmancî

Kurmancî oyunda maskotun zorlanma sonrası destek cümleleri, "kolay soru geliyor" ve mola önerileri Türkçe kalıyordu. 16 cümle Kurmancîye çevrildi ve maskot balonuna giden her metin bu tablodan geçiyor. Düzeltme satırlarındaki Türkçe kalıplar da Kurmancîleştirildi (bkz. §5).

### 3.5 Görünüm

| Bulgu | Düzeltme |
|---|---|
| Takvim Yolcusu'nda "Perşembe", "Çarşamba", "Cumartesi"; Hangi Şema?'da "Karşılaştır ⚖️" şıkları telefonda düğmeden taşıyordu. Kurmancî etiketler daha uzundur. | Şık yazısı düğmeye sığana dek küçülür. Aynı sorudaki bütün şıklar aynı oranda küçülür, çünkü farklı yazı boyu bir şıkkı öne çıkarıp biçim ipucu verebilir. |

### 3.6 Doğrulanan ve sorun bulunmayanlar

- **Sözel problemler:** 5 görevde 75 metin tek tek karşılaştırıldı: toplama, çıkarma, karşılaştırma, çarpma ve bölme. Hepsinde yanıt metinle tutarlı. Sonuç, başlangıç ve değişim bilinmeyen türleri doğru kurulmuş.
- **Sayılara gelen ekler:** "5'in", "9'un", "10'un", "3'ün", "0'a" ve benzerleri doğru.
- **Yanıt doğruluğu:** yer tutucu, bozuk değer, eksik yanıt ya da düzeltme satırında yanlış söylenen yanıt bulunmadı. Saat görevindeki bulgu bunun dışında.

## 4. Seslendirme: yalnız istenince

Oyun ve giriş ekranları artık kendiliğinden konuşmuyor. Konuşma yalnız bir dinleme denetimine basıldıktan sonra çalışıyor: 🔊 ya da 🗣️ simgeli düğmeler ya da etiketi "dinle / guhdarî / listen" olan düğmeler. "Soruyu dinle" (🗣️) düğmesi artık her çocukta görünüyor. Susturulan konuşmanın başlangıç ve bitiş olayları tahmini sürede tetikleniyor. Böylece konuşmaya bağlı sayma animasyonları ve sıralı akışlar bozulmuyor.

## 5. Sonuç ölçümü

Düzeltmelerden sonra denetim aynı yöntemle ve aynı örneklem büyüklüğüyle yeniden koşuldu: Türkçe 1.095, Kurmancî 365 madde. Maddeler rastgele üretildiği için iki turda aynı maddeler çıkmaz. Ölçüt, bilinen her hata kalıbının kaç maddede görüldüğüdür.

### 5.1 Türkçe

| Hata kalıbı | Önce | Sonra |
|---|---:|---:|
| Desen görevinde ses ile kök uyumsuz | 15 | 0 |
| Desen, doğru/yanlış, sayı ayrıştırma görevlerinde "tek tek sayarak kontrol et" | 15 | 0 |
| Basamak görevlerinde "işlemi adım adım kontrol et" | 11 | 0 |
| Hangi Şema? geri bildiriminde "verdi" çelişkisi | 10 | 0 |
| Saymadan tanıma görevlerinde "her taşı tek tek say" | 6 | 0 |
| Ad eki hatası ("Ali'nın", "Kerem'ya") | 5 | 0 |
| Açılım ipucunda çarpma | 5 | 0 |
| Kenar sorusunda köşe alt yazısı | 3 | 0 |
| Saat düzeltme satırında yanlış saat | 2 | 0 |
| Saat sorusunda cetvel ipucu | 1 | 0 |
| Fark sorusunda "İşarete dikkat" | 1 | 0 |
| "ikişer ya da ikişer" tekrarı | 1 | 0 |
| **Toplam** | **75** | **0** |

**Çıkarmada görünmeyen işlenen.** Örneklemin çıkarma maddelerinin üçte biri boş çubukla çiziliyordu. Üretici kurallarına göre oran seviyeye göre değişir: 3. seviyede maddelerin dörtte biri, 4. seviyede yarısı, 5. seviyede %57'si. Düzeltmeden sonra ekran görüntülerinde çıkan sayının çubuğu doludur ve "on bir eksi dokuz = ?" satırı görünür.

Önce ve sonra geri bildirim cümleleri ayrıca karşılaştırıldı. Sonra turunda yeni çıkan her cümle tek tek okundu. Bu okumada dört yazım hatası daha bulunup düzeltildi:

- "dörtün 4 katı" yerine "dördün"
- "Bir elinlerin parmak sayısı" yerine "Bir elin"
- "matematğin" yerine "matematiğin"
- cümle başında küçük harf ("üçer tam grupları…")

### 5.2 Kurmancî

| Ölçüt | Ara ölçüm | Sonra |
|---|---:|---:|
| Türkçe kalan metin içeren madde | 166 / 365 | 0 / 365 |
| Türkçe kalan satır | 242 | 0 |

Ara ölçüm, maskot cümleleri düzeltildikten sonra, düzeltme satırları ve alt yazılar düzeltilmeden önce alınmıştır. İlk turda (135 madde) maddelerin yarısından fazlasında Türkçe metin vardı. Türkçe kalan başlıca metinler şunlardı:

- maskotun destek cümleleri
- "Doğru bersiv:" satırı
- sayı adları ("yirmi", "kırk")
- 7 görevin açıklaması
- korunum, ritmik sayma ve sayı komşusu satırları
- terazi kefe adları
- grup, desen ve taş ekleme/çıkarma yönergeleri

### 5.3 Otomatik işaretlerin yorumu

Çözümleyicinin bazı işaretleri madde hatası değildir:

- **"Doğru yanıt şıklarda yok":** iki seçenekli görevlerde (Korunum, Karşılaştırma, Doğru mu?) yanıt bir etikettir, sayı değildir.
- **"Aynı şık iki kez":** eşleştirme görevinde şıklar yazısız kapsüllerdir.
- **"Okunan metin ekranda yok":** sesli metin ekrandakini başka sözcüklerle söyler. Sayısal bilgi ekranda rakamla ya da yazıyla bulunmaktadır.
- **"Şık taşıyor":** giriş animasyonu sırasında alınan ölçümlerdir. Kararlı ekranda yeniden ölçüldüğünde taşma yoktur.
- **"🗣️ ile okunmadı":** yalnız Kurmancîde görülür. Cihazda Kurmancî ses yoksa Kurmancî metin bilerek okunmaz (bkz. §4).

### 5.4 Sınırlılıklar

- Örneklem her hücrede 3 (Türkçe) ve 1 (Kurmancî) maddedir. Üretici düzeyindeki 14.600 maddelik denetim ([MADDE_DENETIMI.md](MADDE_DENETIMI.md)) yanıt doğruluğunu ayrıca güvence altına alır.
- Sözel problemlerin çok adımlı akışı yanıt adımına kadar oynatılmadı. Bu görevlerde metin ile yanıtın tutarlılığı soru nesnesinden denetlendi.
- Kurmancî metinlerin dil kalitesi, anadili Kurmancî olan bir eğitimciyle ayrıca gözden geçirilmelidir.

## 6. Yeniden üretilebilirlik

| Dosya | Görev |
|---|---|
| `canli-surum/kaynak/madde_denetimi_duzeltmeleri.py` | Paketteki düzeltmeler. Birebir metin eşleşmesiyle, her biri tam bir kez uygulanır. |
| `canli-surum/site/oyna/galaksay-ek.js` | Okunur çalışma zamanı katmanı. Bölümleri: 0 seslendirme kapısı, 3 göreve uygun ipucu, 4 öykü, 5 Kurmancî maskot cümleleri, 6 şık sığdırma. |

Denetim araçları (Playwright betiği, çözümleyici, kalıp özeti, katalog üreticisi) oturum çalışma alanındadır. Yöntem bu belgede tanımlandığı gibi yeniden kurulabilir.
