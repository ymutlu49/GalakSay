// Galaksay — WCAG renk kontrastı denetim aracı
//
// Amaç: Uygulamadaki metin/zemin renk çiftlerini tarayıp okunması zor
// (düşük kontrastlı) metinleri WCAG 2.1 ölçütlerine göre raporlamak.
//
// Yöntem:
//  1) Tüm .jsx/.js dosyalarındaki inline `style={{ ... }}` bloklarını ayrıştır.
//  2) Her blok içinde `color` ile `background`/`backgroundColor` çiftini eşle.
//  3) Token referanslarını (colors.text.*, C.brandPurple vb.) gerçek hex'e çöz.
//  4) Yerel zemin yoksa metni uygulamanın standart koyu zeminlerine karşı test et.
//  5) WCAG kontrast oranını hesapla, AA eşiğine göre raporla.
//
// Çalıştır:  node scripts/contrast-audit.mjs           (özet)
//            node scripts/contrast-audit.mjs --json     (makine-okur çıktı)
//            node scripts/contrast-audit.mjs --all      (geçenler dahil tümü)

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, relative } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ═══ 1. TOKEN HARİTASI — design-system renklerini hex'e çöz ═══════════════
// theme/colors.js (C) + design-system/colors.js (colors) değerleri.
const C = {
  blue: '#93c5fd', red: '#dc2626', green: '#059669',
  pvOnes: '#059669', pvTens: '#93c5fd', pvHunds: '#dc2626',
  yellow: '#eab308', orange: '#ea580c', purple: '#7c3aed', teal: '#0d9488', pink: '#db2777',
  correct: '#059669', wrong: '#f97316',
  rodGold: '#f59e0b', rodDark: '#78350f', rodLight: '#fde047', slotDark: '#0a0a0a',
  brandPurple: '#7c3aed', brandGreen: '#34d399', brandDark: '#2e1065',
  uiBlue: '#7c3aed', uiGreen: '#059669',
};
const colors = {
  background: { primary: '#0B0E2D', secondary: '#141852', tertiary: '#1E2470', overlay: 'rgba(11,14,45,0.85)' },
  surface: { card: '#1A1F5E', cardHover: '#222878', input: '#12164A' },
  text: { primary: '#FFFFFF', secondary: '#A8B2D1', tertiary: '#8B95B8', disabled: '#3D4470', inverse: '#0B0E2D' },
  accent: { primary: C.brandPurple, primaryLight: '#A78BFA', secondary: C.correct, tertiary: '#FF6B6B', gold: '#FFD93D', orange: C.orange },
  feedback: { success: C.correct, error: C.wrong, warning: '#FFD93D', info: C.brandPurple, hint: '#A78BFA' },
  placeValue: { ones: '#059669', tens: '#93c5fd', hundreds: '#dc2626' },
};

// Düz erişimli token tablosu: "colors.text.tertiary" → "#6B7499"
const TOKENS = {};
const flatten = (obj, prefix) => {
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') TOKENS[`${prefix}.${k}`] = v;
    else if (v && typeof v === 'object') flatten(v, `${prefix}.${k}`);
  }
};
flatten(colors, 'colors');
for (const [k, v] of Object.entries(C)) TOKENS[`C.${k}`] = v;

// ═══ 2. RENK PARSE + WCAG KONTRAST ════════════════════════════════════════
function parseColor(raw) {
  if (!raw) return null;
  let s = String(raw).trim().replace(/^['"`]|['"`]$/g, '').trim();
  // Token referansı?
  if (TOKENS[s]) s = TOKENS[s];
  // hex
  let m = s.match(/^#([0-9a-fA-F]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    let alpha;
    if (h.length === 8) { alpha = parseInt(h.slice(6, 8), 16) / 255; h = h.slice(0, 6); } // #RRGGBBAA
    if (h.length !== 6) return null;
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: alpha, src: s };
  }
  // rgb / rgba
  m = s.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const parts = m[1].split(',').map((x) => parseFloat(x));
    if (parts.length >= 3) return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1, src: s };
  }
  return null; // değişken / ternary / gradient → çözülemedi
}

