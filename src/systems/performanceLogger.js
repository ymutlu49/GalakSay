// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANS LOGLAMA MODÜLÜ — Yapılandırılmış Veri Kaydı (NuMap Entegrasyonu)
// Her soruda: yanıt süresi, doğruluk, ipucu kademe, temsil tercihi kaydedilir
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = "galaksay_perf_log";
const MAX_ENTRIES = 500; // Maksimum kayıt sayısı (eski kayıtlar budanır)

// ── Güvenli localStorage erişimi ──────────────────────────────────────────────
const safeGet = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    if (e?.name === "QuotaExceededError") {
      // Eski kayıtları buda
      try {
        const existing = safeGet(key, []);
        const trimmed = existing.slice(-Math.floor(MAX_ENTRIES / 2));
        localStorage.setItem(key, JSON.stringify(trimmed));
      } catch {}
    }
  }
};

// ── Soru Bazlı Log Kaydı ─────────────────────────────────────────────────────
export const createQuestionLog = ({
  mode,
  questionType,
  level,
  correct,
  responseTimeMs,
  hintLevel = 0,
  representationUsed = "symbolic",  // "concrete" | "visual" | "symbolic"
  concreteSupport = false,          // "Nesnelerle Göster" kullanıldı mı
  streak = 0,
  misconceptionType = null,
  ltLevel = null,
  numbers = null,                   // { num1, num2, answer } gibi soru verileri
}) => ({
  m: mode,                          // Kısa alan adları (storage optimizasyonu)
  qt: questionType,
  l: level,
  c: correct ? 1 : 0,
  rt: Math.round(responseTimeMs),
  hl: hintLevel,
  r: representationUsed[0],        // "c" | "v" | "s"
  cs: concreteSupport ? 1 : 0,
  s: streak,
  mc: misconceptionType,
  lt: ltLevel,
  n: numbers,
  t: Date.now(),
});

