// @ts-check
// GalakSay Pro — KVKK uyumu için Web Crypto API tabanlı yerel şifreleme yardımcısı.
// Hassas çocuk verisi (profil, ilerleme) localStorage'a yazılmadan önce AES-GCM ile şifrelenir.
// Anahtar, cihazda PBKDF2 ile bir tuz + sabit "device secret"tan türetilir; sunucuya hiç gitmez.
// Bilinçli bir saldırgan device'a fiziksel erişimle anahtarı çıkarabilir; amaç bunu engellemek değil,
// "düz metin sızıntısı" sınıfındaki ihlalleri (yedekleme, paylaşım, log) ortadan kaldırmaktır.

const SALT_KEY = 'galaksay_crypto_salt_v1';
const PBKDF2_ITERATIONS = 100_000;
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const ENC_PREFIX = 'enc1:'; // sürüm etiketi — gelecekte rotasyon kolaylığı için

let _cachedKey = null;

function isCryptoAvailable() {
  return typeof crypto !== 'undefined'
    && typeof crypto.subtle !== 'undefined'
    && typeof TextEncoder !== 'undefined';
}

function getOrCreateSalt() {
  try {
    let salt = localStorage.getItem(SALT_KEY);
    if (!salt) {
      const buf = new Uint8Array(16);
      crypto.getRandomValues(buf);
      salt = btoa(String.fromCharCode(...buf));
      localStorage.setItem(SALT_KEY, salt);
    }
    return Uint8Array.from(atob(salt), c => c.charCodeAt(0));
  } catch {
    return new Uint8Array(16);
  }
}

function getDevicePassphrase() {
  // Cihaza bağlı, deterministik ama saldırgan için "ulaşılabilir-ama-bilinçsiz"
  // ek bir engel — tarayıcı UA + dil + zaman dilimi karması.
  const ua = navigator.userAgent || '';
  const lang = navigator.language || '';
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  return `galaksay::${ua}::${lang}::${tz}`;
}

async function deriveKey() {
  if (_cachedKey) return _cachedKey;
  if (!isCryptoAvailable()) return null;

  const enc = new TextEncoder();
  const salt = getOrCreateSalt();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(getDevicePassphrase()),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  _cachedKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
  return _cachedKey;
}

function bytesToBase64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/**
 * Düz metni AES-GCM ile şifreler. Crypto API yoksa olduğu gibi geri döner.
 * @param {string|null|undefined} plaintext
 * @returns {Promise<string|null|undefined>}
 */
export async function encryptString(plaintext) {
  if (!isCryptoAvailable() || plaintext == null) return plaintext;
  try {
    const key = await deriveKey();
    if (!key) return plaintext;
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const ct = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(plaintext)
    );
    const combined = new Uint8Array(iv.length + ct.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ct), iv.length);
    return ENC_PREFIX + bytesToBase64(combined);
  } catch {
    return plaintext;
  }
}

/**
 * `enc1:` ön ekli şifreli payload'u çözer; düz metin verilirse olduğu gibi döner.
 * Çözme başarısız olursa null döner.
 * @param {string|null|undefined} blob
 * @returns {Promise<string|null|undefined>}
 */
export async function decryptString(blob) {
  if (typeof blob !== 'string') return blob;
  if (!blob.startsWith(ENC_PREFIX)) return blob; // düz metin geri uyumluluk
  if (!isCryptoAvailable()) return null;
  try {
    const key = await deriveKey();
    if (!key) return null;
    const combined = base64ToBytes(blob.slice(ENC_PREFIX.length));
    const iv = combined.slice(0, IV_LENGTH);
    const ct = combined.slice(IV_LENGTH);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
    return new TextDecoder().decode(pt);
  } catch {
    return null;
  }
}

/**
 * Bir JS değerini JSON.stringify edip şifreler.
 * @param {unknown} value
 * @returns {Promise<string|null|undefined>}
 */
export async function encryptJSON(value) {
  return encryptString(JSON.stringify(value));
}

/**
 * Şifreli/düz JSON payload'unu okuyup parse eder.
 * @param {string|null|undefined} blob
 * @returns {Promise<unknown>}
 */
export async function decryptJSON(blob) {
  const txt = await decryptString(blob);
  if (txt == null) return null;
  try { return JSON.parse(txt); } catch { return null; }
}

/**
 * localStorage'a şifreli olarak yazar.
 * @param {string} key
 * @param {unknown} value
 * @returns {Promise<boolean>}
 */
export async function setEncrypted(key, value) {
  try {
    const blob = await encryptJSON(value);
    localStorage.setItem(key, blob);
    return true;
  } catch {
    return false;
  }
}

/**
 * localStorage'tan şifreli (veya geri uyumlu düz) değeri okur.
 * @param {string} key
 * @returns {Promise<unknown>}
 */
export async function getEncrypted(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return null;
    if (raw.startsWith(ENC_PREFIX)) return decryptJSON(raw);
    // Geri uyumluluk: eski düz metin değer — okunur, sonraki yazımda şifrelenecek
    try { return JSON.parse(raw); } catch { return raw; }
  } catch {
    return null;
  }
}

/**
 * PIN için tek yönlü SHA-256 hash (cihaz salt'ı ile).
 * @param {string} pin
 * @returns {Promise<string>}
 */
export async function hashPin(pin) {
  if (!isCryptoAvailable()) return `plain:${pin}`;
  try {
    const salt = getOrCreateSalt();
    const data = new TextEncoder().encode(`pin::${pin}`);
    const combined = new Uint8Array(salt.length + data.length);
    combined.set(salt, 0);
    combined.set(data, salt.length);
    const hash = await crypto.subtle.digest('SHA-256', combined);
    return 'sha256:' + bytesToBase64(new Uint8Array(hash));
  } catch {
    return `plain:${pin}`;
  }
}

/**
 * PIN'i saklanan hash ile karşılaştırır. Eski `plain:` öneki için geri uyumludur.
 * @param {string} pin
 * @param {string|null|undefined} storedHash
 * @returns {Promise<boolean>}
 */
export async function verifyPin(pin, storedHash) {
  if (!storedHash) return false;
  if (storedHash.startsWith('plain:')) return storedHash.slice(6) === pin;
  const computed = await hashPin(pin);
  return computed === storedHash;
}

// Test ve debug için — anahtar önbelleğini temizler (örn. veri silme akışı sonrası).
export function _resetKeyCache() {
  _cachedKey = null;
}
