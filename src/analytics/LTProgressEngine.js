// GalakSay Analytics — 2026-03-18 — Öğrenme Yörüngesi ilerleme motoru

import {
  getEventsByChildCategoryType,
  getEventsByChildAndType,
  getLTHistoryByChild,
  putRecord,
  STORES,
} from './database.js';
import { getCategoryAccuracy, getAvgHintLevel, getConcreteSupportRate } from './PerformanceAnalyzer.js';

const CATEGORIES = [
  'sayma', 'subitizing', 'karsilastirma', 'sayi_bilesimi',
  'basamak_degeri', 'toplama_cikarma', 'carpma_bolme', 'oruntu'
];

// LT düzey aralıkları (Clements-Sarama)
const LT_RANGES = {
  sayma:           { min: 2, max: 18 },
  subitizing:      { min: 2, max: 10 },
  karsilastirma:   { min: 3, max: 12 },
  sayi_bilesimi:   { min: 4, max: 14 },
  basamak_degeri:  { min: 5, max: 15 },
  toplama_cikarma: { min: 3, max: 16 },
  carpma_bolme:    { min: 3, max: 12 },
  oruntu:          { min: 2, max: 10 },
};

// Modül sayıları (kategori başına)
const MODULE_COUNTS = {
  sayma: 10, subitizing: 6, karsilastirma: 7, sayi_bilesimi: 8,
  basamak_degeri: 8, toplama_cikarma: 9, carpma_bolme: 6, oruntu: 5,
};

// ── LT düzey yönetimi ──────────────────────

async function getCurrentLTLevels(childId) {
  const levels = {};
  for (const cat of CATEGORIES) {
    const history = await getLTHistoryByChild(childId, cat);
    const lastEntry = history.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

    levels[cat] = {
      level: lastEntry ? lastEntry.to_level : LT_RANGES[cat].min,
      progress: 0, // hesaplanacak
    };
  }

  // Her kategori için düzey içi ilerleme hesapla
  for (const cat of CATEGORIES) {
    levels[cat].progress = await calculateInLevelProgress(childId, cat, levels[cat].level);
  }

  return levels;
}

async function calculateInLevelProgress(childId, category, currentLevel) {
  const criteria = await checkLevelUpCriteria(childId, category);
  if (!criteria.criteria) return 0;

  const c = criteria.criteria;
  let totalCriteria = 4;
  let metCriteria = 0;

  if (c.accuracyCurrent >= c.accuracyRequired) metCriteria++;
  if (c.avgHintLevelCurrent <= c.maxHintLevelRequired) metCriteria++;
  if (c.questionsCompleted >= c.minQuestionsRequired) metCriteria++;
  if (c.concreteSupportCurrentRate <= c.concreteSupportMaxRate) metCriteria++;

  return Math.round((metCriteria / totalCriteria) * 100);
}

async function checkLevelUpCriteria(childId, category) {
  const levels = {};
  const history = await getLTHistoryByChild(childId, category);
  const lastEntry = history.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
  const currentLevel = lastEntry ? lastEntry.to_level : LT_RANGES[category].min;

  // Son düzey değişikliğinden bu yana olan olayları al
  const allAnswered = await getEventsByChildCategoryType(childId, category, 'question_answered');
  const sinceLastChange = lastEntry
    ? allAnswered.filter(e => e.timestamp > new Date(lastEntry.timestamp).getTime())
    : allAnswered;

  const questionsCompleted = sinceLastChange.length;
  const correct = sinceLastChange.filter(e => e.data.isCorrect).length;
  const accuracyCurrent = questionsCompleted > 0 ? correct / questionsCompleted : 0;
  const avgHintLevelCurrent = questionsCompleted > 0
    ? sinceLastChange.reduce((s, e) => s + (e.data.hintLevelUsed || 0), 0) / questionsCompleted
    : 0;
  const concreteCount = sinceLastChange.filter(e => e.data.representationUsed === 'somut').length;
  const concreteSupportCurrentRate = questionsCompleted > 0 ? concreteCount / questionsCompleted : 0;

  const criteria = {
    accuracyRequired: 0.80,
    accuracyCurrent,
    maxHintLevelRequired: 2,
    avgHintLevelCurrent,
    minQuestionsRequired: 10,
    questionsCompleted,
    concreteSupportMaxRate: 0.20,
    concreteSupportCurrentRate,
  };

  const missingCriteria = [];
  if (accuracyCurrent < 0.80) missingCriteria.push('accuracy');
  if (avgHintLevelCurrent > 2) missingCriteria.push('hint_level');
  if (questionsCompleted < 10) missingCriteria.push('min_questions');
  if (concreteSupportCurrentRate > 0.20) missingCriteria.push('concrete_support');

  const eligible = missingCriteria.length === 0 && currentLevel < LT_RANGES[category].max;

  return { eligible, currentLevel, criteria, missingCriteria };
}

