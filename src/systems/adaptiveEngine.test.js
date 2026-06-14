import { describe, expect, it } from 'vitest';
import { AdaptiveEngine } from './adaptiveEngine.js';

describe('AdaptiveEngine.suggestLevel', () => {
  it('yetersiz veri → seviye sabit', () => {
    expect(AdaptiveEngine.suggestLevel({ played: 1 }, 3)).toBe(3);
    expect(AdaptiveEngine.suggestLevel(null, 3)).toBe(3);
  });

  it('yüksek doğruluk + hızlı → seviye +1', () => {
    const stats = { played: 5, recentAcc: 90, avgTime: 3 };
    expect(AdaptiveEngine.suggestLevel(stats, 3)).toBe(4);
  });

  it('düşük doğruluk → seviye -1', () => {
    const stats = { played: 5, recentAcc: 30, avgTime: 8 };
    expect(AdaptiveEngine.suggestLevel(stats, 3)).toBe(2);
  });

  it('seviye 7 üstüne çıkmaz', () => {
    const stats = { played: 5, recentAcc: 95, avgTime: 2 };
    expect(AdaptiveEngine.suggestLevel(stats, 7)).toBe(7);
  });

  it('seviye 1 altına inmez', () => {
    const stats = { played: 5, recentAcc: 20, avgTime: 9 };
    expect(AdaptiveEngine.suggestLevel(stats, 1)).toBe(1);
  });
});

describe('AdaptiveEngine.shouldSimplify / shouldChallenge', () => {
  it('düşük risk için 2 hata yetersiz', () => {
    expect(AdaptiveEngine.shouldSimplify(1)).toBe(false);
    expect(AdaptiveEngine.shouldSimplify(2)).toBe(true);
  });

  it('yüksek risk için 1 hata yeterli', () => {
    expect(AdaptiveEngine.shouldSimplify(1, 'high')).toBe(true);
  });

  it('low risk için 2 doğru challenge tetikler', () => {
    expect(AdaptiveEngine.shouldChallenge(2, 'low')).toBe(true);
    expect(AdaptiveEngine.shouldChallenge(1, 'low')).toBe(false);
  });
});

describe('AdaptiveEngine.updateModePerf', () => {
  it('ilk oyun → temel istatistik', () => {
    const r = AdaptiveEngine.updateModePerf(null, { acc: 80, correct: 8, total: 10, avgTime: 4, level: 3 });
    expect(r.played).toBe(1);
    expect(r.recentAcc).toBe(80);
    expect(r.lastLevel).toBe(3);
  });

  it('tekrarlanan kayıt rolling avg uygular', () => {
    let perf = AdaptiveEngine.updateModePerf(null, { acc: 100, correct: 10, total: 10, avgTime: 5, level: 2 });
    perf = AdaptiveEngine.updateModePerf(perf, { acc: 0, correct: 0, total: 10, avgTime: 8, level: 2 });
    expect(perf.played).toBe(2);
    expect(perf.recentAcc).toBe(50);
  });
});

describe('AdaptiveEngine.getReadyModes', () => {
  it('60% üstü modlar hazır sayılır', () => {
    const ready = AdaptiveEngine.getReadyModes({
      counting: { recentAcc: 80 },
      addition: { recentAcc: 50 },
      subtraction: { recentAcc: 60 },
    });
    expect(ready.has('counting')).toBe(true);
    expect(ready.has('addition')).toBe(false);
    expect(ready.has('subtraction')).toBe(true);
  });
});
