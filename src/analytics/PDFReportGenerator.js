// GalakSay Analytics — Bireysel gelişim raporu (PDF)
// 2026-09-25: İlerleme-izleme (progress monitoring) formatına yeniden yazıldı:
//   kapak (öğrenci, dönem, oturum/süre) → yönetici özeti + sade risk açıklaması →
//   doğruluk & hız eğilim çizgi grafikleri + oturum tablosu → LT (Clements–Sarama) düzeyleri →
//   alan tablosu (n sütunu, yetersiz veri "—") → Numap ön-son (varsa) → öğretmen adımları +
//   ebeveyn notu → yöntem/sözlük + KVKK. Sıfır veride tüm bölümler açıklayıcı boş durum gösterir.
// Gömülü Roboto ile gerçek Türkçe karakterler (pdfBrand.js).

import jsPDF from 'jspdf';
import { getFullPerformanceProfile, CATEGORIES, MIN_ITEMS_CATEGORY, MIN_ITEMS_OVERALL, computeDose, computeProgressMonitoring, realSessions } from './PerformanceAnalyzer.js';
import { getCurrentLTLevels, getLearningMap, LT_RANGES } from './LTProgressEngine.js';
import { calculateRiskLevel, compareWithNuMapBaseline, screenDyscalculiaIndicators, riskLabel } from './RiskClassifier.js';
import { getStrengthWeaknessProfile, CATEGORY_LABELS } from './StrengthWeaknessMapper.js';
import { generateRecommendations } from './RecommendationEngine.js';
import { getChildProfile, getSessionsByChild } from './database.js';
import { P, APP_VERSION, asciiSafe, loadRobotoFonts, applyRoboto, drawGalaksayMark } from './pdfBrand.js';

/** Rapor için tüm veriyi toplar (UI ve test tarafından da kullanılır). */
async function buildReportData(childId) {
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
  return { childInfo, profile, ltLevels, learningMap, risk, nuMapComp, screening, sw, recs, sessions: sessions || [] };
}

