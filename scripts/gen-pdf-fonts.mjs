// Roboto Regular + Bold TTF indir → base64 → src/analytics/pdfFonts.js (jsPDF Türkçe desteği)
import { writeFileSync } from 'node:fs';

const SOURCES = {
  regular: [
    'https://cdn.jsdelivr.net/npm/@expo-google-fonts/roboto@0.2.3/Roboto_400Regular.ttf',
    'https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.0.8/files/roboto-latin-ext-400-normal.woff', // woff fallback (jsPDF ttf ister; sadece ttf URL'leri tercih)
  ],
  bold: [
    'https://cdn.jsdelivr.net/npm/@expo-google-fonts/roboto@0.2.3/Roboto_700Bold.ttf',
  ],
};

async function dl(urls) {
  for (const url of urls) {
    try {
      const r = await fetch(url, { redirect: 'follow' });
      if (!r.ok) { console.log('  skip', r.status, url); continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      // TTF magic: 00 01 00 00  veya 'true'/'OTTO'
      const sig = buf.subarray(0, 4).toString('hex');
      console.log('  ok', url, buf.length, 'bytes, sig', sig);
      if (!url.endsWith('.ttf')) { console.log('  (not ttf, skipping)'); continue; }
      return buf;
    } catch (e) { console.log('  err', url, e.message); }
  }
  throw new Error('no source worked');
}

console.log('regular:');
const reg = await dl(SOURCES.regular);
console.log('bold:');
const bold = await dl(SOURCES.bold);

const out = `// AUTO-GENERATED — Roboto TTF (Apache-2.0) base64, jsPDF Türkçe karakter desteği için.
// Üretim: scripts/gen-pdf-fonts.mjs
export const ROBOTO_REGULAR_B64 = "${reg.toString('base64')}";
export const ROBOTO_BOLD_B64 = "${bold.toString('base64')}";
`;
writeFileSync(new URL('../src/analytics/pdfFonts.js', import.meta.url), out);
console.log('WROTE src/analytics/pdfFonts.js — regular', reg.length, 'bold', bold.length, '→ b64', Math.round((reg.length + bold.length) * 1.34 / 1024), 'KB');
