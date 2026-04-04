# GalakSay DokunSay Donusum Envanter Raporu

**Tarih:** 2026-03-18
**Versiyon:** 5.3.0
**Tech Stack:** React 18.3.1 + Vite 6.0.0 (SPA)
**Toplam Mod:** 59 benzersiz mod (modeStories.js) + 6 altyapi modu = 65 potansiyel
**Hedef:** 61 modul (icerik haritasi)

> Bu rapor, GalakSay platformunun mevcut durumunu DokunSay donusum spesifikasyonuna gore analiz eder.
> Her modul icin: DokunSay materyalleri, temsil katmanlari, animasyonlar, ipucu sistemi ve metin yogunlugu degerlendirilir.

---

## 1. DOKUNGSAY MATERYALLERİ — MEVCUT DURUM vs HEDEF

### 1.1 Enerji Kapsulu (DokunSay Sayi Cubuklari)

| Ozellik | Hedef Spec | Mevcut Durum | Fark |
|---|---|---|---|
| Bilesen | EnerjiKapsulu.jsx | NumberRod.jsx (yakin karsilik) | Renk semasi farkli, birim bolme mantigi VAR |
| Renk semasi (1-10) | Beyaz, Kirmizi, Acik yesil, Mor, Sari, Koyu yesil, Siyah, Kahverengi, Mavi, Turuncu | 5'e kadar mavi, 5+ kirmizi (iki-renkli sistem) | BUYUK FARK — DokunSay 10 benzersiz renk gerektiriyor |
| Birim bolmeleri | Gorunur centikler, deger bazli | RodCell bileseni ile hucre bazli gorunur | MEVCUT (yapisal olarak uygun) |
| Surukleme | %105 buyume + golge + 150ms ease-out | YOK — statik render | EKSIK |
| Manyetik snap | 20px mesafede cekim | YOK | EKSIK |
| Birlestirme | Uc uca, titresim → parlama → kaynasma (400ms) | YOK | EKSIK |
| Bolunme | Uzun basis → catlak → iki parca (300ms) | YOK (rodSplit modul icinde ozel mantik var) | KISMI |
| Parlama efekti | Hafif glow | boxShadow ile VAR | MEVCUT |

### 1.2 Pul (DokunSay Birim Pullari)

| Ozellik | Hedef Spec | Mevcut Durum | Fark |
|---|---|---|---|
| Bilesen | Pul.jsx | Chip.jsx (yakin karsilik) | Temel yapi VAR |
| Gorunum | Daire, metalik parlak | Daire, radial-gradient, metalik | MEVCUT |
| Dokunma efekti | Zipla (100%→115%→100%, 200ms) + sayi sesi + "sayildi" isareti | chipPop animasyonu (550ms) | KISMI — ziplar ama sayi sesi ve isaret yok |
| Surukleme | Suruklenebilir | LooseChips.jsx ile KISMI (tam drag-drop yok) | KISMI |
| Gruplama | Gruplanabilir, dagitilabilir | YOK | EKSIK |
| On-cerceveye yerlestirme | Her pul sirayla kutuya girer (100ms aralik) | Frame bileseni statik render | EKSIK (animasyonlu yerlestirme yok) |
| Renk korlugu | Desen overlay | VAR (cizgili/noktali overlay) | MEVCUT |

### 1.3 Yildiz Tasi (DokunSay Sayi Taslari)

| Ozellik | Hedef Spec | Mevcut Durum | Fark |
|---|---|---|---|
| Bilesen | YildizTasi.jsx | GreenChip (yesil numarali chip) | KISMI karsilik |
| Gorunum | Kristal tas, rakam buyuk punto, isildama | Yesil daire, rakam ortada | FARKLI — kristal/isildama yok |
| Surukleme | Kapsul/pul ile eslestirilebilir | YOK — statik | EKSIK |
| Sembolik baglanti | Isikli cizgi → ifade baglantisi | YOK | EKSIK |

### 1.4 Materyal Fizik Motoru

| Ozellik | Hedef Spec | Mevcut Durum | Fark |
|---|---|---|---|
| Bilesen | MateryalFizik.js | YOK | TAMAMEN EKSIK |
| Surukleme fizigi | Buyume + golge + yari saydam golge | YOK (CSS transition var, fizik yok) | EKSIK |
| Birakma fizigi | "Oturma" animasyonu + "tik" sesi | YOK | EKSIK |
| Manyetik snap | 20px cekim mesafesi | YOK | EKSIK |
| Birlestirme fizigi | Titresim → parlama → kaynasma | YOK | EKSIK |
| Bolunme fizigi | Uzun basis → catlak → ayrisma | YOK | EKSIK |

---

## 2. UCLU KODLAMA (Triple Coding) — KATMAN DURUMU

### 2.1 Mevcut Bilesenler

