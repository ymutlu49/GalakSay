// GalakSay — Öğrenci girişi (çocuğun kendi self-login ekranı).
//
// Çocuk kendi profil kartına dokunur → (varsa) 4-haneli PIN girer → oyununa
// KALDIĞI YERDEN devam eder. Çocuk-dostu: büyük avatar kartları, süzgeç yok,
// dokunmatik numara tuş takımı. Profiller cihaz-yereldir (localProfiles).

import React, { useState, useEffect, useCallback } from 'react';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import { Button } from '../design-system/components/Button.jsx';
import { EmptyState } from '../design-system/components/EmptyState.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { layout } from '../design-system/spacing.js';
import { listChildren, verifyPin, hasPin, touchChild, getResumeInfo } from '../services/localProfiles.js';

const F = typography.fontFamily.display;

// Ön-okur ses desteği (PBS KIDS / NN/g kids-cognition pratiği): bu ekranı kullanan
// çocukların bir kısmı OKUYAMAZ — seçim sesle de teyit edilmeli. Oyun-içi TTS
// altyapısı GalakSay.jsx'e gömülü; burada hafif speechSynthesis yeterli.
function speak(text) {
  try {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'tr-TR';
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  } catch { /* ses desteklenmiyorsa sessiz devam */ }
}

// ── 4-haneli PIN tuş takımı (modal) ──────────────────────────────────────────
function PinPad({ child, onSuccess, onCancel }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const submit = useCallback(
    async (value) => {
      if (await verifyPin(child.ns, value)) {
        onSuccess();
      } else {
        setError(true);
        // Görsel shake'e dokunsal+sesli eşlik: okuyamayan çocuk hatayı ANINDA anlar
        try { navigator.vibrate?.(120); } catch { /* desteklenmiyor */ }
        speak('Olmadı, tekrar dene!');
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 600);
      }
    },
    [child, onSuccess],
  );

  const press = useCallback(
    (d) => {
      setPin((p) => {
        if (p.length >= 4) return p;
        const next = p + d;
        if (next.length === 4) setTimeout(() => submit(next), 120);
        return next;
      });
    },
    [submit],
  );

  const back = useCallback(() => setPin((p) => p.slice(0, -1)), []);

  // Klavye desteği (erişilebilirlik).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key >= '0' && e.key <= '9') press(e.key);
      else if (e.key === 'Backspace') back();
      else if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [press, back, onCancel]);

  const keyBtn = (label, onClick, opts = {}) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      aria-label={opts.aria || String(label)}
      style={{
        height: 62,
        borderRadius: layout.borderRadius.lg,
        border: `1px solid ${colors.surface.divider}`,
        background: opts.ghost ? 'transparent' : 'rgba(255,255,255,.06)',
        color: colors.text.primary,
        fontSize: 26,
        fontWeight: 800,
        fontFamily: F,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
        background: 'rgba(8,7,28,.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 320,
          background: 'rgba(30,27,75,.95)',
          border: '1px solid rgba(148,163,184,.16)',
          borderRadius: layout.borderRadius.xl,
          boxShadow: '0 12px 40px rgba(0,0,0,.5)',
          padding: 26,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 46, lineHeight: 1, marginBottom: 6 }}>{child.avatar || '🚀'}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: colors.text.primary, fontFamily: F, marginBottom: 2 }}>
          {child.name}
        </div>
        <div style={{ fontSize: 13, color: colors.text.secondary, fontFamily: F, marginBottom: 18 }}>
          Şifreni gir 🔒
        </div>

        {/* PIN noktaları */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 14,
            marginBottom: 20,
            animation: error ? 'shake .4s ease' : 'none',
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: error
                  ? colors.feedback.error
                  : i < pin.length
                    ? colors.accent.primaryLight
                    : 'transparent',
                border: `2px solid ${error ? colors.feedback.error : colors.surface.divider}`,
                transition: 'background .15s ease',
              }}
            />
          ))}
        </div>

        {/* Tuş takımı */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => keyBtn(d, () => press(d)))}
          {keyBtn('⌫', back, { ghost: true, aria: 'Sil' })}
          {keyBtn('0', () => press('0'))}
          {keyBtn('✕', onCancel, { ghost: true, aria: 'Vazgeç' })}
        </div>
      </div>
    </div>
  );
}

