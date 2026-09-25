// Analitik boru hattı — sıfır veri (yeni çocuk) ve zengin veri (4 hafta) ile uçtan uca.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { makeMemoryDb, seedRichChild, findBadValues } from './__fixtures__/memoryDb.js';

let db = makeMemoryDb();
vi.mock('./database.js', () => {
  // vi.mock hoisted → db'ye erişim kapanış üzerinden (her testte reset edilir)
  const proxy = {};
  const names = ['STORES', 'openDB', 'putRecord', 'putBatch', 'getRecord', 'getAllFromStore', 'queryByIndex', 'deleteRecord',
    'countByIndex', 'getChildProfile', 'saveChildProfile', 'getSessionsByChild', 'getEventsBySession', 'getEventsByChildAndType',
    'getEventsByChildCategoryType', 'getLTHistoryByChild', 'getDailySummaries', 'getWeeklySummaries', 'getAlertsByChild',
    'markAlertRead', 'getAchievementsByChild', 'deleteChildRecords', 'purgeChildDemographics'];
  for (const n of names) {
    proxy[n] = n === 'STORES'
      ? { CHILD_PROFILES: 'child_profiles', SESSIONS: 'game_sessions', EVENTS: 'game_events', LT_HISTORY: 'lt_progress_history', DAILY_SUMMARY: 'daily_performance_summary', WEEKLY_SUMMARY: 'weekly_performance_summary', ALERTS: 'alerts', ACHIEVEMENTS: 'achievements' }
      : (...a) => globalThis.__memDb[n](...a);
  }
  return proxy;
});
vi.mock('./EventCollector.js', () => ({ trackEvent: () => 'x', flushEvents: async () => {} }));

import { calculateRiskLevel, screenDyscalculiaIndicators, computeCategoryRisk, compareWithNuMapBaseline } from './RiskClassifier.js';
import { getStrengthWeaknessProfile, classifyCategory } from './StrengthWeaknessMapper.js';
import { generateRecommendations } from './RecommendationEngine.js';
import { getFullPerformanceProfile, getDailyTrend, localDateKey, getCategoryStats, MIN_ITEMS_OVERALL, computeDose, computeProgressMonitoring, getErrorProfile } from './PerformanceAnalyzer.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { ROBOTO_REGULAR_B64, ROBOTO_BOLD_B64 } from './pdfFonts.js';

const PDF_OUT = process.env.PDF_OUT; // ayarlıysa PDF'ler diske yazılır (görsel inceleme)
function dumpPdf(doc, name) {
  if (!PDF_OUT) return;
  mkdirSync(PDF_OUT, { recursive: true });
  writeFileSync(`${PDF_OUT}/${name}`, Buffer.from(doc.output('arraybuffer')));
}
const fonts = PDF_OUT ? { regular: ROBOTO_REGULAR_B64, bold: ROBOTO_BOLD_B64 } : undefined;
import { getLearningMap, getCurrentLTLevels } from './LTProgressEngine.js';
import { checkAlerts } from './AlertSystem.js';
import { onSessionEnd, getWeekStart } from './SummaryScheduler.js';
import { buildReportData, renderReport } from './PDFReportGenerator.js';
import { jsPDF } from 'jspdf';

beforeEach(() => {
  db = makeMemoryDb();
  globalThis.__memDb = db;
});

