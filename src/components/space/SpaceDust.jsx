import React, { useMemo } from 'react';

// Ambient space dust particles — floating cosmic debris for immersion
// Uses CSS animations only for performance
export const SpaceDust = ({ count = 12, speed = "normal" }) => {
  const particles = useMemo(() => {
    const speedMultiplier = speed === "slow" ? 1.5 : speed === "fast" ? 0.6 : 1;
    return Array(count).fill(0).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 2.5,
      duration: (15 + Math.random() * 25) * speedMultiplier,
      delay: Math.random() * 20,
      opacity: 0.15 + Math.random() * 0.35,
      drift: -10 + Math.random() * 20,
      color: i % 5 === 0
        ? "rgba(167,139,250,.6)"    // purple
        : i % 7 === 0
        ? "rgba(251,191,36,.4)"      // gold
        : i % 3 === 0
        ? "rgba(56,189,248,.4)"      // cyan
        : "rgba(255,255,255,.5)",    // white
    }));
  }, [count, speed]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          left: p.left,
          bottom: "-5%",
          width: p.size,
          height: p.size,
          borderRadius: "50%",
          background: p.color,
          boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          animation: `spaceDust ${p.duration}s linear ${p.delay}s infinite`,
          opacity: 0,
          "--dx": `${p.drift}px`,
        }} />
      ))}
    </div>
  );
};
