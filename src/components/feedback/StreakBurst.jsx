import React from 'react';

// Enhanced streak burst — themed explosion with energy rings and cosmic particles
export const StreakBurst = ({ show, count = 10, streak = 0 }) => {
  if (!show) return null;
  const particles = ["\u2B50", "\u2728", "\uD83D\uDCAB", "\uD83C\uDF1F"];
  const fireParticles = ["\uD83D\uDD25", "\u2604\uFE0F", "\u26A1", "\u2728"];
  const isEpic = streak >= 7;
  const activeParticles = isEpic ? fireParticles : particles;
  const ringColor = isEpic ? "rgba(239,68,68,.5)" : "rgba(251,191,36,.5)";
  const particleCount = isEpic ? count + 6 : count;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99 }}>
      {/* Primary expanding ring */}
      <div style={{
        position: "absolute", width: 60, height: 60, borderRadius: "50%",
        border: `3px solid ${ringColor}`,
        animation: "correctPulseRing .8s ease-out forwards",
      }} />
      {/* Secondary ring for epic streaks */}
      {isEpic && (
        <div style={{
          position: "absolute", width: 40, height: 40, borderRadius: "50%",
          border: "2px solid rgba(251,191,36,.4)",
          animation: "correctPulseRing .6s ease-out .1s forwards",
        }} />
      )}
      {/* Energy flash for epic */}
      {isEpic && (
        <div style={{
          position: "absolute", width: 20, height: 20, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,191,36,.6), transparent)",
          animation: "supernovaExpand .8s ease-out forwards",
        }} />
      )}
      {/* Star particles */}
      {Array(particleCount).fill(0).map((_, i) => {
        const angle = (i / particleCount) * 360;
        const dist = 45 + Math.random() * 35;
        return (
          <div key={i} style={{
            position: "absolute",
            fontSize: 14 + Math.random() * 14,
            transform: `rotate(${angle}deg) translateY(-${dist}px)`,
            animation: `starBurst ${0.5 + Math.random() * 0.4}s ease-out ${i * 0.02}s forwards`,
            filter: `drop-shadow(0 0 3px ${isEpic ? "rgba(239,68,68,.6)" : "rgba(251,191,36,.6)"})`,
          }}>{activeParticles[i % activeParticles.length]}</div>
        );
      })}
      {/* Streak number flash */}
      {streak >= 5 && (
        <div style={{
          position: "absolute",
          fontSize: 28, fontWeight: 900,
          color: isEpic ? "#ef4444" : "#fbbf24",
          textShadow: isEpic
            ? "0 0 12px rgba(239,68,68,.6), 0 0 24px rgba(239,68,68,.3)"
            : "0 0 8px rgba(251,191,36,.5), 0 0 16px rgba(251,191,36,.2)",
          animation: "streakCounter .6s ease-out .15s both",
          opacity: 0,
          letterSpacing: "2px",
        }}>
          {streak}x
        </div>
      )}
    </div>
  );
};
