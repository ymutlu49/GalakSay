// GalakSay Analytics — 2026-03-18 — Kişiselleştirilmiş öneri motoru

import { CATEGORIES, getCategoryAccuracy, getAvgHintLevel, getAvgResponseTime, getConcreteSupportRate } from './PerformanceAnalyzer.js';
import { getCurrentLTLevels, getProgressVelocity } from './LTProgressEngine.js';
import { getStrengthWeaknessProfile, CATEGORY_LABELS } from './StrengthWeaknessMapper.js';
import { calculateRiskLevel, screenDyscalculiaIndicators } from './RiskClassifier.js';
import { getSessionsByChild } from './database.js';

async function generateRecommendations(childId) {
  const profile = await getStrengthWeaknessProfile(childId);
  const risk = await calculateRiskLevel(childId);
  const ltLevels = await getCurrentLTLevels(childId);

  // ── ETKİNLİK ÖNERİLERİ ─────────────────────
  const activityRecommendations = [];

  for (const w of profile.weaknesses) {
    const catKey = Object.entries(CATEGORY_LABELS).find(([, v]) => v === w.area)?.[0];
    if (!catKey) continue;

    const hint = await getAvgHintLevel(childId, catKey);
    const concreteRate = await getConcreteSupportRate(childId, catKey);

    let reason = `${w.area} kategorisinde %${Math.round(w.metrics.accuracy * 100)} doğruluk.`;
    if (hint > 3) reason += ` Ortalama ipucu kademesi ${hint.toFixed(1)} — somut materyallerle tekrar önerilir.`;
    if (concreteRate < 0.3 && w.metrics.accuracy < 0.6) reason += ' Somut desteğe daha sık başvurulması önerilir.';

    activityRecommendations.push({
      priority: w.metrics.accuracy < 0.50 ? 'high' : 'medium',
      category: catKey,
      specificModule: null,
      reason,
    });
  }

  // Gelişmekte olan becerilere de orta öncelik
  for (const e of profile.emergingSkills) {
    if (e.trend === 'declining') {
      const catKey = Object.entries(CATEGORY_LABELS).find(([, v]) => v === e.area)?.[0];
      activityRecommendations.push({
        priority: 'medium',
        category: catKey,
        specificModule: null,
        reason: `${e.area} kategorisinde gerileme eğilimi var. Pekiştirme çalışması önerilir.`,
      });
    }
  }

  // Sıralama
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  activityRecommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // ── ÇALIŞMA DÜZENİ ÖNERİLERİ ───────────────
  const sessions = await getSessionsByChild(childId);
  let optimalSessionDuration_min = 20;
  let recommendedFrequency = 'Haftada 4-5 gün, 20 dakika';

  if (sessions.length >= 3) {
    const durations = sessions
      .filter(s => s.durationMs > 0)
      .map(s => s.durationMs / 60000);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

    if (avgDuration > 30) optimalSessionDuration_min = 20;
    else if (avgDuration < 10) optimalSessionDuration_min = 15;
    else optimalSessionDuration_min = Math.round(Math.min(avgDuration, 25));
  }

  if (risk.overallRisk >= 5) {
    recommendedFrequency = 'Her gün 15-20 dakika';
    optimalSessionDuration_min = Math.min(optimalSessionDuration_min, 20);
  } else if (risk.overallRisk >= 3) {
    recommendedFrequency = 'Haftada 4-5 gün, 20 dakika';
  } else {
    recommendedFrequency = 'Haftada 3-4 gün, 20-25 dakika';
  }

  const scheduleRecommendations = {
    optimalSessionDuration_min,
    recommendedFrequency,
    bestTimeOfDay: null, // Yeterli veri olduğunda hesaplanacak
    breakSuggestion: optimalSessionDuration_min > 15 ? '15 dakikadan sonra kısa mola önerilir' : null,
  };

  // ── TEMSİL KATMANI ÖNERİLERİ ───────────────
  const representationRecommendations = [];

  for (const w of profile.weaknesses) {
    const catKey = Object.entries(CATEGORY_LABELS).find(([, v]) => v === w.area)?.[0];
    if (!catKey) continue;

    const concreteRate = await getConcreteSupportRate(childId, catKey);
    if (concreteRate < 0.3 && w.metrics.accuracy < 0.60) {
      representationRecommendations.push({
        category: catKey,
        currentLayer: 'sembolik',
        recommendedLayer: 'somut',
        reason: `${w.area} kategorisinde sembolik düzeyde zorlanıyor. Somut materyallerle desteklenmeli.`,
      });
    }
  }

  // ── EBEVEYNE YÖNELİK ÖNERİLER ─────────────
  const parentGuidance = [];

  // Her zayıf alan için günlük yaşam önerisi
  const guidanceMap = {
    sayma: { tip: 'Günlük yaşamda sayma fırsatları oluşturun (meyveleri sayma, merdiven sayma, sofra kurma).', difficulty: 'kolay' },
    subitizing: { tip: 'Çocuğunuzla zar oyunları oynayın — zarın üstündeki noktaları saymadan söyleme pratiği yapın.', difficulty: 'kolay' },
    karsilastirma: { tip: '"Hangisi daha fazla?" oyunları oynayın — tabaktaki yiyecekleri, oyuncakları karşılaştırın.', difficulty: 'kolay' },
    sayi_bilesimi: { tip: '5\'i ve 10\'u oluşturma oyunları oynayın — "3 elma var, kaç tane daha eklesek 5 olur?"', difficulty: 'orta' },
    basamak_degeri: { tip: 'Bozuk paraları 10\'arlı gruplama oyunu oynayın. Fasulye veya düğmeleri 10\'arlı gruplara ayırın.', difficulty: 'orta' },
    toplama_cikarma: { tip: 'Market alışverişinde basit toplama yapın — "2 elma + 3 portakal = kaç meyve?"', difficulty: 'kolay' },
    carpma_bolme: { tip: 'Eşit paylaşma oyunları oynayın — kurabiyeleri eşit dağıtma, masaya eşit tabak koyma.', difficulty: 'orta' },
    oruntu: { tip: 'Boncuk dizme veya blok sıralama ile tekrar eden örüntüler oluşturun.', difficulty: 'kolay' },
  };

  for (const w of profile.weaknesses) {
    const catKey = Object.entries(CATEGORY_LABELS).find(([, v]) => v === w.area)?.[0];
    if (catKey && guidanceMap[catKey]) {
      parentGuidance.push({ ...guidanceMap[catKey], category: catKey });
    }
  }

  // Genel öneriler
  parentGuidance.push(
    { tip: 'Başarıları kutlayın, hatalara odaklanmayın. Süreç odaklı övgü kullanın.', category: 'genel', difficulty: 'kolay' },
    { tip: 'Oturum sonrası çocuğunuza en sevdiği kısmı sorun.', category: 'genel', difficulty: 'kolay' },
  );

  // ── PROFESYONEL YÖNLENDİRME ────────────────
  const screening = await screenDyscalculiaIndicators(childId);
  let professionalReferral = {
    needed: false,
    urgency: 'routine',
    reason: null,
    suggestedProfessional: null,
    disclaimer: 'Bu öneri bir tanı değildir. Profesyonel değerlendirme için uzman görüşü alınmalıdır.',
  };

  if (screening.overallScreeningResult === 'refer_for_assessment') {
    professionalReferral = {
      needed: true,
      urgency: 'soon',
      reason: `${screening.indicatorsFound.length} diskalkuli göstergesi tespit edildi.`,
      suggestedProfessional: 'Matematik öğrenme güçlüğü uzmanı veya çocuk psikologu',
      disclaimer: 'Bu öneri bir tanı değildir. Profesyonel değerlendirme için uzman görüşü alınmalıdır.',
    };
  } else if (screening.overallScreeningResult === 'monitor') {
    professionalReferral = {
      needed: false,
      urgency: 'routine',
      reason: 'Bazı göstergeler izlenmeli. İlerleme kaydedilmezse değerlendirme düşünülebilir.',
      suggestedProfessional: null,
      disclaimer: 'Bu öneri bir tanı değildir. Profesyonel değerlendirme için uzman görüşü alınmalıdır.',
    };
  }

  return {
    activityRecommendations,
    scheduleRecommendations,
    representationRecommendations,
    parentGuidance,
    professionalReferral,
  };
}

export { generateRecommendations };
