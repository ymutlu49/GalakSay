// GalakSay Analytics — 2026-03-18 — Ana uygulama ile analitik sistem arasındaki köprü
// Bu modül mevcut GalakSay.jsx'e minimal müdahale ile analitik sistemi entegre eder.

import { startSession, endSession, trackEvent, setChildId, flushEvents, createTimer } from './EventCollector.js';
import { onSessionEnd } from './SummaryScheduler.js';
import { openDB, saveChildProfile } from './database.js';

// Mod → kategori eşleme tablosu (mevcut oyun modlarını 8 LT kategorisine eşler)
const MODE_TO_CATEGORY = {
  // Sayma
  counting: 'sayma', backwardCount: 'sayma', skipCount: 'sayma',
  ordinalCount: 'sayma', decadeCount: 'sayma', counterFromN: 'sayma',
  estimateCount: 'sayma',

  // Subitizing
  subitizing: 'subitizing', fivesFrame: 'subitizing', tensFrame: 'subitizing',
  doubleTensFrame: 'subitizing', chipGuess: 'subitizing', rodBack: 'subitizing',

  // Karşılaştırma
  comparison: 'karsilastirma', lessMoreEqual: 'karsilastirma',
  conservation: 'karsilastirma', ordering: 'karsilastirma',
  beforeAfter: 'karsilastirma', fiveMore: 'karsilastirma',
  numberLine: 'karsilastirma', numberLineEstimate: 'karsilastirma',
  nlPlacement: 'karsilastirma', lengthGuess: 'karsilastirma',

  // Sayı bileşimi
  makeFive: 'sayi_bilesimi', makeTen: 'sayi_bilesimi',
  buildNumber: 'sayi_bilesimi', numbersInNumbers: 'sayi_bilesimi',
  spaceKitchen: 'sayi_bilesimi', rodSplit: 'sayi_bilesimi',
  partWhole: 'sayi_bilesimi', missingNumber: 'sayi_bilesimi',
  quantityMatch: 'sayi_bilesimi', matching: 'sayi_bilesimi',

  // Basamak değeri
  bundleTens: 'basamak_degeri', placeValue: 'basamak_degeri',
  expandForm: 'basamak_degeri', composeNumber: 'basamak_degeri',

  // Toplama / Çıkarma
  addition: 'toplama_cikarma', subtraction: 'toplama_cikarma',
  addChips: 'toplama_cikarma', removeChips: 'toplama_cikarma',
  countOnAdd: 'toplama_cikarma', difference: 'toplama_cikarma',
  spaceBalance: 'toplama_cikarma', trueFalse: 'toplama_cikarma',
  inversePractice: 'toplama_cikarma',
  wpAdd: 'toplama_cikarma', wpSub: 'toplama_cikarma', wpCompare: 'toplama_cikarma',
  wordProblem: 'toplama_cikarma',

  // Çarpma / Bölme
  timesTable: 'carpma_bolme', divisionBasic: 'carpma_bolme',
  repeatAdd: 'carpma_bolme', multiplyVisual: 'carpma_bolme',
  arrayDots: 'carpma_bolme', equalShare: 'carpma_bolme',
  groupCount: 'carpma_bolme', halfDouble: 'carpma_bolme',
  mulDivInverse: 'carpma_bolme', katConcept: 'carpma_bolme',
  wpMul: 'carpma_bolme', wpDiv: 'carpma_bolme',

  // Örüntü
  patternAB: 'oruntu', growingPattern: 'oruntu', patternTranslate: 'oruntu',
};

// Mevcut temsil kısaltmalarını tam adlara çevir
const REP_MAP = { c: 'somut', concrete: 'somut', v: 'gorsel', visual: 'gorsel', s: 'sembolik', symbolic: 'sembolik' };

let _questionTimer = null;
let _moduleTimer = null;
let _sessionStartTime = null;
let _questionsAttempted = 0;
let _questionsCorrect = 0;
let _categoriesVisited = new Set();
let _currentCategory = null;
let _currentModuleId = null;
let _sessionActive = false;

// ── Oturum Yönetimi ──────────────────────

async function initAnalytics(childId, metadata = {}) {
  try {
    await openDB();
    setChildId(childId || 'default_child');

    // Çocuk profili oluştur/güncelle
    if (childId) {
      await saveChildProfile({
        childId,
        name: metadata.name || null,
        birthDate: metadata.birthDate || null,
        gradeLevel: metadata.gradeLevel || null,
        nuMapProfileId: metadata.nuMapProfileId || null,
        nuMapRiskLevel: metadata.nuMapRiskLevel || null,
        nuMapAssessmentDate: metadata.nuMapAssessmentDate || null,
      });
    }

    console.log('[GalakSay Analytics] Sistem başlatıldı, childId:', childId);
  } catch (err) {
    console.error('[GalakSay Analytics] Başlatma hatası:', err);
  }
}

function beginGameSession(childId, metadata = {}) {
  if (_sessionActive) return;
  _sessionActive = true;
  _sessionStartTime = Date.now();
  _questionsAttempted = 0;
  _questionsCorrect = 0;
  _categoriesVisited = new Set();
  _moduleTimer = createTimer();

  startSession(childId || 'default_child', {
    ...metadata,
    appVersion: '5.3.0',
  });

  console.log('[GalakSay Analytics] Oturum başlatıldı');
}

