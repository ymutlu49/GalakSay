// GalakSay Analytics — 2026-03-18 — PDF rapor üretim modülü

import jsPDF from 'jspdf';
import { getFullPerformanceProfile, CATEGORIES } from './PerformanceAnalyzer.js';
import { getCurrentLTLevels, getLearningMap, LT_RANGES } from './LTProgressEngine.js';
import { calculateRiskLevel, compareWithNuMapBaseline, screenDyscalculiaIndicators } from './RiskClassifier.js';
import { getStrengthWeaknessProfile, CATEGORY_LABELS } from './StrengthWeaknessMapper.js';
import { generateRecommendations } from './RecommendationEngine.js';
import { getChildProfile, getSessionsByChild } from './database.js';

// Türkçe karakter desteği için ASCII fallback
function turkishToAscii(text) {
  if (!text) return '';
  return text
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C');
}

function t(text) {
  return turkishToAscii(text);
}

async function generatePDFReport(childId, options = {}) {
  const { anonymous = false } = options;

  // Veri toplama
  const [childInfo, profile, ltLevels, learningMap, risk, nuMapComp, screening, sw, recs, sessions] = await Promise.all([
    getChildProfile(childId),
    getFullPerformanceProfile(childId),
    getCurrentLTLevels(childId),
    getLearningMap(childId),
    calculateRiskLevel(childId),
    compareWithNuMapBaseline(childId),
    screenDyscalculiaIndicators(childId),
    getStrengthWeaknessProfile(childId),
    generateRecommendations(childId),
    getSessionsByChild(childId),
  ]);

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const addPage = () => {
    doc.addPage();
    y = margin;
  };

  const checkPageBreak = (needed = 30) => {
    if (y + needed > pageHeight - margin) addPage();
  };

  // ── SAYFA 1: KAPAK ──────────────────────
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setTextColor(226, 232, 240);
  doc.setFontSize(28);
  doc.text(t('GalakSay'), pageWidth / 2, 80, { align: 'center' });

  doc.setFontSize(16);
  doc.text(t('Bireysel Gelisim Raporu'), pageWidth / 2, 100, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(148, 163, 184);
  const childName = anonymous ? `Ogrenci #${childId.slice(-6)}` : (childInfo?.name || 'Uzay Kasifi');
  doc.text(t(childName), pageWidth / 2, 130, { align: 'center' });

  doc.setFontSize(10);
  doc.text(t(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`), pageWidth / 2, 145, { align: 'center' });

  const totalSessions = sessions.length;
  const totalTimeMin = Math.round(sessions.reduce((s, x) => s + (x.durationMs || 0), 0) / 60000);
  doc.text(t(`Toplam: ${totalSessions} oturum, ${totalTimeMin} dakika`), pageWidth / 2, 155, { align: 'center' });

  doc.setFontSize(9);
  doc.text(t('Hazirlayan: GalakSay Degerlendirme Sistemi'), pageWidth / 2, 250, { align: 'center' });

  // ── SAYFA 2: YONETİCİ OZETİ ────────────
  addPage();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setTextColor(226, 232, 240);
  doc.setFontSize(16);
  doc.text(t('Yonetici Ozeti'), margin, y);
  y += 12;

  // Risk degisimi
  doc.setFontSize(11);
  doc.setTextColor(148, 163, 184);
  doc.text(t(`Genel Risk Duzeyi: ${risk.overallRisk} / 6`), margin, y);
  y += 8;
  doc.text(t(`Genel Dogruluk: %${Math.round(profile.overallAccuracy * 100)}`), margin, y);
  y += 8;
  doc.text(t(`Ilerleme: ${learningMap.totalModulesCompleted} / ${learningMap.totalModules} modul tamamlandi`), margin, y);
  y += 12;

  // Guclu alanlar
  doc.setTextColor(52, 211, 153);
  doc.setFontSize(12);
  doc.text(t('Guclu Alanlar:'), margin, y);
  y += 7;
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  for (const s of sw.strengths.slice(0, 3)) {
    doc.text(t(`  + ${s.area}: ${s.evidence}`), margin, y);
    y += 6;
  }
  if (sw.strengths.length === 0) { doc.text(t('  Henuz yeterli veri yok'), margin, y); y += 6; }
  y += 4;

  // Gelisim alanlari
  doc.setTextColor(251, 146, 44);
  doc.setFontSize(12);
  doc.text(t('Gelisim Alanlari:'), margin, y);
  y += 7;
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  for (const w of sw.weaknesses.slice(0, 3)) {
    doc.text(t(`  ! ${w.area}: ${w.evidence}`), margin, y);
    y += 6;
  }
  if (sw.weaknesses.length === 0) { doc.text(t('  Henuz yeterli veri yok'), margin, y); y += 6; }
  y += 8;

  // Oncelikli oneriler
  doc.setTextColor(34, 211, 238);
  doc.setFontSize(12);
  doc.text(t('Oncelikli Oneriler:'), margin, y);
  y += 7;
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  for (const r of recs.activityRecommendations.slice(0, 4)) {
    const lines = doc.splitTextToSize(t(`  - ${r.reason}`), contentWidth - 5);
    for (const line of lines) {
      checkPageBreak(7);
      doc.text(line, margin, y);
      y += 5;
    }
    y += 2;
  }

  // ── SAYFA 3: LT İLERLEME HARİTASI ─────
  addPage();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setTextColor(226, 232, 240);
  doc.setFontSize(16);
  doc.text(t('Ogrenme Yorungesi Ilerleme Haritasi'), margin, y);
  y += 14;

  for (const cat of CATEGORIES) {
    checkPageBreak(18);
    const level = ltLevels[cat]?.level || LT_RANGES[cat]?.min || 0;
    const range = LT_RANGES[cat] || { min: 0, max: 18 };
    const progress = ((level - range.min) / (range.max - range.min)) * 100;
    const label = CATEGORY_LABELS[cat] || cat;

    // Kategori adi
    doc.setFontSize(11);
    doc.setTextColor(226, 232, 240);
    doc.text(t(`${label} (L${level})`), margin, y);

    // Ilerleme cubugu
    const barX = margin;
    const barY = y + 3;
    const barW = contentWidth;
    const barH = 6;

    doc.setFillColor(30, 41, 59);
    doc.roundedRect(barX, barY, barW, barH, 2, 2, 'F');
    doc.setFillColor(34, 211, 238);
    doc.roundedRect(barX, barY, barW * (progress / 100), barH, 2, 2, 'F');

    // Baslangic/bitis etiketleri
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`L${range.min}`, barX, barY + barH + 4);
    doc.text(`L${range.max}`, barX + barW - 5, barY + barH + 4);

    y += 20;
  }

  // ── SAYFA 4-5: KATEGORİ BAZLI PERFORMANS ──
  addPage();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setTextColor(226, 232, 240);
  doc.setFontSize(16);
  doc.text(t('Kategori Bazli Detayli Performans'), margin, y);
  y += 12;

  // Tablo basliklari
  const colWidths = [45, 22, 28, 22, 20, 30];
  const headers = ['Kategori', 'Dogruluk', 'Yanit Sur.', 'Ipucu', 'LT', 'Trend'];

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  let x = margin;
  for (let i = 0; i < headers.length; i++) {
    doc.text(t(headers[i]), x, y);
    x += colWidths[i];
  }
  y += 3;
  doc.setDrawColor(51, 65, 85);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setFontSize(10);
  for (const cat of CATEGORIES) {
    checkPageBreak(10);
    const m = profile.categoryMetrics[cat] || {};
    x = margin;
    doc.setTextColor(226, 232, 240);
    doc.text(t(CATEGORY_LABELS[cat] || cat), x, y); x += colWidths[0];
    doc.text(`%${Math.round((m.accuracy || 0) * 100)}`, x, y); x += colWidths[1];
    doc.text(`${((m.avgRT || 0) / 1000).toFixed(1)}sn`, x, y); x += colWidths[2];
    doc.text(`${(m.avgHint || 0).toFixed(1)}`, x, y); x += colWidths[3];
    doc.text(`L${ltLevels[cat]?.level || 0}`, x, y); x += colWidths[4];
    doc.text(t(m.rtTrend?.direction === 'improving' ? 'Iyilesiyor' : m.rtTrend?.direction === 'declining' ? 'Gerileme' : 'Stabil'), x, y);
    y += 8;
  }

  // ── SAYFA 6: NuMap KARŞILAŞTIRMASI ──────
  if (nuMapComp) {
    addPage();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setTextColor(226, 232, 240);
    doc.setFontSize(16);
    doc.text(t('NuMap Karsilastirmasi'), margin, y);
    y += 12;

    doc.setFontSize(11);
    doc.setTextColor(148, 163, 184);
    doc.text(t(`Baslangic Risk Duzeyi: ${nuMapComp.nuMapRiskLevel} -> Guncel: ${nuMapComp.currentRiskLevel}`), margin, y);
    y += 8;
    doc.text(t(`Degisim: ${nuMapComp.change === 'improved' ? 'Iyilesme' : nuMapComp.change === 'worsened' ? 'Gerileme' : 'Stabil'}`), margin, y);
    y += 8;
    doc.text(t(`Gecen sure: ${nuMapComp.timeElapsed_days || '?'} gun`), margin, y);
    y += 12;

    for (const c of (nuMapComp.categoryComparisons || [])) {
      checkPageBreak(8);
      const trendText = c.trend === 'improved' ? 'Gelisim' : c.trend === 'worsened' ? 'Gerileme' : 'Stabil';
      doc.text(t(`${CATEGORY_LABELS[c.category] || c.category}: ${c.nuMapScore} -> ${c.currentScore} (${trendText})`), margin, y);
      y += 7;
    }
  }

  // ── SAYFA 7: ÖNERİLER ──────────────────
  addPage();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setTextColor(226, 232, 240);
  doc.setFontSize(16);
  doc.text(t('Oneriler ve Yol Haritasi'), margin, y);
  y += 12;

  doc.setFontSize(11);
  doc.setTextColor(34, 211, 238);
  doc.text(t('Oncelikli Calisma Alanlari:'), margin, y);
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  for (const r of recs.activityRecommendations.slice(0, 5)) {
    const lines = doc.splitTextToSize(t(`- [${r.priority}] ${r.reason}`), contentWidth - 5);
    for (const line of lines) {
      checkPageBreak(6);
      doc.text(line, margin + 4, y);
      y += 5;
    }
    y += 2;
  }
  y += 4;

  // Calisma duzeni
  doc.setTextColor(34, 211, 238);
  doc.setFontSize(11);
  doc.text(t('Calisma Duzeni:'), margin, y);
  y += 7;
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(t(`- ${recs.scheduleRecommendations.recommendedFrequency}`), margin + 4, y);
  y += 6;
  doc.text(t(`- Oturum suresi: ${recs.scheduleRecommendations.optimalSessionDuration_min} dakika`), margin + 4, y);
  y += 10;

  // Ebeveyn ipuclari
  doc.setTextColor(34, 211, 238);
  doc.setFontSize(11);
  doc.text(t('Ebeveyn Icin Ipuclari:'), margin, y);
  y += 7;
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  for (const g of recs.parentGuidance.slice(0, 5)) {
    const lines = doc.splitTextToSize(t(`- ${g.tip}`), contentWidth - 5);
    for (const line of lines) {
      checkPageBreak(6);
      doc.text(line, margin + 4, y);
      y += 5;
    }
    y += 2;
  }

  // Profesyonel yonlendirme
  if (recs.professionalReferral.needed) {
    y += 6;
    doc.setTextColor(248, 113, 113);
    doc.setFontSize(11);
    doc.text(t('Profesyonel Yonlendirme:'), margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    const lines = doc.splitTextToSize(t(recs.professionalReferral.reason), contentWidth - 5);
    for (const line of lines) { doc.text(line, margin + 4, y); y += 5; }
    y += 3;
    doc.text(t(`Onerilen: ${recs.professionalReferral.suggestedProfessional}`), margin + 4, y);
  }

  // ── SON SAYFA: AÇIKLAMA NOTLARI ─────────
  addPage();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setTextColor(226, 232, 240);
  doc.setFontSize(16);
  doc.text(t('Aciklama Notlari'), margin, y);
  y += 12;

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  const notes = [
    'Dogruluk: Dogru cevaplarin toplam soru sayisina orani.',
    'LT Duzeyi: Clements-Sarama Ogrenme Yorungesi cercevesinde cocugun bulundugu gelisim duzeyi.',
    'Risk Duzeyi: 1 (cok dusuk) ile 6 (cok yuksek) arasinda diskalkuli risk degerlendirmesi.',
    'Ipucu Kademesi: 0 (ipucu kullanilmadi) ile 5 (tam rehberlik) arasinda destek duzeyi.',
    '',
    'BU RAPOR BIR TANI ARACI DEGILDIR.',
    'Profesyonel degerlendirme icin uzman gorusu alinmalidir.',
    '',
    'GalakSay: Diskalkuli riski tasayan cocuklar icin matematik ogrenme platformu.',
    'NuMap: Sayi Hissi Degerlendirme Araci — baslangic profili olusturur.',
    '',
    'Diskalkuli Dernegi — www.diskalkuli.org',
  ];

  for (const note of notes) {
    doc.text(t(note), margin, y);
    y += 5;
  }

  // PDF kaydet
  const fileName = t(`GalakSay_Rapor_${childName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
  doc.save(fileName);
  return fileName;
}

export { generatePDFReport };
