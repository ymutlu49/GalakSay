// GalakSay Pro — 2026-03-18 — Bildirim/toast bileşeni
import React, { useEffect, useState } from 'react';
import { colors } from '../colors.js';
import { typography } from '../typography.js';

const VARIANTS = {
  success: { bg: colors.feedback.success, icon: '✓' },
  error:   { bg: colors.feedback.error,   icon: '!' },
  warning: { bg: colors.feedback.warning,  icon: '⚠' },
  info:    { bg: colors.feedback.info,     icon: 'ℹ' },
};

export function Toast({
  message,
  variant = 'info',
  duration = 3000,
  onDismiss,
  visible = true,
}) {
  const [show, setShow] = useState(false);
  const v = VARIANTS[variant] || VARIANTS.info;

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => setShow(true));
      if (duration > 0) {
        const t = setTimeout(() => {
          setShow(false);
          setTimeout(() => onDismiss?.(), 200);
        }, duration);
        return () => clearTimeout(t);
      }
    } else {
      setShow(false);
    }
  }, [visible, duration]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 16,
      left: '50%',
      transform: show ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-20px)',
      opacity: show ? 1 : 0,
      transition: 'all 300ms ease-out',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 20px',
      borderRadius: 14,
      background: colors.surface.card,
      border: `1px solid ${v.bg}40`,
      boxShadow: `0 8px 32px rgba(0,0,0,.4), 0 0 0 1px ${v.bg}20`,
      backdropFilter: 'blur(16px)',
      maxWidth: 'calc(100vw - 32px)',
    }}>
      <span style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        background: `${v.bg}25`,
        color: v.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 900,
        flexShrink: 0,
      }}>
        {v.icon}
      </span>
      <span style={{
        color: colors.text.primary,
        fontSize: 15,
        fontWeight: 600,
        fontFamily: typography.fontFamily.display,
      }}>
        {message}
      </span>
    </div>
  );
}
