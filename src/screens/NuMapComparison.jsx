// GalakSay Analytics — Numap ön–son karşılaştırma ekranı
// 2026-09-25: Numap taban çizgisi yoksa tek bir açıklayıcı boş durum; "?" / boş "Düzey" asla
// çıkmaz (yetersiz veri metinle söylenir); radar iki seri için aynı ölçek (risk → güç 0–100);
// tarama sonucu "yetersiz veri" durumunu ve kanıt metnini gösterir.
import React, { useEffect, useState } from 'react';
import { compareWithNuMapBaseline, screenDyscalculiaIndicators, calculateRiskLevel } from '../analytics/RiskClassifier.js';
import { CATEGORIES, MIN_ITEMS_CATEGORY, MIN_ITEMS_OVERALL } from '../analytics/PerformanceAnalyzer.js';
import { CATEGORY_LABELS } from '../analytics/StrengthWeaknessMapper.js';
import RadarChartComponent from '../components/analytics/RadarChart.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { spacing, layout } from '../design-system/spacing.js';
import { Button } from '../design-system/components/Button.jsx';
import { Skeleton } from '../design-system/components/Skeleton.jsx';
import { EmptyState } from '../design-system/components/EmptyState.jsx';

const font = typography.fontFamily.display;
const RISK_COLORS = ['#34d399', '#86efac', '#facc15', '#fb923c', '#f87171', '#dc2626'];
const RISK_LABELS = ['Çok düşük', 'Düşük', 'Orta-düşük', 'Orta-yüksek', 'Yüksek', 'Çok yüksek'];
const riskText = (r) => (r == null ? '—' : `${r} · ${RISK_LABELS[r - 1] || ''}`);
// Risk (1–6) → güç puanı 0–100 (radar için ortak ölçek)
const strength = (r) => (r == null ? null : Math.round(((6 - r) / 5) * 100));
const fmtDate = (d) => { const x = new Date(d); return Number.isNaN(x.getTime()) ? '—' : x.toLocaleDateString('tr-TR'); };

