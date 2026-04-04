// GalakSay Analytics — 2026-03-18 — Çok boyutlu performans analiz motoru

import {
  getEventsByChildAndType,
  getEventsByChildCategoryType,
  getEventsBySession,
  getDailySummaries,
} from './database.js';

const CATEGORIES = [
  'sayma', 'subitizing', 'karsilastirma', 'sayi_bilesimi',
  'basamak_degeri', 'toplama_cikarma', 'carpma_bolme', 'oruntu'
];

// ── YARDIMCI FONKSİYONLAR ──────────────────────

function filterByTimeRange(events, timeRange) {
  if (!timeRange) return events;
  const { start, end } = timeRange;
  return events.filter(e => {
    const t = e.timestamp || e.data?.timestamp;
    return (!start || t >= start) && (!end || t <= end);
  });
}

function median(arr) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function linearRegression(values) {
  const n = values.length;
  if (n < 3) return { slope: 0, confidence: 0 };
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const yMean = sumY / n;
  let ssTot = 0, ssRes = 0;
  for (let i = 0; i < n; i++) {
    const yPred = (sumY / n) + slope * (i - sumX / n);
    ssRes += (values[i] - yPred) ** 2;
    ssTot += (values[i] - yMean) ** 2;
  }
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
  return { slope, confidence: Math.abs(r2) };
}

// ── DOĞRULUK METRİKLERİ ──────────────────────

async function getOverallAccuracy(childId, timeRange) {
  let events = await getEventsByChildAndType(childId, 'question_answered');
  events = filterByTimeRange(events, timeRange);
  if (events.length === 0) return 0;
  const correct = events.filter(e => e.data.isCorrect).length;
  return correct / events.length;
}

async function getCategoryAccuracy(childId, category, timeRange) {
  let events = await getEventsByChildCategoryType(childId, category, 'question_answered');
  events = filterByTimeRange(events, timeRange);
  if (events.length === 0) return 0;
  const correct = events.filter(e => e.data.isCorrect).length;
  return correct / events.length;
}

async function getModuleAccuracy(childId, moduleId) {
  const events = await getEventsByChildAndType(childId, 'question_answered');
  const moduleEvents = events.filter(e => e.moduleId === moduleId);
  if (moduleEvents.length === 0) return 0;
  const correct = moduleEvents.filter(e => e.data.isCorrect).length;
  return correct / moduleEvents.length;
}

async function getFirstAttemptAccuracy(childId, category, timeRange) {
  let events;
  if (category) {
    events = await getEventsByChildCategoryType(childId, category, 'question_answered');
  } else {
    events = await getEventsByChildAndType(childId, 'question_answered');
  }
  events = filterByTimeRange(events, timeRange);
  const firstAttempts = events.filter(e => (e.data.attemptNumber || 1) === 1);
  if (firstAttempts.length === 0) return 0;
  const correct = firstAttempts.filter(e => e.data.isCorrect).length;
  return correct / firstAttempts.length;
}

// ── HIZLILIK METRİKLERİ ─────────────────────

async function getAvgResponseTime(childId, category, timeRange) {
  let events;
  if (category) {
    events = await getEventsByChildCategoryType(childId, category, 'question_answered');
  } else {
    events = await getEventsByChildAndType(childId, 'question_answered');
  }
  events = filterByTimeRange(events, timeRange);
  if (events.length === 0) return 0;
  const total = events.reduce((sum, e) => sum + (e.data.responseTime_ms || 0), 0);
  return total / events.length;
}

async function getMedianResponseTime(childId, category, timeRange) {
  let events;
  if (category) {
    events = await getEventsByChildCategoryType(childId, category, 'question_answered');
  } else {
    events = await getEventsByChildAndType(childId, 'question_answered');
  }
  events = filterByTimeRange(events, timeRange);
  const times = events.map(e => e.data.responseTime_ms || 0).filter(t => t > 0);
  return median(times);
}

