// ═══ RENK PALETİ ═════════════════════════════════════════════════════════

// ═══ SABİT KAPSÜL BOYUTLARI ═════════════════════════════════════════════
// Tüm oyunda tutarlı enerji kapsülü ve yıldız taşı boyutları
// large: 1-5 (küçük kapsüller daha büyük hücre), standard: 6-10, compact: 11-16, mini: 17+
export const CAPSULE_CELL = { large: 40, standard: 34, compact: 22, mini: 16, micro: 12 };
export const capsuleSize = (count) =>
  count <= 5 ? CAPSULE_CELL.large : count <= 10 ? CAPSULE_CELL.standard : count <= 16 ? CAPSULE_CELL.compact : CAPSULE_CELL.mini;

export const C = {
  // Yıldız taşı renkleri — parlak, doygun, canlı
  blue: "#93c5fd", red: "#dc2626", green: "#059669",
  // §T3 Calcularis Transfer: Basamak değeri renk kodlaması
  pvOnes: "#059669", pvTens: "#93c5fd", pvHunds: "#dc2626", // birler=yeşil, onlar=açık mavi, yüzler=kırmızı
  // UI renkleri
  yellow: "#eab308", orange: "#ea580c", purple: "#7c3aed", teal: "#0d9488", pink: "#db2777",
  correct: "#059669", wrong: "#f97316", // Brand: Doğru=yeşil, yanlış=turuncu
  rodGold: "#f59e0b", rodDark: "#78350f", rodLight: "#fde047", slotDark: "#0a0a0a",
  // NUMAP Marka Renkleri — Mor Palette
  brandPurple: "#7c3aed", brandGreen: "#34d399", brandDark: "#2e1065",
  // UI buton renkleri — NUMAP mor teması
  uiBlue: "#7c3aed", uiGreen: "#059669",
};
