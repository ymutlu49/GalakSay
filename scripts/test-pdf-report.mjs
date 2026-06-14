// Gerçek renderReport'u Türkçe mock veriyle çalıştır → cf-deploy/_test-report.pdf
import { jsPDF } from 'jspdf';
import { writeFileSync } from 'node:fs';
import { renderReport } from '../src/analytics/PDFReportGenerator.js';
import { ROBOTO_REGULAR_B64, ROBOTO_BOLD_B64 } from '../src/analytics/pdfFonts.js';

const data = {
  childInfo: { name: 'Yaşar Aydın' },
  profile: {
    overallAccuracy: 0.78,
    categoryMetrics: {
      level1: { accuracy: 0.92, avgRT: 3200, avgHint: 0.4, rtTrend: { direction: 'improving' } },
      level2: { accuracy: 0.81, avgRT: 4100, avgHint: 0.9, rtTrend: { direction: 'stable' } },
      level3: { accuracy: 0.64, avgRT: 5300, avgHint: 1.8, rtTrend: { direction: 'declining' } },
      level4: { accuracy: 0.55, avgRT: 6200, avgHint: 2.3, rtTrend: { direction: 'improving' } },
      level5: { accuracy: 0.71, avgRT: 4800, avgHint: 1.2, rtTrend: { direction: 'stable' } },
    },
  },
  ltLevels: { level1: { level: 8 }, level2: { level: 6 }, level3: { level: 4 }, level4: { level: 3 }, level5: { level: 5 } },
  learningMap: { totalModulesCompleted: 23, totalModules: 60 },
  risk: { overallRisk: 3 },
  nuMapComp: {
    nuMapRiskLevel: 4, currentRiskLevel: 3, change: 'improved', timeElapsed_days: 42,
    categoryComparisons: [
      { category: 'level1', nuMapScore: 55, currentScore: 78, trend: 'improved' },
      { category: 'level3', nuMapScore: 62, currentScore: 58, trend: 'worsened' },
      { category: 'level5', nuMapScore: 70, currentScore: 71, trend: 'stable' },
    ],
  },
  sw: {
    strengths: [
      { area: 'Sayma ve Birebir Eşleme', evidence: 'Sayalon görevlerinde %92 doğruluk, hızlanan tepki süresi.' },
      { area: 'Görsel Çokluk Tanıma', evidence: 'Şimşek modunda bir bakışta doğru tahmin oranı yükseliyor.' },
    ],
    weaknesses: [
      { area: 'Karşılaştırma (Büyük/Küçük)', evidence: 'Terazya görevlerinde ipucu ihtiyacı artıyor; düşüş eğilimi.' },
      { area: 'Sayı Yapısı / Bileşim', evidence: 'Onluk bozma sorularında doğruluk %55 — çözme süresi uzun.' },
    ],
  },
  recs: {
    activityRecommendations: [
      { reason: 'Karşılaştırma alanında küçük sayı farklarıyla başlayıp kademeli zorlaştırın.', priority: 'Yüksek' },
      { reason: 'Onluk çerçeve ile bileşim çalışması — somut → resimsel → soyut sıralaması.', priority: 'Orta' },
      { reason: 'Sayma gücünü pekiştirmek için günlük kısa oturumlar sürdürülmeli.', priority: 'Düşük' },
    ],
    scheduleRecommendations: { recommendedFrequency: 'Haftada 4–5 gün', optimalSessionDuration_min: 12 },
    parentGuidance: [
      { tip: 'Çalışma sırasında hız değil doğruluğu övün; hata öğrenmenin parçasıdır.' },
      { tip: 'Günlük yaşamda sayıları kullanın: sofra kurarken, alışverişte birlikte sayın.' },
    ],
    professionalReferral: {
      needed: true,
      reason: 'Karşılaştırma ve sayı yapısı alanlarındaki süregelen güçlük, uzman değerlendirmesini destekler.',
      suggestedProfessional: 'Özel öğrenme güçlüğü konusunda deneyimli psikolog / özel eğitim uzmanı',
    },
  },
  sessions: Array.from({ length: 31 }, () => ({ durationMs: 11 * 60000 })),
};

const doc = new jsPDF('p', 'mm', 'a4');
const name = renderReport(doc, data, { childId: 'abcdef0123456789', anonymous: false, fonts: { regular: ROBOTO_REGULAR_B64, bold: ROBOTO_BOLD_B64 } });
writeFileSync(new URL('../cf-deploy/_test-report.pdf', import.meta.url), Buffer.from(doc.output('arraybuffer')));
console.log('WROTE cf-deploy/_test-report.pdf for', name, '— pages:', doc.internal.getNumberOfPages());
