// GalakSay lisans kapısı — ortak yardımcılar (Cloudflare Pages Functions).
//
// Lisans iki yoldan gelir; ikisi de NuMap'te doğrulanır, GalakSay kendi sırrını tutmaz:
//   (a) NuMap hesabı (bireysel ya da kurum üyesi) — yetkilerde "galaksay" olmalı.
//       Çerez: gs_lis = "n.<NuMap oturum belirteci>"  → GET /auth/me ile doğrulanır.
//   (b) Aile daveti (kurum ya da öğretmen lisansı altında) — çerez: gs_lis = "a.<davet>"
//       → POST /family-invites/verify ile doğrulanır.
//   (c) Deneme (10 Eki 2026) — hesapsız, cihaz başına bir kez, DENEME_GUN gün (varsayılan 7).
//       Çerez: gs_lis = "d.<bitiş ms>[.<imza>]"; NuMap'e gitmez. Ortamda DENEME_SIRRI tanımlıysa bitiş
//       HMAC-SHA256 ile imzalanır ve imzasız/bozuk çerez reddedilir; tanımlı değilse imzasızdır (yumuşak
//       kapı: oyun varlıkları zaten herkese açıktır, kapı yalnız sayfayı korur). İkinci denemeyi
//       gs_deneme izi (HttpOnly, 400 gün) engeller; çerezleri silen cihaz yeniden deneyebilir.
// Çerez HttpOnly + Secure + SameSite=Lax; sayfa betikleri okuyamaz. Doğrulama sonucu kısa süre
// önbelleğe alınır (NuMap 10 dk, aile 60 dk); iptal edilen lisans en geç bu sürede düşer.
// NuMap'e ulaşılamazsa (ağ hatası ya da 5xx) mevcut çerez geçici olarak kabul edilir: okulda
// sunucu kesintisi dersi durdurmaz. Diğer her yanıt (401, 403, 404, 405 …) kesin rettir; çerez silinir.

import { KAPI_ACIK } from './_ayar.js';

export const COOKIE = 'gs_lis';
export const HANDOFF = 'gs_devir';
export const DENEME_IZ = 'gs_deneme';
const DAY = 86400;

/** Deneme süresi (gün): ortamda DENEME_GUN (1–30), yoksa 7. */
export function denemeGun(env) {
  const v = Number(env && env.DENEME_GUN);
  return Number.isInteger(v) && v >= 1 && v <= 30 ? v : 7;
}

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Yeni deneme çerezinin değeri ve bitişi. */
export async function denemeDegeri(env, simdi = Date.now()) {
  const bitis = simdi + denemeGun(env) * DAY * 1000;
  const sir = env && env.DENEME_SIRRI;
  return { deger: sir ? `d.${bitis}.${await hmac(sir, `d.${bitis}`)}` : `d.${bitis}`, bitis };
}

/** Deneme çerezini denetler: { ok, kind:'deneme', bilgi } ya da { ok:false, kesin:true, neden:'deneme' }. */
async function denemeDurumu(env, value, simdi = Date.now()) {
  const m = /^d\.(\d{13})(?:\.([A-Za-z0-9_-]{43}))?$/.exec(value);
  const red = { ok: false, kesin: true, neden: 'deneme' };
  if (!m) return red;
  const sir = env && env.DENEME_SIRRI;
  if (sir) {
    if (!m[2]) return red;
    const beklenen = await hmac(sir, `d.${m[1]}`);
    if (beklenen.length !== m[2].length) return red;
    let fark = 0;
    for (let i = 0; i < beklenen.length; i += 1) fark |= beklenen.charCodeAt(i) ^ m[2].charCodeAt(i);
    if (fark) return red;
  }
  const bitis = Number(m[1]);
  // Süresi dolmuş ya da izin verilenden uzun (elle uzatılmış) deneme reddedilir.
  if (bitis <= simdi || bitis > simdi + (denemeGun(env) * DAY + 3600) * 1000) return red;
  return { ok: true, kind: 'deneme', bilgi: { bitis: new Date(bitis).toISOString() } };
}

export function numapApi(env) {
  return String((env && env.NUMAP_API) || 'https://getnumap.com/api').replace(/\/+$/, '');
}

export function kapiAcik(env) {
  const v = env && env.LISANS_KAPISI;
  if (v === 'acik') return true;
  if (v === 'kapali') return false;
  return KAPI_ACIK === true;
}

export function readCookie(request, name) {
  const raw = request.headers.get('Cookie') || '';
  for (const part of raw.split(/;\s*/)) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return null;
}

