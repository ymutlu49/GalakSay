// GalakSay Pro — 2026-03-20 — İlk kullanım deneyimi (onboarding) akışı (tipografi DS + a11y + reduced-motion)
import React, { useState, useEffect, useCallback } from 'react';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { spacing, layout } from '../design-system/spacing.js';
import { Button } from '../design-system/components/Button.jsx';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import { getMotionSafe } from '../design-system/animations.js';

// ═══ AVATAR SEÇENEKLERİ ═════════════════════════════════════════════════════
const AVATARS = [
  { id: 'astronaut', emoji: '\uD83E\uDDD1\u200D\uD83D\uDE80', label: 'Astronot' },
  { id: 'alien', emoji: '\uD83D\uDC7D', label: 'Uzaylı' },
  { id: 'robot', emoji: '\uD83E\uDD16', label: 'Robot' },
  { id: 'star', emoji: '\u2B50', label: 'Yıldız' },
  { id: 'rocket', emoji: '\uD83D\uDE80', label: 'Roket' },
  { id: 'planet', emoji: '\uD83E\uDE90', label: 'Gezegen' },
  { id: 'comet', emoji: '\u2604\uFE0F', label: 'Kuyruklu Yıldız' },
  { id: 'moon', emoji: '\uD83C\uDF1D', label: 'Ay' },
];

// ═══ SINIF SEÇENEKLERİ ══════════════════════════════════════════════════════
const GRADES = [
  { value: 'preschool', label: 'Okul Öncesi', age: '4-6' },
  { value: '1', label: '1. Sınıf', age: '6-7' },
  { value: '2', label: '2. Sınıf', age: '7-8' },
  { value: '3', label: '3. Sınıf', age: '8-9' },
  { value: '4', label: '4. Sınıf', age: '9-10' },
];

// ═══ ADIM GÖSTERGESİ ════════════════════════════════════════════════════════
function StepIndicator({ current, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: i === current
              ? colors.accent.primary
              : i < current
                ? colors.accent.secondary
                : 'rgba(255,255,255,.15)',
            transition: 'all 300ms ease',
          }}
        />
      ))}
    </div>
  );
}

// ═══ ADIM 1 — HOŞ GELDİN ═══════════════════════════════════════════════════
function StepWelcome({ onNext, onSkip }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      padding: '40px 24px',
      opacity: entered ? 1 : 0,
      transform: entered ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 500ms ease-out',
    }}>
      <div style={{
        fontSize: 80,
        animation: 'float 3s ease-in-out infinite',
      }}>
        {'\uD83D\uDE80'}
      </div>
      <h1 style={{
        fontSize: 32,
        fontWeight: 900,
        color: colors.text.primary,
        margin: 0,
        textAlign: 'center',
        fontFamily: typography.fontFamily.display,
      }}>
        Merhaba Uzay Kaşifi!
      </h1>
      <p style={{
        fontSize: 18,
        color: colors.text.secondary,
        textAlign: 'center',
        maxWidth: 300,
        lineHeight: 1.6,
        margin: 0,
        fontFamily: typography.fontFamily.display,
      }}>
        Ben <strong style={{ color: colors.accent.primary }}>Galak</strong>, senin uzay rehberin! Birlikte matematik galaksisini keşfedeceğiz.
      </p>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
        <Button variant="primary" size="xl" full glow onClick={onNext}>
          Hadi Başlayalım!
        </Button>
        <Button variant="ghost" size="sm" onClick={onSkip}>
          Atla
        </Button>
      </div>
    </div>
  );
}

