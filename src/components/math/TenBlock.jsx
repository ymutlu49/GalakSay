import React from 'react';

export const TenBlock = ({ size = "md", anim = null }) => {
  const s = size === "sm" ? 7 : size === "lg" ? 12 : 9;
  const gap = size === "sm" ? 1 : 2;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: gap, padding: `${gap}px ${gap + 2}px`,
      borderRadius: 6, background: "linear-gradient(135deg,#fef3c7,#fde68a)", border: "1.5px solid #d97706",
      boxShadow: "0 1px 4px rgba(217,119,6,.2)", animation: anim || "none" }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} style={{ width: s, height: s, borderRadius: "50%",
          background: "linear-gradient(135deg,#f59e0b,#d97706)", border: `1px solid #b45309` }} />
      ))}
      <span style={{ fontSize: Math.max(s * 0.85, 7), fontWeight: 900, color: "#92400e", marginLeft: 1 }}>10</span>
    </div>
  );
};
