// ═══ OTURUM VE SEVİYE AYARLARI ════════════════════════════════════════════
export const SESSION_OPTIONS = [
  { value: 5,  label: 'Kısa',  icon: '⚡' },
  { value: 10, label: 'Orta',  icon: '🎯' },
  { value: 15, label: 'Uzun',  icon: '🏆' },
];

// Seviyeler — Galaktik yolculuk: her seviye bir gezegen/yıldız sistemi
export const LEVELS = {
  1: { name: "Ay Üssü",    maxNum: 5,  icon: "🌙", planet: "moon" },
  2: { name: "Mars",       maxNum: 7,  icon: "🔴", planet: "mars" },
  3: { name: "Jüpiter",    maxNum: 9,  icon: "🪐", planet: "jupiter" },
  4: { name: "Satürn",     maxNum: 12, icon: "💫", planet: "saturn" },
  5: { name: "Neptün",     maxNum: 15, icon: "🔵", planet: "neptune" },
  6: { name: "Andromeda",  maxNum: 18, icon: "🌌", planet: "andromeda" },
  7: { name: "Karadelik",  maxNum: 20, icon: "🕳️", planet: "blackhole" },
};

// Gezegen renkleri — seviye seçim ekranı için
export const PLANET_COLORS = {
  moon: "#c0c0c0",
  mars: "#e05533",
  jupiter: "#e8a848",
  saturn: "#d4a843",
  neptune: "#60a5fa",
  andromeda: "#a855f7",
  blackhole: "#1e1b4b",
};

// §Araştırma: Scaffolding Fading (Calcularis) — görsel desteği kademeli geri çekme
// Scaffold Level: 0=tam destek, 1=az destek, 2=destek yok
// %75 doğru hedefi (Number Race: optimal pekiştirme oranı)
export const getScaffoldLevel = (acc, streak) => {
  if (acc >= 85 && streak >= 3) return 2; // destek yok — ustalaştı
  if (acc >= 65 || streak >= 1) return 1; // az destek — gelişiyor
  return 0; // tam destek — öğreniyor
};

// Uzay temalı scaffold etiketleri
export const SCAFFOLD_LABELS = ["🛸 Pilot Desteği", "🧭 Navigasyon", "🚀 Solo Uçuş"];
