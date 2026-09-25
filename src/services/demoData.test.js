// Demo sınıfı sözleşme testleri: yükleme 4 demo:true çocuk + localStorage istatistikleri
// + IndexedDB oturum/olay kayıtları üretir; hikâye analitik motorlarda okunur (risk,
// doğruluk, tarama); kaldırma YALNIZ demo çocukları ve onların anahtar/kayıtlarını siler.
// jsdom'da IndexedDB yok (fake-indexeddb kurulu değil) → database.js bellek-içi mock.
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mem = vi.hoisted(() => ({ stores: new Map(), auto: 1 }));

vi.mock('../analytics/database.js', () => {
  const STORES = {
    CHILD_PROFILES: 'child_profiles', SESSIONS: 'game_sessions', EVENTS: 'game_events',
    LT_HISTORY: 'lt_progress_history', DAILY_SUMMARY: 'daily_performance_summary',
    WEEKLY_SUMMARY: 'weekly_performance_summary', ALERTS: 'alerts', ACHIEVEMENTS: 'achievements',
  };
  const KEYPATH = { child_profiles: 'childId', game_sessions: 'sessionId', game_events: 'eventId', alerts: 'alertId' };
  const INDEX = {
    byChild: ['childId'], bySession: ['sessionId'], byChildEvent: ['childId', 'eventType'],
    byChildUnread: ['childId', 'read'], byChildDate: ['childId', 'date'], byChildWeek: ['childId', 'weekStart'],
    byChildCategory: { game_events: ['childId', 'category', 'eventType'], lt_progress_history: ['childId', 'category'] },
  };
  const tbl = (s) => { if (!mem.stores.has(s)) mem.stores.set(s, new Map()); return mem.stores.get(s); };
  const keyOf = (s, r) => { const kp = KEYPATH[s]; if (kp) return r[kp]; if (r.id == null) r.id = mem.auto++; return r.id; };
  const putRecord = async (s, r) => { tbl(s).set(keyOf(s, r), r); return r; };
  const putBatch = async (s, rows) => { for (const r of rows) await putRecord(s, r); };
  const getAllFromStore = async (s) => [...tbl(s).values()];
  const queryByIndex = async (s, idx, key) => {
    let f = INDEX[idx]; if (f && !Array.isArray(f)) f = f[s];
    const ks = Array.isArray(key) ? key : [key];
    return (await getAllFromStore(s)).filter((r) => f.every((fld, i) => r[fld] === ks[i]));
  };
  const deleteRecord = async (s, k) => { tbl(s).delete(k); };
  return {
    STORES, openDB: async () => ({}), putRecord, putBatch, getAllFromStore, queryByIndex, deleteRecord,
    getRecord: async (s, k) => tbl(s).get(k) || null,
    countByIndex: async (s, i, k) => (await queryByIndex(s, i, k)).length,
    getChildProfile: async (id) => tbl(STORES.CHILD_PROFILES).get(id) || null,
    saveChildProfile: async (p) => putRecord(STORES.CHILD_PROFILES, { ...p, updatedAt: new Date().toISOString(), createdAt: p.createdAt || new Date().toISOString() }),
    getSessionsByChild: async (id) => queryByIndex(STORES.SESSIONS, 'byChild', id),
    getEventsBySession: async (sid) => queryByIndex(STORES.EVENTS, 'bySession', sid),
    getEventsByChildAndType: async (id, t) => queryByIndex(STORES.EVENTS, 'byChildEvent', [id, t]),
    getEventsByChildCategoryType: async (id, c, t) => queryByIndex(STORES.EVENTS, 'byChildCategory', [id, c, t]),
    getLTHistoryByChild: async (id, c) => (c ? queryByIndex(STORES.LT_HISTORY, 'byChildCategory', [id, c]) : queryByIndex(STORES.LT_HISTORY, 'byChild', id)),
    getDailySummaries: async (id, a, b) => (await getAllFromStore(STORES.DAILY_SUMMARY)).filter((r) => r.childId === id && r.date >= a && r.date <= b),
    getWeeklySummaries: async (id) => queryByIndex(STORES.WEEKLY_SUMMARY, 'byChild', id),
    getAlertsByChild: async (id) => queryByIndex(STORES.ALERTS, 'byChild', id),
    markAlertRead: async () => {},
    getAchievementsByChild: async (id) => queryByIndex(STORES.ACHIEVEMENTS, 'byChild', id),
    purgeChildDemographics: async () => {},
    deleteChildRecords: async (id) => {
      for (const [s, t] of mem.stores) {
        if (s === STORES.CHILD_PROFILES) continue;
        for (const [k, r] of [...t]) if (r.childId === id) t.delete(k);
      }
      tbl(STORES.CHILD_PROFILES).delete(id);
    },
  };
});

