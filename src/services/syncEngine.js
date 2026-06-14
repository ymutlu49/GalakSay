// Galaksay — Merkezi havuz senkron motoru (oyun ilerlemesi → getnumap.com).
//
// Bir çocuğun (ns = "numap_<studentKey>") IndexedDB'deki YENİ oyun verisini
// (oturum + madde-düzey event blob + LT geçişi + günlük özet) toplayıp Numap
// `POST /api/game-progress`'e batch gönderir. Idempotent (sunucu PK upsert) →
// tekrar gönderme zararsız; watermark yalnız OPTİMİZASYON (kaybı güvenli).
//
// KVKK: dataSync rızası (consent) YOKSA hiçbir ağ çağrısı yapılmaz — çocuk verisi
// sunucuya ASLA gitmez (varsayılan kapalı). Token yoksa veya çevrimdışıysa kuyruğa
// alınır, sonra (açılış / online) otomatik gönderilir.

import { isDataSyncEnabled } from '../utils/consent.js';
import { postGameProgress, getToken } from './numapApi.js';
import {
  getSessionsByChild,
  getEventsByChildAndType,
  getLTHistoryByChild,
  getDailySummaries,
} from '../analytics/database.js';

const WM_KEY = (ns) => `galaksay_sync_wm_${ns}`;
const QUEUE_KEY = 'galaksay_sync_queue';

const ms = (v) => {
  const t = new Date(v).getTime();
  return Number.isFinite(t) ? t : 0;
};

function loadWm(ns) {
  try { return JSON.parse(localStorage.getItem(WM_KEY(ns))) || {}; } catch { return {}; }
}
function saveWm(ns, wm) {
  try { localStorage.setItem(WM_KEY(ns), JSON.stringify(wm)); } catch { /* depolama engelli */ }
}
function loadQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []; } catch { return []; }
}
function saveQueue(q) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); } catch { /* depolama engelli */ }
}
function enqueue(ns) {
  const q = loadQueue();
  if (!q.includes(ns)) { q.push(ns); saveQueue(q); }
}
function dequeue(ns) {
  saveQueue(loadQueue().filter((x) => x !== ns));
}

/** Kuyrukta bekleyen çocuk sayısı (UI rozeti için). */
export function pendingSyncCount() {
  return loadQueue().length;
}

// game_events (question_answered) → oturum×kategori blob (madde dizisi).
function groupEvents(ns, events) {
  const map = new Map();
  for (const e of events) {
    if (!e?.sessionId || !e?.category) continue;
    const key = `${e.sessionId}|${e.category}`;
    let g = map.get(key);
    if (!g) { g = { sessionId: e.sessionId, category: e.category, childId: ns, items: [] }; map.set(key, g); }
    const d = e.data || {};
    g.items.push({
      givenAnswer: d.givenAnswer, isCorrect: d.isCorrect, responseTime_ms: d.responseTime_ms,
      hintLevelUsed: d.hintLevelUsed, representationUsed: d.representationUsed, targetAnswer: d.targetAnswer,
      questionContent: d.questionContent, errorType: d.errorType, errorSeverity: d.errorSeverity,
      timestamp: e.timestamp,
    });
  }
  return [...map.values()];
}

function mapSession(s) {
  return {
    sessionId: s.sessionId, childId: s.childId, startTime: s.startTime, endTime: s.endTime,
    durationMs: s.durationMs, questionsAttempted: s.questionsAttempted, questionsCorrect: s.questionsCorrect,
    categoriesVisited: s.categoriesVisited, deviceType: s.deviceType, appVersion: s.appVersion,
  };
}
function mapLt(t) {
  return {
    childId: t.childId, category: t.category, fromLevel: t.from_level, toLevel: t.to_level,
    direction: t.direction, criteriaSnapshot: t.criteria_snapshot, occurredAt: t.timestamp,
  };
}

