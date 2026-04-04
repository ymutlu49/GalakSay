// GalakSay Pro — 2026-03-18 — Merkezi spacing ve layout sistemi

export const spacing = {
  0:    0,
  1:    4,
  2:    8,
  3:    12,
  4:    16,
  5:    20,
  6:    24,
  8:    32,
  10:   40,
  12:   48,
  16:   64,
  20:   80,
  24:   96,
};

export const layout = {
  screenPadding: {
    tablet:  24,
    phone:   16,
  },

  borderRadius: {
    sm:    8,
    md:    12,
    lg:    16,
    xl:    24,
    full:  9999,
  },

  touchTarget: {
    minimum:  44,
    default:  48,
    large:    56,
    xlarge:   64,
  },

  shadow: {
    sm:   '0 1px 3px rgba(0, 0, 0, 0.3)',
    md:   '0 4px 12px rgba(0, 0, 0, 0.4)',
    lg:   '0 8px 25px rgba(0, 0, 0, 0.5)',
    glow: (color) => `0 0 20px ${color}40, 0 0 40px ${color}20`,
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
  },
};
