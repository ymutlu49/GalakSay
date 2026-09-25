// Test fikstürü — database.js'in bellek-içi taklidi (IndexedDB gerekmez).
// vi.mock('../database.js', () => makeMemoryDb()) ile kullanılır.

export const STORES = {
  CHILD_PROFILES: 'child_profiles',
  SESSIONS: 'game_sessions',
  EVENTS: 'game_events',
  LT_HISTORY: 'lt_progress_history',
  DAILY_SUMMARY: 'daily_performance_summary',
  WEEKLY_SUMMARY: 'weekly_performance_summary',
  ALERTS: 'alerts',
  ACHIEVEMENTS: 'achievements',
};

const KEY_PATH = {
  child_profiles: 'childId', game_sessions: 'sessionId', game_events: 'eventId',
  lt_progress_history: 'id', daily_performance_summary: 'id', weekly_performance_summary: 'id',
  alerts: 'alertId', achievements: 'id',
};

// index adı → kayıt alanları (bileşik anahtarlar dizi olarak)
const INDEX_FIELDS = {
  byChild: ['childId'],
  bySession: ['sessionId'],
  byChildTime: ['childId', 'timestamp'],
  byChildCategory: null, // store'a göre değişir (aşağıda)
  byChildEvent: ['childId', 'eventType'],
  byChildDate: ['childId', 'date'],
  byChildDateCategory: ['childId', 'date', 'category'],
  byChildWeek: ['childId', 'weekStart'],
  byChildUnread: ['childId', 'read'],
};
const STORE_INDEX_OVERRIDE = {
  game_events: { byChildCategory: ['childId', 'category', 'eventType'] },
  lt_progress_history: { byChildCategory: ['childId', 'category'] },
};

export function makeMemoryDb() {
  const data = {};
  let autoId = 1;
  for (const s of Object.values(STORES)) data[s] = new Map();

  const put = (store, rec) => {
    const kp = KEY_PATH[store];
    if (rec[kp] === undefined) rec[kp] = autoId++;
    data[store].set(rec[kp], rec);
    return rec;
  };
  const all = (store) => [...data[store].values()];

  const matches = (rec, fields, keyOrRange) => {
    const vals = fields.map(f => rec[f]);
    if (keyOrRange && typeof keyOrRange === 'object' && 'lower' in keyOrRange) {
      // IDBKeyRange taklidi: {lower:[...], upper:[...]}
      const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
      const cmpArr = (x, y) => { for (let i = 0; i < Math.max(x.length, y.length); i++) { const c = cmp(x[i] ?? '', y[i] ?? ''); if (c) return c; } return 0; };
      return cmpArr(vals, keyOrRange.lower) >= 0 && cmpArr(vals, keyOrRange.upper) <= 0;
    }
    const key = Array.isArray(keyOrRange) ? keyOrRange : [keyOrRange];
    return key.every((k, i) => vals[i] === k);
  };

  const queryByIndex = async (store, indexName, keyOrRange) => {
    const fields = STORE_INDEX_OVERRIDE[store]?.[indexName] || INDEX_FIELDS[indexName];
    if (!fields) throw new Error(`Bilinmeyen index ${indexName}`);
    return all(store).filter(r => matches(r, fields, keyOrRange)).map(r => ({ ...r }));
  };

  return {
    STORES,
    __data: data,
    openDB: async () => ({}),
    putRecord: async (store, rec) => put(store, rec),
    putBatch: async (store, recs) => { for (const r of recs) put(store, r); },
    getRecord: async (store, key) => data[store].get(key) || null,
    getAllFromStore: async (store) => all(store),
    queryByIndex,
    deleteRecord: async (store, key) => { data[store].delete(key); },
    countByIndex: async (store, idx, k) => (await queryByIndex(store, idx, k)).length,
    getChildProfile: async (id) => data.child_profiles.get(id) || null,
    saveChildProfile: async (p) => put('child_profiles', { ...p, updatedAt: new Date().toISOString() }),
    getSessionsByChild: async (id) => queryByIndex('game_sessions', 'byChild', id),
    getEventsBySession: async (sid) => queryByIndex('game_events', 'bySession', sid),
    getEventsByChildAndType: async (id, t) => queryByIndex('game_events', 'byChildEvent', [id, t]),
    getEventsByChildCategoryType: async (id, c, t) => queryByIndex('game_events', 'byChildCategory', [id, c, t]),
    getLTHistoryByChild: async (id, c) => (c ? queryByIndex('lt_progress_history', 'byChildCategory', [id, c]) : queryByIndex('lt_progress_history', 'byChild', id)),
    getDailySummaries: async (id, s, e) => queryByIndex('daily_performance_summary', 'byChildDate', { lower: [id, s], upper: [id, e] }),
    getWeeklySummaries: async (id, s, e) => queryByIndex('weekly_performance_summary', 'byChildWeek', { lower: [id, s || ''], upper: [id, e || '￿'] }),
    getAlertsByChild: async (id, unread) => (unread ? queryByIndex('alerts', 'byChildUnread', [id, 0]) : queryByIndex('alerts', 'byChild', id)),
    markAlertRead: async (aid) => { const a = data.alerts.get(aid); if (a) a.read = 1; },
    getAchievementsByChild: async (id) => queryByIndex('achievements', 'byChild', id),
    deleteChildRecords: async () => {},
    purgeChildDemographics: async () => {},
  };
}

