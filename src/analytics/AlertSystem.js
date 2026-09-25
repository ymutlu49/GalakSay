// GalakSay Analytics — Uyarı ve bildirim sistemi
// 2026-09-25: örneklem eşiği (tek doğru cevapla "Yüksek Doğruluk!" üretilmiyor), okunur
// kategori adları, 7 günlük tekrar-önleme (her oturum sonunda aynı uyarı çoğalıyordu).

import { STORES, putRecord, getAlertsByChild } from './database.js';
import { CATEGORIES, getCategoryStats } from './PerformanceAnalyzer.js';
import { screenDyscalculiaIndicators } from './RiskClassifier.js';

const CATEGORY_LABELS = {
  sayma: 'Sayma', subitizing: 'Subitizing', karsilastirma: 'Karşılaştırma',
  sayi_bilesimi: 'Sayı Bileşimi', basamak_degeri: 'Basamak Değeri',
  toplama_cikarma: 'Toplama/Çıkarma', carpma_bolme: 'Çarpma/Bölme', oruntu: 'Örüntü',
};
const label = (cat) => CATEGORY_LABELS[cat] || cat || 'Genel';
const DAY = 86400000;

function generateAlertId() {
  return 'alert_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

async function createAlert(childId, type, category, title, message, recommendation, data = {}) {
  const alert = {
    alertId: generateAlertId(),
    childId,
    type, // "positive" | "attention" | "critical"
    category,
    title,
    message,
    recommendation,
    timestamp: new Date().toISOString(),
    read: 0,
    data: JSON.stringify(data),
  };
  await putRecord(STORES.ALERTS, alert);
  return alert;
}

// Ana kontrol fonksiyonu — oturum sonunda çağrılır
async function checkAlerts(childId, sessionSummary = {}) {
  const alerts = [];
  const existing = await getAlertsByChild(childId).catch(() => []);
  const recent = (title, category, days) => existing.some(a =>
    a.title === title && (category == null || a.category === category) &&
    Date.now() - new Date(a.timestamp).getTime() < days * DAY);

  // ── OLUMLU UYARILAR ──────────────────
  if (Array.isArray(sessionSummary.ltLevelUps)) {
    for (const up of sessionSummary.ltLevelUps) {
      const a = await createAlert(childId, 'positive', up.category,
        'Düzey Yükseldi!',
        `${label(up.category)} alanında L${up.newLevel} düzeyine yükseldi.`,
        'Bu başarıyı kutlayın ve bir sonraki düzeye geçişi teşvik edin.',
        up);
      alerts.push(a);
    }
  }
  if (Array.isArray(sessionSummary.ltLevelDowns)) {
    for (const down of sessionSummary.ltLevelDowns) {
      const a = await createAlert(childId, 'attention', down.category,
        'Düzey Geri Alındı',
        `${label(down.category)} alanında L${down.previousLevel} › L${down.newLevel}: son maddelerde zorlanma görüldü.`,
        'Bu alanda somut materyalle kısa bir pekiştirme oturumu planlayın.',
        down);
      alerts.push(a);
    }
  }

  const weekRange = { start: Date.now() - 7 * DAY, end: Date.now() };
  for (const cat of CATEGORIES) {
    const [all, week] = await Promise.all([
      getCategoryStats(childId, cat),
      getCategoryStats(childId, cat, weekRange),
    ]);

    // Doğruluk kilometre taşı — en az MIN_ITEMS_CATEGORY madde, 7 günde bir
    if (all.sufficient && all.accuracy >= 0.90 && !recent('Yüksek Doğruluk!', cat, 7)) {
      const a = await createAlert(childId, 'positive', cat,
        'Yüksek Doğruluk!',
        `${label(cat)} alanında %${Math.round(all.accuracy * 100)} doğruluğa ulaştı (n=${all.n}).`,
        'Bu alanda bir üst düzeye geçmeyi değerlendirin.',
        { accuracy: all.accuracy, n: all.n });
      alerts.push(a);
    }

    // ── DİKKAT UYARILARI (son 7 gün, en az MIN_ITEMS_CATEGORY madde) ──
    if (week.sufficient && week.accuracy < 0.50 && !recent('Zorlanma Tespit Edildi', cat, 7)) {
      const a = await createAlert(childId, 'attention', cat,
        'Zorlanma Tespit Edildi',
        `${label(cat)} alanında son hafta %${Math.round(week.accuracy * 100)} doğruluk (n=${week.n}).`,
        'Zorluk düzeyini düşürmeyi ve somut materyalle çalışmayı değerlendirin.',
        { accuracy: week.accuracy, n: week.n });
      alerts.push(a);
    }
    if (week.sufficient && week.avgHint >= 4 && !recent('Yüksek İpucu Bağımlılığı', cat, 7)) {
      const a = await createAlert(childId, 'attention', cat,
        'Yüksek İpucu Bağımlılığı',
        `${label(cat)} alanında sürekli Kademe ${Math.round(week.avgHint)} ipucuna ihtiyaç duyuyor (n=${week.n}).`,
        'İpucu kademesini kademeli azaltın ve bağımsız deneme fırsatları oluşturun.',
        { avgHintLevel: week.avgHint, n: week.n });
      alerts.push(a);
    }
  }

  // Seri başarımı
  if (sessionSummary.bestStreak >= 10) {
    const a = await createAlert(childId, 'positive', null,
      'Harika Seri!',
      `${sessionSummary.bestStreak} ardışık doğru cevap verdi.`,
      'Bu başarıyı kutlayın.',
      { streak: sessionSummary.bestStreak });
    alerts.push(a);
  }

  if (sessionSummary.hintUsageDecreased) {
    const a = await createAlert(childId, 'positive', null,
      'Bağımsızlık Artıyor!',
      'Son oturumda ipucu kullanımı belirgin şekilde azaldı.',
      'Bağımsız çalışma becerisini desteklemeye devam edin.',
      {});
    alerts.push(a);
  }

  // Oturum çok uzunsa
  if (sessionSummary.duration_ms > 40 * 60000) {
    const a = await createAlert(childId, 'attention', null,
      'Uzun Oturum',
      `Son oturum ${Math.round(sessionSummary.duration_ms / 60000)} dakika sürdü; yorgunluk belirtileri olabilir.`,
      'Oturum süresini 20–25 dakika ile sınırlamayı değerlendirin.',
      { duration: sessionSummary.duration_ms });
    alerts.push(a);
  }

  // ── KRİTİK UYARILAR ────────────────
  const screening = await screenDyscalculiaIndicators(childId);
  if (screening.overallScreeningResult === 'refer_for_assessment' && !recent('Diskalkuli Göstergeleri', null, 30)) {
    const a = await createAlert(childId, 'critical', null,
      'Diskalkuli Göstergeleri',
      `Birden fazla gösterge bir arada: ${screening.indicatorsFound.map(i => i.label || i.indicator).join(', ')}.`,
      'Profesyonel değerlendirme için uzman görüşü alınması önerilir. Bu bir tanı değildir.',
      { indicators: screening.indicatorsFound.map(i => i.indicator) });
    alerts.push(a);
  }

  return alerts;
}

export { checkAlerts, createAlert };
