// GalakSay — Kaptan seçimi ("Kim oynuyor?").
//
// Çocuk kendi kartına dokunur → (PIN varsa) 4 haneli şifre → oyununa KALDIĞI
// YERDEN devam eder. "➕ Yeni Kaptan" kartı her zaman görünür: yeni bir çocuk
// öğretmen beklemeden kendi kaptanını oluşturur. Profiller cihaz-yereldir.

import { useState, useEffect, useCallback, useMemo } from 'react';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { layout } from '../design-system/spacing.js';
import { listChildren, verifyPin, hasPin, touchChild, getResumeInfo } from '../services/localProfiles.js';
import { entryStrings, readEntryLang } from './entryStrings.js';
import { speak } from '../utils/speak.js';

const F = typography.fontFamily.display;

// ── 4-haneli PIN tuş takımı (modal) ──────────────────────────────────────────
function PinPad({ child, onSuccess, onCancel, str, lang }) {
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
        speak(str.pinFail, lang);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 600);
      }
    },
    [child, onSuccess, str, lang],
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
        height: 62, borderRadius: layout.borderRadius.lg, border: `1px solid ${colors.surface.divider}`,
        background: opts.ghost ? 'transparent' : 'rgba(255,255,255,.06)', color: colors.text.primary,
        fontSize: 26, fontWeight: 800, fontFamily: F, cursor: 'pointer',
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
      style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'rgba(8,7,28,.72)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 320, background: 'rgba(30,27,75,.95)', border: '1px solid rgba(148,163,184,.16)', borderRadius: layout.borderRadius.xl, boxShadow: '0 12px 40px rgba(0,0,0,.5)', padding: 26, textAlign: 'center' }}
      >
        <div style={{ fontSize: 46, lineHeight: 1, marginBottom: 6 }}>{child.avatar || '🚀'}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: colors.text.primary, fontFamily: F, marginBottom: 2 }}>{child.name}</div>
        <div style={{ fontSize: 13, color: colors.text.secondary, fontFamily: F, marginBottom: 18 }}>{str.pinTitle} 🔒</div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 20, animation: error ? 'shake .4s ease' : 'none' }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ width: 16, height: 16, borderRadius: '50%', background: error ? colors.feedback.error : i < pin.length ? colors.accent.primaryLight : 'transparent', border: `2px solid ${error ? colors.feedback.error : colors.surface.divider}`, transition: 'background .15s ease' }}
            />
          ))}
        </div>

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

// ── Kaptan kartı ─────────────────────────────────────────────────────────────
const cardBase = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px 10px 16px',
  borderRadius: layout.borderRadius.lg, cursor: 'pointer', fontFamily: F, minHeight: 168,
  transition: 'transform .15s ease, box-shadow .15s ease',
};

function CaptainCard({ child, onClick, str }) {
  const resume = getResumeInfo(child.ns);
  return (
    <button
      type="button"
      onClick={onClick}
      className="space-btn-hover"
      data-testid={`captain-${child.ns}`}
      style={{ ...cardBase, border: '1px solid rgba(255,255,255,.16)', background: 'rgba(30,27,75,.55)', boxShadow: '0 2px 12px rgba(0,0,0,.22)' }}
    >
      <div style={{ fontSize: 44, width: 78, height: 78, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(124,58,237,.22)', lineHeight: 1 }}>
        {child.avatar || '🚀'}
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, color: colors.text.primary, maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{child.name}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: resume?.hasProgress ? '#c4b5fd' : colors.text.secondary }}>
        {resume?.hasProgress ? `▶ ${str.resume} · ⭐ ${resume.stars}` : str.newStart}
        {hasPin(child.ns) ? '  🔒' : ''}
      </div>
    </button>
  );
}

function NewCaptainCard({ onClick, str }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="space-btn-hover"
      data-testid="captain-new"
      style={{ ...cardBase, border: '2px dashed rgba(255,255,255,.45)', background: 'rgba(255,255,255,.08)' }}
    >
      <div style={{ fontSize: 40, width: 78, height: 78, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,255,255,.14)', lineHeight: 1, color: '#fff', fontWeight: 900 }}>＋</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{str.newCaptain}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.75)' }}>🚀</div>
    </button>
  );
}

export default function CaptainPicker({ onPick, onNew, onBack, onAdult }) {
  const lang = useMemo(() => readEntryLang(), []);
  const str = entryStrings(lang);
  const [children] = useState(() => listChildren());
  const [pinFor, setPinFor] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => speak(`${str.whoPlays} ${str.tapYourPicture}`, lang), 400);
    return () => clearTimeout(t);
  }, [str, lang]);

  const choose = useCallback(
    (child) => {
      speak(hasPin(child.ns) ? str.helloPin(child.name) : str.hello(child.name), lang);
      if (hasPin(child.ns)) {
        setPinFor(child);
      } else {
        touchChild(child.ns);
        onPick?.(child);
      }
    },
    [onPick, str, lang],
  );

  const pinSuccess = useCallback(() => {
    const child = pinFor;
    setPinFor(null);
    if (child) {
      touchChild(child.ns);
      onPick?.(child);
    }
  }, [pinFor, onPick]);

  const ghost = { minHeight: 44, padding: '0 12px', borderRadius: 12, border: 'none', background: 'rgba(255,255,255,.12)', color: '#fff', fontFamily: F, fontSize: 14, fontWeight: 800, cursor: 'pointer' };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: colors.gradient.backgroundKids, padding: '14px 16px 16px', boxSizing: 'border-box', overflowY: 'auto' }}>
      <SpaceBackground starCount={36} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto', minHeight: 'calc(100vh - 30px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <button type="button" onClick={onBack} data-testid="picker-back" style={ghost}>← {str.back}</button>
          <span style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,.7)', fontFamily: F }}>👩‍🚀 {str.captains} · {children.length}</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 46, marginBottom: 6, lineHeight: 1 }}>🧒</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: colors.text.primary, fontFamily: F, margin: '0 0 4px' }}>{str.whoPlays}</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.85)', fontFamily: F, margin: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {str.tapYourPicture}
            <button type="button" onClick={() => speak(str.tapYourPicture, lang)} aria-label={str.listen} style={{ border: 'none', background: 'rgba(255,255,255,.16)', borderRadius: 999, width: 36, height: 36, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>🔊</button>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
          {children.map((c) => (
            <CaptainCard key={c.ns} child={c} str={str} onClick={() => choose(c)} />
          ))}
          <NewCaptainCard onClick={onNew} str={str} />
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ marginTop: 22, textAlign: 'center' }}>
          <button type="button" onClick={onAdult} data-testid="picker-adult" style={{ minHeight: 44, padding: '0 14px', borderRadius: 12, border: 'none', background: 'transparent', color: 'rgba(255,255,255,.75)', fontFamily: F, fontSize: 13.5, fontWeight: 800, cursor: 'pointer' }}>
            👩‍🏫 {str.adults}
          </button>
        </div>
      </div>

      {pinFor && <PinPad child={pinFor} str={str} lang={lang} onSuccess={pinSuccess} onCancel={() => setPinFor(null)} />}
    </div>
  );
}
