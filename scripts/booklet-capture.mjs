// Galaksay tanıtım kitapçığı — ekran görüntüsü yakalama (headless Edge + puppeteer-core).
// cf-deploy/ statik sunulur; Numap API'si MOCK (demo öğretmen + 6 kurgusal öğrenci).
// Çıktı: docs/booklet/shots/*.png — Kullanım: node scripts/booklet-capture.mjs
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(join(import.meta.dirname, '..', '..', 'numap-app', 'package.json'));
const puppeteer = require('puppeteer-core'); // numap-app'teki kurulumdan

const DIST = join(import.meta.dirname, '..', 'cf-deploy');
const OUT = join(import.meta.dirname, '..', 'docs', 'booklet', 'shots');
mkdirSync(OUT, { recursive: true });
const PORT = 8124;
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg' };

const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = join(DIST, p);
  if (!existsSync(f) || extname(f) === '') f = p.startsWith('/oyna') ? join(DIST, 'oyna', 'index.html') : join(DIST, 'index.html');
  try { res.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f)); }
  catch { res.writeHead(404); res.end(); }
});

// ── DEMO veri (tamamen kurgusal) ──
const mk = (i, key, name, ageMonths, grade, school) => ({
  id: 'sess' + i, studentKey: key, studentName: name, ageMonths, savedAt: `2026-06-0${i}T10:00:00Z`, status: 'completed',
  payload: { student: { name, grade, school, city: 'Ankara', gender: i % 2 ? 'female' : 'male' }, results: [] },
});
const sessions = [
  mk(1, 'a1b2c3d4e5f60718', 'Elif K.', 79, '1', 'Cumhuriyet İlkokulu'),
  mk(2, 'b2c3d4e5f6071829', 'Mert A.', 85, '2', 'Cumhuriyet İlkokulu'),
  mk(3, 'c3d4e5f607182930', 'Zeynep T.', 71, '', 'Atatürk Anaokulu'),
  mk(4, 'd4e5f60718293041', 'Ali R.', 92, '2', 'Mevlana İlkokulu'),
  mk(5, 'e5f6071829304152', 'Defne S.', 88, '2', 'Mevlana İlkokulu'),
  mk(6, 'f60718293041526a', 'Can B.', 76, '1', 'Cumhuriyet İlkokulu'),
];
const demoUser = { id: 'u_demo', name: 'Demo Öğretmen', email: 'demo@getnumap.com', role: 'practitioner' };

