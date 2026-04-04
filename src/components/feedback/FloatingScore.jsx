import React from 'react';

// Enhanced floating score indicator — with combo multiplier and star trail
export const FloatingScore = ({ show, pts }) => {
  if (!show || !pts) return null;
  const isBonus = pts >= 15;
  const isMega = pts >= 25;
  return (
    <div style={{
      position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
      pointerEvents: "none", zIndex: 101,
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <div style={{
        fontSize: isMega ? 40 : 32, fontWeight: 900,
        color: isMega ? "#fbbf24" : "#059669",
        textShadow: isMega
          ? "0 2px 16px rgba(251,191,36,.6), 0 0 40px rgba(251,191,36,.3)"
          : "0 2px 12px rgba(22,163,74,.5), 0 0 30px rgba(22,163,74,.2)",
        animation: "scoreFloat 1.5s ease-out forwards",
        display: "flex", alignItems: "center", gap: 4,
      }}>
        <span style={{
          fontSize: isMega ? 24 : 20,
          animation: "starCollect .6s ease forwards",
          filter: isMega ? "drop-shadow(0 0 6px rgba(251,191,36,.5))" : "none",
        }}>{isMega ? "\uD83C\uDF1F" : "\u2B50"}</span>
        +{pts}
      </div>
      {isBonus && (
        <div style={{
          fontSize: 11, fontWeight: 800,
          color: isMega ? "#f472b6" : "#fbbf24",
          textShadow: `0 1px 6px ${isMega ? "rgba(244,114,182,.4)" : "rgba(251,191,36,.4)"}`,
          animation: "scoreFloat 1.8s ease-out .2s forwards", opacity: 0,
          marginTop: -4,
          letterSpacing: isMega ? "2px" : "1px",
        }}>{isMega ? "MEGA BONUS!" : "Bonus!"}</div>
      )}
      {/* Trailing star particles for high scores */}
      {isBonus && Array(3).fill(0).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          top: 8 + i * 6,
          left: `${40 + i * 12}%`,
          fontSize: 8 + i * 2,
          opacity: 0,
          animation: `particleDrift ${0.8 + i * 0.2}s ease-out ${0.1 + i * 0.1}s forwards`,
          "--dx": `${-15 + i * 15}px`,
          "--dy": `${-30 - i * 10}px`,
          color: "#fbbf24",
          filter: "drop-shadow(0 0 3px rgba(251,191,36,.4))",
        }}>{"\u2728"}</div>
      ))}
    </div>
  );
};
