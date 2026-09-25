// GalakSay — Yerel kullanıcı (Numap'siz öğretmen/uzman) ekle/düzenle.
//
// Yönetici tarafından kullanılır. Ad + kullanıcı adı + şifre. Şifre cihazda
// tek-yönlü hash'lenir (localProfiles → utils/crypto). Düzenlemede şifre boş
// bırakılırsa mevcut şifre korunur. Kullanıcı, bu bilgilerle "Yerel Hesap"
// sekmesinden girer ve yalnız kendi eklediği öğrencileri görür.

import React, { useState, useCallback } from 'react';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import { Button } from '../design-system/components/Button.jsx';
import { PasswordInput } from '../design-system/components/PasswordInput.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { layout } from '../design-system/spacing.js';
import { addUser, updateUser, removeUser } from '../services/localProfiles.js';

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

export default function UserForm({ user = null, onSave, onCancel }) {
  const editing = !!user;
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (saving) return;
    setError('');
    if (!name.trim()) {
      setError('Lütfen ad girin.');
      return;
    }
    if (!username.trim()) {
      setError('Lütfen kullanıcı adı girin.');
      return;
    }
    if (!editing && password.length < 4) {
      setError('Şifre en az 4 karakter olmalı.');
      return;
    }
    if (editing && password && password.length < 4) {
      setError('Yeni şifre en az 4 karakter olmalı.');
      return;
    }
    setSaving(true);
    const res = editing
      ? await updateUser(user.id, { name: name.trim(), username: username.trim(), password: password || undefined })
      : await addUser({ name: name.trim(), username: username.trim(), password });
    setSaving(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    onSave?.(res.user);
  }, [name, username, password, editing, user, saving, onSave]);

  const handleDelete = useCallback(() => {
    if (!editing) return;
    const ok = window.confirm(
      `${user.name} kullanıcısını silmek istediğinizden emin misiniz?\n\nBu kullanıcının öğrencileri cihazda kalır (yalnız yönetici görebilir).`,
    );
    if (!ok) return;
    removeUser(user.id);
    onSave?.(null);
  }, [editing, user, onSave]);

  const onKey = (e) => { if (e.key === 'Enter') handleSave(); };

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
            <div style={{ fontSize: 46, lineHeight: 1, marginBottom: 6 }}>🧑‍🏫</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text.primary, fontFamily: F, margin: 0 }}>
              {editing ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı'}
            </h1>
            <p style={{ fontSize: 13, color: colors.text.secondary, fontFamily: F, margin: '6px 0 0' }}>
              Numap hesabı olmayan öğretmen/uzman
            </p>
          </div>

          {/* Ad */}
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="uf-name" style={labelStyle}>Ad Soyad</label>
            <input
              id="uf-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={onKey}
              placeholder="Örn. Ayşe Yılmaz"
              maxLength={40}
              style={inputStyle}
            />
          </div>

          {/* Kullanıcı adı */}
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="uf-username" style={labelStyle}>Kullanıcı adı</label>
            <input
              id="uf-username"
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              spellCheck={false}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={onKey}
              placeholder="örn. ayse"
              maxLength={32}
              style={inputStyle}
            />
          </div>

          {/* Şifre */}
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="uf-password" style={labelStyle}>{editing ? 'Yeni şifre (boş = değişmez)' : 'Şifre (en az 4 karakter)'}</label>
            <PasswordInput
              id="uf-password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onKey}
              placeholder={editing ? '••••••••' : 'En az 4 karakter'}
              style={inputStyle}
            />
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

          <Button variant="primary" size="lg" full loading={saving} onClick={handleSave}>
            {editing ? 'Kaydet' : 'Kullanıcı Ekle'}
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
              🗑 Kullanıcıyı Sil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