async function checkLevelDownCriteria(childId, category) {
  const history = await getLTHistoryByChild(childId, category);
  const lastEntry = history.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
  const currentLevel = lastEntry ? lastEntry.to_level : LT_RANGES[category].min;

  if (currentLevel <= LT_RANGES[category].min) {
    return { shouldDrop: false, reason: null, currentLevel, suggestedLevel: currentLevel, evidence: {} };
  }

  const answered = await getEventsByChildCategoryType(childId, category, 'question_answered');
  const recent = answered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, 5);

  if (recent.length < 5) {
    return { shouldDrop: false, reason: null, currentLevel, suggestedLevel: currentLevel, evidence: {} };
  }

  const recentAccuracy = recent.filter(e => e.data.isCorrect).length / recent.length;
  const recentHintUsage = recent.reduce((s, e) => s + (e.data.hintLevelUsed || 0), 0) / recent.length;
  const consecutiveFailures = countConsecutiveFailures(recent);

  let shouldDrop = false;
  let reason = null;

  if (recentAccuracy < 0.30) {
    shouldDrop = true;
    reason = 'low_accuracy';
  } else if (recentHintUsage >= 4) {
    shouldDrop = true;
    reason = 'excessive_hints';
  } else if (consecutiveFailures >= 5) {
    shouldDrop = true;
    reason = 'consecutive_failures';
  }

  return {
    shouldDrop,
    reason,
    currentLevel,
    suggestedLevel: shouldDrop ? currentLevel - 1 : currentLevel,
    evidence: { recentAccuracy, recentHintUsage, consecutiveFailures },
  };
}

function countConsecutiveFailures(events) {
  let count = 0;
  for (const e of events) {
    if (!e.data.isCorrect) count++;
    else break;
  }
  return count;
}

// LT düzeyini güncelle
async function updateLTLevel(childId, category, newLevel, direction, criteriaSnapshot = {}) {
  const history = await getLTHistoryByChild(childId, category);
  const lastEntry = history.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
  const fromLevel = lastEntry ? lastEntry.to_level : LT_RANGES[category].min;

  if (fromLevel === newLevel) return null;

  const record = {
    childId,
    category,
    from_level: fromLevel,
    to_level: newLevel,
    direction,
    criteria_snapshot: JSON.stringify(criteriaSnapshot),
    timestamp: new Date().toISOString(),
  };

  await putRecord(STORES.LT_HISTORY, record);
  return record;
}

// ── İlerleme geçmişi ──────────────────────

async function getLTHistory(childId, category) {
  const history = await getLTHistoryByChild(childId, category);
  return history.map(h => ({
    date: new Date(h.timestamp),
    category: h.category,
    fromLevel: h.from_level,
    toLevel: h.to_level,
    direction: h.direction,
    criteriaSnapshot: typeof h.criteria_snapshot === 'string'
      ? JSON.parse(h.criteria_snapshot)
      : h.criteria_snapshot,
  })).sort((a, b) => a.date - b.date);
}

