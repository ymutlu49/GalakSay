// GET /api/lisans/durum — kapı açık mı, bu cihazın lisansı ne? (giriş ve aile sayfaları, uygulama)

import { json, kapiAcik, readCookie, lisansDurumu, clearCookie, COOKIE } from '../../_lisans.js';

export async function onRequestGet({ request, env }) {
  const kapi = kapiAcik(env);
  const deger = readCookie(request, COOKIE);
  if (!deger) return json({ kapi, lisans: null });
  const d = await lisansDurumu(env, deger, request);
  if (!d.ok) return json({ kapi, lisans: null }, 200, d.kesin ? { 'Set-Cookie': clearCookie(COOKIE) } : {});
  return json({ kapi, lisans: { tur: d.kind, gecici: !!d.gecici, ...(d.bilgi || {}) } });
}
