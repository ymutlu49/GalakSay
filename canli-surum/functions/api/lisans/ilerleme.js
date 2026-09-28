// POST /api/lisans/ilerleme — aile cihazındaki oyun ilerlemesini NuMap'e iletir.
// Kimlik HttpOnly çerezdeki davettir (sayfa betiği görmez); NuMap satırları davetin öğrencisine,
// öğretmenin sahipliğinde yazar. Gövde GalakSay'ın /game-progress biçimidir (en çok 1 MB).

import { json, sameOrigin, readCookie, fetchNumap, COOKIE } from '../../_lisans.js';

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error: 'Geçersiz istek.' }, 403);
  const deger = readCookie(request, COOKIE) || '';
  if (!deger.startsWith('a.')) return json({ error: 'Bu cihazda aile daveti yok.' }, 401);
  const text = await request.text();
  if (text.length > 1024 * 1024) return json({ error: 'Gövde çok büyük.' }, 413);
  const r = await fetchNumap(env, '/family-invites/game-progress', {
    method: 'POST', headers: { 'X-Aile-Davet': deger.slice(2) }, body: text,
  });
  if (r.status === 0) return json({ error: 'Sunucuya ulaşılamadı.' }, 503);
  return json(r.body || {}, r.status);
}
