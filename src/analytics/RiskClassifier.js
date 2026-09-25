// GalakSay Analytics — Risk düzeyi sınıflandırıcı
// 2026-09-25 yeniden yazım: örneklem eşiği (n) + açıklanabilir, basit puanlama.
//
// Ölçek: 1 (çok düşük) – 6 (çok yüksek); Numap ön-değerlendirmeyle aynı eksen
// (numapAdapter RISK_1_6: low→2, medium→4, high→6). Etiket: 1–2 Düşük, 3–4 Orta, 5–6 Yüksek.
//
// Kategori risk puanı (0–6,5 → 1–6'ya sınırlanır), dört bileşen:
//  • Doğruluk (0–3 puan) — öğretimsel düzey geleneği (Gickling & Thompson 1985; CBM
//    uygulamaları): ≥%80 bağımsız düzey → 0; %70–79 → 1; %60–69 öğretimsel → 1,5;
//    %50–59 → 2,5; <%50 engellenme düzeyi → 3.
//  • İpucu kademesi (0–2 puan) — Galaksay'ın 5 kademeli destek merdiveninde ortalama
//    kademe: <1 → 0; <2 → 0,5; <3 → 1; <4 → 1,5; ≥4 (neredeyse tam rehberlik) → 2.
//  • Tutarlılık (0–1 puan) — son 20 maddede doğruluk/tepki süresi varyansı:
//    dalgalı → 0,5; tutarsız → 1.
//  • Hız (0–0,5 puan) — çocuğun KENDİ genel medyan tepki süresine göre bu kategoride
//    ≥1,5× yavaş VE doğruluk <%70 (yavaş+hatalı = otomatikleşmemiş). Yaş normu
//    uygulamada olmadığından çocuk-içi göreli ölçüt kullanılır.
//
// Yargı için en az MIN_ITEMS_CATEGORY (8) madde; genel risk için MIN_ITEMS_OVERALL (15).
// Yetersiz veride puan verilmez (null) — eski sürüm boş kategoriyi "%0 doğruluk = risk 6"
// sayıyordu; yeni çocuk daha oynamadan "Yüksek risk" görünüyordu.

import {
  CATEGORIES, MIN_ITEMS_CATEGORY, MIN_ITEMS_OVERALL,
  getCategoryStats, getConsistency,
} from './PerformanceAnalyzer.js';
import { getChildProfile } from './database.js';

const RISK_LABELS = { 1: 'Düşük', 2: 'Düşük', 3: 'Orta', 4: 'Orta', 5: 'Yüksek', 6: 'Yüksek' };
const CATEGORY_LABELS = {
  sayma: 'Sayma', subitizing: 'Subitizing', karsilastirma: 'Karşılaştırma',
  sayi_bilesimi: 'Sayı Bileşimi', basamak_degeri: 'Basamak Değeri',
  toplama_cikarma: 'Toplama/Çıkarma', carpma_bolme: 'Çarpma/Bölme', oruntu: 'Örüntü',
};
const pct = (x) => `%${Math.round((x || 0) * 100)}`;

/** Risk düzeyi (1–6 | null) → metin etiketi. */
function riskLabel(level) {
  if (level == null) return 'Yetersiz veri';
  return RISK_LABELS[Math.min(6, Math.max(1, Math.round(level)))] || 'Orta';
}

function accuracyPoints(acc) {
  if (acc >= 0.80) return 0;
  if (acc >= 0.70) return 1;
  if (acc >= 0.60) return 1.5;
  if (acc >= 0.50) return 2.5;
  return 3;
}
function hintPoints(h) {
  if (h < 1) return 0;
  if (h < 2) return 0.5;
  if (h < 3) return 1;
  if (h < 4) return 1.5;
  return 2;
}
function consistencyPoints(c) {
  if (c === 'tutarsiz') return 1;
  if (c === 'dalgali') return 0.5;
  return 0;
}

/** Saf puanlama (test edilebilir). overallMedianRT null ise hız bileşeni atlanır. */
function computeCategoryRisk(accuracy, hintLevel, consistency, medianRT = null, overallMedianRT = null) {
  let score = accuracyPoints(accuracy) + hintPoints(hintLevel) + consistencyPoints(consistency);
  const slow = Number.isFinite(medianRT) && Number.isFinite(overallMedianRT) && overallMedianRT > 0
    && medianRT >= overallMedianRT * 1.5 && accuracy < 0.70;
  if (slow) score += 0.5;
  return { risk: Math.min(6, Math.max(1, Math.round(score))), score, slow };
}

