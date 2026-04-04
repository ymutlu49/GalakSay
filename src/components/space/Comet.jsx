import React from 'react';

// Animated comet that streaks across the screen — triggered on milestones
export const Comet = ({ show, delay = 0 }) => {
  if (!show) return null;
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 50,
    }}>
      <div style={{
        position: "absolute",
        top: "15%", left: "-10%",
        width: 6, height: 6,
        borderRadius: "50%",
        background: "radial-gradient(circle, #fff 0%, rgba(251,191,36,.8) 40%, transparent 70%)",
        boxShadow: "0 0 12px rgba(251,191,36,.6), 0 0 24px rgba(251,191,36,.3)",
        animation: `cometTrail 2.5s cubic-bezier(.2,.6,.4,1) ${delay}s forwards`,
      }}>
        {/* Comet tail */}
        <div style={{
          position: "absolute",
          top: "50%", right: "100%",
          width: 80, height: 2,
          background: "linear-gradient(90deg, transparent, rgba(251,191,36,.1), rgba(251,191,36,.4), rgba(255,255,255,.8))",
          borderRadius: "0 2px 2px 0",
          transform: "translateY(-50%)",
          filter: "blur(1px)",
        }} />
        {/* Secondary glow trail */}
        <div style={{
          position: "absolute",
          top: "50%", right: "100%",
          width: 50, height: 4,
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,.2), rgba(167,139,250,.3))",
          borderRadius: "2px",
          transform: "translateY(-50%) translateY(2px)",
          filter: "blur(2px)",
        }} />
      </div>
    </div>
  );
};
