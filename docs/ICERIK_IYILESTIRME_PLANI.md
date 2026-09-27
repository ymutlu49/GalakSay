# GalakSay Oyun İçeriğini İyileştirme Planı

**Tarih:** 27 Eylül 2026 · **Kapsam:** 8 gezegen, 73 görev, 5 seviye; Türkçe ve Kurmancî · **Dayanak:**
- üretici düzeyinde 14.600 madde ([MADDE_DENETIMI.md](MADDE_DENETIMI.md))
- ekran düzeyinde 1.460 madde ([MADDE_GORUNTU_DENETIMI.md](MADDE_GORUNTU_DENETIMI.md))
- öğrenme yörüngesi denetimi ([YORUNGE_DENETIMI.md](YORUNGE_DENETIMI.md))
- paketteki metinlerin taranması

## 1. Bu belge neyi ele alıyor?

Önceki denetimler **hatayı** aradı: yanlış yanıt, uyuşmayan ses, yersiz ipucu, Türkçe kalan Kurmancî. Bunlar düzeltildi. Bu belge bir adım öteye bakıyor: hatasız ama **daha iyi olabilecek** içerik. Ölçüt, 5–10 yaş ve diskalkuli riski taşıyan çocuk için öğretimsel değerdir:

- Madde neyi ölçüyor ya da öğretiyor?
- Çocuk doğru yanıta matematikle mi ulaşıyor, yoksa başka bir ipucuyla mı?
- Geri bildirim çocuğun anlayacağı dilde mi?
- Müfredatın hangi kazanımları eksik?

Her öneride ölçülen kanıt, önerilen değişiklik ve gereken iş birlikte verilmiştir.

## 2. Öncelik özeti

