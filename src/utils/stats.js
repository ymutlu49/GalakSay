// GalakSay — Kütüphanesiz temel istatistik (ön-son müdahale etkisi için).
// Akademik raporlamada Numap baseline (ön) ↔ Galaksay güncel (son) karşılaştırması.

/** Sonlu değerlerin ortalaması (null/NaN atlanır). */
export function mean(xs) {
  const a = (xs || []).filter((x) => Number.isFinite(x));
  return a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
}

/** Örneklem standart sapması (n-1). n<2 → 0. */
export function sd(xs) {
  const a = (xs || []).filter((x) => Number.isFinite(x));
  if (a.length < 2) return 0;
  const m = mean(a);
  return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1));
}

/** Eşleştirilmiş ortalama fark (post − pre). */
export function pairedDelta(pre, post) {
  return mean(post) - mean(pre);
}

/**
 * Cohen's d — havuzlanmış SD ile etki büyüklüğü (post − pre yönünde).
 * Yeterli veri yoksa null. İşaret yorumu çağırana ait (risk için negatif = iyileşme).
 */
export function cohensD(pre, post) {
  const a = (pre || []).filter(Number.isFinite);
  const b = (post || []).filter(Number.isFinite);
  if (a.length < 2 || b.length < 2) return null;
  const sa = sd(a);
  const sb = sd(b);
  const pooled = Math.sqrt(((a.length - 1) * sa ** 2 + (b.length - 1) * sb ** 2) / (a.length + b.length - 2));
  if (!pooled) return null;
  return (mean(b) - mean(a)) / pooled;
}

/** |d| → niteliksel etki bandı (Cohen 1988). */
export function effectBand(d) {
  if (d == null) return 'hesaplanamadı';
  const a = Math.abs(d);
  if (a < 0.2) return 'ihmal edilebilir';
  if (a < 0.5) return 'küçük';
  if (a < 0.8) return 'orta';
  return 'büyük';
}

export default { mean, sd, pairedDelta, cohensD, effectBand };
