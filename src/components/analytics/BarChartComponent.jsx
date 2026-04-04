// GalakSay Analytics — 2026-03-18 — Çubuk grafik bileşeni
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#22d3ee', '#a78bfa', '#34d399', '#f472b6', '#fb923c', '#60a5fa', '#facc15', '#f87171'];

export default function BarChartComponent({ data, dataKey = 'value', nameKey = 'name', title, height = 250, horizontal = false, colorByValue = false }) {
  // data: [{ name: 'Sayma', value: 85 }, ...]

  const getColor = (entry, i) => {
    if (colorByValue) {
      const v = entry[dataKey];
      if (v >= 80) return '#34d399';
      if (v >= 60) return '#facc15';
      return '#f87171';
    }
    return COLORS[i % COLORS.length];
  };

  if (horizontal) {
    return (
      <div style={{ width: '100%' }}>
        {title && <h3 style={{ textAlign: 'center', margin: '0 0 8px', fontSize: 14, color: '#e2e8f0' }}>{title}</h3>}
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis type="category" dataKey={nameKey} tick={{ fill: '#94a3b8', fontSize: 11 }} width={75} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
            <Bar dataKey={dataKey} radius={[0, 4, 4, 0]}>
              {data.map((entry, i) => <Cell key={i} fill={getColor(entry, i)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {title && <h3 style={{ textAlign: 'center', margin: '0 0 8px', fontSize: 14, color: '#e2e8f0' }}>{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={nameKey} tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
          <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => <Cell key={i} fill={getColor(entry, i)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
