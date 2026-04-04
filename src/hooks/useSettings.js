// GalakSay Pro — 2026-03-20 — Merkezi ayar yönetimi hook'u
// Tüm bileşenlerden tutarlı erişim, localStorage persistence, varsayılan değerler

import { useState, useCallback, useMemo } from 'react';

const PREFIX = 'galaksay_';

const DEFAULTS = {
  // Ses
  sound_master: true,
  sound_music: true,
  sound_effects: true,
  sound_voice: true,
  sound_count: true,

  // Oyun
  anim_speed: 'normal', // 'slow' | 'normal' | 'fast'
  auto_hint: true,
  vibration: true,
  session_reminder: true,
  notifications: true,

  // Erişilebilirlik
  large_text: false,
  high_contrast: false,
  reduced_motion: false,
  color_blind: 'off', // 'off' | 'protanopia' | 'deuteranopia' | 'tritanopia'
};

// Animasyon hızı çarpanları
const SPEED_MULTIPLIERS = { slow: 1.5, normal: 1, fast: 0.6 };

function readSetting(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeSetting(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {}
}

/**
 * useSettings — Merkezi ayar yönetimi.
 *
 * Kullanım:
 *   const { get, set, toggle, animSpeed, isReducedMotion, fontScale } = useSettings();
 *   const soundOn = get('sound_master');
 *   toggle('sound_master');
 */
export function useSettings() {
  // State — tüm ayarları tek state objesiyle tut
  const [settings, setSettings] = useState(() => {
    const initial = {};
    for (const [key, def] of Object.entries(DEFAULTS)) {
      initial[key] = readSetting(key, def);
    }
    return initial;
  });

  const get = useCallback((key) => {
    return settings[key] ?? DEFAULTS[key];
  }, [settings]);

  const set = useCallback((key, value) => {
    writeSetting(key, value);
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggle = useCallback((key) => {
    const newVal = !settings[key];
    writeSetting(key, newVal);
    setSettings(prev => ({ ...prev, [key]: newVal }));
    return newVal;
  }, [settings]);

  // Türetilmiş değerler
  const derived = useMemo(() => ({
    // Animasyon hız çarpanı
    animSpeedMultiplier: SPEED_MULTIPLIERS[settings.anim_speed] || 1,
    // Font ölçeği
    fontScale: settings.large_text ? 1.3 : 1,
    // Reduced motion — hem ayar hem sistem tercihi
    isReducedMotion: settings.reduced_motion || (
      typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    ),
    // Ses kullanılabilir mi
    canPlaySound: settings.sound_master,
    canPlayMusic: settings.sound_master && settings.sound_music,
    canPlayEffects: settings.sound_master && settings.sound_effects,
    canPlayVoice: settings.sound_master && settings.sound_voice,
    canPlayCounting: settings.sound_master && settings.sound_count,
  }), [settings]);

  return {
    get,
    set,
    toggle,
    settings,
    ...derived,
  };
}

// Tek seferlik okuma için — hook dışında kullanılabilir
export function getSettingValue(key) {
  return readSetting(key, DEFAULTS[key]);
}

export { DEFAULTS as SETTING_DEFAULTS };
