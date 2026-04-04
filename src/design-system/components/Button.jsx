// GalakSay Pro — 2026-03-20 — Merkezi buton bileşeni (hover + a11y + ses entegrasyonu)
import React, { useState, useCallback } from 'react';
import { colors } from '../colors.js';
import { layout } from '../spacing.js';
import { typography } from '../typography.js';

const VARIANTS = {
  primary: {
    background: colors.gradient.accent,
    color: colors.text.primary,
    border: 'none',
    boxShadow: `0 4px 16px rgba(108,99,255,0.35), inset 0 1px 0 rgba(255,255,255,.15)`,
  },
  secondary: {
    background: 'transparent',
    color: colors.accent.primary,
    border: `2px solid ${colors.accent.primary}60`,
    boxShadow: 'none',
  },
  ghost: {
    background: 'transparent',
    color: colors.text.secondary,
    border: 'none',
    boxShadow: 'none',
  },
  success: {
    background: colors.gradient.success,
    color: colors.text.primary,
    border: 'none',
    boxShadow: `0 4px 16px rgba(0,212,170,0.3)`,
  },
  danger: {
    background: `${colors.accent.tertiary}20`,
    color: colors.accent.tertiary,
    border: `1px solid ${colors.accent.tertiary}40`,
    boxShadow: 'none',
  },
  gold: {
    background: colors.gradient.gold,
    color: colors.text.inverse,
    border: 'none',
    boxShadow: `0 4px 16px rgba(255,217,61,0.3)`,
  },
  icon: {
    background: 'rgba(108,99,255,.1)',
    color: colors.text.secondary,
    border: 'none',
    boxShadow: 'none',
  },
};

const SIZES = {
  sm: { height: 36, fontSize: 14, padding: '0 16px', borderRadius: layout.borderRadius.sm },
  md: { height: 44, fontSize: 16, padding: '0 22px', borderRadius: layout.borderRadius.md },
  lg: { height: 56, fontSize: 20, padding: '0 30px', borderRadius: layout.borderRadius.lg },
  xl: { height: 64, fontSize: 24, padding: '0 36px', borderRadius: layout.borderRadius.xl },
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  full = false,
  glow = false,
  icon = null,
  style: sx,
  ...rest
}) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.lg;
  const isDisabled = disabled || loading;
  const isIconVariant = variant === 'icon';

  const handlePointerDown = useCallback(() => { if (!isDisabled) setPressed(true); }, [isDisabled]);
  const handlePointerUp = useCallback(() => setPressed(false), []);

  const getTransform = () => {
    if (pressed) return 'scale(0.97)';
    if (hovered && !isDisabled) return 'scale(1.02)';
    return 'scale(1)';
  };

  const getFilter = () => {
    if (pressed) return 'brightness(0.95)';
    if (hovered && !isDisabled) return 'brightness(1.1)';
    return 'brightness(1)';
  };

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => { setPressed(false); setHovered(false); }}
      onPointerEnter={() => { if (!isDisabled) setHovered(true); }}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: s.height,
        minWidth: s.height,
        padding: isIconVariant ? 0 : s.padding,
        fontSize: s.fontSize,
        fontWeight: 800,
        fontFamily: typography.fontFamily.display,
        letterSpacing: 0.3,
        cursor: isDisabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        width: isIconVariant ? s.height : full ? '100%' : 'auto',
        border: v.border,
        borderRadius: isIconVariant ? '50%' : s.borderRadius,
        background: v.background,
        color: v.color,
        boxShadow: glow
          ? `${v.boxShadow}, 0 0 30px ${colors.accent.primary}25`
          : hovered && !isDisabled
            ? `${v.boxShadow}${v.boxShadow !== 'none' ? ', ' : ''}0 0 16px ${colors.accent.primary}15`
            : v.boxShadow,
        transition: 'all 150ms ease-out',
        transform: getTransform(),
        filter: getFilter(),
        position: 'relative',
        overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent',
        ...sx,
      }}
      {...rest}
    >
      {loading ? (
        <span
          role="status"
          aria-label="Yükleniyor"
          style={{
            width: s.fontSize,
            height: s.fontSize,
            border: `2px solid ${v.color}40`,
            borderTopColor: v.color,
            borderRadius: '50%',
            animation: 'spin .6s linear infinite',
            display: 'inline-block',
          }}
        />
      ) : (
        <>
          {icon && <span style={{ fontSize: s.fontSize, lineHeight: 1, display: 'flex' }}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
