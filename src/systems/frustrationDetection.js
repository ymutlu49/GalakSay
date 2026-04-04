// ═══════════════════════════════════════════════════════════════════════════
// FRUSTRASYON ALGILAMA ve DUYGUSAL DESTEK SİSTEMİ (FDS)
// Uzman Konsensüsü: 4/6 uzman — yanlış cevap frustrasyon riski yüksek
// Referans: Käser et al. (2013), Calcularis affect-aware tutoring
// ═══════════════════════════════════════════════════════════════════════════
export const FDS = {
  // Frustrasyon seviyesi: 0=sakin, 1=hafif, 2=orta, 3=yüksek
  calcLevel: (consecutiveWrongs, totalWrongs, totalQ, avgResponseTime, lastResponseTimes) => {
    let level = 0;
    // Ardışık yanlışlar
    if (consecutiveWrongs >= 4) level = 3;
    else if (consecutiveWrongs >= 3) level = 2;
    else if (consecutiveWrongs >= 2) level = 1;

    // Yanıt süresi anomalisi: çok hızlı yanıtlar (rastgele tıklama) frustrasyon göstergesi
    if (lastResponseTimes && lastResponseTimes.length >= 3) {
      const recent3 = lastResponseTimes.slice(-3);
      const avgRecent = recent3.reduce((s, t) => s + t, 0) / recent3.length;
      if (avgRecent < 1.5) level = Math.max(level, 2); // < 1.5s = rastgele tıklama
    }

    // Genel başarı oranı çok düşükse
    if (totalQ >= 4 && (totalWrongs / totalQ) > 0.7) level = Math.max(level, 2);

    return Math.min(level, 3);
  },

  // Frustrasyon seviyesine göre büyüme zihniyeti mesajları
  // Dweck (2006): Süreç odaklı geri bildirim > yetenek odaklı
  messages: {
    0: [], // Sakin — ek mesaj gereksiz
    1: [
      "Beynin şu an yeni bağlantılar kuruyor — bu harika! 🧠✨",
      "Zor sorular beynini daha güçlü yapıyor! 💪",
      "Her deneme bir adım ileri! Devam et 🌱",
    ],
    2: [
      "Derin bir nefes al... Hazır olduğunda deneyelim 🧘",
      "Bu konu zor, ama sen öğreniyorsun! Adım adım gidelim 🐢",
      "Hata yapmak çok normal — bilim insanları da böyle öğrenir! 🔬",
      "Yavaşça düşünmek hızlı düşünmekten daha değerli 🌟",
    ],
    3: [
      "Bir mola verelim mi? Bazen dinlenmek beyni güçlendirir! ☕",
      "Çok uğraşıyorsun — bu harika! Ama zorunda değilsin, istersen farklı bir mod deneyelim 🗺️",
      "Hatalar öğrenmenin en doğal parçası. Beraber daha kolay bir adımdan başlayalım mı? 🤝",
    ],
  },

  // Frustrasyon seviyesine göre adaptif müdahaleler
  getIntervention: (level) => {
    if (level <= 0) return null;
    if (level === 1) return { type: "encourage", action: "growthMindsetMsg" };
    if (level === 2) return { type: "simplify", action: "reduceDifficulty", msg: "Kolay soru geliyor — güvenini topla! 🌈" };
    return { type: "break", action: "suggestBreakOrModeChange" };
  },

  getMessage: (level) => {
    const msgs = FDS.messages[level];
    if (!msgs || msgs.length === 0) return null;
    return msgs[Math.floor(Math.random() * msgs.length)];
  },
};
