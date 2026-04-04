// GalakSay Analytics — 2026-03-18 — Risk düzeyi sınıflandırıcı

import { CATEGORIES, getOverallAccuracy, getCategoryAccuracy, getAvgHintLevel, getHintDependencyRate, getAvgResponseTime, getConsistency } from './PerformanceAnalyzer.js';
import { getCurrentLTLevels, getProgressVelocity } from './LTProgressEngine.js';
import { getChildProfile } from './database.js';

// NuMap risk düzeyleri: 1 (çok düşük) – 6 (çok yüksek)

async function calculateRiskLevel(childId) {
  const overallAcc = await getOverallAccuracy(childId);
  const overallHint = await getAvgHintLevel(childId);

  const categoryRisks = {};
  const riskFactors = [];
  const protectiveFactors = [];

  for (const cat of CATEGORIES) {
    const [acc, hint, hintDep, consistency] = await Promise.all([
      getCategoryAccuracy(childId, cat),
      getAvgHintLevel(childId, cat),
      getHintDependencyRate(childId, cat),
      getConsistency(childId, cat),
    ]);

    categoryRisks[cat] = computeCategoryRisk(acc, hint, hintDep, consistency.consistency);

    // Risk faktörleri
    if (acc < 0.5) {
      riskFactors.push({ factor: `${cat}_low_accuracy`, severity: 'high', description: `${cat} kategorisinde doğruluk %${Math.round(acc * 100)}` });
    } else if (acc < 0.65) {
      riskFactors.push({ factor: `${cat}_moderate_accuracy`, severity: 'medium', description: `${cat} kategorisinde doğruluk %${Math.round(acc * 100)}` });
    }

    if (hint >= 4) {
      riskFactors.push({ factor: `${cat}_high_hints`, severity: 'high', description: `${cat} kategorisinde ortalama ipucu kademesi ${hint.toFixed(1)}` });
    }

    // Koruyucu faktörler
    if (acc >= 0.85 && hint < 1) {
      protectiveFactors.push({ factor: `${cat}_strong`, description: `${cat} kategorisinde güçlü performans (%${Math.round(acc * 100)} doğruluk, düşük ipucu kullanımı)` });
    }
  }

  const overallRisk = computeOverallRisk(overallAcc, overallHint, categoryRisks);

  return { overallRisk, categoryRisks, riskFactors, protectiveFactors };
}

function computeCategoryRisk(accuracy, hintLevel, hintDependency, consistency) {
  let score = 0;

  // Doğruluk bazlı (0-3 puan)
  if (accuracy >= 0.90) score += 0;
  else if (accuracy >= 0.80) score += 0.5;
  else if (accuracy >= 0.70) score += 1;
  else if (accuracy >= 0.60) score += 1.5;
  else if (accuracy >= 0.50) score += 2.5;
  else score += 3;

  // İpucu bazlı (0-2 puan)
  if (hintLevel < 1) score += 0;
  else if (hintLevel < 2) score += 0.5;
  else if (hintLevel < 3) score += 1;
  else if (hintLevel < 4) score += 1.5;
  else score += 2;

  // Tutarlılık (0-1 puan)
  if (consistency === 'tutarsiz') score += 1;
  else if (consistency === 'dalgali') score += 0.5;

  // 0-6 ölçeğine normalize et
  return Math.min(6, Math.max(1, Math.round(score)));
}

function computeOverallRisk(accuracy, hintLevel, categoryRisks) {
  // Kategori risk ortalaması
  const catValues = Object.values(categoryRisks).filter(v => v > 0);
  const avgCatRisk = catValues.length > 0 ? catValues.reduce((a, b) => a + b, 0) / catValues.length : 3;

  // Genel metriklere dayalı risk
  let metricRisk;
  if (accuracy >= 0.90 && hintLevel < 1) metricRisk = 1;
  else if (accuracy >= 0.80 && hintLevel < 2) metricRisk = 2;
  else if (accuracy >= 0.70 && hintLevel < 3) metricRisk = 3;
  else if (accuracy >= 0.60 && hintLevel < 4) metricRisk = 4;
  else if (accuracy >= 0.50 && hintLevel < 5) metricRisk = 5;
  else metricRisk = 6;

  return Math.round((avgCatRisk * 0.6 + metricRisk * 0.4));
}