export function setCookie(name, value, { maxAge, httpOnly = true, path = '/' } = {}) {
  return `${name}=${encodeURIComponent(value)}; Path=${path}; Max-Age=${Math.max(0, Math.floor(maxAge))}; Secure; SameSite=Lax${httpOnly ? '; HttpOnly' : ''}`;
}

export function clearCookie(name, path = '/') {
  return `${name}=; Path=${path}; Max-Age=0; Secure; SameSite=Lax; HttpOnly`;
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });
}

/** Çerez taşıyan POST'larda aynı köken zorunlu (SameSite=Lax'a ek koruma). */
export function sameOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return true; // form olmayan aynı-köken istekler bazı tarayıcılarda Origin göndermez
  try { return new URL(origin).host === new URL(request.url).host; } catch { return false; }
}

async function sha256(s) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function fetchNumap(env, path, init, request) {
  // Aile daveti doğrulamasında NuMap'in hatalı deneme sınırı gerçek istemciye uygulansın diye
  // tarayıcının adresi iletilir (davetler 256 bit; başlığı değiştirmek tahmine olanak vermez).
  const ip = request && request.headers.get('cf-connecting-ip');
  try {
    const res = await fetch(numapApi(env) + path, { ...init, headers: { 'content-type': 'application/json', ...(ip ? { 'X-Istemci-IP': ip } : {}), ...(init && init.headers) } });
    let body = null;
    try { body = await res.json(); } catch { /* gövdesiz */ }
    return { status: res.status, body };
  } catch {
    return { status: 0, body: null };
  }
}

export function hasGalaksay(body) {
  return !!(body && Array.isArray(body.entitlements) && body.entitlements.includes('galaksay'));
}

/**
 * Çerezi doğrular. Döner: { ok, kind, gecici?, bilgi? } ya da { ok:false, kesin:true } (çerez silinmeli).
 */
export async function lisansDurumu(env, value, request) {
  if (value && value.startsWith('d.')) return denemeDurumu(env, value);
  if (!value || (value[0] !== 'n' && value[0] !== 'a') || value[1] !== '.') return { ok: false, kesin: true };
  const kind = value[0] === 'n' ? 'numap' : 'aile';
  const secret = value.slice(2);
  const cache = typeof caches !== 'undefined' ? caches.default : null;
  const key = cache ? new Request(`https://lisans-onbellek.galaksay.com/v/${await sha256(value)}`) : null;
  if (cache) {
    try {
      const hit = await cache.match(key);
      if (hit) return await hit.json();
    } catch { /* önbellek yok */ }
  }
  let sonuc;
  if (kind === 'numap') {
    const r = await fetchNumap(env, '/auth/me', { method: 'GET', headers: { Authorization: `Bearer ${secret}` } });
    if (r.status === 200) sonuc = hasGalaksay(r.body)
      ? { ok: true, kind, bilgi: { ad: r.body.user && r.body.user.name, plan: r.body.plan || null } }
      : { ok: false, kesin: true, neden: 'lisans' };
    else if (r.status === 0 || r.status >= 500) return { ok: true, kind, gecici: true };
    else sonuc = { ok: false, kesin: true };
  } else {
    const r = await fetchNumap(env, '/family-invites/verify', { method: 'POST', body: JSON.stringify({ token: secret }) }, request);
    if (r.status === 200 && r.body && r.body.ok) sonuc = { ok: true, kind, bilgi: { etiket: r.body.label, ogretmen: r.body.teacherName, kurum: r.body.institutionName, bitis: r.body.expiresAt } };
    else if (r.status === 0 || r.status >= 500) return { ok: true, kind, gecici: true };
    // 429: bu istemci çok hatalı deneme yaptı; erişim yok ama geçerli davet çerezi silinmez.
    else if (r.status === 429) return { ok: false, kesin: false };
    else sonuc = { ok: false, kesin: true };
  }
  if (cache && sonuc.ok) {
    try {
      await cache.put(key, new Response(JSON.stringify(sonuc), { headers: { 'cache-control': `max-age=${kind === 'numap' ? 600 : 3600}` } }));
    } catch { /* önbellek yok */ }
  }
  return sonuc;
}

/** NuMap girişi ya da SSO yanıtından çerez başlıkları: lisans + uygulamaya devir (60 sn, okunur). */
export function girisCerezleri(body) {
  const devir = btoa(unescape(encodeURIComponent(JSON.stringify({
    token: body.token, user: body.user || null, plan: body.plan ?? null, entitlements: body.entitlements ?? null,
    assessmentRemaining: body.assessmentRemaining ?? null,
  })))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return [
    setCookie(COOKIE, `n.${body.token}`, { maxAge: 30 * DAY }),
    setCookie(HANDOFF, devir, { maxAge: 60, httpOnly: false, path: '/oyna' }),
  ];
}

export { fetchNumap, DAY };
