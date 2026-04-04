import React from 'react';

export const Nebula = ({ color = "#6366f1", size = 200, top, left, right, bottom, opacity }) => (
  <div className="nebula-glow" style={{ width: size, height: size, background: color, top, left, right, bottom, opacity: opacity || undefined, animation: "nebulaFloat 12s ease-in-out infinite" }} />
);
