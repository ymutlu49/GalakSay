// GalakSay Revizyon — 2026-03-18 — Parçacık efektleri bileşeni
// ═══════════════════════════════════════════════════════════════════════════════
// PARÇACIK EFEKTLERİ — Doğru cevap, birleşme, bölünme, kutlama
// Lightweight: CSS animasyonlu, GPU-accelerated (transform + opacity only)
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PARTICLES } from './animationPresets.js';

// ── Tek Parçacık ──────────────────────────────────────────────────────────────
const Particle = ({ x, y, color, size, angle, distance, duration, delay = 0 }) => {
  const endX = x + Math.cos(angle) * distance;
  const endY = y + Math.sin(angle) * distance;

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 ${size}px ${color}80`,
      pointerEvents: 'none',
      zIndex: 9999,
      animation: `galaksayParticle ${duration}ms ease-out ${delay}ms forwards`,
      '--endX': `${endX - x}px`,
      '--endY': `${endY - y}px`,
      willChange: 'transform, opacity',
    }} />
  );
};

// ── Parçacık Patlaması (Burst) ────────────────────────────────────────────────
export const ParticleBurst = ({
  x, y,
  type = 'correctBurst', // 'correctBurst' | 'mergeGlow' | 'splitCrack' | 'celebration'
  trigger = false,
  onComplete,
}) => {
  const [particles, setParticles] = useState([]);
  const config = PARTICLES[type] || PARTICLES.correctBurst;

  useEffect(() => {
    if (!trigger) {
      setParticles([]);
      return;
    }

    const newParticles = [];
    for (let i = 0; i < config.count; i++) {
      const angle = (Math.PI * 2 / config.count) * i + (Math.random() - 0.5) * 0.5;
      const distance = config.spread * (0.5 + Math.random() * 0.5);
      const size = config.size.min + Math.random() * (config.size.max - config.size.min);
      const color = config.colors[i % config.colors.length];
      const delay = Math.random() * 50;

      newParticles.push({ id: `p-${i}-${Date.now()}`, angle, distance, size, color, delay });
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, config.duration + 100);

    return () => clearTimeout(timer);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 9999 }}>
      {particles.map(p => (
        <Particle
          key={p.id}
          x={x} y={y}
          color={p.color}
          size={p.size}
          angle={p.angle}
          distance={p.distance}
          duration={config.duration}
          delay={p.delay}
        />
      ))}
    </div>
  );
};

// ── Halka Efekti (Yıldız taşı sayma) ─────────────────────────────────────────
export const RingEffect = ({ x, y, color = '#60A5FA', trigger = false, size = 44 }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setActive(true);
      const t = setTimeout(() => setActive(false), 400);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  if (!active) return null;

  return (
    <div style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      border: `2px solid ${color}`,
      pointerEvents: 'none',
      zIndex: 9998,
      animation: 'galaksayRing 400ms ease-out forwards',
      willChange: 'transform, opacity',
    }} />
  );
};

// ── Parlama (Glow Flash) ─────────────────────────────────────────────────────
export const GlowFlash = ({ x, y, color = '#FFD700', trigger = false, size = 40 }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setActive(true);
      const t = setTimeout(() => setActive(false), 300);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  if (!active) return null;

  return (
    <div style={{
      position: 'absolute',
      left: x - size,
      top: y - size,
      width: size * 2,
      height: size * 2,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color}99 0%, ${color}00 70%)`,
      pointerEvents: 'none',
      zIndex: 9997,
      animation: 'galaksayGlowFlash 300ms ease-out forwards',
      willChange: 'transform, opacity',
    }} />
  );
};

// ── Yıldız Patlaması (Doğru cevap kutlama) ──────────────────────────────────
export const StarBurst = ({ x, y, trigger = false, count = 5, onComplete }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    if (!trigger) {
      setStars([]);
      return;
    }

    const newStars = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.3;
      newStars.push({
        id: `s-${i}-${Date.now()}`,
        angle,
        distance: 30 + Math.random() * 30,
        size: 8 + Math.random() * 6,
        delay: i * 30,
      });
    }
    setStars(newStars);

    const timer = setTimeout(() => {
      setStars([]);
      onComplete?.();
    }, 700);

    return () => clearTimeout(timer);
  }, [trigger]);

  if (stars.length === 0) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 9999 }}>
      {stars.map(s => {
        const endX = x + Math.cos(s.angle) * s.distance;
        const endY = y + Math.sin(s.angle) * s.distance;
        return (
          <div key={s.id} style={{
            position: 'absolute',
            left: x,
            top: y,
            fontSize: s.size,
            lineHeight: 1,
            pointerEvents: 'none',
            animation: `galaksayParticle 600ms ease-out ${s.delay}ms forwards`,
            '--endX': `${endX - x}px`,
            '--endY': `${endY - y}px`,
            willChange: 'transform, opacity',
          }}>
            ⭐
          </div>
        );
      })}
    </div>
  );
};

