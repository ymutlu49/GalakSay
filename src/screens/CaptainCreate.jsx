// GalakSay — Kaptan oluşturma sihirbazı (çocuğun kendi başına yaptığı kayıt).
//
// Üç kısa adım, her biri tek soru ve büyük dokunma hedefleri (okuma bilmeyen
// çocuk için sesli yönerge + resimli seçenekler):
//   1. Kaptanını seç   → avatar
//   2. Adın ne?        → ad (isteğe bağlı; boşsa "Kaptan"; takma ad teşvik edilir — KVKK)
//   3. Kaç yaşındasın? → yaş grubu (okuloncesi | sinif1 | sinif2) → başlangıç yörüngesi
// Bitişte yerel profil (localProfiles.addChild) açılır ve oyun çocuk merkezinde
// başlar; orada "Keşif Uçuşu" (8 soruluk başlangıç değerlendirmesi) önerilir.
// PIN sorulmaz: paylaşılan cihazda öğretmen/ebeveyn dilerse yönetim alanından ekler.

import { useEffect, useMemo, useState } from 'react';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { addChild, LOCAL_AVATARS, AGE_GROUPS } from '../services/localProfiles.js';
import { entryStrings, readEntryLang } from './entryStrings.js';
import { speak, stopSpeaking } from '../utils/speak.js';

const F = typography.fontFamily.display;
const STEPS = 3;
const NAME_MAX = 24;

function Dots({ step }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {Array.from({ length: STEPS }, (_, i) => (
        <span key={i} style={{ width: i === step ? 26 : 10, height: 10, borderRadius: 999, background: i <= step ? '#fff' : 'rgba(255,255,255,.3)', transition: 'width .2s ease' }} />
      ))}
    </div>
  );
}

function Preview({ avatar, name, str }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 14px 8px 8px', borderRadius: 999, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)' }}>
      <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, lineHeight: 1 }}>{avatar || '❔'}</span>
      <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', fontFamily: F }}>{name || str.namePlaceholder}</span>
    </div>
  );
}

