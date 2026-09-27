# GalakSay Pilot Çalışma Protokolü (Taslak)

**Sürüm:** 27 Eylül 2026 · **Durum:** Etik kurul başvurusu öncesi taslak · **İlgili belgeler:** [MADDE_DENETIMI.md](MADDE_DENETIMI.md), [YORUNGE_DENETIMI.md](YORUNGE_DENETIMI.md), `arastirma/madde_analizi.py`

Bu belge, GalakSay'in matematik öğrenme güçlüğü riski taşıyan çocuklarda etkililiğini sınayacak bir pilot çalışmanın taslak protokolüdür. Ölçme araçlarının seçimi, örneklem büyüklüğü ve etik süreç, araştırma ekibinin son kararına bırakılmıştır. Belgede adı geçen dış ölçme araçlarının güncel geçerlik ve güvenirlik kanıtları, başvuru öncesinde araştırmacı tarafından doğrulanmalıdır.

## 1. Amaç ve araştırma soruları

Çalışmanın amacı, GalakSay ile 8 hafta süren düzenli uygulamanın erken sayı becerilerine etkisini ve uygulamanın ölçme bileşenlerinin psikometrik niteliğini sınamaktır.

1. GalakSay kullanan çocukların erken matematik başarısındaki artış, bekleme listesindeki çocuklardan yüksek midir?
2. Etki, uygulama dozuyla (oynanan gün sayısı ve toplam dakika) ilişkili midir?
3. Uygulama içi Yıldız Haritası Kontrolü, standart testle ne düzeyde ilişkilidir (ölçüt geçerliği)?
4. Görev × seviye madde aileleri tek boyutlu bir güçlük ölçeğine uyar mı ve seviye sırası güçlük sırasıyla örtüşür mü?

## 2. Desen

Randomize bekleme listesi kontrollü desen önerilir.

| Aşama | Müdahale grubu | Bekleme listesi grubu |
|---|---|---|
| Hafta 0 | Ön test | Ön test |
| Hafta 1–8 | GalakSay, haftada 3–4 gün, 15–20 dakika | Olağan sınıf öğretimi |
| Hafta 9 | Son test | Son test |
| Hafta 10–17 | İzleme dönemi, uygulama serbest | GalakSay, aynı doz |
| Hafta 18 | İzleme testi | Son test |

Randomizasyon sınıf içinde, çocuk düzeyinde ve okul ile ön test puanına göre tabakalı yapılır. Sınıflar arası bulaşma riski yüksek görülürse sınıf düzeyinde küme randomizasyonu seçilmelidir. Bu durumda örneklem büyüklüğü tasarım etkisiyle artırılmalıdır.

## 3. Katılımcılar

- **Hedef grup:** İlkokul 1. ve 2. sınıf öğrencileri.
- **Risk ölçütü:** Standart erken matematik testinde sınıf düzeyi normlarına göre alt %25'te olmak ve öğretmenin matematik güçlüğü gözlemi.
- **Dışlama ölçütleri:** Tanılı zihinsel yetersizlik, düzeltilmemiş görme ya da işitme sorunu, ve dokunmatik ekranı kullanmayı engelleyen motor güçlük.
- **Dil:** Türkçe ya da Kurmancî. İki dilli çocuklarda uygulama dili ailenin ve çocuğun tercihine göre seçilir ve kaydedilir.

## 4. Örneklem büyüklüğü

Birincil karşılaştırma için orta düzey bir etki (d = 0,50), α = 0,05 ve güç 0,80 alındığında bağımsız iki grup için grup başına 64 çocuk gerekir. Ön test ortak değişken olarak alınırsa (ANCOVA) ve ön test ile son test arasındaki ilişki r = 0,60 ise gereken sayı yaklaşık (1 − r²) oranında azalır:

| Varsayım | Grup başına n |
|---|---:|
| Bağımsız gruplar, ortak değişken yok | 64 |
| ANCOVA, ön test–son test r = 0,60 | 41 |
| ANCOVA ve %15 kayıp | 49 |