| Bilesen | Dosya | Durum | DokunSay Uyumu |
|---|---|---|---|
| ConcreteLayer | TripleCodingLayer.jsx:21 | Chip dizisi render ediyor | KISMI — sadece Chip, EnerjiKapsulu ve YildizTasi yok |
| VisualLayer | TripleCodingLayer.jsx:64 | tenFrame, fiveFrame, numberRod, numberLine, barModel, dotPattern | IYI — 6 gorsel model destekli |
| SymbolicLayer | TripleCodingLayer.jsx:161 | Matematiksel ifade render | MEVCUT |
| ConnectionArrows | TripleCodingLayer.jsx:193 | Basit ↕ oklari | KISMI — renk kodlamasi ve canli baglanti yok |
| Faz Yonetimi | PHASES: EXPLORE/SEE/WRITE/CONNECT | Butonlar var, faz gecisi calisiyor | MEVCUT ama oyun akisina entegre degil |

### 2.2 Faz Gecis Protokolu — Hedef vs Mevcut

| Asama | Hedef Spec | Mevcut | Fark |
|---|---|---|---|
| 1 — KESFET | Sadece DokunSay materyalleri, serbest manipulasyon | ConcreteLayer statik Chip render | EKSIK — manipulasyon yok |
| 2 — GOR | Somut → gorsel donusum animasyonu (800-1000ms) | Gecis yok, iki katman ayri render | EKSIK — donusum animasyonu yok |
| 3 — ADLANDIR | YildizTasi surukle → sembolik ifade olusur | Sembolik statik render | EKSIK — eslesme etkilesimi yok |
| 4 — BAGLA | Uc katman senkron, capraz etkilesim | ConnectionArrows ile minimal | EKSIK — senkron guncelleme yok |

### 2.3 LT Duzeyine Gore Katman Yonetimi

| LT Aralik | Hedef Varsayilan | Mevcut Varsayilan | Uyum |
|---|---|---|---|
| L2-5 | Somut ON, Gorsel OFF, Sembolik OFF | ltLevel < 6: EXPLORE fazindan basla | YAKIN |
| L6-8 | Somut ON, Gorsel ON, Sembolik OFF | ltLevel 6-10: SEE fazindan basla | YAKIN |
| L9-12 | Somut OFF, Gorsel ON, Sembolik ON | ltLevel >= 11: WRITE fazindan basla | FARKLI (esik degerleri kaymis) |
| L13-18 | Somut OFF, Gorsel OFF, Sembolik ON | Yok | EKSIK |

---

## 3. KADEMELI IPUCU SISTEMI — KADEME BAZLI DURUM

| Kademe | Adi | Veri Tanimli mi | UI Render Var mi | Oyun Akisinda Aktif mi |
|---|---|---|---|---|
| 0 | Yanlis Yanit Geri Bildirimi | — | Bounce + yanlis sesi VAR | AKTIF |
| 1 | Yonlendirici Soru | 43+ mod icin GUIDING_QUESTIONS | HintManager._getGuidingQuestion() | VERI VAR, UI BAGLANTISI EKSIK |
| 2 | Gorsel Vurgulama | VISUAL_HIGHLIGHTS 20+ mod | HintManager._getVisualHighlight() | VERI VAR, RENDER EKSIK |
| 3 | Kismi Animasyon | PARTIAL_ANIMATIONS 18+ mod | HintManager._getPartialAnimation() | VERI VAR, RENDER EKSIK |
| 4 | Tam Animasyon | Genel aciklama | HintManager._getFullAnimation() | VERI VAR, RENDER EKSIK |
| 5 | Somut Deneyim | Genel aciklama | HintManager._getConcreteExperience() | VERI VAR, RENDER EKSIK |

**Kritik Eksik:** Oyun ekraninda ipucu butonu (`🛸` ikonu) YOK. Kademe gecis mantigi (yanlis → ikon belirir → basildiginda kademe artar) UYGULANMAMIS.

---

## 4. MODUL BAZLI DETAYLI ENVANTER

### Sutun Aciklamalari:
- **DS Mat** = Kullanilan DokunSay Materyalleri (K=Kapsul/Rod, P=Pul/Chip, Y=YildizTasi, C=Cerceve/Frame)
- **Temsil** = Aktif temsil katmanlari (S=Somut, G=Gorsel, Sm=Sembolik)
- **Anim** = Animasyon durumu (D=Data tanimli, R=Render aktif, ✗=Yok)
- **Ipucu** = Ipucu kademeleri (1-5 arasi, hangileri veri olarak tanimli)
- **Metin** = Metin yogunlugu (D=Dusuk/hedef, O=Orta, Y=Yuksek/sorunlu)
- **Drag** = Surukleme etkilesimi var mi

---

### KATEGORI 1: SAYMA (Counting) — 10/10 Mevcut

