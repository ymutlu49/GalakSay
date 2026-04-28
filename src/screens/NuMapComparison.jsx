// GalakSay Analytics — 2026-03-18 — NuMap karşılaştırma raporu ekranı
import React, { useEffect, useState } from 'react';
import { compareWithNuMapBaseline, screenDyscalculiaIndicators } from '../analytics/RiskClassifier.js';
import { getFullPerformanceProfile, CATEGORIES } from '../analytics/PerformanceAnalyzer.js';
import { CATEGORY_LABELS } from '../analytics/StrengthWeaknessMapper.js';
import { getChildProfile } from '../analytics/database.js';
import RadarChartComponent from '../components/analytics/RadarChart.jsx';

const RISK_COLORS = ['#34d399', '#86efac', '#facc15', '#fb923c', '#f87171', '#dc2626'];
const RISK_LABELS = ['Çok Düşük', 'Düşük', 'Orta-Düşük', 'Orta-Yüksek', 'Yüksek', 'Çok Yüksek'];

export default function NuMapComparison({ childId, onBack }) {
  const [comparison, setComparison] = useState(null);
  const [screening, setScreening] = useState(null);
  const [profile, setProfile] = useState(null);
  const [perfProfile, setPerfProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!childId) return;
    Promise.all([
      compareWithNuMapBaseline(childId),
      screenDyscalculiaIndicators(childId),
      getChildProfile(childId),
      getFullPerformanceProfile(childId),
    ]).then(([comp, scr, prof, perf]) => {
      setComparison(comp);
      setScreening(scr);
      setProfile(prof);
      setPerfProfile(perf);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [childId]);

  if (loading) {
    return <div style={pageStyle}><div style={{ color: '#94a3b8', textAlign: 'center', marginTop: 100 }}>Yükleniyor...</div></div>;
  }

  // Radar verisi
  const currentRadar = {};
  const baselineRadar = {};
  for (const cat of CATEGORIES) {
    currentRadar[cat] = Math.round((perfProfile?.categoryMetrics?.[cat]?.accuracy || 0) * 100);
    baselineRadar[cat] = comparison?.categoryComparisons?.find(c => c.category === cat)?.nuMapScore
      ? (6 - comparison.categoryComparisons.find(c => c.category === cat).nuMapScore) * 16.7
      : 50;
  }

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #1e293b' }}>
        <button onClick={onBack} style={btnStyle}>← Geri</button>
        <h2 style={{ color: '#e2e8f0', fontSize: 15, margin: 0 }}>NuMap Karşılaştırma</h2>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ overflow: 'auto', flex: 1, padding: 16 }}>
        {/* Başlık bilgisi */}
        <div style={cardStyle}>
          <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 800, margin: '0 0 10px' }}>NuMap Başlangıç vs GalakSay İlerleme</h3>
          {comparison && (
            <div style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.5 }}>
              <div>Geçen süre: {comparison.timeElapsed_days || '?'} gün</div>
              <div>Başlangıç risk: Düzey {comparison.nuMapRiskLevel} → Güncel: Düzey {comparison.currentRiskLevel}</div>
            </div>
          )}
          {!comparison && (
            <div style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.5 }}>NuMap başlangıç verisi bulunamadı. Çocuk profili NuMap verileriyle güncellendiğinde karşılaştırma yapılabilir.</div>
          )}
        </div>

        {/* Radar grafik */}
        <div style={cardStyle}>
          <RadarChartComponent
            data={currentRadar}
            comparisonData={comparison ? baselineRadar : null}
            title="Kategori Bazlı Karşılaştırma"
            height={300}
          />
        </div>

        {/* Risk düzeyi değişimi */}
        {comparison && (
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Risk Düzeyi Değişimi</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              {[1, 2, 3, 4, 5, 6].map(level => (
                <div key={level} style={{ flex: 1, position: 'relative' }}>
                  <div style={{
                    height: 24,
                    background: RISK_COLORS[level - 1],
                    borderRadius: level === 1 ? '4px 0 0 4px' : level === 6 ? '0 4px 4px 0' : 0,
                    opacity: 0.3,
                  }} />
                  {comparison.nuMapRiskLevel === level && (
                    <div style={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 32, borderRadius: 4, background: '#a78bfa', border: '2px solid #e2e8f0' }} />
                  )}
                  {comparison.currentRiskLevel === level && (
                    <div style={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 32, borderRadius: 4, background: '#22d3ee', border: '2px solid #e2e8f0' }} />
                  )}
                  <div style={{ textAlign: 'center', color: '#cbd5e1', fontSize: 11, fontWeight: 700, marginTop: 4 }}>{level}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 11 }}>
              <span style={{ color: '#a78bfa' }}>● NuMap Başlangıç</span>
              <span style={{ color: '#22d3ee' }}>● GalakSay Güncel</span>
            </div>
          </div>
        )}

        {/* Kategori bazlı değişim */}
        {comparison?.categoryComparisons?.length > 0 && (
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Kategori Bazlı Değişim</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  <th style={thStyle}>Kategori</th>
                  <th style={thStyle}>NuMap</th>
                  <th style={thStyle}>Güncel</th>
                  <th style={thStyle}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {comparison.categoryComparisons.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={tdStyle}>{CATEGORY_LABELS[c.category] || c.category}</td>
                    <td style={tdStyle}>{RISK_LABELS[c.nuMapScore - 1] || c.nuMapScore}</td>
                    <td style={tdStyle}>{RISK_LABELS[c.currentScore - 1] || c.currentScore}</td>
                    <td style={{
                      ...tdStyle,
                      color: c.trend === 'improved' ? '#34d399' : c.trend === 'worsened' ? '#f87171' : '#94a3b8',
                    }}>
                      {c.trend === 'improved' ? '↑ Gelişim' : c.trend === 'worsened' ? '↓ Gerileme' : '→ Stabil'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Diskalkuli göstergeleri */}
        {screening && (
          <div style={{ ...cardStyle, border: screening.overallScreeningResult === 'refer_for_assessment' ? '1px solid #f87171' : '1px solid #334155' }}>
            <h3 style={sectionTitle}>Diskalkuli Gösterge Taraması</h3>
            <div style={{
              padding: '8px 12px',
              borderRadius: 6,
              marginBottom: 8,
              background: screening.overallScreeningResult === 'no_concern' ? 'rgba(52,211,153,0.1)' :
                screening.overallScreeningResult === 'monitor' ? 'rgba(250,204,21,0.1)' : 'rgba(248,113,113,0.1)',
            }}>
              <span style={{
                fontSize: 13, fontWeight: 600,
                color: screening.overallScreeningResult === 'no_concern' ? '#34d399' :
                  screening.overallScreeningResult === 'monitor' ? '#facc15' : '#f87171',
              }}>
                {screening.overallScreeningResult === 'no_concern' ? '✅ Endişe yok' :
                  screening.overallScreeningResult === 'monitor' ? '⚠️ İzleme önerilir' : '🔴 Değerlendirme önerilir'}
              </span>
            </div>

            {screening.indicatorsFound.map((ind, i) => (
              <div key={i} style={{ marginBottom: 12, paddingLeft: 10, borderLeft: '3px solid #fb923c' }}>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{ind.indicator.replace(/_/g, ' ')}</div>
                <div style={{ color: '#e2e8f0', fontSize: 12, lineHeight: 1.5 }}>{ind.recommendation}</div>
                <div style={{ color: '#a8b2d1', fontSize: 11, fontWeight: 600, marginTop: 2 }}>Güven: %{Math.round(ind.confidence * 100)}</div>
              </div>
            ))}

            <p style={{ color: '#a8b2d1', fontSize: 11, fontStyle: 'italic', margin: '12px 0 0', lineHeight: 1.5 }}>{screening.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const pageStyle = { display: 'flex', flexDirection: 'column', height: '100%', background: '#0f172a', color: '#e2e8f0' };
const cardStyle = { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid #475569', borderRadius: 12, padding: 16, marginBottom: 12 };
const sectionTitle = { color: '#fff', fontSize: 15, fontWeight: 800, margin: '0 0 12px' };
const btnStyle = { background: 'rgba(30,41,59,0.8)', border: '1px solid #475569', borderRadius: 8, color: '#fff', padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 700 };
const thStyle = { textAlign: 'left', padding: '8px 10px', color: '#cbd5e1', fontWeight: 700, fontSize: 12 };
const tdStyle = { padding: '8px 10px', color: '#fff', fontSize: 13 };
