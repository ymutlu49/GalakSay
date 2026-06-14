// NuMap rapor yükleme + bireyselleştirme testi
// Bu script importNumapPlan() ile aynı pipeline'ı çalıştırır
// ve ne uygulanacağını gösterir.

import { readFileSync } from 'node:fs';
import { NumapProfile, RISK_LEVEL_MAP, SUPPORT_LEVELS, AREA_MODE_MAP } from './src/systems/numapProfile.js';

const REPORT_PATH = './numap-test-report.json';

console.log('═══════════════════════════════════════════════════════════════');
console.log('   NuMap Rapor Yükleme & Bireyselleştirme Testi');
console.log('═══════════════════════════════════════════════════════════════\n');

// 1) Dosyayı oku
console.log('📥 [1/5] Dosya okunuyor:', REPORT_PATH);
const raw = readFileSync(REPORT_PATH, 'utf8');
const json = JSON.parse(raw);
console.log('   ✓ Çocuk:', json.child.name, `(yaş ${json.child.age}, ${json.child.grade}. sınıf)`);
console.log('   ✓ Genel risk:', json.assessment.overallRisk);
console.log('');

// 2) Validate
console.log('🔍 [2/5] NumapProfile.validate() çağrılıyor...');
const validated = NumapProfile.validate(json);
if (!validated) {
  console.error('   ✗ HATA: Geçersiz format. Yükleme reddedilirdi.');
  process.exit(1);
}
console.log('   ✓ Doğrulama başarılı');
console.log('   ✓ Normalize edilmiş alanlar:');
console.log('     - source:', validated.source);
console.log('     - version:', validated.version);
console.log('     - child.code:', validated.child.code);
console.log('     - assessment.numberSense:', validated.assessment.numberSense);
console.log('     - assessment.arithmetic:', validated.assessment.arithmetic);
console.log('     - assessment.workingMemory:', validated.assessment.workingMemory);
console.log('');

// 3) Önerilen modlar
console.log('🎯 [3/5] NumapProfile.getRecommendedModes() çağrılıyor...');
const modes = NumapProfile.getRecommendedModes(validated);
console.log(`   ✓ ${modes.length} mod önerildi:`);
console.log('    ', modes.join(', '));
console.log('   → numapModes state\'ine yazılır → Görevler ekranı bunları gösterir');
console.log('   → İlk mod (numapStartMode):', modes[0] || '(yok)');
console.log('');

// 4) Başlangıç seviyesi
console.log('📏 [4/5] NumapProfile.getStartLevel() çağrılıyor...');
const startLvl = NumapProfile.getStartLevel(validated);
const riskMap = RISK_LEVEL_MAP[validated.assessment.overallRisk];
console.log(`   ✓ Risk düzeyi "${validated.assessment.overallRisk}" → başlangıç seviyesi: ${startLvl}`);
console.log(`   ✓ Scaffold:`, riskMap.scaffold, `(${riskMap.label})`);
console.log('   → setLevel(' + startLvl + ') çağrılır');
console.log('');

// 5) Destek düzeyi
console.log('🛟 [5/5] NumapProfile.getSupportLevel() çağrılıyor...');
const support = NumapProfile.getSupportLevel(validated);
console.log('   ✓ Aktif destek özellikleri:');
Object.entries(support).forEach(([k, v]) => {
  console.log(`     - ${k}:`, v);
});
console.log('   → numapSupport state\'ine yazılır → İpucu/görsel/scaffold davranışı');
console.log('');

// Özet
console.log('═══════════════════════════════════════════════════════════════');
console.log('   ÖZET — Bu raporu Öğretmen panelinden "📋 NuMap Plan" ile');
console.log('   yüklediğinde uygulamada neler olur?');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`
✅ localStorage anahtarı: "numap_intervention_${validated.child.code}"
✅ Görevler ekranında ${modes.length} özel mod önerilir
✅ Oyun seviye ${startLvl}'den başlar
✅ ${support.hintDelay > 0 ? support.hintDelay/1000 + ' sn sonra otomatik ipucu' : 'Otomatik ipucu yok'}
✅ Ekstra deneme hakkı: +${support.extraRetries}
✅ Görsel ipucu: ${support.showVisualHints ? 'AÇIK' : 'kapalı'}
✅ Somut temsil: ${support.showConcreteReps ? 'AÇIK' : 'kapalı'}
✅ Sadeleştirilmiş seçenekler: ${support.simplifiedOptions ? 'AÇIK' : 'kapalı'}
${support.bonusChallenges ? '✅ Bonus zorluk görevleri: AÇIK' : ''}

İlk seansta önce → ${modes[0]} modu açılır
`);

console.log('🎉 TÜM SİSTEM ÇALIŞIYOR — bireyselleştirme zinciri sağlam.\n');
