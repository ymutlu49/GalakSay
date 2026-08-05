// Galaksay — Numap backend API istemcisi (cross-origin: getnumap.com).
//
// Öğretmen girişi (token) + kendi değerlendirdiği çocukların oturumlarını okumak için.
// Token `Authorization: Bearer` header'ında taşınır ve localStorage'da saklanır.
// Cookie YOK (credentials: 'omit') → CSRF yüzeyi yok. Desen Numap'in
// src/lib/api.ts + src/app/auth-provider.tsx dosyalarından JS'e taşındı.

// Kök adres .env'den (VITE_NUMAP_API). Tanımsızsa üretim varsayılanı. Sondaki / temizlenir.
const BASE = (import.meta.env?.VITE_NUMAP_API || 'https://getnumap.com/api').replace(/\/+$/, '');

const TOKEN_KEY = 'numap_token'; // Numap ile aynı anahtar
const USER_KEY = 'numap_user'; // çevrimdışı soğuk-başlangıç önbelleği

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* depolama engelli */
  }
}
export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* depolama engelli */
  }
}

// Son DOĞRULANAN kullanıcıyı sakla → token var ama /auth/me'ye ulaşılamayınca
// (çevrimdışı soğuk-başlangıç) oturum bununla sürdürülür; online olunca tazelenir.
export function cacheUser(user) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* depolama engelli */
  }
}
export function readCachedUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function clearCachedUser() {
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    /* depolama engelli */
  }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(method, path, body) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'omit', // cross-origin; cookie gönderme (token header'da)
    headers: {
      ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* gövde yok */
  }
  if (!res.ok) {
    const msg =
      data && typeof data === 'object' && typeof data.error === 'string'
        ? data.error
        : `İstek başarısız (${res.status})`;
    throw new ApiError(msg, res.status);
  }
  return data;
}

// --- Kimlik (auth) ---

/** Başarılı giriş → token + kullanıcı önbelleğe alınır; kullanıcı döner. */
export async function login(email, password) {
  const r = await request('POST', '/auth/login', { email, password });
  setToken(r.token);
  const user = { ...r.user, assessmentRemaining: r.assessmentRemaining ?? null };
  cacheUser(user);
  return user;
}

/**
 * SSO bilet değişimi: NuMap'ten ?sso=<bilet> ile devredilen kısa-ömürlü bileti
 * NuMap'a doğrulatır; geçerliyse 30 günlük token + kullanıcı saklanır ve kullanıcı
 * döner. Böylece öğretmen Galaksay'da TEKRAR giriş yapmadan otomatik oturum açar.
 * Geçersiz/expired bilet → ApiError (401).
 */
export async function ssoExchange(ticket) {
  const r = await request('POST', '/auth/sso/exchange', { ticket });
  setToken(r.token);
  const user = { ...r.user, assessmentRemaining: r.assessmentRemaining ?? null };
  cacheUser(user);
  return user;
}

/** Mevcut token'ı doğrular; güncel kullanıcıyı döner ve önbelleği tazeler. 401 → ApiError. */
export async function me() {
  const r = await request('GET', '/auth/me');
  const user = { ...r.user, assessmentRemaining: r.assessmentRemaining ?? null };
  cacheUser(user);
  return user;
}

/** Sunucudaki token'ı iptal eder + yerel oturumu temizler (ağ hatası olsa da temizler). */
export async function logout() {
  try {
    await request('POST', '/auth/logout');
  } catch {
    /* yine de yerel oturumu temizle */
  }
  clearToken();
  clearCachedUser();
  // Paylaşılan okul cihazı (KVKK): çıkışta öğretmenin öğrenci listesi önbelleği de
  // silinir — tarama özetleri (ad, sınıf, okul) sonraki kullanıcıya kalmasın.
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('numap_children_cache_')) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* depolama engelli */
  }
}

// --- Oturumlar (öğretmenin değerlendirdiği çocuklar) ---

/** practitioner rolünde sunucu otomatik `owner_id = bu kullanıcı` filtreler. */
export async function getSessions() {
  const r = await request('GET', '/sessions');
  return Array.isArray(r?.sessions) ? r.sessions : [];
}

/** Tek oturumun tam payload'ı (student + results). */
export async function getSession(id) {
  const r = await request('GET', `/sessions/${encodeURIComponent(id)}`);
  return r?.session ?? null;
}

// --- Merkezi havuz (oyun ilerlemesi senkronu) ---

/** Oyun ilerleme batch'ini merkezi havuza yazar (idempotent upsert). {accepted} döner. */
export async function postGameProgress(batch) {
  const r = await request('POST', '/game-progress', batch);
  return r?.accepted ?? null;
}

export default {
  login,
  ssoExchange,
  me,
  logout,
  getSessions,
  getSession,
  postGameProgress,
  getToken,
  setToken,
  clearToken,
  cacheUser,
  readCachedUser,
  clearCachedUser,
  ApiError,
};