| # | Mod | Gorev | LT | DS Mat | Temsil | Anim | Ipucu | Metin | Drag | DokunSay Hazirlik |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `counting` | Goktaslarini Say! | L4-6 | P | S(fb) G(nl) | D | 1,2,3 | O | ✗ | %20 — Pul sayma seridi, birebir esleme animasyonu EKSIK |
| 2 | `quantityMatch` | Goktasi Esle! | L4-6 | P | S(fb) G(tf) | D | 1,2 | O | ✗ | %15 — Pul-rakam eslestirme suruklemesi EKSIK |
| 3 | `buildNumber` | Yildiz Taslarini Yerlestir! | L5-7 | P,Y | S(slot) G(tf) | ✗ | 1 | O | KISMI | %30 — Slot bazli yerlestirme var, fizik motoru yok |
| 4 | `backwardCount` | Geri Sayim! | L6-10 | P | S(fb) G(nl) | D | 1,2,3 | O | ✗ | %15 — Pul ucurma animasyonu EKSIK |
| 5 | `counterFromN` | Yorungeden Say! | L8-12 | K,P | S(fb) G(nl) | D | 1,2,3 | O | ✗ | %15 — Kapsul yerlestirme + roket hareketi EKSIK |
| 6 | `decadeCount` | Onluk Gecisi! | L10-14 | K,P | S(fb) G(nl) | D | 1,2 | O | ✗ | %10 — Onluk sinir gecisi animasyonu EKSIK |
| 7 | `skipCount` | Galaktik Ritim! | L8-14 | K | S(fb) G(nl) | D | 1,2,3 | O | ✗ | %15 — Ritmik ziplama + kapsul adim EKSIK |
| 8 | `ordinalCount` | Sira Kesfet! | L6-10 | P | S(fb) G(nl) | ✗ | 1 | O | ✗ | %10 — Sira numarasi eslestirme EKSIK |
| 9 | `conservation` | Yanilsama mi? | L5-8 | P | S(fb) G(tf) | ✗ | 1 | D | ✗ | %15 — Dizilim degistirme animasyonu EKSIK |
| 10 | `matching` | Yildiz Esle! | L4-6 | P,Y | S(fb) G(tf) | ✗ | 1,2 | O | ✗ | %15 — Pul-YildizTasi eslestirme suruklemesi EKSIK |

**Kategori Ozet:** 10/10 modul mevcut. Soru ureticileri calisiyor. Hicbir modulde DokunSay surukle-birak etkilesimi yok. Somut katman sadece feedback'te (fb) gosteriliyor, oyun icinde aktif degil. Sayma seridi + birebir esleme + pul sayma mekaniği tamamen EKSIK.

---

### KATEGORI 2: ANLIK SAYI ALGILAMA / Subitizing — 7/7 Mevcut

| # | Mod | Gorev | LT | DS Mat | Temsil | Anim | Ipucu | Metin | Drag | DokunSay Hazirlik |
|---|---|---|---|---|---|---|---|---|---|---|
| 11 | `subitizing` | Isik Hizi! | L5-7 | P | S(fb) G(dp) | D,R(flash) | 1,2 | D | ✗ | %25 — Flash gosterim VAR, kapsul eslestirme EKSIK |
| 12 | `fivesFrame` | Besli Radar! | L5-7 | P,C | S(fb) G(5f) | D,R(kismi) | 1,2 | D | ✗ | %35 — Frame bileseni VAR, animasyonlu dolum EKSIK |
| 13 | `tensFrame` | Onlu Radar! | L6-8 | P,C | S(fb) G(tf) | D,R(kismi) | 1,2 | D | ✗ | %35 — Frame bileseni VAR, animasyonlu dolum EKSIK |
| 14 | `doubleTensFrame` | Cift Onlu Radar! | L7-10 | P,C | S(fb) G(tf) | D | 1 | D | ✗ | %25 — Cift cerceve render VAR, 10+ stratejisi EKSIK |
| 15 | `chipGuess` | Uzay Hafizasi! | L5-7 | P | S(fb) G(dp) | D,R(gizle) | 1,2 | D | ✗ | %30 — Gizle/goster animasyonu VAR |
| 16 | `rodBack` | Hafiza Simsegi! | L6-9 | K,P,C | S(coklu) G(coklu) | D,R(gecis) | 1,2 | D | ✗ | %45 — EN GELISMIS: Rod, Frame, domino, parmak, zar |
| 17 | `estimateCount` | Galaktik Tahmin! | L7-10 | P | S(fb) G(dp) | ✗ | 1 | D | ✗ | %15 — Referans grup eslestirmesi EKSIK |

**Kategori Ozet:** rodBack (%45) en yuksek DokunSay uyumuna sahip modul. Flash gosterim mekanigi mevcut. Kapsul eslestirme subitizing (flash → kapsul sec → dogrula) tamamen EKSIK.

