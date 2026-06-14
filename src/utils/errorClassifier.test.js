import { describe, expect, it } from 'vitest';
import { classifyAnswer } from './errorClassifier.js';

describe('classifyAnswer', () => {
  it('correct answer returns errorType=correct', () => {
    const r = classifyAnswer({ givenAnswer: 5, correctAnswer: 5, responseTimeMs: 1500 });
    expect(r.errorType).toBe('correct');
  });

  it('±1 sayma hatası → off_by_one', () => {
    const r = classifyAnswer({ givenAnswer: 6, correctAnswer: 7, responseTimeMs: 1500 });
    expect(r.errorType).toBe('off_by_one');
  });

  it('basamak ters → procedural', () => {
    const r = classifyAnswer({ givenAnswer: 32, correctAnswer: 23, responseTimeMs: 2000 });
    expect(r.errorType).toBe('procedural');
  });

  it('toplama yerine çıkarma → operation_swap', () => {
    const r = classifyAnswer({
      givenAnswer: 5,
      correctAnswer: 13,
      responseTimeMs: 2000,
      question: { type: 'add', num1: 9, num2: 4 },
    });
    expect(r.errorType).toBe('operation_swap');
  });

  it('çok hızlı cevap → attention', () => {
    const r = classifyAnswer({ givenAnswer: 8, correctAnswer: 5, responseTimeMs: 200 });
    expect(r.errorType).toBe('attention');
  });

  it('boş cevap → skip', () => {
    const r = classifyAnswer({ givenAnswer: '', correctAnswer: 7 });
    expect(r.errorType).toBe('skip');
  });

  it('büyük sapma → magnitude', () => {
    const r = classifyAnswer({ givenAnswer: 50, correctAnswer: 7, responseTimeMs: 1500 });
    expect(r.errorType).toBe('magnitude');
  });
});
