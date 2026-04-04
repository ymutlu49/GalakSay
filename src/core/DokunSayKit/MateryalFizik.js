// ═══════════════════════════════════════════════════════════════════════════════
// MATERYAL FİZİK MOTORU — DokunSay Dijital Materyallerin Etkileşim Fiziği
// Sürükleme, bırakma, manyetik snap, birleşme, bölünme
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef, useCallback, useEffect } from 'react';

// ── Fizik Sabitleri ─────────────────────────────────────────────────────────
export const FIZIK = {
  // Sürükleme
  DRAG_SCALE: 1.05,           // Kaldırıldığında %105 büyüme
  DRAG_SHADOW_OFFSET: 8,      // Gölge mesafesi (px)
  DRAG_SHADOW_BLUR: 16,       // Gölge blur (px)
  DRAG_THRESHOLD: 5,          // Sürükleme başlama eşiği (px)

  // Bırakma
  DROP_SETTLE_MS: 150,        // Oturma animasyonu süresi
  DROP_SETTLE_EASING: 'ease-out',
  DROP_BOUNCE_MS: 300,        // Geçersiz hedef bounce süresi
  DROP_BOUNCE_EASING: 'ease-in-out',

  // Manyetik snap
  SNAP_DISTANCE: 20,          // Manyetik çekim mesafesi (px)
  SNAP_STRENGTH: 0.6,         // Çekim güç katsayısı (0-1)
  SNAP_SETTLE_MS: 120,        // Snap oturma süresi

  // Birleşme
  MERGE_VIBRATE_MS: 50,       // Birleşme öncesi titreşim
  MERGE_GLOW_MS: 200,         // Parlama efekti süresi
  MERGE_ANIM_MS: 400,         // Birleşme animasyonu süresi

  // Bölünme
  SPLIT_LONG_PRESS_MS: 500,   // Uzun basış süresi
  SPLIT_CRACK_MS: 200,        // Çatlak animasyonu
  SPLIT_SEPARATE_MS: 300,     // Ayrılma animasyonu

  // Yıldız taşı sayma
  CHIP_BOUNCE_SCALE: 1.15,    // Yıldız taşı dokunma büyümesi (%115)
  CHIP_BOUNCE_MS: 200,        // Yıldız taşı zıplama süresi
  CHIP_COUNTED_OPACITY: 0.7,  // "Sayıldı" opaklık

  // Squash/stretch (oturma)
  SQUASH_X: 1.1,              // Yatay sıkışma
  SQUASH_Y: 0.9,              // Dikey sıkışma
  SQUASH_MS: 150,             // Sıkışma süresi
};

// ── Yardımcı: İki nokta arası mesafe ────────────────────────────────────────
const distance = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

