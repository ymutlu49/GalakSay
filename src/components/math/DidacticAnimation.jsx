import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chip } from './Chip.jsx';
import { Frame } from './Frame.jsx';
import { NumberRod } from './NumberRod.jsx';
import { ANIM_DEFAULTS, getAnimSpeed } from '../../systems/animationTemplates.js';

// ═══════════════════════════════════════════════════════════════════════════════
// DİDAKTİK ANİMASYON BİLEŞENİ — Adım adım kavram inşa eden animasyonlar
// Kontroller: Başlat / Duraklat / Yavaşlat / Tekrar İzle
// Animasyonlar otomatik başlamaz, çocuk tetikler.
// ═══════════════════════════════════════════════════════════════════════════════

// ── Animasyon Kontrol Paneli ────────────────────────────────────────────────
const AnimControls = ({ playing, paused, step, totalSteps, onPlay, onPause, onStep, onReplay, onSlow, speed }) => (
  <div style={{
    display: "flex", justifyContent: "center", gap: 6, padding: "6px 0",
    flexWrap: "wrap",
  }}>
    {!playing && step === 0 && (
      <button onClick={onPlay} style={btnStyle("#6366f1")}>
        ▶ Başlat
      </button>
    )}
    {playing && !paused && (
      <button onClick={onPause} style={btnStyle("#f59e0b")}>
        ⏸ Duraklat
      </button>
    )}
    {playing && paused && (
      <button onClick={onPlay} style={btnStyle("#6366f1")}>
        ▶ Devam
      </button>
    )}
    {playing && (
      <button onClick={onStep} style={btnStyle("#3b82f6")}>
        ⏭ Sonraki
      </button>
    )}
    {step > 0 && (
      <button onClick={onReplay} style={btnStyle("#10b981")}>
        🔄 Tekrar
      </button>
    )}
    {playing && (
      <button onClick={onSlow} style={btnStyle(speed > 1 ? "#ef4444" : "#94a3b8")}>
        {speed > 1 ? "🐢 Yavaş" : "🐇 Normal"}
      </button>
    )}
    {totalSteps > 0 && (
      <span style={{ fontSize: 10, color: "#94a3b8", alignSelf: "center", fontWeight: 700 }}>
        {step}/{totalSteps}
      </span>
    )}
  </div>
);

const btnStyle = (color) => ({
  padding: "5px 12px", borderRadius: 10,
  background: `${color}20`, border: `1px solid ${color}40`,
  color, fontSize: 11, fontWeight: 700, cursor: "pointer",
  transition: "all .2s ease",
});

// ── Sayma Animasyonu — Nesneler tek tek belirir ─────────────────────────────
const CountingAnimation = ({ count, direction = "forward", stepDelay, currentStep }) => {
  const isBackward = direction === "backward";
  const visibleCount = isBackward ? Math.max(0, count - currentStep) : Math.min(count, currentStep);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", padding: 8 }}>
        {Array.from({ length: count }, (_, i) => {
          const visible = isBackward ? i < visibleCount : i < visibleCount;
          return (
            <div key={i} style={{
              opacity: visible ? 1 : 0.15,
              transform: visible ? "scale(1)" : "scale(0.6)",
              transition: `all ${stepDelay * 0.6}ms ease`,
            }}>
              <Chip color={i < 5 ? "blue" : "red"} size={36} countAnim={visible && i === visibleCount - 1} />
            </div>
          );
        })}
      </div>
      <div style={{
        fontSize: 28, fontWeight: 900, color: "#fbbf24",
        textShadow: "0 2px 8px rgba(251,191,36,.3)",
        fontFamily: "'Courier New', monospace",
        transition: "all .3s ease",
      }}>
        {visibleCount}
      </div>
    </div>
  );
};

