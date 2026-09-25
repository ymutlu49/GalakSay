// @ts-check
// GalakSay Pro — Otomatik kaydetme hook'u (KVKK için şifreli saklama)
// Her soru sonrası ilerlemeyi cihazda AES-GCM ile şifreleyerek kaydeder.
import { useCallback, useEffect, useRef } from 'react';
import { APP_VERSION } from '../version.js';
import { encryptJSON, decryptJSON } from '../utils/crypto.js';

/** @typedef {import('../types').SessionProgress} SessionProgress */

const STORAGE_KEY = 'galaksay_session_progress';

/** @returns {Promise<SessionProgress|null>} */
function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    if (raw.startsWith('enc1:') || raw.startsWith('enc2:')) return decryptJSON(raw); // Promise döner (her iki sürüm)
    try { return JSON.parse(raw); } catch { return null; }
  } catch {
    return null;
  }
}

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

  /**
   * İlerlemeyi kaydet — debounced (100ms), AES-GCM ile şifreli.
   * @param {SessionProgress} data
   */
  const saveProgress = useCallback((data) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const payload = {
          ...data,
          timestamp: Date.now(),
          version: APP_VERSION,
        };
        const blob = await encryptJSON(payload);
        localStorage.setItem(STORAGE_KEY, blob);
      } catch {}
    }, 100);
  }, []);

  /** Kaydedilmiş ilerlemeyi yükle (async — şifreliyse çözer). @returns {Promise<SessionProgress|null>} */
  const loadProgress = useCallback(async () => {
    try {
      const parsed = await readStored();
      if (!parsed) return null;
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

  // Devam edilebilir oturum var mı? (async)
  const hasResumableSession = useCallback(async () => {
    return (await loadProgress()) !== null;
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
// async — şifreli ise crypto.subtle ile çözer
export async function getResumeInfo() {
  try {
    const parsed = await readStored();
    if (!parsed) return null;
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