async function collectDaily(ns) {
  const end = new Date().toISOString().slice(0, 10);
  const start = new Date(Date.now() - 120 * 86400000).toISOString().slice(0, 10);
  const rows = await getDailySummaries(ns, start, end);
  return (rows || []).map((d) => ({
    childId: ns, date: d.date, category: d.category,
    questionsAttempted: d.questionsAttempted, questionsCorrect: d.questionsCorrect, accuracy: d.accuracy,
    avgResponseTimeMs: d.avgResponseTimeMs, avgHintLevel: d.avgHintLevel,
    hintDependencyRate: d.hintDependencyRate, concreteSupportRate: d.concreteSupportRate,
    ltLevel: d.ltLevel, sessionCount: d.sessionCount,
  }));
}

/**
 * Bir çocuğun yeni verisini merkezi havuza gönderir.
 * dataSync rızası/token yoksa no-op; çevrimdışıysa kuyruğa alır.
 * @param {string} ns  childId (= "numap_<studentKey>")
 */
export async function syncChild(ns) {
  const dbg = (m, x) => { try { console.log('[GalakSay sync]', m, x === undefined ? '' : x); } catch {} };
  dbg('syncChild çağrıldı', { ns, dataSync: isDataSyncEnabled(), token: !!getToken(), online: typeof navigator !== 'undefined' ? navigator.onLine : 'n/a' });
  if (!ns || !isDataSyncEnabled() || !getToken()) { dbg('ATLANDI — ns/rıza/token eksik'); return { skipped: true }; }
  if (typeof navigator !== 'undefined' && navigator.onLine === false) { dbg('çevrimdışı → kuyruğa'); enqueue(ns); return { queued: true }; }

  try {
    const wm = loadWm(ns);
    const allSessions = (await getSessionsByChild(ns)) || [];
    dbg('IndexedDB oturum sayısı', allSessions.length);
    // Yeni biten oturumlar (startTime > watermark). Event blob bu oturumların TÜM
    // event'lerini içerir (kısmi değil) → sunucu event_count monoton koruması doğru çalışır.
    const newSessions = allSessions.filter((s) => ms(s.startTime) > (wm.sessions || 0));
    const newIds = new Set(newSessions.map((s) => s.sessionId));

    const allEvents = (await getEventsByChildAndType(ns, 'question_answered')) || [];
    const events = groupEvents(ns, allEvents.filter((e) => newIds.has(e.sessionId)));

    const allLt = (await getLTHistoryByChild(ns)) || [];
    const ltTransitions = allLt.filter((t) => ms(t.timestamp) > (wm.lt || 0)).map(mapLt);

    const dailySummaries = await collectDaily(ns);

    const sessions = newSessions.map(mapSession);
    const total = sessions.length + events.length + ltTransitions.length + dailySummaries.length;
    dbg('toplanan', { yeniOturum: sessions.length, eventBlob: events.length, lt: ltTransitions.length, daily: dailySummaries.length });
    if (total === 0) { dbg('gönderilecek YENİ veri yok (watermark zaten güncel?)'); dequeue(ns); return { nothing: true }; }

    await postGameProgress({ sessions, events, ltTransitions, dailySummaries });
    dbg('GÖNDERİLDİ ✓ toplam kayıt', total);

    saveWm(ns, {
      sessions: Math.max(wm.sessions || 0, ...allSessions.map((s) => ms(s.startTime)), 0),
      lt: Math.max(wm.lt || 0, ...allLt.map((t) => ms(t.timestamp)), 0),
    });
    dequeue(ns);
    return { sent: total };
  } catch (e) {
    dbg('HATA ✗', String(e?.message || e));
    enqueue(ns); // ağ/sunucu hatası → sonra tekrar dene (idempotent)
    return { error: String(e?.message || e) };
  }
}

/** Kuyrukta bekleyen tüm çocukları gönder (açılış / online dönüşü). */
export async function flushQueue() {
  if (!isDataSyncEnabled() || !getToken()) return;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
  for (const ns of loadQueue()) {
    // eslint-disable-next-line no-await-in-loop
    await syncChild(ns);
  }
}

export default { syncChild, flushQueue, pendingSyncCount };
