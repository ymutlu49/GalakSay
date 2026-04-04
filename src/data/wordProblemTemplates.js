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
    { text: (a,_,c,n,nw) => `${n[0]} toplam ${nw(c)} çıkartma biriktirmiş. Bunların ${nw(a)} tanesi yıldız, kalanları kalp şeklinde. Kaç kalp çıkartma var?`,
      icon: "💖", theme: "oyun", obj: "çıkartma" },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. KARŞILAŞTIRMA (COMPARE) — İki çokluk arasındaki ilişki
  // ═══════════════════════════════════════════════════════════════════════════
  compareDiffUnknown: [
    { text: (a,b,_,n,nw) => `${trG(n[0])} ${nw(a)} kalemi, ${trG(n[1])} ise ${nw(b)} kalemi var. ${trG(n[0])} kalemi kaç tane daha fazla?`,
      icon: "✏️", theme: "okul", obj: "kalem" },
    { text: (a,b,_,n,nw) => `Birinci sınıfta ${nw(a)}, ikinci sınıfta ${nw(b)} öğrenci var. Birinci sınıfta kaç öğrenci daha fazla?`,
      icon: "🏫", theme: "okul", obj: "öğrenci" },
    { text: (a,b,_,n,nw) => `${n[0]} ${nw(a)} sayfa, ${n[1]} ise ${nw(b)} sayfa okumuş. ${n[0]} kaç sayfa daha fazla okumuş?`,
      icon: "📖", theme: "okul", obj: "sayfa" },
  ],
  compareQuantityUnknown: [
    { text: (a,b,_,n,nw) => `${trG(n[0])} ${nw(a)} bilyesi var. ${trG(n[1])} bilyesi ondan ${nw(b)} tane daha fazla. ${trG(n[1])} kaç bilyesi var?`,
      icon: "🔮", theme: "oyun", obj: "bilye" },
    { text: (a,b,_,n,nw) => `Kırmızı kutuda ${nw(a)} top var. Mavi kutuda ise bundan ${nw(b)} top daha az var. Mavi kutuda kaç top var?`,
      icon: "📦", theme: "oyun", obj: "top" },
  ],
  compareReferentUnknown: [
    { text: (_,b,c,n,nw) => `${trG(n[0])} ${nw(c)} çıkartması var. Bu, ${trK(n[1])} ${nw(b)} tane daha fazla. ${trG(n[1])} kaç çıkartması var?`,
      icon: "⭐", theme: "oyun", obj: "çıkartma" },
    { text: (_,b,c,n,nw) => `Büyük ağaçta ${nw(c)} elma var. Bu, küçük ağaçtakinden ${nw(b)} tane daha fazla. Küçük ağaçta kaç elma var?`,
      icon: "🍎", theme: "meyve", obj: "elma" },
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
  ],
  multiplyNumGroupsUnknown: [
    { text: (_,b,c,n,nw) => `${trG(n[0])} ${nw(c)} bilyesi var. Her torbaya ${nw(b)} tane koyarsa kaç torba doldurur?`,
      icon: "🔮", theme: "oyun", obj: "bilye" },
    { text: (_,b,c,n,nw) => `Fırında ${nw(c)} ekmek pişti. Her rafa ${nw(b)} tane yerleştiriliyor. Kaç raf gerekir?`,
      icon: "🍞", theme: "yiyecek", obj: "ekmek" },
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
  compareReferentUnknown: { op: "−", find: "smaller",diff: 3, sinif: [2,3],   kod: "MAT.2.2.1" },
  multiplyProductUnknown: { op: "×", find: "product",diff: 1, sinif: [2,3],   kod: "MAT.2.2.4" },
  multiplyGroupSizeUnknown:{op: "÷", find: "size",   diff: 2, sinif: [2,3],   kod: "MAT.2.2.4" },
  multiplyNumGroupsUnknown:{op: "÷", find: "groups", diff: 3, sinif: [2,3],   kod: "MAT.2.2.4" },
  multCompareProductUnknown:{op: "×",find: "product",diff: 2, sinif: [3],     kod: "MAT.3.2.6" },
};

