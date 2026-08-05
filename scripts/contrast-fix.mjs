// Galaksay — Kontrast düzeltme codemod'u
//
// SADECE inline `style={{ ... }}` bloklarındaki `color` (metin rengi) özelliğini
// hedefler. Veri/config objelerindeki `color:` anahtarlarını, `border`/`background`
// /SVG `stopColor` vb. DEĞİŞTİRMEZ — bu yüzden marka paletini bozmaz.
//
// Yalnızca "koyu zeminde her zaman okunmaz" diye DOĞRULANMIŞ koyu metin renklerini
// açık (300/400 düzeyi) varyantına çevirir. Açık zeminli istisnalar SKIP ile dışlanır.
//
// Çalıştır:  node scripts/contrast-fix.mjs            (uygula)
//            node scripts/contrast-fix.mjs --dry      (sadece raporla)

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, relative } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');

// Koyu metin → açık varyant (uzay temasının koyu zemininde okunur)
const REMAP = {
  '#7c3aed': '#a78bfa', // brand mor (violet-600 → 400)
  '#6d28d9': '#a78bfa', // violet-700 → 400
  '#5b21b6': '#a78bfa', // violet-800 → 400
  '#b45309': '#fbbf24', // amber-700 → 400 (onluk etiketleri)
  '#c026d3': '#e879f9', // fuchsia-600 → 400
  '#4c1d95': '#ffffff', // violet-900 (tarama başlıkları) koyu kartta → beyaz
  '#dc2626': '#f87171', // red-600 → 400 (koyu zemindeki kırmızı etiketler; açık #fee2e2 çipler SKIP)
};
// Açık (katı) zemin üstündeki koyu metni KORU — satır bazında dışla
const SKIP = {
  // Açık (katı) zemin üstündeki koyu metin → koyu kalsın; ayrı elle ele alınır
  'GalakSay.jsx': new Set([
    24331, // leaderboard "(sen)" — isMe satırı açık zemine çevrilecek
    24335, // leaderboard skoru — #fff satırda koyu kalsın
    18238, // madalya bronz rütbe — ayrı #fb923c (okunur + altından ayırt edilebilir)
    21051, 21070, 21089, // tarama yanıt butonları — #fff zeminde #4c1d95 koyu kalsın
    24298, // başarım rozeti — EBEVEYN kartı açık (#fff/#f1f5f9), #4c1d95 koyu kalsın
    19204, 19326, 19747, 19812, 19849, // birlik etiketleri — EBEVEYN çip açık (#fee2e2), #dc2626 koyu kalsın
  ]),
};

const isWord = (c) => /[A-Za-z0-9_$]/.test(c);

// WCAG göreli parlaklık (hex → 0..1)
function hexLum(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length === 8) h = h.slice(0, 6);
  if (h.length !== 6) return null;
  const lin = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * lin(parseInt(h.slice(0, 2), 16)) + 0.7152 * lin(parseInt(h.slice(2, 4), 16)) + 0.0722 * lin(parseInt(h.slice(4, 6), 16));
}

// Blokta AÇIK (katı) bir background var mı? Varsa koyu metin kasıtlı → dönüşüm atlanmalı.
// (Yalnızca aynı blok; ebeveynden gelen açık zemin yakalanmaz.)
function blockHasLightBg(body) {
  for (const prop of ['background', 'backgroundColor']) {
    for (const [vs, ve] of propValueSpans(body, prop)) {
      const val = body.slice(vs, ve);
      // gradient içindeki açık duraklar zemini açık YAPMAZ (metin gradientin üstünde değil)
      if (/gradient/i.test(val)) continue;
      // hex zeminler
      for (const m of val.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
        const lum = hexLum(m[0]);
        if (lum !== null && lum > 0.5) return true;
      }
      // rgb()/rgba() zeminler — alfa>0.5 VE parlaklık>0.5 ise katı açık zemin
      for (const m of val.matchAll(/rgba?\(([^)]+)\)/gi)) {
        const p = m[1].split(',').map((x) => parseFloat(x));
        if (p.length < 3) continue;
        const a = p[3] === undefined ? 1 : p[3];
        const lin = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
        const lum = 0.2126 * lin(p[0]) + 0.7152 * lin(p[1]) + 0.0722 * lin(p[2]);
        if (a > 0.5 && lum > 0.5) return true;
      }
    }
  }
  return false;
}

