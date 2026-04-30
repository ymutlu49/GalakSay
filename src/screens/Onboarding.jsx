// GalakSay Pro — 2026-03-20 — İlk kullanım deneyimi (onboarding) akışı (tipografi DS + a11y + reduced-motion)
import React, { useState, useEffect, useCallback } from 'react';
import { colors, C } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { spacing, layout } from '../design-system/spacing.js';
import { Button } from '../design-system/components/Button.jsx';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import { getMotionSafe } from '../design-system/animations.js';
import { setEncrypted } from '../utils/crypto.js';

const PROFILE_KEY = 'galaksay_profile';

async function persistProfile(profile) {
  try { await setEncrypted(PROFILE_KEY, profile); } catch {}
}

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
// 2026-04-30: Renk + görsel yenilemesi (kullanıcı geri bildirimi: "renkler iç açıcı değil")
// Gerçek oyunla aynı parlak palet (mor / altın / mint), glow efektleri, gradient yıldız taşları,
// büyük punto, dokunsal animasyonlar.
function StepHowToPlay({ onNext }) {
  const [demoStep, setDemoStep] = useState(0);
  const [dragged, setDragged] = useState(false);
  const [counted, setCounted] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  // Yıldız taşı görseli — gerçek oyun chip'iyle aynı look (gradient küre + parlaklık)
  const StarStone = ({ size = 64, color = '#3b82f6', glow = true, label = null }) => (
    <div style={{
      position: 'relative', width: size, height: size, borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 25%, ' + color + 'ee 0%, ' + color + ' 45%, ' + color + 'cc 100%)',
      boxShadow: glow
        ? '0 0 24px ' + color + '80, 0 4px 12px rgba(0,0,0,.3), inset 0 -3px 6px rgba(0,0,0,.25), inset 0 3px 6px rgba(255,255,255,.4)'
        : '0 4px 10px rgba(0,0,0,.25), inset 0 -2px 4px rgba(0,0,0,.2), inset 0 2px 4px rgba(255,255,255,.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: '15%', left: '22%',
        width: size * 0.22, height: size * 0.22, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,.85), rgba(255,255,255,0))',
        filter: 'blur(1px)', pointerEvents: 'none',
      }} />
      {label != null && label !== '' && (
        <span style={{
          fontSize: size * 0.4, fontWeight: 900, color: '#fff',
          textShadow: '0 2px 4px rgba(0,0,0,.5)',
          fontFamily: typography.fontFamily.display,
          position: 'relative', zIndex: 1,
        }}>{label}</span>
      )}
    </div>
  );

  const demos = [
    {
      instruction: 'Yıldız taşına dokun!',
      emoji: '\uD83D\uDC8E',
      content: (
        <div style={{ position: 'relative', height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {!dragged && (
            <>
              <div style={{
                position: 'absolute', width: 150, height: 150, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(167,139,250,.28), transparent 65%)',
                animation: 'pulse 2s ease-in-out infinite', filter: 'blur(8px)',
              }} />
              <div style={{
                position: 'absolute', width: 116, height: 116, borderRadius: '50%',
                border: '2px dashed rgba(167,139,250,.45)',
                animation: 'spin 8s linear infinite',
              }} />
            </>
          )}
          {!dragged ? (
            <button
              onClick={() => setDragged(true)}
              aria-label="Yıldız taşına dokun"
              style={{
                position: 'relative', zIndex: 2,
                border: 'none', background: 'transparent', cursor: 'pointer',
                padding: 0, animation: 'float 2.4s ease-in-out infinite',
              }}
            >
              <StarStone size={80} color={C.brandPurple} glow />
              <div style={{
                position: 'absolute', bottom: -32, left: '50%', transform: 'translateX(-50%)',
                fontSize: 14, fontWeight: 800, color: '#c4b5fd', letterSpacing: 0.6,
                whiteSpace: 'nowrap', textShadow: '0 1px 4px rgba(0,0,0,.6)',
              }}>👆 Dokun</div>
            </button>
          ) : (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              animation: 'bounceIn 500ms cubic-bezier(.34,1.56,.64,1)',
            }}>
              <div style={{ position: 'relative' }}>
                <StarStone size={80} color={C.correct} glow />
                {[0, 60, 120, 180, 240, 300].map(deg => (
                  <div key={deg} style={{
                    position: 'absolute', top: '50%', left: '50%',
                    width: 4, height: 28, marginLeft: -2, marginTop: -14,
                    background: 'linear-gradient(180deg, #fbbf24, transparent)',
                    transformOrigin: 'center 14px',
                    transform: 'rotate(' + deg + 'deg) translateY(-50px)',
                  }} />
                ))}
              </div>
              <div style={{
                fontSize: 22, fontWeight: 900, color: '#34d399',
                textShadow: '0 2px 8px rgba(52,211,153,.5)',
                fontFamily: typography.fontFamily.display,
              }}>✨ Harika!</div>
            </div>
          )}
        </div>
      ),
    },
    {
      instruction: 'Yıldız taşlarını sırayla say!',
      emoji: '\uD83D\uDD22',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, height: 170, justifyContent: 'center' }}>
          <div style={{
            display: 'flex', gap: 8, padding: '14px 18px', borderRadius: 18,
            background: 'linear-gradient(135deg, rgba(245,158,11,.18), rgba(120,53,15,.28))',
            border: '3px solid #d97706',
            boxShadow: '0 6px 20px rgba(217,119,6,.3), inset 0 2px 6px rgba(0,0,0,.3), inset 0 -2px 4px rgba(255,255,255,.1)',
          }}>
            {[1, 2, 3].map(n => {
              const isRevealed = counted >= n;
              const isNext = counted === n - 1;
              return (
                <button
                  key={n}
                  onClick={() => setCounted(c => Math.min(c + 1, 3))}
                  disabled={isRevealed || !isNext}
                  aria-label={n + '. yıldız taşı'}
                  style={{
                    width: 52, height: 52, padding: 0, border: 'none',
                    borderRadius: '50%', background: 'transparent',
                    cursor: isNext ? 'pointer' : 'default',
                    animation: isNext ? 'pulse 1.4s ease-in-out infinite' : 'none',
                    transition: 'transform 300ms cubic-bezier(.34,1.56,.64,1)',
                    transform: isRevealed ? 'scale(1)' : isNext ? 'scale(1.05)' : 'scale(.92)',
                  }}
                >
                  <StarStone
                    size={52}
                    color={isRevealed ? C.correct : (isNext ? C.brandPurple : '#475569')}
                    glow={isRevealed || isNext}
                    label={isRevealed ? n : ''}
                  />
                </button>
              );
            })}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 12,
            background: 'rgba(15,23,42,.55)', border: '1.5px solid rgba(167,139,250,.35)',
          }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#c4b5fd' }}>Saydığın:</span>
            <span style={{
              fontSize: 24, fontWeight: 900,
              color: counted === 3 ? '#34d399' : '#fbbf24',
              fontFamily: typography.fontFamily.display,
              minWidth: 24, textAlign: 'center',
              transition: 'color 300ms ease',
              textShadow: counted === 3 ? '0 2px 8px rgba(52,211,153,.5)' : '0 2px 8px rgba(251,191,36,.4)',
            }}>{counted}</span>
            {counted === 3 && (
              <span style={{ fontSize: 18, marginLeft: 4, animation: 'bounceIn 500ms ease' }}>✨</span>
            )}
          </div>
        </div>
      ),
    },
    {
      instruction: 'Takıldığında ipucu iste!',
      emoji: '\uD83D\uDCA1',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, height: 170, justifyContent: 'center' }}>
          {!hintUsed ? (
            <button
              onClick={() => setHintUsed(true)}
              aria-label="İpucu iste"
              style={{
                position: 'relative',
                padding: '16px 32px', borderRadius: 18,
                border: '2px solid #fbbf24',
                background: 'linear-gradient(135deg, rgba(251,191,36,.22), rgba(245,158,11,.14))',
                color: '#fde68a',
                fontSize: 18, fontWeight: 900,
                cursor: 'pointer',
                animation: 'pulse 1.5s ease-in-out infinite',
                fontFamily: typography.fontFamily.display,
                boxShadow: '0 6px 22px rgba(251,191,36,.3), inset 0 1px 0 rgba(255,255,255,.2)',
                display: 'flex', alignItems: 'center', gap: 10,
                textShadow: '0 1px 4px rgba(0,0,0,.4)',
              }}
            >
              <span style={{ fontSize: 26 }}>💡</span>
              <span>İpucu İste</span>
            </button>
          ) : (
            <div style={{
              maxWidth: 290, padding: '16px 20px', borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(251,191,36,.2), rgba(245,158,11,.12))',
              border: '2px solid rgba(251,191,36,.55)',
              color: '#fef3c7',
              fontSize: 15, fontWeight: 700,
              textAlign: 'left',
              animation: 'fadeUp 350ms ease-out',
              fontFamily: typography.fontFamily.display,
              boxShadow: '0 6px 18px rgba(251,191,36,.22)',
              display: 'flex', alignItems: 'center', gap: 12,
              lineHeight: 1.45,
            }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>💡</span>
              <span>
                <strong style={{ color: '#fbbf24' }}>İpucu:</strong> Yıldız taşlarına sırayla dokunarak say!
              </span>
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
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 22, padding: '40px 24px',
        animation: 'fadeUp 400ms ease-out both',
        fontFamily: typography.fontFamily.display,
      }}>
        {/* Konfeti yıldızlar arka plan */}
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: ((i * 31 + 7) % 100) + '%',
            top: ((i * 23 + 13) % 60) + '%',
            fontSize: 14 + (i % 3) * 6,
            opacity: 0.6,
            animation: 'starTwinkle ' + (2 + (i % 3)) + 's ease-in-out ' + (i * 0.2) + 's infinite',
            pointerEvents: 'none',
          }}>{['✨', '⭐', '💫'][i % 3]}</div>
        ))}
        <div style={{
          fontSize: 84, animation: 'bounceIn 500ms ease-out',
          filter: 'drop-shadow(0 0 24px rgba(251,191,36,.6))',
        }}>{'🌟'}</div>
        <h2 style={{
          fontSize: 32, fontWeight: 900, margin: 0,
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fde68a 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center', letterSpacing: 0.5,
        }}>
          Hazır mısın?
        </h2>
        <p style={{
          fontSize: 17, color: '#cbd5e1', textAlign: 'center',
          maxWidth: 300, margin: 0, lineHeight: 1.5,
        }}>
          Matematik galaksisini keşfetmeye başlayalım!
        </p>
        <Button variant="primary" size="xl" glow onClick={onNext} style={{ marginTop: 14 }}>
          {'🚀'} Hadi Başlayalım!
        </Button>
      </div>
    );
  }

  const canAdvance = (demoStep === 0 && dragged) || (demoStep === 1 && counted >= 3) || (demoStep === 2 && hintUsed);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 22,
      padding: '32px 24px',
      animation: 'fadeUp 400ms ease-out both',
      fontFamily: typography.fontFamily.display,
    }}>
      {/* Başlık + emoji ikonu — daha vurgulu */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 44, animation: 'float 3s ease-in-out infinite' }}>
          {currentDemo.emoji}
        </div>
        <h2 style={{
          fontSize: 24, fontWeight: 900, margin: 0, textAlign: 'center',
          color: '#fff', textShadow: '0 2px 12px rgba(167,139,250,.4)',
          letterSpacing: 0.3,
        }}>
          {currentDemo.instruction}
        </h2>
      </div>

      {currentDemo.content}

      {canAdvance && (
        <Button
          variant="success"
          size="lg"
          onClick={() => setDemoStep(d => d + 1)}
          style={{ animation: 'fadeUp 300ms ease-out', marginTop: 4 }}
        >
          İleri {'→'}
        </Button>
      )}

      {/* Demo ilerleme göstergesi — büyük noktalar + sayı, daha belirgin */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {demos.map((_, i) => (
            <div key={i} style={{
              width: i === demoStep ? 28 : 9,
              height: 9, borderRadius: 5,
              background: i === demoStep ? colors.accent.primary
                : i < demoStep ? colors.feedback.success
                : 'rgba(255,255,255,.18)',
              transition: 'all 300ms ease',
              boxShadow: i === demoStep ? '0 0 8px ' + colors.accent.primary + '80' : 'none',
            }} />
          ))}
        </div>
        <span style={{
          fontSize: 12, fontWeight: 700, color: '#a78bfa',
          letterSpacing: 0.5,
        }}>
          {demoStep + 1} / {demos.length}
        </span>
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
    const profile = { name: name || 'Uzay Kaşifi', avatar, grade };
    persistProfile(profile);
    try { localStorage.setItem('galaksay_onboarding_done', 'true'); } catch {}
    onComplete?.(profile);
  }, [name, avatar, grade, onComplete]);

  const handleProfileNext = useCallback(() => {
    const profile = { name: name.trim() || 'Uzay Kaşifi', avatar, grade };
    persistProfile(profile);
    setStep(2);
  }, [name, avatar, grade]);

  const handleComplete = useCallback(() => {
    try { localStorage.setItem('galaksay_onboarding_done', 'true'); } catch {}
    const profile = { name: name.trim() || 'Uzay Kaşifi', avatar, grade };
    persistProfile(profile);
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
