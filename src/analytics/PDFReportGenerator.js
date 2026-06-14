// GalakSay Analytics — PDF rapor üretim modülü
// 2026-06-11: Profesyonel açık-tema yeniden tasarım + gömülü Roboto fontu ile GERÇEK Türkçe
// karakter desteği (eski sürüm tüm Türkçe karakterleri ASCII'ye siliyordu).

import jsPDF from 'jspdf';
import { getFullPerformanceProfile, CATEGORIES } from './PerformanceAnalyzer.js';
import { getCurrentLTLevels, getLearningMap, LT_RANGES } from './LTProgressEngine.js';
import { calculateRiskLevel, compareWithNuMapBaseline, screenDyscalculiaIndicators } from './RiskClassifier.js';
import { getStrengthWeaknessProfile, CATEGORY_LABELS } from './StrengthWeaknessMapper.js';
import { generateRecommendations } from './RecommendationEngine.js';
import { getChildProfile, getSessionsByChild } from './database.js';
// Ortak marka katmanı: palet + ASCII dosya adı + Roboto + ÇİZİLEN üçlü-kod logosu.
// (Fontlar ~440KB base64 — loadRobotoFonts LAZY indirir, dashboard'ı şişirmez.)
import { P, asciiSafe, loadRobotoFonts, applyRoboto, drawGalaksayMark } from './pdfBrand.js';

