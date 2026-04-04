// ═══ GÜNLÜK GÖREV SİSTEMİ ══════════════════════════════════════════════════
// Rapor §6.2: Görev sistemi ile bağlılık artırma
// v5.5: Zenginleştirilmiş görevler — uzay temalı, çeşitli hedefler, haftalık görevler, seri takibi
export const QuestSystem = {
  generateDailyQuests: (stats) => {
    const today = new Date().toISOString().split("T")[0];
    const modesPlayed = Object.keys(stats?.modeStats || {}).length;
    const dayOfWeek = new Date().getDay();
    const totalGames = stats?.totalGames || 0;

    // Rotating quest variety based on day of week
    const questPools = [
      // Pool A: Oyun sayısı veya seri
      dayOfWeek % 2 === 0
        ? { id: `streak3_${today}`, type: "streak", target: 3, emoji: "🔥",
            title: "3'lü Yıldız Serisi", desc: "Bir oyunda 3 üst üste doğru cevap ver", reward: 45, progress: 0 }
        : { id: `play3_${today}`, type: "playGames", target: 3, emoji: "🎮",
            title: "3 Görev Tamamla", desc: "Bugün 3 oyun tamamla", reward: 50, progress: 0 },
      // Pool B: Farklı mod — keşif teşviki
      { id: `modes2_${today}`, type: "uniqueModes", target: 2, emoji: "🗺️",
        title: "2 Gezegen Keşfet", desc: "Bugün 2 farklı modda oyna", reward: 40, progress: 0 },
      // Pool C: Başarı oranı veya keşif — deneyime göre
      modesPlayed < 10
        ? { id: `explore_${today}`, type: "newMode", target: 1, emoji: "🌟",
            title: "Yeni Gezegen Keşfet", desc: "Daha önce ziyaret etmediğin bir gezegeni keşfet", reward: 60, progress: 0 }
        : { id: `acc80_${today}`, type: "highAcc", target: 80, emoji: "💎",
            title: "Yıldız Taşı Topla", desc: "Bir görevde %80 üzeri başarıyla yıldız taşı kazan", reward: 60, progress: 0 },
    ];

    // Pool D: Bonus görev — deneyimli oyuncular için
    if (totalGames >= 10 && dayOfWeek % 3 === 0) {
      questPools.push({
        id: `streak5_${today}`, type: "streak", target: 5, emoji: "⚡",
        title: "5'li Şimşek Serisi", desc: "Bir oyunda 5 üst üste doğru cevap ver", reward: 80, progress: 0,
      });
    }

    return { date: today, quests: questPools.slice(0, 4), completed: false };
  },

  updateProgress: (quests, gameResult, stats) => {
    if (!quests?.quests) return quests;
    const updated = { ...quests, quests: quests.quests.map(q => {
      const qc = { ...q };
      if (q.type === "playGames") qc.progress = Math.min(q.target, q.progress + 1);
      else if (q.type === "uniqueModes") {
        const todayModes = new Set(stats?.todayModes || []);
        todayModes.add(gameResult.mode);
        qc.progress = Math.min(q.target, todayModes.size);
      }
      else if (q.type === "newMode" && gameResult.isNew) qc.progress = 1;
      else if (q.type === "highAcc" && gameResult.acc >= 80) qc.progress = 1;
      else if (q.type === "streak" && (gameResult.maxStreak || 0) >= q.target) qc.progress = Math.min(q.target, q.target);
      return qc;
    })};
    updated.completed = updated.quests.every(q => q.progress >= (q.type === "highAcc" || q.type === "newMode" ? 1 : q.target));
    return updated;
  },

  getReward: (quests) => {
    if (!quests?.quests) return 0;
    return quests.quests.filter(q => q.progress >= (q.type === "highAcc" || q.type === "newMode" ? 1 : q.target)).reduce((sum, q) => sum + q.reward, 0);
  },

  // ═══ GÜNLÜK GİRİŞ SERİSİ — Her gün oyna, ödül kazan ═══
  // Login streak: ardışık gün sayısı arttıkça ödüller büyür
  getLoginStreak: (lastLoginDate) => {
    const today = new Date().toISOString().split("T")[0];
    if (!lastLoginDate) return { streak: 1, isNewDay: true, reward: 5, milestone: null };
    if (lastLoginDate === today) return { streak: 0, isNewDay: false, reward: 0, milestone: null };

    const last = new Date(lastLoginDate);
    const now = new Date(today);
    const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Ardışık gün — seri devam ediyor
      const stored = parseInt(localStorage.getItem("galaksay_login_streak") || "0");
      const newStreak = stored + 1;
      localStorage.setItem("galaksay_login_streak", String(newStreak));
      localStorage.setItem("galaksay_last_login", today);

      // Artan ödüller: gün sayısı arttıkça bonus da artar
      const baseReward = 5;
      const streakBonus = Math.min(newStreak * 2, 30); // max +30
      const reward = baseReward + streakBonus;

      // Milestone kontrol
      const milestones = {
        3: { emoji: "🔥", title: "3 Gün Serisi!", desc: "Üç gün üst üste oynamaya geldin!", bonus: 15 },
        7: { emoji: "⭐", title: "Haftalık Yıldız!", desc: "Tam bir hafta boyunca her gün oynadın!", bonus: 50 },
        14: { emoji: "💎", title: "İki Hafta Efsanesi!", desc: "14 gün boyunca hiç ara vermedin!", bonus: 100 },
        30: { emoji: "👑", title: "Galaktik Kararlılık!", desc: "30 gün boyunca her gün geldin — sen bir efsanesin!", bonus: 250 },
      };
      const milestone = milestones[newStreak] || null;

      return { streak: newStreak, isNewDay: true, reward, milestone };
    }

    // Seri kırıldı — sıfırla
    localStorage.setItem("galaksay_login_streak", "1");
    localStorage.setItem("galaksay_last_login", today);
    return { streak: 1, isNewDay: true, reward: 5, milestone: null };
  },

  // ═══ HAFTALIK GÖREV — Büyük hedefler, büyük ödüller ═══
  generateWeeklyQuest: (stats) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekId = weekStart.toISOString().split("T")[0];
    const totalGames = stats?.totalGames || 0;

    if (totalGames < 5) {
      return {
        weekId,
        id: `weekly_explore_${weekId}`,
        emoji: "🚀",
        title: "Galaksi Kaşifi",
        desc: "Bu hafta 5 farklı modda oyna",
        target: 5,
        progress: 0,
        reward: 200,
        type: "weeklyModes",
      };
    }
    return {
      weekId,
      id: `weekly_master_${weekId}`,
      emoji: "👑",
      title: "Yıldız Ustası",
      desc: "Bu hafta 10 oyun tamamla ve %70+ ortalama başarı yakala",
      target: 10,
      progress: 0,
      reward: 300,
      type: "weeklyGames",
    };
  },
};
