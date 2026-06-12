// GalakSay — Öğretmen / Uzman girişi (sekmeli).
//
//  • Numap sekmesi: yetişkin Numap hesabıyla (e-posta+şifre) çevrimiçi giriş →
//    tanıladığı çocuklar (onSuccess). Kimlik getnumap.com'a iletilir.
//  • Yerel Hesap sekmesi — iki alt-görünüm:
//     – Kullanıcı girişi (varsayılan): yöneticinin tanımladığı Numap'siz öğretmen/
//       uzman, kullanıcı adı + şifre ile girer (onLocalUser). Cihaz-yerel, hash'li.
//       Her kullanıcı yalnız kendi eklediği öğrencileri görür.
//     – Yönetici girişi (alt-link): yerel YÖNETİCİ (4-haneli PIN). İlk kullanımda
//       PIN oluşturulur; sonra doğrulanır → yönetim hub'ı (onLocalAdmin): öğrenci +
//       KULLANICI ekle/çıkar, ayarlar. PIN, yönetimi çocuklardan/kullanıcılardan korur.

import React, { useState, useCallback } from 'react';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import { Button } from '../design-system/components/Button.jsx';
import { PasswordInput } from '../design-system/components/PasswordInput.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { layout } from '../design-system/spacing.js';
import { login as numapLogin, ApiError } from '../services/numapApi.js';
import { hasAdminPin, setAdminPin, verifyAdminPin, verifyUser, userCount } from '../services/localProfiles.js';

const F = typography.fontFamily.display;

