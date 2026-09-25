// GalakSay Analytics — Kişiselleştirilmiş öneri motoru
// 2026-09-25: Öneriler yalnız YETERLİ VERİSİ olan alanlardan türetilir (StrengthWeaknessMapper
// örneklem eşiği). Yeni çocukta "veri toplama" adımları önerilir; NaN oturum süresi düzeltildi.
// Öğretmene somut sonraki adımlar (teacherNextSteps) + ebeveyne kısa not (parentNote) eklendi.

import { MIN_ITEMS_CATEGORY, MIN_ITEMS_OVERALL, getConcreteSupportRate } from './PerformanceAnalyzer.js';
import { getStrengthWeaknessProfile } from './StrengthWeaknessMapper.js';
import { calculateRiskLevel, screenDyscalculiaIndicators } from './RiskClassifier.js';
import { getSessionsByChild } from './database.js';

// Kategori → öğretmen için somut sınıf-içi adım (somut → görsel → sembolik sırası).
const TEACHER_STEPS = {
  sayma: 'Birebir eşleme ile 1–20 arası nesne sayma; ileri/geri sayma ve "kaç tane?" (kardinalite) sorusu. Galaksay: Sayma gezegeni, düşük düzeyden başlayın.',
  subitizing: 'Nokta kartları / onluk çerçeve ile 1–5 (sonra 6–10) çokluğu saymadan tanıma; 1–2 saniyelik gösterimler. Galaksay: Subitizing gezegeni.',
  karsilastirma: '"Hangisi daha çok / daha az?" — önce nesnelerle, sonra sayı kartlarıyla; sayı doğrusunda yer bulma. Galaksay: Karşılaştırma gezegeni.',
  sayi_bilesimi: 'Parça-bütün: 5\'i ve 10\'u oluşturan çiftler (birleştirme kartları, onluk çerçeve). Galaksay: Sayı Bileşimi gezegeni.',
  basamak_degeri: 'Birlik/onluk bloklarla 10\'lu gruplama; "3 onluk 4 birlik" = 34 dönüşümleri (iki yönlü). Galaksay: Basamak Değeri gezegeni.',
  toplama_cikarma: 'Somut nesnelerle ekleme/çıkarma, ardından sayma-üstüne-sayma stratejisi; işlem sembolünü sesli okuma. Galaksay: Toplama/Çıkarma gezegeni.',
  carpma_bolme: 'Eşit gruplar ve dizi (array) modeli ile tekrarlı toplama; eşit paylaştırma etkinlikleri. Galaksay: Çarpma/Bölme gezegeni.',
  oruntu: 'AB / ABB örüntülerini nesnelerle sürdürme ve kendi örüntüsünü kurma; büyüyen örüntülerde kuralı söyletme. Galaksay: Örüntü gezegeni.',
};

// Ebeveyn için günlük yaşam önerileri
const PARENT_TIPS = {
  sayma: { tip: 'Günlük yaşamda sayma fırsatları oluşturun (meyveleri, merdiven basamaklarını sayma, sofra kurma).', difficulty: 'kolay' },
  subitizing: { tip: 'Zar oyunları oynayın — zarın üstündeki noktaları saymadan söyleme pratiği yapın.', difficulty: 'kolay' },
  karsilastirma: { tip: '"Hangisi daha fazla?" oyunları oynayın — tabaktaki yiyecekleri, oyuncakları karşılaştırın.', difficulty: 'kolay' },
  sayi_bilesimi: { tip: '5\'i ve 10\'u oluşturma oyunları oynayın — "3 elma var, kaç tane daha eklesek 5 olur?"', difficulty: 'orta' },
  basamak_degeri: { tip: 'Bozuk paraları veya fasulyeleri 10\'arlı gruplara ayırma oyunu oynayın.', difficulty: 'orta' },
  toplama_cikarma: { tip: 'Market alışverişinde basit toplama yapın — "2 elma + 3 portakal = kaç meyve?"', difficulty: 'kolay' },
  carpma_bolme: { tip: 'Eşit paylaşma oyunları oynayın — kurabiyeleri eşit dağıtma, masaya eşit tabak koyma.', difficulty: 'orta' },
  oruntu: { tip: 'Boncuk dizme veya blok sıralama ile tekrar eden örüntüler oluşturun.', difficulty: 'kolay' },
};

const pct = (x) => `%${Math.round((x || 0) * 100)}`;

