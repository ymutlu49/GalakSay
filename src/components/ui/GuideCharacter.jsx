import React from 'react';

// Guide Character body configurations
export const GUIDE_BODIES = {
  robot: {
    bodyColor: "#60a5fa", dark: "#3b82f6", light: "#93c5fd", accent: "#bfdbfe",
    headRadius: "22%", headExtra: (s) => ({ // Antenna
      _before: { width: 3, height: s*.15, background: "#38bdf8", borderRadius: 2, position: "absolute", top: -s*.13, left: "50%", marginLeft: -1.5 },
      _dot: { width: 6, height: 6, borderRadius: "50%", background: "#f43f5e", position: "absolute", top: -s*.17, left: "50%", marginLeft: -3, boxShadow: "0 0 6px #f43f5e" },
    }),
    torsoRadius: "18%", bellyDecor: "screen",
    armW: .22, armH: .7, armRadius: "30%",
    legW: .28, legH: .24, legGap: .22, legRadius: "0 0 32% 32%",
    footExtra: null,
  },
  baykus: {
    bodyColor: "#7c3aed", dark: "#5b21b6", light: "#c4b5fd", accent: "#ddd6fe",
    headRadius: "50%",
    headExtra: (s) => ({
      _left: { width: 0, height: 0, borderLeft: `${s*.08}px solid transparent`, borderRight: `${s*.08}px solid transparent`, borderBottom: `${s*.14}px solid #7c3aed`, position: "absolute", top: -s*.08, left: s*.08, transform: "rotate(-15deg)" },
      _right: { width: 0, height: 0, borderLeft: `${s*.08}px solid transparent`, borderRight: `${s*.08}px solid transparent`, borderBottom: `${s*.14}px solid #7c3aed`, position: "absolute", top: -s*.08, right: s*.08, transform: "rotate(15deg)" },
    }),
    torsoRadius: "50% 50% 40% 40%", bellyDecor: "belly",
    armW: .28, armH: .55, armRadius: "50% 50% 60% 20%",
    legW: .22, legH: .18, legGap: .2, legRadius: "0 0 40% 40%",
  },
  terazi: {
    bodyColor: "#dc2626", dark: "#991b1b", light: "#fca5a5", accent: "#fee2e2",
    headRadius: "50%", headExtra: null,
    torsoRadius: "35%", bellyDecor: "scale",
    armW: .2, armH: .65, armRadius: "30%",
    legW: .25, legH: .2, legGap: .25, legRadius: "0 0 30% 30%",
  },
  muhendis: {
    bodyColor: "#d97706", dark: "#92400e", light: "#fde68a", accent: "#fef3c7",
    headRadius: "28%",
    headExtra: (s) => ({
      _hat: { width: s*.55, height: s*.14, background: "#fbbf24", borderRadius: `${s*.08}px ${s*.08}px 2px 2px`, position: "absolute", top: -s*.06, left: "50%", marginLeft: -s*.275, border: "1.5px solid #d97706", zIndex: 3 },
    }),
    torsoRadius: "20%", bellyDecor: "belt",
    armW: .22, armH: .7, armRadius: "28%",
    legW: .26, legH: .24, legGap: .22, legRadius: "0 0 25% 25%",
  },
  kedi: {
    bodyColor: "#6d28d9", dark: "#4c1d95", light: "#c4b5fd", accent: "#ede9fe",
    headRadius: "42%",
    headExtra: (s) => ({
      _left: { width: 0, height: 0, borderLeft: `${s*.1}px solid transparent`, borderRight: `${s*.1}px solid transparent`, borderBottom: `${s*.16}px solid #6d28d9`, position: "absolute", top: -s*.1, left: s*.04, transform: "rotate(-8deg)" },
      _right: { width: 0, height: 0, borderLeft: `${s*.1}px solid transparent`, borderRight: `${s*.1}px solid transparent`, borderBottom: `${s*.16}px solid #6d28d9`, position: "absolute", top: -s*.1, right: s*.04, transform: "rotate(8deg)" },
      _leftInner: { width: 0, height: 0, borderLeft: `${s*.05}px solid transparent`, borderRight: `${s*.05}px solid transparent`, borderBottom: `${s*.08}px solid #a78bfa`, position: "absolute", top: -s*.04, left: s*.09 },
      _rightInner: { width: 0, height: 0, borderLeft: `${s*.05}px solid transparent`, borderRight: `${s*.05}px solid transparent`, borderBottom: `${s*.08}px solid #a78bfa`, position: "absolute", top: -s*.04, right: s*.09 },
    }),
    torsoRadius: "40% 40% 35% 35%", bellyDecor: "belly",
    armW: .18, armH: .55, armRadius: "35%",
    legW: .24, legH: .2, legGap: .18, legRadius: "0 0 40% 40%",
    tailColor: "#7c3aed",
  },
  ejderha: {
    bodyColor: "#059669", dark: "#064e3b", light: "#6ee7b7", accent: "#d1fae5",
    headRadius: "38%",
    headExtra: (s) => ({
      _left: { width: 0, height: 0, borderLeft: `${s*.06}px solid transparent`, borderRight: `${s*.06}px solid transparent`, borderBottom: `${s*.18}px solid #f59e0b`, position: "absolute", top: -s*.12, left: s*.06, transform: "rotate(-20deg)" },
      _right: { width: 0, height: 0, borderLeft: `${s*.06}px solid transparent`, borderRight: `${s*.06}px solid transparent`, borderBottom: `${s*.18}px solid #f59e0b`, position: "absolute", top: -s*.12, right: s*.06, transform: "rotate(20deg)" },
    }),
    torsoRadius: "30% 30% 35% 35%", bellyDecor: "scales",
    armW: .24, armH: .6, armRadius: "25%",
    legW: .26, legH: .22, legGap: .2, legRadius: "0 0 30% 30%",
  },
  ahtapot: {
    bodyColor: "#ea580c", dark: "#9a3412", light: "#fed7aa", accent: "rgba(234,88,12,.1)",
    headRadius: "50% 50% 45% 45%", headExtra: null,
    torsoRadius: "50% 50% 30% 30%", bellyDecor: "dots",
    armW: .16, armH: .7, armRadius: "50%",
    legW: .16, legH: .28, legGap: .08, legRadius: "0 0 50% 50%",
    extraLegs: true,
  },
  bukalemun: {
    bodyColor: "#0f766e", dark: "#134e4a", light: "#99f6e4", accent: "#ccfbf1",
    headRadius: "45%",
    headExtra: (s) => ({
      _crest: { width: s*.3, height: s*.1, background: "linear-gradient(90deg, #14b8a6, #2dd4bf)", borderRadius: `${s*.06}px ${s*.06}px 0 0`, position: "absolute", top: -s*.04, left: "50%", marginLeft: -s*.15 },
    }),
    torsoRadius: "35% 35% 40% 40%", bellyDecor: "belly",
    armW: .18, armH: .6, armRadius: "35%",
    legW: .24, legH: .2, legGap: .2, legRadius: "0 0 35% 35%",
    tailColor: "#14b8a6",
  },
};