---

### KATEGORI 3: KARSILASTIRMA VE SIRALAMA — 5/9 Calisiyor, 4 Altyapi

| # | Mod | Gorev | LT | DS Mat | Temsil | Anim | Ipucu | Metin | Drag | DokunSay Hazirlik |
|---|---|---|---|---|---|---|---|---|---|---|
| 18 | `comparison` | Gezegen Duellosu! | L5-8 | K | S(fb) G(bar) | D | 1,2,3 | O | ✗ | %20 — Kapsul karsilastirma platformu EKSIK |
| 19 | `lessMoreEqual` | Kozmik Terazi! | L5-8 | P | S(fb) G(bar) | D | 1,2 | O | ✗ | %10 — Sembol suruklemesi EKSIK |
| 20 | `ordering` | Yorunge Sirala! | L6-10 | K | S(fb) G(nl) | D | 1,2,3 | O | KISMI | %25 — Interaktif surukle VAR, snap/dogrulama EKSIK |
| 21 | `beforeAfter` | Yorunge Komsusunu Bul! | L5-8 | P | S(fb) G(nl) | ✗ | 1 | D | ✗ | %10 |
| 22 | `fiveMore` | 5 Yildiz Skalasi! | L6-10 | K | S(fb) G(nl) | ✗ | 1 | O | ✗ | %15 — Referans kapsul karsilastirmasi EKSIK |
| 23 | `numberLineEstimate` | — | L8-14 | — | — | ✗ | 1 | — | ✗ | %5 — SADECE ipucu verisi |
| 24 | `nlPlacement` | — | L8-14 | — | — | ✗ | 1 | — | ✗ | %5 — SADECE ipucu verisi |
| 25 | `numberLine` | — | L6-12 | — | — | ✗ | 1 | — | ✗ | %5 — SADECE ipucu verisi |
| 26 | `lengthGuess` | — | L6-10 | — | — | ✗ | 1 | — | ✗ | %5 — SADECE ipucu verisi |

**Kategori Ozet:** 4 modul (numberLineEstimate, nlPlacement, numberLine, lengthGuess) hicayesi ve soru ureticisi olmayan ALTYAPI modulleri. Kapsul karsilastirma platformu (hizalama + fark vurgulama + sembol surukle) tamamen EKSIK.

---

### KATEGORI 4: SAYI BILESIMI / Parca-Butun — 6/6 Mevcut

| # | Mod | Gorev | LT | DS Mat | Temsil | Anim | Ipucu | Metin | Drag | DokunSay Hazirlik |
|---|---|---|---|---|---|---|---|---|---|---|
| 27 | `makeFive` | 5 Yildiz Tasi Topla! | L4-6 | P,C | S(fb) G(5f) | D | 1,2,3 | D | ✗ | %30 — Frame var, pul yerlestirme suruklemesi EKSIK |
| 28 | `makeTen` | 10 Yildiz Tasi Topla! | L5-7 | P,C | S(fb) G(tf) | D | 1,2,3 | D | ✗ | %30 — Frame var, 10'a tamamlama suruklemesi EKSIK |
| 29 | `partWhole` | Parca-Butun Puzzle! | L5-8 | P,K | S(fb) G(tf) | D | 1,2,3 | O | KISMI | %25 — Number bond diyagrami EKSIK |
| 30 | `numbersInNumbers` | Sayi Galaksisi! | L6-9 | P | S(fb) G(tf) | D | 1,2 | O | ✗ | %15 — Kesif panosu + kapsul bolme EKSIK |
| 31 | `spaceKitchen` | Interaktif | L5-8 | K,P | S(ozel) G(nr) | ✗ | 1 | O | KISMI | %25 — Ozel slot mantigi var |
| 32 | `rodSplit` | Interaktif | L5-8 | K | S(ozel) G(nr) | ✗ | 1 | O | KISMI | %30 — NumberRod bolme mantigi VAR |

**Kategori Ozet:** rodSplit en yakin DokunSay etkilesimine sahip. Kapsul Atolyesi (ayristirma/birlestirme + gezegen yorungeleri + number bond) tamamen EKSIK. Kesfedilebilir ayristirma paneli (gizli hazineler) EKSIK.

---

### KATEGORI 5: BASAMAK DEGERI — 4/4 Mevcut

