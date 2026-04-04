// GalakSay Analytics — 2026-03-18 — Güçlü ve zayıf alan haritalama modülü

import { CATEGORIES, getCategoryAccuracy, getAvgResponseTime, getAvgHintLevel, getResponseTimeTrend } from './PerformanceAnalyzer.js';
import { getCurrentLTLevels } from './LTProgressEngine.js';

// Kategori arası ilişki haritası
const RELATED_CATEGORIES = {
  sayma: ['subitizing', 'karsilastirma', 'toplama_cikarma'],
  subitizing: ['sayma', 'karsilastirma', 'sayi_bilesimi'],
  karsilastirma: ['sayma', 'subitizing', 'basamak_degeri'],
  sayi_bilesimi: ['subitizing', 'toplama_cikarma', 'carpma_bolme'],
  basamak_degeri: ['sayma', 'sayi_bilesimi', 'toplama_cikarma'],
  toplama_cikarma: ['sayma', 'sayi_bilesimi', 'basamak_degeri'],
  carpma_bolme: ['sayi_bilesimi', 'toplama_cikarma', 'oruntu'],
  oruntu: ['sayma', 'carpma_bolme'],
};

const CATEGORY_LABELS = {
  sayma: 'Sayma',
  subitizing: 'Subitizing',
  karsilastirma: 'Karşılaştırma',
  sayi_bilesimi: 'Sayı Bileşimi',
  basamak_degeri: 'Basamak Değeri',
  toplama_cikarma: 'Toplama/Çıkarma',
  carpma_bolme: 'Çarpma/Bölme',
  oruntu: 'Örüntü',
};

async function getStrengthWeaknessProfile(childId) {
  const strengths = [];
  const weaknesses = [];
  const emergingSkills = [];

  const ltLevels = await getCurrentLTLevels(childId);

  const categoryData = {};
  for (const cat of CATEGORIES) {
    const [accuracy, avgRT, avgHint, rtTrend] = await Promise.all([
      getCategoryAccuracy(childId, cat),
      getAvgResponseTime(childId, cat),
      getAvgHintLevel(childId, cat),
      getResponseTimeTrend(childId, cat),
    ]);
    categoryData[cat] = { accuracy, avgRT, avgHint, rtTrend, ltLevel: ltLevels[cat]?.level || 0 };
  }

  // Sınıflandırma
  for (const cat of CATEGORIES) {
    const d = categoryData[cat];
    const label = CATEGORY_LABELS[cat];
    const metrics = { accuracy: d.accuracy, avgResponseTime: d.avgRT, hintUsage: d.avgHint };

    if (d.accuracy >= 0.80 && d.avgHint < 1.5) {
      strengths.push({
        area: label,
        evidence: `${label} kategorisinde %${Math.round(d.accuracy * 100)} doğruluk, düşük ipucu kullanımı`,
        ltLevel: d.ltLevel,
        metrics,
      });
    } else if (d.accuracy < 0.60 || d.avgHint >= 3) {
      const suggestedFocus = d.avgHint >= 3
        ? 'İpucu bağımlılığını azaltmak için somut materyallerle bağımsız çalışma önerilir'
        : 'Bu alanda daha fazla somut materyalle çalışma önerilir';

      weaknesses.push({
        area: label,
        evidence: `${label} kategorisinde %${Math.round(d.accuracy * 100)} doğruluk, ortalama ipucu kademesi ${d.avgHint.toFixed(1)}`,
        ltLevel: d.ltLevel,
        metrics,
        suggestedFocus,
        relatedSkills: (RELATED_CATEGORIES[cat] || []).map(c => CATEGORY_LABELS[c]),
      });
    } else {
      // Gelişmekte olan beceri
      let trend = 'stable';
      if (d.rtTrend.direction === 'improving') trend = 'improving';
      else if (d.rtTrend.direction === 'declining') trend = 'declining';

      // Tahmini ustalık süresi
      const gapToMastery = 0.80 - d.accuracy;
      const estimatedDays = gapToMastery > 0 ? Math.ceil(gapToMastery * 30 / 0.1) : 0;

      emergingSkills.push({
        area: label,
        currentAccuracy: d.accuracy,
        trend,
        estimatedMastery_days: estimatedDays,
      });
    }
  }

  // Kategoriler arası ilişki analizi
  const crossCategoryInsights = generateCrossInsights(categoryData);

  return { strengths, weaknesses, emergingSkills, crossCategoryInsights };
}

function generateCrossInsights(categoryData) {
  const insights = [];

  // Sayı bileşimi → toplama etkisi
  if (categoryData.sayi_bilesimi.accuracy >= 0.75 && categoryData.toplama_cikarma.accuracy < 0.70) {
    insights.push({
      insight: 'Sayı bileşimi becerisi gelişiyor, bu toplama/çıkarma performansını da artırabilir. Toplama etkinliklerinde parça-bütün ilişkisini vurgulayın.',
      relatedCategories: ['sayi_bilesimi', 'toplama_cikarma'],
      actionable: true,
    });
  }

  // Subitizing → karşılaştırma etkisi
  if (categoryData.subitizing.accuracy < 0.55 && categoryData.karsilastirma.accuracy < 0.60) {
    insights.push({
      insight: 'Subitizing zayıflığı karşılaştırma becerisini de etkiliyor olabilir. Önce subitizing çalışmasına odaklanın.',
      relatedCategories: ['subitizing', 'karsilastirma'],
      actionable: true,
    });
  }

  // Sayma güçlülüğü → temel oluşturuyor
  if (categoryData.sayma.accuracy >= 0.85) {
    insights.push({
      insight: 'Sayma becerisindeki güçlülük diğer kategoriler için sağlam temel oluşturuyor.',
      relatedCategories: ['sayma'],
      actionable: false,
    });
  }

  // Basamak değeri → toplama etkisi
  if (categoryData.basamak_degeri.accuracy < 0.55 && categoryData.toplama_cikarma.accuracy < 0.65) {
    insights.push({
      insight: 'Basamak değeri zorluğu, çok basamaklı toplama/çıkarma işlemlerini de etkileyebilir. 10\'lu gruplama etkinliklerine öncelik verin.',
      relatedCategories: ['basamak_degeri', 'toplama_cikarma'],
      actionable: true,
    });
  }

  // Çarpma ← sayı bileşimi
  if (categoryData.sayi_bilesimi.accuracy < 0.60 && categoryData.carpma_bolme.accuracy < 0.55) {
    insights.push({
      insight: 'Sayı bileşimi eksikliği çarpma/bölme becerisini de etkiliyor olabilir. Eşit gruplar kavramı için önce parça-bütün çalışması yapın.',
      relatedCategories: ['sayi_bilesimi', 'carpma_bolme'],
      actionable: true,
    });
  }

  return insights;
}

export { getStrengthWeaknessProfile, CATEGORY_LABELS };