Pilot aşamada amaç kesin bir etki kestirimi değil, uygulanabilirlik, doz uyumu ve ölçme araçlarının işleyişidir. Grup başına 25–30 çocukla yürütülen bir pilot, asıl çalışmanın güç analizine girdi sağlar.

## 5. Müdahale

- **Doz:** Haftada 3–4 gün, oturum başına 15–20 dakika, 8 hafta. Bu değer uygulamanın kendi doz hedefiyle aynıdır.
- **Giriş:** Her çocuk kendi kaptan profiliyle girer. Profil adı yerine katılımcı kodu kullanılabilir.
- **Günlük akış:** Çocuk merkezindeki büyük "Bugünün Görevi" düğmesi, öğrenme yolculuğundaki sıradaki görevi ve bir tekrar görevini sırayla açar. Biriken hatalar Tekrar Durağı'nda 0, 1, 3 ve 7 gün aralıklarla yeniden sorulur.
- **Uygulama sadakati:** Oynanan günler, oturum süreleri ve yanıt sayıları uygulama tarafından kaydedilir ve akademik veri paketinde yer alır. Haftalık doz hedefinin altında kalan çocuklar öğretmen panosunda uyarı olarak görünür.
- **Yetişkin rolü:** Öğretmen oturumu başlatır ve gerekirse çocuğun yanında durur. Soruları çocuk adına yanıtlamaz.

## 6. Ölçme araçları

