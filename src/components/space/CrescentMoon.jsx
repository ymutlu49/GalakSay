import React from 'react';

export const CrescentMoon = ({ size = 40, top = "5%", right = "10%" }) => (
  <div style={{ position: "absolute", top, right, width: size, height: size, pointerEvents: "none", zIndex: 0, animation: "moonFloat 20s ease-in-out infinite", overflow: "hidden", borderRadius: "50%" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `radial-gradient(circle at 30% 30%, #fef9c3, #fde68a 45%, #fbbf24 75%)`, boxShadow: `inset ${-size*.28}px ${size*.05}px ${size*.12}px ${size*.02}px rgba(2,6,23,.97), 0 0 ${size*.6}px rgba(251,191,36,.3), 0 0 ${size*1.6}px rgba(251,191,36,.1)` }} />
  </div>
);
