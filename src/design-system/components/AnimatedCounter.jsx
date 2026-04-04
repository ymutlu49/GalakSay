// GalakSay Pro — 2026-03-20 — Animasyonlu sayaç bileşeni (slot machine / ticker efekti)
// Skor, ilerleme, sayı güncellenmelerinde kullanılır
import React, { useState, useEffect, useRef } from 'react';
import { typography } from '../typography.js';
import { colors } from '../colors.js';

/**
 * AnimatedCounter — Sayı değiştiğinde slot machine efektiyle güncellenen sayaç.
 *
 * Props:
 * - value: Gösterilecek sayı
 * - duration: Animasyon süresi (ms), varsayılan 300
 * - prefix: Sayıdan önce metin (ör. "%")
 * - suffix: Sayıdan sonra metin
 * - color: Metin rengi
 * - fontSize: Font boyutu (px)
 * - fontWeight: Font ağırlığı
 * - format: 'integer' | 'decimal' — sayı formatı
 */
export function AnimatedCounter({
  value = 0,
  duration = 300,
  prefix = '',
  suffix = '',
  color = colors.text.primary,
  fontSize = 28,
  fontWeight = 800,
  format = 'integer',
  style: sx,
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const [animating, setAnimating] = useState(false);
  const prevRef = useRef(value);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    prevRef.current = value;

    if (from === to) return;

    // Reduced motion check
    const reducedMotion = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    if (reducedMotion || duration <= 0) {
      setDisplayValue(to);
      return;
    }

    setAnimating(true);
    const startTime = performance.now();
    const diff = to - from;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + diff * eased;

      setDisplayValue(format === 'integer' ? Math.round(current) : Number(current.toFixed(1)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(to);
        setAnimating(false);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, format]);

  const formatted = format === 'decimal'
    ? displayValue.toFixed(1)
    : String(displayValue);

  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      style={{
        display: 'inline-block',
        fontSize,
        fontWeight,
        fontFamily: typography.fontFamily.display,
        color,
        tabularNums: true,
        fontVariantNumeric: 'tabular-nums',
        transition: animating ? 'none' : 'color 200ms ease',
        ...sx,
      }}
    >
      {prefix}{formatted}{suffix}
    </span>
  );
}