// ─── Sözel Problem Üretici ──────────────────────────────────────────────────
// gameLevel → problem zorluk eşlemesi
export function generateWordProblem(level, maxNum, allowedOps = ["+","−"]) {
  const maxDiff = level <= 2 ? 1 : level <= 4 ? 2 : 3;
  const R = (min,max) => Math.floor(Math.random()*(max-min+1))+min;

  // Uygun problem türlerini filtrele
  const eligible = Object.entries(CGI_TYPE_INFO).filter(([_, info]) => {
    if (info.diff > maxDiff) return false;
    if (!allowedOps.includes(info.op)) return false;
    return true;
  });
  if (eligible.length === 0) return null;

  const [cgiType, info] = WP_pick(eligible);
  const templates = WORD_PROBLEM_TEMPLATES[cgiType];
  if (!templates || templates.length === 0) return null;
  const tpl = WP_pick(templates);
  const names = WP_pair();

  // Sayı üretimi — işleme göre
  let a, b, c, answer, equation;
  if (info.op === "+" || info.op === "−") {
    if (info.find === "result" || info.find === "whole" || info.find === "bigger" || info.find === "diff") {
      a = R(2, Math.min(maxNum, 12)); b = R(1, Math.min(a - 1, maxNum - a, 8));
      if (info.op === "+") { c = a + b; answer = c; equation = `${a} + ${b} = ${c}`; }
      else { c = a - b; answer = c; equation = `${a} − ${b} = ${c}`; }
    } else if (info.find === "change" || info.find === "part") {
      c = R(4, Math.min(maxNum, 15)); a = R(1, c - 1); b = c - a;
      answer = b; equation = info.op === "+" ? `${a} + ? = ${c}` : `${c} − ? = ${a}`;
    } else if (info.find === "start" || info.find === "smaller") {
      c = R(4, Math.min(maxNum, 15)); b = R(1, c - 1); a = c - b;
      answer = a; equation = info.op === "+" ? `? + ${b} = ${c}` : `? − ${b} = ${a}`;
    }
  } else if (info.op === "×" || info.op === "÷") {
    const groups = R(2, Math.min(5, Math.floor(maxNum/2)));
    const perGroup = R(2, Math.min(5, Math.floor(maxNum/groups)));
    const total = groups * perGroup;
    a = groups; b = perGroup; c = total;
    if (info.find === "product") { answer = total; equation = `${groups} × ${perGroup} = ${total}`; }
    else if (info.find === "size") { answer = perGroup; equation = `${total} ÷ ${groups} = ${perGroup}`; }
    else { answer = groups; equation = `${total} ÷ ${perGroup} = ${groups}`; }
  }

  // 3 seçenek üret
  const opts = [answer];
  const near = [answer+1, answer-1, answer+2, answer-2, answer+3].filter(x => x > 0 && x !== answer && x <= maxNum + 5);
  while (opts.length < 3 && near.length > 0) {
    const pick = near.splice(Math.floor(Math.random()*near.length), 1)[0];
    if (!opts.includes(pick)) opts.push(pick);
  }
  while (opts.length < 3) opts.push(answer + opts.length + 1);
  opts.sort(() => Math.random() - 0.5);

  return {
    type: "wordProblem",
    cgiType,
    cgiInfo: info,
    text: tpl.text(a, b, c, names, numWord),
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
  compareReferentUnknown: "Karşılaştırma — Referans Bilinmiyor",
  multiplyProductUnknown: "Eşit Gruplar — Çarpım Bilinmiyor",
  multiplyGroupSizeUnknown:"Eşit Paylaşma — Grup Büyüklüğü Bilinmiyor",
  multiplyNumGroupsUnknown:"Ölçme Bölmesi — Grup Sayısı Bilinmiyor",
  multCompareProductUnknown:"Çarpımsal Karşılaştırma — Çarpım Bilinmiyor",
};
