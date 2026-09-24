// GalakSay — Şifre alanı + göster/gizle (göz) düğmesi + Caps Lock uyarısı.
//
// type'ı kendi yönetir (password ↔ text); kalan tüm input prop'ları (value,
// onChange, onKeyDown, placeholder, id, autoComplete…) olduğu gibi geçirilir.
// Caps Lock açıkken alanın altında küçük uyarı gösterir (NN/g giriş-formu pratiği —
// maskeli alanda en sık "şifrem hatalı" nedeni budur).
// Tek bir yerde tanımlı → tüm şifre alanlarında tutarlı davranış (sürdürülebilir).

import React, { useState } from 'react';

export function PasswordInput({ style, eyeColor = '#94a3b8', ...inputProps }) {
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);

  const watchCaps = (e) => {
    try { setCaps(e.getModifierState ? e.getModifierState('CapsLock') : false); } catch { /* eski tarayıcı */ }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        {...inputProps}
        type={show ? 'text' : 'password'}
        onKeyDown={(e) => { watchCaps(e); inputProps.onKeyDown?.(e); }}
        onKeyUp={(e) => { watchCaps(e); inputProps.onKeyUp?.(e); }}
        onBlur={(e) => { setCaps(false); inputProps.onBlur?.(e); }}
        style={{ ...style, paddingRight: 46 }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Şifreyi gizle' : 'Şifreyi göster'}
        title={show ? 'Şifreyi gizle' : 'Şifreyi göster'}
        tabIndex={-1}
        style={{
          position: 'absolute',
          right: 6,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: 17,
          lineHeight: 1,
          color: eyeColor,
          padding: 0,
        }}
      >
        {show ? '🙈' : '👁️'}
      </button>
      {caps && (
        <div role="status" style={{
          position: 'absolute', left: 2, top: '100%', marginTop: 4,
          fontSize: 11.5, fontWeight: 700, color: '#fbbf24',
          display: 'flex', alignItems: 'center', gap: 4, pointerEvents: 'none',
        }}>
          ⇪ Caps Lock açık
        </div>
      )}
    </div>
  );
}
