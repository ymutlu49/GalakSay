// @ts-check
// GalakSay Pro — KVKK md.11 (taşınabilirlik + silme hakkı) için veri yönetimi.

/**
 * @typedef {Object} ExportPayload
 * @property {'galaksay-export-v1'} schema
 * @property {string} exportedAt
 * @property {string} note
 * @property {Record<string, unknown>} localStorage
 * @property {Record<string, unknown>} indexedDB
 */

/**
 * @typedef {Object} EraseResult
 * @property {string[]} removedKeys
 * @property {boolean} dbDeleted
 */
// - exportAllData: tüm yerel veriyi tek JSON dosyasına döker (indir).
// - eraseAllData: localStorage'taki galaksay_* anahtarlarını + IndexedDB veritabanını siler.
// IndexedDB silme işlemi tarayıcılar arası farklı davranabildiği için sonuç kontrol edilir.

import { STORES, openDB, getAllFromStore } from '../analytics/database.js';
import { decryptJSON } from './crypto.js';

const DB_NAME = 'galaksay_analytics';
// 2026-04-30 KVKK düzeltmesi: NuMap verileri (numap_intervention_*, numap_progress_*)
// bu prefix dışında tutuluyordu — "tüm veriyi sil" çağrıldığında geride kalıyorlardı.
// Artık iki prefix de tarama+silme kapsamında.
const LS_PREFIXES = ['galaksay_', 'numap_'];
// Geriye uyumluluk için tek prefix değişkeni de korundu (yeni kodda LS_PREFIXES kullanın)
const LS_PREFIX = 'galaksay_';
const _hasManagedPrefix = (k) => !!k && LS_PREFIXES.some(p => k.startsWith(p));

async function readLocalStorage() {
  const out = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!_hasManagedPrefix(key)) continue;
      const raw = localStorage.getItem(key);
      // Şifreli ise çöz (taşınabilirlik metnini düz olarak ver — kullanıcı kendi verisidir)
      if (raw && raw.startsWith('enc1:')) {
        out[key] = await decryptJSON(raw);
      } else {
        try { out[key] = JSON.parse(raw); } catch { out[key] = raw; }
      }
    }
  } catch (err) {
    console.error('[GalakSay] localStorage okuma hatası:', err);
  }
  return out;
}

async function readIndexedDB() {
  const out = {};
  try {
    await openDB();
    for (const storeName of Object.values(STORES)) {
      try {
        out[storeName] = await getAllFromStore(storeName);
      } catch {
        out[storeName] = [];
      }
    }
  } catch (err) {
    console.error('[GalakSay] IndexedDB okuma hatası:', err);
  }
  return out;
}

/** @returns {Promise<ExportPayload>} */
export async function buildExportPayload() {
  const [ls, idb] = await Promise.all([readLocalStorage(), readIndexedDB()]);
  return {
    schema: 'galaksay-export-v1',
    exportedAt: new Date().toISOString(),
    note: 'Bu dosya cihazda yerel olarak saklanan tüm GalakSay verisini içerir. KVKK md.11 kapsamında taşınabilirlik hakkınızdır.',
    localStorage: ls,
    indexedDB: idb,
  };
}

function triggerDownload(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Tüm yerel veriyi JSON olarak indirir. @returns {Promise<ExportPayload>} */
export async function exportAllData() {
  const payload = await buildExportPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const stamp = new Date().toISOString().slice(0, 10);
  triggerDownload(`galaksay-veri-${stamp}.json`, blob);
  return payload;
}

function deleteIndexedDB() {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
      req.onblocked = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

function clearLocalStorageGalaksayKeys() {
  const removed = [];
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (_hasManagedPrefix(k)) keys.push(k);
    }
    for (const k of keys) {
      localStorage.removeItem(k);
      removed.push(k);
    }
  } catch (err) {
    console.error('[GalakSay] localStorage temizleme hatası:', err);
  }
  return removed;
}

function clearSessionStorageGalaksayKeys() {
  try {
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (_hasManagedPrefix(k)) keys.push(k);
    }
    for (const k of keys) sessionStorage.removeItem(k);
  } catch {}
}

// 2026-04-30: Tek bir NuMap müdahale planını + ilerleme verisini sil (KVKK md.7)
// childCode verilirse sadece o çocuğun verisi; verilmezse tüm numap_* anahtarları silinir.
/** @param {string} [childCode] @returns {string[]} Silinen anahtarların listesi */
export function eraseNumapData(childCode) {
  const removed = [];
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith('numap_')) continue;
      if (childCode && !k.endsWith('_' + childCode)) continue;
      keys.push(k);
    }
    for (const k of keys) {
      localStorage.removeItem(k);
      removed.push(k);
    }
  } catch (err) {
    console.error('[GalakSay] NuMap silme hatası:', err);
  }
  return removed;
}

/** Tüm GalakSay yerel verisini siler (KVKK md.11). @returns {Promise<EraseResult>} */
export async function eraseAllData() {
  const removedKeys = clearLocalStorageGalaksayKeys();
  clearSessionStorageGalaksayKeys();
  const dbDeleted = await deleteIndexedDB();
  return { removedKeys, dbDeleted };
}