/** Genel risk: n-ağırlıklı kategori ortalaması (%60) + genel doğruluk/ipucu (%40). */
function computeOverallRisk(overallAccuracy, overallHint, categoryRisks, categoryN = {}) {
  const cats = Object.entries(categoryRisks).filter(([, v]) => v != null);
  let avgCatRisk;
  if (cats.length) {
    let w = 0, s = 0;
    for (const [cat, r] of cats) { const n = categoryN[cat] || 1; w += n; s += n * r; }
    avgCatRisk = s / w;
  }
  let metricRisk;
  if (overallAccuracy >= 0.85 && overallHint < 1) metricRisk = 1;
  else if (overallAccuracy >= 0.80 && overallHint < 2) metricRisk = 2;
  else if (overallAccuracy >= 0.70 && overallHint < 3) metricRisk = 3;
  else if (overallAccuracy >= 0.60 && overallHint < 4) metricRisk = 4;
  else if (overallAccuracy >= 0.50) metricRisk = 5;
  else metricRisk = 6;
  const combined = avgCatRisk == null ? metricRisk : avgCatRisk * 0.6 + metricRisk * 0.4;
  return Math.min(6, Math.max(1, Math.round(combined)));
}

/** Öğretmene okunacak sade açıklama üretir. */
function buildExplanation({ overallRisk, totalAnswered, overallAccuracy, overallHint, assessed, unassessed, riskFactors, protectiveFactors }) {
  if (overallRisk == null) {
    return `Henüz ${totalAnswered} madde cevaplandı; güvenilir bir risk düzeyi için en az ${MIN_ITEMS_OVERALL} madde gerekir. Birkaç oturum daha oynandığında bu bölüm otomatik dolacaktır.`;
  }
  const label = riskLabel(overallRisk);
  const parts = [];
  parts.push(`${totalAnswered} cevaplanmış maddeye göre genel doğruluk ${pct(overallAccuracy)}, ortalama ipucu kademesi ${overallHint.toFixed(1)} (0 = ipucusuz, 5 = tam rehberlik).`);
  if (label === 'Düşük') parts.push('Değerlendirilen alanlarda çocuk büyük ölçüde bağımsız ve doğru çalışıyor; mevcut düzeyi pekiştirip bir üst basamağa geçilebilir.');
  else if (label === 'Orta') parts.push('Bazı alanlarda öğretimsel düzeyde (yaklaşık %60–79 doğruluk) çalışıyor; hedefli, somut materyal destekli tekrar ile ilerleme beklenir.');
  else parts.push('Birden fazla alanda engellenme düzeyi (<%60 doğruluk) ve/veya yoğun ipucu ihtiyacı görülüyor; düzenli, kısa ve somut destekli oturumlar ile yakın izleme önerilir.');
  const uniq = (arr) => [...new Set(arr)];
  const high = uniq(riskFactors.filter(f => f.severity === 'high').map(f => f.label)).slice(0, 3);
  const medium = uniq(riskFactors.filter(f => f.severity === 'medium').map(f => f.label)).filter(l => !high.includes(l)).slice(0, 3);
  if (high.length) parts.push(`Öne çıkan zorluk alanları: ${high.join(', ')}.`);
  else if (medium.length) parts.push(`İzlenmesi gereken alanlar: ${medium.join(', ')}.`);
  if (protectiveFactors.length) parts.push(`Güçlü alanlar: ${uniq(protectiveFactors.map(f => f.label)).slice(0, 3).join(', ')}.`);
  if (unassessed.length) parts.push(`${unassessed.length} alan henüz yeterli madde olmadığı için değerlendirilmedi (${unassessed.map(c => CATEGORY_LABELS[c]).join(', ')}).`);
  void assessed;
  return parts.join(' ');
}

