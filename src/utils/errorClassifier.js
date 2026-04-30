// @ts-check
// GalakSay Pro — Yanlış cevapların pedagojik sınıflandırması.
// Diskalkuli müdahalesinde hatanın "ne tür" olduğu, doğru/yanlış olmasından çok daha bilgilendiricidir.
// Geri dönüş: { errorType, severity, evidence } — analitik event'lerine eklenir.

/** @typedef {import('../types').ClassifyInput} ClassifyInput */
/** @typedef {import('../types').Classification} Classification */
/** @typedef {import('../types').Question} Question */
//
// Kategoriler (literatür):
//  - conceptual    : Sayı bilgisi/yer değer/işlem anlamı kavranamamış (örn 23 yerine 5; basamak hatası)
//  - procedural    : İşlem adımları yanlış uygulanmış (örn 23 yerine 32 — basamak ters)
//  - operation_swap: Yanlış işlem (toplama yerine çıkarma — sembol yanlış okuma/seçme)
//  - off_by_one    : ±1 — sayma/start-counting hatası, klasik diskalkuli göstergesi
//  - sign_error    : Negatif/pozitif yön karışıklığı (karşılaştırma sorularında)
//  - magnitude     : Sayı büyüklüğü algısında ciddi sapma (cevap doğrudan en az 2× uzakta)
//  - attention     : Cevap çok hızlı (<800ms) — okumadan dokunma
//  - skip          : Cevap yok / boş gönderim
//  - random        : Tutarsız, sistematik olmayan hata (sınıflandırılamadı)

const FAST_RESPONSE_MS = 800;
const NEAR_MISS_DELTA = 1;

function digitsOf(n) {
  return String(Math.abs(Math.trunc(n))).split('').map(Number);
}

function isDigitSwap(given, expected) {
  if (!Number.isFinite(given) || !Number.isFinite(expected)) return false;
  if (given === expected) return false;
  const a = digitsOf(given), b = digitsOf(expected);
  if (a.length !== b.length || a.length < 2) return false;
  const sortedA = [...a].sort().join(',');
  const sortedB = [...b].sort().join(',');
  return sortedA === sortedB; // aynı rakamlar farklı sırada → basamak swap
}

function isOperationSwap(given, question) {
  if (!question || question.num1 == null || question.num2 == null) return false;
  const { num1, num2, type } = question;
  const candidates = {
    add: num1 + num2,
    sub: num1 - num2,
    mul: num1 * num2,
    div: num2 !== 0 ? num1 / num2 : null,
  };
  for (const [op, val] of Object.entries(candidates)) {
    if (val == null) continue;
    if (val === given && op !== type) return op;
  }
  return null;
}

/**
 * Bir cevabı pedagojik kategoriye sınıflandırır.
 * @param {ClassifyInput} input
 * @returns {Classification}
 */
export function classifyAnswer({ givenAnswer, correctAnswer, responseTimeMs, question, gameMode }) {
  // Boş / atlanmış
  if (givenAnswer == null || givenAnswer === '') {
    return { errorType: 'skip', severity: 'medium', evidence: 'Cevap verilmedi' };
  }

  const given = typeof givenAnswer === 'number' ? givenAnswer : Number(givenAnswer);
  const expected = typeof correctAnswer === 'number' ? correctAnswer : Number(correctAnswer);
  const numeric = Number.isFinite(given) && Number.isFinite(expected);

  if (numeric && given === expected) {
    return { errorType: 'correct', severity: 'none', evidence: 'Doğru cevap' };
  }

  // Çok hızlı cevap → dikkat hatası (okumadan dokunma)
  if (typeof responseTimeMs === 'number' && responseTimeMs > 0 && responseTimeMs < FAST_RESPONSE_MS) {
    return { errorType: 'attention', severity: 'low', evidence: `Cevap çok hızlı (${responseTimeMs}ms)` };
  }

  if (!numeric) {
    return { errorType: 'random', severity: 'low', evidence: 'Sayısal olmayan hata' };
  }

  const diff = given - expected;
  const absDiff = Math.abs(diff);

  // ±1 — sayma hatası (klasik diskalkuli göstergesi)
  if (absDiff === NEAR_MISS_DELTA) {
    return {
      errorType: 'off_by_one',
      severity: 'low',
      evidence: `${given} ≠ ${expected} (±1) — sayma başlangıç/son hatası`,
    };
  }

  // Yanlış işlem seçimi
  const swappedOp = isOperationSwap(given, question);
  if (swappedOp) {
    return {
      errorType: 'operation_swap',
      severity: 'high',
      evidence: `Cevap ${swappedOp} işlemi sonucu — sembol/işlem karışıklığı`,
    };
  }

  // Basamak ters (örn 23 → 32)
  if (isDigitSwap(given, expected)) {
    return {
      errorType: 'procedural',
      severity: 'medium',
      evidence: `${given} ↔ ${expected} basamak sırası karışık`,
    };
  }

  // Karşılaştırma için işaret hatası
  if (gameMode && /comp|less|more|compare/i.test(gameMode)) {
    return { errorType: 'sign_error', severity: 'medium', evidence: 'Karşılaştırma yönü ters' };
  }

  // Büyüklük hatası — gerçek değerden 2× veya daha uzak
  if (expected !== 0 && absDiff / Math.abs(expected) >= 1) {
    return {
      errorType: 'magnitude',
      severity: 'high',
      evidence: `${given}, doğru ${expected}'den ${absDiff} uzakta — büyüklük algısı zayıf`,
    };
  }

  // Genel kavramsal hata
  return {
    errorType: 'conceptual',
    severity: 'medium',
    evidence: `${given} ≠ ${expected} (sapma ${absDiff})`,
  };
}

export const ERROR_LABELS = {
  correct: 'Doğru',
  off_by_one: 'Birim Sayma Hatası',
  operation_swap: 'İşlem Karışıklığı',
  procedural: 'Prosedürel (Basamak)',
  sign_error: 'Yön Hatası',
  magnitude: 'Büyüklük Algısı',
  conceptual: 'Kavramsal',
  attention: 'Dikkat',
  skip: 'Atlandı',
  random: 'Belirsiz',
};

export const ERROR_GUIDANCE = {
  off_by_one: 'Tekrar say, parmaklarınla destek al.',
  operation_swap: 'İşlem işaretine bir kez daha bak.',
  procedural: 'Onlar ve birler basamağına dikkat et.',
  sign_error: 'Hangisi daha çok? Hangisi daha az?',
  magnitude: 'Sayı doğrusunda nerede olduğunu düşün.',
  conceptual: 'Yanındaki kapsülleri kullanarak yeniden dene.',
  attention: 'Soruyu tekrar oku, acele etme.',
  skip: 'Hadi birlikte deneyelim.',
  random: 'Bir kez daha dene.',
};
