// GalakSay Pro — 2026-03-20 — Dekoratif Dünya bileşeni (büyük, arka plan dekorasyon)
import React from 'react';

export const Earth = ({ size = 120, top, left, right, bottom, opacity = 0.35 }) => (
  <div style={{
    position: "absolute",
    top,
    left,
    right,
    bottom,
    width: size,
    height: size,
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 0,
    opacity,
    animation: `nebulaFloat ${25 + size * 0.1}s ease-in-out infinite`,
    background: `
      radial-gradient(circle at 35% 30%, rgba(255,255,255,.15) 0%, transparent 25%),
      radial-gradient(ellipse at 25% 60%, #2d8a4e 0%, transparent 30%),
      radial-gradient(ellipse at 55% 35%, #1a7a3a 0%, transparent 25%),
      radial-gradient(ellipse at 70% 65%, #2d8a4e 0%, transparent 20%),
      radial-gradient(ellipse at 40% 80%, #1e6b35 0%, transparent 22%),
      radial-gradient(ellipse at 80% 40%, #22703c 0%, transparent 18%),
      radial-gradient(circle at 50% 50%, #1e60a0 0%, #1a4e8a 40%, #153d6e 70%, #0f2d52 100%)
    `,
    boxShadow: `
      inset -${size * 0.15}px -${size * 0.08}px ${size * 0.25}px rgba(0,0,0,.4),
      0 0 ${size * 0.4}px rgba(30,96,160,.2),
      0 0 ${size * 0.8}px rgba(30,96,160,.08)
    `,
  }}>
    {/* Atmosfer glow */}
    <div style={{
      position: "absolute",
      inset: -size * 0.06,
      borderRadius: "50%",
      background: "radial-gradient(circle, transparent 45%, rgba(100,180,255,.08) 60%, rgba(60,140,220,.12) 75%, transparent 100%)",
      pointerEvents: "none",
    }} />
    {/* Parlak yansıma */}
    <div style={{
      position: "absolute",
      top: "10%",
      left: "15%",
      width: "30%",
      height: "25%",
      borderRadius: "50%",
      background: "rgba(255,255,255,.2)",
      filter: `blur(${size * 0.08}px)`,
    }} />
    {/* Bulut katmanı */}
    <div style={{
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: `
        radial-gradient(ellipse at 30% 25%, rgba(255,255,255,.12) 0%, transparent 35%),
        radial-gradient(ellipse at 65% 50%, rgba(255,255,255,.08) 0%, transparent 30%),
        radial-gradient(ellipse at 45% 75%, rgba(255,255,255,.06) 0%, transparent 25%)
      `,
    }} />
  </div>
);