| # | Mod | Gorev | LT | DS Mat | Temsil | Anim | Ipucu | Metin | Drag | DokunSay Hazirlik |
|---|---|---|---|---|---|---|---|---|---|---|
| 33 | `bundleTens` | Onluk Nebula! | L7-10 | P,K | S(fb) G(tf) | D | 1,2,3 | O | ✗ | %20 — 10 pul → 1 kapsul donusum animasyonu EKSIK |
| 34 | `expandForm` | Galaktik Acilim! | L8-12 | K | S(fb) G(bar) | D | 1,2 | O | ✗ | %15 — Sayi split → kapsul + pul animasyonu EKSIK |
| 35 | `composeNumber` | Gezegen Olustur! | L7-10 | K,P | S(fb) G(bar) | D | 1,2,3 | O | ✗ | %15 — Basamak tablosu surukle-birak EKSIK |
| 36 | `placeValue` | Katman Kesfet! | L8-14 | K,P | S(fb) G(bar) | D | 1,2 | O | ✗ | %10 |

**Kategori Ozet:** "Enerji Donusturucu" mekanigi (10 pul → spiral → parlama → kapsul) tamamen EKSIK. TenBlock bileseni mevcut ama basamak tablosu surukle-birak arayuzu yok.

---

### KATEGORI 6: TOPLAMA VE CIKARMA — 9/10 Calisiyor, 1 Altyapi

| # | Mod | Gorev | LT | DS Mat | Temsil | Anim | Ipucu | Metin | Drag | DokunSay Hazirlik |
|---|---|---|---|---|---|---|---|---|---|---|
| 37 | `addition` | Gucleri Birlestir! | L4-8 | K | S(fb) G(nl) | D | 1,2,3 | O | ✗ | %15 — Kapsul uc uca ekleme pisti EKSIK |
| 38 | `addChips` | Yildiz Tasi Birlestir! | L4-6 | P | S(chip) G(nl) | D | 1,2 | O | KISMI | %25 — Chip bileseni var, gezegen birlestirme EKSIK |
| 39 | `removeChips` | Yildiz Tasi Ayir! | L4-6 | P | S(chip) G(tf) | D | 1,2 | O | KISMI | %25 — Chip cikarma var, ucurma animasyonu EKSIK |
| 40 | `subtraction` | Enerji Ayir! | L4-8 | K | S(fb) G(nl) | D | 1,2,3 | O | ✗ | %15 — Kapsul ust uste koyma (fark bulma) EKSIK |
| 41 | `countOnAdd` | Buyukten Say! | L5-8 | K,P | S(fb) G(nl) | D | 1,2 | O | ✗ | %10 |
| 42 | `difference` | Fark Bulma | L6-10 | — | — | ✗ | 1 | — | ✗ | %5 — ALTYAPI: hikaye ve soru uretici EKSIK |
| 43 | `inversePractice` | Ters Baglanti! | L6-10 | K | S(fb) G(nl) | D | 1,2 | O | ✗ | %10 — Cift yonlu ok animasyonu EKSIK |
| 44 | `wpAdd` | Toplama Gorevi! | L5-9 | P | S(fb) G(nl) | ✗ | 1,2 | Y | ✗ | %10 — Sozel problem + somut temsil baglantisi EKSIK |
| 45 | `wpSub` | Cikarma Gorevi! | L5-9 | P | S(fb) G(nl) | ✗ | 1,2 | Y | ✗ | %10 |
| 46 | `wpCompare` | Karsilastirma Gorevi! | L6-10 | K | S(fb) G(bar) | ✗ | 1,2 | Y | ✗ | %10 |

**Kategori Ozet:** Toplama pisti (kapsul uc uca ekleme + birlestirme animasyonu) ve cikarma platformu (ust uste koyma + fark vurgulama) tamamen EKSIK. Onluga tamamlama (Make Ten) ozel animasyonu EKSIK. Sozel problem modulleri (wp*) en yuksek metin yogunluguna sahip (Y).

---

### KATEGORI 7: CARPMA VE BOLME — 12/12 Mevcut

| # | Mod | Gorev | LT | DS Mat | Temsil | Anim | Ipucu | Metin | Drag | DokunSay Hazirlik |
|---|---|---|---|---|---|---|---|---|---|---|
| 47 | `repeatAdd` | Galaktik Tekrar! | L2-4 | P | S(fb) G(nl) | D | 1,2,3 | O | ✗ | %10 — Grup bazli pul yerlestirme EKSIK |
| 48 | `skipCount` | Galaktik Ritim! | L3-6 | K | S(fb) G(nl) | D | 1,2 | O | ✗ | %15 — Kapsul adim + roket ziplama EKSIK |
| 49 | `arrayDots` | Yildiz Dizisi! | L4-7 | P | S(dizi) G(bar) | D | 1,2,3 | O | ✗ | %15 — Satir satir pul yerlestirme + dondurme EKSIK |
| 50 | `multiplyVisual` | Carpim Gucu! | L4-7 | P | S(grup) G(bar) | D | 1,2,3 | O | ✗ | %15 — Uzay gemisi + esit grup doldurma EKSIK |
| 51 | `timesTable` | Strateji Ustasi! | L5-9 | P | S(fb) G(nl) | ✗ | 1,2 | O | ✗ | %10 |
| 52 | `katConcept` | Kac Kat? | L4-7 | K | S(fb) G(bar) | ✗ | 1 | O | ✗ | %10 |
| 53 | `halfDouble` | Bolun-Ikilen! | L3-6 | K,P | S(fb) G(bar) | ✗ | 1,2 | O | ✗ | %10 |
| 54 | `divisionBasic` | Bolme Ustasi! | L5-8 | P | S(fb) G(bar) | ✗ | 1 | O | ✗ | %10 |
| 55 | `equalShare` | Galaktik Paylasim! | L3-6 | P | S(fb) G(bar) | D | 1,2,3 | O | ✗ | %10 — Dealing out (birer birer dagitma) EKSIK |
| 56 | `groupCount` | Filo Grupla! | L4-7 | P | S(fb) G(bar) | D | 1,2 | O | ✗ | %10 — Coklu secim gruplama EKSIK |
| 57 | `mulDivInverse` | Ters Baglanti! | L5-9 | P | S(fb) G(bar) | ✗ | 1,2 | O | ✗ | %10 |
| 58 | `wpMul`/`wpDiv` | Carpma/Bolme Gorevi! | L5-9 | P | S(fb) G(bar) | ✗ | 1,2 | Y | ✗ | %10 |

