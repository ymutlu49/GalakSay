// 3 farklı profil + 2 hatalı girdi: bireyselleştirme matrisi
import { NumapProfile, RISK_LEVEL_MAP, SUPPORT_LEVELS } from './src/systems/numapProfile.js';

const profiles = {
  // YÜKSEK RİSK — diskalkuli olası
  highRiskAhmet: {
    source: 'numap', version: '1.0',
    child: { name: 'Ahmet (yüksek risk)', code: 'AHMET_H', age: 7, grade: 1 },
    assessment: {
      numberSense: { score: 28, level: 'low' },
      arithmetic: { score: 22, level: 'low' },
      workingMemory: { score: 35, level: 'low' },
      overallRisk: 'high',
    },
    priority: [
      { area: 'numberSense', modes: ['counting', 'subitizing'] },
      { area: 'arithmetic', modes: ['addChips', 'makeFive'] },
    ],
    secondary: [],
  },
  // ORTA RİSK — bazı zorluklar
  medRiskZeynep: {
    source: 'numap', version: '1.0',
    child: { name: 'Zeynep (orta risk)', code: 'ZEYNEP_M', age: 8, grade: 2 },
    assessment: {
      numberSense: { score: 58, level: 'medium' },
      arithmetic: { score: 48, level: 'medium' },
      workingMemory: { score: 65, level: 'medium' },
      overallRisk: 'medium',
    },
    priority: [
      { area: 'arithmetic', modes: ['addition', 'subtraction', 'partWhole'] },
    ],
    secondary: [
      { area: 'placeValue', modes: ['composeNumber', 'expandForm'] },
    ],
  },
  // DÜŞÜK RİSK — yaş üstü
  lowRiskMehmet: {
    source: 'numap', version: '1.0',
    child: { name: 'Mehmet (düşük risk)', code: 'MEHMET_L', age: 8, grade: 2 },
    assessment: {
      numberSense: { score: 85, level: 'high' },
      arithmetic: { score: 78, level: 'high' },
      workingMemory: { score: 88, level: 'high' },
      overallRisk: 'low',
    },
    priority: [
      { area: 'multiplication', modes: ['repeatAdd', 'arrayDots', 'timesTable'] },
    ],
    secondary: [],
  },
  // BOZUK — zorla source eksik
  invalidNoSource: {
    version: '1.0',
    child: { name: 'X' },
    randomField: 'şarap',
  },
  // BOZUK — string null
  invalidNull: null,
};

const printRow = (label, data) => {
  const validated = NumapProfile.validate(data);
  if (!validated) {
    console.log(`\n❌ ${label}`);
    console.log('   → validate() null döndü — yükleme REDDEDİLDİ. alert("Geçersiz dosya")');
    return;
  }
  const modes = NumapProfile.getRecommendedModes(validated);
  const startLvl = NumapProfile.getStartLevel(validated);
  const support = NumapProfile.getSupportLevel(validated);
  const scaffold = NumapProfile.getScaffoldOverride(validated);
  console.log(`\n✅ ${label}`);
  console.log(`   Risk           : ${validated.assessment.overallRisk}`);
  console.log(`   Başlangıç sv.  : ${startLvl}`);
  console.log(`   Scaffold       : ${scaffold} (${RISK_LEVEL_MAP[validated.assessment.overallRisk].label})`);
  console.log(`   Önerilen mod # : ${modes.length}`);
  console.log(`   İlk mod        : ${modes[0] || '(yok)'}`);
  console.log(`   Tüm modlar     : [${modes.join(', ')}]`);
  console.log(`   İpucu gecikme  : ${support.hintDelay}ms`);
  console.log(`   Görsel ipucu   : ${support.showVisualHints}`);
  console.log(`   Sadeleşt. seç. : ${support.simplifiedOptions}`);
  console.log(`   Ekstra deneme  : +${support.extraRetries}`);
  if (support.bonusChallenges) console.log(`   Bonus zorluk   : AÇIK`);
};

console.log('═══════════════════════════════════════════════════════════════');
console.log('  Bireyselleştirme Matrisi — 3 Profil × validate() pipeline');
console.log('═══════════════════════════════════════════════════════════════');

for (const [k, v] of Object.entries(profiles)) {
  printRow(k, v);
}

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  Doğrulama: aynı risk farklı modlar ÜRETİYOR mu? (kontrast testi)');
console.log('═══════════════════════════════════════════════════════════════\n');

const high = NumapProfile.validate(profiles.highRiskAhmet);
const low = NumapProfile.validate(profiles.lowRiskMehmet);

console.log('Yüksek risk başlangıç seviyesi:', NumapProfile.getStartLevel(high), '(beklenen 1)');
console.log('Düşük risk  başlangıç seviyesi:', NumapProfile.getStartLevel(low),  '(beklenen 3)');
console.log('Yüksek risk  hint delay      :', NumapProfile.getSupportLevel(high).hintDelay, '(beklenen 3000)');
console.log('Düşük risk   hint delay      :', NumapProfile.getSupportLevel(low).hintDelay,  '(beklenen 0)');

const matchesExpected =
  NumapProfile.getStartLevel(high) === 1 &&
  NumapProfile.getStartLevel(low) === 3 &&
  NumapProfile.getSupportLevel(high).hintDelay === 3000 &&
  NumapProfile.getSupportLevel(low).hintDelay === 0;

console.log('\n' + (matchesExpected
  ? '🎉 Bireyselleştirme matrisi DOĞRU — risk düzeyine göre farklı çıktı üretiyor.'
  : '⚠️  Beklenen değerlerle uyumsuz — bug var.'));