async function getResponseTimeTrend(childId, category, windowSize = 10) {
  let events;
  if (category) {
    events = await getEventsByChildCategoryType(childId, category, 'question_answered');
  } else {
    events = await getEventsByChildAndType(childId, 'question_answered');
  }
  events.sort((a, b) => a.timestamp - b.timestamp);
  const recent = events.slice(-windowSize);
  const times = recent.map(e => e.data.responseTime_ms || 0);
  const { slope, confidence } = linearRegression(times);

  let direction = 'stable';
  if (confidence > 0.3) {
    direction = slope < -50 ? 'improving' : slope > 50 ? 'declining' : 'stable';
  }
  return { direction, slope, confidence };
}

// ── İPUCU KULLANIM METRİKLERİ ────────────────

async function getAvgHintLevel(childId, category, timeRange) {
  let events;
  if (category) {
    events = await getEventsByChildCategoryType(childId, category, 'question_answered');
  } else {
    events = await getEventsByChildAndType(childId, 'question_answered');
  }
  events = filterByTimeRange(events, timeRange);
  if (events.length === 0) return 0;
  const total = events.reduce((sum, e) => sum + (e.data.hintLevelUsed || 0), 0);
  return total / events.length;
}

async function getHintDependencyRate(childId, category, timeRange) {
  let events;
  if (category) {
    events = await getEventsByChildCategoryType(childId, category, 'question_answered');
  } else {
    events = await getEventsByChildAndType(childId, 'question_answered');
  }
  events = filterByTimeRange(events, timeRange);
  if (events.length === 0) return 0;
  const withHints = events.filter(e => (e.data.hintLevelUsed || 0) > 0).length;
  return withHints / events.length;
}

async function getHintEffectiveness(childId, timeRange) {
  let hintEvents = await getEventsByChildAndType(childId, 'hint_completed');
  hintEvents = filterByTimeRange(hintEvents, timeRange);

  const result = {};
  for (let level = 1; level <= 5; level++) {
    const levelEvents = hintEvents.filter(e => e.data.hintLevel === level);
    const successful = levelEvents.filter(e => e.data.actionAfterHint === 'answered_correct');
    result[`level${level}_success`] = levelEvents.length > 0
      ? successful.length / levelEvents.length
      : 0;
  }
  return result;
}

// ── TEMSİL TERCİHİ METRİKLERİ ────────────────

