// ═══════════════════════════════════════════════════════════════════════════════
// İŞLEMSEL AKICILIK MOTORU (Fluency Engine) — Seri Alıştırma (Drill) Modu
// Animasyonlu kavram inşasından sonra akıcılık geliştirme
// ═══════════════════════════════════════════════════════════════════════════════

// ── Streak Ödül Tanımları ─────────────────────────────────────────────────────
export const STREAK_REWARDS = {
  3:  { title: "Kuyruklu Yıldız!",   emoji: "☄️",  color: "#60a5fa" },
  5:  { title: "Süper Nova!",         emoji: "💥",  color: "#f59e0b" },
  7:  { title: "Galaksi Kaptanı!",    emoji: "🌟",  color: "#ef4444" },
  10: { title: "Evren Kahramanı!",    emoji: "🚀",  color: "#a855f7" },
  15: { title: "Kozmik Efsane!",      emoji: "✨",  color: "#ec4899" },
};

export const getStreakReward = (streak) => {
  const thresholds = [15, 10, 7, 5, 3];
  for (const t of thresholds) {
    if (streak >= t) return STREAK_REWARDS[t];
  }
  return null;
};

// ── Akıcılık Oturumu State Yapısı ─────────────────────────────────────────────
export const createFluencySession = (mode, level) => ({
  mode,
  level,
  startTime: Date.now(),
  questions: [],      // { questionId, responseTime, correct, hintLevel, representationUsed }
  streak: 0,
  bestStreak: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  concreteUsed: 0,    // "Nesnelerle Göster" butonu kullanım sayısı
});

// ── Soru Sonucu Kaydet ────────────────────────────────────────────────────────
export const recordFluencyAnswer = (session, result) => {
  const { correct, responseTime, hintLevel = 0, representationUsed = "symbolic" } = result;
  const newStreak = correct ? session.streak + 1 : 0;
  const entry = {
    questionIndex: session.totalQuestions,
    responseTime,
    correct,
    hintLevel,
    representationUsed,
    timestamp: Date.now(),
  };

  return {
    ...session,
    questions: [...session.questions, entry],
    streak: newStreak,
    bestStreak: Math.max(session.bestStreak, newStreak),
    totalCorrect: session.totalCorrect + (correct ? 1 : 0),
    totalQuestions: session.totalQuestions + 1,
    concreteUsed: session.concreteUsed + (representationUsed === "concrete" ? 1 : 0),
  };
};

// ── Dinamik Zorluk Ayarı ──────────────────────────────────────────────────────
export const adjustFluencyDifficulty = (session, currentLevel) => {
  const recent = session.questions.slice(-5);
  if (recent.length < 3) return { level: currentLevel, reason: null };

  const recentAcc = recent.filter(q => q.correct).length / recent.length;
  const avgTime = recent.reduce((s, q) => s + q.responseTime, 0) / recent.length;
  const avgHint = recent.reduce((s, q) => s + q.hintLevel, 0) / recent.length;

  // Zorluk artır: yüksek doğruluk + hızlı + az ipucu
  if (recentAcc >= 0.9 && avgTime < 4000 && avgHint < 0.5 && currentLevel < 7) {
    return { level: currentLevel + 1, reason: "fast_accurate" };
  }

  // Zorluk düşür: düşük doğruluk veya çok ipucu
  if ((recentAcc < 0.4 || avgHint >= 3) && currentLevel > 1) {
    return { level: currentLevel - 1, reason: "struggling" };
  }

  return { level: currentLevel, reason: null };
};

// ── Oturum Özeti ──────────────────────────────────────────────────────────────
export const getFluencySummary = (session) => {
  const duration = (Date.now() - session.startTime) / 1000; // saniye
  const accuracy = session.totalQuestions > 0
    ? Math.round((session.totalCorrect / session.totalQuestions) * 100)
    : 0;
  const avgTime = session.questions.length > 0
    ? Math.round(session.questions.reduce((s, q) => s + q.responseTime, 0) / session.questions.length)
    : 0;
  const avgHintLevel = session.questions.length > 0
    ? (session.questions.reduce((s, q) => s + q.hintLevel, 0) / session.questions.length).toFixed(1)
    : "0";

  // Performans rozeti
  let badge = "explorer"; // default
  if (accuracy >= 90 && avgTime < 3000) badge = "lightning";
  else if (accuracy >= 80) badge = "star";
  else if (accuracy >= 60) badge = "growing";

  const BADGES = {
    lightning: { emoji: "⚡", label: "Şimşek Hızı!", color: "#f59e0b" },
    star:      { emoji: "🌟", label: "Yıldız Kaşif!", color: "#6366f1" },
    growing:   { emoji: "🌱", label: "Büyüyen Güç!", color: "#22c55e" },
    explorer:  { emoji: "🔭", label: "Cesur Kaşif!", color: "#60a5fa" },
  };

  return {
    duration: Math.round(duration),
    totalQuestions: session.totalQuestions,
    totalCorrect: session.totalCorrect,
    accuracy,
    avgTime,
    avgHintLevel,
    bestStreak: session.bestStreak,
    concreteUsed: session.concreteUsed,
    badge: BADGES[badge],
    // Temsil tercihi dağılımı
    representationBreakdown: {
      concrete: session.questions.filter(q => q.representationUsed === "concrete").length,
      visual: session.questions.filter(q => q.representationUsed === "visual").length,
      symbolic: session.questions.filter(q => q.representationUsed === "symbolic").length,
    },
  };
};

// ── Kronometro Renk Mantığı (stres yaratmayan) ───────────────────────────────
export const getTimerColor = (elapsedMs, personalBest) => {
  // Asla kırmızıya dönmez — sadece pozitif motivasyon
  if (!personalBest) return "#94a3b8"; // nötr gri
  if (elapsedMs < personalBest * 0.8) return "#22c55e";  // yeşil: rekorun altında!
  if (elapsedMs < personalBest) return "#60a5fa";          // mavi: hedefe yakın
  return "#94a3b8";                                         // gri: nötr
};

// ── Kişisel Rekor Yönetimi ────────────────────────────────────────────────────
export const PersonalRecords = {
  getKey: (mode, level) => `fluency_record_${mode}_${level}`,

  get(mode, level) {
    try {
      const key = this.getKey(mode, level);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  },

  update(mode, level, summary) {
    try {
      const key = this.getKey(mode, level);
      const current = this.get(mode, level);
      const isNewRecord = !current
        || summary.accuracy > current.accuracy
        || (summary.accuracy === current.accuracy && summary.avgTime < current.avgTime);

      if (isNewRecord) {
        localStorage.setItem(key, JSON.stringify({
          accuracy: summary.accuracy,
          avgTime: summary.avgTime,
          bestStreak: summary.bestStreak,
          date: Date.now(),
        }));
      }
      return isNewRecord;
    } catch { return false; }
  },
};
