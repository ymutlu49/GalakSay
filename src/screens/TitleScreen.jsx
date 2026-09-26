// GalakSay — Açılış ekranı (oyunun ön kapısı).
//
// Müstakil oyun yaklaşımı: çocuk hiçbir hesap, öğretmen ya da platform olmadan
// kendi başına oyuna girer. Tek büyük eylem vardır:
//   • Kaptan yoksa   → "Yolculuğa Başla" (kaptan oluşturma sihirbazı)
//   • Kaptan varsa   → "Devam et · <son kaptan>" + "Kaptanlar" (başka kaptan / yeni kaptan)
// Öğretmen · Ebeveyn girişi (sınıf paneli, raporlar, NuMap) küçük bir alt bağlantıya
// çekilmiştir; işlev kaybı yoktur, yalnızca çocuğun yolundan çekilmiştir.
//
// Dil: giriş ekranları TR/KU; seçim `ds_lang` (küresel) anahtarına yazılır, oyun
// aynı anahtardan okur (ds_lang_<ns> yoksa). Sesli yönerge ön-okur çocuk içindir.

import { useEffect, useMemo, useState } from 'react';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import { GalaksayLogo } from '../components/branding/GalaksayLogo.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { listChildren, getResumeInfo } from '../services/localProfiles.js';
import { APP_VERSION } from '../version.js';
import { entryStrings, readEntryLang, writeEntryLang } from './entryStrings.js';
import { speak } from '../utils/speak.js';

const F = typography.fontFamily.display;

const STYLE = `
@keyframes gsFloat { 0%,100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-10px) rotate(-2deg); } }
@keyframes gsGlow { 0%,100% { box-shadow: 0 10px 34px rgba(124,58,237,.45), 0 0 0 0 rgba(167,139,250,.35); } 50% { box-shadow: 0 12px 40px rgba(124,58,237,.6), 0 0 0 10px rgba(167,139,250,0); } }
.gs-title-cta { animation: gsGlow 2.6s ease-in-out infinite; }
.gs-title-ship { animation: gsFloat 3.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .gs-title-cta, .gs-title-ship { animation: none; } }
`;

function LastCaptainCard({ child, resume, onClick, str }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="space-btn-hover gs-title-cta"
      data-testid="title-resume"
      style={{
        display: 'flex', alignItems: 'center', gap: 16, width: '100%', textAlign: 'left',
        padding: '16px 20px', borderRadius: 22, border: '1px solid rgba(255,255,255,.18)',
        background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)', cursor: 'pointer', fontFamily: F,
        transition: 'transform .15s ease',
      }}
    >
      <span style={{
        width: 64, height: 64, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,.18)', fontSize: 38, lineHeight: 1,
      }}>{child.avatar || '🚀'}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,.85)', letterSpacing: .5, textTransform: 'uppercase' }}>▶ {str.resume}</span>
        <span style={{ display: 'block', fontSize: 24, fontWeight: 900, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{child.name}</span>
        <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.9)' }}>
          {resume?.hasProgress ? `⭐ ${resume.stars} ${str.stars}` : str.newStart}
        </span>
      </span>
      <span style={{ fontSize: 28, color: '#fff', flexShrink: 0 }}>›</span>
    </button>
  );
}

export default function TitleScreen({ onResume, onCaptains, onNew, onAdult }) {
  const [lang, setLang] = useState(() => readEntryLang());
  const str = entryStrings(lang);
  const children = useMemo(() => listChildren(), []);
  // listChildren() en son oynayanı başa koyar → ilk kayıt "son kaptan"dır.
  const last = children[0] || null;
  const resume = last ? getResumeInfo(last.ns) : null;

  useEffect(() => {
    // Ön-okur: ekran adı sesle de söylenir (oyunun navigateTo pratiğiyle aynı).
    const t = setTimeout(() => speak(str.tagline, lang), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleLang = () => {
    const next = lang === 'tr' ? 'ku' : 'tr';
    setLang(next);
    writeEntryLang(next);
  };

  const bigBtn = {
    width: '100%', minHeight: 68, borderRadius: 22, border: 'none', cursor: 'pointer', fontFamily: F,
    fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: .5,
    background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
    transition: 'transform .15s ease',
  };
  const secondaryBtn = {
    width: '100%', minHeight: 54, borderRadius: 18, cursor: 'pointer', fontFamily: F,
    fontSize: 17, fontWeight: 800, color: '#fff',
    background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.22)',
    transition: 'transform .15s ease',
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: colors.gradient.backgroundKids, padding: '16px 16px 12px', boxSizing: 'border-box', overflowY: 'auto' }}>
      <style>{STYLE}</style>
      <SpaceBackground starCount={48} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 440, margin: '0 auto', minHeight: 'calc(100vh - 28px)', display: 'flex', flexDirection: 'column' }}>
        {/* Üst şerit: dil */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={toggleLang}
            aria-label={str.changeLang}
            data-testid="title-lang"
            style={{ minHeight: 40, padding: '0 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,.22)', background: 'rgba(255,255,255,.1)', color: '#fff', fontFamily: F, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
          >
            🌐 {lang === 'tr' ? 'TR' : 'KU'} · <span style={{ opacity: .75 }}>{lang === 'tr' ? 'Kurmancî' : 'Türkçe'}</span>
          </button>
        </div>

        {/* Logo + slogan + gemi + ana eylemler: tek blok, dikeyde ortalı */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '12px 0 8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 30 }}>
          <div className="gs-title-ship" aria-hidden="true" style={{ fontSize: 64, lineHeight: 1, marginBottom: 10, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,.35))' }}>🚀</div>
          <GalaksayLogo dark tight width="min(340px, 82vw)" />
          <p style={{ margin: '14px 0 0', fontSize: 17, lineHeight: 1.45, fontWeight: 700, color: 'rgba(255,255,255,.92)', fontFamily: F }}>
            {str.tagline}
          </p>
        </div>

        {/* Ana eylemler */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {last ? (
            <>
              <LastCaptainCard child={last} resume={resume} str={str} onClick={() => onResume?.(last)} />
              <button type="button" className="space-btn-hover" data-testid="title-captains" style={secondaryBtn} onClick={onCaptains}>
                👩‍🚀 {str.captains} <span style={{ opacity: .75, fontWeight: 700 }}>· {children.length}</span>
                <span style={{ margin: '0 8px', opacity: .5 }}>|</span>➕ {str.newCaptain}
              </button>
            </>
          ) : (
            <button type="button" className="space-btn-hover gs-title-cta" data-testid="title-start" style={bigBtn} onClick={onNew}>
              🚀 {str.startJourney}
            </button>
          )}
        </div>
        </div>

        {/* Alt şerit: yetişkin girişi (küçük, çocuğun yolundan çekilmiş) */}
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            onClick={onAdult}
            data-testid="title-adult"
            style={{ minHeight: 44, padding: '0 14px', borderRadius: 12, border: 'none', background: 'transparent', color: 'rgba(255,255,255,.78)', fontFamily: F, fontSize: 13.5, fontWeight: 800, cursor: 'pointer' }}
          >
            👩‍🏫 {str.adults} <span style={{ fontWeight: 600, opacity: .7 }}>— {str.adultsHint}</span>
          </button>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', fontFamily: F }}>GalakSay v{APP_VERSION}</span>
        </div>
      </div>
    </div>
  );
}
