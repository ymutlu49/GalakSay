// GalakSay Pro — 2026-03-18 — Skeleton/shimmer yukleme bileşeni
import React from 'react';
import { colors } from '../colors.js';

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  variant = 'text', // text | circle | card
  style: sx,
}) {
  const isCircle = variant === 'circle';
  const isCard = variant === 'card';

  return (
    <div
      aria-busy="true"
      aria-label="Yükleniyor"
      style={{
        width: isCircle ? height : width,
        height: isCard ? 120 : height,
        borderRadius: isCircle ? '50%' : isCard ? 16 : borderRadius,
        background: colors.surface.card,
        position: 'relative',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease infinite',
      }} />
    </div>
  );
}
