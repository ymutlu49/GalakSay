import React, { useState, useEffect, useRef } from 'react';
import { Chip } from './Chip.jsx';
import { Frame } from './Frame.jsx';
import { NumberRod } from './NumberRod.jsx';
import { TenBlock } from './TenBlock.jsx';
import { TripleCode } from './TripleCode.jsx';
import { numWord } from '../../data/numWords.js';
import { TTS } from '../../audio/tts.js';
// DokunSay Kit entegrasyonu
import { EnerjiKapsulu } from '../../core/DokunSayKit/EnerjiKapsulu.jsx';
import { Pul, PulGrubu } from '../../core/DokunSayKit/Pul.jsx';
import { YildizTasi } from '../../core/DokunSayKit/YildizTasi.jsx';
import { FAZLAR, FAZ_ETIKETLERI, FAZ_IKONLARI, getLTAyar } from '../../core/TripleCoding/KatmanSenkronizasyon.js';
import { getRenkKodlamaStyle } from '../../core/TripleCoding/TemsilGecisAnimasyon.js';

// ═══════════════════════════════════════════════════════════════════════════════
// ÜÇLÜ KODLAMA ÇERÇEVESİ — Keşfet → Gör → Adlandır → Bağla
// Her modül üç temsil katmanını eşzamanlı veya aşamalı sunar.
// DokunSay materyalleri (EnerjiKapsülü, YıldızTaşı) entegre.
// ═══════════════════════════════════════════════════════════════════════════════

// ── Faz Tanımları (geriye uyumluluk) ────────────────────────────────────────
const PHASES = { EXPLORE: 0, SEE: 1, WRITE: 2, CONNECT: 3 };
const PHASE_LABELS = FAZ_ETIKETLERI;
const PHASE_ICONS  = FAZ_IKONLARI;

// ── Somut Katman: DokunSay Materyalleri ──────────────────────────────────────
// useDokunSay=true ise yeni DokunSay Kit bileşenlerini kullanır
export const ConcreteLayer = ({ count, mode, interactive = true, onCountChange, size = 44, animate = true, useDokunSay = false, showKapsul = false }) => {
  const chipCount = Math.min(count, 20);
  const [revealed, setRevealed] = useState(animate ? 0 : chipCount);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!animate) { setRevealed(chipCount); return; }
    setRevealed(0);
    let i = 0;
    const tick = () => {
      i++;
      setRevealed(i);
      if (i < chipCount) timerRef.current = setTimeout(tick, 200);
    };
    timerRef.current = setTimeout(tick, 300);
    return () => clearTimeout(timerRef.current);
  }, [chipCount, animate]);

  // DokunSay modu: EnerjiKapsülü + Yıldız Taşları
  if (useDokunSay) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", gap: 10, alignItems: "center",
        padding: 10, borderRadius: 12,
        background: "linear-gradient(135deg, rgba(49,46,129,.25), rgba(30,27,75,.2))",
        border: "1px solid rgba(148,163,184,.1)",
        minHeight: size + 20,
      }}>
        {/* Enerji Kapsülü (sayı 1-10 arasındaysa göster) */}
        {showKapsul && count >= 1 && count <= 10 && (
          <EnerjiKapsulu
            deger={count}
            showNumber
            showUnits
            glowing={animate}
            size={size > 36 ? undefined : 28}
            compact={size <= 36}
          />
        )}
        {/* Yıldız Taşları (her zaman göster) */}
        <PulGrubu
          adet={count}
          size={Math.max(28, size - 8)}
          countable={interactive}
          animate={animate}
          onCountChange={onCountChange}
          gap={4}
        />
      </div>
    );
  }

  // Orijinal Chip modu (geriye uyumluluk)
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center",
      padding: 10, borderRadius: 12,
      background: "linear-gradient(135deg, rgba(49,46,129,.25), rgba(30,27,75,.2))",
      border: "1px solid rgba(148,163,184,.1)",
      minHeight: size + 20,
    }}>
      {Array.from({ length: chipCount }, (_, i) => (
        <div key={i} style={{
          opacity: i < revealed ? 1 : 0,
          transform: i < revealed ? "scale(1)" : "scale(0.3)",
          transition: "all .3s ease",
        }}>
          <Chip color={i < 5 ? "blue" : "red"} size={size} countAnim={animate && i === revealed - 1} />
        </div>
      ))}
      {count > chipCount && (
        <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 700, alignSelf: "center" }}>+{count - chipCount}</span>
      )}
    </div>
  );
};

