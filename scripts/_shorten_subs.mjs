import fs from 'fs';
const F = process.argv[2];
let text = fs.readFileSync(F, 'utf8');

// [old, new] — exact substring replacements (double-quoted JS strings; backtick/${} are literal here)
const pairs = [
  ["<SUB>{lang === \"ku\" ? \"Berî veşartinê bijmêre û bîne bîra xwe!\" : \"Gizlenmeden önce say ve hatırla!\"}</SUB>",
   "<SUB>Gizlenecek!</SUB>"],
  ["<SUB>{rbDisplayLabel} birazdan gizlenecek — saydığın sayıyı hatırla!</SUB>",
   "<SUB>{rbDisplayLabel} birazdan gizlenecek!</SUB>"],
  ["<SUB>{pwDone ? `✅ ${q.part1} + ${needed} = ${q.whole}` : `Boş yuvalara dokunarak ${needed} yıldız taşı daha ekle!`}</SUB>",
   "<SUB>{pwDone ? `✅ ${q.part1} + ${needed} = ${q.whole}` : \"Boş yuvalara dokun\"}</SUB>"],
  ["<SUB>{q.subType === \"before\" ? \"Bir önceki sayı = 1 eksik\" : q.subType === \"after\" ? \"Bir sonraki sayı = 1 fazla\" : \"Ortadaki sayıyı bulmak için sırayla say!\"}</SUB>",
   "<SUB>{q.subType === \"between\" ? \"Sırayla say\" : \"\"}</SUB>"],
  ["<SUB>{isMixed ? \"Farklı gösterimleri karşılaştır!\" : \"Az mı, eşit mi, çok mu?\"}</SUB>",
   "<SUB>{isMixed ? \"Gösterimler farklı\" : \"\"}</SUB>"],
  ["<SUB>{ocDirLabel} başlayarak say: birinci, ikinci, üçüncü...</SUB>",
   "<SUB>{ocDirLabel} say</SUB>"],
  ["<SUB>Bilinen kapsülle karşılaştır!</SUB>",
   "<SUB>Karşılaştır!</SUB>"],
  ["<SUB>{q.subType === \"half\" ? \"Yarıla: eşit iki gruba böl!\" : \"İkile: toplam kaç?\"}</SUB>",
   "<SUB>{q.subType === \"half\" ? \"Eşit ikiye böl\" : \"\"}</SUB>"],
  ["<SUB>{lang === \"ku\" ? \"Bi 10'an kom bike — yekekên mayî!\" : \"10'arlı grupla — kalan birlik!\"}</SUB>",
   "<SUB>10'arlı grupla</SUB>"],
  ["<SUB>Onluk kapsüllerini say!</SUB>",
   "<SUB>Onlukları say</SUB>"],
  ["<SUB>Kapsülleri seç ve karıştır!</SUB>",
   "<SUB>Kapsülleri seç</SUB>"],
  ["<SUB>{q.requiredCount} farklı bölme yolu bul!</SUB>",
   "<SUB>{q.requiredCount} farklı yol</SUB>"],
];

const report = [];
for (const [oldS, newS] of pairs) {
  if (text.includes(oldS)) { text = text.replace(oldS, newS); report.push(`OK    ${newS}`); }
  else report.push(`SKIP  ${oldS.slice(0, 50)}...`);
}
fs.writeFileSync(F, text);
console.log(report.join('\n'));
const skips = report.filter(r => r.startsWith('SKIP'));
console.log(`\n${report.length - skips.length}/${report.length} uygulandı, ${skips.length} atlandı`);
