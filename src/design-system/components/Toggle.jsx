// GalakSay Pro — 2026-03-20 — Merkezi toggle/switch bileşeni (ses + haptic entegrasyonu)
import React, { useCallback } from 'react';
import { colors } from '../colors.js';
import { typography } from '../typography.js';

// Lazy ses import — ilk kullanımda yükle
let _audioModules = null;
const getAudio = () => {
  if (!_audioModules) {
    _audioModules = import('../../audio/sfx.js').then(sfxMod =>
      import('../../audio/AudioManager.js').then(mgrMod => ({
        sfx: sfxMod.SFX,
        mgr: mgrMod.AudioManager,
      }))
    ).catch(() => null);
  }
  return _audioModules;
};

export function Toggle({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'md',
  playSound = true,
}) {
  const sizes = {
    sm: { w: 40, h: 22, dot: 16, travel: 18 },
    md: { w: 52, h: 28, dot: 22, travel: 24 },
    lg: { w: 64, h: 34, dot: 28, travel: 30 },
  };
  const s = sizes[size] || sizes.md;

  const handleToggle = useCallback(() => {
    if (disabled) return;
    const newVal = !checked;
    onChange?.(newVal);

    // Ses efekti (async — UI'ı bloklamaz)
    if (playSound) {
      getAudio().then(audio => {
        if (audio?.mgr?.canPlay('effects') && audio.sfx) {
          newVal ? audio.sfx.toggleOn?.() : audio.sfx.toggleOff?.();
        }
      }).catch(() => {});
    }

    // Haptic feedback
    try { navigator.vibrate?.(10); } catch {}
  }, [checked, disabled, onChange, playSound]);

  return (
    <label style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1,
    }}>
      <div
        role="switch"
        aria-checked={checked}
        aria-label={label}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(); } }}
        style={{
          width: s.w,
          height: s.h,
          borderRadius: s.h,
          background: checked ? colors.accent.primary : colors.surface.input,
          border: `1px solid ${checked ? colors.accent.primary : 'rgba(148,163,184,.2)'}`,
          position: 'relative',
          transition: 'all 200ms ease-in-out',
          flexShrink: 0,
        }}
      >
        <div style={{
          width: s.dot,
          height: s.dot,
          borderRadius: '50%',
          background: '#fff',
          position: 'absolute',
          top: (s.h - s.dot) / 2 - 1,
          left: checked ? s.travel : 3,
          transition: 'left 200ms ease-in-out',
          boxShadow: '0 1px 3px rgba(0,0,0,.3)',
        }} />
      </div>
      {label && (
        <span style={{
          color: colors.text.primary,
          fontSize: 16,
          fontWeight: 600,
          fontFamily: typography.fontFamily.display,
        }}>
          {label}
        </span>
      )}
    </label>
  );
}
