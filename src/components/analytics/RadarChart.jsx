// GalakSay Analytics — 2026-03-18 — 8 eksenli radar grafik bileşeni
import React from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CATEGORY_LABELS = {
  sayma: 'Sayma',
  subitizing: 'Subitizing',
  karsilastirma: 'Karşılaştırma',
  sayi_bilesimi: 'Sayı Bileşimi',
  basamak_degeri: 'Basamak Değeri',
  toplama_cikarma: 'Toplama/Çıkarma',
  carpma_bolme: 'Çarpma/Bölme',
  oruntu: 'Örüntü',
};

export default function RadarChartComponent({ data, comparisonData, title, height = 350 }) {
  // data: { sayma: 85, subitizing: 72, ... } (0-100 arası)
  // comparisonData: (opsiyonel) NuMap başlangıç verisi

  const chartData = Object.keys(CATEGORY_LABELS).map(key => ({
    category: CATEGORY_LABELS[key],
    current: data?.[key] ?? 0,
    ...(comparisonData ? { baseline: comparisonData[key] ?? 0 } : {}),
  }));

  return (
    <div style={{ width: '100%' }}>
      {title && <h3 style={{ textAlign: 'center', margin: '0 0 8px', fontSize: 14, color: '#e2e8f0' }}>{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsRadar data={chartData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
          <Radar name="Güncel" dataKey="current" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.25} strokeWidth={2} />
          {comparisonData && (
            <Radar name="NuMap Başlangıç" dataKey="baseline" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.15} strokeWidth={2} strokeDasharray="5 5" />
          )}
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }}
            formatter={(value) => `%${Math.round(value)}`}
          />
          {comparisonData && <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />}
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}
