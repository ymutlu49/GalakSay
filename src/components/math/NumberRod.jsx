import React from 'react';
import { C, capsuleSize } from '../../theme/colors.js';
import { subColor } from '../../systems/accessibility.js';
import { RodCell } from './RodCell.jsx';

export const NumberRod = ({ count, filledSlots, chipColors, defaultColor = "blue", size, showNumber, interactive, onSlotClick, countingSlots, hidden, blank, greenNumbers, solid }) => {
  if (!count || count < 1) return null;
  const filled = filledSlots || Array(count).fill(true);
  // Universal two-color rule: color changes after 5 (single color in solid mode)
  const altColor = solid ? defaultColor : (defaultColor === "blue" ? "red" : "blue");
  const colors = chipColors || Array(count).fill(0).map((_, i) => subColor(i, defaultColor, altColor));

  // Sabit kapsül boyutu: size verilmişse onu kullan, yoksa capsuleSize() ile hesapla
  const effectiveSize = size || capsuleSize(count);

  // Üst konteynere sığma: maxWidth + otomatik küçülme
  const wrapStyle = {
    display: "inline-flex", flexDirection: "column", alignItems: "center",
    maxWidth: "100%", // Üst konteynere sığ (eski: 90vw)
    overflow: "visible",
  };

  // Blank = single solid block, no cell boundaries visible
  if (blank) {
    const totalW = count * effectiveSize;
    return (
      <div style={wrapStyle}>
        <div style={{
          width: totalW, height: effectiveSize + 10, borderRadius: 12, overflow: "hidden",
          background: "linear-gradient(180deg,#a8a29e 0%,#78716c 40%,#57534e 100%)",
          boxShadow: "0 5px 20px rgba(0,0,0,.3)", border: "3px solid #57534e",
          maxWidth: "100%",
        }} />
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      <div style={{
        display: "flex", borderRadius: 14, overflow: "hidden",
        boxShadow: `0 6px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.15)`,
        border: `3.5px solid ${hidden ? "#57534e" : C.rodDark}`,
        maxWidth: "100%", // Üst konteynere sığ
      }}>
        {Array(count).fill(0).map((_, i) => (
          <RodCell key={i} filled={filled[i]} chipColor={colors[i]} size={effectiveSize}
            interactive={interactive} onClick={onSlotClick ? () => onSlotClick(i) : undefined}
            countAnim={countingSlots?.includes(i)} hidden={hidden}
            greenNumber={greenNumbers ? greenNumbers[i] : undefined} />
        ))}
      </div>
      {showNumber && !hidden && (
        <div style={{ marginTop: 6, padding: "3px 14px", borderRadius: 10, background: "rgba(99,102,241,.3)", border: "1px solid rgba(99,102,241,.3)", color: "#fff", fontWeight: 900, fontSize: 16 }}>
          {filled.filter(Boolean).length}
        </div>
      )}
    </div>
  );
};
