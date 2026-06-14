// Galaksay Analytics — Sınıf-geneli (çok-çocuklu) profesyonel PDF rapor.
// 2026-06-11: Bireysel raporla AYNI kimlik — açık tema, çizilen üçlü-kod logosu,
// gömülü Roboto (gerçek Türkçe; eski sürüm ASCII'ye siliyordu).
// Veri: roster × N (Promise.all). Ön-son müdahale etkisi Numap baseline risk (ön)
// ↔ Galaksay güncel risk (son) üzerinden Cohen's d ile.

import jsPDF from 'jspdf';
import { getFullPerformanceProfile, getOverallAccuracy, CATEGORIES } from './PerformanceAnalyzer.js';
import { calculateRiskLevel, compareWithNuMapBaseline } from './RiskClassifier.js';
import { CATEGORY_LABELS } from './StrengthWeaknessMapper.js';
import { getChildProfile, getSessionsByChild } from './database.js';
import { mean, cohensD, effectBand } from '../utils/stats.js';
import { P, asciiSafe, loadRobotoFonts, applyRoboto, drawGalaksayMark } from './pdfBrand.js';

/**
 * Sınıf-geneli PDF raporu üretir ve indirir.
 * @param {Array<{ns:string,name?:string}>} roster  ChildSelect distinct children
 * @param {{name?:string}|null} teacher
 * @param {{anonymous?:boolean}} options
 */
