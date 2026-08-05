# GalakSay — Öğrenme Yörüngesi Genişleme Yol Haritası

**Tarih:** 2026-06-20 · **Amaç:** GalakSay'i 20 Clements–Sarama yörüngesinin TAMAMINA taşımak.
**İlke:** Sahte/boş kategori YOK. Önce mevcut oyun motorlarını yeniden kullanan yörüngeler (hızlı, çalışan oyun); en son yeni uzamsal mekanik gerektirenler.

## Mevcut durum
GalakSay'de **8 kategori → 7 yörünge** çalışıyor: Sayalon (count), Şimşeron (sub), Terazya (comp), Bileşya (compose), Basamara (basamak = count/compose üst düzey), Toplarya (add), Çarpanya (multdiv), Örünya (pattern). 59 oyun modu, `src/GalakSay.jsx` (~24k satır, bespoke) + `src/data/categories.js` (mod tanımları) + `src/data/ltTrajectories.js` (mod→yörünge düzeyi).

**Kapsanmayan 13 yörünge** (denetim "12" dedi; basamak-değerini ayrı saymıştı): frac · shape2d · comp2d · disembed · shape3d · comp3d · spviz · sporient · mlen · marea · mvol · mang · classif.

## Yeniden kullanılabilir mevcut motorlar (yeni modların tabanı)
| Motor (mevcut mod) | Ne yapar | Genişletilebilir |
|---|---|---|
| `comparison` / `lessMoreEqual` | iki niceliği karşılaştır (büyük/küçük) | kesir, uzunluk, alan, hacim, açı karşılaştırma |
| `ordering` | küçükten büyüğe sırala | kesir sıralama, boy sırası |
| `nlPlacement` / `numberLineEstimate` | sayı doğrusuna yerleştir | 0–1 kesir doğrusu, ölçek, koordinat |
| `subitizing` / `fivesFrame` / `matching` | bir bakışta tanı / eşle | şekil tanıma, şekil eşleme, açı eşleme |
| `estimateCount` / **`lengthGuess`** | tahmin (lengthGuess ZATEN uzunluk görseli kullanır) | uzunluk/alan/hacim tahmini |
| **`arrayDots`** | satır×sütun say | alan (kaplama), 3B dizi (hacim) |
| `partWhole` / `makeTen` / `spaceKitchen` | parça-bütün, hedefe parça ekle | birim kesirden kesir yapma, şekil parçalama |
| `patternAB` / `trueFalse` / `missingNumber` | örüntü, eşitlik, eksik | sınıflama, eşdeğer kesir doğru/yanlış |
| `counting` | tek tek say | kenar/köşe sayma, çetele, yüz sayma |

---

## FAZ 1 — En yüksek yeniden-kullanım (önce bunlar; çoğu mod mevcut motorun çatallanması)

### 🍕 Kesirya — frac (say şeridi, 11 düzey, renk #2E7D32)
| mod (key) | ad | mekanik | motor | ltLevel |
|---|---|---|---|---|
| `fracPartWhole` | Pizza Parçası! | bütünü eş parçaya böl, parçayı tanı | partWhole + **yeni dilim görseli** | 2–5 (Şekil Eş-Parçalayıcı→Kesir Tanıyıcı) |
| `fracNumberLine` | Kesir Yörüngesi! | 0–1 doğrusunda kesir yerleştir | nlPlacement (REUSE) | 5–7 |
| `fracBuild` | Birimlerden Kesir! | birim kesirlerden kesir kur | spaceKitchen/makeTen (REUSE) | 6–8 |
| `fracCompare` | Kesir Düellosu! | iki kesiri karşılaştır/sırala | comparison + ordering (REUSE) | 8–11 |
| `fracArith` (ileri) | Kesir Gücü! | aynı paydalı +/− | addChips görseli (REUSE) | 9–10 |
**Efor:** düşük–orta (tek yeni varlık: dilim/daire kesir görseli).

### 📏 Uzunya — mlen (olcme, 12 düzey, renk #0d9488)
| mod | ad | mekanik | motor | ltLevel |
|---|---|---|---|---|
| `lenCompare` | Uzunluk Düellosu! | iki çubuğu uç hizalayıp karşılaştır | comparison + **lengthGuess görseli (VAR)** | 3–4 |
| `lenOrder` | Boy Sırası! | kısadan uzuna sırala | ordering (REUSE) | 5–7 |
| `lenUnitIterate` | Birim Birim Ölç! | birimi tekrarlayıp uzunluğu bul | counting + lengthGuess | 6–9 |
| `lenEstimate` | Uzunluk Tahmini! | cetvelsiz tahmin et | estimateCount/lengthGuess (REUSE) | 9–12 |
**Efor:** düşük (lengthGuess + comparison + ordering hepsi mevcut).

### 🟩 Alanya — marea (olcme, 8 düzey, renk #0d9488)
| mod | ad | mekanik | motor | ltLevel |
|---|---|---|---|---|
| `areaCompare` | Hangi Alan Büyük? | iki yüzeyi kaplayarak karşılaştır | comparison (REUSE) | 2–4 |
| `areaTile` | Yüzey Kapla! | birim karelerle boşluksuz kapla, say | arrayDots + tenframe doldurma | 3–4 |
| `areaArray` | Satır × Sütun Alan! | alanı satır×sütun yapısıyla bul | **arrayDots (ZATEN dizilim sayar)** | 6–8 |
**Efor:** düşük–orta (arrayDots tabanı hazır).