| Tür | Araç | Zaman |
|---|---|---|
| Birincil sonuç | Türkçe normları olan standart bir erken matematik testi (örneğin TEMA-3'ün Türkçe uyarlaması) | Ön, son, izleme |
| İkincil sonuç | Uygulama içi Yıldız Haritası Kontrolü: ipucusuz, puansız, paralel formlu kısa ölçüm | Ön, son, izleme |
| İkincil sonuç | Uygulama içi zamanlı sondalar: dakikada doğru sayısı (müfredat tabanlı ölçme) | Ön, son |
| İkincil sonuç | Sayı doğrusu tahmin sapması (uygulama kaydı) | Sürekli |
| Aracı değişken | Doz: oynanan gün, toplam dakika, yanıt sayısı | Sürekli |
| Ortak değişken | Yaş, sınıf, uygulama dili, ön test puanı | Ön |
| İsteğe bağlı | Çocuklar için uyarlanmış bir matematik kaygısı ölçeği | Ön, son |

Zamanlı sondalar uygulamada yalnız yetişkinin başlattığı oturumlarda görünür. Çocuğun kendi başına oynadığı oturumlarda süre baskısı yoktur.

## 7. Veri toplama adımları (uygulama içinde)

1. **Cihaz yöneticisi:** Açılış ekranında "Öğretmen · Ebeveyn" bağlantısından cihaz şifresi oluşturulur.
2. **Araştırma kodları:** Ayarlar bölümünde çalışma kodu, okul kodu ve cihaz kodu girilir.
3. **Katılımcı kodu:** Her çocuğun profilinde katılımcı kodu girilir. Çocuğun adı akademik pakete hiçbir zaman yazılmaz.
4. **Dışa aktarma:** Sınıf İlerlemesi panelinde "🔒 Anonim CSV" düğmesi, ZIP biçiminde akademik veri paketini indirir. Paket her yanıtı bir satır olarak içerir. Ayrıca oturumları, günlük özetleri, ölçüm sonuçlarını, bir veri sözlüğünü ve dosya bütünlüğü için SHA-256 özetli bir manifesti içerir.
5. **Analiz:** Bütün cihazların paketleri tek komutla birleştirilip çözümlenir:

```
python3 arastirma/madde_analizi.py okul1-cihaz1.zip okul1-cihaz2.zip --cikti analiz/
```

Betik yalnız Python standart kütüphanesini kullanır. Çıktılar şunlardır:
- görev × seviye güçlük tablosu, %95 güven aralıklarıyla
- tavan ve taban uyarıları
- seviye sırası ters olan hücreler
- keşfedici Rasch kalibrasyonu
- Yıldız Haritası Kontrolü ön ve son test karşılaştırması

Betik, bilinen güçlüklerle üretilmiş benzetim verisinde güçlükleri r = 0,998 doğrulukla geri kestirmiştir. Uygulamanın gerçek dışa aktarımıyla da denenmiştir.

## 8. Analiz planı

- **Birincil analiz:** Son test ~ grup + ön test (ANCOVA), niyet-tedavi ilkesiyle. Okul ve sınıf rastgele etki olarak karma etkili modele alınır. Etki büyüklüğü Hedges g ile %95 güven aralığında raporlanır.
- **Doz–yanıt:** Müdahale grubunda kazanım ~ oynanan gün sayısı ilişkisi incelenir. Bu analiz nedensel değil, betimseldir.
- **Ölçüt geçerliği:** Yıldız Haritası Kontrolü ile standart test arasındaki korelasyon, ön ve son testte ayrı ayrı hesaplanır.
- **Psikometri:** Görev × seviye madde aileleri için Rasch kalibrasyonu yapılır. Betikteki JML kestirimi keşfedicidir. Yayın için koşullu ya da marjinal en çok olabilirlik yöntemleri kullanılmalıdır (R: TAM, eRm, mirt). Uyum ölçütü olarak infit ve outfit ortalama kareleri için 0,5–1,5 aralığı alınır.
- **Eksik veri:** Kayıp oranı ve nedenleri gruplara göre raporlanır. Eksik sonuç verisi için çoklu atama uygulanır.
- **Duyarlılık analizi:** Protokole uyan çocuklarla (haftada en az 3 gün, en az 6 hafta) ayrı analiz yapılır.

## 9. Etik ve veri koruma

- **İzinler:** Üniversite etik kurulu onayı ve Millî Eğitim Bakanlığı araştırma uygulama izni alınır.
- **Onam:** Veliden yazılı onam, çocuktan yaşına uygun sözlü rıza alınır. Çocuk istediği an oyunu bırakabilir.
- **KVKK:** Akademik pakette çocuk adı, doğum tarihi, okul, il ve ilçe bulunmaz. Katılımcıları yalnız katılımcı kodu ve cihaz içinde üretilen takma kimlik bağlar. Yayın öncesinde k ≥ 5 kontrolü önerilir.
- **Bekleme listesi grubu:** Bu grup, çalışmanın ikinci yarısında uygulamaya aynı dozla erişir.
- **Tanı dili:** Uygulamanın risk göstergeleri tanı değildir. Veliye yapılan bildirimlerde bu açıkça belirtilir ve gerekirse uzman değerlendirmesi önerilir.

## 10. Zaman çizelgesi

| Dönem | İş |
|---|---|
| Ay 1 | Etik kurul ve MEB izni, okul görüşmeleri, cihaz hazırlığı |
| Ay 2 | Tarama, onam, ön test, randomizasyon |
| Ay 3–4 | Müdahale (8 hafta), haftalık doz izleme |
| Ay 5 | Son test, bekleme listesi grubunun başlaması |
| Ay 6–7 | İzleme testi, analiz, rapor |

## 11. Sınırlılıklar

- Pilot örneklem küçük olduğundan etki kestirimi geniş güven aralığıyla raporlanmalıdır.
- Uygulama verisi cihazda tutulur. Cihaz paylaşımı ya da tarayıcı verisinin silinmesi veri kaybına yol açabilir. Araştırma cihazlarında haftalık yedek alınması önerilir.
- Kurmancî seslendirme, cihazda Kurmancî bir sistem sesi yoksa kapalıdır. Kurmancî oynayan çocuklar yönergeleri yazılı görür. Dil grupları karşılaştırılırken bu fark kaydedilmelidir.
- Bekleme listesi deseni uzun dönem kalıcılığı yalnız müdahale grubunda ölçebilir.