async function calculateRiskLevel(childId) {
  const overall = await getCategoryStats(childId, null);
  const overallAcc = overall.accuracy ?? 0;
  const overallHint = overall.avgHint ?? 0;

  const categoryRisks = {};
  const categoryN = {};
  const categoryDetail = {};
  const riskFactors = [];
  const protectiveFactors = [];
  const assessed = [];
  const unassessed = [];

  for (const cat of CATEGORIES) {
    const [st, consistency] = await Promise.all([
      getCategoryStats(childId, cat),
      getConsistency(childId, cat),
    ]);
    categoryN[cat] = st.n;
    if (!st.sufficient) {
      categoryRisks[cat] = null;
      categoryDetail[cat] = { n: st.n, sufficient: false };
      unassessed.push(cat);
      continue;
    }
    assessed.push(cat);
    const { risk, score, slow } = computeCategoryRisk(st.accuracy, st.avgHint, consistency.consistency, st.medianRT, overall.medianRT);
    categoryRisks[cat] = risk;
    categoryDetail[cat] = { n: st.n, sufficient: true, accuracy: st.accuracy, avgHint: st.avgHint, medianRT: st.medianRT, consistency: consistency.consistency, score, slow };

    const label = CATEGORY_LABELS[cat] || cat;
    if (st.accuracy < 0.50) {
      riskFactors.push({ factor: `${cat}_low_accuracy`, category: cat, label, severity: 'high', description: `${label}: ${pct(st.accuracy)} doğruluk (n=${st.n}) — engellenme düzeyi` });
    } else if (st.accuracy < 0.60) {
      riskFactors.push({ factor: `${cat}_moderate_accuracy`, category: cat, label, severity: 'medium', description: `${label}: ${pct(st.accuracy)} doğruluk (n=${st.n})` });
    }
    if (st.avgHint >= 4) {
      riskFactors.push({ factor: `${cat}_high_hints`, category: cat, label, severity: 'high', description: `${label}: ortalama ipucu kademesi ${st.avgHint.toFixed(1)} — neredeyse tam rehberlik` });
    } else if (st.avgHint >= 3) {
      riskFactors.push({ factor: `${cat}_hints`, category: cat, label, severity: 'medium', description: `${label}: ortalama ipucu kademesi ${st.avgHint.toFixed(1)}` });
    }
    if (slow) {
      riskFactors.push({ factor: `${cat}_slow`, category: cat, label, severity: 'medium', description: `${label}: tepki süresi çocuğun kendi ortalamasının 1,5 katından uzun ve doğruluk <%70` });
    }
    if (st.accuracy >= 0.85 && st.avgHint < 1) {
      protectiveFactors.push({ factor: `${cat}_strong`, category: cat, label, description: `${label}: ${pct(st.accuracy)} doğruluk, ipucusuz (n=${st.n})` });
    }
  }

  const sufficient = overall.n >= MIN_ITEMS_OVERALL;
  const overallRisk = sufficient ? computeOverallRisk(overallAcc, overallHint, categoryRisks, categoryN) : null;

  const result = {
    overallRisk,
    riskLabel: riskLabel(overallRisk),
    dataSufficiency: sufficient ? 'sufficient' : 'insufficient',
    totalAnswered: overall.n,
    minItemsRequired: MIN_ITEMS_OVERALL,
    overallAccuracy: overall.accuracy,
    overallHint,
    categoryRisks,
    categoryN,
    categoryDetail,
    assessedCategories: assessed,
    unassessedCategories: unassessed,
    riskFactors,
    protectiveFactors,
  };
  result.explanation = buildExplanation({ overallRisk, totalAnswered: overall.n, overallAccuracy: overallAcc, overallHint, assessed, unassessed, riskFactors, protectiveFactors });
  return result;
}

