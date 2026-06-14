// @ts-check
// GalakSay Pro — KVKK uyumu için Web Crypto API tabanlı yerel şifreleme yardımcısı.
// Hassas çocuk verisi (profil, ilerleme) localStorage'a yazılmadan önce AES-GCM ile şifrelenir.
//
// Anahtar, cihazda PBKDF2 ile bir tuz + "device secret"tan türetilir; sunucuya hiç gitmez.
// v2 (2026-06): passphrase'e RASTGELE cihaz-sırrı (`galaksay_device_secret_v1`, 256-bit,
// kurulumda bir kez üretilir) eklendi → anahtar artık UA/dil/zaman-diliminden TÜRETİLEMEZ.
// Sızan bir şifreli blob (localStorage'sız) çevrimdışı kaba-kuvvetle çözülemez.
// Geriye uyumluluk: eski `enc1:` blob'lar (sırsız anahtar) hâlâ çözülür; yeni yazım `enc2:`.
//
// Bilinçli bir saldırgan cihaza fiziksel/XSS erişimle sırrı çıkarabilir; amaç bunu engellemek
// değil, "düz metin sızıntısı" sınıfındaki ihlalleri (yedek, paylaşım, log) ortadan kaldırmaktır.

const SALT_KEY = 'galaksay_crypto_salt_v1';
const DEVICE_SECRET_KEY = 'galaksay_device_secret_v1';
const PBKDF2_ITERATIONS = 100_000;
const HASH_ITERATIONS = 100_000; // PIN/şifre hash'i için (eski tek-geçiş SHA-256'nın yerine)
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const ENC_PREFIX_V1 = 'enc1:'; // eski (sırsız anahtar) — yalnız ÇÖZME için
const ENC_PREFIX_V2 = 'enc2:'; // yeni (cihaz-sırrı dahil) — yazım bunu kullanır

let _cachedKeyV1 = null;
let _cachedKeyV2 = null;

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

// Rastgele, kuruluma-özel 256-bit cihaz sırrı. Bir kez üretilir, localStorage'da kalır.
// Anahtarı tahmin-edilemez kılan asıl bileşen budur (UA/dil/tz yerine yüksek entropi).
function getOrCreateDeviceSecret() {
  try {
    let s = localStorage.getItem(DEVICE_SECRET_KEY);
    if (!s) {
      const buf = new Uint8Array(32);
      crypto.getRandomValues(buf);
      s = btoa(String.fromCharCode(...buf));
      localStorage.setItem(DEVICE_SECRET_KEY, s);
    }
    return s;
  } catch {
    return '';
  }
}

function getDevicePassphrase(withSecret) {
  // Cihaza bağlı parmak izi + (v2) rastgele cihaz sırrı.
  const ua = navigator.userAgent || '';
  const lang = navigator.language || '';
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const base = `galaksay::${ua}::${lang}::${tz}`;
  return withSecret ? `galaksay-v2::${getOrCreateDeviceSecret()}::${base}` : base;
}

