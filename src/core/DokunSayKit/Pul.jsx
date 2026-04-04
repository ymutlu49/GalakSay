// GalakSay Revizyon — 2026-03-18 — Geliştirilmiş sayma animasyonu, halka efekti
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDokunSayDrag, FIZIK, ANIM_PRESETS, vibrate, playSound } from './MateryalFizik.js';

// ═══════════════════════════════════════════════════════════════════════════════
// YILDIZ TAŞI — DokunSay Birim Yıldız Taşlarının Dijital Karşılığı
// Daire biçimli, tek birimlik, metalik parlak yüzey
// Sürüklenebilir, gruplanabilir, sayılabilir, dağıtılabilir
// Geliştirilmiş: halka efekti, sayma sesi, daha belirgin geri bildirim
// ═══════════════════════════════════════════════════════════════════════════════

// Yıldız taşı renk paleti (gruplama için 5'e kadar mavi, 5+ kırmızı — DokunSay kuralı)
const PUL_RENKLERI = {
  blue:   { bg: '#3B82F6', bgLight: '#60A5FA', border: '#1E40AF', glow: 'rgba(59,130,246,0.5)', text: '#FFF' },
  red:    { bg: '#EF4444', bgLight: '#F87171', border: '#991B1B', glow: 'rgba(239,68,68,0.5)',   text: '#FFF' },
  green:  { bg: '#22C55E', bgLight: '#4ADE80', border: '#15803D', glow: 'rgba(34,197,94,0.5)',   text: '#FFF' },
  yellow: { bg: '#EAB308', bgLight: '#FACC15', border: '#A16207', glow: 'rgba(234,179,8,0.5)',   text: '#333' },
  purple: { bg: '#8B5CF6', bgLight: '#A78BFA', border: '#6D28D9', glow: 'rgba(139,92,246,0.5)',  text: '#FFF' },
};

