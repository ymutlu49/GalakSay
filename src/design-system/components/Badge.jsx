// GalakSay Pro — 2026-03-19 — Merkezi rozet/badge bileşeni (glow + icon varyantları)
import React from 'react';
import { colors } from '../colors.js';
import { typography } from '../typography.js';

export function Badge({
  children,
  color = colors.accent.primary,
  size = 'md',
  animate = false,
  glow = false,
  variant = 'default', // default | circle | icon
  style: sx,
}) {
  const sizes = {
    sm: { minW: 20, h: 20, fontSize: 11, padding: '0 6px' },
    md: { minW: 28, h: 28, fontSize: 13, padding: '0 10px' },
    lg: { minW: 40, h: 40, fontSize: 16, padding: '0 14px' },
    xl: { minW: 52, h: 52, fontSize: 22, padding: '0 14px' },
  };
  const s = sizes[size] || sizes.md;

  const isCircle = variant === 'circle' || variant === 'icon';
  const circleSize = s.h;

  return (
    <span
      role="status"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: isCircle ? circleSize : s.minW,
        width: isCircle ? circleSize : 'auto',
        height: s.h,
        padding: isCircle ? 0 : s.padding,
        borderRadius: isCircle ? '50%' : s.h,
        background: glow ? `linear-gradient(135deg, ${color}35, ${color}15)` : `${color}20`,
        color: color,
        fontSize: s.fontSize,
        fontWeight: 800,
        fontFamily: typography.fontFamily.display,
        border: `1px solid ${color}30`,
        boxShadow: glow ? `0 0 12px ${color}30, 0 0 24px ${color}15` : 'none',
        animation: animate ? 'bounceIn 400ms ease-out' : 'none',
        transition: 'box-shadow 200ms ease, transform 200ms ease',
        ...sx,
      }}
    >
      {children}
    </span>
  );
}