// ── Log Kayıtlarını Sakla ─────────────────────────────────────────────────────
export const PerformanceLogger = {
  // Tek soru logu ekle
  logQuestion(entry) {
    const logs = safeGet(STORAGE_KEY, []);
    logs.push(entry);
    // Buda
    const trimmed = logs.length > MAX_ENTRIES ? logs.slice(-MAX_ENTRIES) : logs;
    safeSet(STORAGE_KEY, trimmed);
  },

  // Tüm logları al
  getAll() {
    return safeGet(STORAGE_KEY, []);
  },

  // Mod bazlı logları al
  getByMode(mode) {
    return this.getAll().filter(l => l.m === mode);
  },

  // Son N logu al
  getRecent(n = 50) {
    const all = this.getAll();
    return all.slice(-n);
  },

  // ── Oturum Bazlı Analiz ──────────────────────────────────────────────────
  // Belirli bir mod için performans özeti
  getModeAnalysis(mode) {
    const logs = this.getByMode(mode);
    if (logs.length === 0) return null;

    const correct = logs.filter(l => l.c === 1);
    const avgRT = logs.reduce((s, l) => s + l.rt, 0) / logs.length;
    const avgHint = logs.reduce((s, l) => s + l.hl, 0) / logs.length;

    // Temsil tercihi dağılımı
    const repCounts = { c: 0, v: 0, s: 0 };
    logs.forEach(l => { if (repCounts[l.r] !== undefined) repCounts[l.r]++; });

    // Yanılgı dağılımı
    const misconceptions = {};
    logs.forEach(l => {
      if (l.mc) misconceptions[l.mc] = (misconceptions[l.mc] || 0) + 1;
    });

    // Son 10 sorunun trendi
    const recent10 = logs.slice(-10);
    const recentAcc = recent10.length > 0
      ? Math.round((recent10.filter(l => l.c === 1).length / recent10.length) * 100)
      : 0;
    const recentAvgRT = recent10.length > 0
      ? Math.round(recent10.reduce((s, l) => s + l.rt, 0) / recent10.length)
      : 0;

    return {
      mode,
      totalQuestions: logs.length,
      totalCorrect: correct.length,
      accuracy: Math.round((correct.length / logs.length) * 100),
      avgResponseTime: Math.round(avgRT),
      avgHintLevel: Number(avgHint.toFixed(1)),
      representationPreference: repCounts,
      misconceptions,
      recentAccuracy: recentAcc,
      recentAvgRT: recentAvgRT,
      firstPlayed: logs[0]?.t,
      lastPlayed: logs[logs.length - 1]?.t,
    };
  },

  // ── Çocuk Profili Özeti (NuMap uyumlu) ────────────────────────────────────
  getChildProfile() {
    const all = this.getAll();
    if (all.length === 0) return null;

    // Mod grupları
    const modeGroups = {};
    all.forEach(l => {
      if (!modeGroups[l.m]) modeGroups[l.m] = [];
      modeGroups[l.m].push(l);
    });

    // Genel istatistikler
    const totalQ = all.length;
    const totalC = all.filter(l => l.c === 1).length;
    const avgRT = Math.round(all.reduce((s, l) => s + l.rt, 0) / totalQ);
    const avgHL = Number((all.reduce((s, l) => s + l.hl, 0) / totalQ).toFixed(1));

    // Güçlü ve zayıf alanlar
    const modeAccuracies = {};
    Object.entries(modeGroups).forEach(([mode, logs]) => {
      const acc = Math.round((logs.filter(l => l.c === 1).length / logs.length) * 100);
      modeAccuracies[mode] = acc;
    });

    const sorted = Object.entries(modeAccuracies).sort((a, b) => b[1] - a[1]);
    const strengths = sorted.slice(0, 3).map(([m, a]) => ({ mode: m, accuracy: a }));
    const weaknesses = sorted.slice(-3).reverse().map(([m, a]) => ({ mode: m, accuracy: a }));

    // Temsil tercihi genel
    const repPref = { concrete: 0, visual: 0, symbolic: 0 };
    all.forEach(l => {
      if (l.r === "c") repPref.concrete++;
      else if (l.r === "v") repPref.visual++;
      else repPref.symbolic++;
    });

    // İpucu kullanım trendi (son 20 vs önceki)
    const recent20 = all.slice(-20);
    const older = all.slice(0, -20);
    const recentHintAvg = recent20.length > 0
      ? recent20.reduce((s, l) => s + l.hl, 0) / recent20.length
      : 0;
    const olderHintAvg = older.length > 0
      ? older.reduce((s, l) => s + l.hl, 0) / older.length
      : 0;
    const hintTrend = recentHintAvg < olderHintAvg ? "decreasing" : recentHintAvg > olderHintAvg ? "increasing" : "stable";

    return {
      totalQuestions: totalQ,
      totalCorrect: totalC,
      overallAccuracy: Math.round((totalC / totalQ) * 100),
      avgResponseTime: avgRT,
      avgHintLevel: avgHL,
      hintTrend,
      strengths,
      weaknesses,
      representationPreference: repPref,
      modesPlayed: Object.keys(modeGroups).length,
      sessionCount: this._estimateSessionCount(all),
      firstActivity: all[0]?.t,
      lastActivity: all[all.length - 1]?.t,
    };
  },

  // Oturum sayısı tahmini (30dk arası → yeni oturum)
  _estimateSessionCount(logs) {
    if (logs.length <= 1) return logs.length;
    let sessions = 1;
    for (let i = 1; i < logs.length; i++) {
      if (logs[i].t - logs[i - 1].t > 30 * 60 * 1000) sessions++;
    }
    return sessions;
  },

  // ── NuMap Uyumlu Rapor Çıktısı ───────────────────────────────────────────
  exportForNuMap() {
    const profile = this.getChildProfile();
    if (!profile) return null;

    return {
      version: "1.0",
      exportDate: new Date().toISOString(),
      source: "GalakSay",
      ...profile,
      modeDetails: Object.fromEntries(
        Array.from(new Set(this.getAll().map(l => l.m)))
          .map(mode => [mode, this.getModeAnalysis(mode)])
          .filter(([, v]) => v !== null)
      ),
    };
  },

  // Logları temizle
  clear() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  },
};
