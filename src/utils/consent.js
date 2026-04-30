// @ts-check
// GalakSay Pro — KVKK rıza durumu için hafif depolama yardımcısı.

/** @typedef {import('../types').Consent} Consent */
// ConsentScreen.jsx (lazy yüklenir) bunu içeri import eder; main.jsx ve Settings.jsx ise
// ekran kodunu çekmeden ufak helper'ı doğrudan kullanır → split chunk korunur.

export const CONSENT_KEY = 'galaksay_consent_v1';

/** @returns {Consent|null} */
export function loadConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** @param {Partial<Consent>} consent */
export function saveConsent(consent) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      ...consent,
      grantedAt: new Date().toISOString(),
      version: 1,
    }));
  } catch {}
}
