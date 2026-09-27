#!/usr/bin/env python3
"""Değişmez bir Cloudflare Pages dağıtımını (<id>.galaksay.pages.dev) eksiksiz yerel kopyaya indirir.

- BFS: HTML (href/src/srcset/content/og), CSS url(), JS içindeki "/..." ve "assets/..." yolları,
  manifest ikonları, sık bilinen dosyalar (robots, sitemap, llms, google doğrulama, favicon).
- Cloudflare "pretty URL": /x.html → 308 → /x ; dosya x.html olarak kaydedilir.
- Her yanıtın başlıkları headers.json'a yazılır (_headers yeniden kurulumu için).
Salt-okur: yalnız GET isteği atar.
"""
import json, os, re, sys, urllib.parse, urllib.request, ssl

BASE = sys.argv[1].rstrip('/')
OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)
ctx = ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE') or '/root/.ccr/ca-bundle.crt') if os.path.exists('/root/.ccr/ca-bundle.crt') else ssl.create_default_context()

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None

opener = urllib.request.build_opener(NoRedirect, urllib.request.HTTPSHandler(context=ctx))

def get(path):
    req = urllib.request.Request(BASE + urllib.parse.quote(path, safe='/%._-~'), headers={'User-Agent': 'Mozilla/5.0 galaksay-snapshot'})
    try:
        r = opener.open(req, timeout=30)
        return r.status, dict(r.headers), r.read()
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read() if e.code < 300 or e.code >= 400 else b''

SEEDS = ['/', '/oyna/', '/sw.js', '/manifest.webmanifest', '/robots.txt', '/sitemap.xml', '/llms.txt',
         '/favicon.ico', '/googlee0273c15c4e75b53.html', '/fonts.css', '/404.html', '/oyna/manifest.webmanifest']
seen, queue, files, headers, redirects, missing = set(), list(SEEDS), {}, {}, {}, []

def norm(u, cur):
    if not u or u.startswith(('data:', 'mailto:', 'tel:', 'javascript:', '#', 'blob:')):
        return None
    u = u.strip()
    if re.search(r'\s', u) or ('/' not in u and '.' not in u) or u.startswith(('{', '$', '`')):
        return None
    u = u.split('#')[0].split('?')[0]
    if u.startswith('//'):
        return None
    if re.match(r'^https?://', u):
        p = urllib.parse.urlparse(u)
        host = urllib.parse.urlparse(BASE).hostname
        if p.hostname not in (host, 'galaksay.com', 'www.galaksay.com'):
            return None
        u = p.path or '/'
    elif not u.startswith('/'):
        u = urllib.parse.urljoin(cur, u)
    return u or '/'

def extract(path, body, ctype):
    out = set()
    text = body.decode('utf-8', 'ignore')
    if 'html' in ctype or path.endswith(('.html', '/')):
        for m in re.findall(r'(?:href|src|content|poster|data-src)\s*=\s*"([^"]+)"', text):
            out.add(m)
        for m in re.findall(r'srcset\s*=\s*"([^"]+)"', text):
            for part in m.split(','):
                out.add(part.strip().split(' ')[0])
    if 'css' in ctype or path.endswith('.css') or 'html' in ctype:
        out.update(re.findall(r'url\(\s*[\'"]?([^\'")]+)', text))
    if 'javascript' in ctype or path.endswith(('.js', '.mjs')):
        out.update(re.findall(r'["\'`](/[A-Za-z0-9_\-./%]+\.[a-z0-9]{2,6})["\'`]', text))
        base_dir = path.rsplit('/', 1)[0] + '/'
        for m in re.findall(r'["\'`](?:\./|assets/)?([A-Za-z0-9_\-]+-[A-Za-z0-9_\-]{8}\.(?:js|css))["\'`]', text):
            out.add(base_dir + m if path.startswith('/oyna/assets/') else '/oyna/assets/' + m)
    if path.endswith('.webmanifest') or 'manifest' in ctype:
        try:
            for ic in json.loads(text).get('icons', []):
                out.add(ic.get('src', ''))
            for sc in json.loads(text).get('screenshots', []):
                out.add(sc.get('src', ''))
        except Exception:
            pass
    if path.endswith('sitemap.xml'):
        out.update(re.findall(r'<loc>([^<]+)</loc>', text))
    if path == '/sw.js':
        out.update(re.findall(r"'(/[^']+)'", text))
    return out

while queue:
    path = queue.pop(0)
    if path in seen:
        continue
    seen.add(path)
    st, hd, body = get(path)
    headers[path] = {'status': st, **{k: v for k, v in hd.items() if k.lower() not in ('date', 'cf-ray', 'server', 'nel', 'report-to', 'alt-svc', 'age', 'content-length', 'connection')}}
    if 300 <= st < 400:
        loc = hd.get('Location') or hd.get('location')
        tgt = norm(loc, path)
        redirects[path] = tgt
        if tgt and tgt not in seen:
            queue.append(tgt)
        continue
    if st != 200:
        missing.append((path, st))
        continue
    files[path] = body
    ctype = hd.get('Content-Type', hd.get('content-type', ''))
    for u in extract(path, body, ctype):
        n = norm(u, path)
        if n and n not in seen:
            queue.append(n)

def file_for(path):
    # Pretty URL: /kanit → kanit.html (yönlendirme kaynağı .html ise), dizin → index.html
    src = next((a for a, b in redirects.items() if b == path and a.endswith('.html')), None)
    if src:
        return src.lstrip('/')
    if path.endswith('/'):
        return path.lstrip('/') + 'index.html'
    return path.lstrip('/')

written = []
for path, body in files.items():
    fp = os.path.join(OUT, file_for(path))
    os.makedirs(os.path.dirname(fp) or OUT, exist_ok=True)
    with open(fp, 'wb') as f:
        f.write(body)
    written.append(file_for(path))

json.dump({'headers': headers, 'redirects': redirects, 'missing': missing, 'files': sorted(written)},
          open(os.path.join(OUT, '..', 'crawl-report.json'), 'w'), ensure_ascii=False, indent=1)
print('files', len(written), 'redirects', len(redirects), 'missing', len(missing))
for m in missing:
    print('  missing', m)
