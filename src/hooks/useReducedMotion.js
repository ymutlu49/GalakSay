// GalakSay Pro — 2026-03-20 — Reduced motion hook
// Hem sistem tercihi hem uygulama ayarını birleştirir

import { useState, useEffect } from 'react';

/**
 * useReducedMotion — Animasyon azaltma durumunu döndürür.
 * Hem prefers-reduced-motion media query, hem galaksay_reduced_motion ayarını kontrol eder.
 * Herhangi biri aktifse true döner.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    const system = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    let app = false;
    try { app = JSON.parse(localStorage.getItem('galaksay_reduced_motion')) === true; } catch {}
    return system || app;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const check = () => {
      const system = mq?.matches ?? false;
      let app = false;
      try { app = JSON.parse(localStorage.getItem('galaksay_reduced_motion')) === true; } catch {}
      setReduced(system || app);
    };

    mq?.addEventListener?.('change', check);

    // localStorage değişikliklerini de dinle (diğer tab/pencere)
    window.addEventListener('storage', check);

    return () => {
      mq?.removeEventListener?.('change', check);
      window.removeEventListener('storage', check);
    };
  }, []);

  return reduced;
}
