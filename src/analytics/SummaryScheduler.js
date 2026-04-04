// GalakSay Analytics — 2026-03-18 — Günlük/haftalık özet hesaplama zamanlayıcısı

import { STORES, putRecord, getDailySummaries, getWeeklySummaries, getEventsBySession, queryByIndex } from './database.js';
import { CATEGORIES, getCategoryAccuracy, getAvgResponseTime, getAvgHintLevel, getHintDependencyRate, getConcreteSupportRate } from './PerformanceAnalyzer.js';
import { getCurrentLTLevels, checkLevelUpCriteria, checkLevelDownCriteria, updateLTLevel } from './LTProgressEngine.js';
import { calculateRiskLevel } from './RiskClassifier.js';
import { checkAlerts } from './AlertSystem.js';
import { trackEvent } from './EventCollector.js';

// Her oturum sonunda çağrılır
async function onSessionEnd(childId, sessionId, sessionSummary = {}) {
  try {
    // 1. Günlük özet güncelle
    const today = new Date().toISOString().slice(0, 10);
    await calculateDailySummary(childId, today);

    // 2. LT düzeyi geçiş kontrolü
    const ltLevelUps = [];
    const ltLevelDowns = [];

    for (const cat of CATEGORIES) {
      // Yukarı geçiş
      const upCheck = await checkLevelUpCriteria(childId, cat);
      if (upCheck.eligible) {
        const newLevel = upCheck.currentLevel + 1;
        await updateLTLevel(childId, cat, newLevel, 'up', upCheck.criteria);
        ltLevelUps.push({ category: cat, previousLevel: upCheck.currentLevel, newLevel });
        trackEvent('lt_level_up', { category: cat, previousLevel: upCheck.currentLevel, newLevel, criteriaSnapshot: upCheck.criteria }, { category: cat });
      }

      // Aşağı düşme
      const downCheck = await checkLevelDownCriteria(childId, cat);
      if (downCheck.shouldDrop) {
        await updateLTLevel(childId, cat, downCheck.suggestedLevel, 'down', downCheck.evidence);
        ltLevelDowns.push({ category: cat, previousLevel: downCheck.currentLevel, newLevel: downCheck.suggestedLevel, reason: downCheck.reason });
        trackEvent('lt_level_down', { category: cat, previousLevel: downCheck.currentLevel, newLevel: downCheck.suggestedLevel, reason: downCheck.reason }, { category: cat });
      }
    }

    // 3. Uyarıları kontrol et
    const alerts = await checkAlerts(childId, {
      ...sessionSummary,
      ltLevelUps,
      ltLevelDowns,
    });

    // 4. Haftalık özet (pazar günü ise veya 7 oturumda bir)
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 0) {
      const weekStart = getWeekStart(new Date());
      await calculateWeeklySummary(childId, weekStart);
    }

    return { ltLevelUps, ltLevelDowns, alerts };
  } catch (err) {
    console.error('SummaryScheduler onSessionEnd error:', err);
    return { ltLevelUps: [], ltLevelDowns: [], alerts: [] };
  }
}

// Günlük özet hesapla
async function calculateDailySummary(childId, date) {
  const dayStart = new Date(date + 'T00:00:00').getTime();
  const dayEnd = new Date(date + 'T23:59:59').getTime();
  const timeRange = { start: dayStart, end: dayEnd };

  const ltLevels = await getCurrentLTLevels(childId);

  for (const cat of CATEGORIES) {
    const [accuracy, avgRT, avgHint, hintDep, concreteRate] = await Promise.all([
      getCategoryAccuracy(childId, cat, timeRange),
      getAvgResponseTime(childId, cat, timeRange),
      getAvgHintLevel(childId, cat, timeRange),
      getHintDependencyRate(childId, cat, timeRange),
      getConcreteSupportRate(childId, cat, timeRange),
    ]);

    // Soru sayısı hesapla
    const events = await queryByIndex(STORES.EVENTS, 'byChildCategory', [childId, cat, 'question_answered']);
    const dayEvents = events.filter(e => e.timestamp >= dayStart && e.timestamp <= dayEnd);
    const questionsAttempted = dayEvents.length;
    const questionsCorrect = dayEvents.filter(e => e.data.isCorrect).length;

    if (questionsAttempted === 0) continue;

    // Oturum sayısı ve süre
    const sessionEvents = events.filter(e => e.timestamp >= dayStart && e.timestamp <= dayEnd);
    const uniqueSessions = new Set(sessionEvents.map(e => e.sessionId));

    const summary = {
      childId,
      date,
      category: cat,
      questionsAttempted,
      questionsCorrect,
      accuracy,
      avgResponseTimeMs: Math.round(avgRT),
      avgHintLevel: Number(avgHint.toFixed(2)),
      hintDependencyRate: Number(hintDep.toFixed(2)),
      concreteSupportRate: Number(concreteRate.toFixed(2)),
      ltLevel: ltLevels[cat]?.level || 0,
      sessionCount: uniqueSessions.size,
      totalTimeMs: 0, // oturum sürelerinden hesaplanabilir
    };

    await putRecord(STORES.DAILY_SUMMARY, summary);
  }
}

// Haftalık özet hesapla
async function calculateWeeklySummary(childId, weekStart) {
  const weekEnd = new Date(new Date(weekStart).getTime() + 7 * 86400000).toISOString().slice(0, 10);

  const dailySummaries = await getDailySummaries(childId, weekStart, weekEnd);

  // Kategoriye göre grupla
  const byCat = {};
  for (const s of dailySummaries) {
    if (!byCat[s.category]) byCat[s.category] = [];
    byCat[s.category].push(s);
  }

  for (const [cat, summaries] of Object.entries(byCat)) {
    const totalQ = summaries.reduce((s, d) => s + d.questionsAttempted, 0);
    const totalC = summaries.reduce((s, d) => s + d.questionsCorrect, 0);

    const weekly = {
      childId,
      weekStart,
      category: cat,
      accuracy: totalQ > 0 ? totalC / totalQ : 0,
      avgResponseTimeMs: Math.round(summaries.reduce((s, d) => s + d.avgResponseTimeMs, 0) / summaries.length),
      avgHintLevel: Number((summaries.reduce((s, d) => s + d.avgHintLevel, 0) / summaries.length).toFixed(2)),
      ltLevelStart: summaries[0]?.ltLevel || 0,
      ltLevelEnd: summaries[summaries.length - 1]?.ltLevel || 0,
      modulesCompleted: 0,
      totalTimeMs: summaries.reduce((s, d) => s + (d.totalTimeMs || 0), 0),
    };

    await putRecord(STORES.WEEKLY_SUMMARY, weekly);
  }
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Pazartesi başlangıç
  return new Date(d.setDate(diff)).toISOString().slice(0, 10);
}

export { onSessionEnd, calculateDailySummary, calculateWeeklySummary };
