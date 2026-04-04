// GalakSay Pro — 2026-03-18 — Otomatik kaydetme hook'u
// Her soru sonrası ilerlemeyi kaydeder, kaldığı yerden devam et desteği
import { useCallback, useEffect, useRef } from 'react';

const STORAGE_KEY = 'galaksay_session_progress';

/**
 * Otomatik kaydetme hook'u.
 *
 * Kullanım:
 *   const { saveProgress, loadProgress, clearProgress, hasResumableSession } = useAutoSave();
 *
 * saveProgress({
 *   screen: 'game',
 *   category: 'counting',
 *   mode: 'forwardCount',
 *   level: 3,
 *   currentQuestion: 7,
 *   totalQuestions: 10,
 *   score: 85,
 *   ltLevel: 8,
 *   timestamp: Date.now(),
 * });
 */
export function useAutoSave() {
  const debounceRef = useRef(null);

  // İlerlemeyi kaydet — debounced (100ms)
  const saveProgress = useCallback((data) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        const payload = {
          ...data,
          timestamp: Date.now(),
          version: '5.9.0',
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {}
    }, 100);
  }, []);

  // Kaydedilmiş ilerlemeyi yükle
  const loadProgress = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // 24 saatten eski oturumları geçersiz say
      if (Date.now() - (parsed.timestamp || 0) > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }, []);

  // Kayıtlı ilerlemeyi temizle
  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  // Devam edilebilir oturum var mı?
  const hasResumableSession = useCallback(() => {
    return loadProgress() !== null;
  }, [loadProgress]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    saveProgress,
    loadProgress,
    clearProgress,
    hasResumableSession,
  };
}

/**
 * Oturum devam bildirim bileşeni.
 * Ana menüde "Son kaldığın yer: ..." mesajı göstermek için kullanılır.
 *
 * Kullanım:
 *   <ResumePrompt onResume={handleResume} onDismiss={handleDismiss} />
 */
export function getResumeInfo() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (Date.now() - (parsed.timestamp || 0) > 24 * 60 * 60 * 1000) return null;
    return {
      category: parsed.category || 'Bilinmiyor',
      mode: parsed.mode || '',
      currentQuestion: parsed.currentQuestion || 0,
      totalQuestions: parsed.totalQuestions || 0,
      timestamp: parsed.timestamp,
    };
  } catch {
    return null;
  }
}