**Kategori Ozet:** En buyuk kategori (12 modul). Uzay gemisi + esit grup doldurma, dizi modeli + 90° dondurme, paylastirma bölme (dealing out) ve gruplama bolme mekanikleri tamamen EKSIK.

---

### KATEGORI 8: ORUNTU VE CEBIRSEL DUSUNME — 5/6 Calisiyor, 1 Altyapi

| # | Mod | Gorev | LT | DS Mat | Temsil | Anim | Ipucu | Metin | Drag | DokunSay Hazirlik |
|---|---|---|---|---|---|---|---|---|---|---|
| 59 | `patternAB` | Galaktik Desen! | L3-5 | K,P | S(desen) G(dp) | D | 1,2,3 | D | ✗ | %15 — Tekrar eden birim secimi + devam ettirme EKSIK |
| 60 | `growingPattern` | Buyuyen Desen! | L4-7 | P | S(desen) G(nl) | D | 1,2,3 | D | ✗ | %15 — Istasyon bazli pul yerlestirme EKSIK |
| 61 | `patternTranslate` | Desen Cevirmen! | L5-8 | K,P | S(desen) G(dp) | D | 1,2 | D | ✗ | %15 — Farkli materyalle ayni yapi kurma EKSIK |
| 62 | `missingNumber` | Kayip Yildiz! | L4-7 | Y | S(fb) G(nl) | D | 1,2,3 | D | ✗ | %10 |
| 63 | `trueFalse` | Denklem Dedektifi! | L4-8 | K | S(fb) G(bar) | ✗ | 1,2 | D | ✗ | %10 |
| 64 | `spaceBalance` | Denklem Dengesi | L5-8 | — | — | ✗ | 1 | — | ✗ | %5 — ALTYAPI: hikaye ve soru uretici EKSIK |

**Kategori Ozet:** Oruntu modullerinde metin yogunlugu en dusuk (D = hedef). Tekrar eden birim secimi (parmakla coklu secim) ve oruntu olusturma (serbest dizme) mekanikleri EKSIK.

---

## 5. GENEL ISTATISTIKLER

### 5.1 Modul Durumu Ozeti

| Durum | Sayi | Yuzde |
|---|---|---|
| TEMEL CALISIYOR (soru uretici + feedback var, DokunSay etkilesimi yok) | 53 | %81.5 |
| ALTYAPI (sadece ipucu verisi, hikaye/soru uretici yok) | 6 | %9.2 |
| IYI (birden fazla temsil formati aktif) | 1 (rodBack) | %1.5 |
| KISMI INTERAKTIF (basit surukle/slot mekanigi var) | 5 | %7.7 |
| **Toplam** | **65** | **%100** |

### 5.2 DokunSay Hazirlik Ortalamasi

| Kategori | Ortalama Hazirlik | En Yuksek | En Dusuk |
|---|---|---|---|
| Sayma | %15 | %30 (buildNumber) | %10 (decadeCount, ordinalCount) |
| Subitizing | %30 | %45 (rodBack) | %15 (estimateCount) |
| Karsilastirma | %12 | %25 (ordering) | %5 (altyapi modulleri) |
| Sayi Bilesimi | %26 | %30 (makeFive, makeTen, rodSplit) | %15 (numbersInNumbers) |
| Basamak Degeri | %15 | %20 (bundleTens) | %10 (placeValue) |
| Toplama/Cikarma | %13 | %25 (addChips, removeChips) | %5 (difference) |
| Carpma/Bolme | %11 | %15 (skipCount, arrayDots, multiplyVisual) | %10 (cogu modul) |
| Oruntu | %12 | %15 (patternAB, growingPattern, patternTranslate) | %5 (spaceBalance) |
| **GENEL ORTALAMA** | **%15** | — | — |

