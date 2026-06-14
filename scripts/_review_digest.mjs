import fs from 'fs';
import path from 'path';
import os from 'os';

const SRC = process.argv[2];
const raw = fs.readFileSync(SRC, 'utf8');
let data;
try { data = JSON.parse(raw); } catch (e) {
  const i = raw.indexOf('{');
  data = JSON.parse(raw.slice(i));
}
const root = data.result || data;
const results = root.results || [];
const norm = s => (s == null ? '' : s).toString().replace(/\s+/g, ' ').trim();

let all = [];
for (const r of results) {
  for (const f of (r.findings || [])) {
    all.push({
      mode: r.mode, planet: r.planet, skill: r.skillAlignment,
      severity: f.severity, lens: f.lens, title: norm(f.title),
      file: f.file || 'GalakSay.jsx', line: f.line,
      problem: norm(f.problem), fix: norm(f.fix), levels: norm(f.affectedLevels),
      verdict: f.verdict || null,
    });
  }
}
const isConfirmed = f => !f.verdict || f.verdict.isReal !== false;
const rejected = all.filter(f => f.verdict && f.verdict.isReal === false);
const confirmed = all.filter(isConfirmed);

function block(f) {
  let s = `#### [${f.mode}] ${f.title}\n`;
  s += `- ${f.severity} · ${f.lens} · ${f.levels || '?'} · \`${f.file}:${f.line || '?'}\`\n`;
  s += `- Problem: ${f.problem}\n`;
  s += `- Fix: ${f.fix}\n`;
  if (f.verdict) {
    s += `- Doğrulama: isReal=${f.verdict.isReal} (${f.verdict.confidence}), fix=${f.verdict.fixSoundness}`;
    if (f.verdict.fixSoundness !== 'sağlam' && f.verdict.adjustedFix) s += ` → ${norm(f.verdict.adjustedFix)}`;
    s += `\n`;
  }
  return s + '\n';
}
const bySev = {};
for (const sev of ['kritik', 'yüksek', 'orta', 'düşük'])
  bySev[sev] = confirmed.filter(f => f.severity === sev).sort((a, b) => norm(a.planet).localeCompare(norm(b.planet)));

const tmp = path.join(os.tmpdir(), 'galaksay-digest');
fs.mkdirSync(tmp, { recursive: true });

for (const [sev, file] of [['kritik', 'kritik.md'], ['yüksek', 'yuksek.md']]) {
  let h = `# ${sev.toUpperCase()} (doğrulanmış: ${bySev[sev].length})\n\n`;
  let cur = '';
  for (const f of bySev[sev]) { if (f.planet !== cur) { h += `\n## ${f.planet}\n\n`; cur = f.planet; } h += block(f); }
  fs.writeFileSync(path.join(tmp, file), h);
}
let oh = `# ORTA (${bySev['orta'].length}) — tek satır\n\n`;
for (const f of bySev['orta']) oh += `- [${f.mode}] (${f.lens}) ${f.title} — \`${f.file}:${f.line || '?'}\`\n`;
oh += `\n# DÜŞÜK (${bySev['düşük'].length})\n\n`;
for (const f of bySev['düşük']) oh += `- [${f.mode}] (${f.lens}) ${f.title}\n`;
fs.writeFileSync(path.join(tmp, 'orta-dusuk.md'), oh);

let rh = `# REDDEDİLEN yanlış-pozitif (${rejected.length})\n\n`;
for (const f of rejected) rh += `- [${f.mode}] ${f.title}\n  → ${norm(f.verdict.reasoning).slice(0, 300)}\n\n`;
fs.writeFileSync(path.join(tmp, 'rejected.md'), rh);

const themes = {
  'Cevap sızıntısı': /sız|ele ver|cevab. (ele|aç|gör)|açık göster|açık denklem|ipucu.*cevap/i,
  'Yaş-üstü üst sınır': /yaş.?üst|üst sınır|100.e|çarpım.*(büyük|56|72|81)|aşırı büyük|sınırla/i,
  'Sanbil flaş eksik': /flaş|flash|saymadan|bir bakış|kalıcı göster/i,
  'Yakın-fark ayırt edilemez': /\|fark\|=1|yakın.?fark|fark=1|fark 1|ayırt edil|bir fark/i,
  'Renk-körü güvenliği': /renk.?kör|dalton|deuteran|renk tek|sadece renk|renge bağ/i,
  'Kontrast/punto': /kontrast|punto|okunmu|okunaks|okunabil|font|≥ ?12|küçük (metin|yazı|punto)/i,
  'Dokunma hedefi': /dokunma hedef|44 ?px|touch target|küçük buton|küçük dokun/i,
  'Kalabalık/sadelik': /kalabalık|sade|çok.?katman|aşırı anim|yığıl|fazla bilgi/i,
  'Görsel ≠ gerçek değer': /görsel.*gerçek|gerçek.*görsel|cap.*görsel|eksik görsel|yanlış görsel|miktar.*eşleş/i,
  'Ön-okur anlaşılırlık': /ön.?okur|okuyam|sözel yönerge|belirsiz|ikon yok|yön ikon|anla(şıl|m)/i,
};
let th = `# TEMA dağılımı (doğrulanmış kritik+yüksek)\n\n`;
const ky = confirmed.filter(f => f.severity === 'kritik' || f.severity === 'yüksek');
const counts = [];
for (const [name, re] of Object.entries(themes)) {
  const hits = ky.filter(f => re.test(f.title + ' ' + f.problem));
  counts.push([name, hits.length]);
  th += `## ${name} — ${hits.length}\n`;
  for (const f of hits) th += `- [${f.mode}/${f.severity}] ${f.title} (\`${f.file}:${f.line || '?'}\`)\n`;
  th += '\n';
}
fs.writeFileSync(path.join(tmp, 'temalar.md'), th);

// per-mode summary table
let mt = `# Mod başına özet (kritik/yüksek/orta/düşük · beceri-uyumu)\n\n`;
for (const r of results) {
  const c = { kritik: 0, 'yüksek': 0, orta: 0, 'düşük': 0 };
  for (const f of (r.findings || [])) if (isConfirmed(f)) c[f.severity] = (c[f.severity] || 0) + 1;
  mt += `- ${r.mode} (${r.planet}) — K${c.kritik} Y${c['yüksek']} O${c.orta} D${c['düşük']} · uyum:${r.skillAlignment}\n`;
}
fs.writeFileSync(path.join(tmp, 'mod-ozet.md'), mt);

console.log('DIGEST DIR:', tmp);
console.log('Toplam doğrulanmış:', confirmed.length, '| kritik', bySev['kritik'].length, 'yüksek', bySev['yüksek'].length, 'orta', bySev['orta'].length, 'düşük', bySev['düşük'].length, '| reddedilen', rejected.length);
console.log('\nTEMA SAYILARI:');
counts.sort((a, b) => b[1] - a[1]).forEach(([n, c]) => console.log(`  ${c}\t${n}`));