// ── Sayı Doğrusu Animasyonu — Roket zıplama ────────────────────────────────
const NumberLineAnimation = ({ start, end, current, max, label }) => {
  const lineMax = Math.max(max || end + 3, 12);
  return (
    <div style={{ padding: "12px 16px" }}>
      <div style={{
        position: "relative", height: 50,
        background: "linear-gradient(90deg, rgba(99,102,241,.12), rgba(99,102,241,.04))",
        borderRadius: 10, border: "1px solid rgba(99,102,241,.2)",
      }}>
        {/* Tick marks */}
        {Array.from({ length: lineMax + 1 }, (_, i) => (
          <div key={i} style={{
            position: "absolute", left: `${(i / lineMax) * 100}%`, bottom: 0,
            width: 1, height: i % 5 === 0 ? 16 : 8,
            background: i === current ? "#f59e0b" : i === start ? "#6366f1" : "rgba(148,163,184,.25)",
            transform: "translateX(-0.5px)",
          }}>
            {(i % 5 === 0 || i === start || i === current) && (
              <span style={{
                position: "absolute", bottom: -16, left: "50%", transform: "translateX(-50%)",
                fontSize: 9, color: i === current ? "#f59e0b" : i === start ? "#6366f1" : "#64748b",
                fontWeight: i === current || i === start ? 900 : 600,
              }}>{i}</span>
            )}
          </div>
        ))}
        {/* Start marker */}
        <div style={{
          position: "absolute", left: `${(start / lineMax) * 100}%`, top: 8,
          transform: "translateX(-50%)", fontSize: 14, opacity: .5,
        }}>📍</div>
        {/* Rocket */}
        <div style={{
          position: "absolute", left: `${(current / lineMax) * 100}%`, top: 2,
          transform: "translateX(-50%)", fontSize: 22,
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,.3))",
          transition: "left .5s cubic-bezier(.16,1,.3,1)",
        }}>🚀</div>
        {/* Jump arcs */}
        {start !== current && (
          <div style={{
            position: "absolute",
            left: `${(Math.min(start, current) / lineMax) * 100}%`,
            width: `${(Math.abs(current - start) / lineMax) * 100}%`,
            top: 0, height: "100%",
            background: "rgba(99,102,241,.08)",
            borderRadius: 8,
            transition: "all .4s ease",
          }} />
        )}
      </div>
      {label && (
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>
          {label}
        </div>
      )}
    </div>
  );
};

// ── Çerçeve Dolum Animasyonu — On-çerçeve adım adım dolar ──────────────────
const FrameFillAnimation = ({ frameSize = 10, filled, adding = 0, remainder = 0, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
    <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
      <Frame total={frameSize} filled={Math.min(filled + adding, frameSize)} cols={5} size={40} />
      {remainder > 0 && (
        <div style={{
          display: "flex", gap: 4, alignItems: "center", padding: "0 8px",
          animation: "hintSlideIn .3s ease",
        }}>
          <span style={{ fontSize: 16, color: "#6366f1", fontWeight: 800 }}>+</span>
          {Array.from({ length: remainder }, (_, i) => (
            <Chip key={i} color="green" size={32} />
          ))}
        </div>
      )}
    </div>
    {label && (
      <div style={{ fontSize: 16, fontWeight: 800, color: "#fbbf24", fontFamily: "'Courier New', monospace" }}>
        {label}
      </div>
    )}
  </div>
);

// ── İki Grup Birleştirme/Ayırma Animasyonu ──────────────────────────────────
const GroupAnimation = ({ groupA, groupB, merged, operation = "add", label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
    <div style={{
      display: "flex", gap: merged ? 4 : 20, justifyContent: "center", alignItems: "center",
      transition: "gap .6s cubic-bezier(.16,1,.3,1)",
    }}>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center",
        padding: 6, borderRadius: 10,
        background: "rgba(59,130,246,.1)", border: "1px solid rgba(59,130,246,.2)",
        transition: "all .4s ease",
      }}>
        {Array.from({ length: groupA }, (_, i) => (
          <Chip key={`a${i}`} color="blue" size={30} />
        ))}
      </div>
      <span style={{ fontSize: 20, fontWeight: 900, color: "#f1f5f9" }}>
        {operation === "add" ? "+" : "−"}
      </span>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center",
        padding: 6, borderRadius: 10,
        background: operation === "add" ? "rgba(239,68,68,.1)" : "rgba(239,68,68,.06)",
        border: `1px solid ${operation === "add" ? "rgba(239,68,68,.2)" : "rgba(239,68,68,.1)"}`,
        opacity: operation === "sub" && merged ? 0.3 : 1,
        transition: "all .4s ease",
      }}>
        {Array.from({ length: groupB }, (_, i) => (
          <Chip key={`b${i}`} color="red" size={30} />
        ))}
      </div>
    </div>
    {label && (
      <div style={{ fontSize: 18, fontWeight: 800, color: "#fbbf24", fontFamily: "'Courier New', monospace" }}>
        {label}
      </div>
    )}
  </div>
);

