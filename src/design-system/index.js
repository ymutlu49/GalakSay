// GalakSay Pro — 2026-03-18 — Tasarım sistemi merkezi export

// ═══ TASARIM TOKENLARİ ═════════════════════════════════════════════════════
export { colors } from './colors.js';
export { typography, F } from './typography.js';
export { spacing, layout } from './spacing.js';
export { C, CAPSULE_CELL, capsuleSize } from '../theme/colors.js';

// ═══ ANİMASYON YARDIMCILARI ═══════════════════════════════════════════════
export {
  counterAnimation,
  listItemAnimation,
  toastAnimation,
  cardSelectAnimation,
  createConfettiParticles,
  createStarBurst,
  staggerDelay,
  springs,
  getMotionSafe,
} from './animations.js';

// ═══ UI BİLEŞENLERİ ═══════════════════════════════════════════════════════
export {
  Button,
  Card,
  CapsulePattern,
  CAPSULE_PATTERN_LABELS,
  ConfirmDialog,
  Modal,
  ProgressBar,
  Toggle,
  Badge,
  Skeleton,
  EmptyState,
  Toast,
  Tooltip,
  SplashScreen,
  ModuleComplete,
  PageTransition,
  getTransition,
  SCREEN_TRANSITIONS,
  SpaceBackground,
  ActivityLayout,
  CategoryIcon,
  CATEGORY_ICONS,
  CountingIcon,
  SubitizingIcon,
  ComparingIcon,
  ComposingIcon,
  PlaceValueIcon,
  AddSubIcon,
  MulDivIcon,
  PatternIcon,
  CapsuleIcon,
  StampIcon,
  StarGemIcon,
  HomeIcon,
  BackIcon,
  ForwardIcon,
  SettingsIcon,
  ProfileIcon,
  ReportIcon,
  HintIcon,
  SoundOnIcon,
  SoundOffIcon,
} from './components/index.js';

// ═══ UYUMLULUK: Eski DS objesi eşdeğeri ═══════════════════════════════════
// GalakSay.jsx içindeki DS objesinin merkezi versiyonu
// Mevcut kodla tam uyumlu, aşamalı geçiş için
export const DS = {
  bgLight: 'linear-gradient(170deg, #050a18 0%, #0a1628 30%, #0f1f3d 60%, #0a1229 100%)',
  bgLogin: 'linear-gradient(170deg, #050a18 0%, #0c1a3a 40%, #0f2952 100%)',
  bgDark:  'linear-gradient(160deg, #050a18 0%, #0c1a3a 60%, #0f2952 100%)',
  card: {
    background: 'rgba(30,27,75,.65)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 22,
    border: '1px solid rgba(148,163,184,.12)',
    boxShadow: '0 8px 32px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.05)',
  },
  cardSoft: {
    background: 'rgba(49,46,129,.5)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: 18,
    border: '1px solid rgba(148,163,184,.1)',
    boxShadow: '0 4px 16px rgba(0,0,0,.3)',
  },
  accent: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
  textDark: '#e2e8f0',
  textBody: '#cbd5e1',
  textSub: '#c0cbda',
  textMuted: '#94a3b8',
  textLight: '#fff',
  divider: 'rgba(148,163,184,.15)',
  inputBorder: 'rgba(148,163,184,.2)',
  successBg: 'rgba(16,185,129,.15)',
  successText: '#34d399',
  warnBg: 'rgba(234,179,8,.15)',
  warnText: '#fbbf24',
  dangerBg: 'rgba(239,68,68,.15)',
  dangerText: '#f87171',
  textPrimary: '#fff',
  textSecondary: 'rgba(255,255,255,.75)',
};
