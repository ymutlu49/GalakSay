// GalakSay Pro — 2026-03-19 — Tam ekran uzay arka planı (büyük gezegenler, daha fazla detay)
import React from 'react';
import { CrescentMoon } from './CrescentMoon.jsx';
import { MiniPlanet } from './MiniPlanet.jsx';
import { Nebula } from './Nebula.jsx';
import { ShootingStar } from './ShootingStar.jsx';
import { SpaceDust } from './SpaceDust.jsx';
import { Earth } from './Earth.jsx';

export const SpaceBg = ({ children, className = "", style = {} }) => (
  <div className={`space-bg ${className}`} style={{ position: "relative", ...style }}>
    {/* Ay */}
    <CrescentMoon size={56} top="3%" right="7%" />

    {/* Büyük gezegenler — dikkat çekici, dekoratif */}
    <MiniPlanet color="#6366f1" size={62} top="8%" left="2%" ring />
    <MiniPlanet color="#f59e0b" size={50} top="52%" right="3%" ring />
    <MiniPlanet color="#7c3aed" size={42} top="74%" left="5%" />

    {/* Orta gezegenler */}
    <MiniPlanet color="#ec4899" size={32} bottom="10%" right="12%" ring />
    <MiniPlanet color="#a855f7" size={28} top="33%" right="10%" />
    <MiniPlanet color="#34d399" size={26} bottom="33%" left="3%" />

    {/* Küçük gezegenler — derinlik hissi */}
    <MiniPlanet color="#38bdf8" size={18} top="20%" left="16%" />
    <MiniPlanet color="#f472b6" size={16} top="88%" right="20%" />
    <MiniPlanet color="#6ee7b7" size={14} top="43%" left="23%" />

    {/* Nebula katmanları */}
    <Nebula color="#6366f1" size={300} top="-10%" right="-8%" opacity={.28} />
    <Nebula color="#7c3aed" size={240} bottom="-5%" left="-10%" opacity={.22} />
    <Nebula color="#8b5cf6" size={200} top="42%" left="52%" opacity={.16} />
    <Nebula color="#ec4899" size={160} top="18%" left="-6%" opacity={.1} />
    <Nebula color="#38bdf8" size={120} bottom="30%" right="15%" opacity={.08} />

    {/* Kayan yıldızlar */}
    <ShootingStar delay={0} top="10%" left="6%" />
    <ShootingStar delay={4} top="50%" left="65%" />
    <ShootingStar delay={9} top="28%" left="35%" />
    <ShootingStar delay={14} top="70%" left="15%" />

    {/* Dünya */}
    <Earth size={150} bottom="-12%" right="-8%" opacity={0.3} />

    {/* Uzay tozu */}
    <SpaceDust count={10} speed="slow" />

    {/* İçerik */}
    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>{children}</div>
  </div>
);
