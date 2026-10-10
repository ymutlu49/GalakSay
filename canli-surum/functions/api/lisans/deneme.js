// POST /api/lisans/deneme — bu cihazda hesapsız deneme başlatır (lisans kapısı açıkken).
// Cihaz başına bir kez: gs_deneme izi varsa yeni deneme verilmez. Geçerli bir NuMap ya da aile lisansı
// varsa ona dokunulmaz. Kapı kapalıyken deneme gerekmez (oyun herkese açık).

import { json, sameOrigin, kapiAcik, readCookie, setCookie, lisansDurumu, denemeDegeri, denemeGun, COOKIE, DENEME_IZ, DAY } from '../../_lisans.js';

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ error: 'Geçersiz istek.' }, 403);
  if (!kapiAcik(env)) return json({ ok: true, kapi: false });
  const mevcut = readCookie(request, COOKIE);
  if (mevcut) {
    const d = await lisansDurumu(env, mevcut, request);
    if (d.ok) return json({ ok: true, kapi: true, tur: d.kind, ...(d.kind === 'deneme' ? { bitis: d.bilgi.bitis } : {}) });
  }
  if (readCookie(request, DENEME_IZ)) {
    return json({ error: 'Bu cihazda deneme süresi daha önce kullanıldı. Devam etmek için NuMap hesabıyla girin ya da öğretmeninizden aile bağlantısı isteyin.', kullanildi: true }, 409);
  }
  const { deger, bitis } = await denemeDegeri(env);
  const h = new Headers({ 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  h.append('Set-Cookie', setCookie(COOKIE, deger, { maxAge: denemeGun(env) * DAY }));
  h.append('Set-Cookie', setCookie(DENEME_IZ, '1', { maxAge: 400 * DAY }));
  return new Response(JSON.stringify({ ok: true, kapi: true, tur: 'deneme', bitis: new Date(bitis).toISOString(), gun: denemeGun(env) }), { status: 200, headers: h });
}
