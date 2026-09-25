// GalakSay Analytics — 2026-03-18 — Çok boyutlu performans analiz motoru

import {
  getEventsByChildAndType,
  getEventsByChildCategoryType,
  getEventsBySession,
} from './database.js';
import { ERROR_LABELS } from '../utils/errorClassifier.js';

const CATEGORIES = [
  'sayma', 'subitizing', 'karsilastirma', 'sayi_bilesimi',
  'basamak_degeri', 'toplama_cikarma', 'carpma_bolme', 'oruntu'
];

// ── ÖRNEKLEM EŞİKLERİ (2026-09-25) ─────────────
// Bir kategori hakkında yargı (güçlü/zayıf/risk) verebilmek için en az MIN_ITEMS_CATEGORY
// cevaplanmış madde gerekir: n=8'de tek bir madde doğruluğu en fazla 12,5 puan oynatır;
// daha azında "%0 doğruluk" gibi yanıltıcı özetler çıkar (yeni çocukta her kategori
// "zayıf" görünüyordu). Genel risk için MIN_ITEMS_OVERALL madde gerekir.
const MIN_ITEMS_CATEGORY = 8;
const MIN_ITEMS_OVERALL = 15;

// ── YARDIMCI FONKSİYONLAR ──────────────────────

/** Yerel takvim günü anahtarı (YYYY-MM-DD). toISOString() UTC günü verir; Türkiye'de
 *  (UTC+3) gece 00:00–03:00 arası oturumlar bir önceki güne yazılıyordu. */