// ── Yardımcı: Dikdörtgen çarpışma tespiti ───────────────────────────────────
const rectsOverlap = (a, b) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK: useDokunSayDrag — Temel sürükle-bırak fiziği
// ═══════════════════════════════════════════════════════════════════════════════
export function useDokunSayDrag({
  onDragStart,
  onDragMove,
  onDragEnd,
  onDrop,
  snapZones = [],       // [{ id, rect: {x,y,w,h}, data }]
  enabled = true,
  bounds = null,         // { left, top, right, bottom } sınırları
} = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [snappedTo, setSnappedTo] = useState(null);
  const [dragPhase, setDragPhase] = useState('idle'); // idle | lifting | dragging | settling | bouncing

  const originRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const elementRef = useRef(null);
  const dragStartedRef = useRef(false);

  const handlePointerDown = useCallback((e) => {
    if (!enabled) return;
    e.preventDefault();
    e.stopPropagation();

    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);

    const rect = el.getBoundingClientRect();
    originRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    startPosRef.current = { x: e.clientX, y: e.clientY };
    elementRef.current = el;
    dragStartedRef.current = false;
  }, [enabled]);

  const handlePointerMove = useCallback((e) => {
    if (!elementRef.current) return;
    e.preventDefault();

    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;

    // Eşik kontrolü
    if (!dragStartedRef.current) {
      if (Math.abs(dx) < FIZIK.DRAG_THRESHOLD && Math.abs(dy) < FIZIK.DRAG_THRESHOLD) return;
      dragStartedRef.current = true;
      setIsDragging(true);
      setDragPhase('lifting');
      onDragStart?.({ x: originRef.current.x + dx, y: originRef.current.y + dy });
      // Kaldırma fazı → sürükleme fazına geçiş
      requestAnimationFrame(() => setDragPhase('dragging'));
    }

    let newX = dx;
    let newY = dy;

    // Sınır kontrolü
    if (bounds) {
      const el = elementRef.current;
      const rect = el.getBoundingClientRect();
      const elW = rect.width;
      const elH = rect.height;
      const cx = originRef.current.x + newX;
      const cy = originRef.current.y + newY;
      if (cx - elW / 2 < bounds.left) newX = bounds.left + elW / 2 - originRef.current.x;
      if (cx + elW / 2 > bounds.right) newX = bounds.right - elW / 2 - originRef.current.x;
      if (cy - elH / 2 < bounds.top) newY = bounds.top + elH / 2 - originRef.current.y;
      if (cy + elH / 2 > bounds.bottom) newY = bounds.bottom - elH / 2 - originRef.current.y;
    }

    // Manyetik snap kontrolü
    let snapped = null;
    const currentCenter = {
      x: originRef.current.x + newX,
      y: originRef.current.y + newY,
    };

    for (const zone of snapZones) {
      const zoneCenter = {
        x: zone.rect.x + zone.rect.w / 2,
        y: zone.rect.y + zone.rect.h / 2,
      };
      const dist = distance(currentCenter, zoneCenter);
      if (dist < FIZIK.SNAP_DISTANCE) {
        // Manyetik çekim — hedefe doğru kayma
        const pull = FIZIK.SNAP_STRENGTH;
        newX += (zoneCenter.x - currentCenter.x) * pull;
        newY += (zoneCenter.y - currentCenter.y) * pull;
        snapped = zone;
        break;
      }
    }

    setSnappedTo(snapped);
    setPosition({ x: newX, y: newY });
    onDragMove?.({ x: newX, y: newY, snappedTo: snapped });
  }, [snapZones, bounds, onDragStart, onDragMove]);

  const handlePointerUp = useCallback((e) => {
    if (!elementRef.current) return;
    e.preventDefault();

    if (elementRef.current.hasPointerCapture?.(e.pointerId)) {
      elementRef.current.releasePointerCapture(e.pointerId);
    }

    if (!dragStartedRef.current) {
      elementRef.current = null;
      return;
    }

    // Bırakma — snap zone varsa otur, yoksa geri dön
    if (snappedTo) {
      setDragPhase('settling');
      const dropResult = onDrop?.({ zone: snappedTo, position });
      if (dropResult === false) {
        // Geçersiz bırakma → geri dön
        setDragPhase('bouncing');
        setPosition({ x: 0, y: 0 });
        setTimeout(() => {
          setIsDragging(false);
          setDragPhase('idle');
        }, FIZIK.DROP_BOUNCE_MS);
      } else {
        setTimeout(() => {
          setIsDragging(false);
          setDragPhase('idle');
        }, FIZIK.DROP_SETTLE_MS);
      }
    } else {
      // Hedef yok → bounce geri
      setDragPhase('bouncing');
      setPosition({ x: 0, y: 0 });
      setTimeout(() => {
        setIsDragging(false);
        setDragPhase('idle');
      }, FIZIK.DROP_BOUNCE_MS);
    }

    onDragEnd?.({ position, snappedTo });
    setSnappedTo(null);
    elementRef.current = null;
    dragStartedRef.current = false;
  }, [snappedTo, position, onDrop, onDragEnd]);

  // Sürükleme sırasında uygulanan stil
  const dragStyle = isDragging ? {
    transform: `translate(${position.x}px, ${position.y}px) scale(${
      dragPhase === 'lifting' || dragPhase === 'dragging' ? FIZIK.DRAG_SCALE : 1
    })`,
    transition: dragPhase === 'bouncing'
      ? `transform ${FIZIK.DROP_BOUNCE_MS}ms ${FIZIK.DROP_BOUNCE_EASING}`
      : dragPhase === 'settling'
        ? `transform ${FIZIK.DROP_SETTLE_MS}ms ${FIZIK.DROP_SETTLE_EASING}`
        : 'none',
    zIndex: 1000,
    cursor: 'grabbing',
    filter: `drop-shadow(0 ${FIZIK.DRAG_SHADOW_OFFSET}px ${FIZIK.DRAG_SHADOW_BLUR}px rgba(0,0,0,0.35))`,
  } : {
    cursor: enabled ? 'grab' : 'default',
    transition: `transform ${FIZIK.DROP_SETTLE_MS}ms ${FIZIK.DROP_SETTLE_EASING}`,
  };

  const bindDrag = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp,
    style: { touchAction: 'none', userSelect: 'none', ...dragStyle },
  };

  return {
    isDragging,
    position,
    snappedTo,
    dragPhase,
    dragStyle,
    bindDrag,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK: useSnapZone — Snap hedef alanı tanımlama
// ═══════════════════════════════════════════════════════════════════════════════
export function useSnapZone(id, data) {
  const ref = useRef(null);
  const [rect, setRect] = useState({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const updateRect = () => {
      const r = ref.current.getBoundingClientRect();
      setRect({ x: r.left, y: r.top, w: r.width, h: r.height });
    };
    updateRect();
    const observer = new ResizeObserver(updateRect);
    observer.observe(ref.current);
    window.addEventListener('scroll', updateRect);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateRect);
    };
  }, []);

  return { ref, zone: { id, rect, data } };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK: useLongPress — Uzun basış tespiti (bölünme için)