export default function NuMapComparison({ childId, onBack }) {
  const [comparison, setComparison] = useState(null);
  const [screening, setScreening] = useState(null);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!childId) return;
    let active = true;
    setLoading(true);
    Promise.all([
      compareWithNuMapBaseline(childId),
      screenDyscalculiaIndicators(childId),
      calculateRiskLevel(childId),
    ]).then(([comp, scr, r]) => {
      if (!active) return;
      setComparison(comp);
      setScreening(scr);
      setRisk(r);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      if (!active) return;
      setError('Karşılaştırma verisi yüklenemedi.');
      setLoading(false);
    });
    return () => { active = false; };
  }, [childId]);

  if (loading) {
    return (
      <div style={pageStyle}>
        <Header onBack={onBack} />
        <div style={{ padding: spacing[4], display: 'grid', gap: spacing[3] }} aria-busy="true">
          <Skeleton variant="card" width="100%" height={90} />
          <Skeleton variant="card" width="100%" height={260} />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div style={pageStyle}>
        <Header onBack={onBack} />
        <div style={{ padding: spacing[6], textAlign: 'center', color: colors.text.secondary }}>{error}</div>
      </div>
    );
  }

  // Numap taban çizgisi yok → tek açıklayıcı boş durum
  if (!comparison) {
    return (
      <div style={pageStyle}>
        <Header onBack={onBack} />
        <EmptyState
          icon="🔬"
          title="Numap tarama verisi yok"
          description="Bu çocuk için Numap tarama verisi yok. Numap'ta (getnumap.com) yapılan taramayla eşleştirildiğinde başlangıç–güncel karşılaştırması burada görünür. Galaksay oyun verisi Gelişim Paneli'nde izlenebilir."
          actionLabel="← Geri dön"
          onAction={onBack}
        />
      </div>
    );
  }

  const cur = comparison.currentRiskLevel;
  const curSufficient = cur != null;
  const compRows = comparison.categoryComparisons || [];
  const assessedRows = compRows.filter(c => c.currentScore != null);
  const currentRadar = {};
  const baselineRadar = {};
  for (const cat of CATEGORIES) {
    const row = compRows.find(c => c.category === cat);
    currentRadar[cat] = strength(risk?.categoryRisks?.[cat] ?? null) ?? 0;
    baselineRadar[cat] = strength(row?.nuMapScore ?? null) ?? 0;
  }
  const changeInfo = { improved: { t: 'İyileşme', c: colors.feedback.success }, worsened: { t: 'Gerileme', c: colors.accent.tertiary }, stable: { t: 'Sabit', c: colors.text.secondary }, insufficient: { t: 'Yetersiz veri', c: colors.text.tertiary } }[comparison.change] || { t: '—', c: colors.text.tertiary };

  const SCREEN = {
    no_concern: { t: '✅ Endişe yok', bg: 'rgba(52,211,153,0.12)', c: colors.feedback.success },
    monitor: { t: '⚠️ İzleme önerilir', bg: 'rgba(250,204,21,0.12)', c: colors.accent.gold },
    refer_for_assessment: { t: '🔴 Değerlendirme önerilir', bg: 'rgba(248,113,113,0.12)', c: colors.accent.tertiary },
    insufficient_data: { t: 'ℹ️ Tarama için yeterli veri yok', bg: 'rgba(255,255,255,0.06)', c: colors.text.secondary },
  };
  const scr = screening ? (SCREEN[screening.overallScreeningResult] || SCREEN.insufficient_data) : null;

  return (
    <div style={pageStyle}>
      <Header onBack={onBack} />

      <div style={{ overflow: 'auto', flex: 1, padding: spacing[4], paddingBottom: spacing[8] }}>
        {/* Özet */}
        <div style={{ ...cardStyle, borderLeft: `4px solid ${changeInfo.c}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
            <h3 style={{ ...sectionTitle, margin: 0 }}>Numap başlangıç ↔ Galaksay güncel</h3>
            <span style={{ color: changeInfo.c, fontWeight: 800, fontSize: 13, fontFamily: font }}>{changeInfo.t}</span>
          </div>
          <div style={{ color: colors.text.secondary, fontSize: 13, lineHeight: 1.6, marginTop: 8 }}>
            <div>Tarama tarihi: {comparison.assessmentDate ? fmtDate(comparison.assessmentDate) : 'kayıtlı değil'}{comparison.timeElapsed_days != null ? ` · ${comparison.timeElapsed_days} gün önce` : ''}</div>
            <div>Başlangıç risk: <strong style={{ color: colors.text.primary }}>Düzey {riskText(comparison.nuMapRiskLevel)}</strong></div>
            <div>Güncel risk: <strong style={{ color: colors.text.primary }}>{curSufficient ? `Düzey ${riskText(cur)}` : `henüz hesaplanamadı (${comparison.totalAnswered}/${MIN_ITEMS_OVERALL} soru)`}</strong></div>
          </div>
          {!curSufficient && (
            <p style={{ color: colors.text.tertiary, fontSize: 12, margin: '8px 0 0', lineHeight: 1.5 }}>
              Güncel risk için en az {MIN_ITEMS_OVERALL} cevaplanmış soru gerekir. Birkaç oturum sonra karşılaştırma otomatik oluşur.
            </p>
          )}
        </div>

        {/* Risk şeridi */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Risk düzeyi değişimi (1 = düşük · 6 = yüksek)</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            {[1, 2, 3, 4, 5, 6].map(level => (
              <div key={level} style={{ flex: 1, position: 'relative' }}>
                <div style={{ height: 24, background: RISK_COLORS[level - 1], borderRadius: level === 1 ? '4px 0 0 4px' : level === 6 ? '0 4px 4px 0' : 0, opacity: 0.3 }} />
                {comparison.nuMapRiskLevel === level && (
                  <div title="Numap başlangıç" style={{ position: 'absolute', top: -4, left: '50%', transform: `translateX(calc(-50% ${cur === level ? '- 6px' : ''}))`, width: 8, height: 32, borderRadius: 4, background: '#a78bfa', border: '2px solid #e2e8f0' }} />
                )}
                {cur === level && (
                  <div title="Galaksay güncel" style={{ position: 'absolute', top: -4, left: '50%', transform: `translateX(calc(-50% ${comparison.nuMapRiskLevel === level ? '+ 6px' : ''}))`, width: 8, height: 32, borderRadius: 4, background: '#22d3ee', border: '2px solid #e2e8f0' }} />
                )}
                <div style={{ textAlign: 'center', color: colors.text.secondary, fontSize: 11, fontWeight: 700, marginTop: 4 }}>{level}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 11, flexWrap: 'wrap' }}>
            <span style={{ color: '#a78bfa' }}>● Numap başlangıç</span>
            <span style={{ color: '#22d3ee' }}>● Galaksay güncel{curSufficient ? '' : ' (henüz yok)'}</span>
          </div>
        </div>

        {/* Radar */}
        {assessedRows.length >= 3 && (
          <div style={cardStyle}>
            <RadarChartComponent data={currentRadar} comparisonData={baselineRadar} title="Alan bazlı güç puanı (100 = en düşük risk)" height={300} />
            <div style={{ color: colors.text.tertiary, fontSize: 11, textAlign: 'center' }}>Her iki seri de risk düzeyinden (1–6) türetilir; yeterli verisi olmayan alan 0 görünür.</div>
          </div>
        )}

        {/* Alan tablosu */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Alan bazlı değişim</h3>
          {compRows.length === 0 ? (
            <p style={emptyText}>Numap alan puanları kayıtlı değil; yalnız genel risk karşılaştırılabildi.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.surface.divider}` }}>
                    <th style={thStyle}>Alan</th>
                    <th style={thStyle}>Numap</th>
                    <th style={thStyle}>Güncel</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Soru</th>
                    <th style={thStyle}>Değişim</th>
                  </tr>
                </thead>
                <tbody>
                  {compRows.map((c) => {
                    const tr = { improved: ['↑ Gelişim', colors.feedback.success], worsened: ['↓ Gerileme', colors.accent.tertiary], stable: ['→ Sabit', colors.text.secondary], insufficient: [`az veri (<${MIN_ITEMS_CATEGORY})`, colors.text.tertiary] }[c.trend] || ['—', colors.text.tertiary];
                    return (
                      <tr key={c.category} style={{ borderBottom: `1px solid ${colors.surface.divider}` }}>
                        <td style={tdStyle}>{CATEGORY_LABELS[c.category] || c.category}</td>
                        <td style={tdStyle}>{riskText(c.nuMapScore)}</td>
                        <td style={tdStyle}>{c.currentScore == null ? '—' : riskText(c.currentScore)}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>{c.n ?? 0}</td>
                        <td style={{ ...tdStyle, color: tr[1], fontWeight: 700 }}>{tr[0]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Diskalkuli göstergeleri */}
        {screening && scr && (
          <div style={{ ...cardStyle, border: `1px solid ${screening.overallScreeningResult === 'refer_for_assessment' ? colors.accent.tertiary : colors.surface.divider}` }}>
            <h3 style={sectionTitle}>Diskalkuli gösterge taraması</h3>
            <div style={{ padding: '8px 12px', borderRadius: layout.borderRadius.sm, marginBottom: 8, background: scr.bg }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: scr.c }}>{scr.t}</span>
            </div>
            {screening.overallScreeningResult === 'insufficient_data' && (
              <p style={emptyText}>Her gösterge için ilgili alanlarda en az {MIN_ITEMS_CATEGORY} soru gerekir. Şimdilik hiçbir gösterge taranamadı.</p>
            )}
            {screening.indicatorsFound.map((ind) => (
              <div key={ind.indicator} style={{ marginBottom: 12, paddingLeft: 10, borderLeft: `3px solid ${colors.accent.orange}` }}>
                <div style={{ color: colors.text.primary, fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{ind.label || ind.indicator.replace(/_/g, ' ')}</div>
                {ind.evidenceText && <div style={{ color: colors.text.tertiary, fontSize: 11 }}>Kanıt: {ind.evidenceText}</div>}
                <div style={{ color: colors.text.secondary, fontSize: 12, lineHeight: 1.5 }}>{ind.recommendation}</div>
                <div style={{ color: colors.text.tertiary, fontSize: 11, fontWeight: 600, marginTop: 2 }}>Kanıt gücü: %{Math.round(ind.confidence * 100)}</div>
              </div>
            ))}
            {screening.overallScreeningResult === 'no_concern' && (
              <p style={emptyText}>Taranan {screening.screenedIndicators.length} göstergede endişe verici örüntü bulunmadı{screening.notScreenedIndicators.length ? `; ${screening.notScreenedIndicators.length} gösterge için henüz yeterli veri yok` : ''}.</p>
            )}
            <p style={{ color: colors.text.tertiary, fontSize: 11, fontStyle: 'italic', margin: '12px 0 0', lineHeight: 1.5 }}>{screening.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Header({ onBack }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: `${spacing[3]}px ${spacing[4]}px`, borderBottom: `1px solid ${colors.surface.divider}` }}>
      <Button variant="ghost" size="sm" onClick={onBack}>← Geri</Button>
      <h2 style={{ color: colors.text.primary, fontSize: 16, margin: 0, fontFamily: font, fontWeight: 800, flex: 1, textAlign: 'center', minWidth: 0 }}>Numap Karşılaştırma</h2>
      <div style={{ width: 64 }} />
    </div>
  );
}

const pageStyle = { display: 'flex', flexDirection: 'column', height: '100%', background: colors.gradient.background, color: colors.text.primary, fontFamily: typography.fontFamily.primary };
const cardStyle = { background: colors.gradient.card, border: `1px solid ${colors.surface.divider}`, borderRadius: layout.borderRadius.lg, padding: spacing[4], marginBottom: spacing[3], boxShadow: layout.shadow.sm };
const sectionTitle = { color: colors.text.primary, fontSize: 14, fontWeight: 700, fontFamily: font, margin: `0 0 ${spacing[3]}px` };
const emptyText = { color: colors.text.tertiary, fontSize: 13, margin: 0, lineHeight: 1.5 };
const thStyle = { textAlign: 'left', padding: '8px 8px', color: colors.text.secondary, fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' };
const tdStyle = { padding: '8px 8px', color: colors.text.primary, fontSize: 13 };
