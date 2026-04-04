// GalakSay Pro — 2026-03-19 — Erişilebilirlik React hook'u (colorBlind body class eklendi)
// Tüm erişilebilirlik ayarlarını merkezi olarak yönetir
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getTextScale, getTouchScale, prefersReducedMotion } from '../systems/accessibility.js';

const STORAGE_PREFIX = 'galaksay_';
const KEYS = {
  largeText: 'large_text',
  highContrast: 'high_contrast',
  reducedMotion: 'reduced_motion',
  colorBlind: 'color_blind',
  calmMode: 'calm_mode',
};

function loadSetting(key, defaultValue) {
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + key);
    if (stored === null) return defaultValue;
    return JSON.parse(stored);
  } catch {
    return defaultValue;
  }
}

function saveSetting(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {}
}

/**
 * Erişilebilirlik ayarlarını yönetir.
 * Kullanıcı + sistem tercihleri birleştirilir.
 *
 * Döndürülen değerler:
 * - settings: Güncel ayar durumları
 * - textScale: Font ölçekleme çarpanı (1.0 veya 1.3)
 * - touchScale: Dokunma hedefi ölçekleme (1.0 veya 1.2)
 * - shouldReduceMotion: Animasyon azaltma aktif mi?
 * - setSetting(key, value): Ayar güncelle
 * - getAnimDuration(baseDur): Azaltılmış harekete göre süre hesapla
 */
export function useAccessibility() {
  const [settings, setSettings] = useState(() => ({
    largeText: loadSetting(KEYS.largeText, false),
    highContrast: loadSetting(KEYS.highContrast, false),
    reducedMotion: loadSetting(KEYS.reducedMotion, false),
    colorBlind: loadSetting(KEYS.colorBlind, 'off'),
    calmMode: loadSetting(KEYS.calmMode, false),
  }));

  // Sistem prefers-reduced-motion takibi
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    setSystemReducedMotion(mq.matches);
    const handler = (e) => setSystemReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const setSetting = useCallback((key, value) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      saveSetting(KEYS[key] || key, value);
      return next;
    });
  }, []);

  const shouldReduceMotion = settings.reducedMotion || systemReducedMotion || settings.calmMode;
  const textScale = getTextScale(settings.largeText);
  const touchScale = getTouchScale(settings.largeText);

  // Animasyon süre hesaplama — azaltılmış harekette kısaltır veya sıfırlar
  const getAnimDuration = useCallback((baseDuration) => {
    if (shouldReduceMotion) return Math.min(baseDuration * 0.3, 150);
    return baseDuration;
  }, [shouldReduceMotion]);

  // CSS custom property'leri güncelle (global erişim için)
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--galaksay-text-scale', textScale);
    root.style.setProperty('--galaksay-touch-scale', touchScale);
    root.style.setProperty('--galaksay-anim-mult', shouldReduceMotion ? '0' : '1');

    // Büyük metin modu — body'ye class ekle
    document.body.classList.toggle('galaksay-large-text', settings.largeText);
    document.body.classList.toggle('galaksay-high-contrast', settings.highContrast);
    document.body.classList.toggle('galaksay-reduced-motion', shouldReduceMotion);

    // Renk körlüğü modu — eski sınıfları kaldır, aktifi ekle
    ['protanopia', 'deuteranopia', 'tritanopia'].forEach(mode => {
      document.body.classList.toggle(`galaksay-colorblind-${mode}`, settings.colorBlind === mode);
    });
  }, [textScale, touchScale, shouldReduceMotion, settings.largeText, settings.highContrast, settings.colorBlind]);

  return useMemo(() => ({
    settings,
    textScale,
    touchScale,
    shouldReduceMotion,
    setSetting,
    getAnimDuration,
  }), [settings, textScale, touchScale, shouldReduceMotion, setSetting, getAnimDuration]);
}
