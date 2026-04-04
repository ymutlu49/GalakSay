import React from 'react';

// Enhanced confetti — space-themed with stars, planets, and cosmic particles
export const Confetti = ({ show, intense }) => {
  if (!show) return null;
  const cs = ["#dc2626", "#eab308", "#059669", "#60a5fa", "#db2777", "#9333ea", "#f59e0b", "#8b5cf6", "#38bdf8", "#34d399"];
  const count = intense ? 40 : 22;
  const shapes = ["\u25CF", "\u2605", "\u25A0", "\u25B2", "\u2666", "\u2726", "\u2728", "\u2B50"];
  const spaceShapes = ["\u2B50", "\u2728", "\uD83C\uDF1F", "\u2604\uFE0F", "\uD83D\uDCAB", "\u2747\uFE0F"];
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 100 }}>
      {Array(count).fill(0).map((_, i) => {
        const isShape = i % 3 === 0;
        const isStar = i % 7 === 0;
        const isSpace = i % 5 === 0 && intense;
        const baseDelay = Math.random() * .8;
        const duration = .8 + Math.random() * 2;
        return (
          <div key={i} style={{
            position: "absolute", left: `${2 + Math.random() * 96}%`, top: -16,
            width: isShape || isSpace ? "auto" : 6 + Math.random() * 12,
            height: isShape || isSpace ? "auto" : 6 + Math.random() * 12,
            borderRadius: isShape ? 0 : Math.random() > .5 ? "50%" : "2px",
            background: (isShape || isSpace) ? "none" : cs[i % cs.length],
            color: cs[i % cs.length],
            fontSize: isSpace ? 14 + Math.random() * 12 : isShape ? (isStar ? 16 + Math.random() * 10 : 10 + Math.random() * 8) : 0,
            animation: `${intense ? "confettiBig" : "confetti"} ${duration}s ease-out ${baseDelay}s forwards`,
            filter: isStar ? `drop-shadow(0 0 4px ${cs[i % cs.length]})` : "none",
          }}>
            {isSpace ? spaceShapes[i % spaceShapes.length] : isShape ? shapes[i % shapes.length] : null}
          </div>
        );
      })}
      {/* Victory flash overlay for intense mode */}
      {intense && (
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 50% 40%, rgba(251,191,36,.15), transparent 70%)",
          animation: "missionFlash 1s ease forwards",
          pointerEvents: "none",
        }} />
      )}
    </div>
  );
};
