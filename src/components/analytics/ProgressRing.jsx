// GalakSay Analytics — 2026-03-18 — Dairesel ilerleme göstergesi
import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressRing({ value = 0, size = 80, strokeWidth = 8, color = '#22d3ee', label, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Arka plan halkası */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
        {/* İlerleme halkası */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Yüzde metni */}
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fill="#e2e8f0" fontSize={size * 0.22} fontWeight="bold">
          %{Math.round(value)}
        </text>
      </svg>
      {label && <span style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600 }}>{label}</span>}
      {sublabel && <span style={{ color: '#94a3b8', fontSize: 10 }}>{sublabel}</span>}
    </div>
  );
}