// ── Doğru/Yanlış Cevap Feedback Overlay ──────────────────────────────────────
export const AnswerFeedback = ({ type, trigger = false, children }) => {
  const [animClass, setAnimClass] = useState('');

  useEffect(() => {
    if (!trigger) {
      setAnimClass('');
      return;
    }
    setAnimClass(type === 'correct' ? 'galaksay-correct-flash' : 'galaksay-wrong-shake');
    const t = setTimeout(() => setAnimClass(''), type === 'correct' ? 300 : 400);
    return () => clearTimeout(t);
  }, [trigger, type]);

  return (
    <div className={animClass} style={{ position: 'relative' }}>
      {children}
    </div>
  );
};

// ── useParticleBurst Hook — Kolay parçacık tetikleme ─────────────────────────
export function useParticleBurst() {
  const [burst, setBurst] = useState(null);
  const timerRef = useRef(null);

  const triggerBurst = useCallback(({ x, y, type = 'correctBurst' }) => {
    clearTimeout(timerRef.current);
    setBurst({ x, y, type, key: Date.now() });
    const config = PARTICLES[type] || PARTICLES.correctBurst;
    timerRef.current = setTimeout(() => setBurst(null), config.duration + 200);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const BurstRenderer = burst ? (
    <ParticleBurst
      x={burst.x} y={burst.y}
      type={burst.type}
      trigger={true}
      key={burst.key}
    />
  ) : null;

  return { triggerBurst, BurstRenderer };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CSS Keyframe Animasyonları (bir kez inject edilir)
// ═══════════════════════════════════════════════════════════════════════════════
const PARTICLE_STYLES_ID = 'galaksay-particle-styles';
if (typeof document !== 'undefined' && !document.getElementById(PARTICLE_STYLES_ID)) {
  const style = document.createElement('style');
  style.id = PARTICLE_STYLES_ID;
  style.textContent = `
    @keyframes galaksayParticle {
      0% { transform: translate(0, 0) scale(1); opacity: 1; }
      70% { opacity: 0.8; }
      100% { transform: translate(var(--endX), var(--endY)) scale(0.2); opacity: 0; }
    }
    @keyframes galaksayRing {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(1.8); opacity: 0; }
    }
    @keyframes galaksayGlowFlash {
      0% { transform: scale(0.5); opacity: 0; }
      30% { transform: scale(1); opacity: 0.9; }
      100% { transform: scale(1.3); opacity: 0; }
    }
    @keyframes galaksayCorrectPulse {
      0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
      50% { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
      100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
    }
    .galaksay-correct-flash {
      animation: galaksayCorrectFlash 300ms ease-out;
    }
    @keyframes galaksayCorrectFlash {
      0% { filter: brightness(1); }
      40% { filter: brightness(1.4) drop-shadow(0 0 12px rgba(16,185,129,0.6)); }
      100% { filter: brightness(1); }
    }
    .galaksay-wrong-shake {
      animation: galaksayWrongShake 400ms ease-in-out;
    }
    @keyframes galaksayWrongShake {
      0%, 100% { transform: translateX(0) rotate(0deg); }
      15% { transform: translateX(-6px) rotate(-2deg); }
      30% { transform: translateX(6px) rotate(2deg); }
      45% { transform: translateX(-4px) rotate(-1.5deg); }
      60% { transform: translateX(4px) rotate(1.5deg); }
      75% { transform: translateX(-2px) rotate(-0.5deg); }
      90% { transform: translateX(2px) rotate(0.5deg); }
    }
    @keyframes galaksayWrongFlash {
      0% { background-color: transparent; }
      30% { background-color: rgba(251,146,60,0.15); }
      100% { background-color: transparent; }
    }
    @keyframes galaksayHintPulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(251,191,36,0.4); }
      50% { transform: scale(1.08); box-shadow: 0 0 0 10px rgba(251,191,36,0); }
    }
    @keyframes galaksaySpinEntrance {
      0% { opacity: 0; transform: scale(0) rotate(-180deg); }
      60% { transform: scale(1.1) rotate(10deg); }
      100% { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    @keyframes galaksayFloatUp {
      0% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-40px); }
    }
    @keyframes galaksayCountNumber {
      0% { transform: translateY(0); opacity: 1; }
      40% { transform: translateY(-15px); opacity: 0; }
      60% { transform: translateY(15px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes galaksayTeleport {
      0% { filter: blur(0); opacity: 1; }
      50% { filter: blur(8px); opacity: 0.3; }
      100% { filter: blur(0); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

export default ParticleBurst;