### 5.3 Kritik Eksikler — Oncelik Sirasi

| # | Eksik Sistem | Etki Alani | Oncelik |
|---|---|---|---|
| 1 | **MateryalFizik.js** — Surukleme, snap, birlestirme, bolunme fizik motoru | TUM moduller | KRITIK |
| 2 | **EnerjiKapsulu.jsx** — 10 benzersiz renk, birim bolmeleri, DokunSay kimligi | TUM moduller | KRITIK |
| 3 | **YildizTasi.jsx** — Kristal gorunum, sembolik baglanti | TUM moduller | KRITIK |
| 4 | **Ipucu Butonu + Kademe Gecisi** — Oyun ekraninda tetikleme | TUM moduller | KRITIK |
| 5 | **Faz Gecis Animasyonlari** — Somut → gorsel donusum (800-1000ms) | TUM moduller | YUKSEK |
| 6 | **Katman Senkronizasyonu** — Capraz etkilesim (1 degistir → 2 guncelle) | TUM moduller | YUKSEK |
| 7 | **Sayma Seridi + Birebir Esleme** — Pul → kutucuk animasyonu | Sayma (10 modul) | YUKSEK |
| 8 | **Kapsul Karsilastirma Platformu** — Hizalama + fark vurgulama | Karsilastirma (5 modul) | ORTA |
| 9 | **Toplama Pisti + Cikarma Platformu** — Uc uca ekleme, ust uste koyma | Toplama/Cikarma (10 modul) | ORTA |
| 10 | **Kapsul Atolyesi** — Ayristirma/birlestirme + number bond | Sayi Bilesimi (6 modul) | ORTA |
| 11 | **Enerji Donusturucu** — 10 pul → 1 kapsul donusum | Basamak Degeri (4 modul) | ORTA |
| 12 | **Uzay Gemisi Esit Grup** — Grup doldurma + dealing out | Carpma/Bolme (12 modul) | ORTA |
| 13 | **Akicilik Modu UI** — Uzay Yarisi arayuzu | TUM moduller | DUSUK |
| 14 | **6 Eksik Modul** — Hikaye + soru uretici tamamlama | 6 modul | DUSUK |

---

## 6. MEVCUT BILESEN → DOKUNGSAY ESLEMESI

| Mevcut Bilesen | Dosya | DokunSay Karsiligi | Donusum Gereksinimleri |
|---|---|---|---|
| `Chip.jsx` | components/math/ | **Pul** | Renk sistemi korunur. Sayma sesi, "sayildi" isareti, gruplama, on-cerceveye yerlestirme eklenmeli |
| `GreenChip` | Chip.jsx icinde | **YildizTasi** | Kristal gorunum, isildama efekti, surukle-eslestir mekanigi eklenmeli |
| `NumberRod.jsx` | components/math/ | **EnerjiKapsulu** | 10 benzersiz DokunSay rengi, birlestirme/bolunme fizigi, surukleme eklenmeli |
| `Frame.jsx` | components/math/ | **On-Cerceve / Bes-Cerceve** | Animasyonlu pul yerlestirme (100ms aralik), doluluk animasyonu eklenmeli |
| `TenBlock.jsx` | components/math/ | **Basamak Onluk Blogu** | 10 pul → 1 kapsul donusum animasyonu eklenmeli |
| `LooseChips.jsx` | components/math/ | **Serbest Pullar** | Tam drag-drop fizigi, gruplama, dagitma eklenmeli |
| `TripleCodingLayer.jsx` | components/math/ | **Uclu Kodlama Katmani** | Faz gecis animasyonlari, senkronizasyon, capraz etkilesim eklenmeli |
| — | YOK | **MateryalFizik.js** | SIFIRDAN OLUSTURULMALI |

---

## 7. ONERILEN UYGULAMA SIRASI (DokunSay Donusum Fazlari)

### FAZ 0: DokunSay Kit (Temel — Tum Modullerin Bagimli Oldugu)
1. **MateryalFizik.js** — Surukleme, snap, birlestirme, bolunme fizik motoru
2. **EnerjiKapsulu.jsx** — NumberRod'u 10-renk DokunSay semasina donustur, birlestirme/bolunme ekle
3. **YildizTasi.jsx** — GreenChip'i kristal gorunumlu, suruklenebilir yapiya donustur
4. **Pul.jsx** — Chip'e sayma sesi, "sayildi" isareti, gruplama ozellikleri ekle

### FAZ 1: Uclu Kodlama Altyapisi
5. **KatmanSenkronizasyon.js** — Uc katman arasi senkron guncelleme
6. **TemsılGecisAnimasyon.js** — Somut → gorsel donusum animasyonlari (800-1000ms)
7. **Faz akisi entegrasyonu** — Kesfet/Gor/Adlandir/Bagla akisini oyun dongusune bagla

