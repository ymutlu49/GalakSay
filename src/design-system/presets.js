// @ts-check
// GalakSay Pro — Inline style preset'leri.
// Bileşenlerde tekrarlanan style nesneleri burada tanımlanır → daha az satır + tutarlılık.
// Saf değer döndürür (factory fonksiyon ile parametrize edilir); React render'da yeni referans yaratmaz.

import { colors } from './colors.js';
import { typography } from './typography.js';
import { spacing, layout } from './spacing.js';

// ═══ KART STİLLERİ ════════════════════════════════════════════════════════
export const cardStyle = Object.freeze({
  background: colors.gradient.card,
  border: `1px solid ${colors.surface.divider}`,
  borderRadius: layout.borderRadius.lg,
  padding: spacing[4],
  marginBottom: spacing[3],
  boxShadow: layout.shadow.sm,
});

export const cardSoftStyle = Object.freeze({
  background: 'rgba(30,27,75,.45)',
  border: '1px solid rgba(148,163,184,.08)',
  borderRadius: layout.borderRadius.lg,
  overflow: 'hidden',
});

// ═══ BAŞLIK / METIN ═══════════════════════════════════════════════════════
export const sectionTitle = Object.freeze({
  color: colors.text.primary,
  fontSize: typography.fontSize.xs,
  fontWeight: typography.fontWeight.semibold,
  fontFamily: typography.fontFamily.display,
  margin: `0 0 ${spacing[3]}px`,
});

export const labelStyle = Object.freeze({
  fontSize: 14,
  fontWeight: 700,
  color: colors.text.secondary,
  fontFamily: typography.fontFamily.display,
  marginBottom: 6,
  display: 'block',
});

export const emptyText = Object.freeze({
  color: colors.text.tertiary,
  fontSize: typography.fontSize.xs,
  margin: 0,
});

// ═══ DIALOG / BUTON ═══════════════════════════════════════════════════════
/**
 * Modal/dialog butonu (vazgeç/onayla ikilisi).
 * @param {'primary'|'secondary'|'danger'} kind
 */
export function dialogButtonStyle(kind = 'primary') {
  const base = {
    flex: 1,
    padding: '12px 16px',
    borderRadius: 12,
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: typography.fontFamily.display,
    fontSize: 15,
    border: 'none',
  };
  if (kind === 'secondary') {
    return {
      ...base,
      border: `1px solid ${colors.surface.divider}`,
      background: 'transparent',
      color: colors.text.secondary,
      fontWeight: 700,
    };
  }
  if (kind === 'danger') {
    return {
      ...base,
      background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
      color: '#fff',
    };
  }
  return {
    ...base,
    background: 'linear-gradient(135deg, #6C63FF, #A78BFA)',
    color: '#fff',
  };
}

// ═══ STATUS / ALERT ═══════════════════════════════════════════════════════
export const statusBox = Object.freeze({
  padding: '10px 16px',
  fontSize: 12,
  color: colors.text.secondary,
  borderTop: `1px solid ${colors.surface.divider}`,
  background: 'rgba(108,99,255,.06)',
});

// ═══ SAYFA / EKRAN ═══════════════════════════════════════════════════════
export const pageStyle = Object.freeze({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  background: colors.gradient.background,
  color: colors.text.primary,
  fontFamily: typography.fontFamily.primary,
});

export const fullScreenOverlay = Object.freeze({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  background: colors.gradient.background,
  fontFamily: typography.fontFamily.display,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
});
