// GalakSay Pro — 2026-03-20 — Doğru/yanlış geri bildirim overlay bileşeni
// Tüm etkinlik ekranlarında tutarlı görsel + ses geri bildirimi sağlar
import React, { useState, useEffect, useRef } from 'react';
import { colors } from '../colors.js';
import { typography } from '../typography.js';

/**
 * FeedbackOverlay — Cevap sonrası tam ekran geri bildirim efekti.
 *
 * Props:
 * - type: 'correct' | 'wrong' | 'hint' | null (null = gizli)
 * - message: Opsiyonel metin mesajı
 * - duration: Otomatik kapanma süresi (ms), varsayılan 1200
 * - onComplete: Efekt bittiğinde çağrılır
 * - showIcon: İkon göster/gizle (varsayılan true)
 */
export const FeedbackOverlay = React.memo(function FeedbackOverlay({
  type = null,
  message,
  duration = 1200,
  onComplete,
  showIcon = true,
}) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState('enter'); // enter | active | exit
  const timerRef = useRef(null);

  useEffect(() => {
    if (!type) {
      setVisible(false);
      setPhase('enter');
      return;
    }

    setVisible(true);
    setPhase('enter');

    // Enter → active
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('active'));
    });

    // Active → exit → complete
    timerRef.current = setTimeout(() => {
      setPhase('exit');
      setTimeout(() => {
        setVisible(false);
        setPhase('enter');
        onComplete?.();
      }, 200);
    }, duration - 200);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timerRef.current);
    };
  }, [type, duration, onComplete]);

  if (!visible || !type) return null;

  const config = FEEDBACK_CONFIG[type] || FEEDBACK_CONFIG.correct;

  const isActive = phase === 'active';
  const isExit = phase === 'exit';

  return (
    <div
      role="status"
      aria-live="assertive"
      aria-label={config.ariaLabel}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        pointerEvents: 'none',
        zIndex: 50,
        opacity: isExit ? 0 : isActive ? 1 : 0,
        transition: 'opacity 200ms ease-out',
      }}
    >
      {/* Renkli glow arka plan */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at center, ${config.glowColor} 0%, transparent 70%)`,
        opacity: isActive ? 0.15 : 0,
        transition: 'opacity 300ms ease-out',
      }} />

      {/* İkon */}
      {showIcon && (
        <div style={{
          fontSize: 56,
          transform: isActive ? 'scale(1)' : 'scale(0.5)',
          opacity: isActive ? 1 : 0,
          transition: 'all 300ms cubic-bezier(.34,1.56,.64,1)',
          filter: `drop-shadow(0 0 12px ${config.glowColor})`,
          willChange: 'transform',
        }}>
          {config.icon}
        </div>
      )}

      {/* Mesaj */}
      {message && (
        <div style={{
          fontSize: 20,
          fontWeight: 800,
          fontFamily: typography.fontFamily.display,
          color: config.textColor,
          textShadow: `0 2px 8px rgba(0,0,0,0.5)`,
          transform: isActive ? 'translateY(0)' : 'translateY(8px)',
          opacity: isActive ? 1 : 0,
          transition: 'all 250ms ease-out 100ms',
          textAlign: 'center',
          maxWidth: 280,
        }}>
          {message}
        </div>
      )}

      {/* Pulse ring efekti — sadece doğru cevaplarda */}
      {type === 'correct' && isActive && (
        <div style={{
          position: 'absolute',
          width: 100,
          height: 100,
          borderRadius: '50%',
          border: `3px solid ${colors.feedback.success}`,
          animation: 'correctPulseRing 600ms ease-out forwards',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
});

const FEEDBACK_CONFIG = {
  correct: {
    icon: '\u2705',
    glowColor: colors.feedback.success,
    textColor: colors.feedback.success,
    ariaLabel: 'Doğru cevap',
  },
  wrong: {
    icon: '\u21BB',
    glowColor: colors.feedback.error,
    textColor: colors.feedback.error,
    ariaLabel: 'Tekrar dene',
  },
  hint: {
    icon: '\uD83D\uDCA1',
    glowColor: colors.feedback.hint,
    textColor: colors.feedback.hint,
    ariaLabel: 'İpucu',
  },
};
