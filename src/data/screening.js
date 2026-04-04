// ═══ DİSKALKULİ TARAMA SİSTEMİ ════════════════════════════════════════════
// Rapor §3: Butterworth çerçevesi — sayı karşılaştırma, sayma, sembol-miktar eşleme
export const SCREENING = {
  name: "Diskalkuli Tarama",
  desc: "Erken dönem sayısal beceri değerlendirmesi",
  phases: [
    { id: "dotComp", name: "Nokta Karşılaştırma", desc: "Hangisi daha çok?", count: 8,
      generate: () => {
        const a = 2 + Math.floor(Math.random() * 7), b = a + (Math.random() > 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 2));
        const bClamped = Math.max(1, Math.min(9, b));
        return { type: "dotComp", a, b: bClamped, correct: a > bClamped ? "left" : a < bClamped ? "right" : "equal" };
      }
    },
    { id: "counting", name: "Sayma Becerisi", desc: "Kaç tane var?", count: 6,
      generate: () => {
        const n = 2 + Math.floor(Math.random() * 8);
        return { type: "screenCount", number: n, correct: n };
      }
    },
    { id: "symbolMatch", name: "Sembol-Miktar Eşleme", desc: "Sayı ile yıldız taşlarını eşle", count: 6,
      generate: () => {
        const n = 1 + Math.floor(Math.random() * 9);
        return { type: "symbolMatch", number: n, correct: n };
      }
    },
    { id: "numberLine", name: "Sayı Sırası", desc: "Sayıları sıraya koy", count: 5,
      generate: () => {
        const start = 1 + Math.floor(Math.random() * 5);
        const nums = [start, start + 1, start + 2];
        const shuffled = [...nums].sort(() => Math.random() - 0.5);
        return { type: "screenOrder", numbers: shuffled, correct: nums };
      }
    },
    { id: "subitizing", name: "Sanbil", desc: "Bir bakışta kaç tane?", count: 8,
      generate: () => {
        const n = 1 + Math.floor(Math.random() * 6);
        return { type: "screenSubitize", number: n, correct: n, displayTime: n <= 3 ? 1500 : 2000 };
      }
    },
  ],
  // Değerlendirme: her faz için accuracy ve response time
  evaluate: (results) => {
    const phaseScores = {};
    let totalCorrect = 0, totalQ = 0, totalTime = 0;
    results.forEach(r => {
      if (!phaseScores[r.phase]) phaseScores[r.phase] = { correct: 0, total: 0, avgTime: 0, times: [] };
      phaseScores[r.phase].total++;
      totalQ++;
      if (r.correct) { phaseScores[r.phase].correct++; totalCorrect++; }
      phaseScores[r.phase].times.push(r.time);
      totalTime += r.time;
    });
    Object.values(phaseScores).forEach(p => { p.avgTime = Math.round(p.times.reduce((a, b) => a + b, 0) / p.times.length); });
    const overallAcc = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;
    const avgTime = totalQ > 0 ? Math.round(totalTime / totalQ) : 0;
    // Risk değerlendirmesi
    let risk = "low";
    const weakPhases = Object.entries(phaseScores).filter(([_, v]) => v.total > 0 && (v.correct / v.total) < 0.5);
    if (overallAcc < 40 || weakPhases.length >= 3) risk = "high";
    else if (overallAcc < 60 || weakPhases.length >= 2) risk = "moderate";
    else if (overallAcc < 75) risk = "low-moderate";
    return { overallAcc, avgTime, phaseScores, risk, weakPhases: weakPhases.map(([k]) => k), totalCorrect, totalQ };
  },
  riskLabels: { low: { text: "Düşük Risk", color: "#059669", emoji: "✅" }, "low-moderate": { text: "Düşük-Orta Risk", color: "#eab308", emoji: "⚠️" }, moderate: { text: "Orta Risk", color: "#f97316", emoji: "⚠️" }, high: { text: "Yüksek Risk", color: "#ef4444", emoji: "🔴" } },
  riskAdvice: {
    low: "Çocuğunuzun sayısal becerileri yaşına uygun görünüyor. Galaksay ile pratik yapmaya devam edin!",
    "low-moderate": "Bazı alanlarda hafif zorluklar var. Galaksay'daki ilgili modlarda düzenli pratik önerilir.",
    moderate: "Birden fazla alanda zorluk tespit edildi. Bir eğitim uzmanına danışmanızı ve Galaksay ile destekleyici pratik yapmanızı öneririz.",
    high: "Önemli zorluklar tespit edildi. Diskalkuli değerlendirmesi için bir uzman pedagogdan randevu almanızı öneriyoruz. Galaksay destekleyici araç olarak kullanılabilir.",
  },
};