export async function generateClassPDFReport(roster, teacher = null, options = {}) {
  const { anonymous = false } = options;

  // Her çocuk için veri (paralel; oynamamışlar boş/null ile gelir).
  const data = await Promise.all((roster || []).map(async (c) => {
    try {
      const [childInfo, profile, risk, sessions, nuMapComp, overallAcc] = await Promise.all([
        getChildProfile(c.ns),
        getFullPerformanceProfile(c.ns),
        calculateRiskLevel(c.ns),
        getSessionsByChild(c.ns),
        compareWithNuMapBaseline(c.ns),
        getOverallAccuracy(c.ns),
      ]);
      const played = (sessions || []).length > 0;
      return { c, childInfo, profile, risk, sessions: sessions || [], nuMapComp, overallAcc, played };
    } catch {
      return { c, childInfo: null, profile: null, risk: null, sessions: [], nuMapComp: null, overallAcc: 0, played: false };
    }
  }));

  const played = data.filter((d) => d.played);

  const doc = new jsPDF('p', 'mm', 'a4');
  applyRoboto(doc, await loadRobotoFonts());

  const W = 210, H = 297, M = 18, CW = W - M * 2;
  let y = M;
  const tc = (c) => doc.setTextColor(c[0], c[1], c[2]);
  const fc = (c) => doc.setFillColor(c[0], c[1], c[2]);
  const dc = (c) => doc.setDrawColor(c[0], c[1], c[2]);
  const fnt = (s = 'normal') => doc.setFont('Roboto', s);
  const fs = (n) => doc.setFontSize(n);

  // İçerik sayfası: üst marka şeridi + başlık + ayraç
  const contentPage = (title) => {
    doc.addPage();
    fc(P.white); doc.rect(0, 0, W, H, 'F');
    fc(P.brand); doc.rect(0, 0, W, 3, 'F');
    fnt('bold'); fs(15); tc(P.ink);
    doc.text(title, M, 18);
    dc(P.line); doc.setLineWidth(0.4); doc.line(M, 23, W - M, 23);
    fnt('normal'); fs(8); tc(P.faint);
    doc.text('Sınıf Değerlendirme Raporu', W - M, 18, { align: 'right' });
    y = 32;
  };
  const checkBreak = (needed, title) => { if (y + needed > H - 22) contentPage(title); };
  const sectionTitle = (text, color = P.brand) => {
    fc(color); doc.roundedRect(M, y - 4, 2.2, 7, 1, 1, 'F');
    fnt('bold'); fs(12.5); tc(P.ink);
    doc.text(text, M + 6, y + 1.5);
    y += 10;
  };

  // ════════ KAPAK ════════
  fc(P.white); doc.rect(0, 0, W, H, 'F');
  fc(P.brandD); doc.rect(0, 0, W, 70, 'F');
  fc(P.brand); doc.rect(0, 67, W, 3, 'F');
  fc([99, 102, 241]);
  [[28, 22, 1.3], [180, 30, 1], [150, 16, 0.8], [45, 50, 0.9], [172, 54, 1.1]].forEach(([sx, sy, r]) => doc.circle(sx, sy, r, 'F'));
  drawGalaksayMark(doc, M + 13, 35, 27, { onDark: true });
  fnt('bold'); fs(30); tc(P.white);
  doc.text('Galaksay', M + 30, 38);
  fnt('normal'); fs(11); tc([199, 210, 254]);
  doc.text('Matematik Öğrenme Platformu', M + 30, 48);
  fnt('bold'); fs(9); tc(P.white);
  doc.text('SINIF DEĞERLENDİRME RAPORU', W - M, 40, { align: 'right' });

  fnt('bold'); fs(22); tc(P.ink);
  doc.text('Sınıf Değerlendirme Raporu', M, 100);
  fnt('normal'); fs(11); tc(P.sub);
  doc.text('Sınıf geneli performans, risk dağılımı ve müdahale etkisi', M, 109);

  // Sınıf bilgi kartı
  const totalSessions = data.reduce((s, d) => s + d.sessions.length, 0);
  const totalMin = Math.round(data.reduce((s, d) => s + d.sessions.reduce((a, x) => a + (x.durationMs || 0), 0), 0) / 60000);
  fc(P.cardBg); dc(P.line); doc.setLineWidth(0.4);
  doc.roundedRect(M, 122, CW, 46, 3, 3, 'FD');
  fc(P.brand); doc.roundedRect(M, 122, 2.5, 46, 1, 1, 'F');
  fnt('normal'); fs(9); tc(P.faint);
  doc.text('SINIF', M + 10, 134);
  fnt('bold'); fs(16); tc(P.ink);
  doc.text(teacher?.name && !anonymous ? String(teacher.name) : 'Sınıf Raporu', M + 10, 144);
  fnt('normal'); fs(10); tc(P.sub);
  doc.text(`Rapor Tarihi:  ${new Date().toLocaleDateString('tr-TR')}`, M + 10, 156);
  doc.text(`Öğrenci:  ${data.length} (oynamış: ${played.length})  ·  Toplam:  ${totalSessions} oturum, ${totalMin} dk`, M + 10, 163);

  fnt('normal'); fs(8.5); tc(P.faint);
  doc.text('Bu rapor bir tanı aracı değildir; eğitsel müdahale takibi amaçlıdır.', M, 250);
  doc.text('Galaksay Değerlendirme Sistemi  ·  galaksay.com', M, 256);

  // ════════ SINIF ÖZETİ ════════
  contentPage('Sınıf Özeti');
  const classAcc = played.length ? Math.round(mean(played.map((d) => d.overallAcc)) * 100) : 0;
  const kpis = [
    { label: 'Ortalama Doğruluk', val: `%${classAcc}`, c: P.cyan },
    { label: 'Toplam Oturum', val: String(totalSessions), c: P.brand },
    { label: 'Toplam Süre', val: `${totalMin} dk`, c: P.green },
  ];
  const kpiW = (CW - 8) / 3;
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

  sectionTitle('Başarı Dağılımı', P.cyan);
  const bands = [
    ['Mükemmel (%80+)', 0, P.green], ['İyi (%60-79)', 0, P.cyan],
    ['Gelişmeli (%40-59)', 0, P.amber], ['Destek (<%40)', 0, P.red], ['Başlamadı', 0, P.faint],
  ];
  for (const d of data) {
    if (!d.played) { bands[4][1]++; continue; }
    const p = d.overallAcc * 100;
    if (p >= 80) bands[0][1]++; else if (p >= 60) bands[1][1]++; else if (p >= 40) bands[2][1]++; else bands[3][1]++;
  }
  const maxN = Math.max(1, ...bands.map((b) => b[1]));
  for (const [label, n, color] of bands) {
    checkBreak(11, 'Sınıf Özeti');
    fnt('normal'); fs(9.5); tc(P.ink);
    doc.text(label, M, y);
    fnt('bold'); tc(color);
    doc.text(`${n} öğrenci`, W - M, y, { align: 'right' });
    fc(P.line); doc.roundedRect(M, y + 2, CW, 4, 1.5, 1.5, 'F');
    fc(color); if (n > 0) doc.roundedRect(M, y + 2, Math.max(3, CW * (n / maxN)), 4, 1.5, 1.5, 'F');
    y += 11;
  }

  // ════════ ÖĞRENCİ KARŞILAŞTIRMA ════════
  contentPage('Öğrenci Karşılaştırma');
  const cols = [
    { x: M, w: 62, label: 'Öğrenci', align: 'left' },
    { x: M + 62, w: 26, label: 'Doğruluk', align: 'right' },
    { x: M + 88, w: 24, label: 'Oturum', align: 'right' },
    { x: M + 112, w: 22, label: 'Risk', align: 'right' },
    { x: M + 134, w: CW - 134, label: 'Değişim', align: 'right' },
  ];
  const cellX = (c) => (c.align === 'right' ? c.x + c.w - 2 : c.x + 2);
  const thead = () => {
    fc(P.brand); doc.roundedRect(M, y, CW, 9, 1.5, 1.5, 'F');
    fnt('bold'); fs(8.5); tc(P.white);
    cols.forEach((c) => doc.text(c.label, cellX(c), y + 6, { align: c.align }));
    y += 9;
  };
  thead();
  let rowi = 0;
  for (const d of data) {
    if (y + 9 > H - 22) { contentPage('Öğrenci Karşılaştırma'); thead(); rowi = 0; }
    const rh = 8.5;
    if (rowi % 2 === 1) { fc(P.cardBg); doc.rect(M, y, CW, rh, 'F'); }
    const name = anonymous ? `Öğrenci #${(d.c.ns || '').slice(-4)}` : (d.c.name || d.childInfo?.name || '—');
    const ch = d.played && d.nuMapComp
      ? ({ improved: { t: '▲ İyileşme', c: P.green }, worsened: { t: '▼ Gerileme', c: P.red }, stable: { t: '● Sabit', c: P.faint } }[d.nuMapComp.change] || { t: '—', c: P.faint })
      : { t: '—', c: P.faint };
    fnt('normal'); fs(9); tc(P.ink);
    doc.text(String(name).slice(0, 30), cellX(cols[0]), y + 5.8, { align: 'left' });
    tc(P.sub);
    doc.text(d.played ? `%${Math.round(d.overallAcc * 100)}` : '—', cellX(cols[1]), y + 5.8, { align: 'right' });
    doc.text(String(d.sessions.length), cellX(cols[2]), y + 5.8, { align: 'right' });
    doc.text(d.played && d.risk?.overallRisk != null ? `${d.risk.overallRisk}/6` : '—', cellX(cols[3]), y + 5.8, { align: 'right' });
    fnt('bold'); fs(8.5); tc(ch.c);
    doc.text(ch.t, cellX(cols[4]), y + 5.8, { align: 'right' });
    fnt('normal');
    y += rh; rowi++;
  }

  // ════════ KATEGORİ SINIF ORTALAMALARI ════════
  contentPage('Kategori Sınıf Ortalamaları');
  fnt('normal'); fs(9.5); tc(P.sub);
  doc.text('Her kategoride, o kategoriyi oynamış öğrencilerin ortalama doğruluğu.', M, y);
  y += 9;
  for (const cat of CATEGORIES) {
    const accs = played.map((d) => d.profile?.categoryMetrics?.[cat]?.accuracy).filter((x) => Number.isFinite(x) && x > 0);
    const pct = accs.length ? Math.round(mean(accs) * 100) : null;
    checkBreak(14, 'Kategori Sınıf Ortalamaları');
    fnt('bold'); fs(10); tc(P.ink);
    doc.text(CATEGORY_LABELS[cat] || cat, M, y);
    fnt('normal'); fs(9); tc(pct == null ? P.faint : P.brand);
    doc.text(pct == null ? 'veri yok' : `%${pct}  ·  n=${accs.length}`, W - M, y, { align: 'right' });
    fc(P.line); doc.roundedRect(M, y + 2.5, CW, 5, 1.5, 1.5, 'F');
    if (pct != null) { fc(P.brand); doc.roundedRect(M, y + 2.5, Math.max(3, CW * (pct / 100)), 5, 1.5, 1.5, 'F'); }
    y += 14;
  }

  // ════════ ÖN-SON MÜDAHALE ETKİSİ ════════
  contentPage('Ön-Son Müdahale Etkisi');
  const paired = data.filter((d) => d.played && d.nuMapComp
    && Number.isFinite(d.nuMapComp.nuMapRiskLevel) && Number.isFinite(d.nuMapComp.currentRiskLevel));
  if (paired.length < 2) {
    fnt('normal'); fs(10); tc(P.sub);
    doc.text(doc.splitTextToSize('Etki büyüklüğü için yeterli eşleştirilmiş veri yok (en az 2 öğrencinin Numap başlangıç değerlendirmesi + oyun verisi gerekir).', CW), M, y);
  } else {
    const pre = paired.map((d) => d.nuMapComp.nuMapRiskLevel);
    const post = paired.map((d) => d.nuMapComp.currentRiskLevel);
    const dEff = cohensD(pre, post); // negatif = risk azaldı = iyileşme
    const delta = (mean(post) - mean(pre)).toFixed(2);
    const improved = paired.filter((p) => p.nuMapComp.change === 'improved').length;

    fc(P.cardBg); dc(P.line); doc.setLineWidth(0.4);
    doc.roundedRect(M, y, CW, 50, 2.5, 2.5, 'FD');
    fnt('normal'); fs(9.5); tc(P.sub);
    doc.text(`Eşleştirilmiş öğrenci (n):  ${paired.length}`, M + 6, y + 9);
    doc.text(`Ortalama başlangıç riski:  ${mean(pre).toFixed(2)} / 6`, M + 6, y + 17);
    doc.text(`Ortalama güncel risk:  ${mean(post).toFixed(2)} / 6`, M + 6, y + 25);
    doc.text(`Ortalama risk değişimi:  ${delta}  (negatif = iyileşme)`, M + 6, y + 33);
    doc.text(`İyileşme gösteren:  ${improved} / ${paired.length} öğrenci`, M + 6, y + 41);
    const dc2 = dEff != null && dEff < 0 ? P.green : P.amber;
    fc(dc2[0] === P.green[0] ? P.greenL : P.amberL);
    doc.roundedRect(W - M - 52, y + 8, 46, 22, 2.5, 2.5, 'F');
    fnt('bold'); fs(8); tc(dc2);
    doc.text("COHEN'S d", W - M - 29, y + 15, { align: 'center' });
    fs(14);
    doc.text(dEff == null ? '—' : dEff.toFixed(2), W - M - 29, y + 23, { align: 'center' });
    fnt('normal'); fs(7.5);
    doc.text(`${effectBand(dEff)} etki`, W - M - 29, y + 28.5, { align: 'center' });
    y += 58;
    fnt('normal'); fs(8.5); tc(P.faint);
    doc.text(doc.splitTextToSize("Not: Risk azalması (negatif d) müdahalenin olumlu etkisini gösterir. Cohen's d yorumu: 0.2 küçük, 0.5 orta, 0.8 büyük.", CW), M, y);
  }

  // ════════ AÇIKLAMA NOTLARI ════════
  contentPage('Açıklama Notları');
  const glossary = [
    ['Doğruluk', 'Çocuğun cevapladığı sorularda doğru oranı.'],
    ['Risk (1-6)', 'Düşük = daha az diskalkuli riski (Numap başlangıç değerlendirmesiyle aynı ölçek).'],
    ['Ön-Son', 'Numap tarama (ön) ile Galaksay güncel performans (son) karşılaştırması.'],
    ['Kapsam', 'Veriler yalnız bu cihazda oynanan oturumlardan derlenmiştir.'],
  ];
  for (const [term, def] of glossary) {
    checkBreak(12, 'Açıklama Notları');
    fnt('bold'); fs(9.5); tc(P.brand);
    doc.text(term, M, y);
    fnt('normal'); fs(9.5); tc(P.sub);
    doc.text(doc.splitTextToSize(def, CW - 34), M + 34, y);
    y += 9;
  }
  y += 4;
  fc(P.amberL); dc(P.amber); doc.setLineWidth(0.4);
  doc.roundedRect(M, y, CW, 20, 2.5, 2.5, 'FD');
  fnt('bold'); fs(10.5); tc(P.amber);
  doc.text('Bu rapor bir tanı aracı değildir.', M + 8, y + 9);
  fnt('normal'); fs(9); tc(P.sub);
  doc.text('Eğitsel müdahale takibi amaçlıdır; kesin değerlendirme için uzman görüşü gereklidir.', M + 8, y + 15.5);

  // ════════ ALTBİLGİ + SAYFA NUMARALARI ════════
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    dc(P.line); doc.setLineWidth(0.3); doc.line(M, H - 14, W - M, H - 14);
    fnt('normal'); fs(7.5); tc(P.faint);
    doc.text('Galaksay Değerlendirme Sistemi  ·  Sınıf Raporu', M, H - 9);
    doc.text(`Sayfa ${i} / ${pageCount}`, W - M, H - 9, { align: 'right' });
  }

  const stamp = new Date().toISOString().slice(0, 10);
  doc.save(asciiSafe(`Galaksay_Sinif_Raporu_${stamp}.pdf`));
}

export default { generateClassPDFReport };
