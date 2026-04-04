// GalakSay Analytics — 2026-03-18 — IndexedDB veritabanı şeması ve erişim katmanı

const DB_NAME = 'galaksay_analytics';
const DB_VERSION = 1;

let dbInstance = null;

const STORES = {
  CHILD_PROFILES: 'child_profiles',
  SESSIONS: 'game_sessions',
  EVENTS: 'game_events',
  LT_HISTORY: 'lt_progress_history',
  DAILY_SUMMARY: 'daily_performance_summary',
  WEEKLY_SUMMARY: 'weekly_performance_summary',
  ALERTS: 'alerts',
  ACHIEVEMENTS: 'achievements',
};

function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      // child_profiles
      if (!db.objectStoreNames.contains(STORES.CHILD_PROFILES)) {
        db.createObjectStore(STORES.CHILD_PROFILES, { keyPath: 'childId' });
      }

      // game_sessions
      if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
        const sessions = db.createObjectStore(STORES.SESSIONS, { keyPath: 'sessionId' });
        sessions.createIndex('byChild', 'childId', { unique: false });
        sessions.createIndex('byChildTime', ['childId', 'startTime'], { unique: false });
      }

      // game_events
      if (!db.objectStoreNames.contains(STORES.EVENTS)) {
        const events = db.createObjectStore(STORES.EVENTS, { keyPath: 'eventId' });
        events.createIndex('bySession', 'sessionId', { unique: false });
        events.createIndex('byChild', 'childId', { unique: false });
        events.createIndex('byChildTime', ['childId', 'timestamp'], { unique: false });
        events.createIndex('byChildCategory', ['childId', 'category', 'eventType'], { unique: false });
        events.createIndex('byChildEvent', ['childId', 'eventType'], { unique: false });
      }

      // lt_progress_history
      if (!db.objectStoreNames.contains(STORES.LT_HISTORY)) {
        const lt = db.createObjectStore(STORES.LT_HISTORY, { keyPath: 'id', autoIncrement: true });
        lt.createIndex('byChild', 'childId', { unique: false });
        lt.createIndex('byChildCategory', ['childId', 'category'], { unique: false });
      }

      // daily_performance_summary
      if (!db.objectStoreNames.contains(STORES.DAILY_SUMMARY)) {
        const daily = db.createObjectStore(STORES.DAILY_SUMMARY, { keyPath: 'id', autoIncrement: true });
        daily.createIndex('byChildDate', ['childId', 'date'], { unique: false });
        daily.createIndex('byChildDateCategory', ['childId', 'date', 'category'], { unique: false });
      }

      // weekly_performance_summary
      if (!db.objectStoreNames.contains(STORES.WEEKLY_SUMMARY)) {
        const weekly = db.createObjectStore(STORES.WEEKLY_SUMMARY, { keyPath: 'id', autoIncrement: true });
        weekly.createIndex('byChildWeek', ['childId', 'weekStart'], { unique: false });
      }

      // alerts
      if (!db.objectStoreNames.contains(STORES.ALERTS)) {
        const alerts = db.createObjectStore(STORES.ALERTS, { keyPath: 'alertId' });
        alerts.createIndex('byChild', 'childId', { unique: false });
        alerts.createIndex('byChildUnread', ['childId', 'read'], { unique: false });
      }

      // achievements
      if (!db.objectStoreNames.contains(STORES.ACHIEVEMENTS)) {
        const ach = db.createObjectStore(STORES.ACHIEVEMENTS, { keyPath: 'id', autoIncrement: true });
        ach.createIndex('byChild', 'childId', { unique: false });
      }
    };

    request.onsuccess = (e) => {
      dbInstance = e.target.result;
      resolve(dbInstance);
    };

    request.onerror = (e) => {
      console.error('GalakSay DB error:', e.target.error);
      reject(e.target.error);
    };
  });
}

// Generic CRUD helpers
async function putRecord(storeName, record) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(record);
    tx.oncomplete = () => resolve(record);
    tx.onerror = (e) => reject(e.target.error);
  });
}

async function getRecord(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function getAllFromStore(storeName) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function queryByIndex(storeName, indexName, keyOrRange) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const index = tx.objectStore(storeName).index(indexName);
    const req = index.getAll(keyOrRange);
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function deleteRecord(storeName, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

async function putBatch(storeName, records) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    for (const record of records) {
      store.put(record);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

async function countByIndex(storeName, indexName, keyOrRange) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const index = tx.objectStore(storeName).index(indexName);
    const req = index.count(keyOrRange);
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

// Child profile helpers
async function getChildProfile(childId) {
  return getRecord(STORES.CHILD_PROFILES, childId);
}

async function saveChildProfile(profile) {
  profile.updatedAt = new Date().toISOString();
  if (!profile.createdAt) profile.createdAt = profile.updatedAt;
  return putRecord(STORES.CHILD_PROFILES, profile);
}

// Session helpers
async function getSessionsByChild(childId) {
  return queryByIndex(STORES.SESSIONS, 'byChild', childId);
}

// Event helpers
async function getEventsBySession(sessionId) {
  return queryByIndex(STORES.EVENTS, 'bySession', sessionId);
}

async function getEventsByChildAndType(childId, eventType) {
  return queryByIndex(STORES.EVENTS, 'byChildEvent', [childId, eventType]);
}

async function getEventsByChildCategoryType(childId, category, eventType) {
  return queryByIndex(STORES.EVENTS, 'byChildCategory', [childId, category, eventType]);
}

// LT history helpers
async function getLTHistoryByChild(childId, category) {
  if (category) {
    return queryByIndex(STORES.LT_HISTORY, 'byChildCategory', [childId, category]);
  }
  return queryByIndex(STORES.LT_HISTORY, 'byChild', childId);
}

// Daily summary helpers
async function getDailySummaries(childId, startDate, endDate) {
  const all = await queryByIndex(STORES.DAILY_SUMMARY, 'byChildDate',
    IDBKeyRange.bound([childId, startDate], [childId, endDate]));
  return all;
}

// Weekly summary helpers
async function getWeeklySummaries(childId, startWeek, endWeek) {
  if (startWeek && endWeek) {
    return queryByIndex(STORES.WEEKLY_SUMMARY, 'byChildWeek',
      IDBKeyRange.bound([childId, startWeek], [childId, endWeek]));
  }
  return queryByIndex(STORES.WEEKLY_SUMMARY, 'byChildWeek',
    IDBKeyRange.bound([childId, ''], [childId, '\uffff']));
}

// Alert helpers
async function getAlertsByChild(childId, unreadOnly = false) {
  if (unreadOnly) {
    return queryByIndex(STORES.ALERTS, 'byChildUnread', [childId, 0]);
  }
  return queryByIndex(STORES.ALERTS, 'byChild', childId);
}

async function markAlertRead(alertId) {
  const alert = await getRecord(STORES.ALERTS, alertId);
  if (alert) {
    alert.read = 1;
    return putRecord(STORES.ALERTS, alert);
  }
}

// Achievement helpers
async function getAchievementsByChild(childId) {
  return queryByIndex(STORES.ACHIEVEMENTS, 'byChild', childId);
}

export {
  STORES,
  openDB,
  putRecord,
  getRecord,
  getAllFromStore,
  queryByIndex,
  deleteRecord,
  putBatch,
  countByIndex,
  getChildProfile,
  saveChildProfile,
  getSessionsByChild,
  getEventsBySession,
  getEventsByChildAndType,
  getEventsByChildCategoryType,
  getLTHistoryByChild,
  getDailySummaries,
  getWeeklySummaries,
  getAlertsByChild,
  markAlertRead,
  getAchievementsByChild,
};