async function finishGameSession(childId, additionalSummary = {}) {
  if (!_sessionActive) return;
  _sessionActive = false;

  const duration_ms = Date.now() - (_sessionStartTime || Date.now());
  const summary = {
    duration_ms,
    questionsAttempted: _questionsAttempted,
    questionsCorrect: _questionsCorrect,
    categoriesVisited: Array.from(_categoriesVisited),
    ...additionalSummary,
  };

  const sessionId = await endSession(summary);

  // SummaryScheduler'ı çağır
  if (childId && sessionId) {
    try {
      const result = await onSessionEnd(childId, sessionId, summary);
      console.log('[GalakSay Analytics] Oturum özeti:', result);
    } catch (err) {
      console.error('[GalakSay Analytics] Özet hesaplama hatası:', err);
    }
  }
}

// ── Soru İzleme ──────────────────────────

function onQuestionPresented(gameMode, question, level, difficulty) {
  _questionTimer = createTimer();
  const category = MODE_TO_CATEGORY[gameMode] || null;
  _currentCategory = category;
  if (category) _categoriesVisited.add(category);

  trackEvent('question_presented', {
    questionContent: question ? { type: question.type, num1: question.num1, num2: question.num2 } : {},
    targetAnswer: question?.correctAnswer || null,
    difficultyParams: { level, difficulty },
  }, {
    category,
    moduleId: _currentModuleId,
    difficulty: difficulty || (level <= 2 ? 'kolay' : level <= 5 ? 'orta' : 'zor'),
  });
}

function onQuestionAnswered(gameMode, isCorrect, givenAnswer, correctAnswer, hintLevel, representation, question) {
  _questionsAttempted++;
  if (isCorrect) _questionsCorrect++;

  const responseTime_ms = _questionTimer ? _questionTimer.elapsed() : 0;
  const category = MODE_TO_CATEGORY[gameMode] || _currentCategory;
  const rep = REP_MAP[representation] || representation || 'sembolik';

  trackEvent('question_answered', {
    givenAnswer,
    isCorrect,
    responseTime_ms,
    attemptNumber: 1, // Basit versiyon — ilk deneme
    hintLevelUsed: hintLevel || 0,
    representationUsed: rep,
    interactionCount: 0,
    targetAnswer: correctAnswer,
    category,
    questionContent: question ? { type: question.type, num1: question.num1, num2: question.num2 } : {},
  }, {
    category,
    moduleId: _currentModuleId,
  });
}

function onHintRequested(hintLevel, gameMode) {
  const category = MODE_TO_CATEGORY[gameMode] || _currentCategory;
  const timeBeforeHint_ms = _questionTimer ? _questionTimer.elapsed() : 0;

  trackEvent('hint_requested', {
    hintLevel,
    timeBeforeHint_ms,
    wrongAttemptsBeforeHint: 0,
  }, { category });
}

function onRepresentationSwitched(fromLayer, toLayer, trigger, gameMode) {
  const category = MODE_TO_CATEGORY[gameMode] || _currentCategory;
  trackEvent('representation_switched', {
    fromLayer: REP_MAP[fromLayer] || fromLayer,
    toLayer: REP_MAP[toLayer] || toLayer,
    trigger: trigger || 'user_toggle',
  }, { category });
}

function onModuleCompleted(gameMode, level, accuracy, avgResponseTime, avgHintLevel, totalTime) {
  const category = MODE_TO_CATEGORY[gameMode] || _currentCategory;
  const moduleId = `${gameMode}_L${level}`;

  trackEvent('module_completed', {
    moduleId,
    category,
    ltLevel: level,
    accuracy,
    avgResponseTime_ms: avgResponseTime,
    avgHintLevel: avgHintLevel,
    totalTime_ms: totalTime || (_moduleTimer ? _moduleTimer.elapsed() : 0),
  }, { category, moduleId });

  _moduleTimer = createTimer();
}

function onConcreteSupport(gameMode, duration) {
  const category = MODE_TO_CATEGORY[gameMode] || _currentCategory;
  trackEvent('concrete_support_accessed', {
    context: 'during_question',
    duration_ms: duration || 0,
  }, { category });
}

function onFluencySessionEnd(gameMode, summary) {
  const category = MODE_TO_CATEGORY[gameMode] || _currentCategory;
  trackEvent('fluency_session_end', {
    ...summary,
    category,
  }, { category });
}

// ── Modül Yönetimi ──────────────────────

function setCurrentModule(gameMode, level) {
  _currentModuleId = `${gameMode}_L${level}`;
  _currentCategory = MODE_TO_CATEGORY[gameMode] || null;
  _moduleTimer = createTimer();
}

// ── Export ────────────────────────────────

export {
  MODE_TO_CATEGORY,
  initAnalytics,
  beginGameSession,
  finishGameSession,
  onQuestionPresented,
  onQuestionAnswered,
  onHintRequested,
  onRepresentationSwitched,
  onModuleCompleted,
  onConcreteSupport,
  onFluencySessionEnd,
  setCurrentModule,
};
