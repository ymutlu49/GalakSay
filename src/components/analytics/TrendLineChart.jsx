// GalakSay Analytics — 2026-03-18 — Zaman serisi çizgi grafik bileşeni
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#22d3ee', '#a78bfa', '#34d399', '#f472b6', '#fb923c', '#60a5fa', '#facc15', '#f87171'];

export default function TrendLineChart({ data, lines, title, xKey = 'date', yDomain, yFormatter, height = 300 }) {
  // data: [{ date: '2026-03-01', sayma: 85, subitizing: 72, ... }, ...]
  // lines: [{ key: 'sayma', label: 'Sayma' }, { key: 'overall', label: 'Genel' }]

  return (
    <div style={{ width: '100%' }}>
      {title && <h3 style={{ textAlign: 'center', margin: '0 0 8px', fontSize: 14, color: '#e2e8f0' }}>{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
          <XAxis dataKey={xKey} tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis domain={yDomain || [0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={yFormatter || ((v) => `%${v}`)} />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }}
            formatter={(value, name) => [yFormatter ? yFormatter(value) : `%${Math.round(value)}`, name]}
          />
          {lines.map((line, i) => (
            <Line key={line.key} type="monotone" dataKey={line.key} name={line.label} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          ))}
          {lines.length > 1 && <Legend wrapperStyle={{ color: '#a8b2d1', fontSize: 12 }} />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
