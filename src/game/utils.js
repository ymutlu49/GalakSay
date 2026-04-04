// Random integer in range [a, b] inclusive
export const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

// Generate 3 answer options (1 correct + 2 distractors)
export const gen3 = (correct, nearby, min = 1, max = 20) => {
  if (max < min) max = min;
  if (correct < min) correct = min;
  if (correct > max) correct = max;
  // If range is too narrow for 3 distinct options, widen it
  if (max - min < 2) { min = Math.max(1, correct - 2); max = correct + 2; }
  const o = [correct];
  const useWideSpread = Math.random() < 0.5 && (max - min) >= 4;
  if (useWideSpread) {
    const close = nearby.filter(w => w >= min && w <= max && w !== correct);
    if (close.length > 0) o.push(close[Math.floor(Math.random() * close.length)]);
    let a = 0;
    while (o.length < 3 && a < 40) {
      const offset = (Math.random() < 0.5 ? -1 : 1) * (3 + Math.floor(Math.random() * 3));
      const w = correct + offset;
      if (w >= min && w <= max && !o.includes(w)) o.push(w);
      a++;
    }
  } else {
    nearby.forEach(w => { if (w >= min && w <= max && !o.includes(w) && o.length < 3) o.push(w); });
  }
  let a = 0;
  while (o.length < 3 && a < 80) { const w = min + Math.floor(Math.random() * (max - min + 1)); if (!o.includes(w)) o.push(w); a++; }
  // Fallback: fill with consecutive values
  let fb = 1;
  while (o.length < 3) { if (!o.includes(correct + fb)) o.push(correct + fb); else if (!o.includes(Math.max(1, correct - fb))) o.push(Math.max(1, correct - fb)); fb++; }
  return o.sort(() => Math.random() - .5);
};