### FAZ 2: Ipucu Sistemi Render
8. **Ipucu butonu** — Oyun ekranina `🛸` ikonu, kademe gecis mantigi
9. **Kademe 2 render** — Gorsel vurgulama (blink/frame/arrow/enlarge/colorGroup)
10. **Kademe 3-4 render** — Animasyon tetikleme, adim kontrol paneli

### FAZ 3: Kategori Bazli DokunSay Etkilesim Tasarimi
11. **Sayma** — Sayma seridi, birebir esleme, roket hareketi
12. **Subitizing** — Flash + kapsul eslestirme, kavramsal gruplama
13. **Karsilastirma** — Kapsul platformu, sembol surukle, siralama seridi
14. **Sayi Bilesimi** — Kapsul Atolyesi, number bond, kesif panosu
15. **Toplama/Cikarma** — Toplama pisti, cikarma platformu, onluga tamamlama
16. **Carpma/Bolme** — Uzay gemisi gruplama, dizi modeli, paylastirma
17. **Basamak Degeri** — Enerji Donusturucu, basamak tablosu
18. **Oruntu** — Tekrar eden birim secimi, buyuyen desen istasyonlari

### FAZ 4: Akicilik, Ses, Adaptasyon
19. **Akicilik Modu UI** — Uzay Yarisi arayuzu, streak gorseli
20. **Ses katmani** — Sayma sesleri, etkilesim sesleri, materyal sesleri
21. **LT ilerleme** — Katman gecis ve geri dusme kriterleri
22. **Kademe 5 render** — Somut deneyim modu (tam yonlendirmeli surukle-birak)

### FAZ 5: Eksik Moduller
23. **6 eksik modul** — numberLineEstimate, nlPlacement, numberLine, lengthGuess, difference, spaceBalance

---

## 8. DOSYA REFERANSLARI

| Dosya | Amac | Boyut |
|---|---|---|
| `GalakSay.jsx` | Ana oyun bileseni (tum moduller, 23933 satir) | 1.54 MB |
| `src/data/modeStories.js` | 59 modul tanimlari (hikaye, ipucu, strateji) | 102 KB |
| `src/data/learnContent.js` | 7 ogrenme ilerlemesi asamasi | 37 KB |
| `src/data/ltTrajectories.js` | 18 LT yorunge haritalari | 15 KB |
| `src/systems/hintManager.js` | 5 kademeli ipucu sistemi (veri + mantik) | 16 KB |
| `src/systems/animationTemplates.js` | 8 kategori animasyon sablonu (veri) | 24 KB |
| `src/systems/fluencyEngine.js` | Akicilik motoru (oturum, streak, rekor) | 7.4 KB |
| `src/systems/numapProfile.js` | NuMap risk bazli profil yonetimi | 11 KB |
| `src/systems/performanceLogger.js` | 12 noktali performans loglama | 8.2 KB |
| `src/systems/adaptiveEngine.js` | Mikro-uyarlama (frustration, streak, accuracy) | 3.4 KB |
| `src/components/math/TripleCodingLayer.jsx` | Uclu kodlama katmani (faz yonetimi) | 16 KB |
| `src/components/math/Chip.jsx` | Pul bileseni (+ GreenChip) | 3.8 KB |
| `src/components/math/NumberRod.jsx` | Enerji kapsulu yakin karsiligi | 2.5 KB |
| `src/components/math/Frame.jsx` | On-cerceve / bes-cerceve | 2.5 KB |
| `src/components/math/DidacticAnimation.jsx` | Didaktik animasyon motoru | 19 KB |
| `src/audio/tts.js` | Turkce sesli okuma | 6.6 KB |
| `src/audio/sfx.js` | Web Audio API ses efektleri | 9.3 KB |
| `src/i18n/dictionary.js` | 3 dil sozlugu (TR/EN/KU) | 7.8 KB |

---

**Rapor Sonu — 2026-03-18**

Bu envanter, GalakSay v5.3.0'in DokunSay donusum spesifikasyonuna gore detayli gap analizini icerir.
- **Genel DokunSay hazirlik orani: ~%15** (mevcut bilesenler yapisal olarak yakin, etkilesim ve fizik katmani tamamen eksik)
- **En kritik eksik: MateryalFizik.js** — Tum surukle-birak, snap, birlestirme, bolunme mekaniklerinin temeli
- **En hazir modul: rodBack (%45)** — Birden fazla temsil formati aktif
- **6 modul ALTYAPI durumunda** — Hikaye ve soru uretici tamamlanmali
- Uygulama FAZ 0'dan (DokunSay Kit) baslamalidir — tum kategoriler buna bagimlidir.
