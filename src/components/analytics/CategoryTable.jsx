// GalakSay Analytics — 2026-03-18 — Kategori performans tablosu bileşeni
import React from 'react';

const TREND_ICONS = { improving: '📈', stable: '➡️', declining: '📉' };

export default function CategoryTable({ categories, onCategoryClick }) {
  // categories: [{ name, label, accuracy, avgRT, avgHint, ltLevel, trend }]

  if (!categories || categories.length === 0) {
    return <div style={{ color: '#cbd5e1', textAlign: 'center', padding: 20 }}>Henüz yeterli veri yok</div>;
  }

  const getAccuracyColor = (acc) => {
    if (acc >= 0.80) return '#34d399';
    if (acc >= 0.60) return '#facc15';
    return '#f87171';
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #334155' }}>
            <th style={thStyle}>Kategori</th>
            <th style={thStyle}>Doğruluk</th>
            <th style={thStyle}>Yanıt Sür.</th>
            <th style={thStyle}>İpucu Ort.</th>
            <th style={thStyle}>LT Düz.</th>
            <th style={thStyle}>Trend</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, i) => (
            <tr
              key={cat.name}
              onClick={() => onCategoryClick?.(cat.name)}
              style={{
                borderBottom: '1px solid #1e293b',
                cursor: onCategoryClick ? 'pointer' : 'default',
                background: i % 2 === 0 ? 'transparent' : 'rgba(30,41,59,0.3)',
              }}
            >
              <td style={tdStyle}>{cat.label}</td>
              <td style={{ ...tdStyle, color: getAccuracyColor(cat.accuracy), fontWeight: 600 }}>
                %{Math.round(cat.accuracy * 100)}
              </td>
              <td style={tdStyle}>{cat.avgRT > 0 ? `${(cat.avgRT / 1000).toFixed(1)} sn` : '—'}</td>
              <td style={tdStyle}>{cat.avgHint > 0 ? cat.avgHint.toFixed(1) : '—'}</td>
              <td style={tdStyle}>L{cat.ltLevel}</td>
              <td style={tdStyle}>{TREND_ICONS[cat.trend] || '➡️'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { textAlign: 'left', padding: '8px 12px', color: '#94a3b8', fontWeight: 500, fontSize: 12 };
const tdStyle = { padding: '10px 12px', color: '#e2e8f0' };
