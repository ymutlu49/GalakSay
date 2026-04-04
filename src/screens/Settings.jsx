// GalakSay Pro — 2026-03-20 — Profesyonel ayarlar ekranı (onay animasyonu + erişilebilirlik + PIN dialog)
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { spacing, layout } from '../design-system/spacing.js';
import { Toggle } from '../design-system/components/Toggle.jsx';
import { Button } from '../design-system/components/Button.jsx';
import { Modal } from '../design-system/components/Modal.jsx';

// ═══ AYAR BÖLÜMÜ BİLEŞENİ ══════════════════════════════════════════════════
function Section({ icon, title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontSize: 15,
        fontWeight: 800,
        color: colors.text.secondary,
        fontFamily: typography.fontFamily.display,
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        {title}
      </div>
      <div style={{
        borderRadius: layout.borderRadius.lg,
        background: 'rgba(30,27,75,.45)',
        border: '1px solid rgba(148,163,184,.08)',
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

// ═══ AYAR SATIRI — Toggle + kaydetme onayı ══════════════════════════════════
function SettingRow({ label, description, checked, onChange, last = false }) {
  const [saved, setSaved] = useState(false);

  const handleChange = useCallback((val) => {
    onChange?.(val);
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 800);
    return () => clearTimeout(t);
  }, [onChange]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      borderBottom: last ? 'none' : `1px solid ${colors.surface.divider}`,
      transition: 'background 200ms ease',
      background: saved ? `${colors.feedback.success}08` : 'transparent',
    }}>
      <div style={{ flex: 1, marginRight: 12 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            color: colors.text.primary,
            fontFamily: typography.fontFamily.display,
          }}>
            {label}
          </span>
          {saved && (
            <span style={{
              fontSize: 12,
              color: colors.feedback.success,
              animation: 'fadeIn 150ms ease-out',
              fontWeight: 700,
            }}>
              {'\u2713'}
            </span>
          )}
        </div>
        {description && (
          <div style={{
            fontSize: 12,
            color: colors.text.tertiary,
            marginTop: 2,
          }}>
            {description}
          </div>
        )}
      </div>
      <Toggle checked={checked} onChange={handleChange} size="md" />
    </div>
  );
}

// ═══ AYAR SATIRI — Link (navigasyon) ════════════════════════════════════════
function SettingLink({ label, value, onClick, last = false }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: last ? 'none' : `1px solid ${colors.surface.divider}`,
        cursor: 'pointer',
        transition: 'background 150ms',
      }}
      onPointerEnter={(e) => e.currentTarget.style.background = 'rgba(108,99,255,.06)'}
      onPointerLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        fontSize: 15,
        fontWeight: 600,
        color: colors.text.primary,
        fontFamily: typography.fontFamily.display,
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {value && (
          <span style={{ fontSize: 13, color: colors.text.tertiary }}>{value}</span>
        )}
        <span style={{ color: colors.text.disabled, fontSize: 14 }}>{'\u203A'}</span>
      </div>
    </div>
  );
}