function localDateKey(d = new Date()) {
  const x = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(x.getTime())) return '';
  const p = (n) => String(n).padStart(2, '0');
  return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}`;
}

/** Yerel günün [başlangıç, bitiş] epoch-ms aralığı. */
function localDayRange(dateKey) {
  const [y, m, d] = String(dateKey).split('-').map(Number);
  const start = new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0).getTime();
  const end = new Date(y, (m || 1) - 1, d || 1, 23, 59, 59, 999).getTime();
  return { start, end };
}

const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

/** Kategori verilirse o kategorinin, verilmezse çocuğun tüm question_answered olayları. */
async function getAnsweredEvents(childId, category, timeRange) {
  const events = category
    ? await getEventsByChildCategoryType(childId, category, 'question_answered')
    : await getEventsByChildAndType(childId, 'question_answered');
  return filterByTimeRange(events, timeRange);
}

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
  return { slope, confidence: Math.max(0, r2) };
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

// ── ÖRNEKLEM-BİLİNÇLİ İSTATİSTİK ──────────────

/**
 * Tek geçişte kategori (veya genel) istatistiği. accuracy n=0 iken null döner (0 değil):
 * "veri yok" ile "%0" ayrımı rapor ve risk hesabı için kritiktir.
 */
async function getCategoryStats(childId, category, timeRange) {
  const events = await getAnsweredEvents(childId, category, timeRange);
  const n = events.length;
  if (n === 0) {
    return { n: 0, correct: 0, accuracy: null, avgRT: null, medianRT: null, avgHint: null, hintDep: null, concreteRate: null, sufficient: false };
  }
  const correct = events.filter(e => e.data?.isCorrect).length;
  const times = events.map(e => toNum(e.data?.responseTime_ms)).filter(t => t > 0);
  const hints = events.map(e => toNum(e.data?.hintLevelUsed));
  const concrete = events.filter(e => e.data?.representationUsed === 'somut').length;
  return {
    n,
    correct,
    accuracy: correct / n,
    avgRT: times.length ? times.reduce((a, b) => a + b, 0) / times.length : null,
    medianRT: times.length ? median(times) : null,
    avgHint: hints.reduce((a, b) => a + b, 0) / n,
    hintDep: hints.filter(h => h > 0).length / n,
    concreteRate: concrete / n,
    sufficient: n >= MIN_ITEMS_CATEGORY,
  };
}

/**
 * Günlük eğilim serisi (son `days` gün, yerel takvim günü). Doğrudan olaylardan hesaplanır;
 * daily_performance_summary'ye bağımlı değildir (o tablo yalnız oturum düzgün kapandığında dolar).
 * @returns {Promise<Array<{date:string, label:string, n:number, accuracy:number, medianRT_ms:number|null, avgHint:number}>>}
 */
async function getDailyTrend(childId, days = 30) {
  const start = Date.now() - days * 86400000;
  const events = (await getAnsweredEvents(childId, null, { start, end: Date.now() }))
    .filter(e => Number.isFinite(e.timestamp));
  const byDay = new Map();
  for (const e of events) {
    const key = localDateKey(new Date(e.timestamp));
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(e);
  }
  return [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, evs]) => {
    const n = evs.length;
    const correct = evs.filter(e => e.data?.isCorrect).length;
    const times = evs.map(e => toNum(e.data?.responseTime_ms)).filter(t => t > 0);
    const hints = evs.map(e => toNum(e.data?.hintLevelUsed));
    return {
      date,
      label: `${date.slice(8, 10)}.${date.slice(5, 7)}`, // GG.AA
      n,
      accuracy: Math.round((correct / n) * 100),
      medianRT_ms: times.length ? Math.round(median(times)) : null,
      avgHint: Number((hints.reduce((a, b) => a + b, 0) / n).toFixed(2)),
    };
  });
}

// ── DOZ VE UYUM ────────────────────────────
// Kohn ve ark. (2020) Calcularis RKÇ protokolü: ≥42 oturum × 20 dk (≈14 saat), ≤13 hafta,
// haftada 3–5 oturum. Doz–yanıt meta-analizi (2025): her +1 saat ≈ +0,03 etki büyüklüğü.
const DOSE_TARGET = { sessions: 42, minutesPerSession: 20, weeklySessions: 3, weeks: 13 };

/** Gerçek oturum: en az 1 soru cevaplanmış VEYA ≥1 dk sürmüş (çocuk seçilir seçilmez
 *  açılan ve hiç oynanmayan "boş" oturum kayıtları doz/oturum sayımına girmez). */
function isRealSession(s) {
  if (!s || !s.startTime || Number.isNaN(new Date(s.startTime).getTime())) return false;
  return (Number(s.questionsAttempted) || 0) > 0 || (Number(s.durationMs) || 0) >= 60000;
}
const realSessions = (sessions) => (sessions || []).filter(isRealSession);

/** Haftanın Pazartesi 00:00'ı (yerel). */
function weekStartMs(d = new Date()) {
  const x = new Date(d);
  const day = x.getDay();
  const diff = x.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(x.getFullYear(), x.getMonth(), diff, 0, 0, 0, 0).getTime();
}

/**
 * Saf: oturum kayıtlarından doz/uyum göstergesi.
 * @param {Array<{startTime?:string, durationMs?:number, questionsAttempted?:number}>} sessions
 */
function computeDose(sessions, now = Date.now()) {
  const valid = realSessions(sessions);
  const times = valid.map(s => new Date(s.startTime).getTime()).sort((a, b) => a - b);
  const sessionsDone = valid.length;
  const minutesDone = Math.round(valid.reduce((a, s) => a + (Number(s.durationMs) || 0), 0) / 60000);
  const ws = weekStartMs(new Date(now));
  const weekSessions = times.filter(t => t >= ws && t <= now).length;
  const firstSession = times[0] ?? null;
  const lastSession = times[times.length - 1] ?? null;
  const daysSinceLast = lastSession != null ? Math.floor((now - lastSession) / 86400000) : null;
  const weeksActive = firstSession != null ? Math.max(1, Math.ceil((now - firstSession) / (7 * 86400000))) : 0;
  const targetMinutes = DOSE_TARGET.sessions * DOSE_TARGET.minutesPerSession;
  let weekStatus = 'none';
  if (weekSessions >= DOSE_TARGET.weeklySessions) weekStatus = 'met';
  else if (weekSessions > 0) weekStatus = 'partial';
  // Hafta başındaysak (Pzt–Salı) 0 oturum henüz sorun değil → 'early'
  const dayOfWeek = new Date(now).getDay(); // 0 Paz … 1 Pzt
  if (weekStatus === 'none' && (dayOfWeek === 1 || dayOfWeek === 2) && daysSinceLast != null && daysSinceLast <= 7) weekStatus = 'early';
  return {
    sessionsDone,
    minutesDone,
    targetSessions: DOSE_TARGET.sessions,
    targetMinutes,
    pctSessions: Math.min(100, Math.round((sessionsDone / DOSE_TARGET.sessions) * 100)),
    pctMinutes: Math.min(100, Math.round((minutesDone / targetMinutes) * 100)),
    remainingSessions: Math.max(0, DOSE_TARGET.sessions - sessionsDone),
    weekSessions,
    weekTarget: DOSE_TARGET.weeklySessions,
    weekStatus, // 'met' | 'partial' | 'none' | 'early'
    weeksActive,
    targetWeeks: DOSE_TARGET.weeks,
    firstSession,
    lastSession,
    daysSinceLast,
    complete: sessionsDone >= DOSE_TARGET.sessions,
  };
}

// ── İLERLEME İZLEME (hedef çizgisi + NCII 4-nokta kuralı) ──
// Oturum bazlı doğruluk noktaları; hedef çizgisi ilk oturum doğruluğundan 42. oturumda %80'e
// doğrusal çıkar (ilk oturum zaten ≥%80 ise düz %80). Karar (≥6 nokta): son 4 nokta hedefin
// altındaysa "öğretimi yoğunlaştır", üstündeyse "hedefi yükselt", aksi halde "devam".
const GOAL_ACCURACY = 80;

function computeProgressMonitoring(sessions, { goal = GOAL_ACCURACY, horizon = DOSE_TARGET.sessions, minPoints = 6 } = {}) {
  const pts = realSessions(sessions)
    .filter(s => (Number(s.questionsAttempted) || 0) > 0)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .map((s, i) => ({
      index: i + 1,
      date: new Date(s.startTime).getTime(),
      n: Number(s.questionsAttempted) || 0,
      accuracy: Math.round(((Number(s.questionsCorrect) || 0) / (Number(s.questionsAttempted) || 1)) * 100),
    }));
  const n = pts.length;
  if (n === 0) return { points: [], aimline: [], goal, decision: 'insufficient', minPoints, belowCount: 0, slope: null };
  const start = Math.min(goal, pts[0].accuracy);
  const aimAt = (i) => (i >= horizon ? goal : start + (goal - start) * ((i - 1) / Math.max(1, horizon - 1)));
  const aimline = pts.map(p => ({ index: p.index, value: Math.round(aimAt(p.index)) }));
  const last4 = pts.slice(-4);
  let decision = 'insufficient';
  let belowCount = 0;
  if (n >= minPoints) {
    belowCount = last4.filter(p => p.accuracy < aimAt(p.index)).length;
    const aboveCount = last4.filter(p => p.accuracy > aimAt(p.index)).length;
    decision = belowCount === 4 ? 'intensify' : aboveCount === 4 ? 'raise_goal' : 'continue';
  }
  const { slope } = linearRegression(pts.map(p => p.accuracy));
  return { points: pts, aimline, goal, decision, minPoints, belowCount, slope: n >= 3 ? Number(slope.toFixed(2)) : null };
}

// ── HATA PROFİLİ ───────────────────────────
// question_answered.data.errorType (AnalyticsBridge → utils/errorClassifier.classifyAnswer)
const TEACHER_ERROR_GUIDANCE = {
  off_by_one: 'Birebir eşleme ile yavaş sayma; "son söylediğin sayı kaç tane olduğunu söyler" (kardinalite) vurgusu; parmak/nesne desteği.',
  operation_swap: 'İşlem sembolünü sesli okutma ve somut modelle (ekle/çıkar) eşleştirme; karışık işlemli kısa setler.',
  procedural: 'Onluk–birlik bloklarla basamak modeli; elde/onluk bozma adımlarını sesli düşünme ile gösterme.',
  sign_error: '"Daha çok / daha az" dilini nesnelerle eşleştirme; sayı doğrusunda yön çalışması.',
  magnitude: 'Sayı doğrusu tahmin oyunları (0–10, 0–20, 0–100); iki sayının uzaklığını konuşma.',
  conceptual: 'Kavramı somut, görsel, sembolik sırasıyla yeniden kurma; üçlü kod gösterimini açık tutma.',
  attention: 'Kısa ve sık oturum; soruyu birlikte yeniden okuma; "önce düşün, sonra dokun" rutini.',
  skip: 'Cevaplamadan geçilen sorular: kaygı/yorgunluk işareti olabilir; oturumu kısaltma ve teşvik.',
  random: 'Belirgin örüntü yok; ipucu kademesini bir basamak artırıp gözlem sürdürülmeli.',
};
const ERROR_TYPE_LABELS = { ...ERROR_LABELS, bilinmeyen: 'Sınıflandırılamayan', genel_hata: 'Genel hesaplama', fazla_sayma: 'Fazla sayma', eksik_sayma: 'Eksik sayma', basamak_hatasi: 'Basamak hatası', ters_islem: 'Ters işlem' };

/**
 * En sık hata tipleri (yanlış cevaplar içindeki payı) + öğretmen önerisi.
 * @returns {Promise<{n:number, wrong:number, top:Array<{type:string,label:string,count:number,pct:number,guidance:string}>, hasErrorTypes:boolean}>}
 */
async function getErrorProfile(childId, category, timeRange, topN = 3) {
  const events = await getAnsweredEvents(childId, category, timeRange);
  const wrong = events.filter(e => !e.data?.isCorrect);
  const counts = {};
  let typed = 0;
  for (const e of wrong) {
    const t = e.data?.errorType;
    if (!t || t === 'correct') continue;
    typed++;
    counts[t] = (counts[t] || 0) + 1;
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, topN).map(([type, count]) => ({
    type,
    label: ERROR_TYPE_LABELS[type] || type.replace(/_/g, ' '),
    count,
    pct: Math.round((count / wrong.length) * 100),
    guidance: TEACHER_ERROR_GUIDANCE[type] || 'İlgili alanda somut materyal desteğiyle tekrar.',
  }));
  return { n: events.length, wrong: wrong.length, typed, top, hasErrorTypes: typed > 0 };
}

// ── TOPLU PROFİL VERİSİ ─────────────────────

async function getFullPerformanceProfile(childId) {
  const results = {};

  // Genel: n, doğruluk, medyan tepki süresi, ilk/son madde tarihi
  const all = await getAnsweredEvents(childId, null);
  const overall = await getCategoryStats(childId, null);
  results.totalAnswered = overall.n;
  results.totalCorrect = overall.correct;
  results.overallAccuracy = overall.accuracy ?? 0;      // geriye uyumlu (0 = veri yok)
  results.overallAccuracyOrNull = overall.accuracy;     // null = veri yok
  results.overallMedianRT = overall.medianRT;
  results.overallAvgHint = overall.avgHint ?? 0;
  results.sufficient = overall.n >= MIN_ITEMS_OVERALL;
  const ts = all.map(e => e.timestamp).filter(Number.isFinite);
  results.firstAnsweredAt = ts.length ? Math.min(...ts) : null;
  results.lastAnsweredAt = ts.length ? Math.max(...ts) : null;

  results.categoryMetrics = {};
  for (const cat of CATEGORIES) {
    const [st, rtTrend] = await Promise.all([
      getCategoryStats(childId, cat),
      getResponseTimeTrend(childId, cat),
    ]);
    results.categoryMetrics[cat] = {
      n: st.n,
      sufficient: st.sufficient,
      accuracy: st.accuracy ?? 0,          // geriye uyumlu
      accuracyOrNull: st.accuracy,
      avgRT: st.avgRT ?? 0,
      medianRT: st.medianRT ?? 0,
      avgHint: st.avgHint ?? 0,
      hintDep: st.hintDep ?? 0,
      concreteRate: st.concreteRate ?? 0,
      // Eğilim yalnız yeterli veriyle anlamlı; aksi halde 'insufficient'
      rtTrend: st.n >= 5 ? rtTrend : { direction: 'insufficient', slope: 0, confidence: 0 },
    };
  }

  results.representationDist = await getRepresentationDistribution(childId);
  results.consistency = await getConsistency(childId);
  results.dailyTrend = await getDailyTrend(childId, 30);
  results.errorProfile = await getErrorProfile(childId);

  return results;
}

export {
  CATEGORIES,
  MIN_ITEMS_CATEGORY,
  MIN_ITEMS_OVERALL,
  localDateKey,
  localDayRange,
  median,
  getAnsweredEvents,
  getCategoryStats,
  getDailyTrend,
  DOSE_TARGET,
  GOAL_ACCURACY,
  isRealSession,
  realSessions,
  computeDose,
  computeProgressMonitoring,
  getErrorProfile,
  TEACHER_ERROR_GUIDANCE,
  ERROR_TYPE_LABELS,
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