async function getPreferredRepresentation(childId, category) {
  let events;
  if (category) {
    events = await getEventsByChildCategoryType(childId, category, 'question_answered');
  } else {
    events = await getEventsByChildAndType(childId, 'question_answered');
  }
  const counts = { somut: 0, gorsel: 0, sembolik: 0 };
  for (const e of events) {
    const rep = e.data.representationUsed;
    if (rep && counts[rep] !== undefined) counts[rep]++;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'sembolik';
}

async function getConcreteSupportRate(childId, category, timeRange) {
  let events = await getEventsByChildAndType(childId, 'concrete_support_accessed');
  if (category) events = events.filter(e => e.category === category);
  events = filterByTimeRange(events, timeRange);

  let totalQuestions;
  if (category) {
    totalQuestions = await getEventsByChildCategoryType(childId, category, 'question_answered');
  } else {
    totalQuestions = await getEventsByChildAndType(childId, 'question_answered');
  }
  totalQuestions = filterByTimeRange(totalQuestions, timeRange);

  if (totalQuestions.length === 0) return 0;
  return events.length / totalQuestions.length;
}

async function getRepresentationDistribution(childId, category) {
  let events;
  if (category) {
    events = await getEventsByChildCategoryType(childId, category, 'question_answered');
  } else {
    events = await getEventsByChildAndType(childId, 'question_answered');
  }
  const counts = { somut: 0, gorsel: 0, sembolik: 0 };
  for (const e of events) {
    const rep = e.data.representationUsed;
    if (rep && counts[rep] !== undefined) counts[rep]++;
  }
  const total = counts.somut + counts.gorsel + counts.sembolik;
  if (total === 0) return { somut: 0, gorsel: 0, sembolik: 0 };
  return {
    somut: Math.round((counts.somut / total) * 100),
    gorsel: Math.round((counts.gorsel / total) * 100),
    sembolik: Math.round((counts.sembolik / total) * 100),
  };
}

// ── TUTARLILIK METRİKLERİ ────────────────────

async function getConsistency(childId, category, windowSize = 20) {
  let events;
  if (category) {
    events = await getEventsByChildCategoryType(childId, category, 'question_answered');
  } else {
    events = await getEventsByChildAndType(childId, 'question_answered');
  }
  events.sort((a, b) => a.timestamp - b.timestamp);
  const recent = events.slice(-windowSize);

  if (recent.length < 5) return { accuracyVariance: 0, responseTimeVariance: 0, consistency: 'tutarli' };

  const accuracies = recent.map(e => e.data.isCorrect ? 1 : 0);
  const times = recent.map(e => e.data.responseTime_ms || 0);

  const accMean = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
  const accVar = accuracies.reduce((sum, v) => sum + (v - accMean) ** 2, 0) / accuracies.length;

  const timeMean = times.reduce((a, b) => a + b, 0) / times.length;
  const timeVar = times.reduce((sum, v) => sum + (v - timeMean) ** 2, 0) / times.length;

  let consistency = 'tutarli';
  if (accVar > 0.2 || timeVar > 4000000) consistency = 'dalgali';
  if (accVar > 0.35 || timeVar > 10000000) consistency = 'tutarsiz';

  return { accuracyVariance: accVar, responseTimeVariance: timeVar, consistency };
}

async function getWithinSessionTrend(sessionId) {
  const events = await getEventsBySession(sessionId);
  const questions = events
    .filter(e => e.eventType === 'question_answered')
    .sort((a, b) => a.timestamp - b.timestamp);

  if (questions.length < 6) {
    return {
      startAccuracy: 0, endAccuracy: 0,
      startResponseTime: 0, endResponseTime: 0,
      fatigueDetected: false, optimalDuration_ms: 0,
    };
  }

  const half = Math.floor(questions.length / 2);
  const firstHalf = questions.slice(0, half);
  const secondHalf = questions.slice(half);

  const startAcc = firstHalf.filter(e => e.data.isCorrect).length / firstHalf.length;
  const endAcc = secondHalf.filter(e => e.data.isCorrect).length / secondHalf.length;
  const startRT = firstHalf.reduce((s, e) => s + (e.data.responseTime_ms || 0), 0) / firstHalf.length;
  const endRT = secondHalf.reduce((s, e) => s + (e.data.responseTime_ms || 0), 0) / secondHalf.length;

  const fatigueDetected = endAcc < startAcc - 0.15 || endRT > startRT * 1.3;

  let optimalDuration_ms = 0;
  if (fatigueDetected && questions.length >= 8) {
    // Performansın düşmeye başladığı noktayı bul
    const windowSize = 3;
    let bestIdx = questions.length;
    for (let i = windowSize; i < questions.length - windowSize; i++) {
      const before = questions.slice(i - windowSize, i).filter(e => e.data.isCorrect).length / windowSize;
      const after = questions.slice(i, i + windowSize).filter(e => e.data.isCorrect).length / windowSize;
      if (after < before - 0.2) {
        bestIdx = i;
        break;
      }
    }
    if (bestIdx < questions.length) {
      optimalDuration_ms = questions[bestIdx].timestamp - questions[0].timestamp;
    }
  }

  return { startAccuracy: startAcc, endAccuracy: endAcc, startResponseTime: startRT, endResponseTime: endRT, fatigueDetected, optimalDuration_ms };
}

// ── HATA ÖRÜNTÜLERİ ─────────────────────────

async function getCommonErrors(childId, category) {
  let events;
  if (category) {
    events = await getEventsByChildCategoryType(childId, category, 'question_answered');
  } else {
    events = await getEventsByChildAndType(childId, 'question_answered');
  }
  const wrongAnswers = events.filter(e => !e.data.isCorrect);

  const errorMap = {};
  for (const e of wrongAnswers) {
    const errorType = e.data.errorType || classifyError(e.data).errorType;
    if (!errorMap[errorType]) {
      errorMap[errorType] = { errorType, frequency: 0, examples: [], lastOccurrence: null };
    }
    errorMap[errorType].frequency++;
    if (errorMap[errorType].examples.length < 3) {
      errorMap[errorType].examples.push({
        question: e.data.questionContent,
        given: e.data.givenAnswer,
        correct: e.data.targetAnswer,
      });
    }
    errorMap[errorType].lastOccurrence = new Date(e.timestamp);
  }

  return Object.values(errorMap).sort((a, b) => b.frequency - a.frequency);
}

function classifyError(data) {
  const given = data.givenAnswer;
  const correct = data.targetAnswer;

  if (given == null || correct == null) {
    return { errorType: 'bilinmeyen', description: 'Sınıflandırılamayan hata', severity: 'minor', suggestedIntervention: '' };
  }

  const diff = Number(given) - Number(correct);

  if (Math.abs(diff) === 1) {
    return {
      errorType: diff > 0 ? 'fazla_sayma' : 'eksik_sayma',
      description: diff > 0 ? '1 fazla saydı' : '1 eksik saydı',
      severity: 'minor',
      suggestedIntervention: 'Birebir eşleme ile sayma pratiği',
    };
  }

  if (Math.abs(diff) === 10 || Math.abs(diff) === 100) {
    return {
      errorType: 'basamak_hatasi',
      description: 'Basamak değeri karışıklığı',
      severity: 'significant',
      suggestedIntervention: 'Basamak değeri materyalleri ile çalışma',
    };
  }

  if (data.category === 'toplama_cikarma' && Number(given) === Math.abs(Number(correct))) {
    return {
      errorType: 'ters_islem',
      description: 'İşlem yönü hatası (toplama yerine çıkarma veya tersi)',
      severity: 'moderate',
      suggestedIntervention: 'İşlem sembolleri farkındalık çalışması',
    };
  }

  return {
    errorType: 'genel_hata',
    description: 'Genel hesaplama hatası',
    severity: 'moderate',
    suggestedIntervention: 'İlgili konuda somut materyal desteği ile tekrar',
  };
}

// ── KARŞILAŞTIRMALI METRİKLER ────────────────

async function compareSessionPerformance(childId, sessionId1, sessionId2) {
  const events1 = (await getEventsBySession(sessionId1)).filter(e => e.eventType === 'question_answered');
  const events2 = (await getEventsBySession(sessionId2)).filter(e => e.eventType === 'question_answered');

  const acc1 = events1.length > 0 ? events1.filter(e => e.data.isCorrect).length / events1.length : 0;
  const acc2 = events2.length > 0 ? events2.filter(e => e.data.isCorrect).length / events2.length : 0;

  const rt1 = events1.length > 0 ? events1.reduce((s, e) => s + (e.data.responseTime_ms || 0), 0) / events1.length : 0;
  const rt2 = events2.length > 0 ? events2.reduce((s, e) => s + (e.data.responseTime_ms || 0), 0) / events2.length : 0;

  const hint1 = events1.length > 0 ? events1.reduce((s, e) => s + (e.data.hintLevelUsed || 0), 0) / events1.length : 0;
  const hint2 = events2.length > 0 ? events2.reduce((s, e) => s + (e.data.hintLevelUsed || 0), 0) / events2.length : 0;

  // Kategori bazlı değişim
  const catPerf = {};
  for (const e of [...events1, ...events2]) {
    const cat = e.category;
    if (!cat) continue;
    if (!catPerf[cat]) catPerf[cat] = { s1: [], s2: [] };
    if (e.sessionId === sessionId1) catPerf[cat].s1.push(e.data.isCorrect ? 1 : 0);
    else catPerf[cat].s2.push(e.data.isCorrect ? 1 : 0);
  }

  const improved = [], declined = [];
  for (const [cat, data] of Object.entries(catPerf)) {
    const a1 = data.s1.length > 0 ? data.s1.reduce((a, b) => a + b, 0) / data.s1.length : 0;
    const a2 = data.s2.length > 0 ? data.s2.reduce((a, b) => a + b, 0) / data.s2.length : 0;
    if (a2 > a1 + 0.1) improved.push(cat);
    else if (a2 < a1 - 0.1) declined.push(cat);
  }

  return {
    accuracyChange: acc2 - acc1,
    responseTimeChange: rt2 - rt1,
    hintUsageChange: hint2 - hint1,
    categoriesImproved: improved,
    categoriesDeclined: declined,
  };
}

async function getPeriodicComparison(childId, period = 'weekly') {
  const now = new Date();
  const periodMs = period === 'weekly' ? 7 * 86400000 : 30 * 86400000;

  const currentStart = now.getTime() - periodMs;
  const previousStart = currentStart - periodMs;

  const currentRange = { start: currentStart, end: now.getTime() };
  const previousRange = { start: previousStart, end: currentStart };

  const [curAcc, prevAcc, curRT, prevRT, curHint, prevHint] = await Promise.all([
    getOverallAccuracy(childId, currentRange),
    getOverallAccuracy(childId, previousRange),
    getAvgResponseTime(childId, null, currentRange),
    getAvgResponseTime(childId, null, previousRange),
    getAvgHintLevel(childId, null, currentRange),
    getAvgHintLevel(childId, null, previousRange),
  ]);

  return {
    currentPeriod: { accuracy: curAcc, avgResponseTime: curRT, avgHintLevel: curHint },
    previousPeriod: { accuracy: prevAcc, avgResponseTime: prevRT, avgHintLevel: prevHint },
    change: {
      accuracy: curAcc - prevAcc,
      responseTime: curRT - prevRT,
      hintLevel: curHint - prevHint,
    },
  };
}

// ── TOPLU PROFİL VERİSİ ─────────────────────

async function getFullPerformanceProfile(childId) {
  const results = {};

  results.overallAccuracy = await getOverallAccuracy(childId);

  results.categoryMetrics = {};
  for (const cat of CATEGORIES) {
    const [accuracy, avgRT, medianRT, avgHint, hintDep, rtTrend] = await Promise.all([
      getCategoryAccuracy(childId, cat),
      getAvgResponseTime(childId, cat),
      getMedianResponseTime(childId, cat),
      getAvgHintLevel(childId, cat),
      getHintDependencyRate(childId, cat),
      getResponseTimeTrend(childId, cat),
    ]);
    results.categoryMetrics[cat] = { accuracy, avgRT, medianRT, avgHint, hintDep, rtTrend };
  }

  results.representationDist = await getRepresentationDistribution(childId);
  results.consistency = await getConsistency(childId);

  return results;
}

export {
  CATEGORIES,
  getOverallAccuracy,
  getCategoryAccuracy,
  getModuleAccuracy,
  getFirstAttemptAccuracy,
  getAvgResponseTime,
  getMedianResponseTime,
  getResponseTimeTrend,
  getAvgHintLevel,
  getHintDependencyRate,
  getHintEffectiveness,
  getPreferredRepresentation,
  getConcreteSupportRate,
  getRepresentationDistribution,
  getConsistency,
  getWithinSessionTrend,
  getCommonErrors,
  classifyError,
  compareSessionPerformance,
  getPeriodicComparison,
  getFullPerformanceProfile,
};
