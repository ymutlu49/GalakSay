// GalakSay Pro — 2026-03-19 — Uzay arka plan animasyonları (parallax katmanları + geliştirilmiş meteorlar)
// prefers-reduced-motion desteği + pil dostu tasarım
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { colors } from '../colors.js';

// ═══ PARALLAX KATMANLARI ═══════════════════════════════════════════════════
// Katman 1 (en arka): Büyük nebula/bulut, çok yavaş hareket
// Katman 2 (orta): Küçük yıldızlar, orta hız
// Katman 3 (ön): İnce toz parçacıkları, hızlı hareket

// Sistem reduced-motion tercihini kontrol et
function useSystemReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);
  return reduced;
}

// Performanslı yıldız alanı — CSS-only, GPU-accelerated
export const SpaceBackground = React.memo(function SpaceBackground({
  starCount = 60,
  showNebula = true,
  showMeteors = true,
  showParallax = false, // cihaz eğimine tepki veren parallax katmanları
  simplified = false, // etkinlik ekranında basitleştirilmiş
  style: sx,
}) {
  const systemReducedMotion = useSystemReducedMotion();
  const reduceMotion = simplified || systemReducedMotion;

  // Parallax pozisyonu (cihaz eğimi veya mouse)
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!showParallax || reduceMotion) return;

    // Cihaz eğimi (mobil)
    const handleOrientation = (e) => {
      const x = (e.gamma || 0) / 45; // -1 to 1
      const y = (e.beta || 0) / 45;
      setParallax({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y - 0.5)) });
    };

    // Mouse (masaüstü)
    const handleMouse = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setParallax({ x, y });
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }
    window.addEventListener('mousemove', handleMouse, { passive: true });

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, [showParallax, reduceMotion]);

  // Yıldızlar: 3 katmanlı — arka (büyük, yavaş), orta, ön (küçük, hızlı)
  const layers = useMemo(() => {
    const count = reduceMotion ? 30 : starCount;
    const back = [];
    const mid = [];
    const front = [];

    for (let i = 0; i < count; i++) {
      const star = {
        id: i,
        x: `${(i * 37 + 13) % 100}%`,
        y: `${(i * 61 + 7) % 100}%`,
        size: ((i * 17) % 3) + 1,
        delay: ((i * 23) % 50) / 10,
        dur: 2 + ((i * 13) % 30) / 10,
        color: i % 7 === 0 ? 'rgba(167,139,250,.8)' : i % 11 === 0 ? 'rgba(56,189,248,.7)' : 'rgba(255,255,255,.6)',
      };

      if (i % 3 === 0) back.push({ ...star, size: star.size + 1, dur: star.dur + 2 });
      else if (i % 3 === 1) mid.push(star);
      else front.push({ ...star, size: Math.max(1, star.size - 0.5), dur: star.dur - 0.5 });
    }

    return { back, mid, front };
  }, [starCount, reduceMotion]);

  const pxFactor = showParallax ? 1 : 0;

  // Parallax transform hesapla — farklı katmanlar farklı hızda hareket
  const layerTransform = (depth) => {
    if (!pxFactor) return 'translate3d(0,0,0)';
    const factor = depth * 8;
    return `translate3d(${parallax.x * factor}px, ${parallax.y * factor}px, 0)`;
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
      ...sx,
    }}>
      {/* Katman 1: Arka — büyük yıldızlar, yavaş hareket */}
      <div style={{
        position: 'absolute',
        inset: '-2%',
        transform: layerTransform(1),
        transition: showParallax ? 'transform 150ms ease-out' : 'none',
        willChange: showParallax ? 'transform' : 'auto',
      }}>
        {layers.back.map(s => (
          <div
            key={`b${s.id}`}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              background: s.color,
              opacity: reduceMotion ? 0.5 : 0.4,
              animation: reduceMotion ? 'none' : `starTwinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
              willChange: reduceMotion ? 'auto' : 'opacity',
            }}
          />
        ))}
      </div>

      {/* Katman 2: Orta — standart yıldızlar */}
      <div style={{
        position: 'absolute',
        inset: '-1%',
        transform: layerTransform(2),
        transition: showParallax ? 'transform 100ms ease-out' : 'none',
        willChange: showParallax ? 'transform' : 'auto',
      }}>
        {layers.mid.map(s => (
          <div
            key={`m${s.id}`}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              background: s.color,
              opacity: reduceMotion ? 0.6 : 0.5,
              animation: reduceMotion ? 'none' : `starTwinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
              willChange: reduceMotion ? 'auto' : 'opacity',
            }}
          />
        ))}
      </div>

      {/* Katman 3: Ön — küçük parlak yıldızlar, hızlı hareket */}
      <div style={{
        position: 'absolute',
        inset: 0,
        transform: layerTransform(3),
        transition: showParallax ? 'transform 80ms ease-out' : 'none',
        willChange: showParallax ? 'transform' : 'auto',
      }}>
        {layers.front.map(s => (
          <div
            key={`f${s.id}`}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              background: s.color,
              opacity: reduceMotion ? 0.8 : 0.7,
              animation: reduceMotion ? 'none' : `starTwinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
              willChange: reduceMotion ? 'auto' : 'opacity',
            }}
          />
        ))}
      </div>

      {/* Nebula layers — yavaş hareket eden renkli bulutsu */}
      {showNebula && !reduceMotion && (
        <>
          <div style={{
            position: 'absolute',
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(108,99,255,.08), transparent 70%)',
            top: '5%',
            right: '-10%',
            filter: 'blur(40px)',
            animation: 'nebulaFloat 30s ease-in-out infinite',
            transform: layerTransform(0.5),
          }} />
          <div style={{
            position: 'absolute',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(236,72,153,.06), transparent 70%)',
            bottom: '10%',
            left: '-5%',
            filter: 'blur(40px)',
            animation: 'nebulaFloat 35s ease-in-out 5s infinite',
            transform: layerTransform(0.5),
          }} />
          {/* Üçüncü nebula — hafif mavi */}
          <div style={{
            position: 'absolute',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(56,189,248,.04), transparent 70%)',
            top: '40%',
            left: '30%',
            filter: 'blur(50px)',
            animation: 'nebulaFloat 40s ease-in-out 10s infinite',
          }} />
        </>
      )}

      {/* Shooting meteors — 3 meteor, farklı zamanlama */}
      {showMeteors && !reduceMotion && (
        <>
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: 80,
            height: 1.5,
            borderRadius: 2,
            background: 'linear-gradient(90deg, transparent, rgba(167,139,250,.6), transparent)',
            transform: 'rotate(-35deg)',
            opacity: 0,
            animation: 'meteorShoot 20s ease 3s infinite',
          }} />
          <div style={{
            position: 'absolute',
            top: '45%',
            left: '40%',
            width: 60,
            height: 1,
            borderRadius: 2,
            background: 'linear-gradient(90deg, transparent, rgba(56,189,248,.5), transparent)',
            transform: 'rotate(-30deg)',
            opacity: 0,
            animation: 'meteorShoot 25s ease 12s infinite',
          }} />
          <div style={{
            position: 'absolute',
            top: '70%',
            left: '60%',
            width: 50,
            height: 1,
            borderRadius: 2,
            background: 'linear-gradient(90deg, transparent, rgba(255,217,61,.4), transparent)',
            transform: 'rotate(-40deg)',
            opacity: 0,
            animation: 'meteorShoot 30s ease 20s infinite',
          }} />
        </>
      )}
    </div>
  );
});