// Numap başlangıç profili ile karşılaştırma
async function compareWithNuMapBaseline(childId) {
  const profile = await getChildProfile(childId);
  const raw = profile?.nuMapRiskLevel;
  // null/''/0 → Numap taban çizgisi yok (Number(null)=0 tuzağına düşme)
  if (raw == null || raw === '' || !Number.isFinite(Number(raw)) || Number(raw) < 1) {
    return null;
  }
  const nuMapRiskLevel = Math.min(6, Math.max(1, Math.round(Number(raw))));
  const currentRisk = await calculateRiskLevel(childId);

  let change = 'insufficient';
  if (currentRisk.overallRisk != null) {
    change = 'stable';
    if (currentRisk.overallRisk < nuMapRiskLevel) change = 'improved';
    else if (currentRisk.overallRisk > nuMapRiskLevel) change = 'worsened';
  }

  const categoryComparisons = [];
  if (profile.nuMapCategoryScores) {
    for (const cat of CATEGORIES) {
      const raw = profile.nuMapCategoryScores[cat];
      const nuMapScore = Number.isFinite(Number(raw)) ? Number(raw) : null;
      const currentScore = currentRisk.categoryRisks[cat] ?? null;
      if (nuMapScore === null) continue;
      let trend = 'insufficient';
      if (currentScore != null) {
        trend = 'stable';
        if (currentScore < nuMapScore) trend = 'improved';
        else if (currentScore > nuMapScore) trend = 'worsened';
      }
      categoryComparisons.push({ category: cat, nuMapScore, currentScore, n: currentRisk.categoryN[cat] || 0, trend });
    }
  }

  const assessmentDate = profile.nuMapAssessmentDate ? new Date(profile.nuMapAssessmentDate) : null;
  const validDate = assessmentDate && !Number.isNaN(assessmentDate.getTime());
  const timeElapsed_days = validDate ? Math.max(0, Math.round((Date.now() - assessmentDate.getTime()) / 86400000)) : null;

  return {
    nuMapRiskLevel,
    currentRiskLevel: currentRisk.overallRisk,
    currentRiskLabel: currentRisk.riskLabel,
    dataSufficiency: currentRisk.dataSufficiency,
    totalAnswered: currentRisk.totalAnswered,
    change,
    categoryComparisons,
    assessmentDate: validDate ? assessmentDate.toISOString() : null,
    timeElapsed_days,
  };
}

// Diskalkuli göstergeleri taraması — her gösterge yalnız ilgili kategorilerde yeterli madde
// (≥ MIN_ITEMS_CATEGORY) varsa değerlendirilir; aksi halde "taranmadı" sayılır.
const INDICATOR_LABELS = {
  sayi_hissi_zayifligi: 'Sayı hissi zayıflığı',
  sayma_ilkeleri_eksikligi: 'Sayma ilkeleri eksikliği',
  aritmetik_prosedur_zorlugu: 'Aritmetik prosedür zorluğu',
  basamak_degeri_karmasasi: 'Basamak değeri karmaşası',
  calisma_bellegi_gostergesi: 'Çalışma belleği / otomatikleşme göstergesi',
};

