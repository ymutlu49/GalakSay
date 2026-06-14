// GalakSay — Numap oturumu → oyun profili adaptörü.
//
// Numap'in sunucudan dönen değerlendirme oturumunu (payload.student + payload.results)
// GalakSay'ın oyunu kalibre etmek için kullandığı numapProfile (NUMAP_SCHEMA) biçimine
// çevirir. Faz 1: Numap'e DOKUNMADAN, ham doğruluk oranından (responses) türetilir.
//
// Risk skoru Numap payload'ında YOK (sunucuda norm + buildReport ile runtime üretilir).
// Bu yüzden burada Numap'in ölçüt-temelli (criterion-referenced) eşiğini kullanırız —
// norm tablosu boş yeni kurumda bile çalışır. Klinik kesinlik Faz 2'de Numap-tarafı
// buildReport ile artırılabilir (bkz. plan).

import { AREA_MODE_MAP } from './numapProfile.js';

// Numap iç test anahtarı → GalakSay değerlendirme alanı.
// Kaynak: numap-app report-interpretation.ts PARENT_CATEGORY (yetkili eşleme).
// - numberSense  ← sayı hissi (A1,A2,A3,A8) + sıralama/sayma akışı (A4,A10)
// - arithmetic   ← hesaplama (A5,A6,A7,A9) + çarpma/bölme (A11,A12)
// - workingMemory← hatırlama (B1-B6) + dikkat/ketleme (B5,B7,B8,B9)
const SUBTEST_AREA = {
  A1: 'numberSense', A2: 'numberSense', A3: 'numberSense', A8: 'numberSense',
  A4: 'numberSense', A10: 'numberSense',
  A5: 'arithmetic', A6: 'arithmetic', A7: 'arithmetic', A9: 'arithmetic',
  A11: 'arithmetic', A12: 'arithmetic',
  B1: 'workingMemory', B2: 'workingMemory', B3: 'workingMemory', B4: 'workingMemory',
  B6: 'workingMemory', B5: 'workingMemory', B7: 'workingMemory', B8: 'workingMemory',
  B9: 'workingMemory',
};

const AREAS = ['numberSense', 'arithmetic', 'workingMemory'];

// assessment (3 alan + risk) → priority/secondary müdahale modları. Hem ham (Faz 1)
// hem sunucu (Faz 2-B) yolu bunu kullanır → iki yol aynı mod davranışını verir.
// low→öncelikli, medium→ikincil; 3-4. sınıf + zayıf aritmetik → çarpma/bölme modları.
function deriveModes(assessment, grade) {
  const priority = [];
  const secondary = [];
  for (const area of AREAS) {
    const modes = AREA_MODE_MAP[area] || [];
    const lvl = assessment?.[area]?.level;
    if (lvl === 'low') priority.push({ area, modes });
    else if (lvl === 'medium') secondary.push({ area, modes });
  }
  if (grade >= 3 && assessment?.arithmetic?.level !== 'high') {
    priority.push({ area: 'multiplication', modes: AREA_MODE_MAP.multiplication });
  }
  return { priority, secondary };
}

// overallRisk (low/medium/high) → analitik 1-6 risk ölçeği (RiskClassifier; 1=iyi, 6=kötü).
const RISK_1_6 = { low: 2, medium: 4, high: 6 };

// Numap 3 değerlendirme alanı → Galaksay 8 öğrenme-yörüngesi (LT) kategorisi. Ön-son
// karşılaştırma (RiskClassifier.compareWithNuMapBaseline) için ORTAK ÖLÇEK üretir:
// assessment.level PERFORMANS'tır (high=iyi); analitik categoryRisks RİSK'tir (1=iyi, 6=kötü)
// → high performans = düşük risk. İki eksen ters; LEVEL_TO_RISK bunu çevirir.
const AREA_TO_LT = {
  numberSense: ['sayma', 'subitizing', 'karsilastirma', 'sayi_bilesimi'],
  arithmetic: ['toplama_cikarma', 'carpma_bolme', 'basamak_degeri'],
  workingMemory: ['oruntu'],
};
const LEVEL_TO_RISK = { high: 2, medium: 4, low: 6 };

/** assessment (3 alan {level}) → {ltKategori: risk(1-6)} — RiskClassifier.categoryRisks ile
 *  aynı eksen (ön-son kategori karşılaştırması bu sayede anlamlı çalışır). */
function areaScoresToCategoryRisks(assessment) {
  const out = {};
  for (const [area, cats] of Object.entries(AREA_TO_LT)) {
    const risk = LEVEL_TO_RISK[assessment?.[area]?.level] ?? 4;
    for (const cat of cats) out[cat] = risk;
  }
  return out;
}

/** Bir alt test sonucunun doğruluk oranı (%). Uygulanmadıysa/atlandıysa null. */
function resultAccuracy(r) {
  if (!r || r.skipped) return null;
  const items = Number(r.itemsAdministered) || 0;
  if (items <= 0) return null;
  if (!Array.isArray(r.responses)) return null;
  const correct = r.responses.filter((x) => x && x.correct).length;
  return Math.round((correct / items) * 100);
}

/** Doğruluk oranı → GalakSay alan düzeyi. Numap criterionBandFromAccuracy eşikleriyle
 *  hizalı: ≥85 sufficient→high, ≥70 developing→medium, <70 (limited/difficulty)→low. */