export const GuideCharacter = ({ guide, color, mood = "idle", size = 72, speech, compact, showName = true }) => {
  if (!guide) return null;
  const b = GUIDE_BODIES[guide.type] || GUIDE_BODIES.robot;
  const s = size;
  const headS = s * .5;
  const bodyW = s * .58;
  const bodyH = s * .4;
  const anim = mood === "happy" ? "guideHappy .6s ease"
    : mood === "sad" ? "guideSad .4s ease"
    : "guideBreathe 3s ease-in-out infinite";

  // Head extras (ears, horns, antenna, hat)
  const extras = b.headExtra ? b.headExtra(headS) : {};
  const extraEls = Object.entries(extras).map(([k, st]) => (
    <div key={k} style={{ position: "absolute", ...st }} />
  ));

  // Belly decoration
  const bellyEl = b.bellyDecor === "screen" ? (
    <div style={{ width: bodyW*.45, height: bodyH*.35, borderRadius: 4, background: "rgba(0,0,0,.3)", border: "1px solid rgba(255,255,255,.15)", margin: "0 auto", marginTop: bodyH*.08, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80", animation: "twinkle 1.5s ease infinite" }} />
    </div>
  ) : b.bellyDecor === "belly" ? (
    <div style={{ width: bodyW*.5, height: bodyH*.35, borderRadius: "50%", background: `${b.light}30`, margin: "0 auto", marginTop: bodyH*.08 }} />
  ) : b.bellyDecor === "belt" ? (
    <div style={{ width: bodyW*.8, height: bodyH*.12, borderRadius: 3, background: "#78350f", margin: "0 auto", marginTop: bodyH*.15, boxShadow: "inset 0 1px 0 rgba(255,255,255,.1)" }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", margin: "0 auto", marginTop: -1 }} />
    </div>
  ) : b.bellyDecor === "scale" ? (
    <div style={{ display: "flex", justifyContent: "center", marginTop: bodyH*.1, gap: 2 }}>
      <div style={{ width: bodyW*.15, height: bodyW*.15, borderRadius: "50%", border: `1.5px solid ${b.light}`, background: `${b.light}15` }} />
      <div style={{ width: bodyW*.15, height: bodyW*.15, borderRadius: "50%", border: `1.5px solid ${b.light}`, background: `${b.light}15` }} />
    </div>
  ) : b.bellyDecor === "scales" ? (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1, marginTop: bodyH*.06, padding: "0 2px" }}>
      {[...Array(5)].map((_, i) => <div key={i} style={{ width: 5, height: 4, borderRadius: "0 0 50% 50%", background: `${b.light}35` }} />)}
    </div>
  ) : b.bellyDecor === "dots" ? (
    <div style={{ display: "flex", justifyContent: "center", gap: 3, marginTop: bodyH*.12 }}>
      {[...Array(3)].map((_, i) => <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: `${b.light}50` }} />)}
    </div>
  ) : null;

  // Leg count
  const legCount = b.extraLegs ? 3 : 2;
  const armRotIdle = mood === "happy" ? [-28, 28] : [-10, 10];
  const armAnimL = mood === "happy" ? "guideWave .6s ease" : "none";

  return (
    <div style={{ display: "flex", alignItems: compact ? "center" : "flex-end", gap: compact ? 10 : 14, flexShrink: 0 }}>
      {/* === CHARACTER BODY === */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, animation: anim, position: "relative" }}>

        {/* Head */}
        <div style={{
          width: headS, height: headS,
          borderRadius: b.headRadius,
          background: `radial-gradient(ellipse at 38% 32%, ${b.accent}55, ${b.bodyColor} 65%, ${b.dark})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: headS * .62, lineHeight: 1,
          boxShadow: `0 3px 12px ${b.bodyColor}50, inset 0 2px 8px ${b.light}20, inset 0 -3px 6px ${b.dark}50`,
          border: `2.5px solid ${b.dark}90`,
          position: "relative", zIndex: 3,
        }}>
          {extraEls}
          <span style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,.3))" }}>{guide.emoji}</span>
        </div>

        {/* Torso */}
        <div style={{
          width: bodyW, height: bodyH, marginTop: -headS * .12,
          borderRadius: b.torsoRadius,
          background: `linear-gradient(175deg, ${b.bodyColor}, ${b.dark} 90%)`,
          boxShadow: `0 4px 14px ${b.bodyColor}30, inset 0 2px 0 ${b.light}18, inset 0 -2px 4px ${b.dark}40`,
          border: `2px solid ${b.dark}70`,
          position: "relative", zIndex: 2, overflow: "visible",
        }}>
          {bellyEl}

          {/* Left arm */}
          <div style={{
            position: "absolute", left: -bodyW * b.armW * .6, top: bodyH * .08,
            width: bodyW * b.armW, height: bodyH * b.armH,
            borderRadius: b.armRadius,
            background: `linear-gradient(180deg, ${b.bodyColor}, ${b.dark})`,
            border: `1.5px solid ${b.dark}60`,
            transform: `rotate(${armRotIdle[0]}deg)`, transformOrigin: "top center",
            transition: "transform .3s ease", animation: armAnimL,
            boxShadow: `inset 0 -2px 4px ${b.dark}30`,
          }} />
          {/* Right arm */}
          <div style={{
            position: "absolute", right: -bodyW * b.armW * .6, top: bodyH * .08,
            width: bodyW * b.armW, height: bodyH * b.armH,
            borderRadius: b.armRadius,
            background: `linear-gradient(180deg, ${b.bodyColor}, ${b.dark})`,
            border: `1.5px solid ${b.dark}60`,
            transform: `rotate(${armRotIdle[1]}deg)`, transformOrigin: "top center",
            transition: "transform .3s ease",
            boxShadow: `inset 0 -2px 4px ${b.dark}30`,
          }} />
        </div>

        {/* Tail (cat, chameleon) */}
        {b.tailColor && (
          <div style={{
            position: "absolute", right: -s*.12, bottom: s*.14, width: s*.2, height: s*.08,
            borderRadius: "0 50% 50% 0", background: b.tailColor,
            transform: mood === "happy" ? "rotate(-20deg)" : "rotate(-5deg)",
            transformOrigin: "left center", transition: "transform .3s ease", zIndex: 0,
            boxShadow: `0 2px 4px ${b.dark}30`,
          }} />
        )}

        {/* Legs/Feet */}
        <div style={{ display: "flex", gap: bodyW * (b.legGap || .2), marginTop: -2, zIndex: 1 }}>
          {[...Array(legCount)].map((_, i) => (
            <div key={i} style={{
              width: bodyW * b.legW, height: bodyH * b.legH,
              borderRadius: b.legRadius,
              background: `linear-gradient(180deg, ${b.dark}, ${b.dark}dd)`,
              boxShadow: `0 2px 4px rgba(0,0,0,.2), inset 0 1px 0 ${b.bodyColor}30`,
            }} />
          ))}
        </div>

        {/* Name badge */}
        {showName && (
          <div style={{
            marginTop: 3, padding: "2px 8px", borderRadius: 8,
            background: `${color || b.bodyColor}20`, border: `1px solid ${color || b.bodyColor}30`,
            fontSize: Math.max(9, s * .14), fontWeight: 900, color: b.light,
            textAlign: "center", whiteSpace: "nowrap", letterSpacing: .3,
            backdropFilter: "blur(4px)",
          }}>{guide.name}</div>
        )}
      </div>

      {/* === SPEECH BUBBLE === */}
      {speech && (
        <div style={{ position: "relative", animation: "bubblePop .35s ease both", minWidth: 0, flex: compact ? 1 : "none" }}>
          {/* Tail pointing to character */}
          <div style={{
            position: "absolute", left: -7, top: compact ? "50%" : s * .3,
            marginTop: compact ? -6 : 0,
            width: 0, height: 0,
            borderTop: "7px solid transparent", borderBottom: "7px solid transparent",
            borderRight: "9px solid rgba(30,27,75,.75)",
            filter: "drop-shadow(-2px 0 2px rgba(0,0,0,.1))",
          }} />
          <div style={{
            background: "rgba(30,27,75,.75)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            borderRadius: 16, padding: compact ? "8px 12px" : "10px 16px",
            border: `1.5px solid ${color || b.bodyColor}20`,
            boxShadow: `0 4px 20px rgba(0,0,0,.3), 0 0 24px ${color || b.bodyColor}06`,
            maxWidth: compact ? 220 : 280, lineHeight: 1.5,
          }}>
            <div style={{ fontSize: compact ? 13 : 15, fontWeight: 700, color: "#f1f5f9", textShadow: "0 1px 3px rgba(0,0,0,.3)" }}>{speech}</div>
          </div>
        </div>
      )}
    </div>
  );
};
