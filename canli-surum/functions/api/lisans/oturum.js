// POST /api/lisans/oturum { token } — NuMap oturum belirtecini bu cihaza lisans olarak işler.
// Giriş (e-posta + şifre) tarayıcıdan doğrudan NuMap'e yapılır (giris.js); böylece NuMap'in hatalı
// deneme sınırı gerçek istemci adresine uygulanır. Burada belirteç /auth/me ile doğrulanır; hesapta
// "galaksay" yetkisi varsa HttpOnly lisans çerezi yazılır.

import { json, sameOrigin, fetchNumap, hasGalaksay, setCookie, COOKIE, DAY } from '../../_lisans.js';

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error: 'Geçersiz istek.' }, 403);
  let body = {};
  try { body = await request.json(); } catch { /* boş */ }
  const token = String(body.token || '');
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(token)) return json({ error: 'Geçersiz oturum.' }, 422);
  const r = await fetchNumap(env, '/auth/me', { method: 'GET', headers: { Authorization: `Bearer ${token}` } });
  if (r.status === 0 || r.status >= 500) return json({ error: 'NuMap sunucusuna ulaşılamadı. Biraz sonra yeniden deneyin.' }, 503);
  if (r.status !== 200) return json({ error: 'Oturum doğrulanamadı. Yeniden giriş yapın.' }, 401);
  if (!hasGalaksay(r.body)) return json({ error: 'Bu NuMap hesabında GalakSay lisansı yok.', lisans: false }, 403);
  return json({ ok: true, ad: r.body.user && r.body.user.name }, 200, { 'Set-Cookie': setCookie(COOKIE, `n.${token}`, { maxAge: 30 * DAY }) });
}