// ── Renk körlüğü alternatifleri ─────────────────────────────────────────────
const CB_RENKLERI = {
  blue: { ...PUL_RENKLERI.blue, pattern: 'stripes' },
  red:  { bg: '#D97706', bgLight: '#F59E0B', border: '#92400E', glow: 'rgba(217,119,6,0.5)', text: '#FFF', pattern: 'dots' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANA BİLEŞEN: Yıldız Taşı (Pul)
// ═══════════════════════════════════════════════════════════════════════════════
export const Pul = ({
  id,                       // Benzersiz ID
  renk: renkProp = 'blue',  // 'blue' | 'red' | 'green' | 'yellow' | 'purple'
  size = 44,                // Çap (px)
  sayi = null,              // Üzerinde gösterilecek sayı (null=gösterme)
  draggable = false,        // Sürüklenebilir mi
  countable = false,        // Sayılabilir mi (dokunma ile sayma)
  counted = false,          // Sayılmış mı (dış kontrol)
  hidden = false,           // Gizli mi (? göster)
  glowing = false,          // Parlama efekti
  highlighted = false,      // Vurgulama
  colorBlind = false,       // Renk körlüğü modu
  groupIndex = null,        // Grup indeksi (gruplama için)
  animate = true,           // Giriş animasyonu
  countIndex = null,        // Sayma sırası (animasyonlu belirime)
  snapZones = [],           // Snap hedefleri
  onDrop,                   // Bırakma callback
  onCount,                  // Sayma callback: (id, newCountState)
  onClick,                  // Tıklama callback
  style: externalStyle,
}) => {
  const [isCounted, setIsCounted] = useState(counted);
  const [isBouncing, setIsBouncing] = useState(false);
  const [appeared, setAppeared] = useState(!animate);
  const [showRing, setShowRing] = useState(false);
  const bounceTimer = useRef(null);
  const ringTimer = useRef(null);

  // Dış counted prop ile senkron
  useEffect(() => { setIsCounted(counted); }, [counted]);

  // Sıralı belirme animasyonu
  useEffect(() => {
    if (!animate) return;
    const delay = countIndex != null ? countIndex * ANIM_PRESETS.stagger + 100 : 100;
    const t = setTimeout(() => setAppeared(true), delay);
    return () => clearTimeout(t);
  }, [animate, countIndex]);

  // Renk seçimi
  const renkObj = colorBlind
    ? (CB_RENKLERI[renkProp] || PUL_RENKLERI[renkProp] || PUL_RENKLERI.blue)
    : (PUL_RENKLERI[renkProp] || PUL_RENKLERI.blue);

  // Sayma dokunuşu
  const handleCount = useCallback(() => {
    if (!countable && !onClick) return;

    if (countable) {
      const newState = !isCounted;
      setIsCounted(newState);

      // Zıplama animasyonu
      setIsBouncing(true);
      clearTimeout(bounceTimer.current);
      bounceTimer.current = setTimeout(() => setIsBouncing(false), FIZIK.CHIP_BOUNCE_MS);

      // Halka efekti (sayıldığında)
      if (newState) {
        setShowRing(true);
        clearTimeout(ringTimer.current);
        ringTimer.current = setTimeout(() => setShowRing(false), 400);
      }

      // Ses ve titreşim
      if (newState) {
        playSound('countTick', { index: groupIndex });
        vibrate([15]);
      }

      onCount?.(id, newState);
    }

    onClick?.();
  }, [countable, isCounted, id, groupIndex, onCount, onClick]);

  // Sürükleme
  const { isDragging, bindDrag } = useDokunSayDrag({
    snapZones,
    onDrop: (result) => {
      playSound('chipDrop');
      return onDrop?.(result);
    },
    enabled: draggable,
  });

  const pulStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    cursor: draggable
      ? (isDragging ? 'grabbing' : 'grab')
      : (countable || onClick) ? 'pointer' : 'default',

    // Metalik görünüm
    background: hidden
      ? 'linear-gradient(135deg, #4B5563, #374151)'
      : isCounted
        ? `radial-gradient(circle at 35% 30%, ${renkObj.bgLight}88 0%, ${renkObj.bg}88 50%, ${renkObj.border}88 100%)`
        : `radial-gradient(circle at 35% 30%, ${renkObj.bgLight} 0%, ${renkObj.bg} 50%, ${renkObj.border} 100%)`,
    border: hidden
      ? '2.5px solid #4B5563'
      : `3px solid ${renkObj.border}`,
    boxShadow: glowing || highlighted
      ? `0 0 18px 6px ${renkObj.glow}, inset 0 -3px 6px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.3)`
      : `0 3px 10px ${renkObj.bg}50, 0 0 14px ${renkObj.bg}20, inset 0 -3px 6px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.3)`,

    // "Sayıldı" opaklık
    opacity: appeared
      ? (isCounted ? FIZIK.CHIP_COUNTED_OPACITY : 1)
      : 0,

    // Zıplama + belirme
    transform: appeared
      ? isBouncing
        ? `scale(${FIZIK.CHIP_BOUNCE_SCALE})`
        : 'scale(1)'
      : 'scale(0.3)',
    transition: isBouncing
      ? `transform ${FIZIK.CHIP_BOUNCE_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1)`
      : `all ${ANIM_PRESETS.normal.duration}ms ${ANIM_PRESETS.normal.easing}`,

    ...externalStyle,
  };

  return (
    <div
      {...(draggable ? bindDrag : {})}
      onClick={handleCount}
      style={pulStyle}
      role="img"
      aria-label={hidden ? 'Gizli yıldız taşı' : `Yıldız taşı${sayi != null ? `: ${sayi}` : ''}${isCounted ? ' (sayıldı)' : ''}`}
    >
      {/* Metalik iç yansıma */}
      {!hidden && (
        <div style={{
          position: 'absolute',
          top: '12%', left: '18%',
          width: '35%', height: '30%',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.45) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
      )}

      {/* Renk körlüğü desen overlay */}
      {colorBlind && !hidden && renkObj.pattern === 'stripes' && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%', opacity: 0.25,
          background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 4px)',
          pointerEvents: 'none',
        }} />
      )}
      {colorBlind && !hidden && renkObj.pattern === 'dots' && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%', opacity: 0.3,
          background: `radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)`,
          backgroundSize: `${Math.max(4, size / 6)}px ${Math.max(4, size / 6)}px`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Sayı veya ? */}
      {hidden ? (
        <span style={{
          fontSize: size * 0.5, color: '#9CA3AF',
          fontWeight: 900, position: 'relative', zIndex: 1,
          userSelect: 'none',
        }}>?</span>
      ) : sayi != null && (
        <span style={{
          fontSize: String(sayi).length >= 2 ? size * 0.38 : size * 0.44,
          fontWeight: 900,
          color: renkObj.text,
          textShadow: 'none',
          position: 'relative', zIndex: 1,
          userSelect: 'none',
          lineHeight: 1,
        }}>{sayi}</span>
      )}

      {/* Sayılmış işareti (küçük tik) */}
      {isCounted && !hidden && (
        <div style={{
          position: 'absolute',
          bottom: 2, right: 2,
          width: size * 0.22, height: size * 0.22,
          borderRadius: '50%',
          background: '#10B981',
          border: '1.5px solid #059669',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.12, color: '#FFF', fontWeight: 900,
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          animation: 'pulTickAppear 200ms cubic-bezier(0.34,1.56,0.64,1)',
        }}>✓</div>
      )}

      {/* Sayma halka efekti */}
      {showRing && (
        <div style={{
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          border: `2.5px solid ${renkObj.bg}`,
          pointerEvents: 'none',
          animation: 'pulRingExpand 400ms ease-out forwards',
          willChange: 'transform, opacity',
        }} />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// YILDIZ TAŞI GRUBU — Birden fazla yıldız taşını düzenli veya serbest dizme
// ═══════════════════════════════════════════════════════════════════════════════
export const PulGrubu = ({
  adet,                     // Yıldız taşı sayısı
  renk = 'auto',            // 'auto' (5'e kadar mavi, 5+ kırmızı) | tek renk
  size = 40,                // Yıldız taşı boyutu
  layout = 'wrap',          // 'wrap' | 'line' | 'circle' | 'scattered'
  countable = false,        // Sayılabilir mi
  draggable = false,        // Sürüklenebilir mi
  showTotal = false,        // Toplam sayı göster
  animate = true,           // Sıralı belirme
  colorBlind = false,
  maxDisplay = 20,          // Maksimum gösterilecek yıldız taşı
  gap = 6,
  onCountChange,            // Sayım değişimi callback: (countedIds)
  style: externalStyle,
}) => {
  const [countedSet, setCountedSet] = useState(new Set());
  const count = Math.min(adet, maxDisplay);

  const handlePulCount = useCallback((id, isCounted) => {
    setCountedSet(prev => {
      const next = new Set(prev);
      if (isCounted) next.add(id);
      else next.delete(id);
      onCountChange?.(Array.from(next));
      return next;
    });
  }, [onCountChange]);

  // Otomatik renk: 5'e kadar mavi, 5+ kırmızı
  const getRenk = (index) => {
    if (renk !== 'auto') return renk;
    return index < 5 ? 'blue' : 'red';
  };

  const layoutStyle = {
    wrap: { display: 'flex', flexWrap: 'wrap', gap, justifyContent: 'center' },
    line: { display: 'flex', gap: gap / 2 },
    circle: {
      position: 'relative',
      width: count <= 5 ? count * (size + gap) : size * 4,
      height: count <= 5 ? size + gap : size * 4,
    },
    scattered: {
      position: 'relative',
      width: Math.min(count * (size * 0.7), 300),
      height: Math.min(Math.ceil(count / 5) * (size * 0.8), 200),
    },
  };

  return (
    <div style={{
      padding: 10, borderRadius: 12,
      background: 'linear-gradient(135deg, rgba(49,46,129,0.2), rgba(30,27,75,0.15))',
      border: '1px solid rgba(148,163,184,0.1)',
      minHeight: size + 20,
      ...layoutStyle[layout],
      ...externalStyle,
    }}>
      {Array.from({ length: count }, (_, i) => (
        <Pul
          key={`pul-${i}`}
          id={`pul-${i}`}
          renk={getRenk(i)}
          size={size}
          countable={countable}
          counted={countedSet.has(`pul-${i}`)}
          countIndex={animate ? i : null}
          animate={animate}
          draggable={draggable}
          colorBlind={colorBlind}
          groupIndex={i}
          onCount={handlePulCount}
        />
      ))}

      {/* Fazla yıldız taşı göstergesi */}
      {adet > maxDisplay && (
        <span style={{
          fontSize: 14, color: '#94A3B8', fontWeight: 700,
          alignSelf: 'center', marginLeft: 4,
        }}>+{adet - maxDisplay}</span>
      )}

      {/* Toplam sayı */}
      {showTotal && (
        <div style={{
          position: 'absolute', bottom: -24, left: '50%',
          transform: 'translateX(-50%)',
          padding: '2px 12px', borderRadius: 8,
          background: 'rgba(99,102,241,0.3)',
          border: '1px solid rgba(99,102,241,0.3)',
          color: '#FFF', fontWeight: 900, fontSize: 14,
        }}>
          {countable ? countedSet.size : adet}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CSS Keyframe Animasyonları
// ═══════════════════════════════════════════════════════════════════════════════
const PUL_STYLES_ID = 'pul-styles';
if (typeof document !== 'undefined' && !document.getElementById(PUL_STYLES_ID)) {
  const style = document.createElement('style');
  style.id = PUL_STYLES_ID;
  style.textContent = `
    @keyframes pulRingExpand {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    @keyframes pulTickAppear {
      0% { transform: scale(0); }
      100% { transform: scale(1); }
    }
    @keyframes pulShake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-3px); }
      40% { transform: translateX(3px); }
      60% { transform: translateX(-2px); }
      80% { transform: translateX(2px); }
    }
  `;
  document.head.appendChild(style);
}

export default Pul;
