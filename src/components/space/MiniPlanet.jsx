// GalakSay Pro — 2026-03-20 — Dekoratif mini gezegen bileşeni (3D halka — overflow clip)
import React from 'react';

export const MiniPlanet = ({ color = "#6366f1", size = 40, top, left, right, bottom, ring = true, glow = true }) => {
  const ringW = Math.max(2, size * 0.08);
  const rW = size * 1.6;
  const rH = size * 0.55;
  const containerW = size * 1.8;
  const containerH = size * 1.4;

  // Ortak halka stilleri
  const ringBase = {
    position: "absolute",
    left: "50%",
    width: rW,
    height: rH,
    borderRadius: "50%",
  };

  return (
    <div style={{
      position: "absolute",
      top,
      left,
      right,
      bottom,
      width: containerW,
      height: containerH,
      pointerEvents: "none",
      zIndex: 0,
      animation: `nebulaFloat ${12 + size * 0.3}s ease-in-out infinite`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {/* Halka — tam halka, gezegenin arkasında (z-index 0) */}
      {ring && (
        <div style={{
          ...ringBase,
          top: "50%",
          transform: "translate(-50%, -50%) rotateX(72deg)",
          border: `${ringW}px solid ${color}60`,
          boxShadow: `0 0 ${size * 0.2}px ${color}25, inset 0 0 ${size * 0.12}px ${color}15`,
          zIndex: 0,
        }} />
      )}

      {/* Gezegen gövdesi — halkanın ortasında (z-index 1) */}
      <div style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 32% 28%, ${color}ee, ${color}aa 45%, ${color}66 75%, ${color}33)`,
        boxShadow: glow
          ? `0 0 ${size * 0.6}px ${color}40, inset -${size * 0.12}px -${size * 0.08}px ${size * 0.2}px rgba(0,0,0,.35)`
          : `inset -${size * 0.12}px -${size * 0.08}px ${size * 0.2}px rgba(0,0,0,.35)`,
        position: "relative",
        zIndex: 1,
      }}>
        {size >= 20 && (
          <div style={{
            position: "absolute",
            top: "12%",
            left: "18%",
            width: "28%",
            height: "22%",
            borderRadius: "50%",
            background: "rgba(255,255,255,.35)",
            filter: `blur(${size * 0.06}px)`,
          }} />
        )}
      </div>

      {/* Halka — ön katman: overflow:hidden ile ekran koordinatlarında kırpılır (z-index 2) */}
      {/* Wrapper sadece gezegenin merkezinden aşağısını gösterir — bu, halkanın ön yayıdır */}
      {ring && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          zIndex: 2,
          pointerEvents: "none",
        }}>
          <div style={{
            ...ringBase,
            top: 0,
            transform: "translate(-50%, -50%) rotateX(72deg)",
            border: `${ringW}px solid ${color}bb`,
            filter: `drop-shadow(0 0 ${size * 0.1}px ${color}60)`,
          }} />
        </div>
      )}
    </div>
  );
};