// ── Dizi/Alan Modeli Animasyonu — Satır satır oluşum ─────────────────────────
const ArrayAnimation = ({ rows, cols, visibleRows, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} style={{
          display: "flex", gap: 3,
          opacity: r < visibleRows ? 1 : 0.1,
          transform: r < visibleRows ? "scale(1)" : "scale(0.8)",
          transition: "all .4s ease",
        }}>
          {Array.from({ length: cols }, (_, c) => (
            <Chip key={c} color={r < visibleRows ? "blue" : "gray"} size={24} />
          ))}
        </div>
      ))}
    </div>
    {label && (
      <div style={{ fontSize: 16, fontWeight: 800, color: "#fbbf24", fontFamily: "'Courier New', monospace" }}>
        {label}
      </div>
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ANA BİLEŞEN: DidacticAnimation
// mode + question bilgisine göre uygun animasyonu seçer ve oynatır
// ═══════════════════════════════════════════════════════════════════════════════
export const DidacticAnimation = ({ mode, question, correctAnswer, ltLevel = 5, compact = false }) => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef(null);

  const animSpeed = getAnimSpeed(ltLevel);
  const baseDelay = ANIM_DEFAULTS.stepDelay * animSpeed.multiplier * (speed > 1 ? 1.5 : 1);

  const q = question || {};
  const ca = correctAnswer;

  // Animasyon türü ve toplam adım belirleme
  const { totalSteps, animType } = getAnimInfo(mode, q, ca);

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  // Otomatik adım ilerleme
  useEffect(() => {
    if (!playing || paused || step >= totalSteps) {
      clearTimer();
      if (step >= totalSteps && playing) setPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => setStep(s => s + 1), baseDelay);
    return clearTimer;
  }, [playing, paused, step, totalSteps, baseDelay, clearTimer]);

  // Cleanup on unmount
  useEffect(() => clearTimer, [clearTimer]);

  const handlePlay = () => { setPlaying(true); setPaused(false); if (step === 0) setStep(1); };
  const handlePause = () => setPaused(true);
  const handleStep = () => { if (step < totalSteps) setStep(s => s + 1); };
  const handleReplay = () => { setStep(0); setPlaying(false); setPaused(false); };
  const handleSlow = () => setSpeed(s => s > 1 ? 1 : 1.5);

  return (
    <div style={{
      padding: compact ? 8 : 12, borderRadius: 14,
      background: "linear-gradient(135deg, rgba(30,27,75,.25), rgba(49,46,129,.12))",
      border: "1px solid rgba(148,163,184,.08)",
    }}>
      {/* Animasyon İçeriği */}
      <div style={{ minHeight: compact ? 80 : 120 }}>
        {renderAnimation(animType, mode, q, ca, step, totalSteps, baseDelay)}
      </div>

      {/* Kontrol Paneli */}
      <AnimControls
        playing={playing} paused={paused}
        step={step} totalSteps={totalSteps}
        onPlay={handlePlay} onPause={handlePause}
        onStep={handleStep} onReplay={handleReplay}
        onSlow={handleSlow} speed={speed}
      />
    </div>
  );
};

// ── Animasyon bilgi hesaplayıcı ─────────────────────────────────────────────
function getAnimInfo(mode, q, ca) {
  const num = q.number || ca || 5;
  const num1 = q.num1 || q.a || q.start || 0;
  const num2 = q.num2 || q.b || q.toAdd || q.toRemove || 0;

  // Sayma modları
  if (["counting", "quantityMatch", "buildNumber", "matching", "conservation", "ordinalCount"].includes(mode)) {
    return { totalSteps: num, animType: "counting" };
  }
  if (mode === "backwardCount") {
    return { totalSteps: q.stepsBack || num, animType: "countBackward" };
  }
  if (mode === "counterFromN" || mode === "decadeCount") {
    return { totalSteps: q.stepsToCount || 5, animType: "numberLine" };
  }
  if (mode === "skipCount") {
    return { totalSteps: q.sequence?.length || 5, animType: "numberLine" };
  }

  // Toplama/Çıkarma
  if (["addition", "addChips", "countOnAdd", "wpAdd"].includes(mode)) {
    return { totalSteps: Math.max(num2, 3), animType: "numberLineAdd" };
  }
  if (["subtraction", "removeChips", "wpSub"].includes(mode)) {
    return { totalSteps: Math.max(num2, 3), animType: "numberLineSub" };
  }
  if (mode === "inversePractice") {
    return { totalSteps: 4, animType: "groups" };
  }

  // Çerçeve modları
  if (["makeFive", "makeTen", "fivesFrame", "tensFrame"].includes(mode)) {
    return { totalSteps: 3, animType: "frameFill" };
  }
  if (mode === "doubleTensFrame") {
    return { totalSteps: 3, animType: "frameFill" };
  }

  // Karşılaştırma
  if (["comparison", "lessMoreEqual", "fiveMore", "wpCompare"].includes(mode)) {
    return { totalSteps: 3, animType: "groups" };
  }

  // Çarpma — dizi
  if (mode === "arrayDots") {
    return { totalSteps: q.rows || 3, animType: "array" };
  }
  // Çarpma — gruplar
  if (["multiplyVisual", "repeatAdd", "equalShare", "groupCount", "timesTable", "katConcept", "halfDouble", "divisionBasic", "mulDivInverse", "wpMul", "wpDiv"].includes(mode)) {
    return { totalSteps: q.groups || q.a || 3, animType: "groups" };
  }

  // Basamak değeri
  if (["bundleTens", "placeValue", "expandForm", "composeNumber"].includes(mode)) {
    return { totalSteps: 3, animType: "frameFill" };
  }

  // Parça-bütün
  if (["partWhole", "numbersInNumbers"].includes(mode)) {
    return { totalSteps: 3, animType: "groups" };
  }

  // Örüntü
  if (["patternAB", "growingPattern", "patternTranslate"].includes(mode)) {
    return { totalSteps: q.sequence?.length || 5, animType: "counting" };
  }

  // Subitizing
  if (["subitizing", "chipGuess", "rodBack", "estimateCount"].includes(mode)) {
    return { totalSteps: 3, animType: "counting" };
  }

  // Diğer
  if (["trueFalse", "missingNumber", "spaceBalance", "beforeAfter", "ordering"].includes(mode)) {
    return { totalSteps: 3, animType: "numberLine" };
  }

  // Fallback
  return { totalSteps: num || 5, animType: "counting" };
}

// ── Animasyon render ────────────────────────────────────────────────────────
function renderAnimation(animType, mode, q, ca, step, totalSteps, delay) {
  const num = q.number || ca || 5;
  const num1 = q.num1 || q.a || q.start || 0;
  const num2 = q.num2 || q.b || q.toAdd || q.toRemove || 0;
  const result = ca || (num1 + num2);

  switch (animType) {
    case "counting":
      return <CountingAnimation count={num} direction="forward" stepDelay={delay} currentStep={step} />;

    case "countBackward":
      return <CountingAnimation count={q.startNum || num} direction="backward" stepDelay={delay} currentStep={step} />;

    case "numberLine":
    case "numberLineAdd": {
      const start = num1 || 0;
      const current = Math.min(start + step, result);
      return <NumberLineAnimation start={start} end={result} current={current} label={step > 0 ? `${start} + ${step} = ${current}` : `Başlangıç: ${start}`} />;
    }

    case "numberLineSub": {
      const start = num1 || num;
      const current = Math.max(start - step, result);
      return <NumberLineAnimation start={start} end={result} current={current} label={step > 0 ? `${start} − ${step} = ${current}` : `Başlangıç: ${start}`} />;
    }

    case "frameFill": {
      const frameSize = mode === "makeFive" ? 5 : 10;
      const filled = q.current || num1 || 0;
      const toAdd = ca || (frameSize - filled);
      const addedSoFar = Math.min(step, toAdd);
      const isComplete = step >= totalSteps;
      return <FrameFillAnimation
        frameSize={frameSize}
        filled={filled}
        adding={addedSoFar}
        remainder={0}
        label={isComplete ? `${filled} + ${toAdd} = ${frameSize}` : `${filled} + ${addedSoFar} = ${filled + addedSoFar}`}
      />;
    }

    case "groups": {
      const gA = num1 || q.groups || Math.ceil(num / 2);
      const gB = num2 || q.perGroup || num - gA;
      const isMerged = step >= totalSteps;
      const op = ["subtraction", "removeChips", "wpSub"].includes(mode) ? "sub" : "add";
      return <GroupAnimation
        groupA={gA} groupB={gB} merged={isMerged}
        operation={op}
        label={isMerged ? `${gA} ${op === "add" ? "+" : "−"} ${gB} = ${op === "add" ? gA + gB : gA - gB}` : `${gA} ${op === "add" ? "+" : "−"} ${gB} = ?`}
      />;
    }

    case "array": {
      const rows = q.rows || 3;
      const cols = q.cols || 3;
      const visibleRows = Math.min(step, rows);
      return <ArrayAnimation
        rows={rows} cols={cols} visibleRows={visibleRows}
        label={visibleRows > 0 ? `${visibleRows} × ${cols} = ${visibleRows * cols}` : `${rows} × ${cols} = ?`}
      />;
    }

    default:
      return <CountingAnimation count={num} direction="forward" stepDelay={delay} currentStep={step} />;
  }
}

export default DidacticAnimation;