describe('saf yardımcılar', () => {
  it('localDateKey yerel günü verir', () => {
    expect(localDateKey(new Date(2026, 0, 5, 1, 30))).toBe('2026-01-05');
    expect(localDateKey('geçersiz')).toBe('');
  });
  it('getWeekStart Pazartesi döner', () => {
    expect(getWeekStart(new Date(2026, 8, 27))).toBe('2026-09-21'); // Pazar → önceki Pzt
    expect(getWeekStart(new Date(2026, 8, 21))).toBe('2026-09-21');
  });
  it('computeCategoryRisk açıklanabilir bantlar', () => {
    expect(computeCategoryRisk(0.95, 0.2, 'tutarli').risk).toBe(1);
    expect(computeCategoryRisk(0.65, 2.5, 'dalgali').risk).toBe(3);
    expect(computeCategoryRisk(0.30, 4.5, 'tutarsiz').risk).toBe(6);
    // hız bileşeni: kendi medyanının 1,5 katı + doğruluk <%70
    expect(computeCategoryRisk(0.62, 0, 'tutarli', 9000, 4000).slow).toBe(true);
    expect(computeCategoryRisk(0.90, 0, 'tutarli', 9000, 4000).slow).toBe(false);
  });
  it('computeDose: 42 oturum hedefi ve haftalık uyum', () => {
    const now = new Date(2026, 8, 24, 12).getTime(); // Perşembe
    const mk = (daysAgo, min = 20) => ({ startTime: new Date(now - daysAgo * 86400000).toISOString(), durationMs: min * 60000 });
    const d = computeDose([mk(0), mk(1), mk(2), mk(9), mk(16)], now);
    expect(d.sessionsDone).toBe(5);
    expect(d.weekSessions).toBe(3);
    expect(d.weekStatus).toBe('met');
    expect(d.pctSessions).toBe(12);
    expect(d.remainingSessions).toBe(37);
    expect(computeDose([mk(10)], now).weekStatus).toBe('none');
    expect(computeDose([], now).sessionsDone).toBe(0);
  });
  it('computeProgressMonitoring: hedef çizgisi + 4-nokta kuralı', () => {
    const mk = (i, acc) => ({ startTime: new Date(2026, 8, 1 + i).toISOString(), questionsAttempted: 10, questionsCorrect: acc / 10 });
    const low = computeProgressMonitoring([mk(0, 50), mk(1, 55), mk(2, 40), mk(3, 45), mk(4, 42), mk(5, 44)]);
    expect(low.aimline[0].value).toBe(50);
    expect(low.decision).toBe('intensify');
    const high = computeProgressMonitoring([mk(0, 50), mk(1, 55), mk(2, 70), mk(3, 75), mk(4, 80), mk(5, 90)]);
    expect(high.decision).toBe('raise_goal');
    expect(computeProgressMonitoring([mk(0, 50), mk(1, 55)]).decision).toBe('insufficient');
    expect(computeProgressMonitoring([]).points).toEqual([]);
  });
  it('classifyCategory örneklem eşiğine uyar', () => {
    expect(classifyCategory({ n: 3, sufficient: false, accuracy: 0, avgHint: 0 })).toBe('not_assessed');
    expect(classifyCategory({ n: 20, sufficient: true, accuracy: 0.9, avgHint: 0.5 })).toBe('strength');
    expect(classifyCategory({ n: 20, sufficient: true, accuracy: 0.5, avgHint: 1 })).toBe('weakness');
    expect(classifyCategory({ n: 20, sufficient: true, accuracy: 0.7, avgHint: 1 })).toBe('emerging');
  });
});

describe('sıfır veri (yeni çocuk)', () => {
  const id = 'local_new';
  beforeEach(() => { db.__data.child_profiles.set(id, { childId: id, name: 'Elif Öz', gradeLevel: '1' }); });

  it('risk: yetersiz veri, NaN/undefined yok', async () => {
    const r = await calculateRiskLevel(id);
    expect(r.overallRisk).toBeNull();
    expect(r.riskLabel).toBe('Yetersiz veri');
    expect(r.dataSufficiency).toBe('insufficient');
    expect(r.unassessedCategories).toHaveLength(8);
    expect(r.riskFactors).toHaveLength(0);
    expect(r.explanation).toContain(`${MIN_ITEMS_OVERALL}`);
    expect(findBadValues(r)).toEqual([]);
  });
  it('güçlü/zayıf: hepsi değerlendirilmedi', async () => {
    const sw = await getStrengthWeaknessProfile(id);
    expect(sw.strengths).toHaveLength(0);
    expect(sw.weaknesses).toHaveLength(0);
    expect(sw.notAssessed).toHaveLength(8);
  });
  it('öneriler: veri toplama adımı, NaN yok', async () => {
    const recs = await generateRecommendations(id);
    expect(Number.isFinite(recs.scheduleRecommendations.optimalSessionDuration_min)).toBe(true);
    expect(recs.teacherNextSteps[0].area).toBe('Veri toplama');
    expect(recs.professionalReferral.needed).toBe(false);
    expect(findBadValues(recs)).toEqual([]);
  });
  it('tarama: yetersiz veri', async () => {
    const s = await screenDyscalculiaIndicators(id);
    expect(s.overallScreeningResult).toBe('insufficient_data');
    expect(s.indicatorsFound).toHaveLength(0);
  });
  it('öğrenme haritası: %0, düzey içi ilerleme 0', async () => {
    const lm = await getLearningMap(id);
    expect(lm.overallProgress).toBe(0);
    expect(lm.categories.every(c => c.status === 'not_started' && c.progressInLevel === 0)).toBe(true);
    const lt = await getCurrentLTLevels(id);
    expect(lt.sayma.progress).toBe(0);
  });
  it('profil + eğilim + uyarılar boş ama geçerli', async () => {
    const p = await getFullPerformanceProfile(id);
    expect(p.totalAnswered).toBe(0);
    expect(p.overallAccuracyOrNull).toBeNull();
    expect(findBadValues(p)).toEqual([]);
    expect(await getDailyTrend(id)).toEqual([]);
    expect(await checkAlerts(id, {})).toEqual([]);
    expect(await compareWithNuMapBaseline(id)).toBeNull();
  });
  it('PDF render (boş veri) hata vermez', async () => {
    const data = await buildReportData(id);
    expect(findBadValues(data.risk)).toEqual([]);
    const doc = new jsPDF('p', 'mm', 'a4');
    const name = renderReport(doc, data, { childId: id, fonts });
    expect(name).toBe('Elif Öz');
    expect(doc.internal.getNumberOfPages()).toBeGreaterThanOrEqual(4);
    dumpPdf(doc, 'rapor-bos.pdf');
  });
});