// v=2 → cihaz-sırlı (güçlü) anahtar; v=1 → eski sırsız anahtar (yalnız eski blob çözme).
async function deriveKey(v) {
  if (v === 2 && _cachedKeyV2) return _cachedKeyV2;
  if (v === 1 && _cachedKeyV1) return _cachedKeyV1;
  if (!isCryptoAvailable()) return null;

  const enc = new TextEncoder();
  const salt = getOrCreateSalt();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(getDevicePassphrase(v === 2)),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
  if (v === 2) _cachedKeyV2 = key; else _cachedKeyV1 = key;
  return key;
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
 * Düz metni AES-GCM (cihaz-sırlı v2 anahtar) ile şifreler. Crypto API yoksa olduğu gibi döner.
 * @param {string|null|undefined} plaintext
 * @returns {Promise<string|null|undefined>}
 */
export async function encryptString(plaintext) {
  if (!isCryptoAvailable() || plaintext == null) return plaintext;
  try {
    const key = await deriveKey(2);
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
    return ENC_PREFIX_V2 + bytesToBase64(combined);
  } catch {
    return plaintext;
  }
}

/**
 * `enc2:` (v2) veya `enc1:` (eski) payload'u çözer; düz metin verilirse olduğu gibi döner.
 * Çözme başarısız olursa null döner.
 * @param {string|null|undefined} blob
 * @returns {Promise<string|null|undefined>}
 */
export async function decryptString(blob) {
  if (typeof blob !== 'string') return blob;
  const v = blob.startsWith(ENC_PREFIX_V2) ? 2 : blob.startsWith(ENC_PREFIX_V1) ? 1 : 0;
  if (v === 0) return blob; // düz metin geri uyumluluk
  if (!isCryptoAvailable()) return null;
  try {
    const key = await deriveKey(v);
    if (!key) return null;
    const prefixLen = (v === 2 ? ENC_PREFIX_V2 : ENC_PREFIX_V1).length;
    const combined = base64ToBytes(blob.slice(prefixLen));
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
    if (raw.startsWith(ENC_PREFIX_V2) || raw.startsWith(ENC_PREFIX_V1)) return decryptJSON(raw);
    // Geri uyumluluk: eski düz metin değer — okunur, sonraki yazımda şifrelenecek
    try { return JSON.parse(raw); } catch { return raw; }
  } catch {
    return null;
  }
}

// ── PIN / şifre hash'i ────────────────────────────────────────────────────────
// v2 (2026-06): PBKDF2 (100K iterasyon) + KAYIT-BAŞINA rastgele tuz. Eski tek-geçiş
// SHA-256 (ortak tuz) 4-haneli PIN'i milisaniyede kırılabilir kılıyordu; PBKDF2 her
// denemeyi pahalılaştırır ve kayıt-başına tuz ortak gökkuşağı tablosunu imkânsız kılar.
// Format: `pbkdf2:<tuz_b64>:<hash_b64>`. Geriye uyumluluk: eski `sha256:` ve `plain:` doğrulanır.

/**
 * Bir gizli (PIN/şifre) için PBKDF2 hash'i (kayıt-başına rastgele tuz).
 * @param {string} secret
 * @returns {Promise<string>}
 */
export async function hashPin(secret) {
  if (!isCryptoAvailable()) return `plain:${secret}`;
  try {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const baseKey = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(String(secret)), { name: 'PBKDF2' }, false, ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: HASH_ITERATIONS, hash: 'SHA-256' }, baseKey, 256
    );
    return `pbkdf2:${bytesToBase64(salt)}:${bytesToBase64(new Uint8Array(bits))}`;
  } catch {
    return `plain:${secret}`;
  }
}

// Eski (v1) tek-geçiş SHA-256 hash'i — yalnız eski `sha256:` kayıtları doğrulamak için.
async function legacyHashPin(secret) {
  const salt = getOrCreateSalt();
  const data = new TextEncoder().encode(`pin::${secret}`);
  const combined = new Uint8Array(salt.length + data.length);
  combined.set(salt, 0);
  combined.set(data, salt.length);
  const hash = await crypto.subtle.digest('SHA-256', combined);
  return 'sha256:' + bytesToBase64(new Uint8Array(hash));
}

/**
 * Gizliyi saklanan hash ile karşılaştırır. `pbkdf2:` (yeni), `sha256:` ve `plain:` (eski) destekli.
 * @param {string} secret
 * @param {string|null|undefined} storedHash
 * @returns {Promise<boolean>}
 */
export async function verifyPin(secret, storedHash) {
  if (!storedHash) return false;
  if (storedHash.startsWith('plain:')) return storedHash.slice(6) === String(secret);
  if (!isCryptoAvailable()) return false;
  try {
    if (storedHash.startsWith('pbkdf2:')) {
      const parts = storedHash.split(':');
      const salt = base64ToBytes(parts[1]);
      const baseKey = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(String(secret)), { name: 'PBKDF2' }, false, ['deriveBits']
      );
      const bits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: HASH_ITERATIONS, hash: 'SHA-256' }, baseKey, 256
      );
      return bytesToBase64(new Uint8Array(bits)) === parts[2];
    }
    if (storedHash.startsWith('sha256:')) {
      return (await legacyHashPin(String(secret))) === storedHash;
    }
  } catch {
    return false;
  }
  return false;
}

// Test ve debug için — anahtar önbelleğini temizler (örn. veri silme akışı sonrası).
export function _resetKeyCache() {
  _cachedKeyV1 = null;
  _cachedKeyV2 = null;
}
