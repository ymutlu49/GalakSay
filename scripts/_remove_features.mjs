import fs from 'fs';
const F = process.argv[2];
let lines = fs.readFileSync(F, 'utf8').split('\n');

// 1-indexed inclusive ranges; guard = substring on FIRST line; endChk = expected trimmed LAST line (null = skip)
const ranges = [
  { start: 7450, end: 7464, guard: 'screeningMode', endChk: '}, [screeningCurrent, screeningMode]);', name: 'screening state + flash effect' },
  { start: 1254, end: 1322, guard: 'const SCREENING', endChk: '};', name: 'inline SCREENING definition' },
];

for (const r of ranges) {
  const first = lines[r.start - 1];
  if (!first || !first.includes(r.guard)) {
    console.error(`GUARD FAIL [${r.name}] @${r.start}: beklenen "${r.guard}", bulunan: ${JSON.stringify(first)}`);
    process.exit(1);
  }
  if (r.endChk) {
    const last = lines[r.end - 1];
    if (!last || last.trim() !== r.endChk) {
      console.error(`END FAIL [${r.name}] @${r.end}: beklenen "${r.endChk}", bulunan: ${JSON.stringify(last)}`);
      process.exit(1);
    }
  }
}

ranges.sort((a, b) => b.start - a.start);
let removed = 0;
for (const r of ranges) {
  const n = r.end - r.start + 1;
  lines.splice(r.start - 1, n);
  removed += n;
  console.log(`silindi [${r.name}]: ${n} satır`);
}
fs.writeFileSync(F, lines.join('\n'));
console.log(`TOPLAM silinen: ${removed} satır | yeni toplam: ${lines.length}`);