async function getProgressVelocity(childId, category) {
  const history = await getLTHistory(childId, category);
  const upMoves = history.filter(h => h.direction === 'up');

  if (upMoves.length < 2) {
    return {
      levelsPerWeek: 0,
      estimatedTimeToNextLevel_days: null,
      estimatedCompletionDate: null,
      velocityTrend: 'steady',
    };
  }

  const firstUp = upMoves[0].date.getTime();
  const lastUp = upMoves[upMoves.length - 1].date.getTime();
  const weeksElapsed = (lastUp - firstUp) / (7 * 86400000);
  const levelsPerWeek = weeksElapsed > 0 ? upMoves.length / weeksElapsed : 0;

  const currentLevels = await getCurrentLTLevels(childId);
  const currentLevel = currentLevels[category]?.level || LT_RANGES[category].min;
  const maxLevel = LT_RANGES[category].max;
  const remaining = maxLevel - currentLevel;

  const estimatedTimeToNextLevel_days = levelsPerWeek > 0 ? Math.ceil(7 / levelsPerWeek) : null;
  const estimatedCompletionDate = levelsPerWeek > 0
    ? new Date(Date.now() + (remaining / levelsPerWeek) * 7 * 86400000)
    : null;

  // Hız trendi
  let velocityTrend = 'steady';
  if (upMoves.length >= 4) {
    const halfIdx = Math.floor(upMoves.length / 2);
    const firstHalfGaps = [];
    const secondHalfGaps = [];
    for (let i = 1; i < halfIdx; i++) {
      firstHalfGaps.push(upMoves[i].date - upMoves[i - 1].date);
    }
    for (let i = halfIdx + 1; i < upMoves.length; i++) {
      secondHalfGaps.push(upMoves[i].date - upMoves[i - 1].date);
    }
    const avgFirst = firstHalfGaps.length > 0 ? firstHalfGaps.reduce((a, b) => a + b, 0) / firstHalfGaps.length : Infinity;
    const avgSecond = secondHalfGaps.length > 0 ? secondHalfGaps.reduce((a, b) => a + b, 0) / secondHalfGaps.length : Infinity;

    if (avgSecond < avgFirst * 0.7) velocityTrend = 'accelerating';
    else if (avgSecond > avgFirst * 1.3) velocityTrend = 'decelerating';
  }

  return { levelsPerWeek, estimatedTimeToNextLevel_days, estimatedCompletionDate, velocityTrend };
}

// ── Öğrenme yol haritası ─────────────────

async function getLearningMap(childId) {
  const levels = await getCurrentLTLevels(childId);
  const categories = [];

  for (const cat of CATEGORIES) {
    const range = LT_RANGES[cat];
    const current = levels[cat];

    // Modül tamamlama sayısı
    const moduleCompleted = await getEventsByChildCategoryType(childId, cat, 'module_completed');
    const uniqueModules = new Set(moduleCompleted.map(e => e.moduleId)).size;

    let status = 'not_started';
    const answered = await getEventsByChildCategoryType(childId, cat, 'question_answered');
    if (answered.length === 0) status = 'not_started';
    else if (current.level >= range.max) status = 'mastered';
    else {
      const recentAccuracy = await getCategoryAccuracy(childId, cat, {
        start: Date.now() - 7 * 86400000,
        end: Date.now(),
      });
      status = recentAccuracy < 0.5 ? 'struggling' : 'in_progress';
    }

    categories.push({
      name: cat,
      minLevel: range.min,
      maxLevel: range.max,
      currentLevel: current.level,
      progressInLevel: current.progress,
      status,
      modulesCompleted: uniqueModules,
      modulesTotal: MODULE_COUNTS[cat] || 8,
    });
  }

  const totalModulesCompleted = categories.reduce((s, c) => s + c.modulesCompleted, 0);
  const totalModules = Object.values(MODULE_COUNTS).reduce((a, b) => a + b, 0);
  const overallProgress = Math.round((totalModulesCompleted / totalModules) * 100);

  return { categories, overallProgress, totalModulesCompleted, totalModules };
}

export {
  CATEGORIES,
  LT_RANGES,
  MODULE_COUNTS,
  getCurrentLTLevels,
  checkLevelUpCriteria,
  checkLevelDownCriteria,
  updateLTLevel,
  getLTHistory,
  getProgressVelocity,
  getLearningMap,
};
