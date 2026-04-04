// GalakSay Analytics — 2026-03-18 — Kategori detay ekranı
import React, { useEffect, useState } from 'react';
import { getCategoryAccuracy, getAvgResponseTime, getAvgHintLevel, getHintDependencyRate, getHintEffectiveness, getCommonErrors, getRepresentationDistribution, getResponseTimeTrend, getMedianResponseTime } from '../analytics/PerformanceAnalyzer.js';
import { getCurrentLTLevels, LT_RANGES } from '../analytics/LTProgressEngine.js';
import { getEventsByChildCategoryType } from '../analytics/database.js';
import { CATEGORY_LABELS } from '../analytics/StrengthWeaknessMapper.js';
import BarChartComponent from '../components/analytics/BarChartComponent.jsx';
import ProgressRing from '../components/analytics/ProgressRing.jsx';

export default function CategoryDetail({ childId, category, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryData();
  }, [childId, category]);

  async function loadCategoryData() {
    setLoading(true);
    try {
      const [accuracy, avgRT, medianRT, avgHint, hintDep, hintEff, errors, repDist, rtTrend, ltLevels, moduleEvents] = await Promise.all([
        getCategoryAccuracy(childId, category),
        getAvgResponseTime(childId, category),
        getMedianResponseTime(childId, category),
        getAvgHintLevel(childId, category),
        getHintDependencyRate(childId, category),
        getHintEffectiveness(childId),
        getCommonErrors(childId, category),
        getRepresentationDistribution(childId, category),
        getResponseTimeTrend(childId, category),
        getCurrentLTLevels(childId),
        getEventsByChildCategoryType(childId, category, 'module_completed'),
      ]);

      setData({
        accuracy, avgRT, medianRT, avgHint, hintDep, hintEff, errors, repDist, rtTrend,
        ltLevel: ltLevels[category]?.level || LT_RANGES[category]?.min || 0,
        ltProgress: ltLevels[category]?.progress || 0,
        ltRange: LT_RANGES[category] || { min: 0, max: 18 },
        moduleEvents,
      });
    } catch (err) {
      console.error('CategoryDetail load error:', err);
    }
    setLoading(false);
  }

  if (loading || !data) {
    return (
      <div style={pageStyle}>
        <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: 100 }}>Yükleniyor...</div>
      </div>
    );
  }

  const label = CATEGORY_LABELS[category] || category;

  // İpucu kademe dağılımı
  const hintDistData = [1, 2, 3, 4, 5].map(level => ({
    name: `Kademe ${level}`,
    value: Math.round((data.hintEff[`level${level}_success`] || 0) * 100),
  }));

  // Temsil dağılımı
  const repData = [
    { name: 'Somut', value: data.repDist.somut },
    { name: 'Görsel', value: data.repDist.gorsel },
    { name: 'Sembolik', value: data.repDist.sembolik },
  ];

  // Hata türleri
  const errorData = data.errors.slice(0, 5).map(e => ({
    name: e.errorType.replace(/_/g, ' '),
    value: e.frequency,
  }));

  return (
    <div style={pageStyle}>
      {/* Başlık */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #1e293b' }}>
        <button onClick={onBack} style={btnStyle}>← Geri</button>
        <h2 style={{ color: '#e2e8f0', fontSize: 16, margin: 0 }}>{label}</h2>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ overflow: 'auto', flex: 1, padding: 16 }}>
        {/* LT düzey ilerleme */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: '#94a3b8', fontSize: 12 }}>LT Düzeyi</span>
            <span style={{ color: '#22d3ee', fontWeight: 700 }}>L{data.ltLevel} / L{data.ltRange.max}</span>
          </div>
          <div style={{ height: 10, background: '#1e293b', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${((data.ltLevel - data.ltRange.min) / (data.ltRange.max - data.ltRange.min)) * 100}%`,
              background: 'linear-gradient(90deg, #22d3ee, #a78bfa)',
              borderRadius: 5,
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ color: '#64748b', fontSize: 10 }}>L{data.ltRange.min}</span>
            <span style={{ color: '#64748b', fontSize: 10 }}>Düzey içi ilerleme: %{data.ltProgress}</span>
            <span style={{ color: '#64748b', fontSize: 10 }}>L{data.ltRange.max}</span>
          </div>
        </div>

        {/* Özet metrikler */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <ProgressRing value={data.accuracy * 100} color="#22d3ee" label="Doğruluk" />
          <ProgressRing value={Math.max(0, 100 - data.avgHint * 20)} color="#a78bfa" label="Bağımsızlık" sublabel={`İpucu: ${data.avgHint.toFixed(1)}`} />
          <ProgressRing value={Math.max(0, 100 - (data.avgRT / 100))} color="#34d399" label="Hız" sublabel={`${(data.avgRT / 1000).toFixed(1)} sn`} />
        </div>

        {/* Detay metrikleri */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Detaylı Metrikler</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <MetricRow label="Ortalama Yanıt Süresi" value={`${(data.avgRT / 1000).toFixed(1)} sn`} />
            <MetricRow label="Medyan Yanıt Süresi" value={`${(data.medianRT / 1000).toFixed(1)} sn`} />
            <MetricRow label="İpucu Bağımlılık Oranı" value={`%${Math.round(data.hintDep * 100)}`} />
            <MetricRow label="Yanıt Süresi Trendi" value={data.rtTrend.direction === 'improving' ? '📈 İyileşiyor' : data.rtTrend.direction === 'declining' ? '📉 Kötüleşiyor' : '➡️ Stabil'} />
          </div>
        </div>

        {/* Hata analizi */}
        {errorData.length > 0 && (
          <div style={cardStyle}>
            <BarChartComponent data={errorData} title="En Sık Hata Türleri" horizontal height={180} />
            {data.errors.slice(0, 2).map((err, i) => (
              <div key={i} style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(248,113,113,0.08)', borderRadius: 6 }}>
                <div style={{ color: '#f87171', fontSize: 11, fontWeight: 600 }}>{err.errorType.replace(/_/g, ' ')}</div>
                {err.examples.slice(0, 1).map((ex, j) => (
                  <div key={j} style={{ color: '#94a3b8', fontSize: 10 }}>
                    Soru: {JSON.stringify(ex.question)} → Verilen: {ex.given}, Doğru: {ex.correct}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* İpucu kullanım analizi */}
        <div style={cardStyle}>
          <BarChartComponent data={hintDistData} title="İpucu Sonrası Başarı Oranı (Kademe Bazlı)" height={200} colorByValue />
        </div>

        {/* Temsil dağılımı */}
        <div style={cardStyle}>
          <BarChartComponent data={repData} title="Temsil Katmanı Kullanım Dağılımı" height={180} />
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value }) {
  return (
    <div style={{ padding: '6px 0' }}>
      <div style={{ color: '#64748b', fontSize: 10 }}>{label}</div>
      <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

const pageStyle = {
  display: 'flex', flexDirection: 'column', height: '100%', background: '#0f172a', color: '#e2e8f0',
};
const cardStyle = {
  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  border: '1px solid #334155', borderRadius: 12, padding: 16, marginBottom: 12,
};
const sectionTitle = { color: '#e2e8f0', fontSize: 14, fontWeight: 600, margin: '0 0 10px' };
const btnStyle = {
  background: 'rgba(30,41,59,0.8)', border: '1px solid #334155', borderRadius: 8,
  color: '#e2e8f0', padding: '6px 12px', cursor: 'pointer', fontSize: 13,
};
