// GalakSay — Hesapsız kaptan girişi (canlı v5.10.x paketine takılan karşılama parçası).
//
// Bu dosya, canlı derlemedeki `oyna/assets/WelcomeScreen-BD-9Cs8v.js` parçasının yerine
// konur (aynı dosya adı; index parçası onu tembel yükler). JSX yoktur; derleme gerektirmez.
// Canlı paketin dışa verdiği yardımcıları kullanır:
//   r=React · j=jsx çalışma zamanı · N=listChildren · E=addChild · a1=touchChild ·
//   a2=getResumeInfo · a0=hasPin · L=avatarlar · f=üç dilli metin(tr,ku,en) · z=dil ·
//   $=konuşma dil etiketi · p=açık palet · t=tipografi · G=GalaksayLogo
// Kaynak (okunur sürüm) GitHub deposundaki src/screens/TitleScreen.jsx, CaptainCreate.jsx,
// CaptainPicker.jsx ile aynı tasarımdır.
//
// Akış: açılış → (kaptan yoksa) "Yolculuğa Başla" → 3 adımlı kaptan oluşturma → oyun
//                (kaptan varsa) "Devam et · son kaptan" → oyun | "Kaptanlar" → liste → oyun
// Şifreli profil seçilirse mevcut öğrenci seçiciye (şifre + kilit korumasıyla) gidilir.
// Öğretmen · Ebeveyn girişi alt bağlantıdadır.
import { r as React, j as J, N as listChildren, E as addChild, a1 as touchChild, a2 as getResumeInfo, a0 as hasPin, L as AVATARS, f as tt, z as getLang, $ as speechTag, p as C, t as TY, G as Logo } from './index-pKper_0i.js';
import { S as SpaceBackground } from './SpaceBackground-CZeUKPCu.js';

const h = J.jsx;
const hs = J.jsxs;
const F = TY.fontFamily.display;
const NAME_MAX = 24;

function speak(tr, ku, en) {
  try {
    const text = tt(tr, ku, en);
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = speechTag();
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  } catch { /* ses desteklenmiyor */ }
}

const CSS = `
@keyframes gsFloat { 0%,100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-10px) rotate(-2deg); } }
@keyframes gsGlow { 0%,100% { box-shadow: 0 10px 28px rgba(124,58,237,.28), 0 0 0 0 rgba(124,58,237,.22); } 50% { box-shadow: 0 12px 32px rgba(124,58,237,.36), 0 0 0 10px rgba(124,58,237,0); } }
.gs-cta { animation: gsGlow 2.6s ease-in-out infinite; }
.gs-ship { animation: gsFloat 3.4s ease-in-out infinite; }
.gs-tap { transition: transform .12s ease, box-shadow .12s ease; }
.gs-tap:active { transform: scale(.97); }
@media (prefers-reduced-motion: reduce) { .gs-cta, .gs-ship { animation: none; } }
`;

const AGES = [
  { key: 'okuloncesi', icon: '🪐', tr: ['Okul öncesi', '5–6 yaş'], ku: ['Beriya dibistanê', '5–6 salî'], en: ['Preschool', 'age 5–6'] },
  { key: 'sinif1', icon: '⭐', tr: ['1. sınıf', '6–7 yaş'], ku: ['Pola 1.', '6–7 salî'], en: ['Grade 1', 'age 6–7'] },
  { key: 'sinif2', icon: '🚀', tr: ['2. sınıf', '7–8 yaş'], ku: ['Pola 2.', '7–8 salî'], en: ['Grade 2', 'age 7–8'] },
];
const ageText = (g, i) => tt(g.tr[i], g.ku[i], g.en[i]);