// ═══ ADIM 2 — PROFİL OLUŞTURMA ═════════════════════════════════════════════
function StepProfile({ name, setName, avatar, setAvatar, grade, setGrade, onNext }) {
  const [showNameWarning, setShowNameWarning] = React.useState(false);

  const handleNext = () => {
    if (!name.trim()) {
      setShowNameWarning(true);
      // Input'a fokusla
      const inp = document.querySelector('input[placeholder="Adını yaz..."]');
      if (inp) { inp.focus(); inp.style.borderColor = '#ef4444'; }
      return;
    }
    onNext();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
      padding: '24px 20px',
      animation: 'fadeUp 400ms ease-out both',
      fontFamily: typography.fontFamily.display,
    }}>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: colors.text.primary, margin: 0 }}>
        Seni Tanıyalım!
      </h2>

      {/* İsim girişi */}
      <div style={{ width: '100%', maxWidth: 320 }}>
        <label style={{ fontSize: 14, fontWeight: 700, color: colors.text.secondary, marginBottom: 6, display: 'block' }}>
          Adın
        </label>
        <input
          type="text"
          value={name}
          placeholder="Adını yaz..."
          maxLength={20}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 14,
            border: `2px solid ${showNameWarning ? '#ef4444' : name ? colors.accent.primary + '40' : colors.surface.divider}`,
            background: colors.surface.input,
            color: colors.text.primary,
            fontSize: 20,
            fontWeight: 700,
            fontFamily: typography.fontFamily.display,
            outline: 'none',
            transition: 'border-color 200ms',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => e.target.style.borderColor = colors.accent.primary}
          onBlur={(e) => e.target.style.borderColor = name ? colors.accent.primary + '40' : colors.surface.divider}
          onChange={(e) => { setName(e.target.value); if (e.target.value.trim()) setShowNameWarning(false); }}
        />
        {showNameWarning && (
          <div style={{
            marginTop: 6,
            fontSize: 13,
            fontWeight: 600,
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            animation: 'fadeUp 300ms ease-out',
          }}>
            ⚠️ Lütfen adını yaz
          </div>
        )}
      </div>

      {/* Avatar seçimi */}
      <div style={{ width: '100%', maxWidth: 320 }}>
        <label style={{ fontSize: 14, fontWeight: 700, color: colors.text.secondary, marginBottom: 8, display: 'block' }}>
          Avatarını Seç
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
        }}>
          {AVATARS.map(a => (
            <button
              key={a.id}
              onClick={() => setAvatar(a.id)}
              aria-label={a.label}
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: 16,
                border: avatar === a.id
                  ? `3px solid ${colors.accent.primary}`
                  : '2px solid rgba(148,163,184,.12)',
                background: avatar === a.id
                  ? `${colors.accent.primary}15`
                  : 'rgba(30,27,75,.4)',
                cursor: 'pointer',
                fontSize: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms ease',
                transform: avatar === a.id ? 'scale(1.05)' : 'scale(1)',
                boxShadow: avatar === a.id
                  ? `0 0 16px ${colors.accent.primary}30`
                  : 'none',
              }}
            >
              {a.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Sınıf seçimi */}
      <div style={{ width: '100%', maxWidth: 320 }}>
        <label style={{ fontSize: 14, fontWeight: 700, color: colors.text.secondary, marginBottom: 8, display: 'block' }}>
          Sınıfın
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {GRADES.map(g => (
            <button
              key={g.value}
              onClick={() => setGrade(g.value)}
              aria-label={`${g.label} (${g.age})`}
              aria-pressed={grade === g.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 12,
                border: grade === g.value
                  ? `2px solid ${colors.accent.primary}`
                  : '1px solid rgba(148,163,184,.1)',
                background: grade === g.value
                  ? `${colors.accent.primary}12`
                  : 'rgba(30,27,75,.3)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              <span style={{
                fontSize: 16,
                fontWeight: 700,
                color: grade === g.value ? colors.accent.primary : colors.text.primary,
                fontFamily: typography.fontFamily.display,
              }}>
                {g.label}
              </span>
              <span style={{ fontSize: 12, color: colors.text.tertiary }}>
                ({g.age} yaş)
              </span>
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        full
        onClick={handleNext}
        style={{ maxWidth: 320, marginTop: 8 }}
      >
        İleri {'\u2192'}
      </Button>
    </div>
  );
}

// ═══ ADIM 3 — NuMap BAĞLANTISI ═════════════════════════════════════════════
function StepNuMap({ onConnect, onSkip }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      padding: '40px 24px',
      animation: 'fadeUp 400ms ease-out both',
      fontFamily: typography.fontFamily.display,
    }}>
      <div style={{ fontSize: 64 }}>{'\uD83D\uDDFA\uFE0F'}</div>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: colors.text.primary, margin: 0, textAlign: 'center' }}>
        NuMap Testi Yaptın mı?
      </h2>
      <p style={{
        fontSize: 16,
        color: colors.text.secondary,
        textAlign: 'center',
        maxWidth: 300,
        lineHeight: 1.5,
        margin: 0,
      }}>
        NuMap profilini bağlayarak sana özel bir öğrenme yolculuğu oluşturabiliriz.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280, marginTop: 8 }}>
        <Button variant="primary" size="lg" full onClick={onConnect}>
          Evet, Bağla
        </Button>
        <Button variant="secondary" size="lg" full onClick={onSkip}>
          Hayır, Atla
        </Button>
      </div>
    </div>
  );
}

