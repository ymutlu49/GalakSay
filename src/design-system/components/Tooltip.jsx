// GalakSay Pro — 2026-03-18 — Tooltip bileşeni (uzun bas ile goster)
import React, { useState, useRef } from 'react';
import { colors } from '../colors.js';
import { typography } from '../typography.js';

export function Tooltip({
  children,
  content,
  position = 'top', // top | bottom | left | right
  delay = 300,
}) {
  const [show, setShow] = useState(false);
  const timerRef = useRef(null);

  const open = () => {
    timerRef.current = setTimeout(() => setShow(true), delay);
  };
  const close = () => {
    clearTimeout(timerRef.current);
    setShow(false);
  };

  const posMap = {
    top:    { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 },
    left:   { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 },
    right:  { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 },
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={open}
      onMouseLeave={close}
      onTouchStart={open}
      onTouchEnd={close}
    >
      {children}
      {show && content && (
        <div style={{
          position: 'absolute',
          ...posMap[position],
          background: colors.surface.card,
          border: '1px solid rgba(148,163,184,.15)',
          borderRadius: 10,
          padding: '8px 12px',
          color: colors.text.primary,
          fontSize: 14,
          fontWeight: 500,
          fontFamily: typography.fontFamily.display,
          whiteSpace: 'nowrap',
          zIndex: 100,
          boxShadow: '0 4px 16px rgba(0,0,0,.4)',
          animation: 'fadeUp 150ms ease-out',
          pointerEvents: 'none',
        }}>
          {content}
        </div>
      )}
    </div>
  );
}