function accuracyToLevel(acc) {
  if (acc >= 85) return 'high';
  if (acc >= 70) return 'medium';
  return 'low';
}

/** Ortalama doğruluk → genel risk. Düşük performans = yüksek diskalkuli riski. */
function avgToOverallRisk(avg) {
  if (avg == null) return 'medium';
  if (avg >= 70) return 'low';
  if (avg >= 50) return 'medium';
  return 'high';
}

/** student.grade ("1".."4" / "preschool" / "anasinifi"...) → numapProfile sayısal grade. */
function parseGrade(grade) {
  const n = parseInt(grade, 10);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Numap oturumu → numapProfile (NUMAP_SCHEMA). NumapProfile.validate()'ten geçer.
 * @param {object} session  SavedSession benzeri: {id, studentKey, ageMonths, savedAt, payload:{student,results}}
 * @param {string} ns        namespace/childId (child.code pivotu)
 */
export function sessionToNumapProfile(session, ns) {
  const student = session?.payload?.student || {};
  const results = session?.payload?.results || {};
  const grade = parseGrade(student.grade);

  // Alan bazlı doğruluk: her alandaki uygulanan alt testlerin ortalaması.
  const areaAcc = {}; // area -> [acc, ...]
  let allAcc = [];
  for (const [key, r] of Object.entries(results)) {
    const area = SUBTEST_AREA[key];
    if (!area) continue;
    const acc = resultAccuracy(r);
    if (acc == null) continue;
    (areaAcc[area] ||= []).push(acc);
    allAcc.push(acc);
  }

  const assessment = { overallRisk: 'medium' };
  for (const area of AREAS) {
    const list = areaAcc[area];
    if (list && list.length) {
      const score = Math.round(list.reduce((s, x) => s + x, 0) / list.length);
      assessment[area] = { score, level: accuracyToLevel(score) };
    } else {
      // Bu alanda uygulanan alt test yok (ör. short_a modu B'yi atlar) → nötr varsayılan.
      assessment[area] = { score: 50, level: 'medium' };
    }
  }
  const globalAvg = allAcc.length ? allAcc.reduce((s, x) => s + x, 0) / allAcc.length : null;
  assessment.overallRisk = avgToOverallRisk(globalAvg);

  // Zayıf (low) alanlar öncelikli, orta (medium) alanlar ikincil müdahale.
  const { priority, secondary } = deriveModes(assessment, grade);

  return {
    source: 'numap',
    version: '1.0',
    child: {
      name: student.name || '',
      code: ns,
      age: session?.ageMonths ? Math.floor(session.ageMonths / 12) : 0,
      grade,
    },
    assessment,
    priority,
    secondary,
    timestamp: session?.savedAt || new Date().toISOString(),
  };
}

/**
 * Numap oturumu → AnalyticsBridge.initAnalytics metadata'sı (child_profiles kaydı).
 * @param {object} session
 */
export function sessionToChildMeta(session) {
  const student = session?.payload?.student || {};
  const profile = sessionToNumapProfile(session, ''); // overallRisk + assessment için yeniden kullan
  return {
    name: student.name || null,
    birthDate: student.birthDate || null,
    gradeLevel: student.grade || null,
    nuMapProfileId: session?.id || null,
    nuMapRiskLevel: RISK_1_6[profile.assessment.overallRisk] ?? 4,
    nuMapAssessmentDate: student.assessmentDate || session?.savedAt || null,
    // Akademik demografik değişkenler (payload.student'tan; CSV/PDF/analiz için).
    gender: student.gender || null,
    school: student.school || null,
    city: student.city || null,
    district: student.district || null,
    ageMonths: session?.ageMonths || null,
    // Ön-son karşılaştırma için Numap baseline kategori riski (1-6, RiskClassifier ölçeği).
    nuMapCategoryScores: areaScoresToCategoryRisks(profile.assessment),
  };
}

/** Oturum için kararlı namespace/childId. studentKey varsa deterministik (aynı çocuk →
 *  aynı id → ilerleme korunur); yoksa oturum id'sine düşülür (longitudinal bağ kopar). */
export function makeNamespace(session) {
  if (session?.studentKey) return `numap_${session.studentKey}`;
  return `numap_session_${session?.id || 'unknown'}`;
}

/** ChildSelect kartı + süzgeçleri için özet (tam payload gerektirmez). */
export function summarizeSession(session) {
  const student = session?.payload?.student || {};
  return {
    ns: makeNamespace(session),
    studentKey: session?.studentKey || null,
    name: session?.studentName || student.name || 'İsimsiz',
    ageMonths: session?.ageMonths || 0,
    grade: student.grade || '',
    savedAt: session?.savedAt || '',
    sessionId: session?.id || '',
    status: session?.status || 'completed',
    // Süzgeç alanları (payload.student'tan; biri boş olabilir)
    school: student.school || '',
    city: student.city || '',
    district: student.district || '',
    gender: student.gender || '',
    assessmentDate: student.assessmentDate || '',
    birthDate: student.birthDate || '',
  };
}

export default { sessionToNumapProfile, sessionToChildMeta, makeNamespace, summarizeSession };
