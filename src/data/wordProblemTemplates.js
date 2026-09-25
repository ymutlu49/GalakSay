// ═══════════════════════════════════════════════════════════════════════════════
// SÖZEL PROBLEM SİSTEMİ — Problem Türü Sınıflandırması
// Carpenter, Fennema, Franke, Levi & Empson (2015) temelli
// MEB 2024: MAT.1.2.1, MAT.2.2.1, MAT.3.2.6, MAT.3.2.7
// ═══════════════════════════════════════════════════════════════════════════════

import { numWord, numDist, trG, trD, trK, trDA, capFirst, WP_pick, WP_name, WP_pair } from './numWords.js';

// ─── Problem Şablonları ─────────────────────────────────────────────────
// Her şablon: { cgiType, cgiSub, text(a,b,c,names), answer(a,b,c), operation, icon, theme }
// a=büyük sayı veya başlangıç, b=küçük sayı veya değişim, c=sonuç (hesaplanır)
export const WORD_PROBLEM_TEMPLATES = {

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. BİRLEŞTİRME (JOIN) — Bir gruba ekleme eylemi
  // ═══════════════════════════════════════════════════════════════════════════
  joinResultUnknown: [
    { text: (a,b,_,n,nw) => `${trG(n[0])} sepetinde ${nw(a)} elma vardı. Ağaçtan ${nw(b)} tane daha topladı. Şimdi sepetinde kaç elma var?`,
      icon: "🍎", theme: "meyve", obj: "elma" },
    { text: (a,b,_,n,nw) => `Bahçede ${nw(a)} lale açmıştı. ${n[0]} ${nw(b)} tane daha dikince bahçede kaç lale oldu?`,
      icon: "🌷", theme: "bahçe", obj: "lale" },
    { text: (a,b,_,n,nw) => `Otobüste ${nw(a)} yolcu vardı. Duraktan ${nw(b)} kişi daha bindi. Şimdi otobüste kaç yolcu var?`,
      icon: "🚌", theme: "ulaşım", obj: "yolcu" },
    { text: (a,b,_,n,nw) => `${trG(n[0])} ${nw(a)} çıkartması vardı. ${n[1]} ona ${nw(b)} tane daha hediye edince kaç çıkartması oldu?`,
      icon: "⭐", theme: "oyun", obj: "çıkartma" },
    { text: (a,b,_,n,nw) => `Gölde ${nw(a)} ördek yüzüyordu. Yanlarına ${nw(b)} ördek daha geldi. Şimdi gölde kaç ördek var?`,
      icon: "🦆", theme: "hayvan", obj: "ördek" },
    { text: (a,b,_,n,nw) => `${n[0]} pikniğe ${nw(a)} poğaça, ${n[1]} ${trDA(n[1])} ${nw(b)} poğaça getirdi. Toplam kaç poğaça oldu?`,
      icon: "🥐", theme: "yiyecek", obj: "poğaça" },
  ],
  joinChangeUnknown: [
    { text: (a,_,c,n,nw) => `${trG(n[0])} ${nw(a)} kalemi vardı. ${n[1]} ona birkaç kalem daha verdi. Sayınca ${nw(c)} kalem olduğunu gördü. ${n[1]} kaç kalem vermiş?`,
      icon: "✏️", theme: "okul", obj: "kalem" },
    { text: (a,_,c,n,nw) => `Parkta ${nw(a)} çocuk oynuyordu. Yanlarına başka çocuklar da katıldı ve ${nw(c)} çocuk oldu. Kaç çocuk daha gelmiş?`,
      icon: "🏃", theme: "park", obj: "çocuk" },
    { text: (a,_,c,n,nw) => `Akvaryumda ${nw(a)} balık vardı. Birkaç tane daha konulunca ${nw(c)} oldu. Kaç balık eklenmiş?`,
      icon: "🐟", theme: "hayvan", obj: "balık" },
    { text: (a,_,c,n,nw) => `${trG(n[0])} tabağında ${nw(a)} kurabiye vardı. Annesi biraz daha koydu. Sayınca ${nw(c)} kurabiye olduğunu gördü. Annesi kaç tane koymuş?`,
      icon: "🍪", theme: "yiyecek", obj: "kurabiye" },
  ],
  joinStartUnknown: [
    { text: (_,b,c,n,nw) => `${trG(n[0])} birkaç cevizi vardı. ${n[1]} ona ${nw(b)} ceviz daha verince toplam ${nw(c)} oldu. Başta kaç cevizi varmış?`,
      icon: "🥜", theme: "yiyecek", obj: "ceviz" },
    { text: (_,b,c,n,nw) => `Ağaçta birkaç kuş konmuştu. Sonra ${nw(b)} kuş daha geldi ve toplam ${nw(c)} oldu. Başta ağaçta kaç kuş varmış?`,
      icon: "🐦", theme: "hayvan", obj: "kuş" },
    { text: (_,b,c,n,nw) => `${trG(n[0])} kutusunda birkaç boya kalemi vardı. Sonra ${nw(b)} tane daha alınca toplam ${nw(c)} oldu. Başta kutuda kaç boya kalemi varmış?`,
      icon: "🖍️", theme: "okul", obj: "boya kalemi" },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. AYIRMA (SEPARATE) — Bir gruptan çıkarma eylemi
  // ═══════════════════════════════════════════════════════════════════════════
  separateResultUnknown: [
    { text: (a,b,_,n,nw) => `${trG(n[0])} ${nw(a)} balonu vardı. Bunların ${nw(b)} tanesi patladı. Geriye kaç balon kaldı?`,
      icon: "🎈", theme: "parti", obj: "balon" },
    { text: (a,b,_,n,nw) => `Masada ${nw(a)} dilim pasta vardı. Çocuklar ${nw(b)} dilim yedi. Masada kaç dilim kaldı?`,
      icon: "🍰", theme: "yiyecek", obj: "pasta" },
    { text: (a,b,_,n,nw) => `Sınıfta ${nw(a)} öğrenci vardı. Teneffüste ${nw(b)} öğrenci bahçeye çıktı. Sınıfta kaç öğrenci kaldı?`,
      icon: "🏫", theme: "okul", obj: "öğrenci" },
    { text: (a,b,_,n,nw) => `${trG(n[0])} ${nw(a)} bilyesi vardı. Bunların ${nw(b)} tanesini ${trD(n[1])} verdi. Kaç bilyesi kaldı?`,
      icon: "🔮", theme: "oyun", obj: "bilye" },
    { text: (a,b,_,n,nw) => `Rafta ${nw(a)} kitap vardı. ${n[0]} ${nw(b)} tanesini okumak için aldı. Rafta kaç kitap kaldı?`,
      icon: "📚", theme: "okul", obj: "kitap" },
  ],
  separateChangeUnknown: [
    { text: (a,_,c,n,nw) => `${trG(n[0])} ${nw(a)} çileği vardı. Birkaçını yedi. Geriye ${nw(c)} çilek kaldı. Kaç çilek yemiş?`,
      icon: "🍓", theme: "meyve", obj: "çilek" },
    { text: (a,_,c,n,nw) => `Kümeste ${nw(a)} tavuk vardı. Bazıları bahçeye çıktı. Kümeste ${nw(c)} tavuk kaldı. Kaç tavuk bahçeye çıkmış?`,
      icon: "🐔", theme: "hayvan", obj: "tavuk" },
    { text: (a,_,c,n,nw) => `${trG(n[0])} ${nw(a)} tokası vardı. Birkaçını ${trD(n[1])} verdi. Geriye ${nw(c)} toka kaldı. Kaç toka vermiş?`,
      icon: "🎀", theme: "oyun", obj: "toka" },
  ],
  separateStartUnknown: [
    { text: (_,b,c,n,nw) => `${trG(n[0])} birkaç şekeri vardı. ${trD(n[1])} ${nw(b)} tane verdi. Elinde ${nw(c)} şeker kaldı. Başta kaç şekeri varmış?`,
      icon: "🍬", theme: "yiyecek", obj: "şeker" },
    { text: (_,b,c,n,nw) => `Kutuda birkaç top vardı. ${n[0]} ${nw(b)} tanesini çıkardı. Kutuda ${nw(c)} top kaldı. Başta kutuda kaç top varmış?`,
      icon: "⚽", theme: "oyun", obj: "top" },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. PARÇA-BÜTÜN (PART-PART-WHOLE) — Eylem yok, ilişki var
  // ═══════════════════════════════════════════════════════════════════════════
  ppwWholeUnknown: [
    { text: (a,b,_,n,nw) => `${trG(n[0])} ${nw(a)} kırmızı, ${nw(b)} ${trDA(nw(b))} mavi bilyesi var. Toplam kaç bilyesi var?`,
      icon: "🔮", theme: "oyun", obj: "bilye" },
    { text: (a,b,_,n,nw) => `Bahçede ${nw(a)} kedi ve ${nw(b)} köpek dolaşıyor. Bahçede toplam kaç hayvan var?`,
      icon: "🐱", theme: "hayvan", obj: "hayvan" },
    { text: (a,b,_,n,nw) => `Tabakta ${nw(a)} portakal, ${nw(b)} ${trDA(nw(b))} mandalina var. Tabakta toplam kaç meyve var?`,
      icon: "🍊", theme: "meyve", obj: "meyve" },
    { text: (a,b,_,n,nw) => `Sınıfta ${nw(a)} kız, ${nw(b)} ${trDA(nw(b))} erkek öğrenci var. Sınıfta toplam kaç öğrenci var?`,
      icon: "🏫", theme: "okul", obj: "öğrenci" },
    { text: (a,b,_,n,nw) => `${trG(n[0])} ${nw(a)} lirası, ${trG(n[1])} ${trDA(n[1])} ${nw(b)} lirası var. Paraları toplam kaç lira eder?`,
      icon: "💰", theme: "para", obj: "lira" },
  ],
  ppwPartUnknown: [
    { text: (a,_,c,n,nw) => `${trG(n[0])} toplam ${nw(c)} topu var. Bunların ${nw(a)} tanesi kırmızı, geri kalanı mavi. Kaç tanesi mavi?`,
      icon: "🏀", theme: "oyun", obj: "top" },
    { text: (a,_,c,n,nw) => `Çiftlikte toplam ${nw(c)} hayvan var. Bunların ${nw(a)} tanesi inek, geri kalanı koyun. Kaç koyun var?`,
      icon: "🐄", theme: "hayvan", obj: "koyun" },
    { text: (a,_,c,n,nw) => `${n[0]} toplam ${nw(c)} çıkartma biriktirmiş. Bunların ${nw(a)} tanesi yıldız, geri kalanı kalp şeklinde. Kaç kalp çıkartma var?`,
      icon: "💖", theme: "oyun", obj: "çıkartma" },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. KARŞILAŞTIRMA (COMPARE) — İki çokluk arasındaki ilişki
  // ═══════════════════════════════════════════════════════════════════════════
  compareDiffUnknown: [
    { text: (a,b,_,n,nw) => `${trG(n[0])} ${nw(a)} kalemi, ${trG(n[1])} ise ${nw(b)} kalemi var. ${n[0]} kaç kalem daha fazla?`,
      icon: "✏️", theme: "okul", obj: "kalem" },
    { text: (a,b,_,n,nw) => `Birinci sınıfta ${nw(a)}, ikinci sınıfta ${nw(b)} öğrenci var. Birinci sınıfta kaç öğrenci daha fazla?`,
      icon: "🏫", theme: "okul", obj: "öğrenci" },
    { text: (a,b,_,n,nw) => `${n[0]} ${nw(a)} sayfa, ${n[1]} ise ${nw(b)} sayfa okumuş. ${n[0]} kaç sayfa daha fazla okumuş?`,
      icon: "📖", theme: "okul", obj: "sayfa" },
    { text: (a,b,_,n,nw) => `${trG(n[0])} ${nw(a)} elması, ${trG(n[1])} ise ${nw(b)} elması var. Aradaki fark kaç?`,
      icon: "🍎", theme: "meyve", obj: "elma" },
    { text: (a,b,_,n,nw) => `Kırmızı kutuda ${nw(a)}, mavi kutuda ${nw(b)} top var. Kırmızı kutuda kaç top daha fazla?`,
      icon: "📦", theme: "oyun", obj: "top" },
  ],
  compareQuantityUnknown: [
    { text: (a,b,_,n,nw) => `${trG(n[0])} ${nw(a)} bilyesi var. ${trG(n[1])} ondan ${nw(b)} tane daha fazla bilyesi var. ${trG(n[1])} kaç bilyesi var?`,
      icon: "🔮", theme: "oyun", obj: "bilye" },
    { text: (a,b,_,n,nw) => `Kırmızı kutuda ${nw(a)} top var. Mavi kutuda ise bundan ${nw(b)} top daha fazla var. Mavi kutuda kaç top var?`,
      icon: "📦", theme: "oyun", obj: "top" },
    { text: (a,b,_,n,nw) => `${n[0]} ${nw(a)} kart toplamış. ${n[1]} ondan ${nw(b)} tane daha fazla toplamış. ${trG(n[1])} kaç kartı var?`,
      icon: "🃏", theme: "oyun", obj: "kart" },
    { text: (a,b,_,n,nw) => `Bahçede ${nw(a)} gül açmış. Komşu bahçede bundan ${nw(b)} tane daha çok gül var. Komşu bahçede kaç gül var?`,
      icon: "🌹", theme: "bahçe", obj: "gül" },
  ],
  compareReferentUnknown: [
    { text: (_,b,c,n,nw) => `${trG(n[0])} ${nw(c)} çıkartması var. Bu, ${trK(n[1])} ${nw(b)} tane daha fazla. ${trG(n[1])} kaç çıkartması var?`,
      icon: "⭐", theme: "oyun", obj: "çıkartma" },
    { text: (_,b,c,n,nw) => `Büyük ağaçta ${nw(c)} elma var. Bu, küçük ağaçtakinden ${nw(b)} tane daha fazla. Küçük ağaçta kaç elma var?`,
      icon: "🍎", theme: "meyve", obj: "elma" },
    { text: (_,b,c,n,nw) => `${n[0]} ${nw(c)} gol atmış. Bu, ${trK(n[1])} ${nw(b)} gol daha fazla. ${n[1]} kaç gol atmış?`,
      icon: "⚽", theme: "spor", obj: "gol" },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. ÇARPMA — Eşit gruplar
  // ═══════════════════════════════════════════════════════════════════════════
  multiplyProductUnknown: [
    { text: (a,b,_,n,nw) => `${n[0]} ${nw(a)} tabağa ${numDist(b)} kurabiye koydu. Toplam kaç kurabiye var?`,
      icon: "🍪", theme: "yiyecek", obj: "kurabiye" },
    { text: (a,b,_,n,nw) => `Otoparkta ${nw(a)} sıra var. Her sırada ${nw(b)} araba duruyor. Toplam kaç araba var?`,
      icon: "🚗", theme: "ulaşım", obj: "araba" },
    { text: (a,b,_,n,nw) => `${n[0]} her gün ${nw(b)} sayfa okuyor. ${capFirst(nw(a))} günde toplam kaç sayfa okumuş olur?`,
      icon: "📖", theme: "okul", obj: "sayfa" },
  ],
  multiplyGroupSizeUnknown: [
    { text: (a,_,c,n,nw) => `${capFirst(nw(c))} şekeri ${nw(a)} çocuk aralarında eşit paylaşıyor. Her çocuğa kaçar tane düşer?`,
      icon: "🍬", theme: "yiyecek", obj: "şeker" },
    { text: (a,_,c,n,nw) => `${n[0]} ${nw(c)} fotoğrafı ${nw(a)} albüme eşit olarak dağıttı. Her albümde kaç fotoğraf var?`,
      icon: "📷", theme: "okul", obj: "fotoğraf" },
    { text: (a,_,c,n,nw) => `${capFirst(nw(c))} kalem ${nw(a)} kalemliğe eşit olarak dağıtıldı. Her kalemlikte kaç kalem var?`,
      icon: "✏️", theme: "okul", obj: "kalem" },
  ],
  multiplyNumGroupsUnknown: [
    { text: (_,b,c,n,nw) => `${trG(n[0])} ${nw(c)} bilyesi var. Her torbaya ${nw(b)} tane koyarsa kaç torba doldurur?`,
      icon: "🔮", theme: "oyun", obj: "bilye" },
    { text: (_,b,c,n,nw) => `Fırında ${nw(c)} ekmek pişti. Her rafa ${nw(b)} tane yerleştiriliyor. Kaç raf gerekir?`,
      icon: "🍞", theme: "yiyecek", obj: "ekmek" },
    { text: (_,b,c,n,nw) => `${capFirst(nw(c))} çiçek var. Her vazoya ${numDist(b)} tane konulacak. Kaç vazo gerekir?`,
      icon: "🌸", theme: "bahçe", obj: "çiçek" },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. ÇARPIMSAL KARŞILAŞTIRMA
  // ═══════════════════════════════════════════════════════════════════════════
  multCompareProductUnknown: [
    { text: (a,b,_,n,nw) => `${trG(n[0])} ${nw(a)} bilyesi var. ${trG(n[1])} bilyesi onun ${nw(b)} katı kadar. ${trG(n[1])} kaç bilyesi var?`,
      icon: "🔮", theme: "oyun", obj: "bilye" },
    { text: (a,b,_,n,nw) => `Küçük ağaçta ${nw(a)} elma var. Büyük ağaçtaki elma sayısı bunun ${nw(b)} katı. Büyük ağaçta kaç elma var?`,
      icon: "🍎", theme: "meyve", obj: "elma" },
  ],
};

// ─── Tür → İşlem Eşlemesi ──────────────────────────────────────────────
export const CGI_TYPE_INFO = {
  joinResultUnknown:      { op: "+", find: "result", diff: 1, sinif: [1,2,3], kod: "MAT.1.2.1" },
  joinChangeUnknown:      { op: "+", find: "change", diff: 2, sinif: [1,2,3], kod: "MAT.1.2.1" },
  joinStartUnknown:       { op: "+", find: "start",  diff: 3, sinif: [2,3],   kod: "MAT.2.2.1" },
  separateResultUnknown:  { op: "−", find: "result", diff: 1, sinif: [1,2,3], kod: "MAT.1.2.1" },
  separateChangeUnknown:  { op: "−", find: "change", diff: 2, sinif: [1,2,3], kod: "MAT.1.2.1" },
  separateStartUnknown:   { op: "−", find: "start",  diff: 3, sinif: [2,3],   kod: "MAT.2.2.1" },
  ppwWholeUnknown:        { op: "+", find: "whole",  diff: 1, sinif: [1,2,3], kod: "MAT.1.2.3" },
  ppwPartUnknown:         { op: "−", find: "part",   diff: 2, sinif: [1,2,3], kod: "MAT.1.2.3" },
  compareDiffUnknown:     { op: "−", find: "diff",   diff: 2, sinif: [1,2,3], kod: "MAT.1.2.4" },
  compareQuantityUnknown: { op: "+", find: "bigger", diff: 2, sinif: [1,2,3], kod: "MAT.1.2.4" },
  compareQuantityUnknownLess: { op: "−", find: "result", diff: 2, sinif: [1,2,3], kod: "MAT.1.2.4" }, // a − b (daha az) — GalakSay.jsx CGI_TYPE_INFO ile aynı
  compareReferentUnknown: { op: "−", find: "smaller",diff: 3, sinif: [2,3],   kod: "MAT.2.2.1" },
  multiplyProductUnknown: { op: "×", find: "product",diff: 1, sinif: [2,3],   kod: "MAT.2.2.4" },
  multiplyGroupSizeUnknown:{op: "÷", find: "size",   diff: 2, sinif: [2,3],   kod: "MAT.2.2.4" },
  multiplyNumGroupsUnknown:{op: "÷", find: "groups", diff: 3, sinif: [2,3],   kod: "MAT.2.2.4" },
  multCompareProductUnknown:{op: "×",find: "product",diff: 2, sinif: [3],     kod: "MAT.3.2.6" },
};

// (TR generateWordProblem bu dosyadan KALDIRILDI - uygulama GalakSay.jsx icindeki yerel surumu kullaniyor;
//  buradaki kopya import edilmiyordu ve mulCap/allowedCgiTypes acisindan bayatlamisti.)

// ─── Problem Türü Açıklamaları ────────────────────
export const CGI_LABELS_TR = {
  joinResultUnknown:      "Birleştirme — Sonuç Bilinmiyor",
  joinChangeUnknown:      "Birleştirme — Değişim Bilinmiyor",
  joinStartUnknown:       "Birleştirme — Başlangıç Bilinmiyor",
  separateResultUnknown:  "Ayırma — Sonuç Bilinmiyor",
  separateChangeUnknown:  "Ayırma — Değişim Bilinmiyor",
  separateStartUnknown:   "Ayırma — Başlangıç Bilinmiyor",
  ppwWholeUnknown:        "Parça-Bütün — Bütün Bilinmiyor",
  ppwPartUnknown:         "Parça-Bütün — Parça Bilinmiyor",
  compareDiffUnknown:     "Karşılaştırma — Fark Bilinmiyor",
  compareQuantityUnknown: "Karşılaştırma — Çokluk Bilinmiyor",
  compareQuantityUnknownLess: "Karşılaştırma — Çokluk Bilinmiyor (daha az)",
  compareReferentUnknown: "Karşılaştırma — Referans Bilinmiyor",
  multiplyProductUnknown: "Eşit Gruplar — Çarpım Bilinmiyor",
  multiplyGroupSizeUnknown:"Eşit Paylaşma — Grup Büyüklüğü Bilinmiyor",
  multiplyNumGroupsUnknown:"Ölçme Bölmesi — Grup Sayısı Bilinmiyor",
  multCompareProductUnknown:"Çarpımsal Karşılaştırma — Çarpım Bilinmiyor",
};

// ═══════════════════════════════════════════════════════════════════════════
// KÜRTÇE SÖZEL PROBLEM ETİKETLERİ
// Referans: Ferhenga Matematikê — KIRARÎ bölümü
// Terminoloji: zêdekirin (toplama), kemkirin (çıkarma), carkirin (çarpma), parkirin (bölme)
// ═══════════════════════════════════════════════════════════════════════════
export const CGI_LABELS_KU = {
  joinResultUnknown:      "Yekbûn — Encam Nediyar",
  joinChangeUnknown:      "Yekbûn — Guhêztin Nediyar",
  joinStartUnknown:       "Yekbûn — Destpêk Nediyar",
  separateResultUnknown:  "Veqetandin — Encam Nediyar",
  separateChangeUnknown:  "Veqetandin — Guhêztin Nediyar",
  separateStartUnknown:   "Veqetandin — Destpêk Nediyar",
  ppwWholeUnknown:        "Parçe-Giştî — Giştî Nediyar",
  ppwPartUnknown:         "Parçe-Giştî — Parçe Nediyar",
  compareDiffUnknown:     "Berhevkirin — Ferq Nediyar",
  compareQuantityUnknown: "Berhevkirin — Çendînî Nediyar",
  compareQuantityUnknownLess: "Berhevkirin — Çendînî Nediyar (kêmtir)",
  compareReferentUnknown: "Berhevkirin — Referans Nediyar",
  multiplyProductUnknown: "Komên Wekhev — Carandok Nediyar",
  multiplyGroupSizeUnknown:"Parkirina Wekhev — Mezinahiya Komê Nediyar",
  multiplyNumGroupsUnknown:"Pîvandina Parkirinê — Jimara Koman Nediyar",
  multCompareProductUnknown:"Berhevkirina Carkirinê — Carandok Nediyar",
};

// ═══ KÜRTÇE SÖZEL PROBLEM ŞABLONLARI ═══════════════════════════════════
// Kürtçe çocuk isimleri ve bağlamları
import { numWordKu, WP_NAMES_KU, WP_pairKu } from './numWords.js';
const _wpPickKu = arr => arr[Math.floor(Math.random() * arr.length)];

export const WORD_PROBLEM_TEMPLATES_KU = {
  joinResultUnknown: [
    { text: (a,b,_,n,nw) => `Di selika ${n[0]} de ${nw(a)} sêv hebûn. Wî/wê ji darê ${nw(b)} sêvên din jî çinin. Niha di selika wî/wê de çend sêv hene?`,
      icon: "🍎", theme: "fêkî", obj: "sêv" },
    { text: (a,b,_,n,nw) => `Di baxçê de ${nw(a)} gulên sor vekirîbûn. ${n[0]} ${nw(b)} gulên din jî çandin. Niha di baxçê de çend gul hene?`,
      icon: "🌷", theme: "baxçe", obj: "gul" },
    { text: (a,b,_,n,nw) => `Di otobusê de ${nw(a)} rêwî hebûn. Ji rawestgehê ${nw(b)} kesên din jî siwar bûn. Niha di otobusê de çend rêwî hene?`,
      icon: "🚌", theme: "veguheztin", obj: "rêwî" },
    { text: (a,b,_,n,nw) => `${n[0]} ${nw(a)} kevirên stêrkan yên wî/wê hebûn. ${n[1]} ${nw(b)} hên din jî diyarî kirin. Niha çend kevirên stêrkan yên wî/wê hene?`,
      icon: "⭐", theme: "lîstik", obj: "kevirê stêrkan" },
    { text: (a,b,_,n,nw) => `Li golê ${nw(a)} ordek avjenî dikirin. ${nw(b)} ordekên din jî hatin. Niha li golê çend ordek hene?`,
      icon: "🦆", theme: "ajal", obj: "ordek" },
  ],
  joinChangeUnknown: [
    { text: (a,_,c,n,nw) => `${n[0]} ${nw(a)} qelemên wî/wê hebûn. ${n[1]} çend qelemên din jî dan wî/wê. Dema jimartine ${nw(c)} qelem bûn. ${n[1]} çend qelem dabûn?`,
      icon: "✏️", theme: "dibistan", obj: "qelem" },
    { text: (a,_,c,n,nw) => `Li parkê ${nw(a)} zarok dilîstin. Zarokên din jî tevlî bûn û ${nw(c)} zarok bûn. Çend zarokên din hatibûn?`,
      icon: "🏃", theme: "park", obj: "zarok" },
  ],
  joinStartUnknown: [
    { text: (_,b,c,n,nw) => `${n[0]} çend gûzan hebûn. ${n[1]} ${nw(b)} gûzên din jî dan wî/wê û giştî ${nw(c)} bûn. Di destpêkê de çend gûzên wî/wê hebûn?`,
      icon: "🥜", theme: "xwarin", obj: "gûz" },
    { text: (_,b,c,n,nw) => `Li ser darê çend çivîk rûniştibûn. Paşê ${nw(b)} çivîkên din jî hatin û giştî ${nw(c)} bûn. Di destpêkê de li ser darê çend çivîk hebûn?`,
      icon: "🐦", theme: "ajal", obj: "çivîk" },
  ],
  separateResultUnknown: [
    { text: (a,b,_,n,nw) => `${n[0]} ${nw(a)} balonên wî/wê hebûn. Ji wan ${nw(b)} heb teqiyan. Çend balon man?`,
      icon: "🎈", theme: "şahî", obj: "balon" },
    { text: (a,b,_,n,nw) => `Li ser masê ${nw(a)} parçeyên kekê hebûn. Zarokan ${nw(b)} parçe xwarin. Li ser masê çend parçe man?`,
      icon: "🍰", theme: "xwarin", obj: "kek" },
    { text: (a,b,_,n,nw) => `Di polê de ${nw(a)} xwendekar hebûn. Di bêhnvedanê de ${nw(b)} xwendekar derketin baxçê. Di polê de çend xwendekar man?`,
      icon: "🏫", theme: "dibistan", obj: "xwendekar" },
  ],
  separateChangeUnknown: [
    { text: (a,_,c,n,nw) => `${n[0]} ${nw(a)} gûzên wî/wê hebûn. Hin ji wan xwar. Niha ${nw(c)} gûz mane. Çend gûz xwaribûn?`,
      icon: "🥜", theme: "xwarin", obj: "gûz" },
  ],
  separateStartUnknown: [
    { text: (_,b,c,n,nw) => `${n[0]} çend şêraniyên wî/wê hebûn. ${nw(b)} heb dan ${n[1]}. Niha ${nw(c)} şêranî mane. Di destpêkê de çend şêranî hebûn?`,
      icon: "🍬", theme: "xwarin", obj: "şêranî" },
  ],
  ppwWholeUnknown: [
    { text: (a,b,_,n,nw) => `${n[0]} ${nw(a)} sêvên sor û ${nw(b)} sêvên kesk hene. Giştî çend sêv hene?`,
      icon: "🍎", theme: "fêkî", obj: "sêv" },
    { text: (a,b,_,n,nw) => `Di qutiyê de ${nw(a)} qelemên şîn û ${nw(b)} qelemên sor hene. Giştî çend qelem hene?`,
      icon: "✏️", theme: "dibistan", obj: "qelem" },
  ],
  ppwPartUnknown: [
    { text: (a,_,c,n,nw) => `${n[0]} giştî ${nw(c)} topên wî/wê hene. ${nw(a)} heb kesk in. Çend heb ne kesk in?`,
      icon: "⚽", theme: "lîstik", obj: "top" },
  ],
  compareDiffUnknown: [
    { text: (a,b,_,n,nw) => `${n[0]} ${nw(a)} pirtûk xwendine. ${n[1]} ${nw(b)} pirtûk xwendine. ${n[0]} çend pirtûkên zêdetir xwendine?`,
      icon: "📚", theme: "dibistan", obj: "pirtûk" },
  ],
  compareQuantityUnknown: [
    { text: (a,b,_,n,nw) => `${n[0]} ${nw(a)} fîgurên wî/wê hene. ${n[1]} ${nw(b)} hên zêdetir hene. ${n[1]} çend fîgurên wî/wê hene?`,
      icon: "🧸", theme: "lîstik", obj: "fîgur" },
  ],
  // "kêmtir" varyantı — TR compareQuantityUnknownLess ile aynı yapı: cevap a − b
  compareQuantityUnknownLess: [
    { text: (a,b,_,n,nw) => `Di qutiya sor de ${nw(a)} top hene. Di qutiya şîn de ji wê ${nw(b)} top kêmtir hene. Di qutiya şîn de çend top hene?`,
      icon: "📦", theme: "lîstik", obj: "top" },
    { text: (a,b,_,n,nw) => `${n[0]} ${nw(a)} stîkerên wî/wê hene. Stîkerên ${n[1]} ji wan ${nw(b)} heb kêmtir in. ${n[1]} çend stîkerên wî/wê hene?`,
      icon: "⭐", theme: "lîstik", obj: "stîker" },
  ],
  compareReferentUnknown: [
    { text: (_,b,c,n,nw) => `${n[0]} ${nw(c)} kevirên stêrkan yên wî/wê hene. Ew ji yên ${n[1]} ${nw(b)} heb zêdetir e. ${n[1]} çend kevirên stêrkan yên wî/wê hene?`,
      icon: "⭐", theme: "lîstik", obj: "kevirê stêrkan" },
  ],
  multiplyProductUnknown: [
    { text: (a,b,_,n,nw) => `${nw(a)} teşt hene û di her teştê de ${nw(b)} kurabiye hene. Giştî çend kurabiye hene?`,
      icon: "🍪", theme: "xwarin", obj: "kurabiye" },
    { text: (a,b,_,n,nw) => `${n[0]} ${nw(a)} pakêt hene. Di her pakêtê de ${nw(b)} şêranî hene. Giştî çend şêranî hene?`,
      icon: "🍬", theme: "xwarin", obj: "şêranî" },
  ],
  multiplyGroupSizeUnknown: [
    { text: (a,b,_,n,nw) => `${nw(a*b)} şêranî hene û li ${nw(a)} zarokan wekhev tên parkirin. Her zarokê çend şêranî digire?`,
      icon: "🍬", theme: "xwarin", obj: "şêranî" },
  ],
  multiplyNumGroupsUnknown: [
    { text: (a,b,_,n,nw) => `${nw(a*b)} sêv hene. Di her selkê de ${nw(b)} sêv hene. Çend selik hene?`,
      icon: "🍎", theme: "fêkî", obj: "sêv" },
  ],
  multCompareProductUnknown: [
    { text: (a,b,_,n,nw) => `${n[0]} ${nw(b)} kevirên stêrkan yên wî/wê hene. ${n[1]} ${nw(a)} carê zêdetir hene. ${n[1]} çend kevirên stêrkan yên wî/wê hene?`,
      icon: "⭐", theme: "lîstik", obj: "kevirê stêrkan" },
  ],
};

// ═══ KÜRTÇE SÖZEL PROBLEM ÜRETİCİSİ ═══════════════════════════════════
export function generateWordProblemKu(level, maxNum, allowedOps = ["+","−"], allowedCgiTypes = null) {
  const maxDiff = level <= 2 ? 1 : level <= 4 ? 2 : 3;
  const R = (min,max) => Math.floor(Math.random()*(max-min+1))+min;

  const eligible = Object.entries(CGI_TYPE_INFO).filter(([type, info]) => {
    if (!allowedOps.includes(info.op)) return false;
    if (allowedCgiTypes) return allowedCgiTypes.includes(type);
    if (info.diff > maxDiff) return false;
    return true;
  });
  if (eligible.length === 0) return null;

  const [cgiType, info] = _wpPickKu(eligible);
  const templates = WORD_PROBLEM_TEMPLATES_KU[cgiType];
  if (!templates || templates.length === 0) return null;
  const tpl = _wpPickKu(templates);
  const names = WP_pairKu();

  let a, b, c, answer, equation;
  if (info.op === "+" || info.op === "−") {
    if (info.find === "result" || info.find === "whole" || info.find === "bigger" || info.find === "diff") {
      a = R(2, Math.min(maxNum, 12)); b = R(1, Math.max(1, Math.min(a - 1, maxNum - a, 8)));
      if (info.op === "+") { c = a + b; answer = c; equation = `${a} + ${b} = ${c}`; }
      else { c = a - b; answer = c; equation = `${a} − ${b} = ${c}`; }
    } else if (info.find === "change") {
      // op+ joinChange: a vardı, ? eklendi, c oldu (a<c) | op− separateChange: a vardı (başlangıç), ? çıktı, c kaldı (a>c)
      if (info.op === "+") { c = R(4, Math.min(maxNum, 15)); a = R(1, c - 1); b = c - a; answer = b; equation = `${a} + ? = ${c}`; }
      else { a = R(4, Math.min(maxNum, 15)); c = R(1, a - 1); b = a - c; answer = b; equation = `${a} − ? = ${c}`; }
    } else if (info.find === "part") {
      // ppwPart (op−): c bütün, a bilinen parça, ?=diğer parça (c>a)
      c = R(4, Math.min(maxNum, 15)); a = R(1, c - 1); b = c - a;
      answer = b; equation = `${c} − ? = ${a}`;
    } else if (info.find === "start") {
      // op+ joinStart: ? vardı, b eklendi, c oldu | op− separateStart: ? vardı, b çıktı, c kaldı → başlangıç = c+b
      if (info.op === "+") { c = R(4, Math.min(maxNum, 15)); b = R(1, c - 1); a = c - b; answer = a; equation = `? + ${b} = ${c}`; }
      else { c = R(2, Math.max(2, Math.min(maxNum - 1, 12))); b = R(1, Math.max(1, Math.min(maxNum - c, 8))); a = c + b; answer = a; equation = `? − ${b} = ${c}`; }
    } else if (info.find === "smaller") {
      // compareReferent (op−): n0'da c var, n1'den b fazla → n1 = c−b
      c = R(4, Math.min(maxNum, 15)); b = R(1, c - 1); a = c - b;
      answer = a; equation = `${c} − ${b} = ?`;
    }
  } else if (info.op === "×" || info.op === "÷") {
    const mulCap = [3, 4, 5, 5, 6][Math.max(0, Math.min(4, level - 1))]; // TR inline üreticiyle (GalakSay lp dizisi) eşit zorluk — KU eskiden L3+'ta sistematik kolaydı
    const groups = R(2, Math.max(2, Math.min(mulCap, Math.floor(maxNum/2))));
    const perGroup = R(2, Math.max(2, Math.min(mulCap, Math.floor(maxNum/groups))));
    const total = groups * perGroup;
    a = groups; b = perGroup; c = total;
    if (info.find === "product") { answer = total; equation = `${groups} × ${perGroup} = ${total}`; }
    else if (info.find === "size") { answer = perGroup; equation = `${total} ÷ ${groups} = ${perGroup}`; }
    else { answer = groups; equation = `${total} ÷ ${perGroup} = ${groups}`; }
  }

  const numOpts = level >= 3 ? 4 : 3;
  const opts = [answer];
  const distractors = [answer+1, answer-1, answer+2, answer-2, answer+3, answer-3].filter(x => x > 0 && x !== answer && x <= maxNum + 10);
  while (opts.length < numOpts && distractors.length > 0) {
    const pick = distractors.splice(Math.floor(Math.random()*distractors.length), 1)[0];
    if (!opts.includes(pick)) opts.push(pick);
  }
  while (opts.length < numOpts) opts.push(answer + opts.length + 1);
  // Fisher-Yates shuffle
  for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }

  return {
    type: "wordProblem",
    cgiType,
    cgiInfo: info,
    text: tpl.text(a, b, c, names, numWordKu),
    icon: tpl.icon,
    theme: tpl.theme,
    obj: tpl.obj,
    a, b, c,
    answer,
    equation,
    names,
    options: opts,
  };
}
