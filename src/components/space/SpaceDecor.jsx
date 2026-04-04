// GalakSay Pro — 2026-03-20 — Uzay dekorasyonları (büyük gezegenler + Dünya)
import React from 'react';
import { CrescentMoon } from './CrescentMoon.jsx';
import { MiniPlanet } from './MiniPlanet.jsx';
import { Earth } from './Earth.jsx';

// Reusable space decoration overlays — variant-based
export const SpaceDecor = ({ variant = "default" }) => {
  const configs = {
    // Menu/Dashboard — constellation-like connected geometry
    dashboard: [
      { type: "nebula", color: "#f59e0b", size: 280, top: "-10%", right: "-5%", opacity: .2 },
      { type: "nebula", color: "#6366f1", size: 220, bottom: "-6%", left: "-8%", opacity: .18 },
      { type: "nebula", color: "#059669", size: 160, top: "50%", left: "60%", opacity: .1 },
      { type: "moon", size: 52, top: "4%", right: "8%" },
      { type: "planet", color: "#f59e0b", size: 58, top: "6%", left: "3%", ring: true },
      { type: "planet", color: "#34d399", size: 42, bottom: "12%", right: "6%" },
      { type: "planet", color: "#f472b6", size: 32, top: "58%", left: "4%" },
      { type: "planet", color: "#6366f1", size: 24, top: "38%", right: "14%" },
      { type: "planet", color: "#a855f7", size: 18, bottom: "38%", left: "18%" },
      { type: "earth", size: 140, bottom: "-12%", right: "-8%", opacity: .3 },
    ],
    // Settings — subtle purple glow
    settings: [
      { type: "nebula", color: "#64748b", size: 250, top: "-8%", right: "-10%", opacity: .15 },
      { type: "nebula", color: "#475569", size: 200, bottom: "-5%", left: "-5%", opacity: .12 },
      { type: "planet", color: "#94a3b8", size: 48, top: "4%", left: "2%", ring: true },
      { type: "planet", color: "#64748b", size: 34, bottom: "10%", right: "4%" },
      { type: "planet", color: "#7c3aed", size: 22, top: "42%", right: "12%" },
      { type: "earth", size: 110, bottom: "-8%", left: "-6%", opacity: .2 },
    ],
    // Mode selection — colorful scattered
    modes: [
      { type: "nebula", color: "#7c3aed", size: 300, top: "-12%", left: "-8%", opacity: .22 },
      { type: "nebula", color: "#60a5fa", size: 200, bottom: "-6%", right: "-5%", opacity: .18 },
      { type: "nebula", color: "#f59e0b", size: 150, top: "40%", right: "20%", opacity: .1 },
      { type: "nebula", color: "#ec4899", size: 120, top: "60%", left: "10%", opacity: .08 },
      { type: "moon", size: 48, top: "3%", right: "5%" },
      { type: "planet", color: "#7c3aed", size: 62, top: "8%", left: "1%", ring: true },
      { type: "planet", color: "#f97316", size: 44, top: "62%", right: "3%", ring: true },
      { type: "planet", color: "#60a5fa", size: 32, bottom: "18%", left: "4%" },
      { type: "planet", color: "#34d399", size: 24, top: "36%", right: "10%" },
      { type: "planet", color: "#ec4899", size: 18, bottom: "42%", right: "20%" },
      { type: "earth", size: 160, bottom: "-15%", right: "-10%", opacity: .28 },
    ],
    // Progress / Reports — data-themed minimal
    progress: [
      { type: "nebula", color: "#059669", size: 250, top: "-10%", right: "-8%", opacity: .15 },
      { type: "nebula", color: "#6366f1", size: 180, bottom: "-5%", left: "-6%", opacity: .12 },
      { type: "planet", color: "#059669", size: 50, top: "3%", left: "1%", ring: true },
      { type: "planet", color: "#6366f1", size: 36, bottom: "12%", right: "5%" },
      { type: "planet", color: "#f59e0b", size: 24, top: "48%", right: "12%" },
      { type: "earth", size: 120, bottom: "-10%", left: "-5%", opacity: .25 },
    ],
    // Age select — big planet vibes
    ageSelect: [
      { type: "nebula", color: "#8b5cf6", size: 320, top: "-15%", right: "-10%", opacity: .25 },
      { type: "nebula", color: "#6366f1", size: 250, bottom: "-8%", left: "-8%", opacity: .2 },
      { type: "nebula", color: "#f472b6", size: 180, top: "45%", left: "55%", opacity: .12 },
      { type: "moon", size: 56, top: "3%", right: "5%" },
      { type: "planet", color: "#6366f1", size: 72, top: "10%", left: "1%", ring: true },
      { type: "planet", color: "#a855f7", size: 52, top: "68%", right: "2%", ring: true },
      { type: "planet", color: "#f472b6", size: 36, bottom: "28%", left: "5%" },
      { type: "planet", color: "#34d399", size: 28, top: "48%", right: "12%" },
      { type: "planet", color: "#f59e0b", size: 20, top: "28%", left: "16%" },
      { type: "earth", size: 180, bottom: "-18%", right: "-12%", opacity: .32 },
    ],
    // AR / QR — futuristic cyan accent
    ar: [
      { type: "nebula", color: "#06b6d4", size: 280, top: "-10%", right: "-6%", opacity: .2 },
      { type: "nebula", color: "#8b5cf6", size: 200, bottom: "-5%", left: "-5%", opacity: .15 },
      { type: "nebula", color: "#06b6d4", size: 130, top: "50%", left: "40%", opacity: .08 },
      { type: "planet", color: "#06b6d4", size: 52, top: "4%", left: "2%", ring: true },
      { type: "planet", color: "#8b5cf6", size: 38, bottom: "14%", right: "5%" },
      { type: "planet", color: "#38bdf8", size: 24, top: "42%", right: "14%" },
      { type: "earth", size: 130, bottom: "-10%", right: "-6%", opacity: .25 },
    ],
    // Material guide — warm education
    guide: [
      { type: "nebula", color: "#60a5fa", size: 260, top: "-10%", right: "-8%", opacity: .18 },
      { type: "nebula", color: "#7c3aed", size: 200, bottom: "-5%", left: "-6%", opacity: .14 },
      { type: "planet", color: "#60a5fa", size: 52, top: "3%", left: "1%", ring: true },
      { type: "planet", color: "#f59e0b", size: 38, bottom: "10%", right: "4%" },
      { type: "planet", color: "#7c3aed", size: 24, top: "48%", right: "15%" },
      { type: "earth", size: 120, bottom: "-10%", right: "-7%", opacity: .22 },
    ],
  };
  const items = configs[variant] || configs.dashboard;
  return (<>
    {items.map((it, i) => {
      if (it.type === "nebula") return <div key={i} className="nebula-glow" style={{ width: it.size, height: it.size, background: it.color, top: it.top, left: it.left, right: it.right, bottom: it.bottom, opacity: it.opacity, animation: `nebulaFloat ${10 + i * 2}s ease-in-out infinite${i % 2 ? " reverse" : ""}` }} />;
      if (it.type === "moon") return <CrescentMoon key={i} size={it.size} top={it.top} right={it.right} />;
      if (it.type === "planet") return <MiniPlanet key={i} color={it.color} size={it.size} top={it.top} left={it.left} right={it.right} bottom={it.bottom} ring={it.ring} />;
      if (it.type === "earth") return <Earth key={i} size={it.size} top={it.top} left={it.left} right={it.right} bottom={it.bottom} opacity={it.opacity} />;
      return null;
    })}
  </>);
};
