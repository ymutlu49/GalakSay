// GalakSay — Cihaz tipi hook'u (mobile / tablet / desktop).
// Resize event'ini dinler, viewport değiştikçe günceller.
//
// Eşikler:
//   mobile   < 768px
//   tablet   768–1023px
//   desktop  ≥ 1024px
//
// Kullanım:
//   const { isMobile, isTablet, isDesktop, width } = useDeviceType();
//   const maxW = isDesktop ? 720 : isTablet ? 520 : 380;

import { useState, useEffect } from 'react';

const MOBILE_MAX = 767;
const TABLET_MAX = 1023;

function readType() {
  if (typeof window === 'undefined') {
    // SSR / yan etki yok — varsayılan: desktop
    return { isMobile: false, isTablet: false, isDesktop: true, width: 1024, breakpoint: 'desktop' };
  }
  const w = window.innerWidth;
  if (w <= MOBILE_MAX) return { isMobile: true, isTablet: false, isDesktop: false, width: w, breakpoint: 'mobile' };
  if (w <= TABLET_MAX) return { isMobile: false, isTablet: true, isDesktop: false, width: w, breakpoint: 'tablet' };
  return { isMobile: false, isTablet: false, isDesktop: true, width: w, breakpoint: 'desktop' };
}

/** @returns {{isMobile:boolean, isTablet:boolean, isDesktop:boolean, width:number, breakpoint:'mobile'|'tablet'|'desktop'}} */
export function useDeviceType() {
  const [state, setState] = useState(readType);

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setState(readType()));
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return state;
}
