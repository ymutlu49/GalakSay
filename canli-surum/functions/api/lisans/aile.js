// POST /api/lisans/aile { token } — aile davet bağlantısını bu cihaza lisans olarak işler.
// Davet NuMap'te doğrulanır; çerez davetin süresi kadar (en çok 1 yıl) geçerlidir.

import { json, sameOrigin, fetchNumap, setCookie, COOKIE, DAY } from '../../_lisans.js';

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error: 'Geçersiz istek.' }, 403);
  let body = {};
  try { body = await request.json(); } catch { /* boş */ }
  const token = String(body.token || '');
  if (!/^ad_[A-Za-z0-9_-]{40,50}$/.test(token)) return json({ error: 'Bağlantı eksik ya da bozuk. Öğretmeninizden yeni bağlantı isteyin.' }, 422);
  const r = await fetchNumap(env, '/family-invites/verify', { method: 'POST', body: JSON.stringify({ token }) }, request);
  if (r.status === 0 || r.status >= 500) return json({ error: 'Sunucuya ulaşılamadı. Biraz sonra yeniden deneyin.' }, 503);
  if (r.status === 429) return json({ error: 'Çok fazla deneme. Biraz sonra yeniden deneyin.' }, 429);
  if (r.status !== 200 || !r.body || !r.body.ok) return json({ error: 'Bu davet geçersiz, süresi dolmuş ya da iptal edilmiş. Öğretmeninizden yeni bağlantı isteyin.' }, 404);
  const kalan = Math.min(365 * DAY, Math.max(DAY, (Date.parse(r.body.expiresAt) - Date.now()) / 1000));
  return json(
    { ok: true, etiket: r.body.label || '', ogretmen: r.body.teacherName || '', kurum: r.body.institutionName || '', bitis: r.body.expiresAt },
    200,
    { 'Set-Cookie': setCookie(COOKIE, `a.${token}`, { maxAge: kalan }) },
  );
}
