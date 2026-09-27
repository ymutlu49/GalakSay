# GalakSay Kullanılabilirlik ve Ölçme İyileştirmeleri

**Tarih:** 27 Eylül 2026 · **Kapsam:** galaksay.com canlı sürümü (`canli-surum/site`)

Bu belge, dokuz iyileştirme önerisinin uygulama sonucunu kaydeder. Kod ayrıntılı incelendiğinde önerilerin bir kısmının uygulamada zaten bulunduğu görüldü. Bunlar değiştirilmedi, çalıştıkları doğrulandı.

## Yapılan değişiklikler

| Öneri | Yapılan | Doğrulama |
|---|---|---|
| Kurmancî seslendirme | Oyun Kurmancî metni Türkçe sesle okuyordu. Kayıtlı Kurmancî ses klasörü sunucuda yoktu. Artık cihazda Kurmancî bir sistem sesi varsa o kullanılıyor, yoksa okuma sessiz. Sessiz okumada konuşma zamanlaması korunuyor, sayma animasyonları ve sıralı yönergeler akmaya devam ediyor. | Kurmancîde Türkçe ses çağrısı 0. Türkçede ses sürüyor. Kurmancî ve Türkçede 10 soruluk görev sonuna kadar oynandı, hata yok. |
| Tek dokunuşla günlük görev | Çocuk merkezindeki büyük düğme artık "⭐ Bugünün Görevi 1/2" ile günün yeni görevini, ardından 2/2 ile tekrar görevini açıyor. İkisi bitince, biriken hata varsa "🔁 Tekrar Durağı" açılıyor. "Kaldığın yerden devam" ikincil düğmeye indi. | Dört durum tarayıcıda denendi. Birinci görev bitince düğme 2/2'ye geçti. |
| Aralıklı ve karışık tekrar | Günlük tekrar görevi her gün aynı en zayıf görev değil, en zayıf üç görev arasında dönüyor. | Kod incelemesi. |
| İki seçenekli görevlerde ustalık | Karşılaştırma, Korunum ve Doğru mu Yanlış mı? görevlerinde Kaptan Sınavı 5 yerine 8 soru. Geçme ölçütü 7 doğru. | Sınav uzunluğu tarayıcıda ölçüldü: bu üç görevde 8, diğerlerinde 5. |
| Yedekleme | Kaptan listesine yedeklemenin yolunu gösteren not eklendi. | Bir cihazda dışa aktarılan yedek, boş bir cihazda geri yüklendi. Kaptan ve ilerlemesi eksiksiz geldi. |
| Pilot çalışma ve madde analizi | Pilot protokolü taslağı yazıldı (`docs/PILOT_PROTOKOLU.md`). Akademik veri paketini çözümleyen betik eklendi (`arastirma/madde_analizi.py`). | Benzetim verisinde güçlükler r = 0,998 ile geri kestirildi. Uygulamanın gerçek dışa aktarımıyla da çalıştı. |

Yedekleme özelliği zaten vardı ve yetişkin şifresiyle korunuyordu, yalnız görünür değildi. Dışa aktarma şifreli kayıtları çözüyor ve IndexedDB tablolarını da içeriyor.

## Zaten var olan ve değiştirilmeyenler

| Öneri | Uygulamadaki karşılığı |
|---|---|
| Aralıklı tekrar | Yanlış yanıtlanan maddeler dört kutulu bir sistemle 0, 1, 3 ve 7 gün sonra yeniden soruluyor. Oyun içinde her üç sorudan birinde bekleyen bir hata tekrar ediliyor. Günlük görevin ikinci adımı zaten bir tekrar görevi. |
| Süre baskısının sınırlanması | Normal oyunda soru süresi yok. Zamanlı sondalar yalnız bir yetişkinin başlattığı oturumlarda görünüyor. Kaptan girişiyle oynayan çocuk bunları görmüyor. |
| Öğretmen eylem listesi | Öğretmenin öğrenci listesinde "Bu Hafta Önerilen Eylemler" paneli var. Panel, hangi çocuğun hangi alanda takıldığını ve mini grup önerisini gösteriyor. Sınıfta en yaygın yanılgıyı ve tahta etkinliğini, 4 günden uzun süredir oynamayanları da gösteriyor. Çocuk panosunda ise kural tabanlı uyarılar var: düşük doz, 7 gün oynamama, farklı günlerde yinelenen yanılgı, üst üste seviye düşüşü, risk artışı. |
| Akademik veri | Sınıf panelinde anonim akademik veri paketi indirilebiliyor. Paket her yanıtı bir satır olarak, veri sözlüğüyle ve SHA-256 özetli bir manifestle birlikte içeriyor. |

## Yapılamayan

**Kaynak kodun depoya alınması.** Canlı sürümün (Jimaro v5.10) okunur kaynak kodu GitHub deposunda değil. Bu yüzden canlı sürümdeki değişiklikler derlenmiş dosyaya birebir metin yamasıyla yapılıyor (`canli-surum/kaynak/*.py`). Her yama eşleşme bulamazsa dosyaya dokunmadan duruyor, bu da yöntemi güvenli kılıyor. Ancak uzun vadede kaynak kodun depoya alınması gerekir. Bu adım, kaynağın bulunduğu bilgisayara erişim ister.

## Uygulama sırası

```
python3 canli-surum/kaynak/yorunge_duzeltmeleri.py
python3 canli-surum/kaynak/secenek_duzeltmeleri.py
python3 canli-surum/kaynak/iyilestirmeler.py
```