const srgb = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = ({ r, g, b }) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
function contrast(c1, c2) {
  const l1 = luminance(c1), l2 = luminance(c2);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
// Yarı saydam metni zemine kompozit et (alfa < 1)
function composite(fg, bg) {
  if (fg.a === undefined || fg.a >= 1) return fg;
  const a = fg.a;
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), src: fg.src };
}

// Uygulamanın standart zeminleri (yerel bg yoksa metnin oturduğu olası zeminler)
const APP_BGS = [
  { name: 'bg.primary', col: parseColor('#0B0E2D') },
  { name: 'bg.secondary', col: parseColor('#141852') },
  { name: 'surface.card', col: parseColor('#1A1F5E') },
  { name: 'surface.cardHover', col: parseColor('#222878') },
];

// ═══ 3. DOSYA TARAMA ══════════════════════════════════════════════════════
function walk(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.') || e.name === 'dist' || e.name === 'cf-deploy') continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(jsx?|tsx?)$/.test(e.name) && !/\.test\./.test(e.name)) acc.push(p);
  }
  return acc;
}
const files = [join(root, 'GalakSay.jsx'), ...walk(join(root, 'src'))];

// `style={{ ... }}` bloklarını dengeli süslü parantezle çıkar
function extractStyleBlocks(code) {
  const blocks = [];
  const re = /style=\{\{/g;
  let m;
  while ((m = re.exec(code))) {
    let i = m.index + m[0].length;
    let depth = 2; // iki { açık
    const start = i;
    while (i < code.length && depth > 0) {
      const ch = code[i];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      i++;
    }
    blocks.push({ body: code.slice(start, i - 2), index: m.index });
  }
  return blocks;
}

// Blok içinden bir CSS prop'unun değerini al (üst seviye, basit literal/ternary)
function pickProp(body, prop) {
  // prop: 'color' veya 'background' — ternary'nin iki dalını da yakalamaya çalış
  const re = new RegExp(`(?:^|[,{\\s])${prop}\\s*:\\s*([^,\\n}]+)`, 'g');
  const vals = [];
  let m;
  while ((m = re.exec(body))) vals.push(m[1].trim());
  return vals;
}

const lineOf = (code, idx) => code.slice(0, idx).split('\n').length;

// ═══ 4. DENETİM ═══════════════════════════════════════════════════════════
const AA_NORMAL = 4.5, AA_LARGE = 3.0;
const findings = [];

for (const file of files) {
  let code;
  try { code = readFileSync(file, 'utf8'); } catch { continue; }
  const rel = relative(root, file).replace(/\\/g, '/');
  for (const block of extractStyleBlocks(code)) {
    const colorVals = pickProp(block.body, 'color');
    if (!colorVals.length) continue;

    // Büyük metin mi? (≥24px, veya ≥18.66px && bold) → AA_LARGE eşiği
    const fsMatch = block.body.match(/fontSize\s*:\s*['"`]?(\d+)/);
    const fwMatch = block.body.match(/fontWeight\s*:\s*['"`]?(\d{3}|bold)/);
    const fontPx = fsMatch ? parseInt(fsMatch[1]) : null;
    const isBold = fwMatch ? (fwMatch[1] === 'bold' || parseInt(fwMatch[1]) >= 700) : false;
    const isLarge = fontPx !== null && (fontPx >= 24 || (fontPx >= 19 && isBold));
    const threshold = isLarge ? AA_LARGE : AA_NORMAL;

    // Yerel zeminler
    const bgVals = [...pickProp(block.body, 'backgroundColor'), ...pickProp(block.body, 'background')];
    const localBgs = bgVals.map(parseColor).filter(Boolean).filter((b) => b.a === undefined || b.a > 0.5);

    for (const cv of colorVals) {
      const fg = parseColor(cv);
      if (!fg) continue; // çözülemeyen renk (değişken/gradient)

      let best = null; // en yüksek (en iyi-durum) kontrast
      let worst = null;
      const testBgs = localBgs.length
        ? localBgs.map((b) => ({ name: 'yerel', col: b }))
        : APP_BGS;
      const confidence = localBgs.length ? 'kesin' : 'tahmini-koyu-zemin';

      for (const bg of testBgs) {
        const fgc = composite(fg, bg.col);
        const ratio = contrast(fgc, bg.col);
        if (best === null || ratio > best.ratio) best = { ratio, bg: bg.name, bgSrc: rgbStr(bg.col) };
        if (worst === null || ratio < worst.ratio) worst = { ratio, bg: bg.name, bgSrc: rgbStr(bg.col) };
      }
      // Yerel zemin varsa o kesin → en kötüyü baz al. Tahminde en iyi-durumu baz al
      // (en iyi durumda bile geçemiyorsa kesinlikle okunmaz).
      const judge = localBgs.length ? worst : best;
      if (judge.ratio < threshold) {
        findings.push({
          file: rel,
          line: lineOf(code, block.index),
          color: fg.src,
          colorResolved: rgbStr(fg),
          bg: judge.bg,
          bgColor: judge.bgSrc,
          ratio: +judge.ratio.toFixed(2),
          threshold,
          isLarge,
          fontPx,
          confidence,
          deficit: +(threshold - judge.ratio).toFixed(2),
        });
      }
    }
  }
}

function rgbStr(c) {
  if (!c) return '?';
  if (c.src && c.src.startsWith('#')) return c.src;
  return `rgb(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)})`;
}

// ═══ 5. RAPOR ═════════════════════════════════════════════════════════════
findings.sort((a, b) => a.ratio - b.ratio);

const args = process.argv.slice(2);
if (args.includes('--json')) {
  const outPath = join(root, 'contrast-audit-report.json');
  writeFileSync(outPath, JSON.stringify(findings, null, 2));
  console.log(`${findings.length} bulgu → ${relative(root, outPath)}`);
  process.exit(0);
}

// Renk değerine göre grupla (en sık tekrar eden sorunlu renkler)
const byColor = {};
for (const f of findings) {
  const key = f.colorResolved.toLowerCase();
  (byColor[key] ??= { color: f.colorResolved, token: f.color, count: 0, minRatio: 99, files: new Set() }).count++;
  byColor[key].minRatio = Math.min(byColor[key].minRatio, f.ratio);
  byColor[key].files.add(f.file);
  if (/^colors\.|^C\./.test(f.color)) byColor[key].token = f.color;
}

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  GALAKSAY — WCAG KONTRAST DENETİMİ');
console.log('═══════════════════════════════════════════════════════════════\n');
console.log(`Taranan dosya: ${files.length}`);
console.log(`Toplam düşük-kontrast bulgu: ${findings.length}`);
const kesin = findings.filter((f) => f.confidence === 'kesin').length;
console.log(`  • Kesin (yerel zemin biliniyor): ${kesin}`);
console.log(`  • Tahmini (koyu zemin varsayımı): ${findings.length - kesin}`);

console.log('\n─── EN SORUNLU RENKLER (tekrar × düşük kontrast) ───────────────\n');
const colorRank = Object.values(byColor).sort((a, b) => b.count - a.count).slice(0, 20);
for (const c of colorRank) {
  const tok = c.token !== c.color ? `  [${c.token}]` : '';
  console.log(`  ${c.color.padEnd(9)}  ×${String(c.count).padStart(4)}  min ${c.minRatio.toFixed(2)}:1  ${c.files.size} dosya${tok}`);
}

console.log('\n─── EN KÖTÜ 30 BULGU (düşük kontrasttan yükseğe) ───────────────\n');
for (const f of findings.slice(0, 30)) {
  const lt = f.isLarge ? 'L' : 'N';
  console.log(`  ${f.ratio.toFixed(2)}:1 (hedef ${f.threshold}, ${lt})  ${f.color} / ${f.bgColor}  —  ${f.file}:${f.line}  [${f.confidence}]`);
}

console.log('\n─── DOSYA BAŞINA BULGU ─────────────────────────────────────────\n');
const byFile = {};
for (const f of findings) (byFile[f.file] ??= 0), byFile[f.file]++;
for (const [file, n] of Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 25)) {
  console.log(`  ${String(n).padStart(4)}  ${file}`);
}
console.log('\nNot: "tahmini" bulgular metnin koyu uygulama zeminine oturduğu');
console.log('varsayımıyla işaretlenir; renkli çip/kart üstündeki metinde yanlış');
console.log('pozitif olabilir. "kesin" bulgular aynı stil bloğundaki zemine göredir.\n');
