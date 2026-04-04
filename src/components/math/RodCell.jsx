import React from 'react';
import { C } from '../../theme/colors.js';
import { Chip, GreenChip } from './Chip.jsx';

export const RodCell = ({ filled, chipColor = "blue", size = 56, onClick, interactive, countAnim, hidden, blank, greenNumber }) => {
  const cs = size - 8;
  // blank = completely flat wooden back, no circles at all
  if (blank) {
    return (
      <div style={{
        width: size, minWidth: 0, flex: "0 1 auto", height: "auto",
        aspectRatio: `${size} / ${size + 10}`,
        background: "linear-gradient(180deg,#a8a29e 0%,#78716c 40%,#57534e 100%)",
        borderLeft: "1px solid rgba(0,0,0,.15)", borderRight: "1px solid rgba(255,255,255,.08)",
      }} />
    );
  }
  return (
    <div onClick={onClick} style={{
      width: size, minWidth: 0, flex: "0 1 auto", height: "auto",
      aspectRatio: `${size} / ${size + 14}`,
      background: hidden ? "linear-gradient(180deg,#78716c 0%,#57534e 40%,#44403c 100%)" :
        `linear-gradient(180deg,${C.rodLight} 0%,${C.rodGold} 30%,${C.rodDark} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      borderLeft: "2px solid rgba(0,0,0,.3)", borderRight: "2px solid rgba(255,255,255,.2)",
      cursor: interactive ? "pointer" : "default",
    }}>
      {greenNumber != null ? (
        <GreenChip num={greenNumber} size={cs} countAnim={countAnim} />
      ) : filled ? (
        <Chip color={chipColor} size={cs} countAnim={countAnim} />
      ) : (
        /* Empty slot — dark chip style, real slot feel */
        <div style={{ width: cs, height: cs, maxWidth: "100%", maxHeight: "100%", borderRadius: "50%",
          background: "radial-gradient(circle at 45% 40%, #1a1f2e, #0c1018 60%, #060810)",
          border: "2.5px solid rgba(30,40,60,.9)",
          boxShadow: "inset 0 3px 8px rgba(0,0,0,.7), inset 0 -1px 3px rgba(255,255,255,.03), 0 1px 2px rgba(0,0,0,.3)",
          position: "relative", overflow: "hidden" }}>
          {/* Inner depth effect */}
          <div style={{ position: "absolute", inset: "15%", borderRadius: "50%",
            background: "radial-gradient(circle at 50% 45%, rgba(49,46,129,.4), transparent 70%)",
            border: "1px solid rgba(30,27,75,.5)" }} />
        </div>
      )}
    </div>
  );
};