| # | Öneri | Etki | İş | Ne zaman |
|---|---|---|---|---|
| 1 | Geri bildirim dilini çocuğa uygun ve süreç odaklı yapmak | Yüksek | Metin | Sunumdan önce |
| 2 | Karşılaştırmada algısal ipucunu kırmak (kapalı olan "boyut yanılsaması" maddeleri) | Yüksek | Küçük kod | Sunumdan önce |
| 3 | Yanıtı önceden veren strateji etiketlerini hatadan sonraya almak | Yüksek | Küçük kod | Sunumdan önce |
| 4 | Sözel problemlerde sayıları rakamla yazmak, okuma yükünü azaltmak | Yüksek | Küçük kod + metin | Sunumdan önce |
| 5 | Okul öncesi için yetişkinin açabileceği "yönergeleri sesli oku" ayarı | Yüksek | Küçük kod | Sunumdan önce |
| 6 | Tuş takımı, sürükleme ve çok adımlı görevlerin geri bildirimini de denetlemek | Orta | Denetim | Sunumdan önce |
| 7 | Nesne ve bağlam çeşitliliği (somutluğun azaltılması) | Orta | Üretici | Kısa vade |
| 8 | Çeşitliliği düşük hücreler ve seviyeler arası fark | Orta | Üretici | Kısa vade |
| 9 | Eksik kazanımlar için yeni görevler (sayı dönüştürme, tek-çift, 100'lük tablo, konum, ölçme) | Yüksek | Yeni görev | Orta vade |
| 10 | Kurmancî insan sesi kaydı ve anadili Kurmancî eğitimci incelemesi | Yüksek | Kayıt + uzman | Orta vade |

## 3. Bulgular ve öneriler

### 3.1 Geri bildirim dili: çocuğa uygun ve süreç odaklı

**Kanıt:**
- Paketteki Türkçe metinlerin 97'sinde kuram terimi geçiyor: kardinalite, cebirsel, üçlü kod, kompozisyon, referans noktası, sayı hissi. Bunların bir kısmı öğretmen ekranında; çocuğun oyun ekranında görülen farklı cümle sayısı 16. Örnekler:
  - "Son söylediğin sayı toplam miktarı verir — **kardinalite ilkesi**!"
  - "Matematiksel bir yargıyı değerlendirdin — **cebirsel düşünce**!"
  - "Somuttan soyuta geçiş yapıyorsun — **üçlü kod**!"
  - "Parçalardan bütüne geçiş = **kompozisyon becerisi**!"
  - "Sayma sırasını değiştirsen de sonuç aynıdır — **sıra bağımsızlığı**!"
- İpucu penceresi çocuğa "KADEME 1 — YÖNLENDİRİCİ SORU" başlığını gösteriyor.
- Övgülerin bir kısmı kişiye yöneliktir ("Yıldız gibi parlıyorsun!", "Süper çözdün, Kaşif!"). Bunlar görevden bağımsız, rastgele seçiliyor.

**Neden önemli:** Geri bildirimin öğrenmeye etkisi, göreve ve sürece yöneldiğinde en yüksektir (Hattie ve Timperley, 2007). Kişiye yönelik övgü, hatadan sonra çabayı azaltabilir (Mueller ve Dweck, 1998). Matematik kaygısı yüksek çocuklar için bu fark daha da önemlidir. Kuram terimleri 6 yaşındaki bir çocuğa bir şey anlatmaz; öğretmenin raporunda ise değerlidir.

**Öneri:**
1. Her görevin övgü havuzunu, çocuğun az önce yaptığı işi adlandıran cümlelerle değiştirmek. Örneğin "Son söylediğin sayı kaç tane olduğunu gösteriyor. Sen de 7 dedin!"
2. Kuramsal açıklamayı öğretmen ve ebeveyn raporuna taşımak. Raporda örneğin şöyle yazabilir: "Kardinalite ilkesini kullanıyor (Göktaşı Say, 3. seviye)."
3. İpucu başlığını çocuk diliyle yazmak: "1. ipucu: Kendine sor".
4. Kişi övgüsünü seyrekleştirmek; süreç övgüsünü asıl metin yapmak.

**İş:** yaklaşık 150 metin, üç dilde. Mevcut yama yöntemiyle yapılabilir.

### 3.2 Karşılaştırmada algısal ipucu

**Kanıt:** Gezegen Düellosu'nun üreticisinde "boyut yanılsaması" (`sizeIllusion`) diye bir madde türü tanımlı, ama bayrak sabit olarak kapalı. Bu yüzden her maddede fazla olan grubun çubuğu ya da alanı da büyük. Kozmik Terazi ve 5 Yıldız Skalası'nda da taşlar aynı boyda ve aynı aralıkla diziliyor.

**Neden önemli:** Çocuk sayıyı değil, uzunluğu ya da kapladığı alanı karşılaştırarak doğru yanıta ulaşabilir. Sayısal büyüklük yargısında görsel ipuçlarının (toplam alan, yoğunluk, uzunluk) etkisi iyi bilinir (Gebuis ve Reynvoet, 2012). Sayı hissini ölçen ve geliştiren görevlerde bu ipuçları bazı maddelerde sayıyla çelişmelidir. Diskalkuli taramasında da en ayırt edici maddeler bu uyumsuz maddelerdir.

**Öneri:**
- 3. seviyeden sonra maddelerin yaklaşık üçte biri uyumsuz olsun: fazla olan grupta taşlar daha küçük ya da daha sık dizili.
- Uyumsuz maddelerdeki doğruluk öğretmen raporunda ayrı gösterilsin.

**İş:** tek bayrak değişikliği ve gösterimin bayrağa göre çizilip çizilmediğinin denetlenmesi.

### 3.3 Yanıtı önceden veren strateji etiketleri

**Kanıt:** Bazı maddelerde soru ile birlikte stratejinin kuralı da gösteriliyor:
- **Bölme Ustası:** 19 ÷ 19 sorusunun altında "⚡ n÷n=1 — Sayı kendisine bölünürse 1 olur!" yazıyor. Kural yanıtın kendisi.
- **Yıldız Dizisi:** "3 satır × 4 sütun = 3 × 4" alt yazısı işlemi hazır veriyor.

**Neden önemli:** Doğru yanıtlar ustalık kararına ve aralıklı tekrar kutularına işler. Kural önceden gösterilince, çocuğun bilmediği bir olgu "öğrenilmiş" sayılır.

**Öneri:** Strateji etiketi ilk denemede görünmesin. Yanlış yanıttan sonra ya da ipucu düğmesiyle çıksın. İlk denemede yalnız soru kalsın.

**İş:** görev başına bir koşul (Bölme Ustası, Yıldız Dizisi, Güç Birleştir, Enerji Ayır).

### 3.4 Sözel problemler: rakam ve okuma yükü

**Kanıt:**
- Denetlenen 75 sözel problemin **75'inde** sayılar yazıyla yazılmış ("on iki fotoğrafı dört albüme").
- Problem metinleri ortalama 13–16, en çok 20 sözcük.
- Hangi Şema? maddeleri ortalama 16 sözcük.

**Neden önemli:**
- Diskalkuli ile okuma güçlüğü sık birlikte görülür.
- Sayıyı yazıdan çözmek, matematikten önce ikinci bir engel yaratır.
- Ders kitapları sözel problemlerde rakam kullanır.
- Seslendirme artık isteğe bağlı olduğu için okuma yükü daha da önem kazandı.

**Öneri:**
1. Sayıları rakamla yazmak (sesli okuma yine sözcükle okur).
2. Metni her cümlede bir bilgi olacak biçimde satırlara bölmek.
3. Problem akışının "Anla" adımına şema temelli bir **şerit (bar) model** eklemek. Şema temelli öğretimin sözel problemlerde etkisi güçlüdür (Fuchs vd., 2010).
4. Hangi Şema? görevini bu adıma bağlamak.

**İş:** üreticide sayının biçimi tek bir işleve bağlı. Şerit model yeni bir görsel bileşen ister.

### 3.5 Seslendirme isteğe bağlı: okumayan çocuk

**Kanıt:**
- Seslendirme artık yalnız 🔊 ya da 🗣️ düğmesine basınca çalışıyor.
- Okul öncesi yolundaki çocukların çoğu yönergeyi okuyamaz. Birçok görevde yönerge yalnız yazıyla veriliyor ("Beşlik çerçevede kaç yıldız taşı var?").

**Öneri:**
- Çocuk profiline yetişkinin açıp kapatabileceği bir "yönergeleri sesli oku" ayarı eklemek.
- Varsayılan kapalı kalsın. Okul öncesi yaş grubu seçildiğinde kurulum ekranı bu ayarı önersin.
- 🗣️ düğmesini ilk sorularda kısa bir parıltıyla tanıtmak.

**İş:** bir ayar ve seslendirme kapısında tek koşul (`galaksay-ek.js`).

### 3.6 Denetlenmeyen geri bildirimler

**Kanıt:** Görüntü denetimi yanıtı şık düğmesiyle verebildi. Şu görevlerde yanıt başka yollarla veriliyor, bu yüzden bu görevlerin yanlış yanıt geri bildirimi okunamadı:

| Yanıt yolu | Görevler |
|---|---|
| Tuş takımı | Güç Birleştir, Enerji Ayır, Strateji Ustası, Bölme Ustası |
| Sürükleme ya da yerleştirme | Yıldız Taşı Diz, Yıldız Taşı Birleştir, Yıldız Taşı Ayır, İkili Görev, Uzay Mutfağı, Yörünge Sırala, Yörüngeye Yerleştir, Parça-Bütün Puzzle |
| Çok adımlı akış | Sözel problemlerin son adımları |

İngilizce arayüz de denetlenmedi.

**Öneri:** Denetim aracına tuş takımıyla yanıt yazma ve sürükleme adımlarını eklemek. Bu görevlerin geri bildirimini de aynı yöntemle okumak.

**İş:** denetim aracında iki yeni etkileşim. Oyun kodunda değişiklik yok.

### 3.7 Nesne ve bağlam çeşitliliği

**Kanıt:**
- Soru metinlerinde nesne neredeyse hep "yıldız taşı" ya da "kapsül".
- Sözel problemlerin bağlamları küçük bir kümeden geliyor: sınıf, bilye, kalem, pasta, şeker, fotoğraf, otopark.

**Neden önemli:** Tek bir nesneyle öğrenilen sayı bilgisi başka bağlamlara zor aktarılır. Önerilen yol **somutluğun azaltılmasıdır** (Fyfe vd., 2014): tanıdık gerçek nesne → yıldız taşı → nokta → rakam.

**Öneri:**
1. Sayma ve eşleme görevlerinin alt seviyelerinde gerçek nesne görselleri (meyve, parmak, oyuncak) kullanmak.
2. Üst seviyelerde nokta ve rakama geçmek.
3. Sözel problem bağlamlarını çocuğun gündelik yaşamından (okul yolu, pazar, bayram, oyun parkı) ve yerel kültürden genişletmek.
4. Her bağlamı Kurmancîde de doğal hâle getirmek.

**İş:** üreticide nesne tablosu, 20–30 yeni görsel ve 40 yeni bağlam kalıbı.

### 3.8 Madde çeşitliliği ve seviyeler arası fark

**Kanıt:** 365 hücreden 34'ünde, 40 maddede en çok 4 farklı madde çıkıyor:
- Uzay Hafızası 1–4. seviye: 2–3 farklı madde
- 5 Yıldız Taşı Topla: bütün seviyelerde en çok 4 farklı madde
- İkili Görev, Uzay Mutfağı: en çok 4 farklı madde
- Galaktik Paylaşım, Filo Grupla ve Yıldız Dizisi 1. seviye: 2 farklı madde

Beşli Radar'ın beş seviyesi de aynı 1–5 aralığını soruyor.

**Neden önemli:**
- Az sayıda madde tekrar edince çocuk yanıtı ezberler, ustalık kararı şişer.
- Seviyeler yalnız sayı aralığıyla ayrışınca, sayı aralığı dar görevlerde seviye bir şey değiştirmez.

**Öneri:** Bu görevlerde seviyeyi başka boyutlarla tanımlamak: gösterim süresi, düzenli ya da dağınık dizilim, renk gruplaması, çeldirici yakınlığı. Beşli Radar'da örneğin 1. seviye düzenli ve uzun gösterim, 5. seviye dağınık ve kısa gösterim olabilir. Hücre başına en az 8 farklı madde hedeflenmeli.

**İş:** 8 görevin üretici kuralları.

### 3.9 Eksik kazanımlar (MEB 1–2. sınıf ve diskalkuli taraması)

Mevcut 73 görev sayı, işlem, ölçmenin bir kısmı, örüntü ve veriyi iyi kapsıyor. Eksik kalanlar:

| Kazanım | Neden gerekli | Önerilen görev |
|---|---|---|
| **Sayı dönüştürme** (söylenen sayı ↔ rakam ↔ yazı; ör. "yüz iki" → 102) | Diskalkulide en sık hata türlerinden biridir: "yüz iki" → 1002 gibi (Moura vd., 2013). Mevcut eşleme görevi yalnız nesne ↔ rakam. | "Sayıyı Yaz": dinlenen ya da okunan sayının rakamlarını tuşla yazma; basamak kartlarıyla kurma. |
| **Tek ve çift sayılar** | 2. sınıf kazanımı. İkişer sayma ve eşleme ile bağlantılı. | "Eş Bul": taşları ikişer eşle; eşi kalan var mı? |
| **100'lük tablo** | 100'e kadar sayma, onar ve birer ileri-geri gitme. 2. sınıfta aralığın 100'e çıkması önerisi ([YORUNGE_DENETIMI.md](YORUNGE_DENETIMI.md)) bununla desteklenir. | "Yüzlük Harita": eksik sayılar, +10 / −10 / +1 / −1 hamleleri. |
| **Uzamsal konum ve yön** (sağ-sol, üst-alt, önünde-arkasında) | 1. sınıf geometri kazanımı. Görsel-uzamsal güçlük diskalkulide sık görülür. | "Konum Dedektifi": "roketin solundaki gezegen hangisi?" |
| **Geometrik cisimler ve simetri** | Mevcut geometri yalnız köşe ve kenar sayıyor. | Cisim-yüzey eşleme; ayna simetrisini tamamlama. |
| **Tartma ve sıvı ölçme** | 2. sınıf ölçme kazanımı. Ölçme yalnız uzunluk. | "Uzay Terazisi"nin nesneli bir türü; kap doldurma. |
| **Çetele ve sıklık tablosu** | Veri kazanımı. Mevcut görev yalnız şekil grafiği. | Grafik görevine çetele adımı. |

**İş:** her yeni görev bir üretici, bir ekran ve üç dilde metin ister. Canlı sürümün kaynak kodu depoda olmadığı için yeni görevler ancak kaynak depoya alındığında sağlıklı eklenebilir.

### 3.10 Kurmancî

**Kanıt:**
- Kurmancî metinler artık tamamen Kurmancî ([MADDE_GORUNTU_DENETIMI.md](MADDE_GORUNTU_DENETIMI.md), §5.2).
- Ama cihazların çoğunda Kurmancî sistem sesi yok, bu yüzden Kurmancî yönergeler okunmuyor.
- Kod, `oyna/audio/ku/` klasöründeki kayıtları kullanacak biçimde hazır (sayılar için `num/0` … `num/100`), ancak sunucuda bu dosyalar yok.

**Öneri:**
1. Anadili Kurmancî bir eğitimcinin sesiyle 0–100 sayıları ve en sık 150 yönerge cümlesini kaydetmek (yaklaşık 2 saatlik kayıt).
2. Bütün Kurmancî metinleri bu eğitimcinin gözden geçirmesi.

Kurmancî eğitim içeriği az olduğu için bu, GalakSay'i alanında belirgin biçimde ayıran bir özellik olur.

## 4. Önerilen uygulama sırası

**Sunumdan önce (yama yöntemiyle, 1–2 gün):**
1. Geri bildirim dili: övgü havuzları, ipucu başlığı (§3.1)
2. Uyumsuz karşılaştırma maddeleri (§3.2)
3. Strateji etiketlerini hatadan sonraya almak (§3.3)
4. Sözel problemlerde rakam ve satır düzeni (§3.4)
5. Okul öncesi için sesli yönerge ayarı (§3.5)
6. Denetimin tuş takımı ve sürükleme görevlerine genişletilmesi (§3.6)

Her adımdan sonra görüntü denetimi yeniden koşulur ve önce/sonra ölçümü rapora eklenir.

**Kısa vade:** nesne ve bağlam çeşitliliği (§3.7), çeşitliliği düşük hücreler (§3.8).

**Orta vade (kaynak kod depoya alınınca):** yeni görevler (§3.9), Kurmancî ses kaydı ve uzman incelemesi (§3.10), pilot çalışmada madde güçlüğü analizi ([PILOT_PROTOKOLU.md](PILOT_PROTOKOLU.md)).

## 5. Uygulama durumu (ilk altı madde)

İlk altı madde 27 Eylül 2026'da uygulandı:

| Dosya | İçerik |
|---|---|
| `canli-surum/kaynak/icerik_iyilestirmeleri.py` | 121 değişiklik |
| `canli-surum/kaynak/WelcomeScreen.captain.js` | kaptan oluşturmadaki seçenek |
| `canli-surum/site/oyna/galaksay-ek.js` | seslendirme kapısı |

Ölçüm, görüntü düzeyindeki denetimin aynı yöntemle yeniden koşulmasıyla yapıldı: Türkçe 1.095, Kurmancî 365 madde.

| Ölçüt | Önce | Sonra |
|---|---:|---:|
| Çocuğun ekranında kuram terimi geçen farklı cümle | 17 | 0 |
| İpucu başlığında "KADEME … YÖNLENDİRİCİ SORU" | var | yok ("İPUCU 1 — KENDİNE SOR") |
| Gezegen Düellosu: şıkta sayının yanıttan önce görünmesi | 15 / 15 | 0 / 15 |
| Gezegen Düellosu: 3. seviyeden sonra uyumsuz (boyut yanılsamalı) madde | 0 | açık (çubuk ve taş gösteriminde yaklaşık %35) |
| Bölme Ustası: kuralın (= yanıtın) soruyla birlikte görünmesi | 9 / 9 | 0 / 7 |
| Yıldız Dizisi: "= r × c" işleminin soruyla birlikte görünmesi | 15 / 15 | 0 |
| Sözel problem: sayıların yazıyla yazılması | 75 / 75 | 0 / 75 |
| Tuş takımlı ve etkileşimli 7 görevde okunabilen geri bildirim | 0 / 105 | 89 / 105 |

### 5.1 Yapılanlar

- **§3.1 Geri bildirim dili:**
  - Kuram terimi geçen övgü ve açıklamalar, çocuğun yaptığı işi anlatan cümlelere çevrildi (TR 35, KU 26, EN 21 cümle).
  - Genel övgü havuzları kişi övgüsünden süreç övgüsüne geçti ("Doğru! Adım adım düşündün.").
  - İpucu başlıkları çocuk dilinde: "Kendine sor", "Resme bak", "Adım adım", "Birlikte yapalım", "Nesnelerle dene".
  - Denklem Dedektifi etiketleri: "Yer Değiştirme", "Sıfır Eklemek".
  - Tuş takımlı görevlerin geri bildirimi okununca bulunanlar da düzeltildi:
    - Çocuğa yapmadığı bir işlemi mal eden övgü ("…tane saydın — verimli strateji", "Toplama ile düşündün")
    - Matematiksel olarak yanlış açıklama ("sıfırla çarpımın bölmeyle tersi yoktur")
    - Boşluk hatası ("taşı+ 2 yıldız taşı=")
- **§3.2 Algısal ipucu:**
  - "Boyut yanılsaması" maddeleri açıldı: fazla olan grubun taşları küçük, az olanınki büyük.
  - Uyumsuz maddeyi işaretleyen turuncu çerçeve kaldırıldı.
  - Ayrıca şıklar sayıyı yazıyordu ("A 14 / B 12") ve çocuk taşlara bakmadan rakamı karşılaştırabiliyordu. Şıklarda yanıttan önce yalnız A / B görünür.
- **§3.3 Strateji etiketleri:** Bölme Ustası'nın kural satırı ve Yıldız Dizisi'nin "= r × c" satırı, ipucu istenince ya da yanıttan sonra görünür.
- **§3.4 Sözel problemler:**
  - Sayılar rakamla yazılıyor: metin, "Verilen" satırı ve çubuk modeli etiketleri. Ses yine sözcükle okur.
  - Her cümle ayrı satırda.
  - "Anla" adımı rakamları da buluyor; "7", "17"nin içinde eşleşmiyor.
  - İşlem seçme adımında şerit model var: bütün ve iki parça, bilinmeyen yerde "?". Toplama ve çıkarma türlerinde (birleştirme, ayırma, parça-bütün, karşılaştırma) gösteriliyor.
- **§3.5 Sesli yönergeler:**
  - Kaptan oluşturmanın yaş adımında "Yönergeleri kendiliğinden sesli oku" seçeneği var. Okul öncesi seçilince kendiliğinden açılır.
  - Yetişkin panelindeki çocuk formuna "Sesli yönergeler (henüz okumuyor)" bayrağı eklendi.
  - Formdaki "Okuma güçlüğü" bayrağı "tüm yönergeler otomatik seslendirilir" diyordu, ama seslendirme isteğe bağlı olduktan sonra bu söz tutulmuyordu. Kapı artık bu iki bayrağı tanıyor.
  - Test: okul öncesi kaptanda ve okuma güçlüğü bayrağında soru kendiliğinden okunuyor; bayraksız çocukta okunmuyor.
- **§3.6 Denetimin genişletilmesi:** Denetim aracı tuş takımıyla yanıt yazıyor. Kapalı "Kontrol Et" düğmesinde önce bir yuvaya dokunuyor. Bu yolla Güç Birleştir, Enerji Ayır, Strateji Ustası, Bölme Ustası, Yıldız Taşı Diz, Birleştir ve Ayır görevlerinin geri bildirimi okunuyor.

### 5.2 Kalanlar

- Çubuk kesme, Uzay Mutfağı, Parça-Bütün Puzzle ve Yörüngeye Yerleştir farklı bir etkileşimle (sürükleme, kesme, konum seçme) yanıt alıyor. Bu dört görevin geri bildirimi henüz otomatik okunamıyor.
- Uyumsuz karşılaştırma maddelerindeki doğruluğun öğretmen raporunda ayrı gösterilmesi yapılmadı.
- Genişletilmiş denetim yeni bir Kurmancî açığı gösterdi.
  - 365 Kurmancî maddeden 51'inde, ipucu merdiveninin 2–5. basamaklarındaki çözümleme metinleri Türkçe kalıyor.
  - Nedeni: kaynakta yaklaşık 176 dal yalnız Türkçe ya da İngilizce yazılmış. Bunlar sözel problemlerin somut destekleri, Sıralama, Sayı İnşa Et, Tahmin, Taş Ekle/Çıkar, Çubuk Geri Sayım, Onluk Demetle ve Yörüngeye Yerleştir dallarıdır.
  - Soru, seçenekler ve geri bildirim tamamen Kurmancî; açık yalnız çocuk ipucu istediğinde görünüyor.
  - Bu metinlerin makine çevirisiyle değil, anadili Kurmancî bir eğitimciyle çevrilmesi önerilir (§3.10).
- §3.7–3.10 kısa ve orta vadeye bırakıldı.

## Kaynaklar

- Fuchs, L. S., Zumeta, R. O., Schumacher, R. F., Powell, S. R., Seethaler, P. M., Hamlett, C. L. ve Fuchs, D. (2010). The effects of schema-broadening instruction on second graders' word-problem performance and their ability to represent word problems with algebraic equations. *The Elementary School Journal, 110*(4), 440–463.
- Fyfe, E. R., McNeil, N. M., Son, J. Y. ve Goldstone, R. L. (2014). Concreteness fading in mathematics and science instruction: A systematic review. *Educational Psychology Review, 26*(1), 9–25.
- Gebuis, T. ve Reynvoet, B. (2012). The role of visual information in numerosity estimation. *PLoS ONE, 7*(5), e37426.
- Hattie, J. ve Timperley, H. (2007). The power of feedback. *Review of Educational Research, 77*(1), 81–112.
- Moura, R., Wood, G., Pinheiro-Chagas, P., Lonnemann, J., Krinzinger, H., Willmes, K. ve Haase, V. G. (2013). Transcoding abilities in typical and atypical mathematics achievers. *Journal of Experimental Child Psychology, 116*(3), 707–727.
- Mueller, C. M. ve Dweck, C. S. (1998). Praise for intelligence can undermine children's motivation and performance. *Journal of Personality and Social Psychology, 75*(1), 33–52.
