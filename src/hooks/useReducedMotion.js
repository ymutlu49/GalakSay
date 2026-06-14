// @ts-check
// GalakSay Pro — Reduced motion hook (sistem tercihi + uygulama ayarı birleşimi).

import { useState, useEffect } from 'react';

/**
 * Animasyon azaltma durumunu döndürür.
 * Hem `prefers-reduced-motion` hem `galaksay_reduced_motion` ayarı kontrol edilir.
 * @returns {boolean}
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
