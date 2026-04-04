import React from 'react';
import { C } from '../../theme/colors.js';

export const Btn = ({ children, onClick, bg, full, big, disabled, glow, style: sx }) => (
  <button onClick={onClick} disabled={disabled} className="space-btn-hover" style={{
    padding: big ? "16px 30px" : "12px 22px", borderRadius: 14,
    border: glow ? `1px solid ${bg || C.uiGreen}40` : "none",
    background: bg || C.uiGreen, color: "#fff", fontSize: big ? 18 : 15, fontWeight: 800,
    cursor: disabled ? "default" : "pointer", opacity: disabled ? .5 : 1,
    width: full ? "100%" : "auto",
    boxShadow: glow
      ? `0 4px 20px ${bg || C.uiGreen}40, 0 0 30px ${bg || C.uiGreen}15`
      : "0 4px 16px rgba(0,0,0,.25)",
    transition: "all .25s cubic-bezier(.4,0,.2,1)",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    position: "relative", overflow: "hidden",
    letterSpacing: .3,
    ...sx,
  }}>{children}</button>
);