const card = { background: C.surface.card, border: `1px solid ${C.surface.divider}`, boxShadow: '0 2px 10px rgba(30,27,75,.06), 0 1px 2px rgba(30,27,75,.04)' };
const page = { position: 'relative', minHeight: '100vh', background: C.gradient.backgroundKids, padding: '14px 16px 16px', boxSizing: 'border-box', overflowY: 'auto', fontFamily: F };
const col = (max) => ({ position: 'relative', zIndex: 1, maxWidth: max, margin: '0 auto', minHeight: 'calc(100vh - 30px)', display: 'flex', flexDirection: 'column' });
const ghostBtn = { ...card, minHeight: 44, padding: '0 12px', borderRadius: 12, color: C.text.primary, fontFamily: F, fontSize: 14, fontWeight: 800, cursor: 'pointer' };
const speakBtn = (onClick, label) => h('button', { type: 'button', onClick, 'aria-label': label, style: { border: 'none', background: 'rgba(124,58,237,.10)', borderRadius: 999, width: 44, height: 44, cursor: 'pointer', fontSize: 18, lineHeight: 1, flexShrink: 0 } }, '🔊');

// ── Açılış ───────────────────────────────────────────────────────────────────
function Title({ kids, lang, onLang, onResume, onCaptains, onNew, onAdult }) {
  const last = kids[0] || null;
  const resume = last ? getResumeInfo(last.ns) : null;
  const langs = { tr: 'TR · Türkçe', ku: 'KU · Kurmancî', en: 'EN · English' };
  return hs('div', { style: page, children: [
    h('style', { children: CSS }),
    h(SpaceBackground, { starCount: 48 }),
    hs('div', { style: col(440), children: [
      h('div', { style: { display: 'flex', justifyContent: 'flex-end' }, children: h('button', { type: 'button', onClick: onLang, 'data-testid': 'title-lang', 'aria-label': tt('Dil değiştir', 'Zimên biguherîne', 'Change language'), style: { ...card, minHeight: 40, padding: '0 14px', borderRadius: 999, color: C.text.primary, fontFamily: F, fontSize: 13, fontWeight: 800, cursor: 'pointer' }, children: '🌐 ' + langs[lang] }) }),
      hs('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '12px 0 8px' }, children: [
        hs('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 30 }, children: [
          h('div', { className: 'gs-ship', 'aria-hidden': 'true', style: { fontSize: 64, lineHeight: 1, marginBottom: 10, filter: 'drop-shadow(0 8px 14px rgba(124,58,237,.25))' }, children: '🚀' }),
          h(Logo, { width: 'min(360px, 86vw)' }),
          h('p', { style: { margin: '14px 0 0', fontSize: 17, lineHeight: 1.45, fontWeight: 700, color: C.text.primary }, children: tt('Sayılar Galaksisi seni bekliyor', 'Galaksiya Hejmaran li benda te ye', 'The Number Galaxy is waiting for you') }),
        ] }),
        last
          ? hs('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 }, children: [
            hs('button', { type: 'button', className: 'gs-cta gs-tap', 'data-testid': 'title-resume', onClick: () => onResume(last), style: { display: 'flex', alignItems: 'center', gap: 16, width: '100%', textAlign: 'left', padding: '16px 20px', borderRadius: 22, border: 'none', background: C.gradient.accent, cursor: 'pointer', fontFamily: F }, children: [
              h('span', { style: { width: 64, height: 64, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.22)', fontSize: 38, lineHeight: 1 }, children: last.avatar || '🚀' }),
              hs('span', { style: { flex: 1, minWidth: 0 }, children: [
                h('span', { style: { display: 'block', fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,.9)', letterSpacing: .5, textTransform: 'uppercase' }, children: '▶ ' + tt('Devam et', 'Bidomîne', 'Continue') }),
                h('span', { style: { display: 'block', fontSize: 24, fontWeight: 900, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: last.name }),
                h('span', { style: { display: 'block', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.92)' }, children: resume && resume.hasProgress ? `⭐ ${resume.stars} ${tt('yıldız', 'stêrk', 'stars')}` : tt('Yeni başla', 'Nû dest pê bike', 'Start fresh') }),
              ] }),
              h('span', { style: { fontSize: 28, color: '#fff', flexShrink: 0 }, children: hasPin(last.ns) ? '🔒' : '›' }),
            ] }),
            hs('button', { type: 'button', className: 'gs-tap', 'data-testid': 'title-captains', onClick: onCaptains, style: { ...card, width: '100%', minHeight: 56, borderRadius: 18, cursor: 'pointer', fontFamily: F, fontSize: 17, fontWeight: 800, color: C.text.primary }, children: [
              '👩‍🚀 ' + tt('Kaptanlar', 'Kaptan', 'Captains'),
              h('span', { style: { opacity: .7, fontWeight: 700 }, children: ` · ${kids.length}` }),
              h('span', { style: { margin: '0 8px', opacity: .35 }, children: '|' }),
              '➕ ' + tt('Yeni Kaptan', 'Kaptanê Nû', 'New Captain'),
            ] }),
          ] })
          : h('button', { type: 'button', className: 'gs-cta gs-tap', 'data-testid': 'title-start', onClick: onNew, style: { width: '100%', minHeight: 68, borderRadius: 22, border: 'none', cursor: 'pointer', fontFamily: F, fontSize: 24, fontWeight: 900, color: '#fff', background: C.gradient.accent }, children: '🚀 ' + tt('Yolculuğa Başla', 'Dest bi Rêwîtiyê Bike', 'Start the Journey') }),
      ] }),
      hs('div', { style: { marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }, children: [
        hs('button', { type: 'button', 'data-testid': 'title-adult', onClick: onAdult, style: { minHeight: 44, padding: '0 14px', borderRadius: 12, border: 'none', background: 'transparent', color: C.text.secondary, fontFamily: F, fontSize: 13.5, fontWeight: 800, cursor: 'pointer' }, children: [
          '👩‍🏫 ' + tt('Öğretmen · Ebeveyn', 'Mamoste · Dê û bav', 'Teacher · Parent'),
          h('span', { style: { fontWeight: 600, opacity: .75 }, children: ' — ' + tt('Sınıf paneli, raporlar ve ayarlar', 'Panela polê, rapor û mîheng', 'Class panel, reports and settings') }),
        ] }),
      ] }),
    ] }),
  ] });
}

// ── Kaptan listesi ───────────────────────────────────────────────────────────
function Captains({ kids, onPick, onNew, onBack, onAdult }) {
  React.useEffect(() => { const t = setTimeout(() => speak('Kim oynuyor? Kendi resmine dokun!', 'Kî dilîze? Dest bide wêneyê xwe!', "Who's playing? Tap your picture!"), 400); return () => clearTimeout(t); }, []);
  const cardBase = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px 10px 16px', borderRadius: 16, cursor: 'pointer', fontFamily: F, minHeight: 168 };
  return hs('div', { style: page, children: [
    h('style', { children: CSS }),
    h(SpaceBackground, { starCount: 36 }),
    hs('div', { style: col(620), children: [
      hs('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }, children: [
        h('button', { type: 'button', 'data-testid': 'picker-back', onClick: onBack, style: ghostBtn, children: '← ' + tt('Geri', 'Vegere', 'Back') }),
        h('span', { style: { fontSize: 12, fontWeight: 800, color: C.text.secondary }, children: `👩‍🚀 ${tt('Kaptanlar', 'Kaptan', 'Captains')} · ${kids.length}` }),
      ] }),
      hs('div', { style: { textAlign: 'center', marginBottom: 20 }, children: [
        h('div', { style: { fontSize: 46, marginBottom: 6, lineHeight: 1 }, children: '🧒' }),
        h('h1', { style: { fontSize: 26, fontWeight: 900, color: C.text.primary, margin: '0 0 4px' }, children: tt('Kim oynuyor?', 'Kî dilîze?', "Who's playing?") }),
        hs('p', { style: { fontSize: 14, color: C.text.secondary, margin: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }, children: [
          tt('Kendi resmine dokun', 'Dest bide wêneyê xwe', 'Tap your picture'),
          speakBtn(() => speak('Kendi resmine dokun!', 'Dest bide wêneyê xwe!', 'Tap your picture!'), tt('Yönergeyi sesli dinle', 'Rêbernameyê bibihîze', 'Listen')),
        ] }),
      ] }),
      hs('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }, children: [
        ...kids.map((c) => {
          const r = getResumeInfo(c.ns);
          return hs('button', { key: c.ns, type: 'button', className: 'gs-tap', 'data-testid': `captain-${c.ns}`, onClick: () => onPick(c), style: { ...cardBase, ...card }, children: [
            h('div', { style: { fontSize: 44, width: 78, height: 78, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(124,58,237,.10)', lineHeight: 1 }, children: c.avatar || '🚀' }),
            h('div', { style: { fontSize: 16, fontWeight: 800, color: C.text.primary, maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: c.name }),
            h('div', { style: { fontSize: 12, fontWeight: 700, color: r && r.hasProgress ? C.accent.primaryLight : C.text.secondary }, children: (r && r.hasProgress ? `▶ ${tt('Devam et', 'Bidomîne', 'Continue')} · ⭐ ${r.stars}` : tt('Yeni başla', 'Nû dest pê bike', 'Start fresh')) + (hasPin(c.ns) ? '  🔒' : '') }),
          ] });
        }),
        hs('button', { key: '__new', type: 'button', className: 'gs-tap', 'data-testid': 'captain-new', onClick: onNew, style: { ...cardBase, border: '2px dashed rgba(124,58,237,.45)', background: 'rgba(255,255,255,.6)' }, children: [
          h('div', { style: { fontSize: 40, width: 78, height: 78, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: C.gradient.accent, lineHeight: 1, color: '#fff', fontWeight: 900 }, children: '＋' }),
          h('div', { style: { fontSize: 16, fontWeight: 800, color: C.text.primary }, children: tt('Yeni Kaptan', 'Kaptanê Nû', 'New Captain') }),
          h('div', { style: { fontSize: 12, fontWeight: 700, color: C.text.secondary }, children: '🚀' }),
        ] }),
      ] }),
      h('div', { style: { flex: 1 } }),
      h('div', { style: { marginTop: 22, textAlign: 'center' }, children: h('button', { type: 'button', 'data-testid': 'picker-adult', onClick: onAdult, style: { minHeight: 44, padding: '0 14px', borderRadius: 12, border: 'none', background: 'transparent', color: C.text.secondary, fontFamily: F, fontSize: 13.5, fontWeight: 800, cursor: 'pointer' }, children: '👩‍🏫 ' + tt('Öğretmen · Ebeveyn', 'Mamoste · Dê û bav', 'Teacher · Parent') }) }),
    ] }),
  ] });
}

// ── Kaptan oluşturma (3 adım) ────────────────────────────────────────────────
function Create({ onDone, onCancel }) {
  const [step, setStep] = React.useState(0);
  const [avatar, setAvatar] = React.useState('');
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const V = [
    ['Kaptanını seç! Beğendiğin resme dokun.', 'Kaptanê xwe hilbijêre! Dest bide wêneyê ku tu jê hez dikî.', 'Choose your captain! Tap the picture you like.'],
    ['Adın ne? Adını yaz ya da boş bırak.', 'Navê te çi ye? Navê xwe binivîse an vala bihêle.', "What's your name? Type it or leave it empty."],
    ['Kaç yaşındasın? Sana uyan gezegene dokun.', 'Tu çend salî yî? Dest bide gerstêrka ku li te tê.', 'How old are you? Tap the planet that fits you.'],
  ];
  const T = [
    tt('Kaptanını seç', 'Kaptanê xwe hilbijêre', 'Choose your captain'),
    tt('Adın ne?', 'Navê te çi ye?', "What's your name?"),
    tt('Kaç yaşındasın?', 'Tu çend salî yî?', 'How old are you?'),
  ];
  React.useEffect(() => { const t = setTimeout(() => speak(...V[step]), 350); return () => { clearTimeout(t); try { window.speechSynthesis.cancel(); } catch { /* yok */ } }; }, [step]); // eslint-disable-line
  const canNext = step === 0 ? !!avatar : step === 1 ? true : !!age;
  const fallbackName = tt('Kaptan', 'Kaptan', 'Captain');
  const finish = () => {
    if (saving) return;
    setSaving(true);
    const n = name.trim().slice(0, NAME_MAX) || fallbackName;
    const rec = addChild({ name: n, avatar, ageGroup: age });
    speak(`Hoş geldin Kaptan ${n}! Yolculuk başlıyor.`, `Bi xêr hatî Kaptan ${n}! Rêwîtî dest pê dike.`, `Welcome, Captain ${n}! The journey begins.`);
    onDone(rec);
  };
  const next = () => { if (!canNext) return; if (step < 2) setStep(step + 1); else finish(); };
  const back = () => { if (step === 0) onCancel(); else setStep(step - 1); };
  const opt = (sel) => ({ borderRadius: 20, cursor: 'pointer', fontFamily: F, color: sel ? '#fff' : C.text.primary, border: sel ? `3px solid ${C.accent.primary}` : `2px solid ${C.surface.divider}`, background: sel ? C.gradient.accent : C.surface.card, boxShadow: sel ? '0 10px 30px rgba(124,58,237,.18)' : card.boxShadow, transform: sel ? 'scale(1.04)' : 'none', transition: 'transform .12s ease, background .12s ease' });
  const dots = h('div', { 'aria-hidden': 'true', style: { display: 'flex', gap: 8, justifyContent: 'center' }, children: [0, 1, 2].map((i) => h('span', { key: i, style: { width: i === step ? 26 : 10, height: 10, borderRadius: 999, background: i <= step ? C.accent.primary : 'rgba(30,27,75,.14)', transition: 'width .2s ease' } })) });
  const preview = hs('div', { style: { ...card, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 14px 8px 8px', borderRadius: 999 }, children: [
    h('span', { style: { width: 40, height: 40, borderRadius: '50%', background: 'rgba(124,58,237,.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, lineHeight: 1 }, children: avatar || '❔' }),
    h('span', { style: { fontSize: 15, fontWeight: 800, color: C.text.primary }, children: name.trim() || fallbackName }),
  ] });
  let body;
  if (step === 0) {
    body = h('div', { role: 'radiogroup', 'aria-label': T[0], style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: 10, maxWidth: 430, margin: '0 auto' }, children: AVATARS.map((a) => h('button', { key: a, type: 'button', role: 'radio', 'aria-checked': avatar === a, 'data-testid': `avatar-${a}`, onClick: () => setAvatar(a), style: { ...opt(avatar === a), aspectRatio: '1 / 1', minHeight: 84, fontSize: 44, lineHeight: 1 }, children: a })) });
  } else if (step === 1) {
    body = hs('div', { style: { textAlign: 'center' }, children: [
      h('input', { type: 'text', value: name, maxLength: NAME_MAX, autoFocus: true, autoComplete: 'off', placeholder: fallbackName, 'aria-label': T[1], 'data-testid': 'create-name', onChange: (ev) => setName(ev.target.value), onKeyDown: (ev) => { if (ev.key === 'Enter') next(); }, style: { ...card, width: '100%', boxSizing: 'border-box', fontSize: 30, fontWeight: 900, textAlign: 'center', padding: '16px 18px', borderRadius: 20, border: '2px solid rgba(124,58,237,.35)', color: C.text.primary, fontFamily: F, outline: 'none' } }),
      h('p', { style: { marginTop: 12, fontSize: 14, color: C.text.secondary }, children: tt('Takma ad da olur; bu ad cihazda kalır.', 'Nasnav jî dibe; ev nav di cîhazê de dimîne.', 'A nickname is fine; the name stays on this device.') }),
    ] });
  } else {
    body = h('div', { role: 'radiogroup', 'aria-label': T[2], style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }, children: AGES.map((g) => hs('button', { key: g.key, type: 'button', role: 'radio', 'aria-checked': age === g.key, 'data-testid': `age-${g.key}`, onClick: () => { setAge(g.key); speak(`${g.tr[0]}, ${g.tr[1]}`, `${g.ku[0]}, ${g.ku[1]}`, `${g.en[0]}, ${g.en[1]}`); }, style: { ...opt(age === g.key), padding: '18px 10px', minHeight: 132, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }, children: [
      h('span', { style: { fontSize: 44, lineHeight: 1 }, children: g.icon }),
      h('span', { style: { fontSize: 17, fontWeight: 900 }, children: ageText(g, 0) }),
      h('span', { style: { fontSize: 13, fontWeight: 700, opacity: .8 }, children: ageText(g, 1) }),
    ] })) });
  }
  return hs('div', { style: page, children: [
    h('style', { children: CSS }),
    h(SpaceBackground, { starCount: 36, showMeteors: false }),
    hs('div', { style: col(520), children: [
      hs('div', { style: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8 }, children: [
        h('button', { type: 'button', 'data-testid': 'create-back', onClick: back, style: { ...ghostBtn, justifySelf: 'start' }, children: '← ' + tt('Geri', 'Vegere', 'Back') }),
        dots,
        h('span', { style: { justifySelf: 'end', fontSize: 12, fontWeight: 800, color: C.text.secondary }, children: tt(`Adım ${step + 1} / 3`, `Gav ${step + 1} / 3`, `Step ${step + 1} / 3`) }),
      ] }),
      hs('div', { style: { textAlign: 'center', margin: '18px 0 14px' }, children: [
        h('div', { style: { fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: C.accent.primaryLight, marginBottom: 4 }, children: tt('Kaptanını oluştur', 'Kaptanê xwe çêke', 'Create your captain') }),
        hs('h1', { style: { margin: 0, fontSize: 27, fontWeight: 900, color: C.text.primary, display: 'inline-flex', alignItems: 'center', gap: 10 }, children: [T[step], speakBtn(() => speak(...V[step]), tt('Yönergeyi sesli dinle', 'Rêbernameyê bibihîze', 'Listen'))] }),
        step > 0 ? h('div', { style: { marginTop: 10 }, children: preview }) : null,
      ] }),
      h('div', { style: { flex: 1 }, children: body }),
      h('button', { type: 'button', 'data-testid': 'create-next', onClick: next, disabled: !canNext || saving, style: { marginTop: 18, width: '100%', minHeight: 64, borderRadius: 22, border: 'none', fontFamily: F, fontSize: 22, fontWeight: 900, color: canNext ? '#fff' : C.text.tertiary, background: canNext ? C.gradient.success : '#ECE9F7', boxShadow: canNext ? '0 10px 26px rgba(5,150,105,.28)' : 'none', cursor: canNext ? 'pointer' : 'not-allowed' }, children: step < 2 ? `${tt('İleri', 'Pêş', 'Next')} →` : `🚀 ${tt('Hazırım!', 'Ez amade me!', "I'm ready!")}` }),
    ] }),
  ] });
}

// ── Kök bileşen (App'in çağırdığı varsayılan dışa aktarım) ───────────────────
function CaptainEntry({ onStudent, onAdult, onPick }) {
  const [view, setView] = React.useState('title');
  const [lang, setLang] = React.useState(() => getLang());
  const [kids, setKids] = React.useState(() => listChildren());
  React.useEffect(() => { const t = setTimeout(() => speak('Sayılar Galaksisi seni bekliyor!', 'Galaksiya Hejmaran li benda te ye!', 'The Number Galaxy is waiting for you!'), 600); return () => clearTimeout(t); }, []);
  const start = (c) => {
    if (!c) return;
    if (hasPin(c.ns) || typeof onPick !== 'function') { onStudent && onStudent(); return; } // şifreli profil: mevcut seçici (kilit korumalı)
    speak(`Merhaba ${c.name}!`, `Silav ${c.name}!`, `Hi ${c.name}!`);
    try { touchChild(c.ns); } catch { /* yok */ }
    onPick(c);
  };
  const cycleLang = () => {
    const nx = lang === 'tr' ? 'ku' : lang === 'ku' ? 'en' : 'tr';
    try { localStorage.setItem('ds_lang', nx); } catch { /* depolama kapalı */ }
    setLang(nx);
  };
  if (view === 'create') {
    return h(Create, { onCancel: () => setView(kids.length ? 'captains' : 'title'), onDone: (rec) => { setKids(listChildren()); start(rec); } });
  }
  if (view === 'captains') {
    return h(Captains, { kids, onPick: start, onNew: () => setView('create'), onBack: () => setView('title'), onAdult });
  }
  return h(Title, { kids, lang, onLang: cycleLang, onResume: start, onCaptains: () => setView('captains'), onNew: () => setView('create'), onAdult });
}

export { CaptainEntry as default };