// NuMap başlangıç profili ile karşılaştırma
async function compareWithNuMapBaseline(childId) {
  const profile = await getChildProfile(childId);
  if (!profile || !profile.nuMapRiskLevel) {
    return null;
  }

  const currentRisk = await calculateRiskLevel(childId);

  let change = 'stable';
  if (currentRisk.overallRisk < profile.nuMapRiskLevel) change = 'improved';
  else if (currentRisk.overallRisk > profile.nuMapRiskLevel) change = 'worsened';

  const categoryComparisons = [];
  if (profile.nuMapCategoryScores) {
    for (const cat of CATEGORIES) {
      const nuMapScore = profile.nuMapCategoryScores[cat] || null;
      const currentScore = currentRisk.categoryRisks[cat];
      if (nuMapScore !== null) {
        let trend = 'stable';
        if (currentScore < nuMapScore) trend = 'improved';
        else if (currentScore > nuMapScore) trend = 'worsened';
        categoryComparisons.push({ category: cat, nuMapScore, currentScore, trend });
      }
    }
  }

  const assessmentDate = profile.nuMapAssessmentDate ? new Date(profile.nuMapAssessmentDate) : null;
  const timeElapsed_days = assessmentDate ? Math.round((Date.now() - assessmentDate.getTime()) / 86400000) : null;

  return {
    nuMapRiskLevel: profile.nuMapRiskLevel,
    currentRiskLevel: currentRisk.overallRisk,
    change,
    categoryComparisons,
    timeElapsed_days,
  };
}

// Diskalkuli göstergeleri taraması
async function screenDyscalculiaIndicators(childId) {
  const indicatorsFound = [];

  // 1. Sayı hissi zayıflığı
  const [subitAcc, compAcc] = await Promise.all([
    getCategoryAccuracy(childId, 'subitizing'),
    getCategoryAccuracy(childId, 'karsilastirma'),
  ]);
  if (subitAcc < 0.50 && compAcc < 0.50) {
    indicatorsFound.push({
      indicator: 'sayı_hissi_zayıflığı',
      evidence: { subitizingAccuracy: subitAcc, comparisonAccuracy: compAcc },
      confidence: Math.min(1, (1 - subitAcc) * 0.5 + (1 - compAcc) * 0.5),
      recommendation: 'Subitizing ve karşılaştırma etkinliklerinde somut materyallerle yoğun çalışma önerilir.',
    });
  }

  // 2. Sayma ilkeleri eksikliği
  const countingAcc = await getCategoryAccuracy(childId, 'sayma');
  const countingHint = await getAvgHintLevel(childId, 'sayma');
  if (countingAcc < 0.55 && countingHint > 3) {
    indicatorsFound.push({
      indicator: 'sayma_ilkeleri_eksikliği',
      evidence: { countingAccuracy: countingAcc, avgHintLevel: countingHint },
      confidence: Math.min(1, (1 - countingAcc) * 0.6 + (countingHint / 5) * 0.4),
      recommendation: 'Birebir eşleme ve kardinalite prensipleri somut nesnelerle pekiştirilmeli.',
    });
  }

  // 3. Aritmetik prosedür zorluğu
  const arithAcc = await getCategoryAccuracy(childId, 'toplama_cikarma');
  const arithHint = await getAvgHintLevel(childId, 'toplama_cikarma');
  if (arithAcc < 0.50 && arithHint > 3.5) {
    indicatorsFound.push({
      indicator: 'aritmetik_prosedür_zorluğu',
      evidence: { arithmeticAccuracy: arithAcc, avgHintLevel: arithHint },
      confidence: Math.min(1, (1 - arithAcc) * 0.5 + (arithHint / 5) * 0.5),
      recommendation: 'Temel toplama ve çıkarma işlemleri somut materyallerle adım adım gösterilmeli.',
    });
  }

  // 4. Basamak değeri karmaşası
  const pvAcc = await getCategoryAccuracy(childId, 'basamak_degeri');
  if (pvAcc < 0.50) {
    indicatorsFound.push({
      indicator: 'basamak_değeri_karmaşası',
      evidence: { placeValueAccuracy: pvAcc },
      confidence: Math.min(1, (1 - pvAcc) * 0.8),
      recommendation: '10\'lu gruplama ve basamak değeri materyalleriyle sistematik çalışma gerekli.',
    });
  }

  // 5. Çalışma belleği göstergesi — uzun yanıt süresi + yüksek hata
  const avgRT = await getAvgResponseTime(childId);
  const overallAcc = await getOverallAccuracy(childId);
  if (avgRT > 8000 && overallAcc < 0.55) {
    indicatorsFound.push({
      indicator: 'çalışma_belleği_göstergesi',
      evidence: { avgResponseTime: avgRT, overallAccuracy: overallAcc },
      confidence: 0.5,
      recommendation: 'Daha kısa ve somut destekli etkinlikler tercih edilmeli. Profesyonel değerlendirme önerilir.',
    });
  }

  // Genel tarama sonucu
  let overallScreeningResult = 'no_concern';
  if (indicatorsFound.length >= 3) overallScreeningResult = 'refer_for_assessment';
  else if (indicatorsFound.length >= 1) overallScreeningResult = 'monitor';

  return {
    indicatorsFound,
    overallScreeningResult,
    disclaimer: 'Bu tarama bir tanı aracı değildir. Profesyonel değerlendirme için uzman görüşü alınmalıdır.',
  };
}

export {
  calculateRiskLevel,
  compareWithNuMapBaseline,
  screenDyscalculiaIndicators,
};
