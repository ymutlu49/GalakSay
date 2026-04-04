import React, { useState, useEffect, useRef } from 'react';
import { useDokunSayDrag, FIZIK, ANIM_PRESETS, playSound } from './MateryalFizik.js';

// ═══════════════════════════════════════════════════════════════════════════════
// YILDIZ TAŞI — DokunSay Sayı Taşlarının Dijital Karşılığı
// Üzerinde rakam yazılı kristal taş, ışıldar, sürüklenebilir
// Sembolik katmanı somut katmana bağlar
// ═══════════════════════════════════════════════════════════════════════════════

// Kristal renk paleti (değere göre yumuşak ton)
const KRISTAL_RENKLERI = {
  default: { bg: '#7C3AED', bgLight: '#A78BFA', border: '#5B21B6', glow: 'rgba(124,58,237,0.5)' },
  matched: { bg: '#10B981', bgLight: '#34D399', border: '#059669', glow: 'rgba(16,185,129,0.6)' },
  wrong:   { bg: '#F59E0B', bgLight: '#FBBF24', border: '#D97706', glow: 'rgba(245,158,11,0.4)' },
};

export const YildizTasi = ({
  sayi,                     // Gösterilecek rakam
  id,                       // Benzersiz ID
  draggable = false,        // Sürüklenebilir mi
  size = 52,                // Taş boyutu (px)
  state = 'default',        // 'default' | 'matched' | 'wrong' | 'dimmed'
  glowing = false,          // Parlama efekti
  showConnection = false,   // Bağlantı çizgisi göster
  connectionTarget,         // Bağlantı hedefi {x, y}
  snapZones = [],           // Snap hedefleri
  onDrop,                   // Bırakma callback
  onClick,                  // Tıklama callback
  animate = true,           // Giriş animasyonu
  style: externalStyle,
}) => {
  const [isShimmering, setIsShimmering] = useState(false);
  const [appeared, setAppeared] = useState(!animate);
  const shimmerTimer = useRef(null);

  const renk = KRISTAL_RENKLERI[state] || KRISTAL_RENKLERI.default;
  const digits = String(sayi).length;
  const fontSize = digits >= 3 ? size * 0.36 : digits >= 2 ? size * 0.44 : size * 0.52;

  // Giriş animasyonu
  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setAppeared(true), 100);
      return () => clearTimeout(t);
    }
  }, [animate]);

  // Periyodik parıltı efekti
  useEffect(() => {
    if (state === 'dimmed') return;
    const shimmer = () => {
      setIsShimmering(true);
      setTimeout(() => setIsShimmering(false), 600);
      shimmerTimer.current = setTimeout(shimmer, 3000 + Math.random() * 2000);
    };
    shimmerTimer.current = setTimeout(shimmer, 1000 + Math.random() * 2000);
    return () => clearTimeout(shimmerTimer.current);
  }, [state]);

  // Sürükleme
  const { isDragging, bindDrag } = useDokunSayDrag({
    snapZones,
    onDrop: (result) => {
      playSound('starDrop', { value: sayi });
      return onDrop?.(result);
    },
    enabled: draggable,
  });

  const tasStyle = {
    width: size,
    height: size,
    borderRadius: size * 0.22, // Hafif köşeli kristal
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    cursor: draggable ? (isDragging ? 'grabbing' : 'grab') : onClick ? 'pointer' : 'default',
    // Kristal gradient
    background: state === 'dimmed'
      ? 'linear-gradient(135deg, #374151, #1F2937)'
      : `linear-gradient(135deg, ${renk.bgLight} 0%, ${renk.bg} 45%, ${renk.border} 100%)`,
    border: `3px solid ${state === 'dimmed' ? '#4B5563' : renk.border}`,
    boxShadow: glowing || isShimmering
      ? `0 0 20px 8px ${renk.glow}, 0 4px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2)`
      : `0 4px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.2)`,
    // Animasyonlar
    opacity: appeared ? (state === 'dimmed' ? 0.4 : 1) : 0,
    transform: appeared ? 'scale(1)' : 'scale(0)',
    transition: `all ${ANIM_PRESETS.bounce.duration}ms ${ANIM_PRESETS.bounce.easing}`,
    ...externalStyle,
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <div
        {...(draggable ? bindDrag : {})}
        onClick={onClick}
        style={tasStyle}
        role="img"
        aria-label={`Yıldız taşı: ${sayi}`}
      >
        {/* Kristal iç parlaklık */}
        <div style={{
          position: 'absolute',
          top: '8%', left: '15%',
          width: '40%', height: '35%',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          opacity: state === 'dimmed' ? 0.1 : 0.7,
        }} />

        {/* Parıltı efekti */}
        {isShimmering && state !== 'dimmed' && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
            animation: 'yildizShimmer 600ms ease-in-out',
            pointerEvents: 'none',
            borderRadius: size * 0.22,
          }} />
        )}

        {/* Rakam */}
        <span style={{
          fontSize,
          fontWeight: 900,
          color: state === 'dimmed' ? '#6B7280' : '#FFF',
          textShadow: state === 'dimmed' ? 'none' : '0 2px 4px rgba(0,0,0,0.4), 0 0 8px rgba(255,255,255,0.2)',
          position: 'relative',
          zIndex: 1,
          userSelect: 'none',
          lineHeight: 1,
        }}>
          {sayi}
        </span>

        {/* Alt kristal refle */}
        <div style={{
          position: 'absolute',
          bottom: '5%', right: '10%',
          width: '25%', height: '20%',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Bağlantı çizgisi (sembolik ifadeye) */}
      {showConnection && connectionTarget && (
        <svg style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          overflow: 'visible',
        }}>
          <line
            x1={size / 2}
            y1={size}
            x2={connectionTarget.x}
            y2={connectionTarget.y}
            stroke="rgba(251,191,36,0.6)"
            strokeWidth="2"
            strokeDasharray="4,3"
            style={{ filter: 'drop-shadow(0 0 3px rgba(251,191,36,0.4))' }}
          />
        </svg>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CSS Keyframe Animasyonları
// ═══════════════════════════════════════════════════════════════════════════════
const YILDIZ_STYLES_ID = 'yildiz-tasi-styles';
if (typeof document !== 'undefined' && !document.getElementById(YILDIZ_STYLES_ID)) {
  const style = document.createElement('style');
  style.id = YILDIZ_STYLES_ID;
  style.textContent = `
    @keyframes yildizShimmer {
      0% { transform: translateX(-100%); opacity: 0; }
      30% { opacity: 1; }
      100% { transform: translateX(100%); opacity: 0; }
    }
    @keyframes yildizPulse {
      0%, 100% { box-shadow: 0 0 8px 2px rgba(124,58,237,0.3); }
      50% { box-shadow: 0 0 20px 8px rgba(124,58,237,0.6); }
    }
  `;
  document.head.appendChild(style);
}

export default YildizTasi;