async function generatePDFReport(childId, options = {}) {
  const data = await buildReportData(childId);
  const doc = new jsPDF('p', 'mm', 'a4');
  const fonts = await loadRobotoFonts(); // lazy: font yalnız burada yüklenir
  const childName = renderReport(doc, data, { ...options, childId, fonts });
  const fileName = asciiSafe(`Galaksay_Rapor_${childName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
  doc.save(fileName);
  return fileName;
}

// ── Biçimlendirme yardımcıları ──
const fmtDate = (d) => {
  const x = d instanceof Date ? d : new Date(d);
  return Number.isNaN(x.getTime()) ? '—' : x.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
const pct = (x) => (x == null || !Number.isFinite(x) ? '—' : `%${Math.round(x * 100)}`);
const sec = (ms) => (ms == null || !Number.isFinite(ms) || ms <= 0 ? '—' : `${(ms / 1000).toFixed(1)} sn`);
const num = (x, d = 1) => (x == null || !Number.isFinite(x) ? '—' : x.toFixed(d));
const PRIORITY_TR = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' };

// Saf render — verilen doc + data ile raporu çizer (Node testinde de çağrılır). childName döner.
function renderReport(doc, data, options = {}) {
  const { anonymous = false, childId = '', fonts } = options;
  const { childInfo, profile, ltLevels, learningMap, risk, nuMapComp, screening, sw, recs } = data;
  const sessions = realSessions(data.sessions); // boş (0 soru, <1 dk) oturumlar sayılmaz
  const now = options.now ? new Date(options.now) : new Date();

  applyRoboto(doc, fonts);
  const hasFont = !!fonts;

  const W = 210, H = 297, M = 18, CW = W - M * 2;
  const FOOT = H - 18; // altbilgi üst sınırı
  let y = M;

  const tc = (c) => doc.setTextColor(c[0], c[1], c[2]);
  const fc = (c) => doc.setFillColor(c[0], c[1], c[2]);
  const dc = (c) => doc.setDrawColor(c[0], c[1], c[2]);
  const fnt = (style = 'normal') => doc.setFont(hasFont ? 'Roboto' : 'helvetica', style);
  const fs = (n) => doc.setFontSize(n);
  const childName = anonymous ? `Öğrenci #${String(childId).slice(-6)}` : (childInfo?.name || 'İsimsiz Öğrenci');

  const riskInfo = (lvl) => lvl == null ? { label: 'Yetersiz veri', c: P.faint }
    : lvl <= 2 ? { label: 'Düşük', c: P.green } : lvl <= 4 ? { label: 'Orta', c: P.amber } : { label: 'Yüksek', c: P.red };

  // ── Sayfa iskeleti ──
  const contentPage = (title) => {
    doc.addPage();
    fc(P.white); doc.rect(0, 0, W, H, 'F');
    fc(P.brand); doc.rect(0, 0, W, 3, 'F');
    fnt('bold'); fs(15); tc(P.ink);
    doc.text(title, M, 18);
    dc(P.line); doc.setLineWidth(0.4); doc.line(M, 23, W - M, 23);
    fnt('normal'); fs(8); tc(P.faint);
    doc.text(doc.splitTextToSize(childName, 70)[0], W - M, 18, { align: 'right' });
    y = 32;
  };
  const checkBreak = (needed, title) => { if (y + needed > FOOT - 4) contentPage(title); };
  const sectionTitle = (text, color = P.brand) => {
    fc(color); doc.roundedRect(M, y - 4, 2.2, 7, 1, 1, 'F');
    fnt('bold'); fs(12.5); tc(P.ink);
    doc.text(text, M + 6, y + 1.5);
    y += 10;
  };
  const para = (text, { size = 9.5, color = P.sub, indent = 0, gap = 4, title } = {}) => {
    fnt('normal'); fs(size); tc(color);
    const lines = doc.splitTextToSize(String(text || ''), CW - indent);
    const lh = size * 0.5; // mm satır yüksekliği (≈ 1.4 satır aralığı)
    checkBreak(lines.length * lh + gap, title);
    doc.text(lines, M + indent, y);
    y += lines.length * lh + gap;
  };
  const bullet = (text, color, title, { size = 9.5 } = {}) => {
    fnt('normal'); fs(size); tc(P.sub);
    const lines = doc.splitTextToSize(String(text || ''), CW - 12);
    const lh = size * 0.5;
    checkBreak(lines.length * lh + 2.5, title);
    fc(color); doc.circle(M + 7, y - 1.3, 1, 'F');
    doc.text(lines, M + 11, y);
    y += lines.length * lh + 2.5;
  };
  const emptyBox = (text, title) => {
    fnt('normal'); fs(9.5); tc(P.sub);
    const lines = doc.splitTextToSize(text, CW - 16);
    const bh = lines.length * 5 + 10;
    checkBreak(bh + 4, title);
    fc(P.cardBg); dc(P.line); doc.setLineWidth(0.4);
    doc.roundedRect(M, y - 5, CW, bh, 2.5, 2.5, 'FD');
    fc(P.faint); doc.roundedRect(M, y - 5, 2.5, bh, 1, 1, 'F');
    tc(P.sub); doc.text(lines, M + 8, y + 1);
    y += bh + 2;
  };

  // ── Çizgi grafik (jsPDF primitive'leriyle) ──
  // series: [{ values: number[], color, label }] — aynı uzunlukta; xLabels: string[]
  const drawLineChart = ({ x, yTop, w, h, series, xLabels, yMin, yMax, yFormat, yLabel }) => {
    const padL = 12, padB = 8, padT = 3, padR = 3;
    const px = x + padL, py = yTop + padT, pw = w - padL - padR, ph = h - padT - padB;
    // zemin + ızgara
    fc(P.white); dc(P.line); doc.setLineWidth(0.25);
    doc.rect(px, py, pw, ph, 'S');
    const ticks = 4;
    fnt('normal'); fs(6.5); tc(P.faint);
    for (let i = 0; i <= ticks; i++) {
      const v = yMin + (yMax - yMin) * (i / ticks);
      const gy = py + ph - (ph * i / ticks);
      dc(P.line); doc.setLineWidth(0.2); doc.line(px, gy, px + pw, gy);
      doc.text(yFormat(v), px - 1.5, gy + 1, { align: 'right' });
    }
    if (yLabel) { fs(6.5); tc(P.faint); doc.text(yLabel, x, yTop + 1); }
    const n = xLabels.length;
    const xAt = (i) => (n <= 1 ? px + pw / 2 : px + (pw * i) / (n - 1));
    const yAt = (v) => py + ph - ((Math.min(yMax, Math.max(yMin, v)) - yMin) / (yMax - yMin)) * ph;
    // x etiketleri (sığdır)
    const step = Math.max(1, Math.ceil(n / Math.floor(pw / 11)));
    fs(6.5); tc(P.faint);
    xLabels.forEach((lab, i) => {
      if (i % step !== 0 && i !== n - 1) return;
      doc.text(lab, xAt(i), py + ph + 4, { align: 'center' });
    });
    for (const s of series) {
      dc(s.color); doc.setLineWidth(0.7);
      let prev = null;
      s.values.forEach((v, i) => {
        if (v == null || !Number.isFinite(v)) { prev = null; return; }
        const cx = xAt(i), cy = yAt(v);
        if (prev) doc.line(prev[0], prev[1], cx, cy);
        prev = [cx, cy];
      });
      fc(s.color);
      s.values.forEach((v, i) => { if (v != null && Number.isFinite(v)) doc.circle(xAt(i), yAt(v), 0.8, 'F'); });
    }
    // gösterge
    let lx = px;
    const ly = py + ph + 8.5;
    fs(7);
    for (const s of series) {
      fc(s.color); doc.circle(lx + 1, ly - 1, 1, 'F');
      tc(P.sub); doc.text(s.label, lx + 3.5, ly);
      lx += doc.getTextWidth(s.label) + 9;
    }
  };

  // ── Türetilmiş değerler ──
  const sortedSessions = [...sessions].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const totalSessions = sessions.length;
  const totalTimeMin = Math.round(sessions.reduce((s, x) => s + (Number(x.durationMs) || 0), 0) / 60000);
  const totalAnswered = profile.totalAnswered ?? 0;
  const firstDate = sortedSessions[0]?.startTime || (profile.firstAnsweredAt ? new Date(profile.firstAnsweredAt) : null);
  const lastDate = sortedSessions[sortedSessions.length - 1]?.startTime || (profile.lastAnsweredAt ? new Date(profile.lastAnsweredAt) : null);
  const periodText = firstDate && lastDate ? `${fmtDate(firstDate)} – ${fmtDate(lastDate)}` : 'Henüz oturum yok';
  const rk = riskInfo(risk.overallRisk);
  const trend = Array.isArray(profile.dailyTrend) ? profile.dailyTrend : [];
  const hasData = totalAnswered > 0;
  const dose = computeDose(sessions, now.getTime());
  const pm = computeProgressMonitoring(sessions);
  const errorProfile = profile.errorProfile || { n: 0, wrong: 0, top: [], hasErrorTypes: false };

  // ════════════════════ SAYFA 1: KAPAK ════════════════════
  fc(P.white); doc.rect(0, 0, W, H, 'F');
  fc(P.brandD); doc.rect(0, 0, W, 70, 'F');
  fc(P.brand); doc.rect(0, 67, W, 3, 'F');
  fc([99, 102, 241]);
  [[28, 22, 1.3], [180, 30, 1], [150, 16, 0.8], [45, 50, 0.9], [172, 54, 1.1], [120, 24, 0.7]].forEach(([sx, sy, r]) => doc.circle(sx, sy, r, 'F'));
  drawGalaksayMark(doc, M + 13, 35, 27, { onDark: true, fontName: hasFont ? 'Roboto' : 'helvetica' });
  fnt('bold'); fs(30); tc(P.white);
  doc.text('Galaksay', M + 30, 38);
  fnt('normal'); fs(11); tc([199, 210, 254]);
  doc.text('Matematik Öğrenme Platformu', M + 30, 48);
  fnt('bold'); fs(9); tc(P.white);
  doc.text('BİREYSEL GELİŞİM RAPORU', W - M, 40, { align: 'right' });

  fnt('bold'); fs(22); tc(P.ink);
  doc.text('Bireysel Gelişim Raporu', M, 96);
  fnt('normal'); fs(11); tc(P.sub);
  doc.text('Öğrenme yörüngesi, performans eğilimi ve gelişim önerileri', M, 105);

  // Öğrenci bilgi kartı
  const cardTop = 118, cardH = 62;
  fc(P.cardBg); dc(P.line); doc.setLineWidth(0.4);
  doc.roundedRect(M, cardTop, CW, cardH, 3, 3, 'FD');
  fc(P.brand); doc.roundedRect(M, cardTop, 2.5, cardH, 1, 1, 'F');
  fnt('normal'); fs(8.5); tc(P.faint);
  doc.text('ÖĞRENCİ', M + 10, cardTop + 11);
  fnt('bold'); fs(16); tc(P.ink);
  doc.text(doc.splitTextToSize(childName, 100)[0], M + 10, cardTop + 21);
  fnt('normal'); fs(9.5); tc(P.sub);
  const meta = [];
  if (childInfo?.gradeLevel && !anonymous) meta.push(`${String(childInfo.gradeLevel).replace(/\.?\s*sınıf$/i, '')}. sınıf`);
  if (childInfo?.school && !anonymous) meta.push(String(childInfo.school));
  if (meta.length) doc.text(meta.join('  ·  '), M + 10, cardTop + 28);
  const rows = [
    ['Rapor tarihi', fmtDate(now)],
    ['İzleme dönemi', periodText],
    ['Çalışma', hasData ? `${totalSessions} oturum  ·  ${totalTimeMin} dk  ·  ${totalAnswered} soru` : 'Henüz oyun oynanmadı'],
    ['Doz hedefi', `${dose.sessionsDone}/${dose.targetSessions} oturum (%${dose.pctSessions})  ·  bu hafta ${dose.weekSessions}/${dose.weekTarget}`],
  ];
  let ry = cardTop + 38;
  for (const [k, v] of rows) {
    fnt('normal'); fs(9); tc(P.faint); doc.text(k, M + 10, ry);
    fnt('bold'); fs(9.5); tc(P.ink); doc.text(v, M + 42, ry);
    ry += 7;
  }
  // Risk rozeti
  fc(rk.c); doc.roundedRect(W - M - 52, cardTop + 8, 44, 32, 3, 3, 'F');
  fnt('normal'); fs(7.5); tc(P.white);
  doc.text('GENEL RİSK', W - M - 30, cardTop + 16, { align: 'center' });
  fnt('bold'); fs(risk.overallRisk == null ? 10.5 : 15);
  doc.text(rk.label, W - M - 30, cardTop + 27, { align: 'center' });
  fnt('normal'); fs(7.5);
  doc.text(risk.overallRisk == null ? `${totalAnswered}/${MIN_ITEMS_OVERALL} soru` : `${risk.overallRisk} / 6`, W - M - 30, cardTop + 34, { align: 'center' });

  // Kapak: içindekiler
  fnt('bold'); fs(9); tc(P.faint);
  doc.text('İÇİNDEKİLER', M, 196);
  fnt('normal'); fs(9.5); tc(P.sub);
  const toc = ['Yönetici Özeti ve Risk Değerlendirmesi', 'Gelişim Eğilimi (doğruluk, hız, oturumlar)', 'Öğrenme Yörüngesi Düzeyleri (Clements–Sarama)', 'Alan Bazlı Performans',
    ...(nuMapComp ? ['Numap Ön–Son Karşılaştırması'] : []), 'Öğretmen İçin Sonraki Adımlar ve Ebeveyn Notu', 'Yöntem, Sözlük ve KVKK'];
  toc.forEach((t, i) => doc.text(`${i + 1}.  ${t}`, M + 2, 203 + i * 6));

  fnt('normal'); fs(8.5); tc(P.faint);
  doc.text('Bu rapor bir tanı aracı değildir; eğitsel izleme amaçlıdır. Tanı için uzman görüşü gereklidir.', M, 252);
  doc.text('Galaksay Değerlendirme Sistemi  ·  galaksay.com', M, 258);

  // ════════════════════ SAYFA 2: YÖNETİCİ ÖZETİ ════════════════════
  const T2 = 'Yönetici Özeti';
  contentPage(T2);

  const kpiW = (CW - 9) / 4;
  const kpis = [
    { label: 'Genel doğruluk', val: hasData ? pct(profile.overallAccuracyOrNull) : '—', sub: hasData ? `${totalAnswered} soru` : 'veri yok', c: P.cyan },
    { label: 'Genel risk', val: rk.label, sub: risk.overallRisk == null ? `en az ${MIN_ITEMS_OVERALL} soru gerekli` : `${risk.overallRisk} / 6`, c: rk.c },
    { label: 'Doz (42 oturum hedefi)', val: `${dose.sessionsDone}/${dose.targetSessions}`, sub: `${totalTimeMin} dk · hafta ${dose.weekSessions}/${dose.weekTarget}`, c: dose.weekStatus === 'met' || dose.weekStatus === 'early' ? P.brand : dose.weekStatus === 'partial' ? P.amber : P.red },
    { label: 'Keşfedilen oyun', val: `${learningMap.totalModulesCompleted}/${learningMap.totalModules}`, sub: 'oyun modu', c: P.green },
  ];
  kpis.forEach((k, i) => {
    const kx = M + i * (kpiW + 3);
    fc(P.cardBg); dc(P.line); doc.setLineWidth(0.4);
    doc.roundedRect(kx, y, kpiW, 26, 2.5, 2.5, 'FD');
    fc(k.c); doc.roundedRect(kx, y, kpiW, 2, 1, 1, 'F');
    fnt('normal'); fs(7.5); tc(P.faint);
    doc.text(k.label, kx + 4, y + 8);
    fnt('bold'); fs(k.val.length > 9 ? 11 : 13.5); tc(k.c);
    doc.text(k.val, kx + 4, y + 16.5);
    fnt('normal'); fs(7); tc(P.sub);
    doc.text(k.sub, kx + 4, y + 22.5);
  });
  y += 35;

  // Risk açıklaması
  sectionTitle('Risk Değerlendirmesi — Ne Anlama Geliyor?', rk.c);
  {
    fnt('normal'); fs(9.5);
    const lines = doc.splitTextToSize(risk.explanation || '', CW - 16);
    const bh = lines.length * 4.9 + 10;
    checkBreak(bh + 4, T2);
    fc(rk.c === P.faint ? P.cardBg : rk.c === P.green ? P.greenL : rk.c === P.amber ? P.amberL : P.redL);
    dc(rk.c); doc.setLineWidth(0.4);
    doc.roundedRect(M, y - 5, CW, bh, 2.5, 2.5, 'FD');
    fc(rk.c); doc.roundedRect(M, y - 5, 2.5, bh, 1, 1, 'F');
    tc(P.ink); doc.text(lines, M + 8, y + 1);
    y += bh + 3;
    fnt('normal'); fs(7.5); tc(P.faint);
    doc.text('Ölçek 1–6 (1 = çok düşük risk). 1–2 Düşük · 3–4 Orta · 5–6 Yüksek. Puanlama: doğruluk, ipucu kademesi, tutarlılık ve hız (bkz. Yöntem).', M, y, { maxWidth: CW });
    y += 9;
  }

  // Doz ve uyum
  checkBreak(34, T2);
  sectionTitle('Doz ve Uyum', dose.weekStatus === 'none' && hasData ? P.red : dose.weekStatus === 'partial' ? P.amber : P.brand);
  {
    const barY = y - 2;
    fc(P.line); doc.roundedRect(M, barY, CW, 5, 1.5, 1.5, 'F');
    if (dose.sessionsDone > 0) { fc(P.brand); doc.roundedRect(M, barY, Math.max(2, CW * (dose.pctSessions / 100)), 5, 1.5, 1.5, 'F'); }
    fnt('normal'); fs(7.5); tc(P.faint);
    doc.text(`${dose.sessionsDone} / ${dose.targetSessions} oturum · ${dose.minutesDone} / ${dose.targetMinutes} dk`, M, barY + 9);
    doc.text(dose.complete ? 'Hedef doz tamamlandı' : `${dose.remainingSessions} oturum kaldı`, W - M, barY + 9, { align: 'right' });
    y = barY + 14;
    const weekTxt = !hasData ? 'Henüz oturum yok.'
      : dose.weekStatus === 'met' ? `Bu hafta ${dose.weekSessions}/${dose.weekTarget} oturum — haftalık hedef karşılandı.`
        : dose.weekStatus === 'partial' ? `Bu hafta ${dose.weekSessions}/${dose.weekTarget} oturum — hedefe ${dose.weekTarget - dose.weekSessions} oturum kaldı.`
          : dose.weekStatus === 'early' ? 'Hafta yeni başladı; haftalık hedef 3 oturum.'
            : `Bu hafta oturum yok${dose.daysSinceLast != null ? ` (son oturum ${dose.daysSinceLast} gün önce)` : ''} — haftada en az ${dose.weekTarget} kısa oturum önerilir.`;
    para(`${weekTxt} Araştırmalarda anlamlı kazanım için yaklaşık 14 saat / 42 oturum × 20 dk (≤13 hafta) eşiği raporlanmıştır (Kohn ve ark., 2020); her ek saat etkiyi artırır.`, { title: T2, size: 8.5 });
  }

  const listBlock = (title, items, color, emptyMsg) => {
    checkBreak(20, T2);
    sectionTitle(title, color);
    if (!items || items.length === 0) { emptyBox(emptyMsg, T2); }
    else for (const it of items) bullet(it, color, T2);
    y += 4;
  };
  listBlock('Güçlü Alanlar', sw.strengths.slice(0, 4).map(s => `${s.area}: ${s.evidence}`), P.green,
    hasData ? 'Henüz %80 ve üzeri doğrulukla, ipucusuz çalışılan bir alan yok.' : 'Henüz oyun verisi yok.');
  listBlock('Gelişim Alanları', sw.weaknesses.slice(0, 4).map(w => `${w.area}: ${w.evidence} — ${w.suggestedFocus}.`), P.amber,
    hasData ? 'Değerlendirilen alanlarda engellenme düzeyi (<%60) veya yoğun ipucu ihtiyacı görülmedi.' : 'Henüz oyun verisi yok.');
  if (sw.emergingSkills?.length) {
    listBlock('Gelişmekte Olan Alanlar (öğretimsel düzey)', sw.emergingSkills.slice(0, 4).map(e => `${e.area}: ${e.evidence}`), P.cyan, '');
  }
  if (sw.notAssessed?.length) {
    checkBreak(16, T2);
    fnt('normal'); fs(8.5); tc(P.faint);
    const t = `Henüz değerlendirilmeyen alanlar (alan başına en az ${MIN_ITEMS_CATEGORY} soru gerekir): ${sw.notAssessed.map(x => `${x.area} (${x.n})`).join(', ')}.`;
    const lines = doc.splitTextToSize(t, CW);
    doc.text(lines, M, y); y += lines.length * 4.5 + 4;
  }

  // ════════════════════ SAYFA 3: GELİŞİM EĞİLİMİ ════════════════════
  const T3 = 'Gelişim Eğilimi';
  contentPage(T3);
  // İlerleme izleme: oturum bazlı doğruluk + hedef çizgisi (aimline) + 4-nokta kuralı
  sectionTitle('Oturum Bazlı Doğruluk ve Hedef Çizgisi', P.green);
  if (pm.points.length >= 2) {
    const labels = pm.points.map(p => String(p.index));
    drawLineChart({ x: M, yTop: y, w: CW, h: 46, xLabels: labels, yMin: 0, yMax: 100, yFormat: (v) => `${Math.round(v)}`,
      series: [
        { values: pm.aimline.map(a => a.value), color: P.faint, label: `Hedef çizgisi (hedef %${pm.goal})` },
        { values: pm.points.map(p => p.accuracy), color: P.green, label: 'Oturum doğruluğu (%)' },
      ] });
    y += 60;
    const DEC = {
      intensify: { t: `Son 4 oturum hedef çizgisinin altında › öğretimi yoğunlaştırın (zorluk düşürme, somut destek, daha sık kısa oturum).`, c: P.red },
      raise_goal: { t: 'Son 4 oturum hedef çizgisinin üstünde › hedefi yükseltin (bir üst düzey / daha geniş sayı aralığı).', c: P.green },
      continue: { t: 'Oturumlar hedef çizgisi etrafında seyrediyor › mevcut plana devam edin.', c: P.brand },
      insufficient: { t: `Karar kuralı için en az ${pm.minPoints} oturum gerekir (şimdi ${pm.points.length}).`, c: P.faint },
    };
    const d = DEC[pm.decision] || DEC.insufficient;
    fnt('normal'); fs(9);
    const dl = doc.splitTextToSize(`Karar (NCII 4-nokta kuralı): ${d.t}`, CW - 14);
    const bh = dl.length * 4.6 + 8;
    checkBreak(bh + 4, T3);
    fc(P.cardBg); dc(d.c); doc.setLineWidth(0.4);
    doc.roundedRect(M, y - 5, CW, bh, 2, 2, 'FD');
    fc(d.c); doc.roundedRect(M, y - 5, 2.5, bh, 1, 1, 'F');
    tc(P.ink); doc.text(dl, M + 8, y);
    y += bh + 2;
    para('Hedef çizgisi ilk oturum doğruluğundan 42. oturumda %80 bağımsız düzeye doğrusal çıkar. X ekseni: oturum sırası.', { title: T3, size: 7.5, color: P.faint, gap: 3 });
  } else {
    emptyBox(hasData ? 'Hedef çizgisi için en az iki oturum gerekir.' : 'Henüz oturum yok; ilk oturumlardan sonra hedef çizgisi burada çizilecek.', T3);
  }
  y += 2;
  checkBreak(80, T3);
  sectionTitle('Günlük Doğruluk ve Yanıt Hızı (son 30 gün)', P.cyan);
  para('Oynanan her gün için doğruluk oranı ve medyan yanıt süresi. Nokta üzerindeki soru sayısı azsa dalgalanma doğaldır.', { title: T3, size: 8.5 });
  if (trend.length >= 2) {
    const labels = trend.map(t => t.label);
    checkBreak(60, T3);
    drawLineChart({ x: M, yTop: y, w: CW, h: 40, xLabels: labels, yMin: 0, yMax: 100, yFormat: (v) => `${Math.round(v)}`,
      series: [{ values: trend.map(t => t.accuracy), color: P.cyan, label: 'Günlük doğruluk (%)' }] });
    y += 54;
    const rts = trend.map(t => (t.medianRT_ms == null ? null : t.medianRT_ms / 1000));
    const rtMax = Math.max(5, Math.ceil((Math.max(...rts.filter(v => v != null), 0) + 1) / 5) * 5);
    checkBreak(60, T3);
    drawLineChart({ x: M, yTop: y, w: CW, h: 40, xLabels: labels, yMin: 0, yMax: rtMax, yFormat: (v) => `${Math.round(v)}`,
      series: [{ values: rts, color: P.brand, label: 'Medyan yanıt süresi (sn) — düşüş = hızlanma' }] });
    y += 54;
    // Yorum
    const first = trend.slice(0, Math.max(1, Math.floor(trend.length / 3)));
    const last = trend.slice(-Math.max(1, Math.floor(trend.length / 3)));
    const avg = (arr, k) => { const v = arr.map(t => t[k]).filter(x => x != null); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
    const accDelta = avg(last, 'accuracy') - avg(first, 'accuracy');
    const rtA = avg(first, 'medianRT_ms'), rtB = avg(last, 'medianRT_ms');
    const rtDelta = rtA != null && rtB != null ? (rtB - rtA) / 1000 : null;
    const accTxt = Math.abs(accDelta) < 5 ? 'doğruluk büyük ölçüde sabit' : accDelta > 0 ? `doğruluk yaklaşık ${Math.round(accDelta)} puan arttı` : `doğruluk yaklaşık ${Math.round(-accDelta)} puan düştü`;
    const rtTxt = rtDelta == null ? '' : Math.abs(rtDelta) < 0.5 ? '; yanıt hızı sabit' : rtDelta < 0 ? `; yanıt süresi ${(-rtDelta).toFixed(1)} sn kısaldı (hızlanma)` : `; yanıt süresi ${rtDelta.toFixed(1)} sn uzadı`;
    para(`Yorum: Dönemin ilk üçte birine göre son üçte birde ${accTxt}${rtTxt}.`, { title: T3, color: P.ink });
  } else {
    emptyBox(hasData
      ? 'Eğilim grafiği için en az iki farklı günde oyun oynanmış olmalı. Şimdilik tek günlük veri var.'
      : 'Henüz oyun verisi yok. İlk oturumlar tamamlandığında doğruluk ve hız eğilimi burada çizilecek.', T3);
  }

  // Oturum tablosu (son 10)
  y += 2;
  checkBreak(30, T3);
  sectionTitle('Son Oturumlar', P.brand);
  if (sortedSessions.length === 0) {
    emptyBox('Kayıtlı oturum yok.', T3);
  } else {
    const scols = [
      { x: M, w: 34, label: 'Tarih', align: 'left' },
      { x: M + 34, w: 22, label: 'Süre', align: 'right' },
      { x: M + 56, w: 22, label: 'Soru', align: 'right' },
      { x: M + 78, w: 24, label: 'Doğruluk', align: 'right' },
      { x: M + 102, w: CW - 102, label: 'Alanlar', align: 'left' },
    ];
    const cellX = (c) => (c.align === 'right' ? c.x + c.w - 2 : c.x + 2);
    const thead = () => {
      fc(P.brand); doc.roundedRect(M, y, CW, 8, 1.5, 1.5, 'F');
      fnt('bold'); fs(8); tc(P.white);
      scols.forEach(c => doc.text(c.label, cellX(c), y + 5.5, { align: c.align }));
      y += 8;
    };
    thead();
    const lastTen = sortedSessions.slice(-10).reverse();
    lastTen.forEach((s, i) => {
      if (y + 8 > FOOT - 4) { contentPage(T3); thead(); }
      const rh = 7.5;
      if (i % 2 === 1) { fc(P.cardBg); doc.rect(M, y, CW, rh, 'F'); }
      const qa = Number(s.questionsAttempted) || 0, qc = Number(s.questionsCorrect) || 0;
      const min = Math.round((Number(s.durationMs) || 0) / 60000);
      fnt('normal'); fs(8.5); tc(P.ink);
      doc.text(fmtDate(s.startTime), cellX(scols[0]), y + 5.2);
      tc(P.sub);
      doc.text(min > 0 ? `${min} dk` : '<1 dk', cellX(scols[1]), y + 5.2, { align: 'right' });
      doc.text(String(qa), cellX(scols[2]), y + 5.2, { align: 'right' });
      doc.text(qa > 0 ? pct(qc / qa) : '—', cellX(scols[3]), y + 5.2, { align: 'right' });
      const cats = (s.categoriesVisited || []).map(c => CATEGORY_LABELS[c] || c).join(', ');
      fs(7.5);
      const catLines = doc.splitTextToSize(cats || '—', scols[4].w - 6);
      doc.text(catLines.length > 1 ? catLines[0].replace(/,?\s*$/, '') + '…' : catLines[0], cellX(scols[4]), y + 5.2);
      y += rh;
    });
    dc(P.line); doc.setLineWidth(0.3); doc.line(M, y, W - M, y);
    y += 3;
    if (sortedSessions.length > 10) { fnt('normal'); fs(7.5); tc(P.faint); doc.text(`Toplam ${sortedSessions.length} oturumun son 10'u gösterildi.`, M, y + 3); }
  }

  // ════════════════════ SAYFA 4: LT İLERLEME HARİTASI ════════════════════
  const T4 = 'Öğrenme Yörüngesi Düzeyleri';
  contentPage(T4);
  para('Clements–Sarama öğrenme yörüngesi (learning trajectory) çerçevesinde her alandaki gelişim basamağı. Düzey, en az 10 soruda ≥%80 doğruluk ve düşük ipucu ile bir üst basamağa geçer; son 5 soruda belirgin zorlanma olursa bir basamak geri alınır.', { title: T4 });
  y += 2;
  const lmByName = Object.fromEntries((learningMap.categories || []).map(c => [c.name, c]));
  const STATUS_TR = { not_started: 'başlanmadı', in_progress: 'devam ediyor', struggling: 'zorlanıyor', mastered: 'tamamlandı' };
  for (const cat of CATEGORIES) {
    checkBreak(20, T4);
    const range = LT_RANGES[cat] || { min: 0, max: 18 };
    const level = ltLevels[cat]?.level ?? range.min;
    const n = profile.categoryMetrics?.[cat]?.n ?? 0;
    const lm = lmByName[cat] || {};
    const started = n > 0;
    const progress = Math.max(0, Math.min(100, ((level - range.min) / Math.max(1, range.max - range.min)) * 100));
    const label = CATEGORY_LABELS[cat] || cat;

    fnt('bold'); fs(10); tc(started ? P.ink : P.faint);
    doc.text(label, M, y);
    fnt('normal'); fs(8.5); tc(started ? P.brand : P.faint);
    doc.text(started ? `Düzey ${level}  ·  düzey içi %${lm.progressInLevel ?? ltLevels[cat]?.progress ?? 0}  ·  ${STATUS_TR[lm.status] || ''}` : 'henüz başlanmadı', W - M, y, { align: 'right' });

    const barY = y + 3, barH = 5;
    fc(P.line); doc.roundedRect(M, barY, CW, barH, 1.5, 1.5, 'F');
    if (started) { fc(P.brand); doc.roundedRect(M, barY, Math.max(2, CW * (progress / 100)), barH, 1.5, 1.5, 'F'); }
    fnt('normal'); fs(7); tc(P.faint);
    doc.text(`L${range.min}`, M, barY + barH + 4);
    doc.text(`${n} soru · ${lm.modulesCompleted ?? 0}/${lm.modulesTotal ?? 0} oyun`, M + CW / 2, barY + barH + 4, { align: 'center' });
    doc.text(`L${range.max}`, W - M, barY + barH + 4, { align: 'right' });
    y += 18;
  }

  // ════════════════════ SAYFA 5: ALAN BAZLI PERFORMANS ════════════════════
  const T5 = 'Alan Bazlı Performans';
  contentPage(T5);
  const cols = [
    { x: M, w: 44, label: 'Alan', align: 'left' },
    { x: M + 44, w: 16, label: 'Soru', align: 'right' },
    { x: M + 60, w: 24, label: 'Doğruluk', align: 'right' },
    { x: M + 84, w: 26, label: 'Medyan süre', align: 'right' },
    { x: M + 110, w: 18, label: 'İpucu', align: 'right' },
    { x: M + 128, w: 18, label: 'Düzey', align: 'right' },
    { x: M + 146, w: CW - 146, label: 'Hız eğilimi', align: 'right' },
  ];
  const cellX = (col) => col.align === 'right' ? col.x + col.w - 2 : col.x + 2;
  fc(P.brand); doc.roundedRect(M, y, CW, 9, 1.5, 1.5, 'F');
  fnt('bold'); fs(8.5); tc(P.white);
  cols.forEach(col => doc.text(col.label, cellX(col), y + 6, { align: col.align }));
  y += 9;
  let rowi = 0;
  for (const cat of CATEGORIES) {
    checkBreak(9, T5);
    const m = profile.categoryMetrics?.[cat] || {};
    const n = m.n || 0;
    const rh = 8.5;
    if (rowi % 2 === 1) { fc(P.cardBg); doc.rect(M, y, CW, rh, 'F'); }
    const dir = m.rtTrend?.direction;
    const trendInfo = n === 0 ? { t: '—', c: P.faint }
      : dir === 'improving' ? { t: 'Hızlanıyor', c: P.green }
        : dir === 'declining' ? { t: 'Yavaşlıyor', c: P.red }
          : dir === 'insufficient' ? { t: 'az veri', c: P.faint } : { t: 'Sabit', c: P.faint };
    const accColor = n === 0 ? P.faint : !m.sufficient ? P.sub : m.accuracyOrNull >= 0.8 ? P.green : m.accuracyOrNull >= 0.6 ? P.amber : P.red;
    tc(n ? P.ink : P.faint); fnt('normal'); fs(9);
    doc.text(doc.splitTextToSize(CATEGORY_LABELS[cat] || cat, cols[0].w - 4)[0], cellX(cols[0]), y + 5.8);
    tc(P.sub);
    doc.text(String(n), cellX(cols[1]), y + 5.8, { align: 'right' });
    tc(accColor); fnt(n && m.sufficient ? 'bold' : 'normal');
    doc.text(n ? pct(m.accuracyOrNull) + (m.sufficient ? '' : '*') : '—', cellX(cols[2]), y + 5.8, { align: 'right' });
    fnt('normal'); tc(P.sub);
    doc.text(n ? sec(m.medianRT) : '—', cellX(cols[3]), y + 5.8, { align: 'right' });
    doc.text(n ? num(m.avgHint) : '—', cellX(cols[4]), y + 5.8, { align: 'right' });
    doc.text(n ? `L${ltLevels[cat]?.level ?? LT_RANGES[cat]?.min ?? 0}` : '—', cellX(cols[5]), y + 5.8, { align: 'right' });
    tc(trendInfo.c); fnt('bold'); fs(8.5);
    doc.text(trendInfo.t, cellX(cols[6]), y + 5.8, { align: 'right' });
    fnt('normal');
    y += rh;
    rowi++;
  }
  dc(P.line); doc.setLineWidth(0.3); doc.line(M, y, W - M, y);
  y += 6;
  fnt('normal'); fs(7.5); tc(P.faint);
  doc.text(doc.splitTextToSize(`Soru: cevaplanan madde sayısı · Doğruluk: doğru cevap oranı (* = ${MIN_ITEMS_CATEGORY} sorudan az, yorumlanmamalı) · Medyan süre: yanıt süresinin ortancası · İpucu: ortalama ipucu kademesi 0 (yok) – 5 (tam rehberlik) · Düzey: öğrenme yörüngesi basamağı · Hız eğilimi: son 10 sorudaki yanıt süresi yönü. Alan verisi yoksa "—".`, CW), M, y);
  y += 16;
  if (hasData) {
    checkBreak(30, T5);
    sectionTitle('Hata Profili', P.amber);
    if (!errorProfile.wrong) {
      emptyBox('Yanlış cevap yok; hata profili oluşmadı.', T5);
    } else if (!errorProfile.hasErrorTypes) {
      emptyBox(`${errorProfile.wrong} yanlış cevap var ancak hata tipi sınıflandırması kaydedilmemiş (eski oturumlar).`, T5);
    } else {
      para(`${errorProfile.n} sorunun ${errorProfile.wrong}'i yanlış. En sık hata tipleri (yanlışlar içindeki payı) ve öğretmen için öneri:`, { title: T5, size: 9 });
      for (const e of errorProfile.top) {
        fnt('normal'); fs(9);
        const gl = doc.splitTextToSize(e.guidance, CW - 16);
        const bh = 6 + gl.length * 4.6 + 4;
        checkBreak(bh + 3, T5);
        fc(P.cardBg); dc(P.line); doc.setLineWidth(0.3);
        doc.roundedRect(M, y - 4, CW, bh, 2, 2, 'FD');
        fc(P.amber); doc.roundedRect(M, y - 4, 2.5, bh, 1, 1, 'F');
        fnt('bold'); fs(9.5); tc(P.ink); doc.text(`${e.label}`, M + 8, y + 1);
        fnt('bold'); fs(9); tc(P.amber); doc.text(`%${e.pct}  (${e.count})`, W - M - 4, y + 1, { align: 'right' });
        fnt('normal'); fs(9); tc(P.sub); doc.text(gl, M + 8, y + 6.5);
        y += bh + 2;
      }
      y += 2;
    }
    checkBreak(24, T5);
    sectionTitle('Temsil Tercihi ve Tutarlılık', P.cyan);
    const rd = profile.representationDist || {};
    para(`Cevapların %${rd.somut ?? 0}'i somut (üçlü kod açık), %${rd.gorsel ?? 0}'i görsel, %${rd.sembolik ?? 0}'i sembolik gösterimle verildi. Son 20 maddede performans ${profile.consistency?.consistency === 'tutarsiz' ? 'tutarsız' : profile.consistency?.consistency === 'dalgali' ? 'dalgalı' : 'tutarlı'}.`, { title: T5 });
  }

  // ════════════════════ SAYFA 6: Numap KARŞILAŞTIRMASI ════════════════════
  if (nuMapComp) {
    const T6 = 'Numap Ön–Son Karşılaştırması';
    contentPage(T6);
    para('Numap taramasındaki başlangıç risk düzeyi (ön) ile Galaksay oyun verisinden hesaplanan güncel risk düzeyi (son) aynı 1–6 ölçeğinde karşılaştırılır. Düşüş = iyileşme.', { title: T6 });
    const changeInfo = nuMapComp.change === 'improved' ? { t: 'İyileşme', c: P.green }
      : nuMapComp.change === 'worsened' ? { t: 'Gerileme', c: P.red }
        : nuMapComp.change === 'stable' ? { t: 'Sabit', c: P.faint } : { t: 'Yetersiz veri', c: P.faint };
    fc(P.cardBg); dc(P.line); doc.setLineWidth(0.4);
    doc.roundedRect(M, y, CW, 30, 2.5, 2.5, 'FD');
    fnt('normal'); fs(9.5); tc(P.sub);
    doc.text(`Başlangıç (Numap) risk düzeyi:  ${nuMapComp.nuMapRiskLevel} / 6  (${riskLabel(nuMapComp.nuMapRiskLevel)})`, M + 6, y + 9);
    doc.text(`Güncel (Galaksay) risk düzeyi:  ${nuMapComp.currentRiskLevel == null ? 'henüz hesaplanamadı' : `${nuMapComp.currentRiskLevel} / 6  (${riskLabel(nuMapComp.currentRiskLevel)})`}`, M + 6, y + 17);
    doc.text(`Tarama tarihi:  ${nuMapComp.assessmentDate ? fmtDate(nuMapComp.assessmentDate) : '—'}${nuMapComp.timeElapsed_days != null ? `  ·  geçen süre ${nuMapComp.timeElapsed_days} gün` : ''}`, M + 6, y + 25);
    fc(changeInfo.c); doc.roundedRect(W - M - 44, y + 8, 38, 14, 2, 2, 'F');
    fnt('bold'); fs(changeInfo.t.length > 9 ? 8.5 : 11); tc(P.white);
    doc.text(changeInfo.t, W - M - 25, y + 16.5, { align: 'center' });
    y += 38;

    sectionTitle('Alan Bazlı Değişim', P.cyan);
    const comps = nuMapComp.categoryComparisons || [];
    if (comps.length === 0) {
      emptyBox('Numap alan puanları bulunamadı; yalnız genel risk karşılaştırılabildi.', T6);
    } else {
      fnt('bold'); fs(8); tc(P.faint);
      doc.text('Alan', M + 4, y); doc.text('Ön › Son (risk 1–6)', M + 80, y); doc.text('Soru', M + 130, y, { align: 'right' }); doc.text('Değişim', W - M, y, { align: 'right' });
      y += 6;
      for (const c of comps) {
        checkBreak(8, T6);
        const tr = c.trend === 'improved' ? { t: 'İyileşme', c: P.green } : c.trend === 'worsened' ? { t: 'Gerileme', c: P.red }
          : c.trend === 'stable' ? { t: 'Sabit', c: P.faint } : { t: 'az veri', c: P.faint };
        fnt('normal'); fs(9.5); tc(P.ink);
        doc.text(`${CATEGORY_LABELS[c.category] || c.category}`, M + 4, y);
        tc(P.sub);
        doc.text(`${c.nuMapScore}  ›  ${c.currentScore == null ? '—' : c.currentScore}`, M + 80, y);
        doc.text(String(c.n ?? 0), M + 130, y, { align: 'right' });
        tc(tr.c); fnt('bold');
        doc.text(tr.t, W - M, y, { align: 'right' });
        fnt('normal');
        y += 7;
      }
    }
  }

  // ════════════════════ SAYFA 7: ÖNERİLER ════════════════════
  const T7 = 'Sonraki Adımlar';
  contentPage(T7);
  sectionTitle('Öğretmen İçin Sonraki Adımlar', P.cyan);
  const steps = (recs.teacherNextSteps || []).slice(0, 6);
  if (steps.length === 0) {
    emptyBox(hasData
      ? 'Değerlendirilen alanlarda öncelikli bir gelişim alanı görülmedi; mevcut düzeyi pekiştirip güçlü alanlarda bir üst basamağa geçilebilir.'
      : 'Henüz veri yok. Her gezegende birkaç soru oynatıldığında bu bölüm öneri üretecek.', T7);
  } else {
    steps.forEach((s, i) => {
      fnt('normal'); fs(9.5);
      const lines = doc.splitTextToSize(s.step || '', CW - 16);
      const evLines = s.evidence ? doc.splitTextToSize(`Kanıt: ${s.evidence}`, CW - 16) : [];
      const bh = 9 + lines.length * 4.9 + (evLines.length ? evLines.length * 4.2 + 1 : 0);
      checkBreak(bh + 4, T7);
      const pc = s.priority === 'high' ? P.red : s.priority === 'medium' ? P.amber : P.cyan;
      fc(P.cardBg); dc(P.line); doc.setLineWidth(0.3);
      doc.roundedRect(M, y - 4, CW, bh, 2, 2, 'FD');
      fc(pc); doc.roundedRect(M, y - 4, 2.5, bh, 1, 1, 'F');
      fnt('bold'); fs(9.5); tc(P.ink);
      doc.text(`${i + 1}. ${s.area}`, M + 8, y + 1.5);
      fnt('bold'); fs(7); tc(pc);
      doc.text(`${PRIORITY_TR[s.priority] || ''} öncelik`, W - M - 4, y + 1.5, { align: 'right' });
      fnt('normal'); fs(9.5); tc(P.sub);
      doc.text(lines, M + 8, y + 7);
      if (evLines.length) { fs(8); tc(P.faint); doc.text(evLines, M + 8, y + 7 + lines.length * 4.9 + 0.5); }
      y += bh + 3;
    });
  }
  y += 3;
  checkBreak(26, T7);
  sectionTitle('Çalışma Düzeni', P.brand);
  bullet(`Sıklık: ${recs.scheduleRecommendations.recommendedFrequency}`, P.brand, T7);
  bullet(`Oturum süresi: ${recs.scheduleRecommendations.optimalSessionDuration_min} dakika${recs.scheduleRecommendations.breakSuggestion ? ` (${recs.scheduleRecommendations.breakSuggestion.toLowerCase()})` : ''}`, P.brand, T7);
  if (recs.representationRecommendations?.length) {
    bullet(`Somut gösterim (üçlü kod) açık tutulmalı: ${recs.representationRecommendations.map(r => CATEGORY_LABELS[r.category] || r.category).join(', ')}`, P.brand, T7);
  }
  y += 4;

  checkBreak(30, T7);
  sectionTitle('Ebeveyn İçin Not', P.green);
  {
    fnt('normal'); fs(9.5);
    const lines = doc.splitTextToSize(recs.parentNote || '', CW - 16);
    const bh = lines.length * 4.9 + 10;
    checkBreak(bh + 4, T7);
    fc(P.greenL); dc(P.green); doc.setLineWidth(0.4);
    doc.roundedRect(M, y - 5, CW, bh, 2.5, 2.5, 'FD');
    fc(P.green); doc.roundedRect(M, y - 5, 2.5, bh, 1, 1, 'F');
    tc(P.ink); doc.text(lines, M + 8, y + 1);
    y += bh + 3;
  }
  for (const g of (recs.parentGuidance || []).slice(0, 4)) bullet(g.tip, P.green, T7);

  if (recs.professionalReferral?.needed || recs.professionalReferral?.reason) {
    y += 5;
    const needed = !!recs.professionalReferral.needed;
    const boxC = needed ? P.red : P.amber;
    fnt('normal'); fs(9.5);
    const refLines = doc.splitTextToSize(recs.professionalReferral.reason || '', CW - 14);
    const extra = needed && recs.professionalReferral.suggestedProfessional ? doc.splitTextToSize(`Önerilen uzman: ${recs.professionalReferral.suggestedProfessional}`, CW - 14) : [];
    const boxH = 17 + refLines.length * 4.9 + extra.length * 4.9 + 6;
    checkBreak(boxH + 4, T7);
    fc(needed ? P.redL : P.amberL); dc(boxC); doc.setLineWidth(0.4);
    doc.roundedRect(M, y, CW, boxH, 2.5, 2.5, 'FD');
    fc(boxC); doc.roundedRect(M, y, 2.5, boxH, 1, 1, 'F');
    fnt('bold'); fs(11); tc(boxC);
    doc.text(needed ? 'Profesyonel Değerlendirme Önerilir' : 'İzleme Önerilir', M + 8, y + 9);
    fnt('normal'); fs(9.5); tc(P.sub);
    doc.text(refLines, M + 8, y + 16);
    let ry2 = y + 16 + refLines.length * 4.9;
    if (extra.length) { fnt('bold'); tc(P.ink); doc.text(extra, M + 8, ry2); ry2 += extra.length * 4.9; }
    fnt('normal'); fs(7.5); tc(P.faint);
    doc.text(recs.professionalReferral.disclaimer || '', M + 8, ry2 + 1);
    y += boxH + 6;
  }

  // ════════════════════ SAYFA 8: YÖNTEM, SÖZLÜK, KVKK ════════════════════
  const T8 = 'Yöntem, Sözlük ve KVKK';
  contentPage(T8);
  sectionTitle('Yöntem Notu', P.brand);
  para(`Bu rapor yalnız bu cihazda kayıtlı Galaksay oyun oturumlarından üretilir. Bir alan hakkında yargı için en az ${MIN_ITEMS_CATEGORY} cevaplanmış soru, genel risk için en az ${MIN_ITEMS_OVERALL} soru gerekir; daha azında ilgili bölüm "yetersiz veri" olarak bırakılır. Risk puanı dört bileşenden oluşur: doğruluk (öğretimsel düzey geleneği: ≥%80 bağımsız, %60–79 öğretimsel, <%60 engellenme), ortalama ipucu kademesi (0–5), son 20 maddedeki tutarlılık ve çocuğun kendi medyanına göre yanıt hızı. Öğrenme yörüngesi düzeyleri Clements & Sarama (2009/2014) çerçevesine dayanır.`, { title: T8 });
  y += 2;
  sectionTitle('Sözlük', P.brand);
  const glossary = [
    ['Doğruluk', 'Doğru cevapların cevaplanan soru sayısına oranı.'],
    ['Medyan yanıt süresi', 'Yanıt sürelerinin ortancası; uç değerlerden ortalamaya göre daha az etkilenir.'],
    ['İpucu kademesi', '0 (ipucu yok) – 5 (tam rehberlik) arası destek düzeyi; ortalaması ipucu bağımlılığını gösterir.'],
    ['LT düzeyi', 'Clements–Sarama Öğrenme Yörüngesi çerçevesinde alanın gelişim basamağı; alan başına farklı aralık (ör. Sayma L2–L18).'],
    ['Risk düzeyi', '1 (çok düşük) – 6 (çok yüksek) arası eğitsel risk göstergesi; Numap taramasıyla aynı ölçek.'],
    ['Üçlü kod', 'Somut (nesne) – sözel – sembolik (rakam) gösterimlerin birlikte sunulması.'],
  ];
  for (const [term, def] of glossary) {
    checkBreak(12, T8);
    fnt('bold'); fs(9.5); tc(P.brand);
    doc.text(term, M, y);
    fnt('normal'); fs(9.5); tc(P.sub);
    const lines = doc.splitTextToSize(def, CW - 42);
    doc.text(lines, M + 40, y);
    y += Math.max(7, lines.length * 4.9 + 2);
  }
  y += 4;
  checkBreak(40, T8);
  fc(P.amberL); dc(P.amber); doc.setLineWidth(0.4);
  doc.roundedRect(M, y, CW, 20, 2.5, 2.5, 'FD');
  fnt('bold'); fs(10.5); tc(P.amber);
  doc.text('Bu rapor bir tanı aracı değildir.', M + 8, y + 9);
  fnt('normal'); fs(9); tc(P.sub);
  doc.text('Eğitsel izleme ve destek planlaması içindir; kesin değerlendirme için bir uzmana başvurulmalıdır.', M + 8, y + 15.5);
  y += 28;
  sectionTitle('Kişisel Verilerin Korunması (KVKK)', P.faint);
  para('Bu rapor bir çocuğa ait kişisel veri (ad, sınıf, performans kayıtları) içerir ve 6698 sayılı KVKK kapsamındadır. Yalnız velisi ve eğitiminden sorumlu kişilerle paylaşılmalı, üçüncü kişilere aktarılmamalı, gereksiz kopyaları silinmelidir. Veriler cihazda yerel olarak saklanır; anonim (adsız) rapor seçeneği ile kimlik alanları kaldırılabilir.', { title: T8, size: 8.5 });
  y += 2;
  fnt('normal'); fs(8.5); tc(P.faint);
  doc.text('Galaksay: diskalkuli riski taşıyan çocuklar için matematik öğrenme platformu — galaksay.com', M, y); y += 5;
  doc.text('Numap: Sayısal Beceriler Haritalama Platformu — başlangıç profilini oluşturur — getnumap.com', M, y);
  void screening;

  // ════════════════════ ALTBİLGİ (tüm sayfalar) ════════════════════
  const pageCount = doc.internal.getNumberOfPages();
  const stamp = `${fmtDate(now)} · Galaksay v${APP_VERSION}`;
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    dc(P.line); doc.setLineWidth(0.3); doc.line(M, H - 14, W - M, H - 14);
    fnt('normal'); fs(7.5); tc(P.faint);
    doc.text(`${stamp}  ·  Kişisel veri içerir (KVKK) — yalnız yetkili kişilerle paylaşın  ·  Tanı aracı değildir`, M, H - 9);
    doc.text(`Sayfa ${i} / ${pageCount}`, W - M, H - 9, { align: 'right' });
  }

  return childName;
}

export { generatePDFReport, buildReportData, renderReport };
