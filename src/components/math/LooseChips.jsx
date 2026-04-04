import React from 'react';
import { subColor } from '../../systems/accessibility.js';
import { Chip } from './Chip.jsx';

// Scattered loose chips for chipGuess mode
export const LooseChips = ({ count, hidden, countingSlots }) => {
  // Generate scattered random positions with much more jitter for perceptual challenge
  const positions = [];
  const cols = Math.min(count, 5);
  const rows = Math.ceil(count / cols);
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    // High jitter for genuinely scattered appearance (perceptual subitizing challenge)
    const offsetX = ((i * 17 + 31) % 23) - 11;
    const offsetY = ((i * 23 + 13) % 19) - 9;
    // Add rotation-style position shifts for more organic scatter
    const angle = (i * 137.5) % 360; // golden angle distribution
    const radialJitter = ((i * 7 + 3) % 11) - 5;
    positions.push({
      x: col * 56 + 8 + offsetX + Math.cos(angle * Math.PI / 180) * radialJitter,
      y: row * 56 + 8 + offsetY + Math.sin(angle * Math.PI / 180) * radialJitter,
    });
  }
  const w = cols * 54 + 20;
  const h = rows * 54 + 20;
  const colors = Array(count).fill(0).map((_, i) => subColor(i));

  return (
    <div style={{ position: "relative", width: w, height: h, margin: "0 auto", minHeight: 60 }}>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: positions[i]?.x || 0,
          top: positions[i]?.y || 0,
          transition: "all .3s ease",
          opacity: hidden ? 0 : 1,
          transform: hidden ? "scale(0)" : "scale(1)",
        }}>
          <Chip color={colors[i % colors.length]} size={42}
            countAnim={countingSlots?.includes(i)} />
        </div>
      ))}
      {hidden && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: "radial-gradient(circle, rgba(120,113,108,.15), rgba(120,113,108,.05))",
          borderRadius: 16, border: "2px dashed #a8a29e",
        }}>
          <span style={{ fontSize: 48, color: "#a8a29e", fontWeight: 900 }}>?</span>
        </div>
      )}
    </div>
  );
};
