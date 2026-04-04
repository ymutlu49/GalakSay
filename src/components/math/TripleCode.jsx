import React from 'react';
import { subColorHex } from '../../systems/accessibility.js';
import { numWord } from '../../data/numWords.js';
import { TTS } from '../../audio/tts.js';
import { NumberRod } from './NumberRod.jsx';
import { LooseChips } from './LooseChips.jsx';
import { Frame } from './Frame.jsx';

// Triple Code representation (Dehaene Triple Code)
// Quantity (analog) + Digit (Arabic numeral) + Word (verbal/auditory)
// preReader: for non-readers, word is replaced with speaker + TTS
const FINGER = {1:"\u261D\uFE0F",2:"\u270C\uFE0F",5:"\uD83D\uDD90\uFE0F",10:"\uD83D\uDE4C"};

export const TripleCode = ({ n, size = "md", preReader = false, showFinger = false, animate = true, speak = false, compact = false }) => {
  if (n == null || n < 0 || n > 99) return null;
  const s = size === "sm" ? { chip: 8, num: 14, word: 8, gap: 3, pad: "3px 6px" }
          : size === "lg" ? { chip: 14, num: 24, word: 12, gap: 6, pad: "8px 12px" }
          : { chip: 10, num: 18, word: 10, gap: 5, pad: "6px 10px" };
  const chipCount = Math.min(n, compact ? 10 : 15);
  const word = numWord(n);

  React.useEffect(() => {
    if (speak && word) TTS.speak(word, "tr-TR", 0.9);
  }, [speak, word]);

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: s.gap,
      padding: s.pad, borderRadius: 10, background: "linear-gradient(135deg,rgba(49,46,129,.4),rgba(30,27,75,.3))",
      border: "1px solid rgba(148,163,184,.12)", animation: animate ? "fadeUp .4s ease" : "none",
      maxWidth: "100%", overflow: "hidden", flexShrink: 1 }}>
      {/* Quantity */}
      <div style={{ display: "flex", gap: 1, flexWrap: "wrap", maxWidth: compact ? 50 : 80, alignItems: "center", flexShrink: 1 }}>
        {Array.from({ length: chipCount }, (_, i) => (
          <div key={i} style={{ width: s.chip, height: s.chip, borderRadius: "50%", background: subColorHex(i), flexShrink: 0 }} />
        ))}
        {n > chipCount && <span style={{ fontSize: s.chip * 0.8, color: "#94a3b8", fontWeight: 700 }}>+{n - chipCount}</span>}
      </div>
      <span style={{ fontSize: s.word - 1, color: "#cbd5e1", fontWeight: 900, flexShrink: 0 }}>{"\u2194"}</span>
      {/* Digit */}
      <span style={{ fontSize: s.num, fontWeight: 900, color: "#f1f5f9", flexShrink: 0 }}>{n}</span>
      <span style={{ fontSize: s.word - 1, color: "#cbd5e1", fontWeight: 900, flexShrink: 0 }}>{"\u2194"}</span>
      {/* Word */}
      {preReader ? (
        <button onClick={() => TTS.speak(word, "tr-TR", 0.85)} style={{
          border: "none", background: "linear-gradient(135deg,#60a5fa,#6366f1)",
          borderRadius: 6, padding: "2px 6px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 2, flexShrink: 0,
        }}>
          <span style={{ fontSize: s.num * 0.6 }}>{"\uD83D\uDD0A"}</span>
          <span style={{ fontSize: s.word, fontWeight: 800, color: "#fff" }}>{word}</span>
        </button>
      ) : (
        <span style={{ fontSize: s.word, fontWeight: 800, color: "#7c3aed", fontStyle: "italic", flexShrink: 0 }}>{word}</span>
      )}
      {showFinger && FINGER[n] && <span style={{ fontSize: s.num * 0.7, flexShrink: 0 }}>{FINGER[n]}</span>}
    </div>
  );
};
