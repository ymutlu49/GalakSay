// GalakSay Revizyon — 2026-03-18 — Framer-motion animasyon presetleri
// ═══════════════════════════════════════════════════════════════════════════════
// ANİMASYON PRESETLERİ — Tüm DokunSay materyalleri ve etkinlikleri için ortak
// framer-motion + CSS transition değerleri
// ═══════════════════════════════════════════════════════════════════════════════

// ── Zamanlama Presetleri (framer-motion transition objeleri) ─────────────────
export const ANIM = {
  // Temel zamanlamalar
  instant:  { duration: 0.1,  ease: 'easeOut' },
  fast:     { duration: 0.2,  ease: 'easeOut' },
  normal:   { duration: 0.3,  ease: 'easeInOut' },
  smooth:   { duration: 0.5,  ease: 'easeInOut' },
  slow:     { duration: 0.8,  ease: 'easeInOut' },
  bounce:   { duration: 0.4,  ease: [0.34, 1.56, 0.64, 1] },
  spring:   { type: 'spring', stiffness: 300, damping: 20 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 15 },
  springGentle: { type: 'spring', stiffness: 200, damping: 25 },

  // Sürükleme (Drag)
  drag: {
    liftScale: 1.05,
    liftShadow: '0 8px 25px rgba(0,0,0,0.3)',
    snapDuration: 0.15,
    returnDuration: 0.3,
    magnetDistance: 20, // px
  },

  // Yıldız taşı sayma
  pulCount: {
    tapScale: 1.15,
    tapDuration: 0.2,
    countedOpacity: 0.7,
    ringScale: 1.6,
    ringDuration: 0.4,
  },

  // Kapsül birleşme/bölünme
  capsule: {
    mergeDuration: 0.4,
    splitDuration: 0.3,
    glowDuration: 0.2,
    trembleDuration: 0.05,
    trembleCount: 4,
    mergeAttractDuration: 0.2,
    unitRevealStagger: 0.05,
  },

  // Subitizing flash süreleri (LT düzeyine göre ms)
  flash: { L5: 3000, L6: 2000, L7: 1500, L8: 1000, L9: 750, L10: 500 },

  // Stagger (ardışık animasyonlarda öğeler arası gecikme)
  stagger: 0.1, // saniye

  // Geçiş animasyonları
  pageTransition: {
    fadeIn:  { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } },
    fadeOut: { exit: { opacity: 0 }, transition: { duration: 0.2 } },
    slideUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } },
    slideDown: { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } },
    popIn: { initial: { opacity: 0, scale: 0 }, animate: { opacity: 1, scale: 1 }, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    bounceIn: { initial: { opacity: 0, scale: 0.3 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
  },
};

// ── Framer-motion Variants ──────────────────────────────────────────────────

// Materyal giriş animasyonu (stagger ile sıralı)
export const materialEntryVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * ANIM.stagger,
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1],
    },
  }),
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
};

// Doğru cevap animasyonu
export const correctAnswerVariants = {
  initial: { scale: 1 },
  correct: {
    scale: [1, 1.15, 1],
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// Yanlış cevap animasyonu (sallanma)
export const wrongAnswerVariants = {
  initial: { x: 0, rotate: 0 },
  wrong: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    rotate: [0, -3, 3, -2, 2, 0],
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
};

// Yıldız taşı zıplama (sayma dokunuşu)
export const chipBounceVariants = {
  idle: { scale: 1 },
  tap: {
    scale: [1, ANIM.pulCount.tapScale, 1],
    transition: { duration: ANIM.pulCount.tapDuration },
  },
};

// Kapsül birleşme
export const capsuleMergeVariants = {
  idle: { scale: 1 },
  merging: {
    scale: [1, 1.08, 1.02, 1],
    transition: { duration: ANIM.capsule.mergeDuration },
  },
};

// İpucu pulse (dikkat çekme)
export const hintPulseVariants = {
  idle: { scale: 1, boxShadow: '0 0 0 0 rgba(251,191,36,0)' },
  pulsing: {
    scale: [1, 1.1, 1],
    boxShadow: [
      '0 0 0 0 rgba(251,191,36,0.4)',
      '0 0 0 12px rgba(251,191,36,0)',
      '0 0 0 0 rgba(251,191,36,0)',
    ],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

// Geri sayım (3-2-1) animasyonu
export const countdownVariants = {
  initial: { opacity: 0, scale: 2 },
  animate: { opacity: [0, 1, 1, 0], scale: [2, 1, 1, 0.5], transition: { duration: 0.8, times: [0, 0.2, 0.7, 1] } },
};

// Buton press efekti
export const buttonPressVariants = {
  idle: { scale: 1 },
  pressed: { scale: 0.95, transition: { duration: 0.1 } },
  hover: { scale: 1.02, transition: { duration: 0.15 } },
};

// Kapsül birim bölme çizgisi parlaması
export const splitLineVariants = {
  hidden: { opacity: 0, scaleY: 0 },
  visible: {
    opacity: [0.5, 1, 0.5],
    scaleY: 1,
    transition: { opacity: { duration: 1, repeat: Infinity, ease: 'easeInOut' }, scaleY: { duration: 0.2 } },
  },
};

// 10 yıldız taşı → kapsül dönüşüm
export const pulToKapsulVariants = {
  gathering: (i) => ({
    x: 0, y: 0,
    scale: 0.5,
    opacity: 0.6,
    transition: { delay: i * 0.05, duration: 0.6, ease: 'easeInOut' },
  }),
  flash: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
  },
};

// ── Parçacık Efekt Konfigürasyonu ───────────────────────────────────────────

export const PARTICLES = {
  correctBurst: {
    count: 5,
    colors: ['#FFD700', '#FFA500', '#FF6347', '#7B68EE', '#00CED1'],
    duration: 600,
    spread: 60,  // px
    size: { min: 4, max: 8 },
  },
  mergeGlow: {
    count: 8,
    colors: ['#FFFFFF', '#FFD700', '#FFA500'],
    duration: 500,
    spread: 30,
    size: { min: 2, max: 5 },
  },
  splitCrack: {
    count: 6,
    colors: ['#E0E7FF', '#C7D2FE', '#A5B4FC'],
    duration: 500,
    spread: 40,
    size: { min: 3, max: 6 },
  },
  celebration: {
    count: 12,
    colors: ['#FFD700', '#FF6347', '#7B68EE', '#00CED1', '#FF69B4', '#32CD32'],
    duration: 1000,
    spread: 100,
    size: { min: 4, max: 10 },
  },
};

// ── Yardımcı Fonksiyonlar ───────────────────────────────────────────────────

// Stagger delay hesapla
export const staggerDelay = (index, baseDelay = ANIM.stagger) => index * baseDelay;

// LT düzeyine göre flash süresi
export const getFlashDuration = (ltLevel) => {
  if (ltLevel <= 5) return ANIM.flash.L5;
  if (ltLevel <= 6) return ANIM.flash.L6;
  if (ltLevel <= 7) return ANIM.flash.L7;
  if (ltLevel <= 8) return ANIM.flash.L8;
  if (ltLevel <= 9) return ANIM.flash.L9;
  return ANIM.flash.L10;
};

// CSS transition string oluştur (mevcut ANIM_PRESETS ile uyumlu)
export const cssTransition = (prop, preset) => {
  const dur = typeof preset === 'number' ? preset : (preset.duration || 0.3);
  const ease = typeof preset === 'string' ? preset : (
    Array.isArray(preset.ease) ? `cubic-bezier(${preset.ease.join(',')})` : (preset.ease || 'ease-in-out')
  );
  return `${prop} ${dur}s ${ease}`;
};
