import React from 'react';
import { typography } from '../../design-system/typography.js';

export const BrandMini = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(124,58,237,.2)", borderRadius: 8, padding: "3px 7px 3px 4px", backdropFilter: "blur(4px)" }}>
    <svg viewBox="0 0 80 90" width={16} height={18} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bmDot" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#4f46e5"/></linearGradient>
        <linearGradient id="bmWord" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#5b21b6"/></linearGradient>
        <linearGradient id="bmNum" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#059669"/></linearGradient>
      </defs>
      <line x1="25" y1="28" x2="55" y2="28" stroke="#94a3b8" strokeWidth="1.5" opacity="0.4"/>
      <line x1="25" y1="28" x2="40" y2="62" stroke="#94a3b8" strokeWidth="1.5" opacity="0.4"/>
      <line x1="55" y1="28" x2="40" y2="62" stroke="#94a3b8" strokeWidth="1.5" opacity="0.4"/>
      <circle cx="25" cy="28" r="14" fill="url(#bmDot)"/>
      <circle cx="20" cy="27" r="2.5" fill="white" opacity="0.9"/>
      <circle cx="25" cy="27" r="2.5" fill="white" opacity="0.9"/>
      <circle cx="30" cy="27" r="2.5" fill="white" opacity="0.9"/>
      <circle cx="55" cy="28" r="14" fill="url(#bmWord)"/>
      <text x="55" y="32" textAnchor="middle" fontFamily={typography.fontFamily.display} fontWeight="800" fontSize="8" fill="white">{"\u00FC\u00E7"}</text>
      <circle cx="40" cy="62" r="14" fill="url(#bmNum)"/>
      <text x="40" y="68" textAnchor="middle" fontFamily={typography.fontFamily.display} fontWeight="900" fontSize="17" fill="white">3</text>
    </svg>
    <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: -.3, lineHeight: 1, color: "#fff" }}>Galak<span style={{ color: "#6ee7b7" }}>say</span></span>
  </div>
);