// ═══ ADIM 4 — NASIL OYNANIR (İnteraktif Mini Demo) ═════════════════════════
function StepHowToPlay({ onNext }) {
  const [demoStep, setDemoStep] = useState(0);
  const [dragged, setDragged] = useState(false);
  const [counted, setCounted] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  const demos = [
    {
      instruction: 'Kapsülleri sürükleyebilirsin!',
      emoji: '\uD83D\uDD35',
      content: (
        <div style={{ position: 'relative', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!dragged ? (
            <div
              onClick={() => setDragged(true)}
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: colors.gradient.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                cursor: 'pointer',
                animation: 'float 2s ease-in-out infinite',
                boxShadow: `0 0 20px ${colors.accent.primary}40`,
              }}
            >
              {'\uD83D\uDD35'}
            </div>
          ) : (
            <div style={{
              fontSize: 36,
              animation: 'bounceIn 400ms ease-out',
              color: colors.feedback.success,
            }}>
              {'\u2705'} Harika!
            </div>
          )}
        </div>
      ),
    },
    {
      instruction: 'Yıldız taşlarına dokunarak say!',
      emoji: '\uD83E\uDE99',
      content: (
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', height: 120, alignItems: 'center' }}>
          {[1, 2, 3].map(n => (
            <button
              key={n}
              onClick={() => setCounted(c => Math.min(c + 1, 3))}
              disabled={counted >= n}
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                border: 'none',
                background: counted >= n
                  ? colors.gradient.success
                  : colors.gradient.gold,
                fontSize: 24,
                fontWeight: 900,
                color: counted >= n ? '#fff' : colors.text.inverse,
                cursor: counted >= n ? 'default' : 'pointer',
                transition: 'all 200ms ease',
                transform: counted >= n ? 'scale(0.9)' : 'scale(1)',
                fontFamily: typography.fontFamily.display,
              }}
            >
              {counted >= n ? n : '\uD83E\uDE99'}
            </button>
          ))}
        </div>
      ),
    },
    {
      instruction: 'İpucu isteyebilirsin!',
      emoji: '\uD83D\uDEF8',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, height: 120, justifyContent: 'center' }}>
          {!hintUsed ? (
            <button
              onClick={() => setHintUsed(true)}
              style={{
                padding: '14px 28px',
                borderRadius: 16,
                border: `2px solid ${colors.feedback.hint}`,
                background: `${colors.feedback.hint}15`,
                color: colors.feedback.hint,
                fontSize: 18,
                fontWeight: 800,
                cursor: 'pointer',
                animation: 'pulse 1.5s ease-in-out infinite',
                fontFamily: typography.fontFamily.display,
              }}
            >
              {'\uD83D\uDEF8'} İpucu İste
            </button>
          ) : (
            <div style={{
              padding: '14px 24px',
              borderRadius: 14,
              background: `${colors.feedback.hint}15`,
              border: `1px solid ${colors.feedback.hint}30`,
              color: colors.feedback.hint,
              fontSize: 16,
              fontWeight: 700,
              animation: 'fadeUp 300ms ease-out',
              fontFamily: typography.fontFamily.display,
            }}>
              {'\uD83D\uDCA1'} İpucu: Sayıları sırayla say!
            </div>
          )}
        </div>
      ),
    },
  ];

  const currentDemo = demos[demoStep];
  const allDone = demoStep >= demos.length;

  if (allDone) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        padding: '40px 24px',
        animation: 'fadeUp 400ms ease-out both',
        fontFamily: typography.fontFamily.display,
      }}>
        <div style={{ fontSize: 72, animation: 'bounceIn 500ms ease-out' }}>{'\uD83C\uDF1F'}</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: colors.text.primary, margin: 0 }}>
          Hazır mısın?
        </h2>
        <p style={{ fontSize: 16, color: colors.text.secondary, textAlign: 'center', maxWidth: 280, margin: 0 }}>
          Matematik galaksisini keşfetmeye başlayalım!
        </p>
        <Button variant="primary" size="xl" glow onClick={onNext} style={{ marginTop: 12 }}>
          {'\uD83D\uDE80'} Haydi Başlayalım!
        </Button>
      </div>
    );
  }

  const canAdvance = (demoStep === 0 && dragged) || (demoStep === 1 && counted >= 3) || (demoStep === 2 && hintUsed);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20,
      padding: '40px 24px',
      animation: 'fadeUp 400ms ease-out both',
      fontFamily: typography.fontFamily.display,
    }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: colors.text.primary, margin: 0, textAlign: 'center' }}>
        {currentDemo.instruction}
      </h2>

      {currentDemo.content}

      {canAdvance && (
        <Button
          variant="success"
          size="lg"
          onClick={() => setDemoStep(d => d + 1)}
          style={{ animation: 'fadeUp 300ms ease-out' }}
        >
          İleri {'\u2192'}
        </Button>
      )}

      <div style={{ fontSize: 13, color: colors.text.disabled }}>
        Demo {demoStep + 1} / {demos.length}
      </div>
    </div>
  );
}