// ── Sentetik veri: 4 haftalık, kategori-başına hedef doğrulukla ─────────────
const CATS = ['sayma', 'subitizing', 'karsilastirma', 'sayi_bilesimi', 'basamak_degeri', 'toplama_cikarma', 'carpma_bolme', 'oruntu'];

function lcg(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

/**
 * @param {ReturnType<typeof makeMemoryDb>} db
 * @param {string} childId
 * @param {{weeks?:number, sessionsPerWeek?:number, itemsPerSession?:number, accuracy?:Record<string,number>, hint?:Record<string,number>, rt?:Record<string,number>, seed?:number, categories?:string[]}} opts
 */
export function seedRichChild(db, childId, opts = {}) {
  const {
    weeks = 4, sessionsPerWeek = 3, itemsPerSession = 16, seed = 7,
    accuracy = {}, hint = {}, rt = {}, categories = CATS,
  } = opts;
  const rnd = lcg(seed);
  const now = Date.now();
  const totalSessions = weeks * sessionsPerWeek;
  let ev = 0;
  for (let si = 0; si < totalSessions; si++) {
    const daysAgo = Math.round((totalSessions - 1 - si) * (7 / sessionsPerWeek));
    const start = now - daysAgo * 86400000 - 2 * 3600000; // 2 saat önce (aynı gün)
    const sessionId = `s_${childId}_${si}`;
    const visited = new Set();
    let correct = 0;
    const items = [];
    for (let i = 0; i < itemsPerSession; i++) {
      const cat = categories[(si + i) % categories.length];
      visited.add(cat);
      // hafif öğrenme eğrisi: haftadan haftaya +%3
      const base = accuracy[cat] ?? 0.7;
      const p = Math.min(0.98, base + (si / totalSessions) * 0.12);
      const isCorrect = rnd() < p;
      if (isCorrect) correct++;
      const h = hint[cat] ?? 1;
      const hintLevel = Math.max(0, Math.min(5, Math.round(h + (rnd() - 0.5) * 2)));
      const baseRt = rt[cat] ?? 4000;
      const responseTime_ms = Math.round(baseRt * (0.6 + rnd() * 0.9));
      items.push({
        eventId: `e_${childId}_${ev++}`, sessionId, childId,
        timestamp: start + i * 30000, category: cat, moduleId: `${cat}Mode_L1`, ltLevel: null,
        difficulty: 'orta', questionId: null, eventType: 'question_answered',
        data: { givenAnswer: isCorrect ? 5 : 6, isCorrect, responseTime_ms, attemptNumber: 1, hintLevelUsed: hintLevel,
          representationUsed: rnd() < 0.3 ? 'somut' : 'sembolik', targetAnswer: 5, category: cat,
          questionContent: { type: 'q', num1: 3, num2: 2 }, errorType: isCorrect ? null : 'off_by_one' },
      });
    }
    db.__data.game_events && items.forEach(e => db.__data.game_events.set(e.eventId, e));
    for (const cat of visited) {
      const mid = `${cat}Mode_L1`;
      db.__data.game_events.set(`m_${childId}_${si}_${cat}`, { eventId: `m_${childId}_${si}_${cat}`, sessionId, childId, timestamp: start + itemsPerSession * 30000, category: cat, moduleId: mid, eventType: 'module_completed', data: { moduleId: mid, category: cat } });
    }
    db.__data.game_sessions.set(sessionId, {
      sessionId, childId, startTime: new Date(start).toISOString(), endTime: new Date(start + itemsPerSession * 30000).toISOString(),
      durationMs: itemsPerSession * 30000, questionsAttempted: itemsPerSession, questionsCorrect: correct,
      categoriesVisited: [...visited], deviceType: 'tablet', appVersion: '5.4.0',
    });
  }
  db.__data.child_profiles.set(childId, { childId, name: 'Şeyma Çağlı', gradeLevel: '2', createdAt: new Date(now - weeks * 7 * 86400000).toISOString() });
  return db;
}

/** Derin tarama: NaN / undefined / "null" metin / "NaN" metin var mı? */
export function findBadValues(obj, path = '', out = []) {
  if (obj === undefined) { out.push(`${path}=undefined`); return out; }
  if (typeof obj === 'number' && Number.isNaN(obj)) { out.push(`${path}=NaN`); return out; }
  if (typeof obj === 'string' && /\bNaN\b|\bundefined\b|%NaN/.test(obj)) { out.push(`${path}="${obj.slice(0, 60)}"`); return out; }
  if (obj instanceof Date) { if (Number.isNaN(obj.getTime())) out.push(`${path}=InvalidDate`); return out; }
  if (Array.isArray(obj)) obj.forEach((v, i) => findBadValues(v, `${path}[${i}]`, out));
  else if (obj && typeof obj === 'object') for (const [k, v] of Object.entries(obj)) findBadValues(v, path ? `${path}.${k}` : k, out);
  return out;
}