// ── Görsel Katman: Yapılandırılmış temsiller ─────────────────────────────────
export const VisualLayer = ({ count, model = "tenFrame", mode, animate = true }) => {
  if (model === "tenFrame" || model === "fiveFrame") {
    const frameSize = model === "fiveFrame" ? 5 : 10;
    const cols = model === "fiveFrame" ? 5 : 5;
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        {count <= frameSize ? (
          <Frame total={frameSize} filled={count} cols={cols} size={44} />
        ) : (
          <>
            <Frame total={10} filled={Math.min(count, 10)} cols={5} size={40} label="10" />
            {count > 10 && <Frame total={10} filled={count - 10} cols={5} size={40} label={`+${count - 10}`} />}
          </>
        )}
      </div>
    );
  }

  if (model === "numberRod") {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <NumberRod count={count} showNumber />
      </div>
    );
  }

  if (model === "numberLine") {
    const max = Math.max(count + 3, 10);
    const pct = (count / max) * 100;
    return (
      <div style={{ padding: "8px 12px" }}>
        <div style={{
          position: "relative", height: 40,
          background: "linear-gradient(90deg, rgba(99,102,241,.15), rgba(99,102,241,.05))",
          borderRadius: 8, border: "1px solid rgba(99,102,241,.2)",
        }}>
          {/* Tick marks */}
          {Array.from({ length: max + 1 }, (_, i) => (
            <div key={i} style={{
              position: "absolute", left: `${(i / max) * 100}%`, bottom: 0,
              width: 1, height: i % 5 === 0 ? 16 : 8,
              background: i === count ? "#f59e0b" : "rgba(148,163,184,.3)",
              transform: "translateX(-0.5px)",
            }}>
              {i % 5 === 0 && (
                <span style={{
                  position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)",
                  fontSize: 10, color: i === count ? "#f59e0b" : "#64748b", fontWeight: i === count ? 900 : 600,
                }}>{i}</span>
              )}
            </div>
          ))}
          {/* Rocket marker */}
          <div style={{
            position: "absolute", left: `${pct}%`, top: 2,
            transform: "translateX(-50%)",
            fontSize: 22, filter: "drop-shadow(0 2px 4px rgba(0,0,0,.3))",
            transition: animate ? "left .6s ease" : "none",
          }}>🚀</div>
        </div>
      </div>
    );
  }

  if (model === "barModel") {
    return (
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        gap: 4, height: 80, padding: "0 12px",
      }}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} style={{
            width: Math.max(12, Math.min(28, 200 / count)),
            height: `${Math.min(100, (100 / Math.max(count, 1)) * (i + 1))}%`,
            background: i < 5 ? "linear-gradient(180deg, #60a5fa, #3b82f6)" : "linear-gradient(180deg, #f87171, #ef4444)",
            borderRadius: "4px 4px 0 0",
            transition: animate ? `height .4s ease ${i * 0.05}s` : "none",
          }} />
        ))}
      </div>
    );
  }

  // Fallback: dot pattern
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", padding: 8 }}>
      {Array.from({ length: Math.min(count, 20) }, (_, i) => (
        <div key={i} style={{
          width: 16, height: 16, borderRadius: "50%",
          background: i < 5 ? "#60a5fa" : "#f87171",
        }} />
      ))}
    </div>
  );
};

