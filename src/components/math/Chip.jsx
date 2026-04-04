import React from 'react';
import { C } from '../../theme/colors.js';
import { CB_COLORS } from '../../systems/accessibility.js';

export const Chip = ({ color = "blue", size = 44, number = null, glow, countAnim, hidden, style: sx, cb: cbProp }) => {
  // Auto-detect color blind mode if not explicitly passed
  const cb = cbProp !== undefined ? cbProp : (() => { try { const a = JSON.parse(localStorage.getItem("ds_a11y_global") || "{}"); return a.colorBlind || false; } catch { return false; } })();
  const clr = cb && (color === "red") ? CB_COLORS.red : C[color] || color;
  const isDark = ["blue","red","purple","pink","teal","green","orange"].includes(color);
  const borderClr = color === "blue" ? "#1e40af" : color === "red" ? (cb ? "#7c2d12" : "#991b1b") : color === "green" ? "#14532d" : `${clr}99`;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: hidden ? "#444" : `radial-gradient(circle at 35% 30%, ${clr}dd 0%, ${clr} 50%, ${borderClr} 100%)`,
      border: hidden ? "2.5px solid #333" : `3px solid ${borderClr}`,
      boxShadow: glow ? `0 0 18px 6px ${clr}90, inset 0 -3px 6px rgba(0,0,0,.25)` : `0 3px 10px ${clr}50, 0 0 16px ${clr}25, inset 0 -3px 6px rgba(0,0,0,.25), inset 0 2px 4px rgba(255,255,255,.3)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all .25s ease",
      animation: countAnim ? "chipPop .55s ease" : "none",
      position: "relative", overflow: "hidden",
      ...sx,
    }}>
      {/* Color blind pattern overlay */}
      {cb && !hidden && color === "blue" && (
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", opacity: .25,
          background: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,.8) 2px, rgba(255,255,255,.8) 4px)",
          pointerEvents: "none" }} />
      )}
      {cb && !hidden && color === "red" && (
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", opacity: .3,
          background: "radial-gradient(circle, rgba(255,255,255,.9) 1px, transparent 1px)",
          backgroundSize: `${Math.max(4, size/6)}px ${Math.max(4, size/6)}px`,
          pointerEvents: "none" }} />
      )}
      {number !== null && !hidden && (
        <span style={{ fontSize: Math.round(size * .44), fontWeight: 900,
          color: isDark || color === "green" ? "#fff" : "#451a03",
          textShadow: "none", position: "relative", zIndex: 1 }}>{number}</span>
      )}
      {hidden && <span style={{ fontSize: Math.round(size * .5), color: "#999", position: "relative", zIndex: 1 }}>?</span>}
    </div>
  );
};

// Green numbered chip — physical material green chip
export const GreenChip = ({ num, size = 44, glow, onClick, style: sx, countAnim }) => {
  const digits = String(num).length;
  const fs = digits >= 3 ? Math.round(size * .34) : digits >= 2 ? Math.round(size * .42) : Math.round(size * .5);
  return (
    <div onClick={onClick} style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "radial-gradient(circle at 35% 30%, #6ee7b7 0%, #22c55e 45%, #15803d 100%)",
      border: "3px solid #14532d",
      boxShadow: glow ? "0 0 18px 6px rgba(22,163,74,.6), inset 0 -3px 6px rgba(0,0,0,.2)" : "0 3px 10px rgba(22,163,74,.5), 0 0 14px rgba(34,197,94,.2), inset 0 -3px 6px rgba(0,0,0,.2), inset 0 2px 4px rgba(255,255,255,.2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: onClick ? "pointer" : "default",
      transition: "all .25s ease",
      animation: countAnim ? "chipPop .55s ease" : "none",
      ...sx,
    }}>
      <span style={{ fontSize: fs, fontWeight: 900, color: "#fff",
        textShadow: "0 1px 2px rgba(0,0,0,.35)", lineHeight: 1 }}>{num}</span>
    </div>
  );
};
