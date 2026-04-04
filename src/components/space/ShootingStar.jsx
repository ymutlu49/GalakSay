import React from 'react';

export const ShootingStar = ({ delay = 0, top = "15%", left = "5%" }) => (
  <div style={{ position: "absolute", top, left, width: 2, height: 2, background: "#fff", borderRadius: "50%", boxShadow: "0 0 6px 2px rgba(255,255,255,.6), -20px 0 12px rgba(167,139,250,.4), -40px 0 8px rgba(167,139,250,.2)", animation: `shootingStar ${8 + delay}s linear ${delay}s infinite`, pointerEvents: "none", zIndex: 0, opacity: .7 }} />
);
