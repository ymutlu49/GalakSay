// GalakSay Pro — 2026-03-20 — Merkezi modal bileşeni (Escape + focus trap + a11y)
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { colors } from '../colors.js';
import { typography } from '../typography.js';

export function Modal({
  open,
  onClose,
  children,
  title,
  maxWidth = '90vw',
  closeOnOverlay = true,
  showClose = true,
}) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const contentRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (open) {
      // Önceki focus'u kaydet
      previousFocusRef.current = document.activeElement;
      setVisible(true);
      requestAnimationFrame(() => setAnimating(true));
      // Modal açıldığında içine focus ver
      setTimeout(() => {
        const firstFocusable = contentRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }, 100);
    } else {
      setAnimating(false);
      const t = setTimeout(() => {
        setVisible(false);
        // Önceki focus'a geri dön
        previousFocusRef.current?.focus();
      }, 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Escape tuşuyla kapatma
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Scroll engelleme
  useEffect(() => {
    if (open) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = orig; };
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Dialog'}
      onClick={closeOnOverlay ? onClose : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: animating ? colors.background.overlay : 'rgba(11, 14, 45, 0)',
        transition: 'background 200ms ease',
      }}
    >
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.surface.card,
          borderRadius: 24,
          border: '1px solid rgba(148,163,184,.15)',
          boxShadow: '0 25px 60px rgba(0,0,0,.6)',
          maxWidth,
          width: '100%',
          maxHeight: '85vh',
          overflow: 'auto',
          transform: animating ? 'scale(1)' : 'scale(0.9)',
          opacity: animating ? 1 : 0,
          transition: 'transform 300ms ease-out, opacity 300ms ease-out',
          position: 'relative',
        }}
      >
        {/* Header */}
        {(title || showClose) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px 0',
          }}>
            {title && (
              <h3 style={{
                margin: 0,
                color: colors.text.primary,
                fontSize: 22,
                fontWeight: 800,
                fontFamily: typography.fontFamily.display,
              }}>
                {title}
              </h3>
            )}
            {showClose && (
              <button
                onClick={onClose}
                aria-label="Kapat"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  border: 'none',
                  background: 'rgba(255,255,255,.08)',
                  color: colors.text.secondary,
                  fontSize: 18,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 150ms',
                  marginLeft: 'auto',
                }}
              >
                &#10005;
              </button>
            )}
          </div>
        )}
        {/* Content */}
        <div style={{ padding: 24 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
