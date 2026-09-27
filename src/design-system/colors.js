// GalakSay Pro — Merkezi renk sistemi
// 2026-04-28 refactor: semantic renkler (accent, feedback) C objesinden import edilir
// → ana oyun (GalakSay.jsx C kullanır) ve yan ekranlar (colors.* kullanır) markada uyumlu kalır

import { C } from '../theme/colors.js';

// ═══ ANA RENK PALETİ ═══════════════════════════════════════════════════════
export const colors = {
  // ── ANA PALET — Uzay teması ────────────────────────────────
  background: {
    primary:   '#0B0E2D',
    secondary: '#141852',
    tertiary:  '#1E2470',
    overlay:   'rgba(11, 14, 45, 0.85)',
  },

  surface: {
    card:      '#1A1F5E',
    cardHover: '#222878',
    input:     '#12164A',
    divider:   'rgba(255, 255, 255, 0.08)',
  },

  text: {
    primary:   '#FFFFFF',
    secondary: '#A8B2D1',
    tertiary:  '#8B95B8',   // önceden #6B7499 (4.1:1, AA altı) → #8B95B8 (~6.3:1, WCAG AA ✓)
    disabled:  '#3D4470',
    inverse:   '#0B0E2D',
  },

  accent: {
    // C objesinden import: ana oyunla aynı marka rengi (#7c3aed royal purple)
    primary:   C.brandPurple,        // önceden #6C63FF (slate-blue) → markayla uyumsuzdu
    primaryLight: '#A78BFA',         // koyu zeminde METİN için: primary (#7c3aed) text olarak 3.3:1 (AA altı), bu ~6.9:1
    secondary: C.correct,            // önceden #00D4AA (turkuaz) → C.correct (#059669) ile hizalı
    tertiary:  '#FF6B6B',
    gold:      '#FFD93D',
    orange:    C.orange,             // önceden #FF8C42 → #ea580c (C.orange) ile hizalı
  },

  // ── GERİ BİLDİRİM RENKLERİ ────────────────────────────────
  feedback: {
    success:      C.correct,         // #059669 (ana oyunla aynı tik yeşili)
    successGlow:  'rgba(5, 150, 105, 0.3)',
    error:        C.wrong,           // #f97316 (ana oyunla aynı yanlış turuncusu)
    errorGlow:    'rgba(249, 115, 22, 0.3)',
    warning:      '#FFD93D',
    info:         C.brandPurple,     // info da brand mor olsun
    hint:         '#A78BFA',
  },

  // ── ENERJİ KAPSÜLÜ RENKLERİ (DokunSay) ────────────────────
  capsule: {
    1:  '#F5F5F5',
    2:  '#EF4444',
    3:  '#4ADE80',
    4:  '#A855F7',
    5:  '#FACC15',
    6:  '#16A34A',
    7:  '#1E293B',
    8:  '#A16207',
    9:  '#3B82F6',
    10: '#F97316',
  },

  // ── BASAMAK DEĞERİ RENKLERİ (Calcularis Transfer) ─────────
  placeValue: {
    ones:     '#059669',
    tens:     '#93c5fd',
    hundreds: '#dc2626',
  },

  // ── GRADIENT'LER ──────────────────────────────────────────
  gradient: {
    background:  'linear-gradient(180deg, #0B0E2D 0%, #141852 50%, #1E2470 100%)',
    // Çocuğa dönük giriş ekranları (TitleScreen/CaptainPicker/CaptainCreate): oyunun yeni "alacakaranlık" zeminiyle uyumlu,
    // sıcak nebula ışımalı canlı ton. Öğretmen ekranları koyu-profesyonel `background`ı kullanmaya devam eder.
    backgroundKids: 'radial-gradient(120% 80% at 85% 8%, rgba(251,113,133,.14), transparent 55%), radial-gradient(110% 75% at 10% 90%, rgba(251,146,60,.13), transparent 55%), linear-gradient(180deg, #312e81 0%, #4338ca 55%, #3b3a9d 100%)',
    card:        'linear-gradient(135deg, #1A1F5E 0%, #222878 100%)',
    accent:      `linear-gradient(135deg, ${C.brandPurple} 0%, #A78BFA 100%)`,
    success:     `linear-gradient(135deg, ${C.correct} 0%, ${C.brandGreen} 100%)`,
    gold:        'linear-gradient(135deg, #FFD93D 0%, #F59E0B 100%)',
    nebula:      'linear-gradient(135deg, #6C63FF 0%, #EC4899 50%, #F97316 100%)',
    space:       'linear-gradient(170deg, #0B0E2D 0%, #141852 40%, #1E2470 100%)',
    spaceAlt:    'linear-gradient(170deg, #312e81 0%, #3b2890 15%, #4f46e5 35%, #6366f1 52%, #4f46e5 68%, #3b2890 85%, #312e81 100%)',
  },
};

