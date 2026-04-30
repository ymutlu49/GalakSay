/**
 * GalakSay Pro — Ortak tip tanımları (TypeScript checkJs için).
 * Sadece IDE intellisense için kullanılır; runtime etkisi yoktur.
 *
 * Dosyalardan referans verme örneği:
 *   /\** @typedef {import('../types').Profile} Profile *\/
 */

// ═══ Profil ════════════════════════════════════════════════════════════════
export interface Profile {
  name: string;
  avatar: string;
  grade: string;
}

// ═══ Açık Rıza ═════════════════════════════════════════════════════════════
export interface Consent {
  dataProcessing: boolean;
  analytics: boolean;
  decision: 'accept' | 'decline' | 'revoked';
  grantedAt?: string;
  version?: number;
}

// ═══ Soru / Cevap ══════════════════════════════════════════════════════════
export interface Question {
  type?: 'add' | 'sub' | 'mul' | 'div' | string;
  num1?: number;
  num2?: number;
  correctAnswer?: number;
}

export type ErrorType =
  | 'correct'
  | 'off_by_one'
  | 'operation_swap'
  | 'procedural'
  | 'sign_error'
  | 'magnitude'
  | 'conceptual'
  | 'attention'
  | 'skip'
  | 'random';

export type ErrorSeverity = 'none' | 'low' | 'medium' | 'high';

export interface Classification {
  errorType: ErrorType;
  severity: ErrorSeverity;
  evidence: string;
}

export interface ClassifyInput {
  givenAnswer: number | string | null | undefined;
  correctAnswer: number;
  responseTimeMs?: number;
  question?: Question | null;
  gameMode?: string;
}

// ═══ Oturum / İlerleme ═════════════════════════════════════════════════════
export interface SessionProgress {
  screen?: string;
  category?: string;
  mode?: string;
  level?: number;
  currentQuestion?: number;
  totalQuestions?: number;
  score?: number;
  ltLevel?: number;
  timestamp?: number;
  version?: string;
}

// ═══ Tarama (Screening) ════════════════════════════════════════════════════
export interface PhaseScore {
  correct: number;
  total: number;
  avgTime: number;
  times: number[];
}

export type RiskLevel = 'low' | 'low-moderate' | 'moderate' | 'high';

export interface ScreeningResult {
  overallAcc: number;
  avgTime: number;
  phaseScores: Record<string, PhaseScore>;
  risk: RiskLevel;
  weakPhases: string[];
  totalCorrect: number;
  totalQ: number;
}

// ═══ Erişilebilirlik ═══════════════════════════════════════════════════════
export interface A11ySettings {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  colorBlind: 'off' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  calmMode: boolean;
  dyslexicFont: boolean;
}
