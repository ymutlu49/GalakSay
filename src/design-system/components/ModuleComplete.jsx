// GalakSay Pro — 2026-03-20 — Modül tamamlama ekranı + konfeti + ses entegrasyonu + a11y
import React, { useState, useEffect, useRef } from 'react';
import { colors } from '../colors.js';
import { Button } from './Button.jsx';
import { typography } from '../typography.js';
import { SFX } from '../../audio/sfx.js';
import { AudioManager } from '../../audio/AudioManager.js';
import { getMotionSafe } from '../animations.js';

// ═══ YILDIZ BİLEŞENİ ════════════════════════════════════════════════════════
function Star({ filled, index }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600 + index * 300);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <span
      role="img"
      aria-label={filled ? 'Kazanılmış yıldız' : 'Kazanılmamış yıldız'}
      style={{
        display: 'inline-block',
        fontSize: 48,
        filter: filled
          ? 'drop-shadow(0 0 8px rgba(255,217,61,.6))'
          : 'grayscale(1) opacity(.3)',
        transform: visible ? 'scale(1)' : 'scale(0)',
        transition: 'transform 400ms cubic-bezier(.34,1.56,.64,1)',
        willChange: 'transform',
      }}
    >
      {'\u2B50'}
    </span>
  );
}

// ═══ MİNİ KONFETİ ═══════════════════════════════════════════════════════════
// Canvas tabanlı, hafif konfeti efekti — 3 yıldız kazanıldığında tetiklenir
function MiniConfetti({ active }) {
  const canvasRef = useRef(null);
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  useEffect(() => {
    if (!active || reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    const confettiColors = [
      colors.accent.primary, colors.accent.secondary, colors.accent.gold,
      colors.accent.orange, '#EC4899', '#38bdf8',
    ];

    const particles = Array.from({ length: 30 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * W * 0.6,
      y: H * 0.3,
      vx: (Math.random() - 0.5) * 6,
      vy: -Math.random() * 8 - 2,
      size: Math.random() * 6 + 3,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      life: 1,
    }));

    let raf;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx;
        p.vy += 0.15; // gravity
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.life -= 0.008;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  if (!active || reducedMotion) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
}

// ═══ MODÜL TAMAMLAMA EKRANI ═════════════════════════════════════════════════
export function ModuleComplete({
  accuracy = 0,
  duration = '0:00',
  hintAvg = 0,
  streak = 0,
  skills = [],
  badge = null,
  levelUp = null, // { from: 8, to: 9 } — LT düzeyi yükseldiyse
  onNext,
  onReplay,
  onHome,
}) {
  const [entered, setEntered] = useState(false);
  const starCount = accuracy >= 85 && hintAvg < 1 ? 3
    : accuracy >= 70 && hintAvg <= 3 ? 2
    : 1;

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);

    // Ses efektleri — modül tamamlandığında
    if (AudioManager.canPlay('effects')) {
      setTimeout(() => SFX.moduleComplete?.(), 200);
      // Yıldız sesleri — stagger
      setTimeout(() => {
        for (let i = 0; i < starCount; i++) {
          setTimeout(() => SFX.starEarned?.(i), i * 300);
        }
      }, 700);
      // Rozet sesi
      if (badge) {
        setTimeout(() => SFX.badgeEarned?.(), 1600);
      }
      // Seviye atlama sesi
      if (levelUp) {
        setTimeout(() => SFX.levelUp?.(), 1900);
      }
    }

    return () => clearTimeout(t);
  }, []);

  return (
    <div
      role="region"
      aria-label="Modül tamamlama sonuçları"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        gap: 20,
        opacity: entered ? 1 : 0,
        transform: entered ? 'scale(1)' : 'scale(0.9)',
        transition: 'all 500ms ease-out',
        fontFamily: typography.fontFamily.display,
        textAlign: 'center',
        minHeight: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Confetti — 3 yıldız kazanıldığında */}
      <MiniConfetti active={entered && starCount === 3} />

      {/* Parlama efekti giriş */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.accent.gold}15, transparent 70%)`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        animation: entered ? 'pulse 2s ease-in-out infinite' : 'none',
      }} />

      {/* Title */}
      <h2 style={{
        color: colors.text.primary,
        fontSize: 28,
        fontWeight: 900,
        margin: 0,
        position: 'relative',
        zIndex: 1,
      }}>
        {'\u2728'} Modül Tamamlandı! {'\u2728'}
      </h2>

      {/* Stars */}
      <div style={{ display: 'flex', gap: 8, position: 'relative', zIndex: 1 }} aria-label={`${starCount} yıldız kazanıldı`}>
        {[0, 1, 2].map(i => (
          <Star key={i} filled={i < starCount} index={i} />
        ))}
      </div>

      {/* Level up indicator */}
      {levelUp && (
        <div style={{
          padding: '10px 20px',
          borderRadius: 12,
          background: `linear-gradient(135deg, ${colors.accent.primary}20, ${colors.accent.secondary}20)`,
          border: `1px solid ${colors.accent.primary}30`,
          color: colors.accent.secondary,
          fontSize: 16,
          fontWeight: 800,
          animation: 'bounceIn 500ms ease-out 1.8s both',
          position: 'relative',
          zIndex: 1,
        }}>
          {'\uD83D\uDE80'} Yeni Düzey! L{levelUp.from} {'\u2192'} L{levelUp.to}
        </div>
      )}

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        width: '100%',
        maxWidth: 320,
        position: 'relative',
        zIndex: 1,
      }}>
        {[
          { label: 'Doğruluk', value: `%${Math.round(accuracy)}`, color: colors.feedback.success },
          { label: 'Süre', value: duration, color: colors.accent.primary },
          { label: 'İpucu Ort.', value: hintAvg.toFixed(1), color: colors.feedback.hint },
          { label: 'Seri', value: streak, color: colors.accent.gold },
        ].map((s, i) => (
          <div key={i} style={{
            padding: '14px 12px',
            borderRadius: 14,
            background: `${s.color}12`,
            border: `1px solid ${s.color}20`,
            textAlign: 'center',
            animation: `fadeUp 300ms ease-out ${800 + i * 100}ms both`,
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.text.tertiary, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Skills learned */}
      {skills.length > 0 && (
        <div style={{
          width: '100%',
          maxWidth: 320,
          padding: 16,
          borderRadius: 14,
          background: 'rgba(30,27,75,.5)',
          border: '1px solid rgba(148,163,184,.1)',
          animation: 'fadeUp 300ms ease-out 1.2s both',
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.text.secondary, marginBottom: 8 }}>
            Bu modülde öğrendiklerin:
          </div>
          {skills.map((skill, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 0',
              color: skill.mastered ? colors.feedback.success : colors.text.tertiary,
              fontSize: 14,
              fontWeight: 600,
            }}>
              <span>{skill.mastered ? '\u2705' : '\u2B55'}</span>
              <span>{skill.name}</span>
              {!skill.mastered && <span style={{ fontSize: 12, opacity: 0.6 }}>(pratik yap)</span>}
            </div>
          ))}
        </div>
      )}

      {/* Badge earned */}
      {badge && (
        <div style={{
          padding: '16px 24px',
          borderRadius: 16,
          background: `${colors.accent.gold}15`,
          border: `1px solid ${colors.accent.gold}30`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          animation: 'bounceIn 500ms ease-out 1.5s both',
          position: 'relative',
          zIndex: 1,
        }}>
          <span style={{
            fontSize: 36,
            animation: 'crystalRotate 2s ease-in-out 2s both',
          }}>{badge.icon || '\uD83C\uDFC5'}</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.accent.gold }}>Yeni Rozet!</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: colors.text.primary }}>{badge.name}</div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width: '100%',
        maxWidth: 320,
        marginTop: 8,
        position: 'relative',
        zIndex: 1,
        animation: 'fadeUp 300ms ease-out 1.6s both',
      }}>
        <Button variant="primary" size="lg" full glow onClick={onNext} icon={'\u27A1\uFE0F'}>
          Sonraki Modül
        </Button>
        <Button variant="secondary" size="md" full onClick={onReplay} icon={'\u21BB'}>
          Tekrar Oyna
        </Button>
        <Button variant="ghost" size="md" onClick={onHome} icon={'\uD83C\uDFE0'}>
          Ana Menüye Dön
        </Button>
      </div>
    </div>
  );
}