const inputStyle = {
  width: '100%',
  height: 52,
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

const labelStyle = {
  display: 'block',
  fontSize: 14,
  fontWeight: 700,
  color: colors.text.secondary,
  fontFamily: F,
  marginBottom: 6,
};

// Yerel hesap sekmesinde kullanıcı↔yönetici arası geçiş alt-linki.
const linkBtnStyle = {
  display: 'block',
  width: '100%',
  marginTop: 16,
  padding: '8px 0',
  border: 'none',
  background: 'transparent',
  color: colors.accent.primaryLight,
  fontSize: 13.5,
  fontWeight: 700,
  fontFamily: F,
  cursor: 'pointer',
  textAlign: 'center',
};

const errorBoxStyle = {
  background: colors.feedback.errorGlow,
  border: `1px solid ${colors.feedback.error}`,
  color: colors.text.primary,
  borderRadius: layout.borderRadius.md,
  padding: '10px 14px',
  fontSize: 14,
  fontWeight: 600,
  fontFamily: F,
  marginBottom: 16,
};

export default function TeacherLogin({ onSuccess, onLocalUser, onLocalAdmin, onBack }) {
  const [tab, setTab] = useState('numap'); // 'numap' | 'local'

  // ── Numap ──
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Yerel hesap: kullanıcı (öğretmen/uzman) girişi ↔ yönetici (PIN) ──
  const [localView, setLocalView] = useState('user'); // 'user' | 'admin'
  // Yerel kullanıcı girişi (kullanıcı adı + şifre)
  const [username, setUsername] = useState('');
  const [userPass, setUserPass] = useState('');
  const [userError, setUserError] = useState('');
  const [userLoading, setUserLoading] = useState(false);

  // ── Yerel yönetici (PIN) ──
  const createMode = !hasAdminPin();
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [localError, setLocalError] = useState('');

  const handleNumap = useCallback(async () => {
    if (loading) return;
    setError('');
    if (!email.trim() || !password) {
      setError('Lütfen e-posta ve şifrenizi girin.');
      return;
    }
    try {
      const consent = window.galaksayRequireConsent ? await window.galaksayRequireConsent() : true;
      if (consent === false) return;
    } catch {
      /* köprü yoksa devam et */
    }
    setLoading(true);
    try {
      const user = await numapLogin(email.trim().toLowerCase(), password);
      onSuccess?.(user);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.status === 401) setError('E-posta veya şifre hatalı.');
        else if (e.status === 429) setError('Çok fazla deneme. Lütfen birkaç dakika sonra tekrar deneyin.');
        else setError(e.message || 'Giriş başarısız oldu.');
      } else {
        setError('Sunucuya bağlanılamadı — ilk giriş için internet bağlantısı gerekli.');
      }
    } finally {
      setLoading(false);
    }
  }, [email, password, loading, onSuccess]);

  // Yerel kullanıcı (Numap'siz öğretmen/uzman) — kullanıcı adı + şifre doğrula (cihaz-yerel, hash'li).
  const handleLocalUser = useCallback(async () => {
    if (userLoading) return;
    setUserError('');
    if (!username.trim() || !userPass) {
      setUserError('Lütfen kullanıcı adı ve şifrenizi girin.');
      return;
    }
    setUserLoading(true);
    try {
      const u = await verifyUser(username.trim(), userPass);
      if (u) onLocalUser?.(u);
      else setUserError('Kullanıcı adı veya şifre hatalı.');
    } catch {
      setUserError('Giriş sırasında bir sorun oluştu.');
    } finally {
      setUserLoading(false);
    }
  }, [username, userPass, userLoading, onLocalUser]);

  const handleLocal = useCallback(async () => {
    setLocalError('');
    if (createMode) {
      if (pin.length !== 4) {
        setLocalError('Şifre tam 4 rakam olmalı.');
        return;
      }
      if (pin !== pin2) {
        setLocalError('Şifreler uyuşmuyor.');
        return;
      }
      await setAdminPin(pin); // PBKDF2 ile hash'lenerek saklanır
      onLocalAdmin?.();
    } else {
      if (await verifyAdminPin(pin)) {
        onLocalAdmin?.();
      } else {
        setLocalError('Şifre yanlış.');
        setPin('');
      }
    }
  }, [createMode, pin, pin2, onLocalAdmin]);

  const onNumapKey = (e) => { if (e.key === 'Enter') handleNumap(); };
  const onLocalUserKey = (e) => { if (e.key === 'Enter') handleLocalUser(); };
  const onLocalKey = (e) => { if (e.key === 'Enter') handleLocal(); };
  const digits = (v) => v.replace(/\D/g, '').slice(0, 4);

  const tabBtn = (key, label) => (
    <button
      type="button"
      onClick={() => { setTab(key); setError(''); setLocalError(''); setUserError(''); }}
      style={{
        flex: 1,
        padding: '11px 0',
        borderRadius: layout.borderRadius.md,
        border: 'none',
        cursor: 'pointer',
        fontFamily: F,
        fontSize: 14.5,
        fontWeight: 800,
        background: tab === key ? 'rgba(108,99,255,.25)' : 'transparent',
        color: tab === key ? colors.text.primary : colors.text.tertiary,
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.gradient.background,
        padding: 20,
        boxSizing: 'border-box',
      }}
    >
      <SpaceBackground starCount={50} />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 420,
          background: 'rgba(30,27,75,.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(148,163,184,.14)',
          borderRadius: layout.borderRadius.xl,
          boxShadow: '0 8px 32px rgba(0,0,0,.45)',
          padding: 28,
        }}
      >
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{ border: 'none', background: 'transparent', color: colors.text.secondary, fontSize: 14, fontWeight: 700, fontFamily: F, cursor: 'pointer', padding: '2px 0', marginBottom: 6 }}
          >
            ← Geri
          </button>
        )}

        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 46, marginBottom: 6 }}>🧑‍🏫</div>
          <h1 style={{ fontSize: 23, fontWeight: 800, color: colors.text.primary, fontFamily: F, margin: 0 }}>
            Öğretmen / Uzman Girişi
          </h1>
        </div>

        {/* Sekmeler */}
        <div style={{ display: 'flex', gap: 6, padding: 4, borderRadius: layout.borderRadius.md, background: 'rgba(0,0,0,.18)', marginBottom: 20 }}>
          {tabBtn('numap', 'Numap Hesabı')}
          {tabBtn('local', 'Yerel Hesap')}
        </div>

        {tab === 'numap' ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="teacher-email" style={labelStyle}>E-posta</label>
              <input
                id="teacher-email"
                type="email"
                inputMode="email"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={onNumapKey}
                placeholder="ornek@okul.edu.tr"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="teacher-password" style={labelStyle}>Şifre</label>
              <PasswordInput
                id="teacher-password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={onNumapKey}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>
            {error && (
              <div role="alert" style={{ background: colors.feedback.errorGlow, border: `1px solid ${colors.feedback.error}`, color: colors.text.primary, borderRadius: layout.borderRadius.md, padding: '10px 14px', fontSize: 14, fontWeight: 600, fontFamily: F, marginBottom: 16 }}>
                {error}
              </div>
            )}
            <Button variant="primary" size="lg" full loading={loading} onClick={handleNumap}>
              Giriş Yap
            </Button>
            {/* Ölü uç bırakma (NN/g): şifre sıfırlama Numap platformunda — net yol göster */}
            <a
              href="https://getnumap.com"
              target="_blank"
              rel="noreferrer"
              style={{ ...linkBtnStyle, textDecoration: 'none' }}
            >
              Şifremi unuttum — getnumap.com'da sıfırla ↗
            </a>
            <p style={{ margin: '6px 0 0', fontSize: 12, lineHeight: 1.5, color: colors.text.tertiary, fontFamily: F, textAlign: 'center' }}>
              Numap hesabınız yoksa getnumap.com'da ücretsiz oluşturabilir ya da
              "Yerel Hesap" sekmesiyle bu cihazda internetsiz çalışabilirsiniz.
            </p>
          </>
        ) : localView === 'user' ? (
          <>
            <p style={{ fontSize: 13.5, lineHeight: 1.5, color: colors.text.secondary, fontFamily: F, margin: '0 0 16px', textAlign: 'center' }}>
              Yöneticinin tanımladığı kullanıcı adı ve şifrenizle girin.
            </p>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="local-username" style={labelStyle}>Kullanıcı adı</label>
              <input
                id="local-username"
                type="text"
                autoCapitalize="none"
                autoComplete="username"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={onLocalUserKey}
                placeholder="kullanıcı adınız"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="local-password" style={labelStyle}>Şifre</label>
              <PasswordInput
                id="local-password"
                autoComplete="current-password"
                value={userPass}
                onChange={(e) => setUserPass(e.target.value)}
                onKeyDown={onLocalUserKey}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>
            {userError && <div role="alert" style={errorBoxStyle}>{userError}</div>}
            <Button variant="primary" size="lg" full loading={userLoading} onClick={handleLocalUser}>
              Giriş Yap
            </Button>
            <p style={{ marginTop: 10, marginBottom: 0, fontSize: 12, lineHeight: 1.5, color: colors.text.tertiary, fontFamily: F, textAlign: 'center' }}>
              Şifrenizi mi unuttunuz? Cihaz yöneticiniz "Kullanıcılar" panelinden yenileyebilir.
            </p>
            {userCount() === 0 && (
              <p style={{ marginTop: 14, fontSize: 12.5, lineHeight: 1.5, color: colors.text.tertiary, fontFamily: F, textAlign: 'center' }}>
                Henüz yerel kullanıcı tanımlı değil. Yönetici girişinden yeni kullanıcı ekleyebilirsiniz.
              </p>
            )}
            <button type="button" onClick={() => { setLocalView('admin'); setUserError(''); }} style={linkBtnStyle}>
              🔑 Yönetici girişi
            </button>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13.5, lineHeight: 1.5, color: colors.text.secondary, fontFamily: F, margin: '0 0 16px', textAlign: 'center' }}>
              {createMode
                ? 'Bu cihazda yönetim için bir yönetici şifresi belirleyin. Çocuklar bu paneli açamaz.'
                : 'Yönetim paneline girmek için yönetici şifrenizi girin.'}
            </p>
            <div style={{ marginBottom: createMode ? 14 : 20 }}>
              <label htmlFor="admin-pin" style={labelStyle}>{createMode ? 'Yeni yönetici şifresi (4 rakam)' : 'Yönetici şifresi'}</label>
              <PasswordInput
                id="admin-pin"
                inputMode="numeric"
                autoComplete="off"
                value={pin}
                onChange={(e) => setPin(digits(e.target.value))}
                onKeyDown={createMode ? undefined : onLocalKey}
                placeholder="••••"
                style={{ ...inputStyle, letterSpacing: 8, textAlign: 'center' }}
              />
            </div>
            {createMode && (
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="admin-pin2" style={labelStyle}>Şifreyi tekrar girin</label>
                <PasswordInput
                  id="admin-pin2"
                  inputMode="numeric"
                  autoComplete="off"
                  value={pin2}
                  onChange={(e) => setPin2(digits(e.target.value))}
                  onKeyDown={onLocalKey}
                  placeholder="••••"
                  style={{ ...inputStyle, letterSpacing: 8, textAlign: 'center' }}
                />
              </div>
            )}
            {localError && (
              <div role="alert" style={{ background: colors.feedback.errorGlow, border: `1px solid ${colors.feedback.error}`, color: colors.text.primary, borderRadius: layout.borderRadius.md, padding: '10px 14px', fontSize: 14, fontWeight: 600, fontFamily: F, marginBottom: 16 }}>
                {localError}
              </div>
            )}
            <Button variant="primary" size="lg" full onClick={handleLocal}>
              {createMode ? 'Şifre Oluştur & Gir' : 'Yönetim Paneline Gir'}
            </Button>
            <button type="button" onClick={() => { setLocalView('user'); setLocalError(''); }} style={linkBtnStyle}>
              ← Kullanıcı girişi
            </button>
          </>
        )}
      </div>
    </div>
  );
}
