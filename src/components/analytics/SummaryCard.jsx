// GalakSay Analytics — 2026-03-18 — Özet kart bileşeni
import React from 'react';
import { motion } from 'framer-motion';

export default function SummaryCard({ title, value, subtitle, trend, icon, color = '#22d3ee' }) {
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  const trendColor = trend === 'up' ? '#34d399' : trend === 'down' ? '#f87171' : '#94a3b8';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155',
        borderRadius: 12,
        padding: '16px 20px',
        minWidth: 140,
        flex: 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ color: '#cbd5e1', fontSize: 12, fontWeight: 500 }}>{title}</span>
        {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ color, fontSize: 24, fontWeight: 700 }}>{value}</span>
        {trend && (
          <span style={{ color: trendColor, fontSize: 13, fontWeight: 600 }}>
            {trendIcon} {subtitle}
          </span>
        )}
      </div>
      {!trend && subtitle && (
        <span style={{ color: '#cbd5e1', fontSize: 11, marginTop: 4, display: 'block' }}>{subtitle}</span>
      )}
    </motion.div>
  );
}