import { loadDemoClass, removeDemoClass, isDemoLoaded, listDemoChildren, DEMO_CHILD_NAMES } from './demoData.js';
import { addChild, listChildren, getResumeInfo } from './localProfiles.js';
import { STORES, getAllFromStore, getSessionsByChild, getChildProfile, putRecord } from '../analytics/database.js';
import { getOverallAccuracy, getCategoryAccuracy, getAvgHintLevel, getAvgResponseTime } from '../analytics/PerformanceAnalyzer.js';
import { calculateRiskLevel, screenDyscalculiaIndicators } from '../analytics/RiskClassifier.js';
import { getCurrentLTLevels } from '../analytics/LTProgressEngine.js';
import { MODE_TO_CATEGORY } from '../analytics/AnalyticsBridge.js';

const DAY = 86400000;
const byName = (list, n) => list.find((c) => c.name === n);

describe('demoData — demo sınıfı', () => {
  beforeEach(() => { localStorage.clear(); mem.stores.clear(); mem.auto = 1; });

  it('loadDemoClass 4 çocuğu demo:true bayrağıyla gerçek roster API\'siyle oluşturur; ikinci çağrı çoğaltmaz', async () => {
    const created = await loadDemoClass();
    expect(created).toHaveLength(4);
    expect(created.map((c) => c.name)).toEqual(DEMO_CHILD_NAMES);
    expect(isDemoLoaded()).toBe(true);
    const roster = listChildren();
    expect(roster).toHaveLength(4);
    for (const c of roster) {
      expect(c.demo).toBe(true);
      expect(c.ns).toMatch(/^local_\d+$/);
      expect(c.ownerId).toBeNull();
    }
    expect(byName(roster, 'Elif').ageGroup).toBe('sinif1');
    expect(byName(roster, 'Yusuf').ageGroup).toBe('sinif1');
    expect(byName(roster, 'Zeynep').ageGroup).toBe('okuloncesi');
    expect(byName(roster, 'Mert').ageGroup).toBe('sinif2');
    expect(byName(roster, 'Mert').grade).toBe('2');
    const again = await loadDemoClass();
    expect(again).toHaveLength(4);
    expect(listChildren()).toHaveLength(4);
  });

  it('her çocuk için oyun-içi localStorage istatistikleri GalakSay biçiminde yazılır', async () => {
    await loadDemoClass();
    for (const c of listDemoChildren()) {
      const raw = JSON.parse(localStorage.getItem(`dokunsay-user-${c.ns}`));
      expect(raw.name).toBe(c.name);
      expect(raw.roundsPerGame).toBe(10);
      expect(raw.lastPlayed).toEqual({ mode: expect.any(String), level: expect.any(Number) });
      const s = raw.stats;
      expect(s.totalGames).toBeGreaterThanOrEqual(15);
      expect(s.totalQ).toBe(s.totalGames * 10);
      expect(s.totalCorrect).toBeLessThanOrEqual(s.totalQ);
      expect(s.totalScore).toBeGreaterThan(0);
      expect(s.starFragments).toBeGreaterThan(0);
      expect(s.recent.length).toBeLessThanOrEqual(20);
      expect(s.recent[0]).toEqual(expect.objectContaining({ mode: expect.any(String), level: expect.any(Number), correct: expect.any(Number), total: 10, score: expect.any(Number), acc: expect.any(Number), starFragments: expect.any(Number) }));
      const modes = Object.keys(s.modeStats);
      expect(modes.length).toBeGreaterThanOrEqual(3);
      for (const m of modes) {
        expect(MODE_TO_CATEGORY[m]).toBeTruthy(); // analitik kategoriyle eşleşen geçerli mod
        const ms = s.modeStats[m];
        expect(ms.total).toBe(ms.games * 10);
        expect(Object.keys(ms.levelBest).length).toBeGreaterThan(0);
      }
      // Devam/seri/yaş grubu yardımcı anahtarları
      expect(getResumeInfo(c.ns)).toEqual(expect.objectContaining({ hasProgress: true, totalGames: s.totalGames }));
      expect(localStorage.getItem(`ds_ageGroup_${c.ns}`)).toBe(c.ageGroup);
      const streak = JSON.parse(localStorage.getItem(`ds_streak_${c.ns}`));
      expect(streak.current).toBeGreaterThanOrEqual(1);
      expect(streak.lastDate).toBe(new Date(Date.now() - DAY).toISOString().slice(0, 10));
      expect(JSON.parse(localStorage.getItem(`ds_adaptive_${c.ns}`))[modes[0]]).toEqual(expect.objectContaining({ played: expect.any(Number), recentAcc: expect.any(Number) }));
      expect(Array.isArray(JSON.parse(localStorage.getItem(`ds_cards_${c.ns}`)))).toBe(true);
      expect(localStorage.getItem(`ds_onboarded_${c.ns}`)).toBe('1');
    }
  });

  it('IndexedDB oturum/olay kayıtları son 24 günde, 8-15 dk, EventCollector şeklinde yazılır', async () => {
    const now = Date.now();
    await loadDemoClass({ now });
    for (const c of listDemoChildren()) {
      const sessions = await getSessionsByChild(c.ns);
      expect(sessions.length).toBeGreaterThanOrEqual(9);
      expect(sessions.length).toBeLessThanOrEqual(20);
      for (const s of sessions) {
        const t = new Date(s.startTime).getTime();
        expect(t).toBeLessThan(now);
        expect(t).toBeGreaterThan(now - 25 * DAY);
        expect(s.durationMs).toBeGreaterThanOrEqual(8 * 60000);
        expect(s.durationMs).toBeLessThanOrEqual(16 * 60000);
        expect(s.questionsAttempted).toBeGreaterThan(0);
        expect(s.questionsCorrect).toBeLessThanOrEqual(s.questionsAttempted);
        expect(s.categoriesVisited.length).toBeGreaterThan(0);
        expect(s.endTime).toBeTruthy();
      }
      // Son oturum dün (seri devam eder)
      const last = Math.max(...sessions.map((s) => new Date(s.startTime).getTime()));
      expect(now - last).toBeLessThan(2 * DAY);
      const profile = await getChildProfile(c.ns);
      expect(profile).toEqual(expect.objectContaining({ childId: c.ns, name: c.name, demo: true }));
    }
    const events = await getAllFromStore(STORES.EVENTS);
    const answered = events.filter((e) => e.eventType === 'question_answered');
    expect(answered.length).toBeGreaterThan(400);
    const sessionIds = new Set((await getAllFromStore(STORES.SESSIONS)).map((s) => s.sessionId));
    for (const e of answered) {
      expect(sessionIds.has(e.sessionId)).toBe(true);
      expect(e.category).toBe(MODE_TO_CATEGORY[e.moduleId.replace(/_L\d+$/, '')]);
      expect(e.data).toEqual(expect.objectContaining({
        isCorrect: expect.any(Boolean), responseTime_ms: expect.any(Number), hintLevelUsed: expect.any(Number),
        representationUsed: expect.stringMatching(/^(somut|gorsel|sembolik)$/), targetAnswer: expect.any(Number),
        givenAnswer: expect.any(Number), errorType: expect.any(String), attemptNumber: 1,
      }));
      if (e.data.isCorrect) expect(e.data.givenAnswer).toBe(e.data.targetAnswer);
      else expect(e.data.givenAnswer).not.toBe(e.data.targetAnswer);
    }
    for (const type of ['session_start', 'session_end', 'question_presented', 'module_completed', 'hint_requested']) {
      expect(events.some((e) => e.eventType === type)).toBe(true);
    }
    expect((await getAllFromStore(STORES.DAILY_SUMMARY)).length).toBeGreaterThan(20);
    expect((await getAllFromStore(STORES.LT_HISTORY)).length).toBeGreaterThan(0);
    expect((await getAllFromStore(STORES.ALERTS)).length).toBeGreaterThan(0);
    expect((await getAllFromStore(STORES.ACHIEVEMENTS)).length).toBeGreaterThan(0);
  });

  it('pedagojik hikâye analitik motorlarda okunur: güçlü / risk / orta / akıcılık', async () => {
    await loadDemoClass();
    const r = listDemoChildren();
    const elif = byName(r, 'Elif').ns, yusuf = byName(r, 'Yusuf').ns, zeynep = byName(r, 'Zeynep').ns, mert = byName(r, 'Mert').ns;

    // Elif: yüksek doğruluk, az ipucu, düşük risk, sayma LT ilerledi
    expect(await getOverallAccuracy(elif)).toBeGreaterThan(0.8);
    expect(await getAvgHintLevel(elif)).toBeLessThan(1);
    expect((await calculateRiskLevel(elif)).overallRisk).toBeLessThanOrEqual(2);
    expect((await getCurrentLTLevels(elif)).sayma.level).toBe(4);
    expect((await screenDyscalculiaIndicators(elif)).overallScreeningResult).toBe('no_concern');

    // Yusuf: düşük doğruluk, yavaş, çok ipucu → yüksek risk + tarama göstergeleri
    expect(await getOverallAccuracy(yusuf)).toBeLessThan(0.55);
    expect(await getCategoryAccuracy(yusuf, 'subitizing')).toBeLessThan(0.5);
    expect(await getCategoryAccuracy(yusuf, 'karsilastirma')).toBeLessThan(0.5);
    expect(await getAvgHintLevel(yusuf, 'sayma')).toBeGreaterThan(3);
    expect(await getAvgResponseTime(yusuf)).toBeGreaterThan(8000);
    expect((await calculateRiskLevel(yusuf)).overallRisk).toBeGreaterThanOrEqual(5);
    const scr = await screenDyscalculiaIndicators(yusuf);
    expect(scr.overallScreeningResult).toBe('refer_for_assessment');
    expect(scr.indicatorsFound.length).toBeGreaterThanOrEqual(3); // sayı hissi + sayma ilkeleri + çalışma belleği (+ aritmetik)

    // Zeynep: orta yol
    const zAcc = await getOverallAccuracy(zeynep);
    expect(zAcc).toBeGreaterThan(0.55);
    expect(zAcc).toBeLessThan(0.85);
    expect((await calculateRiskLevel(zeynep)).overallRisk).toBeGreaterThanOrEqual(2);
    expect((await calculateRiskLevel(zeynep)).overallRisk).toBeLessThanOrEqual(4);

    // Mert: sayı hissi güçlü, toplama/çıkarma akıcılık sorunu (yavaş + orta doğruluk)
    expect(await getCategoryAccuracy(mert, 'subitizing')).toBeGreaterThan(0.85);
    expect(await getCategoryAccuracy(mert, 'basamak_degeri')).toBeGreaterThan(0.78);
    const mAdd = await getCategoryAccuracy(mert, 'toplama_cikarma');
    expect(mAdd).toBeGreaterThan(0.5);
    expect(mAdd).toBeLessThan(0.78);
    expect(await getAvgResponseTime(mert, 'toplama_cikarma')).toBeGreaterThan(await getAvgResponseTime(mert, 'subitizing') * 2);
  });

  it('removeDemoClass yalnız demo çocukları, anahtarlarını ve IndexedDB kayıtlarını siler; gerçek çocuğa dokunmaz', async () => {
    // Gerçek (demo olmayan) çocuk + verisi
    const real = addChild({ name: 'Gerçek Deniz', avatar: '🦊', ageGroup: 'sinif1' });
    localStorage.setItem(`dokunsay-user-${real.ns}`, JSON.stringify({ stats: { totalGames: 3 } }));
    localStorage.setItem(`ds_streak_${real.ns}`, '{"current":2}');
    await putRecord(STORES.SESSIONS, { sessionId: 'real_s1', childId: real.ns, startTime: new Date().toISOString(), durationMs: 60000 });
    await putRecord(STORES.EVENTS, { eventId: 'real_e1', sessionId: 'real_s1', childId: real.ns, eventType: 'question_answered', category: 'sayma', data: { isCorrect: true } });

    await loadDemoClass();
    const demoNs = listDemoChildren().map((c) => c.ns);
    expect(demoNs).toHaveLength(4);
    expect(listChildren()).toHaveLength(5);

    const removed = await removeDemoClass();
    expect(removed).toBe(4);
    expect(isDemoLoaded()).toBe(false);
    expect(listChildren().map((c) => c.ns)).toEqual([real.ns]);

    // localStorage: demo ns'e ait hiçbir anahtar kalmaz
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      for (const ns of demoNs) {
        expect(k.endsWith(`_${ns}`) || k.endsWith(`-${ns}`)).toBe(false);
      }
    }
    expect(localStorage.getItem(`dokunsay-user-${real.ns}`)).toContain('"totalGames":3');
    expect(localStorage.getItem(`ds_streak_${real.ns}`)).toBe('{"current":2}');

    // IndexedDB: demo kayıtları tüm store'lardan gider; gerçek çocuğunki kalır
    for (const store of Object.values(STORES)) {
      const rows = await getAllFromStore(store);
      expect(rows.some((r) => demoNs.includes(r.childId))).toBe(false);
    }
    expect((await getSessionsByChild(real.ns)).map((s) => s.sessionId)).toEqual(['real_s1']);
    expect((await getAllFromStore(STORES.EVENTS)).map((e) => e.eventId)).toEqual(['real_e1']);

    // Kaldırma sonrası tekrar yükleme temiz çalışır (ns'ler yeniden kullanılsa da veri sıfırdan yazılır)
    const again = await loadDemoClass();
    expect(again).toHaveLength(4);
    expect(isDemoLoaded()).toBe(true);
    expect(listChildren()).toHaveLength(5);
    for (const c of again) {
      expect(JSON.parse(localStorage.getItem(`dokunsay-user-${c.ns}`)).stats.totalGames).toBeGreaterThan(0);
      expect((await getSessionsByChild(c.ns)).length).toBeGreaterThan(0);
    }
  });

  it('removeDemoClass yüklü demo yokken güvenle 0 döner', async () => {
    addChild({ name: 'Yalnız Gerçek' });
    expect(await removeDemoClass()).toBe(0);
    expect(listChildren()).toHaveLength(1);
  });
});
