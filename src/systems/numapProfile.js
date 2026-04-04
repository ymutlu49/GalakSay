// ═══ NUMAP PROFİL MODÜLÜ — Bireyselleştirilmiş Oyun Deneyimi ══════════════
// NuMap (numap.diskalkuli.com) raporuna göre GalakSay'ı kişiselleştirme
// Rapor verileri: sayı hissi, aritmetik, çalışma belleği, risk düzeyi

// ═══ RAPOR ŞEMASI ══════════════════════════════════════════════════════════
// NuMap raporundan beklenen veri yapısı
export const NUMAP_SCHEMA = {
  source: "numap",
  child: { name: "", code: "", age: 0, grade: 0 },
  assessment: {
    numberSense: { score: 0, level: "low" },    // low | medium | high
    arithmetic: { score: 0, level: "low" },       // low | medium | high
    workingMemory: { score: 0, level: "low" },    // low | medium | high
    overallRisk: "medium",                         // low | medium | high
  },
  priority: [],    // [{ area: "numberSense", modes: ["counting", "subitizing", ...] }]
  secondary: [],   // [{ area: "arithmetic", modes: ["addition", ...] }]
  timestamp: null,
};

// ═══ RİSK → BAŞLANGIÇ SEVİYESİ HARİTALAMASI ═══════════════════════════
export const RISK_LEVEL_MAP = {
  low:    { startLevel: 3, scaffold: 2, label: "Düşük Risk" },
  medium: { startLevel: 1, scaffold: 1, label: "Orta Risk" },
  high:   { startLevel: 1, scaffold: 0, label: "Yüksek Risk" },
};

// ═══ ALAN → MOD HARİTALAMASI ═══════════════════════════════════════════
// NuMap değerlendirme alanlarına göre önerilen GalakSay modları
export const AREA_MODE_MAP = {
  numberSense: [
    "counting", "subitizing", "fivesFrame", "tensFrame", "doubleTensFrame",
    "chipGuess", "estimateCount", "quantityMatch", "conservation",
  ],
  arithmetic: [
    "addition", "subtraction", "addChips", "removeChips", "makeFive", "makeTen",
    "partWhole", "missingNumber",
  ],
  multiplication: [
    "repeatAdd", "arrayDots", "multiplyVisual", "timesTable",
    "equalShare", "groupCount", "divisionBasic",
  ],
  workingMemory: [
    "comparison", "ordering", "beforeAfter", "fiveMore",
    "patternAB", "growingPattern",
  ],
  placeValue: [
    "bundleTens", "expandForm", "composeNumber", "placeValue", "buildNumber",
  ],
};

// ═══ DESTEK DÜZEYLERİ ═══════════════════════════════════════════════════
export const SUPPORT_LEVELS = {
  high: {
    showVisualHints: true,
    showConcreteReps: true,
    showStepByStep: true,
    hintDelay: 3000,         // 3 sn sonra otomatik ipucu
    extraRetries: 2,
    simplifiedOptions: true, // daha az seçenek
  },
  medium: {
    showVisualHints: false,
    showConcreteReps: false,
    showStepByStep: false,
    hintDelay: 8000,         // 8 sn sonra ipucu butonu
    extraRetries: 1,
    simplifiedOptions: false,
  },
  low: {
    showVisualHints: false,
    showConcreteReps: false,
    showStepByStep: false,
    hintDelay: 0,            // ipucu yok (istek üzerine)
    extraRetries: 0,
    simplifiedOptions: false,
    bonusChallenges: true,   // ekstra zorluk görevleri
  },
};

