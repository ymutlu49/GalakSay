// GalakSay Analytics — 2026-03-18 — Uyarı ve bildirim sistemi

import { STORES, putRecord, getAlertsByChild } from './database.js';
import { CATEGORIES, getOverallAccuracy, getCategoryAccuracy, getAvgHintLevel, getHintDependencyRate } from './PerformanceAnalyzer.js';
import { getCurrentLTLevels } from './LTProgressEngine.js';
import { calculateRiskLevel, screenDyscalculiaIndicators } from './RiskClassifier.js';

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

  // ── OLUMLU UYARILAR ──────────────────
  // LT düzey yükselmesi (session summary'den gelir)
  if (sessionSummary.ltLevelUps) {
    for (const up of sessionSummary.ltLevelUps) {
      const a = await createAlert(childId, 'positive', up.category,
        'Düzey Yükseldi!',
        `${up.category} kategorisinde L${up.newLevel} düzeyine yükseldi!`,
        'Bu başarıyı kutlayın ve bir sonraki düzeye geçişi teşvik edin.',
        up);
      alerts.push(a);
    }
  }

  // Doğruluk kilometre taşları
  for (const cat of CATEGORIES) {
    const acc = await getCategoryAccuracy(childId, cat);
    if (acc >= 0.90) {
      const existing = await getAlertsByChild(childId);
      const hasExisting = existing.some(a =>
        a.category === cat && a.title === 'Yüksek Doğruluk!' &&
        Date.now() - new Date(a.timestamp).getTime() < 7 * 86400000
      );
      if (!hasExisting) {
        const a = await createAlert(childId, 'positive', cat,
          'Yüksek Doğruluk!',
          `${cat} kategorisinde %${Math.round(acc * 100)} doğruluğa ulaştı!`,
          'Bu kategoride bir üst düzeye geçmeyi değerlendirin.',
          { accuracy: acc });
        alerts.push(a);
      }
    }
  }

  // Seri başarımı
  if (sessionSummary.bestStreak >= 10) {
    const a = await createAlert(childId, 'positive', null,
      'Harika Seri!',
      `${sessionSummary.bestStreak} ardışık doğru cevap verdi!`,
      'Bu başarıyı kutlayın.',
      { streak: sessionSummary.bestStreak });
    alerts.push(a);
  }

  // İpucu kullanımı azalması
  if (sessionSummary.hintUsageDecreased) {
    const a = await createAlert(childId, 'positive', null,
      'Bağımsızlık Artıyor!',
      'Son oturumda ipucu kullanımı belirgin şekilde azaldı.',
      'Çocuğun bağımsız çalışma becerisini desteklemeye devam edin.',
      {});
    alerts.push(a);
  }

  // ── DİKKAT UYARILARI ─────────────────
  for (const cat of CATEGORIES) {
    const acc = await getCategoryAccuracy(childId, cat, { start: Date.now() - 7 * 86400000, end: Date.now() });
    const hint = await getAvgHintLevel(childId, cat, { start: Date.now() - 7 * 86400000, end: Date.now() });

    if (acc > 0 && acc < 0.50) {
      const a = await createAlert(childId, 'attention', cat,
        'Zorlanma Tespit Edildi',
        `${cat} kategorisinde son hafta %${Math.round(acc * 100)} doğruluk.`,
        'Bu kategoride zorluk düzeyini azaltmayı ve somut materyallerle çalışmayı değerlendirin.',
        { accuracy: acc });
      alerts.push(a);
    }

    if (hint >= 4) {
      const a = await createAlert(childId, 'attention', cat,
        'Yüksek İpucu Bağımlılığı',
        `${cat} kategorisinde sürekli Kademe ${Math.round(hint)} ipucuna ihtiyaç duyuyor.`,
        'İpucu kademesini kademeli olarak azaltmayı ve bağımsız deneme fırsatları oluşturmayı değerlendirin.',
        { avgHintLevel: hint });
      alerts.push(a);
    }
  }

  // Oturum çok uzunsa
  if (sessionSummary.duration_ms > 40 * 60000) {
    const a = await createAlert(childId, 'attention', null,
      'Uzun Oturum',
      `Son oturum ${Math.round(sessionSummary.duration_ms / 60000)} dakika sürdü. Yorgunluk belirtileri olabilir.`,
      'Oturum süresini 20–25 dakika ile sınırlamayı değerlendirin.',
      { duration: sessionSummary.duration_ms });
    alerts.push(a);
  }

  // ── KRİTİK UYARILAR ────────────────
  // Diskalkuli göstergeleri
  const screening = await screenDyscalculiaIndicators(childId);
  if (screening.overallScreeningResult === 'refer_for_assessment') {
    const existing = await getAlertsByChild(childId);
    const recentScreening = existing.some(a =>
      a.title === 'Diskalkuli Göstergeleri' &&
      Date.now() - new Date(a.timestamp).getTime() < 30 * 86400000
    );
    if (!recentScreening) {
      const a = await createAlert(childId, 'critical', null,
        'Diskalkuli Göstergeleri',
        `Birden fazla diskalkuli göstergesi tespit edildi: ${screening.indicatorsFound.map(i => i.indicator).join(', ')}`,
        'Profesyonel değerlendirme için uzman görüşü alınması önerilir. Bu bir tanı değildir.',
        screening);
      alerts.push(a);
    }
  }

  return alerts;
}

export { checkAlerts, createAlert };