export default function CaptainCreate({ onDone, onCancel }) {
  const lang = useMemo(() => readEntryLang(), []);
  const str = entryStrings(lang);
  const [step, setStep] = useState(0);
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [saving, setSaving] = useState(false);

  // Adım değişince yönerge sesle söylenir (ön-okur desteği).
  useEffect(() => {
    const text = [str.step1Voice, str.step2Voice, str.step3Voice][step];
    const t = setTimeout(() => speak(text, lang), 350);
    return () => { clearTimeout(t); stopSpeaking(); };
  }, [step, lang, str]);

  const canNext = step === 0 ? !!avatar : step === 1 ? true : !!ageGroup;

  const finish = () => {
    if (saving) return;
    setSaving(true);
    const finalName = name.trim().slice(0, NAME_MAX) || str.namePlaceholder;
    const rec = addChild({ name: finalName, avatar, ageGroup });
    speak(str.welcomeVoice(finalName), lang);
    onDone?.(rec);
  };

  const next = () => {
    if (!canNext) return;
    if (step < STEPS - 1) setStep(step + 1);
    else finish();
  };
  const back = () => {
    if (step === 0) onCancel?.();
    else setStep(step - 1);
  };

  const title = [str.step1, str.step2, str.step3][step];
  const voice = [str.step1Voice, str.step2Voice, str.step3Voice][step];

  const optionBtn = (selected) => ({
    borderRadius: 20, cursor: 'pointer', fontFamily: F,
    border: selected ? '3px solid #fff' : '2px solid rgba(255,255,255,.22)',
    background: selected ? 'linear-gradient(135deg, rgba(124,58,237,.9), rgba(99,102,241,.9))' : 'rgba(255,255,255,.1)',
    boxShadow: selected ? '0 8px 24px rgba(124,58,237,.45)' : 'none',
    transform: selected ? 'scale(1.04)' : 'none',
    transition: 'transform .12s ease, background .12s ease',
  });

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: colors.gradient.backgroundKids, padding: '14px 16px 16px', boxSizing: 'border-box', overflowY: 'auto' }}>
      <SpaceBackground starCount={36} showMeteors={false} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 520, margin: '0 auto', minHeight: 'calc(100vh - 30px)', display: 'flex', flexDirection: 'column' }}>
        {/* Üst şerit */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8 }}>
          <button type="button" onClick={back} data-testid="create-back" style={{ justifySelf: 'start', minHeight: 44, padding: '0 12px', borderRadius: 12, border: 'none', background: 'rgba(255,255,255,.12)', color: '#fff', fontFamily: F, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>← {str.back}</button>
          <Dots step={step} />
          <span style={{ justifySelf: 'end', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,.7)', fontFamily: F }}>{str.stepOf(step + 1, STEPS)}</span>
        </div>

        {/* Başlık + ses */}
        <div style={{ textAlign: 'center', margin: '18px 0 14px' }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,.7)', fontFamily: F, marginBottom: 4 }}>{str.createTitle}</div>
          <h1 style={{ margin: 0, fontSize: 27, fontWeight: 900, color: '#fff', fontFamily: F, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            {title}
            <button type="button" onClick={() => speak(voice, lang)} aria-label={str.listen} style={{ border: 'none', background: 'rgba(255,255,255,.16)', borderRadius: 999, width: 40, height: 40, cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>🔊</button>
          </h1>
          {step > 0 && <div style={{ marginTop: 10 }}><Preview avatar={avatar} name={name.trim()} str={str} /></div>}
        </div>

        {/* Gövde */}
        <div style={{ flex: 1 }}>
          {step === 0 && (
            <div role="radiogroup" aria-label={str.step1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: 10, maxWidth: 430, margin: '0 auto' }}>
              {LOCAL_AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  role="radio"
                  aria-checked={avatar === a}
                  data-testid={`avatar-${a}`}
                  onClick={() => { setAvatar(a); speak(str.step1, lang); }}
                  style={{ ...optionBtn(avatar === a), aspectRatio: '1 / 1', minHeight: 84, fontSize: 44, lineHeight: 1 }}
                >
                  {a}
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div style={{ textAlign: 'center' }}>
              <input
                type="text"
                value={name}
                maxLength={NAME_MAX}
                autoFocus
                autoComplete="off"
                placeholder={str.namePlaceholder}
                aria-label={str.step2}
                data-testid="create-name"
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') next(); }}
                style={{ width: '100%', boxSizing: 'border-box', fontSize: 30, fontWeight: 900, textAlign: 'center', padding: '16px 18px', borderRadius: 20, border: '2px solid rgba(255,255,255,.35)', background: 'rgba(255,255,255,.12)', color: '#fff', fontFamily: F, outline: 'none' }}
              />
              <p style={{ marginTop: 12, fontSize: 14, color: 'rgba(255,255,255,.8)', fontFamily: F }}>{str.step2Hint}</p>
            </div>
          )}

          {step === 2 && (
            <div role="radiogroup" aria-label={str.step3} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              {AGE_GROUPS.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  role="radio"
                  aria-checked={ageGroup === g.key}
                  data-testid={`age-${g.key}`}
                  onClick={() => { setAgeGroup(g.key); speak(`${str.ageHint[g.key]}, ${str.ageYears[g.key]}`, lang); }}
                  style={{ ...optionBtn(ageGroup === g.key), padding: '18px 10px', minHeight: 132, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                >
                  <span style={{ fontSize: 44, lineHeight: 1 }}>{g.icon}</span>
                  <span style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>{str.ageHint[g.key]}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.85)' }}>{str.ageYears[g.key]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alt eylem */}
        <button
          type="button"
          onClick={next}
          disabled={!canNext || saving}
          data-testid="create-next"
          className={canNext ? 'space-btn-hover' : undefined}
          style={{
            marginTop: 18, width: '100%', minHeight: 64, borderRadius: 22, border: 'none', fontFamily: F, fontSize: 22, fontWeight: 900, color: '#fff',
            background: canNext ? 'linear-gradient(135deg, #059669, #10b981)' : 'rgba(255,255,255,.14)',
            boxShadow: canNext ? '0 10px 30px rgba(5,150,105,.4)' : 'none',
            cursor: canNext ? 'pointer' : 'not-allowed', opacity: canNext ? 1 : .7, transition: 'transform .15s ease, background .15s ease',
          }}
        >
          {step < STEPS - 1 ? `${str.next} →` : `🚀 ${str.ready}`}
        </button>
      </div>
    </div>
  );
}
