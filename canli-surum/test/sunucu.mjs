// Elle denetim: node canli-surum/test/sunucu.mjs 8820 acik [DENEME_SIRRI] ; bash canli-surum/test/lisans-api.sh 8820
// Küçük Cloudflare Pages taklidi: statik site + functions (/api/lisans/*, /oyna/ ara katmanı).
// Kullanım: node sunucu.mjs <port> <kapı:acik|kapali> [DENEME_SIRRI]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = ROOT + '/site';
const port = Number(process.argv[2] || 8820);
const env = { LISANS_KAPISI: process.argv[3] || 'acik', NUMAP_API: 'http://127.0.0.1:1/api' };
if (process.argv[4]) env.DENEME_SIRRI = process.argv[4];
const mw = await import(ROOT + '/functions/oyna/_middleware.js');
const api = {};
for (const f of fs.readdirSync(ROOT + '/functions/api/lisans')) api[f.replace('.js', '')] = await import(ROOT + '/functions/api/lisans/' + f);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.mp3': 'audio/mpeg' };
function statik(url) {
  let p = decodeURIComponent(url.pathname);
  let f = path.join(SITE, p);
  if (!f.startsWith(SITE)) return new Response('no', { status: 403 });
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  else if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
  if (!fs.existsSync(f)) return new Response('404', { status: 404 });
  return new Response(fs.readFileSync(f), { headers: { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' } });
}
http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const chunks = []; for await (const c of req) chunks.push(c);
  const request = new Request(url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) });
  let out;
  try {
    const m = /^\/api\/lisans\/([a-z]+)$/.exec(url.pathname);
    if (m && api[m[1]]) {
      const mod = api[m[1]]; const fn = req.method === 'POST' ? mod.onRequestPost : mod.onRequestGet;
      out = fn ? await fn({ request, env }) : new Response('405', { status: 405 });
    } else if (['/oyna', '/oyna/', '/oyna/index.html'].includes(url.pathname)) {
      out = await mw.onRequest({ request, env, next: async () => statik(url) });
    } else out = statik(url);
  } catch (e) { console.error(e); out = new Response('500 ' + e.message, { status: 500 }); }
  const headers = {};
  out.headers.forEach((v, k) => { if (k !== 'set-cookie') headers[k] = v; });
  const cookies = out.headers.getSetCookie ? out.headers.getSetCookie() : [];
  if (cookies.length) headers['set-cookie'] = cookies;
  res.writeHead(out.status, headers);
  res.end(Buffer.from(await out.arrayBuffer()));
}).listen(port, () => console.log('hazır', port, env.LISANS_KAPISI));