// Bir style-block gövdesinde top-level `<prop>:` değerlerinin [start,end) aralıkları
function propValueSpans(body, prop) {
  const spans = [];
  let depth = 0, i = 0, str = null;
  while (i < body.length) {
    const c = body[i];
    if (str) { if (c === '\\') { i += 2; continue; } if (c === str) str = null; i++; continue; }
    if (c === "'" || c === '"' || c === '`') { str = c; i++; continue; }
    if (c === '(' || c === '[' || c === '{') { depth++; i++; continue; }
    if (c === ')' || c === ']' || c === '}') { depth--; i++; continue; }
    if (depth === 0 && body.startsWith(prop, i) && !isWord(body[i - 1] || ' ')) {
      let j = i + prop.length;
      while (j < body.length && /\s/.test(body[j])) j++;
      if (body[j] === ':') {
        j++;
        const valStart = j;
        let d2 = 0, s2 = null, k = j;
        while (k < body.length) {
          const cc = body[k];
          if (s2) { if (cc === '\\') { k += 2; continue; } if (cc === s2) s2 = null; k++; continue; }
          if (cc === "'" || cc === '"' || cc === '`') { s2 = cc; k++; continue; }
          if (cc === '(' || cc === '[' || cc === '{') { d2++; k++; continue; }
          if (cc === ')' || cc === ']' || cc === '}') { if (d2 === 0) break; d2--; k++; continue; }
          if (cc === ',' && d2 === 0) break;
          k++;
        }
        spans.push([valStart, k]);
        i = k; continue;
      }
    }
    i++;
  }
  return spans;
}

// `style={{ ... }}` bloklarını dengeli süslü parantezle bul → [innerStart, innerEnd)
function styleBlocks(code) {
  const blocks = [];
  const re = /style=\{\{/g;
  let m;
  while ((m = re.exec(code))) {
    let i = m.index + m[0].length;
    let depth = 2;
    const start = i;
    while (i < code.length && depth > 0) {
      const ch = code[i];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      i++;
    }
    blocks.push([start, i - 2]);
  }
  return blocks;
}

const lineAt = (code, idx) => code.slice(0, idx).split('\n').length;
const FILES = ['GalakSay.jsx', 'src/components/math/TripleCode.jsx',
  'src/design-system/components/ActivityLayout.jsx'];

let totalChanges = 0;
for (const relPath of FILES) {
  const file = join(root, relPath);
  let code;
  try { code = readFileSync(file, 'utf8'); } catch { continue; }
  const skip = SKIP[relPath] || new Set();
  // Tüm değişiklikleri (mutlak ofset) topla, sonra sondan başa uygula
  const edits = [];
  for (const [bStart, bEnd] of styleBlocks(code)) {
    const body = code.slice(bStart, bEnd);
    if (blockHasLightBg(body)) continue; // aynı blokta açık zemin → koyu metin kasıtlı, atla
    for (const [vs, ve] of propValueSpans(body, 'color')) {
      const absVs = bStart + vs, absVe = bStart + ve;
      let val = code.slice(absVs, absVe);
      let changed = val;
      for (const [oldHex, newHex] of Object.entries(REMAP)) {
        const re = new RegExp(oldHex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        changed = changed.replace(re, newHex);
      }
      if (changed !== val) {
        const ln = lineAt(code, absVs);
        if (skip.has(ln)) continue;
        edits.push({ absVs, absVe, val, changed, ln });
      }
    }
  }
  if (!edits.length) continue;
  edits.sort((a, b) => b.absVs - a.absVs);
  let out = code;
  for (const e of edits) {
    out = out.slice(0, e.absVs) + e.changed + out.slice(e.absVe);
    console.log(`  ${relPath}:${e.ln}  ${e.val.trim()}  →  ${e.changed.trim()}`);
    totalChanges++;
  }
  if (!DRY) writeFileSync(file, out);
}
console.log(`\n${DRY ? '[DRY] ' : ''}${totalChanges} metin-rengi değiştirildi.`);
