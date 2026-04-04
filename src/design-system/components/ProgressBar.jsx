// GalakSay Pro — 2026-03-18 — Merkezi ilerleme cubugu
import React from 'react';
import { colors } from '../colors.js';

export function ProgressBar({
  value = 0,
  max = 100,
  height = 8,
  gradient = colors.gradient.accent,
  showLabel = false,
  shimmer = true,
  style: sx,
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`İlerleme: %${Math.round(pct)}`}
      style={{
        width: '100%',
        height,
        borderRadius: 9999,
        background: colors.surface.input,
        overflow: 'hidden',
        position: 'relative',
        ...sx,
      }}
    >
      <div style={{
        height: '100%',
        width: `${pct}%`,
        borderRadius: 9999,
        background: gradient,
        transition: 'width 500ms ease-out',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {shimmer && pct > 0 && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s ease infinite',
          }} />
        )}
      </div>
      {showLabel && (
        <span style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: Math.max(10, height - 2),
          fontWeight: 700,
          color: colors.text.primary,
          textShadow: '0 1px 2px rgba(0,0,0,.5)',
        }}>
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