// ═══════════════════════════════════════════════════════════════════════════════
export function useLongPress(onLongPress, { delay = FIZIK.SPLIT_LONG_PRESS_MS, onPressStart, onPressEnd } = {}) {
  const timerRef = useRef(null);
  const isActiveRef = useRef(false);
  const targetRef = useRef(null);

  const start = useCallback((e) => {
    isActiveRef.current = true;
    targetRef.current = e.currentTarget;
    onPressStart?.(e);

    timerRef.current = setTimeout(() => {
      if (isActiveRef.current) {
        onLongPress?.(e, targetRef.current);
      }
    }, delay);
  }, [onLongPress, delay, onPressStart]);

  const cancel = useCallback((e) => {
    isActiveRef.current = false;
    clearTimeout(timerRef.current);
    onPressEnd?.(e);
  }, [onPressEnd]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return {
    onPointerDown: start,
    onPointerUp: cancel,
    onPointerCancel: cancel,
    onPointerLeave: cancel,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK: useMerge — İki materyalin birleşme tespiti
// ═══════════════════════════════════════════════════════════════════════════════
export function useMerge({ items, onMerge, mergeDistance = FIZIK.SNAP_DISTANCE }) {
  const checkMerge = useCallback((draggedId, draggedRect) => {
    for (const item of items) {
      if (item.id === draggedId) continue;
      const itemRect = item.rect;
      if (!itemRect) continue;

      // Uç uca yakınlık kontrolü (sağ kenar → sol kenar)
      const rightToLeft = Math.abs(draggedRect.right - itemRect.left);
      const leftToRight = Math.abs(draggedRect.left - itemRect.right);
      const verticalOverlap =
        draggedRect.top < itemRect.bottom && draggedRect.bottom > itemRect.top;

      if (verticalOverlap && (rightToLeft < mergeDistance || leftToRight < mergeDistance)) {
        return {
          target: item,
          side: rightToLeft < leftToRight ? 'right' : 'left',
        };
      }
    }
    return null;
  }, [items, mergeDistance]);

  const executeMerge = useCallback((sourceId, targetId) => {
    onMerge?.(sourceId, targetId);
  }, [onMerge]);

  return { checkMerge, executeMerge };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Animasyon Presetleri — CSS transition/animation değerleri
// ═══════════════════════════════════════════════════════════════════════════════
export const ANIM_PRESETS = {
  instant:  { duration: 100,  easing: 'ease-out' },
  fast:     { duration: 200,  easing: 'ease-out' },
  normal:   { duration: 300,  easing: 'ease-in-out' },
  smooth:   { duration: 500,  easing: 'ease-in-out' },
  slow:     { duration: 800,  easing: 'ease-in-out' },
  dramatic: { duration: 1000, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },

  snap:     { duration: 150,  easing: 'ease-out' },
  bounce:   { duration: 400,  easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  float:    { duration: 600,  easing: 'ease-in-out' },
  pulse:    { duration: 500,  easing: 'ease-in-out', iterations: 3 },

  stagger: 100, // ms aralık (sıralı animasyon)

  // Subitizing flash süreleri (LT düzeyine göre)
  flashDisplay: { L5: 3000, L6: 2000, L7: 1500, L8: 1000, L9: 750, L10: 500 },
};

// ── Yardımcı: Transition string oluştur ─────────────────────────────────────
export const makeTransition = (preset, properties = ['all']) =>
  properties.map(p => `${p} ${preset.duration}ms ${preset.easing}`).join(', ');

// ── Yardımcı: Squash-and-stretch "oturma" stili ────────────────────────────
export const squashStyle = (active) => active ? {
  transform: `scaleX(${FIZIK.SQUASH_X}) scaleY(${FIZIK.SQUASH_Y})`,
  transition: `transform ${FIZIK.SQUASH_MS}ms ease-out`,
} : {
  transform: 'scaleX(1) scaleY(1)',
  transition: `transform ${FIZIK.SQUASH_MS}ms ease-out`,
};

// ── Yardımcı: Vibration API (destekleyen cihazlarda) ───────────────────────
export const vibrate = (pattern = [FIZIK.MERGE_VIBRATE_MS]) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

// ── Yardımcı: Ses tetikleme placeholder ─────────────────────────────────────
// Bu fonksiyon AudioManager entegre edildiğinde güncellenecek
let _audioCallback = null;
export const setAudioCallback = (cb) => { _audioCallback = cb; };
export const playSound = (soundId, params) => {
  _audioCallback?.(soundId, params);
};
