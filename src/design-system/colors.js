// GalakSay Pro — 2026-03-18 — Merkezi renk sistemi

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
    tertiary:  '#6B7499',
    disabled:  '#3D4470',
    inverse:   '#0B0E2D',
  },

  accent: {
    primary:   '#6C63FF',
    secondary: '#00D4AA',
    tertiary:  '#FF6B6B',
    gold:      '#FFD93D',
    orange:    '#FF8C42',
  },

  // ── GERİ BİLDİRİM RENKLERİ ────────────────────────────────
  feedback: {
    success:      '#00D4AA',
    successGlow:  'rgba(0, 212, 170, 0.3)',
    error:        '#FF8C42',
    errorGlow:    'rgba(255, 140, 66, 0.3)',
    warning:      '#FFD93D',
    info:         '#6C63FF',
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
    card:        'linear-gradient(135deg, #1A1F5E 0%, #222878 100%)',
    accent:      'linear-gradient(135deg, #6C63FF 0%, #A78BFA 100%)',
    success:     'linear-gradient(135deg, #00D4AA 0%, #00B894 100%)',
    gold:        'linear-gradient(135deg, #FFD93D 0%, #F59E0B 100%)',
    nebula:      'linear-gradient(135deg, #6C63FF 0%, #EC4899 50%, #F97316 100%)',
    space:       'linear-gradient(170deg, #0B0E2D 0%, #141852 40%, #1E2470 100%)',
    spaceAlt:    'linear-gradient(170deg, #312e81 0%, #3b2890 15%, #4f46e5 35%, #6366f1 52%, #4f46e5 68%, #3b2890 85%, #312e81 100%)',
  },
};

// ═══ UYUMLULUK KÖPRÜSÜ — Eski C objesiyle uyumluluk ═════════════════════
// Mevcut kodda `C.blue`, `C.green` vb. kullanan bileşenler çalışmaya devam etsin
export { C, CAPSULE_CELL, capsuleSize } from '../theme/colors.js';
