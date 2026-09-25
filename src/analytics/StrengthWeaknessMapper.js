// GalakSay Analytics — Güçlü ve zayıf alan haritalama modülü
// 2026-09-25: örneklem eşiği — n < MIN_ITEMS_CATEGORY olan alanlar "değerlendirilmedi"
// (notAssessed) listesine gider; eskiden boş kategori "%0 doğruluk → zayıf" sayılıyordu.
//
// Sınıflandırma (öğretimsel düzey geleneği + Galaksay ipucu merdiveni):
//  • Güçlü:   doğruluk ≥ %80 ve ortalama ipucu < 1,5 (bağımsız düzey)
//  • Gelişim: doğruluk < %60 veya ortalama ipucu ≥ 3 (engellenme düzeyi / yoğun destek)
//  • Gelişmekte: aradaki alanlar (öğretimsel düzey)

import { CATEGORIES, getCategoryStats, getResponseTimeTrend } from './PerformanceAnalyzer.js';
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
  subitizing: 'Anlık Algılama',
  karsilastirma: 'Karşılaştırma',
  sayi_bilesimi: 'Sayı Bileşimi',
  basamak_degeri: 'Basamak Değeri',
  toplama_cikarma: 'Toplama/Çıkarma',
  carpma_bolme: 'Çarpma/Bölme',
  oruntu: 'Örüntü',
};

const STRENGTH_ACC = 0.80;
const STRENGTH_HINT = 1.5;
const WEAKNESS_ACC = 0.60;
const WEAKNESS_HINT = 3;

const pct = (x) => `%${Math.round((x || 0) * 100)}`;

/** Saf sınıflandırıcı (test edilebilir). */
function classifyCategory({ n, sufficient, accuracy, avgHint }) {
  if (!sufficient || accuracy == null) return 'not_assessed';
  if (accuracy >= STRENGTH_ACC && avgHint < STRENGTH_HINT) return 'strength';
  if (accuracy < WEAKNESS_ACC || avgHint >= WEAKNESS_HINT) return 'weakness';
  void n;
  return 'emerging';
}

async function getStrengthWeaknessProfile(childId) {
  const strengths = [];
  const weaknesses = [];
  const emergingSkills = [];
  const notAssessed = [];

  const ltLevels = await getCurrentLTLevels(childId);

  const categoryData = {};
  for (const cat of CATEGORIES) {
    const [st, rtTrend] = await Promise.all([
      getCategoryStats(childId, cat),
      getResponseTimeTrend(childId, cat),
    ]);
    categoryData[cat] = { ...st, rtTrend, ltLevel: ltLevels[cat]?.level || 0 };
  }

  for (const cat of CATEGORIES) {
    const d = categoryData[cat];
    const label = CATEGORY_LABELS[cat];
    const kind = classifyCategory(d);
    const metrics = { n: d.n, accuracy: d.accuracy ?? 0, avgResponseTime: d.avgRT ?? 0, medianResponseTime: d.medianRT ?? 0, hintUsage: d.avgHint ?? 0 };

    if (kind === 'not_assessed') {
      notAssessed.push({ category: cat, area: label, n: d.n, ltLevel: d.ltLevel });
      continue;
    }
    if (kind === 'strength') {
      strengths.push({
        category: cat,
        area: label,
        evidence: `${pct(d.accuracy)} doğruluk, ortalama ipucu ${d.avgHint.toFixed(1)} (n=${d.n})`,
        ltLevel: d.ltLevel,
        metrics,
      });
    } else if (kind === 'weakness') {
      const suggestedFocus = d.avgHint >= WEAKNESS_HINT
        ? 'İpucu bağımlılığını azaltmak için önce somut materyalle, sonra ipucusuz kısa denemeler önerilir'
        : 'Bu alanda somut materyal destekli, kısa ve sık tekrar önerilir';
      weaknesses.push({
        category: cat,
        area: label,
        evidence: `${pct(d.accuracy)} doğruluk, ortalama ipucu ${d.avgHint.toFixed(1)} (n=${d.n})`,
        ltLevel: d.ltLevel,
        metrics,
        suggestedFocus,
        relatedSkills: (RELATED_CATEGORIES[cat] || []).map(c => CATEGORY_LABELS[c]),
      });
    } else {
      let trend = 'stable';
      if (d.rtTrend?.direction === 'improving') trend = 'improving';
      else if (d.rtTrend?.direction === 'declining') trend = 'declining';
      emergingSkills.push({
        category: cat,
        area: label,
        currentAccuracy: d.accuracy,
        n: d.n,
        trend,
        evidence: `${pct(d.accuracy)} doğruluk, ortalama ipucu ${d.avgHint.toFixed(1)} (n=${d.n})`,
        ltLevel: d.ltLevel,
        metrics,
      });
    }
  }

  const crossCategoryInsights = generateCrossInsights(categoryData);

  return { strengths, weaknesses, emergingSkills, notAssessed, crossCategoryInsights };
}

function generateCrossInsights(categoryData) {
  const insights = [];
  const acc = (cat) => (categoryData[cat]?.sufficient ? categoryData[cat].accuracy : null);
  const both = (a, b) => acc(a) != null && acc(b) != null;

  if (both('sayi_bilesimi', 'toplama_cikarma') && acc('sayi_bilesimi') >= 0.75 && acc('toplama_cikarma') < 0.70) {
    insights.push({
      insight: 'Sayı bileşimi becerisi gelişiyor; toplama/çıkarma etkinliklerinde parça-bütün ilişkisini vurgulamak bu alanı da hızlandırabilir.',
      relatedCategories: ['sayi_bilesimi', 'toplama_cikarma'],
      actionable: true,
    });
  }
  if (both('subitizing', 'karsilastirma') && acc('subitizing') < 0.55 && acc('karsilastirma') < 0.60) {
    insights.push({
      insight: 'Anlık algılama (subitizing) zayıflığı karşılaştırma becerisini de etkiliyor olabilir. Önce anlık algılama çalışmasına odaklanın.',
      relatedCategories: ['subitizing', 'karsilastirma'],
      actionable: true,
    });
  }
  if (acc('sayma') != null && acc('sayma') >= 0.85) {
    insights.push({
      insight: 'Sayma becerisindeki güçlülük diğer alanlar için sağlam bir temel oluşturuyor.',
      relatedCategories: ['sayma'],
      actionable: false,
    });
  }
  if (both('basamak_degeri', 'toplama_cikarma') && acc('basamak_degeri') < 0.55 && acc('toplama_cikarma') < 0.65) {
    insights.push({
      insight: 'Basamak değeri zorluğu çok basamaklı toplama/çıkarmayı da etkileyebilir. 10\'lu gruplama etkinliklerine öncelik verin.',
      relatedCategories: ['basamak_degeri', 'toplama_cikarma'],
      actionable: true,
    });
  }
  if (both('sayi_bilesimi', 'carpma_bolme') && acc('sayi_bilesimi') < 0.60 && acc('carpma_bolme') < 0.55) {
    insights.push({
      insight: 'Sayı bileşimi eksikliği çarpma/bölmeyi de etkiliyor olabilir. Eşit gruplar kavramı için önce parça-bütün çalışması yapın.',
      relatedCategories: ['sayi_bilesimi', 'carpma_bolme'],
      actionable: true,
    });
  }
  return insights;
}

export { getStrengthWeaknessProfile, classifyCategory, CATEGORY_LABELS, RELATED_CATEGORIES };