describe('zengin veri (4 hafta)', () => {
  const id = 'numap_rich';
  beforeEach(() => {
    seedRichChild(db, id, {
      accuracy: { sayma: 0.95, subitizing: 0.85, basamak_degeri: 0.35, toplama_cikarma: 0.55 },
      hint: { sayma: 0.2, subitizing: 0.5, basamak_degeri: 4.2, toplama_cikarma: 2.5 },
      rt: { basamak_degeri: 9000 },
    });
    db.__data.child_profiles.get(id).nuMapRiskLevel = 4;
    db.__data.child_profiles.get(id).nuMapAssessmentDate = new Date(Date.now() - 40 * 86400000).toISOString();
    db.__data.child_profiles.get(id).nuMapCategoryScores = { sayma: 4, basamak_degeri: 4, oruntu: 2 };
  });

  it('kategori istatistikleri tutarlı', async () => {
    const st = await getCategoryStats(id, 'sayma');
    expect(st.n).toBeGreaterThanOrEqual(8);
    expect(st.accuracy).toBeGreaterThan(0.85);
    expect(st.sufficient).toBe(true);
  });
  it('risk: güçlü alan düşük, zayıf alan yüksek risk; açıklama var', async () => {
    const r = await calculateRiskLevel(id);
    expect(r.overallRisk).toBeGreaterThanOrEqual(1);
    expect(r.overallRisk).toBeLessThanOrEqual(6);
    expect(r.categoryRisks.sayma).toBeLessThanOrEqual(2);
    expect(r.categoryRisks.basamak_degeri).toBeGreaterThanOrEqual(5);
    expect(r.protectiveFactors.some(f => f.category === 'sayma')).toBe(true);
    expect(r.riskFactors.some(f => f.category === 'basamak_degeri' && f.severity === 'high')).toBe(true);
    expect(r.explanation).toMatch(/Basamak Değeri/);
    expect(findBadValues(r)).toEqual([]);
  });
  it('güçlü/zayıf + öneriler veriden türer', async () => {
    const sw = await getStrengthWeaknessProfile(id);
    expect(sw.strengths.map(s => s.category)).toContain('sayma');
    expect(sw.weaknesses.map(w => w.category)).toContain('basamak_degeri');
    expect(sw.notAssessed).toHaveLength(0);
    const recs = await generateRecommendations(id);
    expect(recs.teacherNextSteps.some(s => s.category === 'basamak_degeri' && s.priority === 'high')).toBe(true);
    expect(recs.activityRecommendations[0].priority).toBe('high');
    expect(recs.parentNote).toMatch(/Sayma/);
    expect(findBadValues(recs)).toEqual([]);
  });
  it('Numap karşılaştırması ve tarama', async () => {
    const c = await compareWithNuMapBaseline(id);
    expect(c.nuMapRiskLevel).toBe(4);
    expect(['improved', 'stable', 'worsened']).toContain(c.change);
    expect(c.timeElapsed_days).toBe(40);
    expect(c.categoryComparisons.find(x => x.category === 'sayma').trend).toBe('improved');
    const s = await screenDyscalculiaIndicators(id);
    expect(s.screenedIndicators.length).toBeGreaterThanOrEqual(4);
    expect(s.indicatorsFound.some(i => i.indicator === 'basamak_degeri_karmasasi')).toBe(true);
  });
  it('günlük eğilim + günlük özet kopyasız', async () => {
    const trend = await getDailyTrend(id, 30);
    expect(trend.length).toBeGreaterThanOrEqual(8);
    expect(trend.every(t => t.n > 0 && t.accuracy >= 0 && t.accuracy <= 100)).toBe(true);
    const today = localDateKey(new Date());
    // bugünkü oturumu iki kez kapat → aynı gün×kategori tek satır
    await onSessionEnd(id, 's_x', { duration_ms: 5 * 60000 });
    await onSessionEnd(id, 's_y', { duration_ms: 5 * 60000 });
    const rows = [...db.__data.daily_performance_summary.values()].filter(r => r.date === today);
    const keys = rows.map(r => r.category);
    expect(new Set(keys).size).toBe(keys.length);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every(r => r.totalTimeMs > 0)).toBe(true);
  });
  it('öğrenme haritası modül sayımı tavanı aşmaz', async () => {
    const lm = await getLearningMap(id);
    expect(lm.categories.every(c => c.modulesCompleted <= c.modulesTotal)).toBe(true);
    expect(lm.overallProgress).toBeGreaterThan(0);
  });
  it('PDF render (zengin veri) hata vermez, NaN yok', async () => {
    const data = await buildReportData(id);
    expect(findBadValues({ risk: data.risk, sw: data.sw, recs: data.recs, trend: data.profile.dailyTrend })).toEqual([]);
    const doc = new jsPDF('p', 'mm', 'a4');
    renderReport(doc, data, { childId: id, fonts });
    expect(doc.internal.getNumberOfPages()).toBeGreaterThanOrEqual(5);
    dumpPdf(doc, 'rapor-zengin.pdf');
    const ep = await getErrorProfile(id);
    expect(ep.hasErrorTypes).toBe(true);
    expect(ep.top[0].type).toBe('off_by_one');
  });
});
