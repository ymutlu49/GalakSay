import React from 'react';
import { C } from '../../theme/colors.js';
import { subColor } from '../../systems/accessibility.js';
import { Chip } from './Chip.jsx';

export const Frame = ({ total, filled = 0, cols = 5, label, chipColor = "blue", size = 50, hidden }) => {
  const cs = size - 8;
  const altColor = chipColor === "blue" ? "red" : "blue";
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{
        display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`,
        borderRadius: 12, overflow: "hidden",
        boxShadow: "0 5px 20px rgba(0,0,0,.3)", border: `3px solid ${hidden ? "#57534e" : C.rodDark}`,
      }}>
        {Array(total).fill(0).map((_, i) => {
          const thisColor = subColor(i, chipColor, altColor);
          return (
          <div key={i} style={{
            width: size, height: size + 6,
            background: hidden ? "linear-gradient(180deg,#78716c,#57534e,#44403c)" :
              `linear-gradient(180deg,${C.rodLight} 0%,${C.rodGold} 35%,${C.rodDark} 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRight: ((i + 1) % cols !== 0) ? "2px solid rgba(0,0,0,.25)" : "none",
            borderBottom: i < total - cols ? "2px solid rgba(0,0,0,.25)" : "none",
          }}>
            {hidden ? (
              <div style={{ width: cs, height: cs, borderRadius: "50%", background: "#555", border: "1px solid #444" }} />
            ) : i < filled ? <Chip color={thisColor} size={cs} /> : (
              <div style={{ width: cs, height: cs, borderRadius: "50%",
                background: "radial-gradient(circle at 45% 40%, #1a1f2e, #0c1018 60%, #060810)",
                border: "2.5px solid rgba(30,40,60,.9)",
                boxShadow: "inset 0 3px 8px rgba(0,0,0,.7), inset 0 -1px 3px rgba(255,255,255,.03), 0 1px 2px rgba(0,0,0,.3)",
                position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: "15%", borderRadius: "50%",
                  background: "radial-gradient(circle at 50% 45%, rgba(49,46,129,.4), transparent 70%)",
                  border: "1px solid rgba(30,27,75,.5)" }} />
              </div>
            )}
          </div>
          );
        })}
      </div>
      {label && <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.6)" }}>{label}</div>}
    </div>
  );
};
