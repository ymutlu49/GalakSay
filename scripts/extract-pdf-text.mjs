// _test-report.pdf'ten metin çıkar → Türkçe karakterler gerçekten işlenmiş mi doğrula
import { readFileSync } from 'node:fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const data = new Uint8Array(readFileSync(new URL('../cf-deploy/_test-report.pdf', import.meta.url)));
const pdf = await getDocument({ data, useWorkerFetch: false, isEvalSupported: false }).promise;
let all = '';
for (let i = 1; i <= pdf.numPages; i++) {
  const p = await pdf.getPage(i);
  const tc = await p.getTextContent();
  all += tc.items.map(it => it.str).join(' ') + '\n──── sayfa ' + i + ' ────\n';
}
console.log(all);
const turkishWords = ['Yaşar Aydın', 'Yönetici Özeti', 'Güçlü Alanlar', 'Gelişim Alanları', 'Öğrenme Yörüngesi', 'Doğruluk', 'İpucu', 'Çalışma', 'Öneriler', 'değildir'];
console.log('\n===== TÜRKÇE KARAKTER DENETİMİ =====');
for (const w of turkishWords) console.log((all.includes(w) ? '✓' : '✗ EKSİK') + '  ' + w);
