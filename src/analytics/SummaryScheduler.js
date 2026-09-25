// GalakSay Analytics — Günlük/haftalık özet hesaplama zamanlayıcısı
// 2026-09-25: yerel takvim günü (UTC kayması düzeltildi), aynı gün×kategori satırı
// güncellenir (her oturumda kopya satır üretilmiyor), totalTimeMs oturum sürelerinden.

import { STORES, putRecord, getDailySummaries, getSessionsByChild, queryByIndex } from './database.js';
import { CATEGORIES, localDateKey, localDayRange, getCategoryStats, getConcreteSupportRate } from './PerformanceAnalyzer.js';
import { getCurrentLTLevels, checkLevelUpCriteria, checkLevelDownCriteria, updateLTLevel } from './LTProgressEngine.js';
import { checkAlerts } from './AlertSystem.js';
import { trackEvent } from './EventCollector.js';

// Her oturum sonunda çağrılır
async function onSessionEnd(childId, sessionId, sessionSummary = {}) {
  try {
    // 1. Günlük özet güncelle (yerel gün)
    const today = localDateKey(new Date());
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

    // 4. Haftalık özet — her oturum sonunda içinde bulunulan haftayı güncelle
    const weekStart = getWeekStart(new Date());
    await calculateWeeklySummary(childId, weekStart);

    return { ltLevelUps, ltLevelDowns, alerts };
  } catch (err) {
    console.error('SummaryScheduler onSessionEnd error:', err);
    return { ltLevelUps: [], ltLevelDowns: [], alerts: [] };
  }
}

// Günlük özet hesapla — date: yerel gün anahtarı (YYYY-MM-DD)
async function calculateDailySummary(childId, date) {
  const { start: dayStart, end: dayEnd } = localDayRange(date);
  const timeRange = { start: dayStart, end: dayEnd };

  const ltLevels = await getCurrentLTLevels(childId);
  const sessions = await getSessionsByChild(childId).catch(() => []);
  const sessionById = new Map((sessions || []).map(s => [s.sessionId, s]));

  for (const cat of CATEGORIES) {
    const [st, concreteRate] = await Promise.all([
      getCategoryStats(childId, cat, timeRange),
      getConcreteSupportRate(childId, cat, timeRange),
    ]);
    if (st.n === 0) continue;

    const events = await queryByIndex(STORES.EVENTS, 'byChildCategory', [childId, cat, 'question_answered']);
    const dayEvents = events.filter(e => e.timestamp >= dayStart && e.timestamp <= dayEnd);
    const uniqueSessions = new Set(dayEvents.map(e => e.sessionId).filter(Boolean));
    // Bu güne düşen oturumların toplam süresi (oturum birden çok kategori içerebilir;
    // kategori satırları arasında paylaştırılmaz — "o gün bu kategoriyi içeren oturumların süresi").
    const totalTimeMs = [...uniqueSessions].reduce((s, id) => s + (Number(sessionById.get(id)?.durationMs) || 0), 0);

    // Aynı çocuk×gün×kategori satırı varsa güncelle (autoIncrement id korunur)
    const existing = await queryByIndex(STORES.DAILY_SUMMARY, 'byChildDateCategory', [childId, date, cat]).catch(() => []);
    const prev = existing && existing.length ? existing[0] : null;

    const summary = {
      ...(prev && prev.id !== undefined ? { id: prev.id } : {}),
      childId,
      date,
      category: cat,
      questionsAttempted: st.n,
      questionsCorrect: st.correct,
      accuracy: Number((st.accuracy ?? 0).toFixed(4)),
      avgResponseTimeMs: Math.round(st.avgRT ?? 0),
      medianResponseTimeMs: Math.round(st.medianRT ?? 0),
      avgHintLevel: Number((st.avgHint ?? 0).toFixed(2)),
      hintDependencyRate: Number((st.hintDep ?? 0).toFixed(2)),
      concreteSupportRate: Number((concreteRate ?? 0).toFixed(2)),
      ltLevel: ltLevels[cat]?.level || 0,
      sessionCount: uniqueSessions.size,
      totalTimeMs,
      updatedAt: new Date().toISOString(),
    };

    await putRecord(STORES.DAILY_SUMMARY, summary);
  }
}

// Haftalık özet hesapla
async function calculateWeeklySummary(childId, weekStart) {
  const [y, m, d] = String(weekStart).split('-').map(Number);
  const weekEnd = localDateKey(new Date(y, m - 1, d + 6)); // Pazartesi..Pazar (dahil)

  const dailySummaries = await getDailySummaries(childId, weekStart, weekEnd);
  const existingWeekly = await queryByIndex(STORES.WEEKLY_SUMMARY, 'byChildWeek', [childId, weekStart]).catch(() => []);

  // Kategoriye göre grupla
  const byCat = {};
  for (const s of dailySummaries) {
    if (!byCat[s.category]) byCat[s.category] = [];
    byCat[s.category].push(s);
  }

  for (const [cat, summaries] of Object.entries(byCat)) {
    summaries.sort((a, b) => String(a.date).localeCompare(String(b.date)));
    const totalQ = summaries.reduce((s, d) => s + d.questionsAttempted, 0);
    const totalC = summaries.reduce((s, d) => s + d.questionsCorrect, 0);
    const prev = (existingWeekly || []).find(w => w.category === cat);

    const weekly = {
      ...(prev && prev.id !== undefined ? { id: prev.id } : {}),
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

// Haftanın Pazartesi'si (yerel gün anahtarı)
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Pazartesi başlangıç
  return localDateKey(new Date(d.getFullYear(), d.getMonth(), diff));
}

export { onSessionEnd, calculateDailySummary, calculateWeeklySummary, getWeekStart };