// ═══ AÇIK PALET (colorsLight) ═══════════════════════════════════════════
// Masaüstü (Jimaro) çizgisindeki v5.10.0 açık tasarımıyla birebir aynı değerler.
// Anahtarlar `colors` ile aynıdır; ThemeProvider light=true olduğunda bu palet kullanılır.
// Kontrast: metin #1E1B4B beyaz üzerinde ~15:1, ikincil #4B5563 ~7.5:1 (WCAG AA/AAA).
export const colorsLight = {
  background: { primary: '#FAF9FF', secondary: '#F4F2FD', tertiary: '#EDE9FB', overlay: 'rgba(30, 27, 75, 0.45)' },
  surface: { card: '#FFFFFF', cardHover: '#F7F5FF', input: '#F4F2FC', divider: 'rgba(30, 27, 75, 0.10)' },
  text: { primary: '#1E1B4B', secondary: '#4B5563', tertiary: '#6B7280', disabled: '#A5A1C2', inverse: '#FFFFFF' },
  accent: { primary: C.brandPurple, primaryLight: '#6D28D9', secondary: C.correct, tertiary: '#DC2626', gold: '#B45309', orange: '#C2410C' },
  feedback: { success: '#047857', successGlow: 'rgba(5, 150, 105, 0.12)', error: '#DC2626', errorGlow: 'rgba(220, 38, 38, 0.08)', warning: '#A16207', info: C.brandPurple, hint: '#6D28D9' },
  capsule: colors.capsule,
  placeValue: colors.placeValue,
  gradient: {
    background: 'linear-gradient(180deg, #FAF9FF 0%, #F5F3FE 55%, #EFEBFC 100%)',
    backgroundKids: 'radial-gradient(120% 80% at 85% 8%, rgba(245,158,11,.12), transparent 55%), radial-gradient(110% 75% at 10% 90%, rgba(56,189,248,.12), transparent 55%), linear-gradient(180deg, #FAF9FF 0%, #F4F0FE 60%, #EDE9FB 100%)',
    card: 'linear-gradient(135deg, #FFFFFF 0%, #FAF9FF 100%)',
    accent: `linear-gradient(135deg, ${C.brandPurple} 0%, #8B5CF6 100%)`,
    success: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    gold: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    nebula: 'linear-gradient(135deg, #C4B5FD 0%, #F9A8D4 50%, #FDBA74 100%)',
    space: 'linear-gradient(170deg, #FAF9FF 0%, #F4F1FE 40%, #ECE8FB 100%)',
    spaceAlt: 'linear-gradient(170deg, #FAF9FF 0%, #F1EDFD 35%, #E9E4FA 52%, #F1EDFD 68%, #FAF9FF 100%)',
  },
  // Açık zeminde kart gölgesi (beyaz kart + çok hafif mor gölge)
  shadow: { card: '0 2px 10px rgba(30,27,75,.06), 0 1px 2px rgba(30,27,75,.04)', raised: '0 10px 30px rgba(124,58,237,.18)' },
};

// ═══ UYUMLULUK KÖPRÜSÜ — Eski C objesiyle uyumluluk ═════════════════════
// Mevcut kodda `C.blue`, `C.green` vb. kullanan bileşenler çalışmaya devam etsin
export { C, CAPSULE_CELL, capsuleSize } from '../theme/colors.js';