### 📊 Veriya — classif (veri, 11 düzey, renk #2563eb)
| mod | ad | mekanik | motor | ltLevel |
|---|---|---|---|---|
| `sortAttribute` | Özelliğe Göre Ayır! | renk/şekil/boyuta göre grupla | matching/pattern (REUSE) | 3–5 |
| `multiSort` | Çok Özellikli Ayır! | iki özelliğe göre sınıfla | pattern (REUSE) | 8–10 |
| `tallyChart` | Çetele Tut! | veriyi say + çetele | counting (REUSE) | 6–9 |
| `barGraph` | Grafik Oku! | sütun grafiği oku/karşılaştır | comparison (sütun yük.) + **yeni grafik görseli** | 6–11 |
**Efor:** orta (gruplama/grafik görseli kısmen yeni).

---

## FAZ 2 — Orta yeniden-kullanım (yeni görsel + mevcut mantık)

### 🧪 Hacimya — mvol (olcme, 8 düzey, #0d9488)
- `volCompare` "Hangi Kap Çok Alır?" — kapasite karşılaştır · comparison · L2–4
- `volFill` "Doldur ve Say!" — birim küp/bardakla doldur, say · counting/arrayDots · L4–5
- `volArray3d` "3B Dizi!" — katman×satır×sütun · arrayDots (3B uyarlama, yeni görsel) · L6–8
**Efor:** orta.

### 📐 Açıya — mang (olcme, 6 düzey, #0d9488)
- `angleMatch` "Açı Eşle!" — açıyı eşleştir · matching · L3–4
- `angleCompare` "Açı Düellosu!" — iki açıyı karşılaştır · comparison + **yeni açı (iki ışın) görseli** · L4–5
- `angleMeasure` "Açı Ölç!" — birim/derece ile ölç · nlPlacement/estimate · L6
**Efor:** orta (açı render yeni ama basit; DokunSay-geo'dan ödünç alınabilir).

### 🔺 Şekilya — shape2d (geo, 22 düzey, #7c3aed)
- `shapeMatch` "Şekil Eşle!" — döndürülmüş/boyutlu eşle · matching · L2–4
- `shapeRecognize` "Şekil Radarı!" — tipik şekli tanı · subitizing/matching + **şekil görsel kütüphanesi** · L3–7
- `countSidesCorners` "Kenar-Köşe Say!" — kenar/köşe say · counting · L8–10
- `shapeProperty` "Özellikten Bul!" — özelliğe göre seç · matching/trueFalse · L12–21
**Efor:** orta–yüksek (şekil görselleri **DokunSay-geo `shapes2d.js`'ten** taşınabilir → maliyeti düşürür).

---

## FAZ 3 — Düşük yeniden-kullanım (yeni uzamsal/3B mekanik; en son)
Bunlar sürükle-yerleştir, döndürme, 3B render gibi yeni motor ister. DokunSay-geo (shapes2d/3d, vhLevels) bileşenleri kaynak alınabilir.

| 🧭 Yönya (sporient, 10) | koordinat ızgarası (nlPlacement'in 2B'ye uyarlaması) + harita/rota | orta–yüksek |
| 🔍 Gizliya (disembed, 5) | resimde gömülü şekli dokunarak bul (görsel arama) | orta–yüksek |
| 🧷 Kurarya (comp2d, 11) | tangram: parçaları sürükle-döndür-yerleştir | yüksek |
| 🧊 Cisimya (shape3d, 6) | 3B şekil tanı / yüz say (3B render) | yüksek |
| 🔄 Döndürya (spviz, 7) | kaydır/yansıt/döndür/katla mekaniği | yüksek |
| 🏗️ Yapıron (comp3d, 9) | bloklarla 3B yapı kurma (3B sürükle/istif) | çok yüksek |

---

## Entegrasyon adımları (her yeni mod için)
1. `src/data/categories.js` → yeni `levelN` kategori objesi (name/desc/learnKey/modes) + `CAT_KU` Kürtçe çevirisi.
2. `src/data/ltTrajectories.js` → her mod için `{ trajectory, level, ltLevel, ageRange, desc }` (Clements–Sarama düzey adı + canon sıra no).
3. `src/GalakSay.jsx` → mod oyun mantığı (mevcut bir motoru çatallayarak başla) + render + skor/ipucu.
4. `src/data/modeStories.js` + `learnContent.js` → mod hikâyesi + öğren içeriği.
5. **numap köprüsü:** mod CANLI/çalışır olunca, `numap/public/bop/trajectories.json` ilgili düzeylerine `{k:'GalakSay', a:'...'}` iv-kancası ekle (ÖNCE oyun çalışmalı — kırık yönlendirme olmasın).
6. Test: `npm test` + elle oyna (interaktif oyunlar headless test edilemez → kullanıcı oynamalı).

## Önerilen sıra (değer/efor)
**P1:** Kesirya → Uzunya → Alanya → Veriya (çoğu mevcut motor; en hızlı çalışan oyunlar).
**P2:** Hacimya → Açıya → Şekilya (şekil görselleri DokunSay-geo'dan).
**P3:** Yönya → Gizliya → Kurarya → Cisimya → Döndürya → Yapıron (yeni uzamsal/3B motor).

> Not: GalakSay her modu elle kodlanmış interaktif bir oyundur; bu yol haritası tasarımdır, kod değildir. Modüller tek tek (oturum başına ~1–2) inşa edilip kullanıcı tarafından oynanarak doğrulanmalıdır.
