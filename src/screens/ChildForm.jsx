// GalakSay — Yerel çocuk profili ekle/düzenle (öğretmen/uzman için).
//
// Ad + avatar + yaş-grubu + (isteğe bağlı) 4-haneli PIN. Kaydedince localProfiles'a
// yazılır; ns sabit kaldığı için çocuk her girişte oyununa kaldığı yerden devam eder.

import React, { useState, useCallback } from 'react';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import { Button } from '../design-system/components/Button.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { layout } from '../design-system/spacing.js';
import { addChild, updateChild, removeChild, LOCAL_AVATARS, AGE_GROUPS } from '../services/localProfiles.js';
import { hashPin } from '../utils/crypto.js';

const F = typography.fontFamily.display;

const inputStyle = {
  width: '100%',
  height: 50,
  padding: '0 16px',
  borderRadius: layout.borderRadius.md,
  border: `2px solid ${colors.surface.divider}`,
  background: colors.surface.input,
  color: colors.text.primary,
  fontSize: 17,
  fontWeight: 600,
  fontFamily: F,
  outline: 'none',
  boxSizing: 'border-box',
};
const labelStyle = { display: 'block', fontSize: 14, fontWeight: 700, color: colors.text.secondary, fontFamily: F, marginBottom: 8 };

export default function ChildForm({ child = null, ownerId = null, onSave, onCancel }) {
  const editing = !!child;
  const [name, setName] = useState(child?.name || '');
  const [avatar, setAvatar] = useState(child?.avatar || LOCAL_AVATARS[0]);
  const [ageGroup, setAgeGroup] = useState(child?.ageGroup || 'sinif1');
  // PIN hash'li saklanır → düzenlemede mevcut PIN gösterilemez. Boş = (düzenlemede) aynı kalır.
  const [pin, setPin] = useState('');
  const [removePin, setRemovePin] = useState(false); // düzenlemede mevcut şifreyi tamamen kaldırma seçeneği
  const [error, setError] = useState('');

  const onPinChange = (e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4));

  const handleSave = useCallback(async () => {
    setError('');
    if (!name.trim()) {
      setError('Lütfen bir ad girin.');
      return;
    }
    if (pin && pin.length !== 4) {
      setError('Şifre tam 4 rakam olmalı (veya boş bırakın).');
      return;
    }
    const data = { name: name.trim(), avatar, ageGroup };
    // PIN hash'lenerek saklanır. Girildiyse hash'le; yeni çocukta boşsa PIN yok;
    // düzenlemede boşsa pin patch'e EKLENMEZ → mevcut PIN korunur.
    if (removePin && editing) data.pin = ''; // "şifreyi kaldır" işaretliyse boşalt (yeni pin girilse bile kaldırmaya öncelik verme — kullanıcı niyeti net olsun diye pin alanı boşken etkin)
    else if (pin) data.pin = await hashPin(pin);
    else if (!editing) data.pin = '';
    // Yeni çocuk ekleyen kullanıcının (öğretmenin) sahipliğiyle etiketlenir; düzenlemede sahip korunur.
    const saved = editing ? updateChild(child.ns, data) : addChild({ ...data, ownerId });
    onSave?.(saved);
  }, [name, avatar, ageGroup, pin, editing, child, ownerId, onSave]);

  const handleDelete = useCallback(() => {
    if (!editing) return;
    const wipe = window.confirm(
      `${child.name} profilini silmek istediğine emin misin?\n\n"Tamam" → profil silinir (oyun ilerlemesi cihazda kalır).`,
    );
    if (!wipe) return;
    removeChild(child.ns, false);
    onSave?.(null);
  }, [editing, child, onSave]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: colors.gradient.background, padding: '20px 16px', boxSizing: 'border-box', overflowY: 'auto' }}>
      <SpaceBackground starCount={28} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 440, margin: '0 auto' }}>
        <div style={{ marginBottom: 6 }}>
          <Button variant="ghost" size="sm" onClick={onCancel}>← Geri</Button>
        </div>

        <div
          style={{
            background: 'rgba(30,27,75,.65)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(148,163,184,.14)',
            borderRadius: layout.borderRadius.xl,
            boxShadow: '0 8px 32px rgba(0,0,0,.45)',
            padding: 26,
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <div style={{ fontSize: 46, lineHeight: 1, marginBottom: 6 }}>{avatar}</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text.primary, fontFamily: F, margin: 0 }}>
              {editing ? 'Öğrenciyi Düzenle' : 'Yeni Öğrenci'}
            </h1>
          </div>

          {/* Ad */}
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="cf-name" style={labelStyle}>Ad</label>
            <input
              id="cf-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn. Elif"
              maxLength={24}
              style={inputStyle}
            />
            {/* Veri minimizasyonu güven sinyali (KVKK/COPPA pratiği): gerçek ad zorunlu değil */}
            <p style={{ fontSize: 11.5, color: colors.text.tertiary, fontFamily: F, margin: '6px 2px 0' }}>
              Gerçek ad yerine rumuz da kullanabilirsiniz — soyad, fotoğraf veya doğum tarihi istenmez.
            </p>
          </div>

          {/* Avatar seçimi */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Avatar</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
              {LOCAL_AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAvatar(a)}
                  aria-label={`Avatar ${a}`}
                  aria-pressed={avatar === a}
                  style={{
                    height: 44,
                    fontSize: 24,
                    borderRadius: layout.borderRadius.md,
                    cursor: 'pointer',
                    border: avatar === a ? `2px solid ${colors.accent.primaryLight}` : `1px solid ${colors.surface.divider}`,
                    background: avatar === a ? 'rgba(108,99,255,.22)' : 'rgba(255,255,255,.04)',
                    lineHeight: 1,
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Yaş grubu */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Düzey</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {AGE_GROUPS.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => setAgeGroup(g.key)}
                  aria-pressed={ageGroup === g.key}
                  style={{
                    padding: '12px 6px',
                    borderRadius: layout.borderRadius.md,
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontFamily: F,
                    border: ageGroup === g.key ? `2px solid ${colors.accent.primaryLight}` : `1px solid ${colors.surface.divider}`,
                    background: ageGroup === g.key ? 'rgba(108,99,255,.22)' : 'rgba(255,255,255,.04)',
                  }}
                >
                  <div style={{ fontSize: 22, lineHeight: 1, marginBottom: 4 }}>{g.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: colors.text.primary }}>{g.label}</div>
                  <div style={{ fontSize: 11, color: colors.text.tertiary, marginTop: 1 }}>{g.hint}</div>
                </button>
              ))}
            </div>
          </div>

          {/* PIN */}
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="cf-pin" style={labelStyle}>{editing ? 'Yeni şifre (4 rakam — boş bırak = değişmez)' : 'Şifre (4 rakam — isteğe bağlı)'}</label>
            <input
              id="cf-pin"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={pin}
              onChange={onPinChange}
              placeholder="örn. 1234"
              style={{ ...inputStyle, letterSpacing: 6, textAlign: 'center' }}
            />
            <p style={{ fontSize: 11.5, color: colors.text.tertiary, fontFamily: F, margin: '6px 2px 0' }}>
              {editing
                ? 'Boş bırakırsan mevcut şifre korunur. Şifre cihazda güvenli (hash) saklanır.'
                : 'Boş bırakırsan çocuk şifresiz girer. Şifre, sınıfta çocukların birbirinin profilini açmasını önler.'}
            </p>
            {editing && child?.pin && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 12.5, fontWeight: 700, color: colors.text.secondary, fontFamily: F, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={removePin}
                  onChange={(e) => { setRemovePin(e.target.checked); if (e.target.checked) setPin(''); }}
                  style={{ width: 18, height: 18, accentColor: '#7c3aed' }}
                />
                Mevcut şifreyi kaldır (çocuk şifresiz girsin)
              </label>
            )}
          </div>

          {error && (
            <div
              role="alert"
              style={{
                background: colors.feedback.errorGlow,
                border: `1px solid ${colors.feedback.error}`,
                color: colors.text.primary,
                borderRadius: layout.borderRadius.md,
                padding: '10px 14px',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: F,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <Button variant="primary" size="lg" full onClick={handleSave}>
            {editing ? 'Kaydet' : 'Öğrenciyi Ekle'}
          </Button>

          {editing && (
            <button
              type="button"
              onClick={handleDelete}
              style={{
                width: '100%',
                marginTop: 12,
                padding: '10px',
                borderRadius: layout.borderRadius.md,
                border: `1px solid ${colors.feedback.error}`,
                background: 'transparent',
                color: colors.feedback.error,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: F,
                cursor: 'pointer',
              }}
            >
              🗑 Profili Sil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