async function generatePDFReport(childId, options = {}) {
  // ── Veri toplama ──
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
  const fonts = await loadRobotoFonts(); // lazy: font yalnız burada yüklenir
  const data = { childInfo, profile, ltLevels, learningMap, risk, nuMapComp, sw, recs, sessions };
  const childName = renderReport(doc, data, { ...options, childId, fonts });

  // PDF kaydet (dosya adı ASCII-güvenli, içerik gerçek Türkçe)
  const fileName = asciiSafe(`GalakSay_Rapor_${childName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
  doc.save(fileName);
  return fileName;
}

// Saf render — verilen doc + data ile raporu çizer (Node testinde de çağrılır). childName döner.
function renderReport(doc, data, options = {}) {
  const { anonymous = false, childId = '', fonts } = options;
  const { childInfo, profile, ltLevels, learningMap, risk, nuMapComp, sw, recs, sessions } = data;

  // ── Gömülü Roboto fontu (gerçek Türkçe karakterler; çağıran taraf lazy yükleyip geçer) ──
  applyRoboto(doc, fonts);

  const W = 210, H = 297, M = 18, CW = W - M * 2;
  let y = M;

  // ── Kısa yardımcılar ──
  const tc = (c) => doc.setTextColor(c[0], c[1], c[2]);
  const fc = (c) => doc.setFillColor(c[0], c[1], c[2]);
  const dc = (c) => doc.setDrawColor(c[0], c[1], c[2]);
  const fnt = (style = 'normal') => doc.setFont('Roboto', style);
  const fs = (n) => doc.setFontSize(n);
  const childName = anonymous ? `Öğrenci #${childId.slice(-6)}` : (childInfo?.name || 'Uzay Kaşifi');

  const riskInfo = (lvl) => lvl <= 2 ? { label: 'Düşük', c: P.green } : lvl <= 4 ? { label: 'Orta', c: P.amber } : { label: 'Yüksek', c: P.red };

  // İçerik sayfası başlığı (üst ince marka bandı + başlık + ayraç)
  const contentPage = (title) => {
    doc.addPage();
    fc(P.white); doc.rect(0, 0, W, H, 'F');
    fc(P.brand); doc.rect(0, 0, W, 3, 'F'); // üst ince marka şeridi
    fnt('bold'); fs(15); tc(P.ink);
    doc.text(title, M, 18);
    dc(P.line); doc.setLineWidth(0.4); doc.line(M, 23, W - M, 23);
    fnt('normal'); fs(8); tc(P.faint);
    doc.text(childName, W - M, 18, { align: 'right' });
    y = 32;
  };

  const checkBreak = (needed, title) => { if (y + needed > H - 22) contentPage(title); };

  // Bölüm başlığı (renkli sol şerit + başlık)
  const sectionTitle = (text, color = P.brand) => {
    fc(color); doc.roundedRect(M, y - 4, 2.2, 7, 1, 1, 'F');
    fnt('bold'); fs(12.5); tc(P.ink);
    doc.text(text, M + 6, y + 1.5);
    y += 10;
  };

  // ════════════════════ SAYFA 1: KAPAK ════════════════════
  fc(P.white); doc.rect(0, 0, W, H, 'F');
  // Üst marka bandı
  fc(P.brandD); doc.rect(0, 0, W, 70, 'F');
  fc(P.brand); doc.rect(0, 67, W, 3, 'F');
  // Yıldız motifi (ince)
  fc([99, 102, 241]);
  [[28, 22, 1.3], [180, 30, 1], [150, 16, 0.8], [45, 50, 0.9], [172, 54, 1.1], [120, 24, 0.7]].forEach(([sx, sy, r]) => doc.circle(sx, sy, r, 'F'));
  drawGalaksayMark(doc, M + 13, 35, 27, { onDark: true });
  fnt('bold'); fs(30); tc(P.white);
  doc.text('Galaksay', M + 30, 38);
  fnt('normal'); fs(11); tc([199, 210, 254]);
  doc.text('Matematik Öğrenme Platformu', M + 30, 48);
  fnt('bold'); fs(9); tc(P.white);
  doc.text('BİREYSEL GELİŞİM RAPORU', W - M, 40, { align: 'right' });

  // Başlık
  fnt('bold'); fs(22); tc(P.ink);
  doc.text('Bireysel Gelişim Raporu', M, 100);
  fnt('normal'); fs(11); tc(P.sub);
  doc.text('Öğrenme yörüngesi, performans ve gelişim önerileri', M, 109);

  // Öğrenci bilgi kartı
  const totalSessions = sessions.length;
  const totalTimeMin = Math.round(sessions.reduce((s, x) => s + (x.durationMs || 0), 0) / 60000);
  fc(P.cardBg); dc(P.line); doc.setLineWidth(0.4);
  doc.roundedRect(M, 122, CW, 46, 3, 3, 'FD');
  fc(P.brand); doc.roundedRect(M, 122, 2.5, 46, 1, 1, 'F');
  fnt('normal'); fs(9); tc(P.faint);
  doc.text('ÖĞRENCİ', M + 10, 134);
  fnt('bold'); fs(16); tc(P.ink);
  doc.text(childName, M + 10, 144);
  fnt('normal'); fs(10); tc(P.sub);
  doc.text(`Rapor Tarihi:  ${new Date().toLocaleDateString('tr-TR')}`, M + 10, 156);
  doc.text(`Toplam Çalışma:  ${totalSessions} oturum  ·  ${totalTimeMin} dakika`, M + 10, 163);

  // Risk özet rozeti (kapakta)
  const rk = riskInfo(risk.overallRisk);
  fc([rk.c[0], rk.c[1], rk.c[2]]); doc.roundedRect(W - M - 52, 130, 42, 30, 3, 3, 'F');
  fnt('normal'); fs(8); tc(P.white);
  doc.text('GENEL RİSK', W - M - 31, 139, { align: 'center' });
  fnt('bold'); fs(15);
  doc.text(`${rk.label}`, W - M - 31, 149, { align: 'center' });
  fnt('normal'); fs(8);
  doc.text(`${risk.overallRisk} / 6`, W - M - 31, 156, { align: 'center' });

  // Kapak altı not
  fnt('normal'); fs(8.5); tc(P.faint);
  doc.text('Bu rapor bir tanı aracı değildir; tanı için uzman görüşü gereklidir.', M, 250);
  doc.text('Galaksay Değerlendirme Sistemi  ·  galaksay.com', M, 256);

  // ════════════════════ SAYFA 2: YÖNETİCİ ÖZETİ ════════════════════
  contentPage('Yönetici Özeti');

  // KPI kartları (3'lü)
  const kpiW = (CW - 8) / 3;
  const kpis = [
    { label: 'Genel Doğruluk', val: `%${Math.round(profile.overallAccuracy * 100)}`, c: P.cyan },
    { label: 'Genel Risk', val: `${rk.label} (${risk.overallRisk}/6)`, c: rk.c },
    { label: 'İlerleme', val: `${learningMap.totalModulesCompleted}/${learningMap.totalModules}`, c: P.brand },
  ];
  kpis.forEach((k, i) => {
    const kx = M + i * (kpiW + 4);
    fc(P.cardBg); dc(P.line); doc.setLineWidth(0.4);
    doc.roundedRect(kx, y, kpiW, 24, 2.5, 2.5, 'FD');
    fc(k.c); doc.roundedRect(kx, y, kpiW, 2, 1, 1, 'F');
    fnt('normal'); fs(8); tc(P.faint);
    doc.text(k.label, kx + 5, y + 9);
    fnt('bold'); fs(14); tc(k.c);
    doc.text(k.val, kx + 5, y + 18);
  });
  y += 33;

  // Güçlü alanlar / Gelişim alanları / Öneriler — renkli başlıklı listeler
  const listBlock = (title, items, color, bgColor, emptyMsg) => {
    checkBreak(20, 'Yönetici Özeti');
    sectionTitle(title, color);
    fnt('normal'); fs(9.5); tc(P.sub);
    if (!items || items.length === 0) {
      doc.text(emptyMsg, M + 6, y); y += 7;
    } else {
      for (const it of items) {
        checkBreak(9, 'Yönetici Özeti');
        // madde işareti
        fc(color); doc.circle(M + 7, y - 1.2, 1, 'F');
        const lines = doc.splitTextToSize(it, CW - 12);
        tc(P.sub); fnt('normal'); fs(9.5);
        doc.text(lines, M + 11, y);
        y += lines.length * 5 + 2.5;
      }
    }
    y += 5;
  };

  listBlock('Güçlü Alanlar', sw.strengths.slice(0, 3).map(s => `${s.area}: ${s.evidence}`), P.green, P.greenL, 'Henüz yeterli veri yok.');
  listBlock('Gelişim Alanları', sw.weaknesses.slice(0, 3).map(w => `${w.area}: ${w.evidence}`), P.amber, P.amberL, 'Henüz yeterli veri yok.');
  listBlock('Öncelikli Öneriler', recs.activityRecommendations.slice(0, 4).map(r => r.reason), P.cyan, P.cyanL, 'Öneri için daha fazla veri gerekli.');

  // ════════════════════ SAYFA 3: LT İLERLEME HARİTASI ════════════════════
  contentPage('Öğrenme Yörüngesi — İlerleme Haritası');
  fnt('normal'); fs(9.5); tc(P.sub);
  doc.text('Clements–Sarama öğrenme yörüngesi çerçevesinde her alandaki gelişim düzeyi.', M, y);
  y += 10;

  for (const cat of CATEGORIES) {
    checkBreak(18, 'Öğrenme Yörüngesi — İlerleme Haritası');
    const level = ltLevels[cat]?.level || LT_RANGES[cat]?.min || 0;
    const range = LT_RANGES[cat] || { min: 0, max: 18 };
    const progress = Math.max(0, Math.min(100, ((level - range.min) / Math.max(1, (range.max - range.min))) * 100));
    const label = CATEGORY_LABELS[cat] || cat;

    fnt('bold'); fs(10); tc(P.ink);
    doc.text(label, M, y);
    fnt('normal'); fs(9); tc(P.brand);
    doc.text(`Düzey ${level}`, W - M, y, { align: 'right' });

    const barY = y + 3, barH = 5.5;
    fc(P.line); doc.roundedRect(M, barY, CW, barH, 1.5, 1.5, 'F');
    fc(P.brand); doc.roundedRect(M, barY, Math.max(2, CW * (progress / 100)), barH, 1.5, 1.5, 'F');
    fnt('normal'); fs(7); tc(P.faint);
    doc.text(`L${range.min}`, M, barY + barH + 4);
    doc.text(`L${range.max}`, W - M, barY + barH + 4, { align: 'right' });
    y += 19;
  }

  // ════════════════════ SAYFA 4: KATEGORİ BAZLI PERFORMANS ════════════════════
  contentPage('Kategori Bazlı Performans');
  // Tablo: sütun konumları (sağ-hizalı sayısal sütunlar)
  const cols = [
    { x: M, w: 56, label: 'Kategori', align: 'left' },
    { x: M + 56, w: 24, label: 'Doğruluk', align: 'right' },
    { x: M + 80, w: 26, label: 'Yanıt Sür.', align: 'right' },
    { x: M + 106, w: 20, label: 'İpucu', align: 'right' },
    { x: M + 126, w: 14, label: 'Düzey', align: 'right' },
    { x: M + 140, w: CW - 140, label: 'Eğilim', align: 'right' },
  ];
  const cellX = (col) => col.align === 'right' ? col.x + col.w - 2 : col.x + 2;
  // başlık satırı
  fc(P.brand); doc.roundedRect(M, y, CW, 9, 1.5, 1.5, 'F');
  fnt('bold'); fs(8.5); tc(P.white);
  cols.forEach(col => doc.text(col.label, cellX(col), y + 6, { align: col.align }));
  y += 9;
  fnt('normal'); fs(9);
  let rowi = 0;
  for (const cat of CATEGORIES) {
    checkBreak(9, 'Kategori Bazlı Performans');
    const m = profile.categoryMetrics[cat] || {};
    const rh = 8.5;
    if (rowi % 2 === 1) { fc(P.cardBg); doc.rect(M, y, CW, rh, 'F'); }
    const trend = m.rtTrend?.direction === 'improving' ? { t: 'İyileşiyor', c: P.green }
      : m.rtTrend?.direction === 'declining' ? { t: 'Geriliyor', c: P.red }
        : { t: 'Stabil', c: P.faint };
    tc(P.ink); fnt('normal'); fs(9);
    doc.text(doc.splitTextToSize(CATEGORY_LABELS[cat] || cat, cols[0].w - 4)[0], cellX(cols[0]), y + 5.8, { align: 'left' });
    tc(P.sub);
    doc.text(`%${Math.round((m.accuracy || 0) * 100)}`, cellX(cols[1]), y + 5.8, { align: 'right' });
    doc.text(`${((m.avgRT || 0) / 1000).toFixed(1)} sn`, cellX(cols[2]), y + 5.8, { align: 'right' });
    doc.text(`${(m.avgHint || 0).toFixed(1)}`, cellX(cols[3]), y + 5.8, { align: 'right' });
    doc.text(`L${ltLevels[cat]?.level || 0}`, cellX(cols[4]), y + 5.8, { align: 'right' });
    tc(trend.c); fnt('bold'); fs(8.5);
    doc.text(trend.t, cellX(cols[5]), y + 5.8, { align: 'right' });
    fnt('normal');
    y += rh;
    rowi++;
  }
  dc(P.line); doc.setLineWidth(0.3); doc.line(M, y, W - M, y);
  y += 6;
  fnt('normal'); fs(7.5); tc(P.faint);
  doc.text('Doğruluk: doğru cevap oranı · Yanıt Sür.: ortalama tepki süresi · İpucu: 0 (yok) – 5 (tam rehberlik) · Düzey: LT gelişim basamağı', M, y, { maxWidth: CW });

  // ════════════════════ SAYFA 5: Numap KARŞILAŞTIRMASI ════════════════════
  if (nuMapComp) {
    contentPage('Numap Karşılaştırması');
    const changeInfo = nuMapComp.change === 'improved' ? { t: 'İyileşme', c: P.green }
      : nuMapComp.change === 'worsened' ? { t: 'Gerileme', c: P.red } : { t: 'Stabil', c: P.faint };
    // özet kart
    fc(P.cardBg); dc(P.line); doc.setLineWidth(0.4);
    doc.roundedRect(M, y, CW, 26, 2.5, 2.5, 'FD');
    fnt('normal'); fs(9); tc(P.sub);
    doc.text(`Başlangıç risk düzeyi:  ${nuMapComp.nuMapRiskLevel}`, M + 6, y + 9);
    doc.text(`Güncel risk düzeyi:  ${nuMapComp.currentRiskLevel}`, M + 6, y + 16);
    doc.text(`Geçen süre:  ${nuMapComp.timeElapsed_days ?? '?'} gün`, M + 6, y + 23);
    fc(changeInfo.c); doc.roundedRect(W - M - 44, y + 6, 38, 14, 2, 2, 'F');
    fnt('bold'); fs(11); tc(P.white);
    doc.text(changeInfo.t, W - M - 25, y + 15, { align: 'center' });
    y += 34;

    sectionTitle('Alan Bazlı Değişim', P.cyan);
    fnt('normal'); fs(9.5);
    for (const c of (nuMapComp.categoryComparisons || [])) {
      checkBreak(8, 'Numap Karşılaştırması');
      const tr = c.trend === 'improved' ? { t: '▲ Gelişim', c: P.green } : c.trend === 'worsened' ? { t: '▼ Gerileme', c: P.red } : { t: '● Stabil', c: P.faint };
      tc(P.ink);
      doc.text(`${CATEGORY_LABELS[c.category] || c.category}`, M + 4, y);
      tc(P.sub);
      doc.text(`${c.nuMapScore}  →  ${c.currentScore}`, M + 95, y);
      tc(tr.c); fnt('bold');
      doc.text(tr.t, W - M, y, { align: 'right' });
      fnt('normal');
      y += 7;
    }
  }

  // ════════════════════ SAYFA 6: ÖNERİLER ════════════════════
  contentPage('Öneriler ve Yol Haritası');

  sectionTitle('Öncelikli Çalışma Alanları', P.cyan);
  fnt('normal'); fs(9.5); tc(P.sub);
  for (const r of recs.activityRecommendations.slice(0, 5)) {
    checkBreak(10, 'Öneriler ve Yol Haritası');
    const pr = String(r.priority || '').toLowerCase();
    const pc = pr.includes('yüksek') || pr.includes('high') ? P.red : pr.includes('orta') || pr.includes('med') ? P.amber : P.cyan;
    fc(pc); doc.circle(M + 7, y - 1.2, 1, 'F');
    const lines = doc.splitTextToSize(r.reason, CW - 12);
    tc(P.sub); doc.text(lines, M + 11, y);
    y += lines.length * 5 + 2.5;
  }
  y += 5;

  sectionTitle('Çalışma Düzeni', P.brand);
  fnt('normal'); fs(9.5); tc(P.sub);
  doc.text(`•  Sıklık:  ${recs.scheduleRecommendations.recommendedFrequency}`, M + 6, y); y += 6.5;
  doc.text(`•  Oturum süresi:  ${recs.scheduleRecommendations.optimalSessionDuration_min} dakika`, M + 6, y); y += 11;

  sectionTitle('Ebeveyn İçin İpuçları', P.green);
  fnt('normal'); fs(9.5); tc(P.sub);
  for (const g of recs.parentGuidance.slice(0, 5)) {
    checkBreak(9, 'Öneriler ve Yol Haritası');
    fc(P.green); doc.circle(M + 7, y - 1.2, 1, 'F');
    const lines = doc.splitTextToSize(g.tip, CW - 12);
    tc(P.sub); doc.text(lines, M + 11, y);
    y += lines.length * 5 + 2.5;
  }

  if (recs.professionalReferral.needed) {
    y += 6;
    checkBreak(30, 'Öneriler ve Yol Haritası');
    fc(P.redL); dc(P.red); doc.setLineWidth(0.4);
    const refLines = doc.splitTextToSize(recs.professionalReferral.reason, CW - 14);
    const boxH = 18 + refLines.length * 5;
    doc.roundedRect(M, y, CW, boxH, 2.5, 2.5, 'FD');
    fc(P.red); doc.roundedRect(M, y, 2.5, boxH, 1, 1, 'F');
    fnt('bold'); fs(11); tc(P.red);
    doc.text('Profesyonel Yönlendirme Önerilir', M + 8, y + 9);
    fnt('normal'); fs(9.5); tc(P.sub);
    doc.text(refLines, M + 8, y + 16);
    let ry = y + 16 + refLines.length * 5 + 1;
    fnt('bold'); tc(P.ink);
    doc.text(`Önerilen uzman:  ${recs.professionalReferral.suggestedProfessional}`, M + 8, ry);
    y += boxH + 6;
  }

  // ════════════════════ SAYFA 7: AÇIKLAMA NOTLARI ════════════════════
  contentPage('Açıklama Notları');
  const glossary = [
    ['Doğruluk', 'Doğru cevapların toplam soru sayısına oranı.'],
    ['LT Düzeyi', 'Clements–Sarama Öğrenme Yörüngesi çerçevesinde çocuğun bulunduğu gelişim basamağı.'],
    ['Risk Düzeyi', '1 (çok düşük) ile 6 (çok yüksek) arasında diskalkuli risk değerlendirmesi.'],
    ['İpucu Kademesi', '0 (ipucu kullanılmadı) ile 5 (tam rehberlik) arasında destek düzeyi.'],
  ];
  for (const [term, def] of glossary) {
    checkBreak(12, 'Açıklama Notları');
    fnt('bold'); fs(9.5); tc(P.brand);
    doc.text(term, M, y);
    fnt('normal'); fs(9.5); tc(P.sub);
    const lines = doc.splitTextToSize(def, CW - 38);
    doc.text(lines, M + 34, y);
    y += Math.max(7, lines.length * 5 + 2);
  }
  y += 4;

  // Uyarı kutusu
  fc(P.amberL); dc(P.amber); doc.setLineWidth(0.4);
  doc.roundedRect(M, y, CW, 20, 2.5, 2.5, 'FD');
  fnt('bold'); fs(10.5); tc(P.amber);
  doc.text('Bu rapor bir tanı aracı değildir.', M + 8, y + 9);
  fnt('normal'); fs(9); tc(P.sub);
  doc.text('Kesin değerlendirme için bir uzmana başvurulmalıdır.', M + 8, y + 15.5);
  y += 28;

  fnt('normal'); fs(8.5); tc(P.faint);
  doc.text('Galaksay: diskalkuli riski taşıyan çocuklar için matematik öğrenme platformu — galaksay.com', M, y); y += 5;
  doc.text('Numap: Sayısal Beceriler Haritalama Platformu — başlangıç profilini oluşturur — getnumap.com', M, y);

  // ════════════════════ ALTBİLGİ + SAYFA NUMARALARI (tüm sayfalar) ════════════════════
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    dc(P.line); doc.setLineWidth(0.3); doc.line(M, H - 14, W - M, H - 14);
    fnt('normal'); fs(7.5); tc(P.faint);
    doc.text('Galaksay Değerlendirme Sistemi  ·  Bu rapor bir tanı aracı değildir', M, H - 9);
    doc.text(`Sayfa ${i} / ${pageCount}`, W - M, H - 9, { align: 'right' });
  }

  return childName;
}

export { generatePDFReport, renderReport };
