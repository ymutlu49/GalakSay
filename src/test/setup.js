// Vitest global setup — jest-dom matchers + Web Crypto polyfill + localStorage shim.
import '@testing-library/jest-dom/vitest';

// crypto.subtle Node 20+ globalThis.crypto altında.
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = require('node:crypto').webcrypto;
}

// jsdom'un localStorage'ı bazı sürümlerde Storage prototipinin tüm metotlarını
// (clear/getItem/...) sunmuyor. Tutarlı bir in-memory shim yerleştir.
function makeMemoryStorage() {
  let store = new Map();
  return {
    get length() { return store.size; },
    key(i) { return Array.from(store.keys())[i] ?? null; },
    getItem(k) { return store.has(k) ? store.get(k) : null; },
    setItem(k, v) { store.set(String(k), String(v)); },
    removeItem(k) { store.delete(k); },
    clear() { store = new Map(); },
  };
}

if (!globalThis.localStorage || typeof globalThis.localStorage.clear !== 'function') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: makeMemoryStorage(), writable: true, configurable: true,
  });
}
if (!globalThis.sessionStorage || typeof globalThis.sessionStorage.clear !== 'function') {
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: makeMemoryStorage(), writable: true, configurable: true,
  });
}
