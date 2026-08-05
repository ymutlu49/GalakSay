// @ts-check
// GalakSay Pro — KVKK rıza durumu için hafif depolama yardımcısı.

/** @typedef {import('../types').Consent} Consent */
// main.jsx (rıza kaydını otomatik verir) ve Settings.jsx (anahtarlar) kullanır.
// (Ayrı rıza EKRANI 2026-06-11 ürün kararıyla kaldırıldı; dosyası 2026-08-05'te silindi.)

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

/** Merkezi senkron rızası açık mı? syncEngine bunu kontrol eder — rıza yoksa
 *  çocuk oyun verisi sunucuya ASLA gönderilmez (varsayılan kapalı). */
export function isDataSyncEnabled() {
  return loadConsent()?.dataSync === true;
}