async function screenDyscalculiaIndicators(childId) {
  const indicatorsFound = [];
  const screened = [];
  const notScreened = [];
  const st = {};
  for (const cat of ['subitizing', 'karsilastirma', 'sayma', 'toplama_cikarma', 'basamak_degeri']) {
    st[cat] = await getCategoryStats(childId, cat);
  }
  const overall = await getCategoryStats(childId, null);
  const ok = (...cats) => cats.every(c => st[c].sufficient);

  // 1. Sayı hissi zayıflığı — subitizing + karşılaştırma birlikte düşük
  if (ok('subitizing', 'karsilastirma')) {
    screened.push('sayi_hissi_zayifligi');
    const a = st.subitizing.accuracy, b = st.karsilastirma.accuracy;
    if (a < 0.50 && b < 0.50) {
      indicatorsFound.push({
        indicator: 'sayi_hissi_zayifligi', label: INDICATOR_LABELS.sayi_hissi_zayifligi,
        evidence: { subitizingAccuracy: a, comparisonAccuracy: b, n: st.subitizing.n + st.karsilastirma.n },
        evidenceText: `Subitizing ${pct(a)} (n=${st.subitizing.n}), karşılaştırma ${pct(b)} (n=${st.karsilastirma.n})`,
        confidence: Math.min(1, (1 - a) * 0.5 + (1 - b) * 0.5),
        recommendation: 'Subitizing ve karşılaştırma etkinliklerinde somut materyallerle (nokta kartları, onluk çerçeve) yoğun çalışma önerilir.',
      });
    }
  } else notScreened.push('sayi_hissi_zayifligi');

  // 2. Sayma ilkeleri eksikliği
  if (ok('sayma')) {
    screened.push('sayma_ilkeleri_eksikligi');
    const a = st.sayma.accuracy, h = st.sayma.avgHint;
    if (a < 0.55 && h > 3) {
      indicatorsFound.push({
        indicator: 'sayma_ilkeleri_eksikligi', label: INDICATOR_LABELS.sayma_ilkeleri_eksikligi,
        evidence: { countingAccuracy: a, avgHintLevel: h, n: st.sayma.n },
        evidenceText: `Sayma ${pct(a)} doğruluk, ortalama ipucu ${h.toFixed(1)} (n=${st.sayma.n})`,
        confidence: Math.min(1, (1 - a) * 0.6 + (h / 5) * 0.4),
        recommendation: 'Birebir eşleme ve kardinalite ilkeleri somut nesnelerle pekiştirilmeli.',
      });
    }
  } else notScreened.push('sayma_ilkeleri_eksikligi');

  // 3. Aritmetik prosedür zorluğu
  if (ok('toplama_cikarma')) {
    screened.push('aritmetik_prosedur_zorlugu');
    const a = st.toplama_cikarma.accuracy, h = st.toplama_cikarma.avgHint;
    if (a < 0.50 && h > 3.5) {
      indicatorsFound.push({
        indicator: 'aritmetik_prosedur_zorlugu', label: INDICATOR_LABELS.aritmetik_prosedur_zorlugu,
        evidence: { arithmeticAccuracy: a, avgHintLevel: h, n: st.toplama_cikarma.n },
        evidenceText: `Toplama/çıkarma ${pct(a)} doğruluk, ortalama ipucu ${h.toFixed(1)} (n=${st.toplama_cikarma.n})`,
        confidence: Math.min(1, (1 - a) * 0.5 + (h / 5) * 0.5),
        recommendation: 'Temel toplama ve çıkarma işlemleri somut materyallerle adım adım gösterilmeli.',
      });
    }
  } else notScreened.push('aritmetik_prosedur_zorlugu');

  // 4. Basamak değeri karmaşası
  if (ok('basamak_degeri')) {
    screened.push('basamak_degeri_karmasasi');
    const a = st.basamak_degeri.accuracy;
    if (a < 0.50) {
      indicatorsFound.push({
        indicator: 'basamak_degeri_karmasasi', label: INDICATOR_LABELS.basamak_degeri_karmasasi,
        evidence: { placeValueAccuracy: a, n: st.basamak_degeri.n },
        evidenceText: `Basamak değeri ${pct(a)} doğruluk (n=${st.basamak_degeri.n})`,
        confidence: Math.min(1, (1 - a) * 0.8),
        recommendation: '10\'lu gruplama ve basamak değeri materyalleriyle sistematik çalışma gerekli.',
      });
    }
  } else notScreened.push('basamak_degeri_karmasasi');

  // 5. Çalışma belleği / otomatikleşme — uzun tepki süresi + düşük doğruluk (genel)
  if (overall.n >= MIN_ITEMS_OVERALL && Number.isFinite(overall.medianRT)) {
    screened.push('calisma_bellegi_gostergesi');
    if (overall.medianRT > 8000 && overall.accuracy < 0.55) {
      indicatorsFound.push({
        indicator: 'calisma_bellegi_gostergesi', label: INDICATOR_LABELS.calisma_bellegi_gostergesi,
        evidence: { medianResponseTime: overall.medianRT, overallAccuracy: overall.accuracy, n: overall.n },
        evidenceText: `Medyan tepki süresi ${(overall.medianRT / 1000).toFixed(1)} sn, genel doğruluk ${pct(overall.accuracy)} (n=${overall.n})`,
        confidence: 0.5,
        recommendation: 'Daha kısa ve somut destekli etkinlikler tercih edilmeli; süregelirse profesyonel değerlendirme önerilir.',
      });
    }
  } else notScreened.push('calisma_bellegi_gostergesi');

  let overallScreeningResult = 'no_concern';
  if (screened.length === 0) overallScreeningResult = 'insufficient_data';
  else if (indicatorsFound.length >= 3) overallScreeningResult = 'refer_for_assessment';
  else if (indicatorsFound.length >= 1) overallScreeningResult = 'monitor';

  return {
    indicatorsFound,
    screenedIndicators: screened,
    notScreenedIndicators: notScreened,
    indicatorLabels: INDICATOR_LABELS,
    minItemsPerCategory: MIN_ITEMS_CATEGORY,
    overallScreeningResult,
    disclaimer: 'Bu tarama bir tanı aracı değildir. Profesyonel değerlendirme için uzman görüşü alınmalıdır.',
  };
}

export {
  calculateRiskLevel,
  compareWithNuMapBaseline,
  screenDyscalculiaIndicators,
  computeCategoryRisk,
  computeOverallRisk,
  riskLabel,
  RISK_LABELS,
  INDICATOR_LABELS,
};
