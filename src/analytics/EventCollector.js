// GalakSay Analytics — 2026-03-18 — Merkezi olay toplama modülü

import { STORES, openDB, putBatch, putRecord } from './database.js';

let _sessionId = null;
let _childId = null;
let _eventBuffer = [];
let _flushTimer = null;

const BUFFER_SIZE = 10;
const FLUSH_INTERVAL = 30000; // 30 saniye

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

// Oturum başlat
function startSession(childId, metadata = {}) {
  _childId = childId;
  _sessionId = generateId();

  const sessionRecord = {
    sessionId: _sessionId,
    childId,
    startTime: new Date().toISOString(),
    endTime: null,
    durationMs: 0,
    questionsAttempted: 0,
    questionsCorrect: 0,
    categoriesVisited: [],
    deviceType: metadata.deviceType || detectDeviceType(),
    appVersion: metadata.appVersion || '5.3.0',
  };

  putRecord(STORES.SESSIONS, sessionRecord).catch(console.error);

  trackEvent('session_start', {
    deviceType: sessionRecord.deviceType,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    appVersion: sessionRecord.appVersion,
    nuMapProfileId: metadata.nuMapProfileId || null,
    startingLTLevels: metadata.startingLTLevels || {},
  });

  // Otomatik flush zamanlayıcısı
  _flushTimer = setInterval(flushEvents, FLUSH_INTERVAL);

  return _sessionId;
}

// Oturum sonlandır
async function endSession(summary = {}) {
  if (!_sessionId) return;

  trackEvent('session_end', {
    duration_ms: summary.duration_ms || 0,
    questionsAttempted: summary.questionsAttempted || 0,
    questionsCorrect: summary.questionsCorrect || 0,
    categoriesVisited: summary.categoriesVisited || [],
    endingLTLevels: summary.endingLTLevels || {},
  });

  await flushEvents();

  // Oturum kaydını güncelle
  try {
    const db = await openDB();
    const tx = db.transaction(STORES.SESSIONS, 'readwrite');
    const store = tx.objectStore(STORES.SESSIONS);
    const req = store.get(_sessionId);
    req.onsuccess = () => {
      const session = req.result;
      if (session) {
        session.endTime = new Date().toISOString();
        session.durationMs = summary.duration_ms || (Date.now() - new Date(session.startTime).getTime());
        session.questionsAttempted = summary.questionsAttempted || 0;
        session.questionsCorrect = summary.questionsCorrect || 0;
        session.categoriesVisited = summary.categoriesVisited || [];
        store.put(session);
      }
    };
  } catch (err) {
    console.error('Session update error:', err);
  }

  if (_flushTimer) {
    clearInterval(_flushTimer);
    _flushTimer = null;
  }

  const sid = _sessionId;
  _sessionId = null;
  return sid;
}

// Ana olay kayıt fonksiyonu
function trackEvent(eventType, data = {}, context = {}) {
  const event = {
    eventId: generateId(),
    sessionId: _sessionId,
    childId: _childId,
    timestamp: Date.now(),
    category: context.category || data.category || null,
    moduleId: context.moduleId || data.moduleId || null,
    ltLevel: context.ltLevel ?? data.ltLevel ?? null,
    difficulty: context.difficulty || data.difficulty || null,
    questionId: context.questionId || data.questionId || null,
    eventType,
    data,
  };

  _eventBuffer.push(event);

  if (_eventBuffer.length >= BUFFER_SIZE) {
    flushEvents();
  }

  return event.eventId;
}

// Tampondaki olayları veritabanına yaz
async function flushEvents() {
  if (_eventBuffer.length === 0) return;

  const toFlush = [..._eventBuffer];
  _eventBuffer = [];

  try {
    await putBatch(STORES.EVENTS, toFlush);
  } catch (err) {
    console.error('Event flush error:', err);
    // Başarısız olayları tekrar tampona ekle — max 200 olay sınırı (bellek taşmasını önle)
    _eventBuffer = [...toFlush, ..._eventBuffer].slice(-200);
  }
}

// Cihaz türü algılama
function detectDeviceType() {
  const w = window.innerWidth;
  if (w < 768) return 'phone';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

// Mevcut oturum bilgisi
function getSessionId() {
  return _sessionId;
}

function getChildId() {
  return _childId;
}

function setChildId(id) {
  _childId = id;
}

// Zamanlayıcı yardımcıları
function createTimer() {
  const start = Date.now();
  return {
    elapsed: () => Date.now() - start,
    reset: () => { /* returns new timer */ return createTimer(); },
  };
}

export {
  startSession,
  endSession,
  trackEvent,
  flushEvents,
  getSessionId,
  getChildId,
  setChildId,
  createTimer,
};
