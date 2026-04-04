// GalakSay Revizyon — 2026-03-18 — Parçacık efektleri ve animasyon presetleri eklendi
// ═══════════════════════════════════════════════════════════════════════════════
// DokunSay Kit — Ana İhracat Dosyası
// DokunSay enerji kapsüllerinin dijital karşılıkları
// ═══════════════════════════════════════════════════════════════════════════════

// Fizik Motoru
export {
  useDokunSayDrag,
  useSnapZone,
  useLongPress,
  useMerge,
  FIZIK,
  ANIM_PRESETS,
  makeTransition,
  squashStyle,
  vibrate,
  playSound,
  setAudioCallback,
} from './MateryalFizik.js';

// Animasyon Presetleri (framer-motion uyumlu)
export {
  ANIM,
  materialEntryVariants,
  correctAnswerVariants,
  wrongAnswerVariants,
  chipBounceVariants,
  capsuleMergeVariants,
  hintPulseVariants,
  countdownVariants,
  buttonPressVariants,
  splitLineVariants,
  pulToKapsulVariants,
  PARTICLES,
  staggerDelay,
  getFlashDuration,
  cssTransition,
} from './animationPresets.js';

// Parçacık Efektleri
export {
  ParticleBurst,
  RingEffect,
  GlowFlash,
  StarBurst,
  AnswerFeedback,
  useParticleBurst,
} from './ParticleEffects.jsx';

// Enerji Kapsülü (DokunSay Sayı Çubukları)
export { EnerjiKapsulu, KAPSUL_RENKLERI } from './EnerjiKapsulu.jsx';

// Yıldız Taşı (DokunSay Sayı Taşları)
export { YildizTasi } from './YildizTasi.jsx';

// Yıldız Taşı (DokunSay Birim Yıldız Taşları)
export { Pul, PulGrubu } from './Pul.jsx';
