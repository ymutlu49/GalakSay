// GalakSay Pro — 2026-03-18 — Tasarım sistemi React hook'u
// Tüm tasarım tokenlarını ve yardımcı fonksiyonları tek hook'tan erişilebilir kılar
import { useMemo, useCallback } from 'react';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { spacing, layout } from '../design-system/spacing.js';

/**
 * Tasarım sistemi hook'u — tüm tokenları ve yardımcı fonksiyonları döndürür.
 *
 * Kullanım:
 *   const { colors, font, space, radius, shadow, cardStyle, inputStyle } = useDesignSystem();
 *
 * Avantajı: Tüm bileşenler aynı kaynaklardan beslenir, tutarlılık garanti edilir.
 */
export function useDesignSystem() {
  // ─── Yardımcı fonksiyonlar ─────────────────────────────────

  // Font boyutu alma
  const font = useCallback((size = 'base', weight = 'regular') => ({
    fontSize: typography.fontSize[size] || size,
    fontWeight: typography.fontWeight[weight] || weight,
    fontFamily: typography.fontFamily.primary,
    lineHeight: typography.lineHeight.normal,
  }), []);

  // Display font (çocuk dostu Nunito)
  const displayFont = useCallback((size = 'xl', weight = 'bold') => ({
    fontSize: typography.fontSize[size] || size,
    fontWeight: typography.fontWeight[weight] || weight,
    fontFamily: typography.fontFamily.display,
    lineHeight: typography.lineHeight.tight,
  }), []);

  // Spacing değeri alma
  const space = useCallback((n) => spacing[n] || n, []);

  // Border radius alma
  const radius = useCallback((size = 'md') => layout.borderRadius[size] || size, []);

  // Gölge alma
  const shadow = useCallback((size = 'md') => layout.shadow[size] || '', []);

  // Glow gölge oluşturma
  const glow = useCallback((color, intensity = 40) =>
    `0 0 20px ${color}${intensity}, 0 0 40px ${color}${Math.floor(intensity / 2)}`,
    []);

  // ─── Hazır stil objeleri ──────────────────────────────────

  const styles = useMemo(() => ({
    // Standart kart stili
    card: {
      background: colors.gradient.card,
      borderRadius: layout.borderRadius.lg,
      border: `1px solid ${colors.surface.divider}`,
      boxShadow: layout.shadow.md,
      padding: spacing[6],
    },

    // Glassmorphism kart
    glassCard: {
      background: 'rgba(30,27,75,.55)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: layout.borderRadius.lg,
      border: '1px solid rgba(148,163,184,.1)',
      boxShadow: layout.shadow.md,
      padding: spacing[6],
    },

    // Input alanı stili
    input: {
      background: colors.surface.input,
      border: `1px solid rgba(148,163,184,.15)`,
      borderRadius: layout.borderRadius.md,
      color: colors.text.primary,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.primary,
      padding: `${spacing[3]}px ${spacing[4]}px`,
      outline: 'none',
      transition: 'border-color 200ms ease',
    },

    // Sayfa arka planı
    pageBackground: {
      background: colors.gradient.background,
      minHeight: '100vh',
      color: colors.text.primary,
      fontFamily: typography.fontFamily.primary,
    },

    // Üst bar stili
    topBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${spacing[3]}px ${spacing[4]}px`,
      borderBottom: `1px solid ${colors.surface.divider}`,
    },

    // Divider
    divider: {
      height: 1,
      background: colors.surface.divider,
      border: 'none',
      margin: `${spacing[4]}px 0`,
    },
  }), []);

  return useMemo(() => ({
    colors,
    typography,
    spacing,
    layout,
    font,
    displayFont,
    space,
    radius,
    shadow,
    glow,
    ...styles,
  }), [font, displayFont, space, radius, shadow, glow, styles]);
}