// ═══ ANA PROFİL MOTORU ═══════════════════════════════════════════════════
export const NumapProfile = {
  // NuMap rapor verisini doğrula ve normalize et
  // v2.0 formatı: source="numap", assessment bridge + per-test priority/secondary
  validate: (data) => {
    if (!data) return null;
    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      // Kabul kriterleri: source="numap" veya assessment objesi var
      if (parsed.source !== "numap" && !parsed.assessment) return null;
      // v2.0 format: NUMAP planından gelen assessment bridge
      const assessment = parsed.assessment ? {
        numberSense: parsed.assessment.numberSense || { score: 50, level: "medium" },
        arithmetic: parsed.assessment.arithmetic || { score: 50, level: "medium" },
        workingMemory: parsed.assessment.workingMemory || { score: 50, level: "medium" },
        overallRisk: parsed.assessment.overallRisk || "medium",
      } : { numberSense: { score: 50, level: "medium" }, arithmetic: { score: 50, level: "medium" }, workingMemory: { score: 50, level: "medium" }, overallRisk: "medium" };
      return {
        source: "numap",
        version: parsed.version || "1.0",
        child: parsed.child || { name: "", code: "imported" },
        assessment,
        priority: parsed.priority || [],
        secondary: parsed.secondary || [],
        strengths: parsed.strengths || [],
        weeklyPlan: parsed.weeklyPlan || [],
        journeyPath: parsed.journeyPath || null,
        timestamp: parsed.generatedAt || parsed.timestamp || new Date().toISOString(),
      };
    } catch { return null; }
  },

  // Manuel profil oluştur (öğretmen/ebeveyn girişi)
  createManual: ({ name = "", risk = "medium", weakAreas = [], strongAreas = [] }) => {
    const assessment = {
      numberSense: { score: weakAreas.includes("numberSense") ? 30 : strongAreas.includes("numberSense") ? 80 : 50, level: weakAreas.includes("numberSense") ? "low" : strongAreas.includes("numberSense") ? "high" : "medium" },
      arithmetic: { score: weakAreas.includes("arithmetic") ? 30 : strongAreas.includes("arithmetic") ? 80 : 50, level: weakAreas.includes("arithmetic") ? "low" : strongAreas.includes("arithmetic") ? "high" : "medium" },
      workingMemory: { score: weakAreas.includes("workingMemory") ? 30 : strongAreas.includes("workingMemory") ? 80 : 50, level: weakAreas.includes("workingMemory") ? "low" : strongAreas.includes("workingMemory") ? "high" : "medium" },
      overallRisk: risk,
    };

    // Zayıf alanlara göre mod önerileri
    const priority = weakAreas.map(area => ({
      area,
      modes: AREA_MODE_MAP[area] || [],
    }));

    return {
      source: "numap",
      child: { name, code: "manual_" + Date.now() },
      assessment,
      priority,
      secondary: [],
      timestamp: new Date().toISOString(),
    };
  },

  // Risk düzeyine göre başlangıç seviyesi
  getStartLevel: (profile) => {
    if (!profile?.assessment) return 1;
    const risk = profile.assessment.overallRisk || "medium";
    return RISK_LEVEL_MAP[risk]?.startLevel || 1;
  },

  // Risk düzeyine göre scaffold seviyesi
  getScaffoldOverride: (profile) => {
    if (!profile?.assessment) return null;
    const risk = profile.assessment.overallRisk || "medium";
    return RISK_LEVEL_MAP[risk]?.scaffold ?? null;
  },

  // Risk düzeyine göre destek seviyesi
  getSupportLevel: (profile) => {
    if (!profile?.assessment) return SUPPORT_LEVELS.medium;
    const risk = profile.assessment.overallRisk || "medium";
    return SUPPORT_LEVELS[risk] || SUPPORT_LEVELS.medium;
  },

  // Önerilen modları al (zayıf alanlar öncelikli)
  getRecommendedModes: (profile) => {
    if (!profile) return [];
    const modes = new Set();
    // Öncelikli alanlar
    (profile.priority || []).forEach(p => {
      (p.modes || []).forEach(m => modes.add(m));
    });
    // İkincil alanlar
    (profile.secondary || []).forEach(s => {
      (s.modes || []).forEach(m => modes.add(m));
    });
    // Zayıf alanlardan otomatik mod önerisi
    if (modes.size === 0 && profile.assessment) {
      Object.entries(profile.assessment).forEach(([area, data]) => {
        if (area === "overallRisk") return;
        if (data.level === "low" || data.score < 40) {
          (AREA_MODE_MAP[area] || []).forEach(m => modes.add(m));
        }
      });
    }
    return [...modes];
  },

  // Adaptif zorluk kalibrasyonu — NuMap profili ile oyun performansını birleştir
  calibrateDifficulty: (profile, modeStats, currentLevel) => {
    if (!profile?.assessment) return currentLevel;
    const risk = profile.assessment.overallRisk || "medium";

    // Oyun içi performans varsa, NuMap'ten bağımsız adapte et
    if (modeStats && modeStats.played >= 3) {
      const recentAcc = modeStats.recentAcc || 0;
      if (recentAcc >= 85 && currentLevel < 7) return currentLevel + 1;
      if (recentAcc < 40 && currentLevel > 1) return currentLevel - 1;
      return currentLevel;
    }

    // Oyun verisi az ise NuMap risk düzeyine göre kalibre et
    if (risk === "high" && currentLevel > 2) return Math.max(1, currentLevel - 1);
    if (risk === "low" && currentLevel < 4) return Math.min(7, currentLevel + 1);
    return currentLevel;
  },

  // Oturum sonu performans kaydı
  recordSession: (profile, sessionData) => {
    if (!profile?.child?.code) return;
    try {
      const key = "numap_progress_" + profile.child.code;
      const existing = JSON.parse(localStorage.getItem(key) || '{"sessions":[],"updatedAt":null}');
      existing.sessions.push({
        mode: sessionData.mode,
        level: sessionData.level,
        correct: sessionData.correct,
        total: sessionData.total,
        acc: sessionData.acc,
        avgTime: sessionData.avgTime,
        date: new Date().toISOString(),
      });
      existing.updatedAt = new Date().toISOString();
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) { console.warn("NuMap session record error:", e); }
  },

  // İlerleme raporu üret — NuMap profili ile karşılaştır
  generateReport: (profile) => {
    if (!profile?.child?.code) return null;
    try {
      const key = "numap_progress_" + profile.child.code;
      const data = JSON.parse(localStorage.getItem(key) || '{"sessions":[]}');
      const sessions = data.sessions || [];
      if (sessions.length === 0) return null;

      // Alan bazlı performans özeti
      const areaPerf = {};
      sessions.forEach(s => {
        // Modu hangi alana ait bul
        Object.entries(AREA_MODE_MAP).forEach(([area, modes]) => {
          if (modes.includes(s.mode)) {
            if (!areaPerf[area]) areaPerf[area] = { sessions: 0, totalCorrect: 0, totalQ: 0 };
            areaPerf[area].sessions++;
            areaPerf[area].totalCorrect += s.correct;
            areaPerf[area].totalQ += s.total;
          }
        });
      });

      // Alan bazlı doğruluk oranları
      const areaAccuracy = {};
      Object.entries(areaPerf).forEach(([area, perf]) => {
        areaAccuracy[area] = perf.totalQ > 0 ? Math.round((perf.totalCorrect / perf.totalQ) * 100) : 0;
      });

      // Başlangıç profili ile karşılaştırma
      const comparison = {};
      if (profile.assessment) {
        Object.entries(profile.assessment).forEach(([area, initial]) => {
          if (area === "overallRisk") return;
          const current = areaAccuracy[area];
          if (current !== undefined) {
            comparison[area] = {
              initial: initial.score,
              current,
              improved: current > initial.score,
              delta: current - initial.score,
            };
          }
        });
      }

      return {
        totalSessions: sessions.length,
        areaAccuracy,
        comparison,
        lastSession: sessions[sessions.length - 1],
        updatedAt: data.updatedAt,
      };
    } catch { return null; }
  },
};