// ═══ SEGMENT KONTROL ════════════════════════════════════════════════════════
function SegmentControl({ options, value, onChange }) {
  return (
    <div style={{
      display: 'flex',
      borderRadius: 10,
      background: colors.surface.input,
      padding: 3,
      gap: 2,
    }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            border: 'none',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: typography.fontFamily.display,
            cursor: 'pointer',
            background: value === opt.value ? colors.accent.primary : 'transparent',
            color: value === opt.value ? '#fff' : colors.text.tertiary,
            transition: 'all 200ms ease',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ═══ SEGMENT AYAR SATIRI ════════════════════════════════════════════════════
function SettingSegment({ label, options, value, onChange, last = false }) {
  return (
    <div style={{
      padding: '14px 16px',
      borderBottom: last ? 'none' : `1px solid ${colors.surface.divider}`,
    }}>
      <div style={{
        fontSize: 15,
        fontWeight: 600,
        color: colors.text.primary,
        fontFamily: typography.fontFamily.display,
        marginBottom: 8,
      }}>
        {label}
      </div>
      <SegmentControl options={options} value={value} onChange={onChange} />
    </div>
  );
}

// ═══ PIN GİRİŞ DİALOGU ════════════════════════════════════════════════════
function PinDialog({ open, onClose, onSuccess, mode = 'verify' }) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [confirmPin, setConfirmPin] = useState(null);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (open) {
      setPin(['', '', '', '']);
      setError('');
      setConfirmPin(null);
      setTimeout(() => inputRefs[0].current?.focus(), 200);
    }
  }, [open]);

  const handleDigit = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    if (value && index === 3) {
      const full = newPin.join('');
      if (mode === 'setup') {
        if (confirmPin === null) {
          setConfirmPin(full);
          setPin(['', '', '', '']);
          setTimeout(() => inputRefs[0].current?.focus(), 100);
        } else {
          if (full === confirmPin) {
            try { localStorage.setItem('galaksay_dashboard_pin', full); } catch {}
            onSuccess?.();
          } else {
            setError('PIN eşleşmedi, tekrar dene');
            setPin(['', '', '', '']);
            setConfirmPin(null);
            setTimeout(() => inputRefs[0].current?.focus(), 100);
          }
        }
      } else {
        let savedPin;
        try { savedPin = localStorage.getItem('galaksay_dashboard_pin'); } catch {}
        if (full === savedPin) {
          onSuccess?.();
        } else {
          setError('Yanlış PIN');
          setPin(['', '', '', '']);
          setTimeout(() => inputRefs[0].current?.focus(), 100);
        }
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  if (!open) return null;

  const title = mode === 'setup'
    ? (confirmPin ? 'PIN Onayla' : 'Yeni PIN Belirle')
    : 'Dashboard PIN';

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        padding: '8px 0',
        fontFamily: typography.fontFamily.display,
      }}>
        <p style={{ color: colors.text.secondary, fontSize: 14, textAlign: 'center', margin: 0 }}>
          {mode === 'setup'
            ? (confirmPin ? 'Aynı PIN kodunu tekrar gir' : '4 haneli bir PIN kodu belirle')
            : '4 haneli PIN kodunu gir'}
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={inputRefs[i]}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`PIN hane ${i + 1}`}
              style={{
                width: 52,
                height: 60,
                borderRadius: layout.borderRadius.md,
                border: `2px solid ${error ? colors.accent.tertiary + '60' : digit ? colors.accent.primary : colors.surface.divider}`,
                background: colors.surface.input,
                color: colors.text.primary,
                fontSize: 28,
                fontWeight: 900,
                fontFamily: typography.fontFamily.display,
                textAlign: 'center',
                outline: 'none',
                transition: 'border-color 200ms',
                caretColor: 'transparent',
              }}
            />
          ))}
        </div>
        {error && (
          <div style={{
            color: colors.accent.tertiary,
            fontSize: 13,
            fontWeight: 700,
            animation: 'wrongShake 400ms ease',
          }}>
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ═══ ANA AYARLAR EKRANI ═════════════════════════════════════════════════════
export function Settings({ onClose, onOpenDashboard, version = '5.9.0' }) {
  // Ayar durumları — localStorage'dan yükle
  const load = (key, def) => {
    try { const v = localStorage.getItem(`galaksay_${key}`); return v !== null ? JSON.parse(v) : def; }
    catch { return def; }
  };
  const save = (key, val) => {
    try { localStorage.setItem(`galaksay_${key}`, JSON.stringify(val)); } catch {}
  };

  const [notifications, setNotifications] = useState(() => load('notifications', true));
  const [masterSound, setMasterSound] = useState(() => load('sound_master', true));
  const [music, setMusic] = useState(() => load('sound_music', true));
  const [effects, setEffects] = useState(() => load('sound_effects', true));
  const [voiceGuide, setVoiceGuide] = useState(() => load('sound_voice', true));
  const [countSounds, setCountSounds] = useState(() => load('sound_count', true));
  const [animSpeed, setAnimSpeed] = useState(() => load('anim_speed', 'normal'));
  const [autoHint, setAutoHint] = useState(() => load('auto_hint', true));
  const [vibration, setVibration] = useState(() => load('vibration', true));
  const [sessionReminder, setSessionReminder] = useState(() => load('session_reminder', true));
  const [largeText, setLargeText] = useState(() => load('large_text', false));
  const [highContrast, setHighContrast] = useState(() => load('high_contrast', false));
  const [reducedMotion, setReducedMotion] = useState(() => load('reduced_motion', false));
  const [colorBlindMode, setColorBlindMode] = useState(() => load('color_blind', 'off'));

  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pinMode, setPinMode] = useState('verify'); // 'verify' | 'setup'

  // PIN korumalı dashboard erişimi
  const handleDashboardAccess = useCallback(() => {
    let hasPin;
    try { hasPin = !!localStorage.getItem('galaksay_dashboard_pin'); } catch { hasPin = false; }
    setPinMode(hasPin ? 'verify' : 'setup');
    setPinDialogOpen(true);
  }, []);

  const handlePinSuccess = useCallback(() => {
    setPinDialogOpen(false);
    onOpenDashboard?.();
  }, [onOpenDashboard]);

  // Persist changes
  const toggle = (setter, key) => (val) => { setter(val); save(key, val); };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      background: colors.gradient.background,
      fontFamily: typography.fontFamily.display,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: `1px solid ${colors.surface.divider}`,
        position: 'sticky',
        top: 0,
        background: colors.background.primary,
        zIndex: 2,
      }}>
        <button
          onClick={onClose}
          aria-label="Geri"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: 'none',
            background: 'rgba(108,99,255,.1)',
            color: colors.text.primary,
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {'\u2190'}
        </button>
        <h1 style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 800,
          color: colors.text.primary,
          margin: 0,
        }}>
          Ayarlar
        </h1>
        <div style={{ width: 40 }} /> {/* spacer */}
      </div>

      {/* Content */}
      <div style={{ padding: '20px 16px', maxWidth: 480, margin: '0 auto', width: '100%' }}>

        {/* Genel */}
        <Section icon={'\uD83D\uDCF1'} title="Genel">
          <SettingLink label="Dil" value="Türkçe" onClick={() => {}} />
          <SettingRow label="Bildirimler" checked={notifications} onChange={toggle(setNotifications, 'notifications')} />
          <SettingLink label="Veri kullanımı" onClick={() => {}} last />
        </Section>

        {/* Ses */}
        <Section icon={'\uD83D\uDD0A'} title="Ses">
          <SettingRow label="Ana ses" checked={masterSound} onChange={toggle(setMasterSound, 'sound_master')} />
          <SettingRow label="Müzik" checked={music} onChange={toggle(setMusic, 'sound_music')} />
          <SettingRow label="Efektler" checked={effects} onChange={toggle(setEffects, 'sound_effects')} />
          <SettingRow label="Sesli yönergeler" checked={voiceGuide} onChange={toggle(setVoiceGuide, 'sound_voice')} />
          <SettingRow label="Sayma sesleri" checked={countSounds} onChange={toggle(setCountSounds, 'sound_count')} last />
        </Section>

        {/* Oyun */}
        <Section icon={'\uD83C\uDFAE'} title="Oyun">
          <SettingSegment
            label="Animasyon hızı"
            options={[
              { value: 'slow', label: 'Yavaş' },
              { value: 'normal', label: 'Normal' },
              { value: 'fast', label: 'Hızlı' },
            ]}
            value={animSpeed}
            onChange={(v) => { setAnimSpeed(v); save('anim_speed', v); }}
          />
          <SettingRow label="Otomatik ipucu önerisi" checked={autoHint} onChange={toggle(setAutoHint, 'auto_hint')} />
          <SettingRow label="Titreşim geri bildirimi" checked={vibration} onChange={toggle(setVibration, 'vibration')} />
          <SettingRow label="Oturum süresi hatırlatması" checked={sessionReminder} onChange={toggle(setSessionReminder, 'session_reminder')} last />
        </Section>

        {/* Erişilebilirlik */}
        <Section icon={'\u267F'} title="Erişilebilirlik">
          <SettingRow label="Büyük metin" description="Tüm yazıları %130 büyütür" checked={largeText} onChange={toggle(setLargeText, 'large_text')} />
          <SettingRow label="Yüksek kontrast" checked={highContrast} onChange={toggle(setHighContrast, 'high_contrast')} />
          <SettingRow label="Azaltılmış hareket" description="Dekoratif animasyonları kapatır" checked={reducedMotion} onChange={toggle(setReducedMotion, 'reduced_motion')} />
          <SettingSegment
            label="Renk körlüğü modu"
            options={[
              { value: 'off', label: 'Kapalı' },
              { value: 'protanopia', label: 'Kırmızı' },
              { value: 'deuteranopia', label: 'Yeşil' },
              { value: 'tritanopia', label: 'Mavi' },
            ]}
            value={colorBlindMode}
            onChange={(v) => { setColorBlindMode(v); save('color_blind', v); }}
            last
          />
        </Section>

        {/* Profil */}
        <Section icon={'\uD83D\uDC64'} title="Profil">
          <SettingLink label="Profil düzenle" onClick={() => {}} />
          <SettingLink label="NuMap bağlantısı" onClick={() => {}} />
          <SettingLink label="Veriyi dışa aktar" onClick={() => {}} last />
        </Section>

        {/* Ebeveyn/Öğretmen Erişimi */}
        <Section icon={'\uD83D\uDD12'} title="Ebeveyn/Öğretmen Erişimi">
          <SettingLink label="Dashboard erişimi (PIN)" onClick={handleDashboardAccess} last />
        </Section>

        {/* PIN Giriş Dialogu */}
        <PinDialog
          open={pinDialogOpen}
          onClose={() => setPinDialogOpen(false)}
          onSuccess={handlePinSuccess}
          mode={pinMode}
        />

        {/* Hakkında */}
        <Section icon={'\u2139\uFE0F'} title="Hakkında">
          <SettingLink label="Versiyon" value={version} />
          <SettingLink label="Geliştirici" value="Jimaro Eğitim" />
          <SettingLink label="Akademik Danışman" value="Prof. Dr. Yılmaz Mutlu" />
          <SettingLink label="Lisanslar" onClick={() => {}} />
          <div style={{
            padding: '10px 16px',
            borderTop: `1px solid ${colors.surface.divider}`,
            fontSize: 12,
            color: colors.text.disabled,
            textAlign: 'center',
          }}>
            © Diskalkuli Derneği — MEB 2024 Türkiye Yüzyılı Maarif Modeli Uyumlu
          </div>
        </Section>

        {/* Bottom spacer */}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