async function generateRecommendations(childId) {
  const profile = await getStrengthWeaknessProfile(childId);
  const risk = await calculateRiskLevel(childId);
  const insufficient = risk.dataSufficiency !== 'sufficient';

  // ── ETKİNLİK ÖNERİLERİ (öğretmen) ─────────────
  const activityRecommendations = [];
  const teacherNextSteps = [];

  for (const w of profile.weaknesses) {
    const catKey = w.category;
    const concreteRate = await getConcreteSupportRate(childId, catKey);
    const hint = w.metrics.hintUsage;
    let reason = `${w.area}: ${pct(w.metrics.accuracy)} doğruluk (n=${w.metrics.n}).`;
    if (hint >= 3) reason += ` Ortalama ipucu kademesi ${hint.toFixed(1)} — somut materyalle bağımsız denemeler önerilir.`;
    if (concreteRate < 0.3 && w.metrics.accuracy < 0.6) reason += ' Somut gösterime (üçlü kod) daha sık başvurulmalı.';
    const priority = w.metrics.accuracy < 0.50 || hint >= 4 ? 'high' : 'medium';
    activityRecommendations.push({ priority, category: catKey, specificModule: null, reason });
    teacherNextSteps.push({ priority, category: catKey, area: w.area, step: TEACHER_STEPS[catKey], evidence: w.evidence });
  }

  for (const e of profile.emergingSkills) {
    if (e.trend === 'declining') {
      activityRecommendations.push({
        priority: 'medium', category: e.category, specificModule: null,
        reason: `${e.area}: ${pct(e.currentAccuracy)} doğruluk ancak tepki süresi uzuyor (n=${e.n}). Kısa pekiştirme oturumu önerilir.`,
      });
      teacherNextSteps.push({ priority: 'medium', category: e.category, area: e.area, step: TEACHER_STEPS[e.category], evidence: e.evidence });
    }
  }

  // Gelişmekte olan alanlar (öğretimsel düzey) — düşük öncelik, akıcılık hedefi
  for (const e of profile.emergingSkills) {
    if (e.trend !== 'declining') {
      activityRecommendations.push({
        priority: 'low', category: e.category, specificModule: null,
        reason: `${e.area}: ${pct(e.currentAccuracy)} doğruluk (n=${e.n}) — öğretimsel düzeyde; mevcut düzeyde akıcılık kazandırın, %80'e ulaşınca bir üst basamağa geçin.`,
      });
    }
  }

  // Güçlü alanlar — bir üst basamak
  for (const s of profile.strengths.slice(0, 2)) {
    activityRecommendations.push({
      priority: 'low', category: s.category, specificModule: null,
      reason: `${s.area}: ${pct(s.metrics.accuracy)} doğruluk, ipucusuz — bir üst düzeye (LT ${s.ltLevel + 1}) geçilebilir.`,
    });
  }

  // Yetersiz veri — veri toplama adımları
  if (profile.notAssessed.length > 0 && (insufficient || profile.weaknesses.length + profile.strengths.length + profile.emergingSkills.length === 0)) {
    const names = profile.notAssessed.map(x => x.area).slice(0, 4).join(', ');
    activityRecommendations.push({
      priority: insufficient ? 'high' : 'low', category: null, specificModule: null,
      reason: insufficient
        ? `Henüz ${risk.totalAnswered} madde cevaplandı; güvenilir öneri için en az ${MIN_ITEMS_OVERALL} madde (alan başına ${MIN_ITEMS_CATEGORY}) gerekir. Önce ${names} alanlarında birer kısa oturum oynatın.`
        : `${profile.notAssessed.length} alanda henüz yeterli madde yok (${names}); bu alanlarda da birer kısa oturum oynatın.`,
    });
    if (insufficient) {
      teacherNextSteps.push({ priority: 'high', category: null, area: 'Veri toplama', step: `Her gezegende en az ${MIN_ITEMS_CATEGORY} soru oynatarak temel profil oluşturun (2–3 kısa oturum yeterlidir).`, evidence: `${risk.totalAnswered} madde` });
    }
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  activityRecommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  teacherNextSteps.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // ── ÇALIŞMA DÜZENİ ÖNERİLERİ ───────────────
  const sessions = await getSessionsByChild(childId);
  let optimalSessionDuration_min = 20;
  const durations = (sessions || [])
    .map(s => Number(s.durationMs) || 0)
    .filter(ms => ms > 60000 && ms < 3 * 3600000) // 1 dk – 3 sa dışını (yarım kalan/asılı oturum) at
    .map(ms => ms / 60000);
  if (durations.length >= 3) {
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    if (avgDuration > 30) optimalSessionDuration_min = 20;
    else if (avgDuration < 10) optimalSessionDuration_min = 15;
    else optimalSessionDuration_min = Math.round(Math.min(avgDuration, 25));
  }

  let recommendedFrequency;
  if (risk.overallRisk == null) recommendedFrequency = 'Haftada 3–4 gün, 15–20 dakika (temel profil için)';
  else if (risk.overallRisk >= 5) { recommendedFrequency = 'Her gün 15–20 dakika'; optimalSessionDuration_min = Math.min(optimalSessionDuration_min, 20); }
  else if (risk.overallRisk >= 3) recommendedFrequency = 'Haftada 4–5 gün, 20 dakika';
  else recommendedFrequency = 'Haftada 3–4 gün, 20–25 dakika';

  const scheduleRecommendations = {
    optimalSessionDuration_min,
    recommendedFrequency,
    bestTimeOfDay: null,
    breakSuggestion: optimalSessionDuration_min > 15 ? '15 dakikadan sonra kısa mola önerilir' : null,
    basedOnSessions: durations.length,
  };

  // ── TEMSİL KATMANI ÖNERİLERİ ───────────────
  const representationRecommendations = [];
  for (const w of profile.weaknesses) {
    const concreteRate = await getConcreteSupportRate(childId, w.category);
    if (concreteRate < 0.3 && w.metrics.accuracy < 0.60) {
      representationRecommendations.push({
        category: w.category, currentLayer: 'sembolik', recommendedLayer: 'somut',
        reason: `${w.area}: sembolik düzeyde zorlanıyor; somut gösterim (üçlü kod) açık tutulmalı.`,
      });
    }
  }

  // ── EBEVEYNE YÖNELİK ÖNERİLER ─────────────
  const parentGuidance = [];
  for (const w of profile.weaknesses) {
    if (PARENT_TIPS[w.category]) parentGuidance.push({ ...PARENT_TIPS[w.category], category: w.category });
  }
  if (parentGuidance.length === 0) {
    for (const e of profile.emergingSkills.slice(0, 2)) {
      if (PARENT_TIPS[e.category]) parentGuidance.push({ ...PARENT_TIPS[e.category], category: e.category });
    }
  }
  parentGuidance.push(
    { tip: 'Başarıları kutlayın, hatalara odaklanmayın; çabayı öven süreç odaklı övgü kullanın.', category: 'genel', difficulty: 'kolay' },
    { tip: 'Oturum sonrası çocuğunuza en sevdiği kısmı sorun; kısa ve düzenli çalışma uzun ve seyrekten iyidir.', category: 'genel', difficulty: 'kolay' },
  );

  // Kısa ebeveyn notu (rapor için tek paragraf)
  let parentNote;
  if (insufficient) {
    parentNote = 'Çocuğunuz Galaksay ile çalışmaya yeni başladı. Birkaç kısa oturum daha tamamlandığında güçlü ve gelişime açık alanlar netleşecek. Şimdilik en iyi destek: haftada birkaç gün 15 dakika, birlikte ve keyifle.';
  } else {
    const s = profile.strengths.slice(0, 2).map(x => x.area).join(' ve ');
    const w = profile.weaknesses.slice(0, 2).map(x => x.area).join(' ve ');
    parentNote = [
      s ? `Çocuğunuz ${s} alanında güçlü.` : 'Çocuğunuz düzenli çalışıyor.',
      w ? `${w} alanında ek destek iyi gelecektir; yukarıdaki günlük yaşam önerileri bu alanlara yöneliktir.` : 'Tüm alanlarda dengeli bir gelişim görülüyor.',
      'Kısa ve sık oturumlar, sabır ve çaba övgüsü en etkili destektir.',
    ].join(' ');
  }

  // ── PROFESYONEL YÖNLENDİRME ────────────────
  const screening = await screenDyscalculiaIndicators(childId);
  const disclaimer = 'Bu öneri bir tanı değildir. Profesyonel değerlendirme için uzman görüşü alınmalıdır.';
  let professionalReferral = { needed: false, urgency: 'routine', reason: null, suggestedProfessional: null, disclaimer };

  if (screening.overallScreeningResult === 'refer_for_assessment') {
    professionalReferral = {
      needed: true, urgency: 'soon',
      reason: `${screening.indicatorsFound.length} diskalkuli göstergesi bir arada görüldü: ${screening.indicatorsFound.map(i => i.label).join(', ')}.`,
      suggestedProfessional: 'Matematik öğrenme güçlüğü uzmanı, özel eğitim uzmanı veya çocuk psikologu',
      disclaimer,
    };
  } else if (screening.overallScreeningResult === 'monitor') {
    professionalReferral = {
      needed: false, urgency: 'routine',
      reason: `İzlenmesi gereken gösterge: ${screening.indicatorsFound.map(i => i.label).join(', ')}. 3–4 hafta içinde ilerleme yoksa değerlendirme düşünülebilir.`,
      suggestedProfessional: null, disclaimer,
    };
  }

  return {
    dataSufficiency: risk.dataSufficiency,
    activityRecommendations,
    teacherNextSteps,
    scheduleRecommendations,
    representationRecommendations,
    parentGuidance,
    parentNote,
    professionalReferral,
  };
}

export { generateRecommendations, TEACHER_STEPS };
