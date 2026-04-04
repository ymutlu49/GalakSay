// GalakSay Revizyon — 2026-03-18 — Geliştirilmiş animasyonlar, parçacık efektleri
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useDokunSayDrag, useLongPress, FIZIK, ANIM_PRESETS, vibrate, playSound } from './MateryalFizik.js';

// ═══════════════════════════════════════════════════════════════════════════════
// ENERJİ KAPSÜLÜ — DokunSay Enerji Kapsüllerinin Dijital Karşılığı
// 1-10 birimlik kapsüller, her uzunluk benzersiz renk
// Sürüklenebilir, birleştirilebilir, bölünebilir
// Geliştirilmiş: birim reveal stagger, split crack efekti, merge parçacıkları
// ═══════════════════════════════════════════════════════════════════════════════

// ── DokunSay Orijinal Renk Şeması ──────────────────────────────────────────
export const KAPSUL_RENKLERI = {
  1:  { ad: 'Beyaz',       bg: '#F5F5F5', bgLight: '#FFFFFF', border: '#D4D4D4', text: '#333', glow: 'rgba(245,245,245,0.5)' },
  2:  { ad: 'Kırmızı',     bg: '#E53935', bgLight: '#EF5350', border: '#B71C1C', text: '#FFF', glow: 'rgba(229,57,53,0.5)' },
  3:  { ad: 'Açık Yeşil',  bg: '#66BB6A', bgLight: '#81C784', border: '#2E7D32', text: '#FFF', glow: 'rgba(102,187,106,0.5)' },
  4:  { ad: 'Mor',         bg: '#8E24AA', bgLight: '#AB47BC', border: '#6A1B9A', text: '#FFF', glow: 'rgba(142,36,170,0.5)' },
  5:  { ad: 'Sarı',        bg: '#FDD835', bgLight: '#FFEE58', border: '#F9A825', text: '#333', glow: 'rgba(253,216,53,0.5)' },
  6:  { ad: 'Koyu Yeşil',  bg: '#2E7D32', bgLight: '#43A047', border: '#1B5E20', text: '#FFF', glow: 'rgba(46,125,50,0.5)' },
  7:  { ad: 'Siyah',       bg: '#37474F', bgLight: '#546E7A', border: '#212121', text: '#FFF', glow: 'rgba(55,71,79,0.5)' },
  8:  { ad: 'Kahverengi',  bg: '#6D4C41', bgLight: '#8D6E63', border: '#4E342E', text: '#FFF', glow: 'rgba(109,76,65,0.5)' },
  9:  { ad: 'Mavi',        bg: '#1E88E5', bgLight: '#42A5F5', border: '#1565C0', text: '#FFF', glow: 'rgba(30,136,229,0.5)' },
  10: { ad: 'Turuncu',     bg: '#FB8C00', bgLight: '#FFA726', border: '#E65100', text: '#FFF', glow: 'rgba(251,140,0,0.5)' },
};

// Renk körlüğü desenleri (her değer için benzersiz)
const CB_DESENLERI = {
  1:  'none',                    // Düz
  2:  'horizontal-lines',        // Yatay çizgiler
  3:  'vertical-lines',          // Dikey çizgiler
  4:  'diagonal-right',          // Sağa çapraz
  5:  'diagonal-left',           // Sola çapraz
  6:  'dots',                    // Noktalar
  7:  'cross-hatch',             // Çapraz ızgara
  8:  'circles',                 // Daireler
  9:  'zigzag',                  // Zikzak
  10: 'diamond',                 // Baklava dilimi
};

