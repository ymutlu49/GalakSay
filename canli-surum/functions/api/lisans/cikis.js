// POST /api/lisans/cikis { tur? } — lisans çerezini siler.
// tur = "numap" verilirse yalnız NuMap kaynaklı çerez silinir (öğretmen uygulamada NuMap'ten çıkınca
// aile cihazının davet lisansı korunur). NuMap oturumu da sunucuda kapatılır.

import { json, sameOrigin, readCookie, clearCookie, fetchNumap, COOKIE } from '../../_lisans.js';

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error: 'Geçersiz istek.' }, 403);
  let body = {};
  try { body = await request.json(); } catch { /* boş */ }
  const deger = readCookie(request, COOKIE) || '';
  if (body.tur === 'numap' && !deger.startsWith('n.')) return json({ ok: true, silindi: false });
  if (deger.startsWith('n.')) {
    await fetchNumap(env, '/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${deger.slice(2)}` } });
  }
  return json({ ok: true, silindi: !!deger }, 200, { 'Set-Cookie': clearCookie(COOKIE) });
}
