// KU terminoloji tutarlılığı (FerMat): toplama=zêdekirin, çıkarma=kêmkirin, sayı=jimar
// Büyük/küçük harf korunur; "Kombûnya"/"Kombûnyayê" GEZEGEN adı korunur (negatif lookahead).
// NOT: "kom bike"/"jê bike" fiilleri bağlama duyarlı → bu script onlara DOKUNMAZ (elle düzeltilir).
import { readFileSync, writeFileSync } from 'fs';

const files = [
  'GalakSay.jsx',
  'src/data/categories.js',
  'src/data/modeStories.js',
  'src/data/learnContent.js',
  'src/data/wordProblemTemplates.js',
];

const rules = [
  // sayı: hejmar → jimar (jimartin/Jimaron/bijmêre 'hejmar' içermez, etkilenmez)
  [/Hejmar/g, 'Jimar'],
  [/hejmar/g, 'jimar'],
  // çıkarma: jêkirin → kêmkirin
  [/Jêkirin/g, 'Kêmkirin'],
  [/jêkirin/g, 'kêmkirin'],
  // toplama: kombûn → zêdekirin, ama gezegen "Kombûnya"/"Kombûnyayê" (ardından 'ya') KORUNUR
  [/Kombûn(?!ya)/g, 'Zêdekirin'],
  [/kombûn(?!ya)/g, 'zêdekirin'],
  // FİİL hizalaması (isimlerle tutarlılık): çıkar = kêm bike (hep çıkarma), topla = zêde bike
  // NOT: "Kom Bike" (büyük B, mod başlıkları/gruplama) ve birkaç gruplama yeri elle korunur/geri alınır
  [/\bjê (bike|bikim|dike|dikim|kir)\b/g, 'kêm $1'],
  [/\bKom (bike|dike)\b/g, 'Zêde $1'],
  [/\bkom (bike|bikim|dike|dikim|kir)\b/g, 'zêde $1'],
  // 'î' ile biten biçimler (JS \b Unicode 'î' sonrası çalışmaz) — ayrı, sondaki \b olmadan:
  [/\bjê bikî/g, 'kêm bikî'],
  [/\bjê dikî/g, 'kêm dikî'],
  [/\bkom bikî/g, 'zêde bikî'],
  [/\bkom dikî/g, 'zêde dikî'],
];

for (const f of files) {
  let s = readFileSync(f, 'utf8');
  const before = s;
  const report = {};
  for (const [re, rep] of rules) {
    const m = s.match(re);
    if (m) report[re.source] = m.length;
    s = s.replace(re, rep);
  }
  if (s !== before) { writeFileSync(f, s, 'utf8'); console.log(f, JSON.stringify(report)); }
  else console.log(f, 'değişiklik yok');
  // kalan bağlam-duyarlı fiilleri raporla
  const komBike = (s.match(/\bkom (bike|bikî|dike|dikim|kir|bik)/gi) || []).length;
  const jeBike = (s.match(/\bjê (bike|bikî|dike|kir|bik)/gi) || []).length;
  if (komBike || jeBike) console.log(`   ↳ elle bakılacak: "kom bike"×${komBike}, "jê bike"×${jeBike}`);
}
