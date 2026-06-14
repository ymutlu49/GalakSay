// GalakSay Pro — 2026-03-18 — Profesyonel açılış ekranı
import React, { useState, useEffect, useMemo } from 'react';
import { colors } from '../colors.js';
import { GalaksayLogo } from '../../components/branding/GalaksayLogo.jsx';
import { typography } from '../typography.js';

export function SplashScreen({ onComplete, duration = 2000 }) {
  const [phase, setPhase] = useState(0); // 0=logo, 1=subtitle, 2=fadeout
  const [progress, setProgress] = useState(0);

  // Deterministik yıldızlar (Math.random render'da tutarsız olur)
  const stars = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      x: `${(i * 37 + 13) % 100}%`,
      y: `${(i * 61 + 7) % 100}%`,
      size: ((i * 17) % 3) + 1,
      opacity: 0.2 + ((i * 29) % 50) / 100,
      delay: ((i * 23) % 20) / 10,
      dur: 2 + ((i * 13) % 30) / 10,
    })),
    []
  );

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), duration - 300);
    const t3 = setTimeout(() => onComplete?.(), duration);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(100, (elapsed / duration) * 100));
    }, 30);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(interval);
    };
  }, [duration, onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: colors.gradient.space,
      opacity: phase === 2 ? 0 : 1,
      transition: 'opacity 300ms ease-out',
    }}>
      {/* Star field — deterministik, GPU-accelerated */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {stars.map((s, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              background: i % 7 === 0 ? 'rgba(167,139,250,.8)' : '#fff',
              opacity: s.opacity,
              animation: `starTwinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
              willChange: 'opacity',
            }}
          />
        ))}
      </div>

      {/* Nebula glow effects */}
      <div style={{
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: colors.accent.primary,
        filter: 'blur(100px)',
        top: '15%',
        right: '-5%',
        opacity: 0.15,
        animation: 'nebulaFloat 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: '50%',
        background: '#EC4899',
        filter: 'blur(100px)',
        bottom: '10%',
        left: '-5%',
        opacity: 0.1,
        animation: 'nebulaFloat 10s ease-in-out 2s infinite',
      }} />

      {/* Shooting star — splash sırasında tek kayan meteor */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '15%',
        width: 100,
        height: 1.5,
        borderRadius: 2,
        background: 'linear-gradient(90deg, transparent, rgba(167,139,250,.7), rgba(255,255,255,.9), transparent)',
        transform: 'rotate(-35deg)',
        opacity: 0,
        animation: phase < 2 ? 'meteorShoot 2s ease 0.8s 1 forwards' : 'none',
        pointerEvents: 'none',
      }} />

      {/* Logo — büyütülmüş + responsive (mobilde taşmaz), ortalı, arkasında yumuşak hale.
          "Matematik Öğrenme Oyunu" tanımlayıcısı KALDIRILDI; logo zaten markayı + sloganı taşıyor. */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {/* Merkezi yumuşak hale — logoyu öne çıkarır, derinlik verir */}
        <div style={{
          position: 'absolute',
          width: 'min(80vw, 460px)',
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(124,58,237,.26), rgba(99,102,241,.11) 45%, transparent 72%)',
          filter: 'blur(24px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'relative',
          transform: phase >= 0 ? 'scale(1)' : 'scale(0.85)',
          opacity: phase >= 0 ? 1 : 0,
          transition: 'all 600ms cubic-bezier(.16,1,.3,1)',
          filter: 'drop-shadow(0 6px 32px rgba(108,99,255,.4))',
        }}>
          <GalaksayLogo width="min(90vw, 450px)" tight dark />
        </div>
      </div>

      {/* Loading progress bar — ince, zarif */}
      <div style={{
        position: 'absolute',
        bottom: 90,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 200,
        height: 3,
        borderRadius: 3,
        background: 'rgba(255,255,255,.08)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          borderRadius: 3,
          background: colors.gradient.accent,
          transition: 'width 100ms linear',
          boxShadow: '0 0 8px rgba(108,99,255,.4)',
        }} />
      </div>

      {/* Credits — Prof. Dr. Yılmaz Mutlu */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        opacity: phase >= 1 ? 0.5 : 0,
        transition: 'opacity 400ms ease-out 300ms',
      }}>
        <div style={{
          color: colors.text.tertiary,
          fontSize: 12,
          fontWeight: 600,
          fontFamily: typography.fontFamily.display,
        }}>
          Prof. Dr. Yılmaz Mutlu
        </div>
      </div>
    </div>
  );
}
