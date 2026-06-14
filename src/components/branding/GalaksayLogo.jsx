import React from 'react';
import { typography } from '../../design-system/typography.js';

export const GalaksayLogo = ({ height = 70, dark, width, tight }) => {
  // width verilirse responsive ölçek (CSS width + height:auto, viewBox oranını korur → mobilde taşmaz, geniş ekranda büyür)
  // tight: sağdaki boş alanı kırpılmış viewBox (içerik x=8..313) → içerik tam ortalanır + aynı genişlikte daha büyük görünür
  const svg = (
  <svg viewBox={tight ? "0 0 321 100" : "0 0 420 100"} {...(width ? {} : { height })} xmlns="http://www.w3.org/2000/svg" style={width ? { display: "block", margin: "0 auto", width, height: "auto" } : { display: "block", margin: "0 auto" }}>
    <defs>
      <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2e1065" floodOpacity="0.2"/>
      </filter>
    </defs>
    {/* Ortak Üçlü Kod sembolü (Yörünge marka kılavuzu): DÜZ dolgu, gradyan/gölge yok.
        somut #4f46e5 · sözel #7c3aed · sembolik #0d9488 — tüm uygulamalarda aynı. */}
    <g>
      {/* Connecting lines (triangle) */}
      <line x1="28" y1="26" x2="72" y2="26" stroke={dark ? "#a5b4c8" : "#94a3b8"} strokeWidth="2" opacity="0.45"/>
      <line x1="28" y1="26" x2="50" y2="74" stroke={dark ? "#a5b4c8" : "#94a3b8"} strokeWidth="2" opacity="0.45"/>
      <line x1="72" y1="26" x2="50" y2="74" stroke={dark ? "#a5b4c8" : "#94a3b8"} strokeWidth="2" opacity="0.45"/>
      {/* Circle 1 — indigo (top-left): noktalar/somut */}
      <circle cx="28" cy="26" r="20" fill="#6366f1"/>
      <circle cx="21" cy="25" r="3" fill="white" opacity="0.9"/>
      <circle cx="28" cy="25" r="3" fill="white" opacity="0.9"/>
      <circle cx="35" cy="25" r="3" fill="white" opacity="0.9"/>
      {/* Circle 2 — mor (top-right): sayı adı/sözel */}
      <circle cx="72" cy="26" r="20" fill="#7c3aed"/>
      <text x="72" y="31" textAnchor="middle" fontFamily={typography.fontFamily.display} fontWeight="800" fontSize="12" fill="white">üç</text>
      {/* Circle 3 — teal (bottom-center): rakam/sembolik — dolu daire */}
      <circle cx="50" cy="74" r="20" fill="#10b981"/>
      <text x="50" y="82" textAnchor="middle" fontFamily={typography.fontFamily.display} fontWeight="900" fontSize="24" fill="white">3</text>
    </g>
    {/* Brand text */}
    <text x="108" y="56" fontFamily={typography.fontFamily.display} fontWeight="900" fontSize="48" letterSpacing="-1" filter="url(#logoShadow)">
      <tspan fill={dark ? "#ffffff" : "#4f46e5"}>Galak</tspan><tspan fill="#7c3aed">say</tspan>
    </text>
    <defs><linearGradient id="underlineGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#6366f1"/><stop offset="50%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#10b981"/>
    </linearGradient></defs>
    <line x1="110" y1="65" x2="265" y2="65" stroke="url(#underlineGrad)" strokeWidth="2.5" strokeLinecap="round" opacity=".4"/>
    {/* Slogan */}
    <text x="230" y="82" textAnchor="middle" fontFamily={typography.fontFamily.display} fontWeight="700" fontSize="11" letterSpacing="2" fill={dark ? "#c4b5fd" : "#6d28d9"} opacity="0.8">
      Sayılar evrenin dilidir
    </text>
  </svg>
  );
  if (dark) return svg;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(245,243,255,.95)", borderRadius: 12, padding: "5px 10px", boxShadow: "0 2px 8px rgba(124,58,237,.08)" }}>
      {svg}
    </div>
  );
};
