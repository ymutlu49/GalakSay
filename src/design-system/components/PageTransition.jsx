// GalakSay Pro — 2026-03-18 — Sayfa geçiş animasyon sarmalayıcısı
import React, { useState, useEffect } from 'react';

const TRANSITIONS = {
  fadeThrough: {
    enter: { opacity: 0, transform: 'scale(1.05)' },
    active: { opacity: 1, transform: 'scale(1)' },
    duration: 250,
  },
  slideLeft: {
    enter: { opacity: 0, transform: 'translateX(30%)' },
    active: { opacity: 1, transform: 'translateX(0)' },
    duration: 250,
  },
  slideRight: {
    enter: { opacity: 0, transform: 'translateX(-30%)' },
    active: { opacity: 1, transform: 'translateX(0)' },
    duration: 250,
  },
  slideUp: {
    enter: { opacity: 0, transform: 'translateY(20%)' },
    active: { opacity: 1, transform: 'translateY(0)' },
    duration: 250,
  },
  zoomIn: {
    enter: { opacity: 0, transform: 'scale(0.5)' },
    active: { opacity: 1, transform: 'scale(1)' },
    duration: 350,
  },
  zoomOut: {
    enter: { opacity: 0, transform: 'scale(1.5)' },
    active: { opacity: 1, transform: 'scale(1)' },
    duration: 300,
  },
  none: {
    enter: { opacity: 1, transform: 'none' },
    active: { opacity: 1, transform: 'none' },
    duration: 0,
  },
};

export function PageTransition({
  children,
  transition = 'fadeThrough',
  screenKey, // değiştiğinde yeni animasyon tetiklenir
}) {
  const [animState, setAnimState] = useState('active');
  const t = TRANSITIONS[transition] || TRANSITIONS.fadeThrough;

  useEffect(() => {
    if (t.duration === 0) return;
    setAnimState('enter');
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimState('active'));
    });
    return () => cancelAnimationFrame(raf);
  }, [screenKey]);

  const style = animState === 'enter' ? t.enter : t.active;

  return (
    <div style={{
      ...style,
      transition: `all ${t.duration}ms ease-out`,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {children}
    </div>
  );
}

// Geçiş türü haritası — hangi ekrandan hangi ekrana hangi geçiş
export const SCREEN_TRANSITIONS = {
  'menu→modeSelect': 'fadeThrough',
  'modeSelect→levelSelect': 'slideLeft',
  'levelSelect→game': 'zoomIn',
  'game→results': 'slideUp',
  'results→menu': 'fadeThrough',
  '*→settings': 'slideUp',
  '*→back': 'slideRight',
  'default': 'fadeThrough',
};

export function getTransition(from, to) {
  return SCREEN_TRANSITIONS[`${from}→${to}`]
    || SCREEN_TRANSITIONS[`*→${to}`]
    || SCREEN_TRANSITIONS.default;
}
