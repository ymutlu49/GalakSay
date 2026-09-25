// Galaksay — Cloudflare Pages derleme scripti (galaksay.com)
//
// Çıktı yapısı (cf-deploy/):
//   /                 → tanıtım (landing) sayfası  (site/index.html)
//   /oyna/            → uygulama (vite build, base=/oyna/)
//   /manifest.webmanifest, /sw.js, /icons/*  → PWA kök varlıkları
//
// Her Çocuk Matematik Öğrenebilir umbrella (hercocukmatematikogrenebilir.com, /galaksay/ alt yolu) FTP deploy'unu ETKİLEMEZ: o build varsayılan
// `npm run build` (base=/galaksay/) ile üretilir; bu script ayrı env kullanır.
//
// Çalıştır:  npm run build:cf
import { execSync } from 'node:child_process';
import { rmSync, mkdirSync, writeFileSync, existsSync, readdirSync, copyFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'cf-deploy');
const site = join(root, 'site');

// Elle özyinelemeli kopya — Node 25'te fs.cpSync bu makinede native crash
// (0xC0000409) veriyor; dirent tabanlı kopya güvenli.
function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const e of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, e.name);
    const d = join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else copyFileSync(s, d);
  }
}

if (!existsSync(join(site, 'index.html'))) {
  console.error('[hata] site/index.html bulunamadı.');
  process.exit(1);
}

console.log('1/4  cf-deploy/ temizleniyor…');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

console.log('2/4  Uygulama derleniyor (base=/oyna/, PWA=1) → cf-deploy/oyna');
// vite'ı PATH'e bağımlı olmadan çağır (npm dışı `node` çalıştırması da çalışsın).
const viteEntry = join(root, 'node_modules', 'vite', 'bin', 'vite.js');
execSync(`node "${viteEntry}" build --outDir cf-deploy/oyna --emptyOutDir`, {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, VITE_BASE: '/oyna/', VITE_PWA: '1' },
});

console.log('3/4  Tanıtım sayfası + PWA varlıkları köke kopyalanıyor (site/*)');
copyDir(site, out);

console.log('3b   sw.js: sürüm damgası + /oyna/ varlıklarının önbellek listesi');
{
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const stamp = `v${pkg.version}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
  const assetsDir = join(out, 'oyna', 'assets');
  // Uygulama kabuğu ilk ziyarette tamamen önbelleğe alınır (sunum/çevrimdışı güvencesi);
  // ses paketi (audio/) isteğe bağlı → stale-while-revalidate ile sonradan dolar.
  const precache = existsSync(assetsDir)
    ? readdirSync(assetsDir).filter((f) => /\.(js|css|woff2)$/.test(f)).map((f) => `/oyna/assets/${f}`)
    : [];
  const swPath = join(out, 'sw.js');
  let sw = readFileSync(swPath, 'utf8');
  sw = sw.replace('galaksay-__BUILD__', `galaksay-${stamp}`);
  sw = sw.replace('/*__PRECACHE__*/', precache.map((u) => `'${u}',`).join('\n  '));
  writeFileSync(swPath, sw);
  console.log(`     ${precache.length} varlık önbellek listesine eklendi (${stamp})`);
}
console.log('4/4  Cloudflare yapılandırması (_redirects, _headers)');
// /oyna/ SPA fallback (derin link güvenliği) — uygulama URL yönlendirmesi
// kullanmasa da zararsız ve ileriye dönük güvenli.
writeFileSync(join(out, '_redirects'), '/oyna/* /oyna/index.html 200\n');
// SW her zaman taze; manifest doğru MIME.
// Güvenlik başlıkları (2026-09-24 denetimi): clickjacking, MIME sniffing, referer sızıntısı,
// gereksiz cihaz izinleri kapatılır; CSP dış origin'lere veri çıkışını sınırlar (connect-src).
// Not: script-src'de 'unsafe-inline' index.html içi küçük betikler (SW kaydı, gate marka
// değişkenleri) için; portal alan adı a11y/gate widget'ları için izinli.
const SECURITY_HEADERS = [
  '/*',
  '  X-Frame-Options: DENY',
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  '  Strict-Transport-Security: max-age=31536000; includeSubDomains',
  "  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://hercocukmatematikogrenebilir.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob: https:; media-src 'self' blob: data:; connect-src 'self' https://getnumap.com https://hercocukmatematikogrenebilir.com https://cloudflareinsights.com; worker-src 'self'; manifest-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  '',
];
writeFileSync(
  join(out, '_headers'),
  [
    ...SECURITY_HEADERS,
    '/sw.js',
    '  Cache-Control: public, max-age=0, must-revalidate',
    '',
    '/manifest.webmanifest',
    '  Content-Type: application/manifest+json',
    '',
  ].join('\n')
);

console.log('\n✓ cf-deploy/ hazır. Deploy:  npx wrangler pages deploy cf-deploy --project-name galaksay');