const INIT = `
  try {
    localStorage.setItem('numap_token', 'demo-token');
    localStorage.setItem('numap_user', JSON.stringify(${JSON.stringify(demoUser)}));
    localStorage.setItem('galaksay_consent_v1', JSON.stringify({ essential:true, analytics:true, dataSync:true, autoMigrated:true, version:1 }));
  } catch {}
  const SESSIONS = ${JSON.stringify(sessions)};
  const origFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : input.url;
    if (url.includes('/api/')) {
      const j = (b) => Promise.resolve(new Response(JSON.stringify(b), { status: 200, headers: { 'content-type': 'application/json' } }));
      if (url.includes('auth/me')) return j({ user: ${JSON.stringify(demoUser)} });
      if (url.includes('/sessions')) return j({ sessions: SESSIONS });
      if (url.includes('game-progress')) return j({ ok: true });
      return j({});
    }
    return origFetch(input, init);
  };
`;
const NO_TOKEN_INIT = `try { localStorage.clear(); } catch {}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function clickText(page, re, root = 'button') {
  return page.evaluate((sel, reSrc) => {
    const re2 = new RegExp(reSrc);
    const els = [...document.querySelectorAll(sel)];
    const el = els.find((x) => re2.test(x.textContent || ''));
    if (el) { el.click(); return true; }
    return false;
  }, root, re.source);
}
async function clickChildCard(page, nameRe) {
  return page.evaluate((reSrc) => {
    const re2 = new RegExp(reSrc);
    const cands = [...document.querySelectorAll('*')].filter((el) => {
      const t = el.textContent || '';
      return re2.test(t) && /ya[şs]/.test(t) && t.length < 80;
    }).sort((a, b) => a.textContent.length - b.textContent.length);
    const el = cands[0];
    if (!el) return false;
    (el.closest('[role=button],button,[onclick]') || el).click();
    return true;
  }, nameRe.source);
}
const shoot = async (page, name) => page.screenshot({ path: join(OUT, name + '.png') });

await new Promise((r) => server.listen(PORT, r));
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox', '--disable-gpu', '--force-device-scale-factor=2', '--autoplay-policy=no-user-gesture-required'] });
const log = [];
try {
  // ── 1) Kök tanıtım sayfası ──
  let page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(1200);
  await shoot(page, 'site-landing'); log.push('site-landing ✓');

  // ── 2) Welcome (token YOK → iki kapı) ──
  await page.evaluateOnNewDocument(NO_TOKEN_INIT);
  await page.goto(`http://localhost:${PORT}/oyna/`, { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(2600); // splash
  await shoot(page, 'welcome'); log.push('welcome ✓');
  await page.close();

  // ── 3+) Öğretmen akışı (mock oturum) ──
  page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.evaluateOnNewDocument(INIT);
  await page.goto(`http://localhost:${PORT}/oyna/`, { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(2800); // splash + me()
  await shoot(page, 'teacher-hub'); log.push('teacher-hub: ' + (await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 60))));

  await clickText(page, /Öğrenci Seç/); await sleep(900);
  await shoot(page, 'child-list'); log.push('child-list ✓');

  await clickChildCard(page, /Elif K\./); await sleep(1000);
  await shoot(page, 'child-hub'); log.push('child-hub: ' + (await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 60))));

  // Elif (sınıf=1) → Keşfet yaş SORMADAN doğrudan yörüngeye gider (kaldığı yerden devam)
  await clickText(page, /Keşfet/); await sleep(1100);
  await shoot(page, 'journey-map'); log.push('journey(Elif/sinif1): ' + (await page.evaluate(() => /Yörüngesi/.test(document.body.innerText))));

  // Zeynep (sınıf boş) → yaş seçimi + hikâye intro kareleri
  await clickText(page, /Çocuk/); await sleep(900); // çocuk değiştir → listeye dön
  await clickText(page, /Öğrenci Seç/); await sleep(800);
  await clickChildCard(page, /Zeynep T\./); await sleep(1000);
  await clickText(page, /Keşfet/); await sleep(900);
  await shoot(page, 'age-select'); log.push('age-select: ' + (await page.evaluate(() => /Okul Öncesi/.test(document.body.innerText))));

  // Oyun akışı: Genel Erişim → mod listesi → Sayalon "Göktaşı Say!" → Kısa → Başla
  await clickText(page, /Genel Erişim/); await sleep(1100);
  await shoot(page, 'mode-select'); log.push('mode-select: ' + (await page.evaluate(() => /Göktaşı Say/.test(document.body.innerText))));
  await clickText(page, /Göktaşı Say/); await sleep(900);
  await clickText(page, /Kısa/); await sleep(300);
  await clickText(page, /Başla!/); await sleep(1100);
  await shoot(page, 'mission-brief'); log.push('brief: ' + (await page.evaluate(() => /GÖREV TANITIMI/i.test(document.body.innerText))));
  await clickText(page, /Görevi Başlat/); await sleep(1400);
  await shoot(page, 'game-item'); log.push('game-item: ' + (await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 80))));

  // 5 soruyu doğru cevapla (taş sayımı) → feedback + results
  const roundNo = () => page.evaluate(() => (document.body.innerText.match(/(\d)\/5/) || [])[1] || null);
  const atResultsFn = () => page.evaluate(() => /Tekrar Oyna|Seviye \d Yüksel/.test(document.body.innerText));
  let feedbackShot = false;
  for (let qi = 0; qi < 7; qi++) {
    if (await atResultsFn()) break;
    const before = await roundNo();
    const done = await page.evaluate(() => /Tekrar Oyna|Efsane|Harika!/.test(document.body.innerText) && !/\d\/5/.test((document.body.innerText.match(/(\d)\/5/) || [''])[0]));
    // Cevap = ŞIKLARIN HEMEN ÜSTÜNDEKİ bantta (≤170px) özdeş-genişlikli daire kümesi
    // (teşhis: taşlar şık-üstü ~50-90px'te; maskot/süsler çok yukarıda). Şıklarla kesiştir.
    const count = await page.evaluate(() => {
      const optBtns = [...document.querySelectorAll('button')].filter((x) => /^(\d+)\s*(bir|iki|üç|dört|beş|altı|yedi|sekiz|dokuz|on)/.test(x.textContent.trim()));
      if (!optBtns.length) return null;
      const oTop = Math.min(...optBtns.map((b) => b.getBoundingClientRect().top));
      const optNums = optBtns.map((b) => Number(b.textContent.trim().match(/^(\d+)/)[1]));
      const byW = {};
      for (const d of document.querySelectorAll('div')) {
        if (d.closest('button')) continue;
        const r = d.getBoundingClientRect();
        if (r.width < 16 || r.width > 70 || Math.abs(r.width - r.height) > 3) continue;
        if (r.bottom > oTop + 6 || r.bottom < oTop - 170) continue;
        const s = getComputedStyle(d);
        const br = s.borderRadius;
        const round = br.includes('%') ? parseFloat(br) >= 45 : parseFloat(br) >= r.width / 2 - 2;
        if (!round) continue;
        if (!(s.backgroundImage + s.background).includes('radial')) continue;
        const k = Math.round(r.width);
        byW[k] = (byW[k] || 0) + 1;
      }
      const clusters = Object.values(byW).sort((a, b) => b - a);
      return clusters.find((c) => optNums.includes(c)) ?? clusters[0] ?? null;
    });
    if (count == null) {
      log.push('taş bandı boş: ' + (await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 130))));
      break;
    }
    if (count == null) {
      const diag = await page.evaluate(() => {
        const prompt = [...document.querySelectorAll('p,div')].find((e) => /kaç yıldız taşı var/.test(e.textContent || '') && (e.textContent || '').length < 80);
        const optBtns = [...document.querySelectorAll('button')].filter((x) => /(bir|iki|üç|dört|beş|altı|yedi|sekiz|dokuz|on)/.test(x.textContent) && x.textContent.replace(/\s+/g, '').length < 12);
        const circles = [...document.querySelectorAll('div')].filter((d) => {
          const r = d.getBoundingClientRect();
          if (r.width < 10 || r.width > 90 || Math.abs(r.width - r.height) > 4) return false;
          const s = getComputedStyle(d);
          return (s.backgroundImage + s.background).includes('radial');
        }).map((d) => { const r = d.getBoundingClientRect(); const s = getComputedStyle(d); return { t: Math.round(r.top), w: Math.round(r.width), br: s.borderRadius, btn: !!d.closest('button') }; });
        return { prompt: !!prompt, pBot: prompt && Math.round(prompt.getBoundingClientRect().bottom), oTop: optBtns.length && Math.round(Math.min(...optBtns.map((b) => b.getBoundingClientRect().top))), circles: circles.slice(0, 14) };
      });
      log.push('DIAG: ' + JSON.stringify(diag));
      break;
    }
    await page.evaluate((c) => {
      const btn = [...document.querySelectorAll('button')].find((x) => {
        const t = x.textContent.replace(/\s+/g, '');
        return t.startsWith(String(c)) && /(bir|iki|üç|dört|beş|altı|yedi|sekiz|dokuz|on)/.test(t);
      });
      if (btn) btn.click();
    }, count);
    await sleep(1100);
    if (!feedbackShot) {
      const ok = await page.evaluate(() => /Harika! ✓|Süper! ✓|Tam isabet|Bravo|Mükemmel/.test(document.body.innerText));
      if (ok) { await shoot(page, 'feedback-correct'); feedbackShot = true; log.push('feedback ✓ (n=' + count + ')'); }
    }
    // Tur değişene ya da sonuç ekranına dek bekle (count-along + otomatik geçiş ≤14sn);
    // yanlışta "Devam Et" çıkar → tıkla.
    for (let w = 0; w < 28; w++) {
      await sleep(500);
      if (await atResultsFn()) break;
      const now = await roundNo();
      if (now && now !== before) break;
      await clickText(page, /Devam Et/);
    }
  }
  for (let w = 0; w < 16 && !(await atResultsFn()); w++) await sleep(500);
  await sleep(1600);
  await shoot(page, 'results'); log.push('results: ' + (await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 70))));
} finally {
  await browser.close();
  server.close();
}
writeFileSync(join(OUT, '_report.json'), JSON.stringify(log, null, 2));
console.log(log.join('\n'));