// ── Renk Körlüğü Desen SVG'leri ────────────────────────────────────────────
const CBPattern = ({ pattern, size }) => {
  if (pattern === 'none') return null;
  const s = size || 8;
  const patternDefs = {
    'horizontal-lines': (
      <pattern id={`cb-${pattern}`} width={s} height={s} patternUnits="userSpaceOnUse">
        <line x1="0" y1={s/2} x2={s} y2={s/2} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
      </pattern>
    ),
    'vertical-lines': (
      <pattern id={`cb-${pattern}`} width={s} height={s} patternUnits="userSpaceOnUse">
        <line x1={s/2} y1="0" x2={s/2} y2={s} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
      </pattern>
    ),
    'diagonal-right': (
      <pattern id={`cb-${pattern}`} width={s} height={s} patternUnits="userSpaceOnUse">
        <line x1="0" y1={s} x2={s} y2="0" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
      </pattern>
    ),
    'diagonal-left': (
      <pattern id={`cb-${pattern}`} width={s} height={s} patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2={s} y2={s} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
      </pattern>
    ),
    'dots': (
      <pattern id={`cb-${pattern}`} width={s} height={s} patternUnits="userSpaceOnUse">
        <circle cx={s/2} cy={s/2} r="1.5" fill="rgba(255,255,255,0.4)"/>
      </pattern>
    ),
    'cross-hatch': (
      <pattern id={`cb-${pattern}`} width={s} height={s} patternUnits="userSpaceOnUse">
        <line x1="0" y1={s} x2={s} y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
        <line x1="0" y1="0" x2={s} y2={s} stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      </pattern>
    ),
    'circles': (
      <pattern id={`cb-${pattern}`} width={s*1.5} height={s*1.5} patternUnits="userSpaceOnUse">
        <circle cx={s*.75} cy={s*.75} r={s*.4} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      </pattern>
    ),
    'zigzag': (
      <pattern id={`cb-${pattern}`} width={s*2} height={s} patternUnits="userSpaceOnUse">
        <polyline points={`0,${s} ${s},0 ${s*2},${s}`} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
      </pattern>
    ),
    'diamond': (
      <pattern id={`cb-${pattern}`} width={s} height={s} patternUnits="userSpaceOnUse">
        <polygon points={`${s/2},0 ${s},${s/2} ${s/2},${s} 0,${s/2}`} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      </pattern>
    ),
  };
  return patternDefs[pattern] || null;
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANA BİLEŞEN: EnerjiKapsulu
// ═══════════════════════════════════════════════════════════════════════════════
export const EnerjiKapsulu = ({
  deger,                    // 1-10: Kapsül değeri (birim sayısı)
  id,                       // Benzersiz ID (birleşme/bölme için)
  draggable = false,        // Sürüklenebilir mi
  splittable = false,       // Bölünebilir mi
  showUnits = true,         // Birim bölmeleri göster
  showNumber = false,       // Altında sayı göster
  glowing = false,          // Parlama efekti
  highlighted = false,      // Vurgulama (fark bölgesi vb.)
  highlightRange,           // [start, end] — belirli birimleri vurgula
  colorBlind = false,       // Renk körlüğü modu
  size = 'auto',            // 'auto' | number (birim başına px)
  compact = false,          // Küçük mod
  orientation = 'horizontal', // 'horizontal' | 'vertical'
  mergeAnim = false,        // Birleşme animasyonu aktif
  splitAtUnit,              // Bölünme noktası (onSplit tetikler)
  snapZones = [],           // Snap hedefleri
  onDrop,                   // Bırakma callback
  onSplit,                  // Bölünme callback: (leftVal, rightVal)
  onMerge,                  // Birleşme callback
  onClick,                  // Tıklama callback
  animate = true,           // Giriş animasyonu
  entryIndex = 0,           // Sıralı belirme indeksi (stagger)
  style: externalStyle,
}) => {
  const [splitLine, setSplitLine] = useState(null);  // Aktif bölme çizgisi
  const [isSquashing, setIsSquashing] = useState(false);
  const [isMerging, setIsMerging] = useState(mergeAnim);
  const [splitAnim, setSplitAnim] = useState(false);
  const [appeared, setAppeared] = useState(!animate);
  const [unitReveal, setUnitReveal] = useState(!mergeAnim); // Birim stagger reveal
  const [revealedUnits, setRevealedUnits] = useState(mergeAnim ? 0 : 999);
  const [splitCrackParticles, setSplitCrackParticles] = useState([]); // Bölünme parçacıkları

  // Giriş animasyonu (stagger)
  useEffect(() => {
    if (!animate) return;
    const delay = entryIndex * 100 + 50;
    const t = setTimeout(() => setAppeared(true), delay);
    return () => clearTimeout(t);
  }, [animate, entryIndex]);

  const val = Math.max(1, Math.min(10, Math.round(deger || 1)));
  const renk = KAPSUL_RENKLERI[val];
  const cbDesen = CB_DESENLERI[val];

  // Birim boyutu hesapla
  const unitSize = useMemo(() => {
    if (typeof size === 'number') return size;
    if (compact) return 28;
    return 38;
  }, [size, compact]);

  // Sürükleme
  const {
    isDragging,
    dragPhase,
    bindDrag,
  } = useDokunSayDrag({
    snapZones,
    onDrop: (result) => {
      setIsSquashing(true);
      playSound('drop', { value: val });
      setTimeout(() => setIsSquashing(false), FIZIK.SQUASH_MS * 2);
      return onDrop?.(result);
    },
    enabled: draggable,
  });

  // Uzun basış → bölünme (geliştirilmiş: crack + parçacık)
  const longPressBinds = useLongPress(
    (e, target) => {
      if (!splittable || !splitLine) return;
      // Bölünme animasyonu + parçacık efekti
      vibrate([30, 50, 30]);
      playSound('split', { value: val, at: splitLine });
      setSplitAnim(true);
      spawnSplitParticles(splitLine);
      setTimeout(() => {
        onSplit?.(splitLine, val - splitLine);
        setSplitAnim(false);
        setSplitLine(null);
      }, FIZIK.SPLIT_CRACK_MS + FIZIK.SPLIT_SEPARATE_MS);
    },
    {
      delay: FIZIK.SPLIT_LONG_PRESS_MS,
      onPressStart: () => {
        if (splittable && splitLine) vibrate([20]);
      },
    }
  );

  // Birim bölme çizgisi hover
  const handleUnitHover = useCallback((unitIndex) => {
    if (!splittable) return;
    if (unitIndex > 0 && unitIndex < val) {
      setSplitLine(unitIndex);
    }
  }, [splittable, val]);

  // Birleşme efekti — geliştirilmiş: titreşim → parlama → birim stagger reveal
  useEffect(() => {
    if (mergeAnim) {
      setIsMerging(true);
      setUnitReveal(false);
      setRevealedUnits(0);
      vibrate([FIZIK.MERGE_VIBRATE_MS, 30, FIZIK.MERGE_VIBRATE_MS]);
      playSound('merge', { value: val });

      // Parlama bitince birimleri sırayla göster (stagger 50ms)
      const mergeTimer = setTimeout(() => {
        setIsMerging(false);
        setUnitReveal(true);
        // Birimleri sırayla reveal
        for (let i = 0; i <= val; i++) {
          setTimeout(() => setRevealedUnits(i), i * 50);
        }
      }, FIZIK.MERGE_ANIM_MS);

      return () => clearTimeout(mergeTimer);
    } else {
      setRevealedUnits(999);
      setUnitReveal(true);
    }
  }, [mergeAnim, val]);

  // Bölünme crack parçacık efekti
  const spawnSplitParticles = useCallback((splitPoint) => {
    const particles = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.random() - 0.5) * Math.PI;
      particles.push({
        id: `crack-${i}-${Date.now()}`,
        x: Math.cos(angle) * (15 + Math.random() * 25),
        y: Math.sin(angle) * (15 + Math.random() * 25),
        size: 3 + Math.random() * 4,
        delay: Math.random() * 50,
      });
    }
    setSplitCrackParticles(particles);
    setTimeout(() => setSplitCrackParticles([]), 600);
  }, []);

  const isHorizontal = orientation === 'horizontal';
  const totalLength = val * unitSize;
  const thickness = unitSize + 12;

  // Kapsül ana stili (geliştirilmiş: giriş animasyonu + birim reveal)
  const kapsulStyle = {
    display: 'inline-flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    alignItems: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    maxWidth: '100%',
    border: `3px solid ${renk.border}`,
    boxShadow: glowing
      ? `0 0 20px 6px ${renk.glow}, 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)`
      : `0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)`,
    position: 'relative',
    transition: isMerging
      ? `all ${FIZIK.MERGE_ANIM_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1)`
      : `all ${ANIM_PRESETS.normal.duration}ms ${ANIM_PRESETS.normal.easing}`,
    transform: !appeared
      ? 'scale(0.3)'
      : isSquashing
        ? `scaleX(${FIZIK.SQUASH_X}) scaleY(${FIZIK.SQUASH_Y})`
        : isMerging
          ? 'scale(1.08)'
          : 'scale(1)',
    opacity: !appeared ? 0 : (splitAnim ? 0.7 : 1),
    ...externalStyle,
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', maxWidth: 'min(100%, 90vw)', overflow: 'hidden' }}>
      <div
        {...(draggable ? bindDrag : {})}
        {...(splittable ? longPressBinds : {})}
        onClick={onClick}
        style={kapsulStyle}
        role="img"
        aria-label={`${val} birimlik enerji kapsülü (${renk.ad})`}
      >
        {/* Birim hücreleri (geliştirilmiş: stagger reveal) */}
        {Array.from({ length: val }, (_, i) => {
          const isHighlighted = highlightRange
            ? i >= highlightRange[0] && i < highlightRange[1]
            : highlighted;
          const isSplitPoint = splitLine === i + 1 && i < val - 1;
          const isRevealed = i < revealedUnits;

          return (
            <div
              key={i}
              onPointerEnter={() => handleUnitHover(i + 1)}
              style={{
                width: isHorizontal ? unitSize : thickness,
                minWidth: 0,
                flex: '0 1 auto',
                height: isHorizontal ? thickness : unitSize,
                background: isHighlighted
                  ? `linear-gradient(180deg, ${renk.bgLight} 0%, ${renk.bg} 40%, ${renk.border} 100%)`
                  : `linear-gradient(180deg, ${renk.bgLight}dd 0%, ${renk.bg} 50%, ${renk.border}cc 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                // Birim bölme çizgileri (geliştirilmiş: daha belirgin çentikler)
                borderRight: isHorizontal && i < val - 1
                  ? isSplitPoint
                    ? `3px solid rgba(255,255,255,0.9)`
                    : showUnits
                      ? `1.5px solid rgba(255,255,255,0.25)`
                      : 'none'
                  : 'none',
                borderBottom: !isHorizontal && i < val - 1
                  ? isSplitPoint
                    ? `3px solid rgba(255,255,255,0.9)`
                    : showUnits
                      ? `1.5px solid rgba(255,255,255,0.25)`
                      : 'none'
                  : 'none',
                // Vurgulama efekti
                boxShadow: isHighlighted
                  ? `inset 0 0 12px ${renk.glow}`
                  : 'none',
                // Stagger reveal (birleşme sonrası soldan sağa sırayla)
                opacity: isRevealed ? 1 : 0.3,
                transform: isRevealed ? 'scale(1)' : 'scale(0.85)',
                transition: `all ${ANIM_PRESETS.fast.duration}ms ${ANIM_PRESETS.fast.easing}`,
              }}
            >
              {/* Birim numarası (isteğe bağlı, küçük) */}
              {showUnits && (
                <span style={{
                  fontSize: Math.max(10, unitSize * 0.32),
                  fontWeight: 700,
                  color: `${renk.text}66`,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}>
                  {i + 1}
                </span>
              )}

              {/* Bölme çizgisi göstergesi */}
              {isSplitPoint && splittable && (
                <div style={{
                  position: 'absolute',
                  [isHorizontal ? 'right' : 'bottom']: -2,
                  [isHorizontal ? 'top' : 'left']: '10%',
                  [isHorizontal ? 'width' : 'height']: 4,
                  [isHorizontal ? 'height' : 'width']: '80%',
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: 2,
                  boxShadow: '0 0 8px rgba(255,255,255,0.6)',
                  animation: 'kapsulSplitGlow 1s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
              )}
            </div>
          );
        })}

        {/* Renk körlüğü desen overlay */}
        {colorBlind && cbDesen !== 'none' && (
          <svg style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            pointerEvents: 'none', borderRadius: 14,
          }}>
            <defs>
              <CBPattern pattern={cbDesen} size={8} />
            </defs>
            <rect width="100%" height="100%" fill={`url(#cb-${cbDesen})`} />
          </svg>
        )}

        {/* Birleşme parlama efekti (geliştirilmiş: beyaz flash) */}
        {isMerging && (
          <div style={{
            position: 'absolute', inset: -6,
            borderRadius: 20,
            background: `radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, ${renk.glow} 40%, transparent 70%)`,
            animation: `kapsulMergeGlow ${FIZIK.MERGE_GLOW_MS}ms ease-out forwards`,
            pointerEvents: 'none',
          }} />
        )}

        {/* Bölünme crack parçacıkları */}
        {splitCrackParticles.length > 0 && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 10 }}>
            {splitCrackParticles.map(p => (
              <div key={p.id} style={{
                position: 'absolute',
                left: '50%', top: '50%',
                width: p.size, height: p.size,
                borderRadius: '50%',
                background: '#E0E7FF',
                boxShadow: '0 0 4px rgba(224,231,255,0.6)',
                animation: `galaksayParticle 500ms ease-out ${p.delay}ms forwards`,
                '--endX': `${p.x}px`,
                '--endY': `${p.y}px`,
                willChange: 'transform, opacity',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Sayı etiketi (kapsülün altında) */}
      {showNumber && (
        <div style={{
          marginTop: 6,
          padding: '2px 12px',
          borderRadius: 10,
          background: `${renk.bg}33`,
          border: `1.5px solid ${renk.bg}55`,
          color: '#FFF',
          fontWeight: 900,
          fontSize: compact ? 14 : 16,
          textAlign: 'center',
          minWidth: 28,
        }}>
          {val}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CSS Keyframe Animasyonları (bir kez inject edilir)
// ═══════════════════════════════════════════════════════════════════════════════
const KAPSUL_STYLES_ID = 'enerji-kapsulu-styles';
if (typeof document !== 'undefined' && !document.getElementById(KAPSUL_STYLES_ID)) {
  const style = document.createElement('style');
  style.id = KAPSUL_STYLES_ID;
  style.textContent = `
    @keyframes kapsulSplitGlow {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
    @keyframes kapsulMergeGlow {
      0% { opacity: 0; transform: scale(0.8); }
      40% { opacity: 1; transform: scale(1.15); }
      70% { opacity: 0.6; transform: scale(1.05); }
      100% { opacity: 0; transform: scale(1.2); }
    }
    @keyframes kapsulAppear {
      0% { opacity: 0; transform: scale(0); }
      60% { transform: scale(1.15); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes kapsulSplitCrack {
      0% { width: 0; opacity: 0; }
      30% { opacity: 1; }
      100% { width: 100%; opacity: 0.8; }
    }
    @keyframes galaksayParticle {
      0% { transform: translate(0, 0) scale(1); opacity: 1; }
      70% { opacity: 0.8; }
      100% { transform: translate(var(--endX), var(--endY)) scale(0.2); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

export default EnerjiKapsulu;