// ═══ ANA ONBOARDING BİLEŞENİ ════════════════════════════════════════════════
export function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('astronaut');
  const [grade, setGrade] = useState('1');

  const totalSteps = 4; // welcome, profile, numap, howtoplay

  const handleSkip = useCallback(() => {
    // Varsayılan profil oluştur ve devam et
    const profile = { name: name || 'Uzay Kaşifi', avatar, grade };
    try { localStorage.setItem('galaksay_profile', JSON.stringify(profile)); } catch {}
    try { localStorage.setItem('galaksay_onboarding_done', 'true'); } catch {}
    onComplete?.(profile);
  }, [name, avatar, grade, onComplete]);

  const handleProfileNext = useCallback(() => {
    const profile = { name: name.trim() || 'Uzay Kaşifi', avatar, grade };
    try { localStorage.setItem('galaksay_profile', JSON.stringify(profile)); } catch {}
    setStep(2);
  }, [name, avatar, grade]);

  const handleComplete = useCallback(() => {
    try { localStorage.setItem('galaksay_onboarding_done', 'true'); } catch {}
    const profile = { name: name.trim() || 'Uzay Kaşifi', avatar, grade };
    onComplete?.(profile);
  }, [name, avatar, grade, onComplete]);

  const steps = [
    <StepWelcome key="welcome" onNext={() => setStep(1)} onSkip={handleSkip} />,
    <StepProfile key="profile"
      name={name} setName={setName}
      avatar={avatar} setAvatar={setAvatar}
      grade={grade} setGrade={setGrade}
      onNext={handleProfileNext}
    />,
    <StepNuMap key="numap"
      onConnect={() => setStep(3)} // TODO: NuMap bağlantı akışı
      onSkip={() => setStep(3)}
    />,
    <StepHowToPlay key="howto" onNext={handleComplete} />,
  ];

  const motionSafe = getMotionSafe('fadeUp 350ms ease-out', 'fadeIn 200ms ease-out');

  return (
    <div
      role="region"
      aria-label="Hoş geldin kurulumu"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
        display: 'flex',
        flexDirection: 'column',
        background: colors.gradient.background,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <SpaceBackground starCount={40} showMeteors={false} />

      {/* Adım göstergesi */}
      <div style={{ paddingTop: 40, position: 'relative', zIndex: 1 }}
        role="navigation" aria-label={`Adım ${step + 1} / ${totalSteps}`}>
        <StepIndicator current={step} total={totalSteps} />
      </div>

      {/* İçerik — adımlar arası geçiş animasyonu (crossfade + slide) */}
      <div
        key={step}
        aria-live="polite"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'safe center',
          position: 'relative',
          zIndex: 1,
          animation: motionSafe,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {steps[step]}
      </div>

      {/* Alt navigasyon yardımcısı — geri butonu (2. adımdan itibaren) */}
      {step > 0 && step < totalSteps && (
        <div style={{
          position: 'relative',
          zIndex: 1,
          padding: '0 24px 24px',
          textAlign: 'center',
        }}>
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            style={{
              padding: '8px 20px',
              borderRadius: 12,
              border: 'none',
              background: 'transparent',
              color: colors.text.tertiary,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: typography.fontFamily.display,
              cursor: 'pointer',
            }}
          >
            {'\u2190'} Geri
          </button>
        </div>
      )}
    </div>
  );
}