// ── Sembolik Katman: Matematiksel ifade ──────────────────────────────────────
export const SymbolicLayer = ({ expression, result, animate = true, fontSize = 28 }) => {
  const [show, setShow] = useState(!animate);

  useEffect(() => {
    if (animate) {
      setShow(false);
      const t = setTimeout(() => setShow(true), 600);
      return () => clearTimeout(t);
    }
  }, [expression, animate]);

  return (
    <div style={{
      textAlign: "center", padding: "8px 16px",
      opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(10px)",
      transition: "all .4s ease",
    }}>
      <span style={{
        fontSize, fontWeight: 900, color: "#f1f5f9",
        fontFamily: "'Courier New', monospace",
        textShadow: "0 2px 8px rgba(99,102,241,.3)",
      }}>
        {expression}
        {result != null && (
          <span style={{ color: "#fbbf24" }}> = {result}</span>
        )}
      </span>
    </div>
  );
};

// ── Bağlantı Okları: Temsiller arası ilişki gösterimi ────────────────────────
const ConnectionArrows = ({ show }) => {
  if (!show) return null;
  return (
    <div style={{
      display: "flex", justifyContent: "center", gap: 40, padding: "4px 0",
      opacity: show ? 0.7 : 0, transition: "opacity .5s ease",
    }}>
      <span style={{ fontSize: 18, color: "#fbbf24" }}>↕</span>
      <span style={{ fontSize: 18, color: "#fbbf24" }}>↕</span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANA BİLEŞEN: TripleCodingLayer — Keşfet→Gör→Yaz→Bağla akışı
// ═══════════════════════════════════════════════════════════════════════════════
export const TripleCodingLayer = ({
  count,
  expression,
  result,
  mode,
  visualModel = "tenFrame",
  ltLevel = 5,
  phase: externalPhase,   // Dışarıdan kontrol (opsiyonel)
  showAll = false,         // Tüm katmanları aynı anda göster
  compact = false,
  animate = true,
  useDokunSay = false,     // DokunSay Kit bileşenlerini kullan
  onPhaseChange,
  onValueChange,           // Çapraz etkileşim: değer değişimi
}) => {
  const ltAyar = getLTAyar(ltLevel);
  const [phase, setPhase] = useState(externalPhase != null ? externalPhase : (showAll ? PHASES.CONNECT : ltAyar.startPhase));

  // Katman açma/kapama kontrolleri
  const [layerToggles, setLayerToggles] = useState({
    somut: ltAyar.defaults.somut !== false,
    gorsel: ltAyar.defaults.gorsel !== false,
    sembolik: ltAyar.defaults.sembolik !== false,
  });

  // Çapraz etkileşim vurgulama
  const [highlightedLayers, setHighlightedLayers] = useState(null);
  const highlightTimer = useRef(null);

  useEffect(() => {
    if (externalPhase != null) setPhase(externalPhase);
  }, [externalPhase]);

  // LT düzeyine göre varsayılan başlangıç fazı
  useEffect(() => {
    if (externalPhase != null || showAll) return;
    const ayar = getLTAyar(ltLevel);
    setPhase(ayar.startPhase);
    setLayerToggles({
      somut: ayar.defaults.somut !== false,
      gorsel: ayar.defaults.gorsel !== false,
      sembolik: ayar.defaults.sembolik !== false,
    });
  }, [ltLevel, externalPhase, showAll]);

  const advancePhase = () => {
    const next = Math.min(phase + 1, PHASES.CONNECT);
    setPhase(next);
    onPhaseChange?.(next);
  };

  const toggleLayer = (layer) => {
    setLayerToggles(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Çapraz etkileşim: bir katmandan değer değişikliği
  const handleCrossInteraction = (source) => {
    const others = ['somut', 'gorsel', 'sembolik'].filter(l => l !== source);
    setHighlightedLayers(others);
    clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightedLayers(null), 800);
  };

  const showConcrete = showAll || (phase >= PHASES.EXPLORE && layerToggles.somut);
  const showVisual   = showAll || (phase >= PHASES.SEE && layerToggles.gorsel);
  const showSymbolic = showAll || (phase >= PHASES.WRITE && layerToggles.sembolik);
  const showConnect  = showAll || phase >= PHASES.CONNECT;

  const isHighlighted = (layer) => highlightedLayers?.includes(layer);
  const highlightStyle = (layer) => isHighlighted(layer) ? getRenkKodlamaStyle(Math.min(count, 10), true) : {};

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: compact ? 6 : 10,
      padding: compact ? 8 : 12, borderRadius: 14,
      background: "linear-gradient(135deg, rgba(30,27,75,.3), rgba(49,46,129,.15))",
      border: "1px solid rgba(148,163,184,.08)",
    }}>
      {/* Üst kontrol çubuğu: Faz göstergesi + Katman toggle'ları */}
      {!showAll && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          {/* Faz göstergesi */}
          <div style={{ display: "flex", gap: 4 }}>
            {PHASE_LABELS.map((label, i) => (
              <button key={i} onClick={() => { setPhase(i); onPhaseChange?.(i); }}
                style={{
                  padding: "3px 8px", borderRadius: 8, border: "none",
                  background: phase === i
                    ? "linear-gradient(135deg, #6366f1, #7c3aed)"
                    : "rgba(148,163,184,.1)",
                  color: phase === i ? "#fff" : "#94a3b8",
                  fontSize: compact ? 10 : 11, fontWeight: 700,
                  cursor: "pointer", transition: "all .2s ease",
                  opacity: i <= phase ? 1 : 0.4,
                }}>
                {PHASE_ICONS[i]} {label}
              </button>
            ))}
          </div>

          {/* Katman toggle ikonları */}
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => toggleLayer('somut')} title="Somut katman"
              style={{
                width: 28, height: 28, borderRadius: 6, border: "none",
                background: layerToggles.somut ? "rgba(59,130,246,.3)" : "rgba(148,163,184,.1)",
                color: layerToggles.somut ? "#60a5fa" : "#64748b",
                fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>🔵</button>
            <button onClick={() => toggleLayer('gorsel')} title="Görsel katman"
              style={{
                width: 28, height: 28, borderRadius: 6, border: "none",
                background: layerToggles.gorsel ? "rgba(34,197,94,.3)" : "rgba(148,163,184,.1)",
                color: layerToggles.gorsel ? "#4ade80" : "#64748b",
                fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>📊</button>
            <button onClick={() => toggleLayer('sembolik')} title="Sembolik katman"
              style={{
                width: 28, height: 28, borderRadius: 6, border: "none",
                background: layerToggles.sembolik ? "rgba(251,191,36,.3)" : "rgba(148,163,184,.1)",
                color: layerToggles.sembolik ? "#fbbf24" : "#64748b",
                fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>🔢</button>
          </div>
        </div>
      )}

      {/* Katman 1: Somut */}
      {showConcrete && (
        <div style={{
          transition: "all .4s ease",
          opacity: showConcrete ? 1 : 0,
          ...highlightStyle('somut'),
        }}>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 2, textAlign: "center" }}>
            SOMUT
          </div>
          <ConcreteLayer
            count={count} mode={mode}
            size={compact ? 32 : 40}
            animate={animate}
            useDokunSay={useDokunSay}
            showKapsul={count >= 1 && count <= 10}
          />
        </div>
      )}

      {showVisual && showConcrete && <ConnectionArrows show={showConnect} />}

      {/* Katman 2: Görsel */}
      {showVisual && (
        <div style={{
          transition: "all .4s ease",
          opacity: showVisual ? 1 : 0,
          ...highlightStyle('gorsel'),
        }}>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 2, textAlign: "center" }}>
            GÖRSEL
          </div>
          <VisualLayer count={count} model={visualModel} mode={mode} animate={animate} />
        </div>
      )}

      {showSymbolic && showVisual && <ConnectionArrows show={showConnect} />}

      {/* Katman 3: Sembolik */}
      {showSymbolic && (
        <div style={{
          transition: "all .4s ease",
          opacity: showSymbolic ? 1 : 0,
          ...highlightStyle('sembolik'),
        }}>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, marginBottom: 2, textAlign: "center" }}>
            SEMBOLİK
          </div>
          {useDokunSay && count >= 1 && count <= 20 ? (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
              <YildizTasi sayi={count} size={compact ? 40 : 48} glowing={showConnect} />
              <SymbolicLayer
                expression={expression || String(count)}
                result={result}
                animate={animate}
                fontSize={compact ? 22 : 28}
              />
            </div>
          ) : (
            <SymbolicLayer
              expression={expression || String(count)}
              result={result}
              animate={animate}
              fontSize={compact ? 22 : 28}
            />
          )}
        </div>
      )}

      {/* İleri buton (showAll değilse) */}
      {!showAll && phase < PHASES.CONNECT && (
        <button onClick={advancePhase} style={{
          alignSelf: "center", padding: "6px 18px", borderRadius: 10,
          background: "linear-gradient(135deg, #6366f1, #7c3aed)",
          border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
          cursor: "pointer",
        }}>
          Sonraki →
        </button>
      )}

      {/* "Nesnelerle Göster" butonu (yüksek LT'de sembolikten somuta dönüş) */}
      {ltLevel >= 8 && !showAll && phase === PHASES.WRITE && (
        <button onClick={() => { setPhase(PHASES.EXPLORE); onPhaseChange?.(PHASES.EXPLORE); }}
          style={{
            alignSelf: "center", padding: "4px 14px", borderRadius: 8,
            background: "rgba(251,191,36,.15)", border: "1px solid rgba(251,191,36,.3)",
            color: "#fbbf24", fontSize: 11, fontWeight: 700, cursor: "pointer",
          }}>
          🔍 Nesnelerle Göster
        </button>
      )}
    </div>
  );
};