// ── Öğrenci kartı ─────────────────────────────────────────────────────────────
function StudentCard({ child, onClick }) {
  const resume = getResumeInfo(child.ns);
  return (
    <button
      type="button"
      onClick={onClick}
      className="space-btn-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '20px 10px 16px',
        borderRadius: layout.borderRadius.lg,
        border: `1px solid ${colors.surface.divider}`,
        background: 'rgba(30,27,75,.55)',
        boxShadow: '0 2px 12px rgba(0,0,0,.22)',
        cursor: 'pointer',
        fontFamily: F,
        transition: 'transform .15s ease, box-shadow .15s ease',
      }}
    >
      <div
        style={{
          fontSize: 44,
          width: 78,
          height: 78,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: 'rgba(108,99,255,.15)',
          lineHeight: 1,
        }}
      >
        {child.avatar || '🚀'}
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: colors.text.primary,
          maxWidth: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {child.name}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: resume?.hasProgress ? colors.accent.primaryLight : colors.text.tertiary }}>
        {resume?.hasProgress ? `▶ Devam et · ⭐ ${resume.stars}` : 'Yeni başla'}
        {hasPin(child.ns) ? '  🔒' : ''}
      </div>
    </button>
  );
}

export default function StudentPicker({ onPick, onBack, onManage }) {
  const [children, setChildren] = useState(() => listChildren());
  const [pinFor, setPinFor] = useState(null); // PIN istenen çocuk | null

  const choose = useCallback(
    (child) => {
      // Sesli teyit: çocuk doğru profile dokunduğunu adıyla duyar (ön-okur desteği)
      speak(hasPin(child.ns) ? `Merhaba ${child.name}! Şifreni gir.` : `Merhaba ${child.name}!`);
      if (hasPin(child.ns)) {
        setPinFor(child);
      } else {
        touchChild(child.ns);
        onPick?.(child);
      }
    },
    [onPick],
  );

  const pinSuccess = useCallback(() => {
    const child = pinFor;
    setPinFor(null);
    if (child) {
      touchChild(child.ns);
      onPick?.(child);
    }
  }, [pinFor, onPick]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: colors.gradient.backgroundKids, padding: '20px 16px', boxSizing: 'border-box', overflowY: 'auto' }}>
      <SpaceBackground starCount={36} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
        {/* Üst bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Button variant="ghost" size="sm" onClick={onBack}>← Geri</Button>
          <Button variant="ghost" size="sm" onClick={onManage}>👩‍🏫 Öğretmen</Button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 46, marginBottom: 6, lineHeight: 1 }}>🧒</div>
          <h1 style={{ fontSize: 25, fontWeight: 800, color: colors.text.primary, fontFamily: F, margin: '0 0 4px' }}>
            Kim oynuyor?
          </h1>
          <p style={{ fontSize: 14, color: colors.text.secondary, fontFamily: F, margin: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Kendi resmine dokun
            {/* Ön-okur: yönergeyi sesli dinleme — büyük dokunma hedefi */}
            <button
              type="button"
              onClick={() => speak('Kendi resmine dokun!')}
              aria-label="Yönergeyi sesli dinle"
              style={{ border: 'none', background: 'rgba(108,99,255,.18)', borderRadius: 999, width: 34, height: 34, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
            >🔊</button>
          </p>
        </div>

        {children.length === 0 ? (
          <EmptyState
            icon="🧒"
            title="Henüz profil yok"
            description="Öğretmenin 'Öğretmen' düğmesinden yeni bir öğrenci ekleyebilir."
            actionLabel="👩‍🏫 Öğretmen Girişi"
            onAction={onManage}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
            {children.map((c) => (
              <StudentCard key={c.ns} child={c} onClick={() => choose(c)} />
            ))}
          </div>
        )}
      </div>

      {pinFor && <PinPad child={pinFor} onSuccess={pinSuccess} onCancel={() => setPinFor(null)} />}
    </div>
  );
}
