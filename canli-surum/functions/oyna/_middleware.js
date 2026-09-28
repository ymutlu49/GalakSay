// GalakSay lisans kapısı: /oyna/ sayfası (_routes.json yalnız HTML yollarını buraya yönlendirir).
// Kapı kapalıysa (functions/_ayar.js ya da LISANS_KAPISI) hiçbir şey yapmaz.
//
// Akış:
//   ?sso=<bilet>   NuMap'ten gelişte bilet sunucuda değiştirilir (hedef: galaksay); lisans ve
//                  uygulama devri çerezleri yazılır, bilet adresten silinerek yönlendirilir.
//   gs_lis çerezi  geçerliyse sayfa açılır; değilse /giris'e yönlendirilir.

import { COOKIE, kapiAcik, readCookie, clearCookie, lisansDurumu, fetchNumap, hasGalaksay, girisCerezleri } from '../_lisans.js';

function yonlendir(location, cookies = []) {
  const h = new Headers({ Location: location, 'cache-control': 'no-store' });
  for (const c of cookies) h.append('Set-Cookie', c);
  return new Response(null, { status: 302, headers: h });
}

export async function onRequest(context) {
  const { request, env, next } = context;
  if (!kapiAcik(env) || request.method !== 'GET') return next();
  const url = new URL(request.url);

  const ticket = url.searchParams.get('sso');
  if (ticket) {
    url.searchParams.delete('sso');
    const temiz = url.pathname + (url.search || '');
    const r = await fetchNumap(env, '/auth/sso/exchange', { method: 'POST', body: JSON.stringify({ ticket, app: 'galaksay' }) });
    if (r.status === 200 && r.body && r.body.token && hasGalaksay(r.body)) return yonlendir(temiz, girisCerezleri(r.body));
    const neden = r.status === 200 || r.status === 403 ? 'lisans' : 'sso';
    return yonlendir(`/giris?hata=${neden}&geri=${encodeURIComponent(temiz)}`);
  }

  const durum = await lisansDurumu(env, readCookie(request, COOKIE), request);
  if (durum.ok) {
    const res = await next();
    const h = new Headers(res.headers);
    h.set('cache-control', 'private, no-cache');
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
  }
  const geri = encodeURIComponent(url.pathname + url.search);
  const hata = durum.neden === 'lisans' ? '&hata=lisans' : '';
  return yonlendir(`/giris?geri=${geri}${hata}`, readCookie(request, COOKIE) ? [clearCookie(COOKIE)] : []);
}