// ── Mod → Görsel Model Haritalaması ──────────────────────────────────────────
export const getVisualModelForMode = (mode) => {
  const map = {
    // Sayma
    counting: "numberLine", quantityMatch: "tenFrame", buildNumber: "tenFrame",
    backwardCount: "numberLine", skipCount: "numberLine", counterFromN: "numberLine",
    ordinalCount: "numberLine", decadeCount: "numberLine", matching: "tenFrame",
    conservation: "tenFrame",
    // Subitizing
    subitizing: "dotPattern", fivesFrame: "fiveFrame", tensFrame: "tenFrame",
    doubleTensFrame: "tenFrame", chipGuess: "dotPattern", rodBack: "numberRod",
    estimateCount: "dotPattern",
    // Karşılaştırma
    comparison: "barModel", lessMoreEqual: "barModel", ordering: "numberLine",
    beforeAfter: "numberLine", fiveMore: "numberLine",
    numberLineEstimate: "numberLine", nlPlacement: "numberLine",
    numberLine: "numberLine", lengthGuess: "barModel",
    // Sayı Bileşimi
    makeFive: "fiveFrame", makeTen: "tenFrame", partWhole: "tenFrame",
    numbersInNumbers: "tenFrame", spaceKitchen: "numberRod", rodSplit: "numberRod",
    // Basamak Değeri
    composeNumber: "barModel", expandForm: "barModel",
    bundleTens: "tenFrame", placeValue: "barModel",
    // Toplama/Çıkarma
    addChips: "numberLine", countOnAdd: "numberLine", addition: "numberLine",
    subtraction: "numberLine", removeChips: "tenFrame", difference: "barModel",
    inversePractice: "numberLine",
    wpAdd: "numberLine", wpSub: "numberLine", wpCompare: "barModel",
    // Çarpma/Bölme
    repeatAdd: "numberLine", multiplyVisual: "barModel", arrayDots: "barModel",
    timesTable: "numberLine", katConcept: "barModel",
    wpMul: "barModel", equalShare: "barModel", groupCount: "barModel",
    halfDouble: "barModel", divisionBasic: "barModel", mulDivInverse: "barModel",
    wpDiv: "barModel",
    // Örüntü
    patternAB: "dotPattern", growingPattern: "numberLine",
    patternTranslate: "dotPattern", trueFalse: "barModel",
    missingNumber: "numberLine", spaceBalance: "barModel",
  };
  return map[mode] || "tenFrame";
};
