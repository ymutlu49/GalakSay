// GalakSay — Giriş-yolu seçimi (splash sonrası ilk ekran, Numap'siz front door).
//
// İki eşit bar:
//  • 🧒 Öğrenci Girişi — çocuk kendi yerel profilini seçer (PIN) ve oyununa devam eder.
//  • 🧑‍🏫 Öğretmen / Uzman Girişi — Numap hesabı VEYA bu cihazda yönetici girişi.
//    (Yönetim — öğrenci ekle/çıkar, ayarlar — giriş sonrası ROL'e göre açılır; ayrı
//    bir "cihaz yönetimi" kapısı yoktur.)
//
// Tasarım: hub estetiği (SpaceBackground + iki eşit prominent bar).

import React from 'react';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { layout } from '../design-system/spacing.js';

const TONES = {
  purple: { bg: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', shadow: '0 8px 26px rgba(108,99,255,.38)' },
  teal: { bg: 'linear-gradient(135deg,#0ea5e9,#06b6d4)', shadow: '0 8px 26px rgba(14,165,233,.36)' },
};

function ModeBar({ icon, title, desc, onClick, tone = 'purple' }) {
  const t = TONES[tone] || TONES.purple;
  return (
    <button
      type="button"
      onClick={onClick}
      className="space-btn-hover"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        width: '100%',
        textAlign: 'left',
        padding: '22px 22px',
        borderRadius: layout.borderRadius.lg,
        cursor: 'pointer',
        fontFamily: typography.fontFamily.display,
        transition: 'transform .15s ease, box-shadow .15s ease',
        border: 'none',
        background: t.bg,
        boxShadow: t.shadow,
      }}
    >
      <span style={{ fontSize: 42, flexShrink: 0, lineHeight: 1 }}>{icon}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 20, fontWeight: 800, color: '#fff' }}>{title}</span>
        <span style={{ display: 'block', fontSize: 12.5, color: 'rgba(255,255,255,.9)', marginTop: 3, lineHeight: 1.3 }}>{desc}</span>
      </span>
      <span style={{ fontSize: 24, color: '#fff', flexShrink: 0 }}>›</span>
    </button>
  );
}

export default function WelcomeScreen({ onStudent, onAdult }) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: colors.gradient.backgroundKids, padding: '20px 16px', boxSizing: 'border-box', overflowY: 'auto' }}>
      <SpaceBackground starCount={32} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 460, margin: '0 auto', minHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ fontSize: 60, marginBottom: 10, lineHeight: 1 }}>🪐</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: colors.text.primary, fontFamily: typography.fontFamily.display, margin: '0 0 6px' }}>
            GalakSay'a Hoş Geldin!
          </h1>
          {/* Değer önerisi tek cümlede (onboarding pratiği: değeri ilk ekranda söyle) */}
          <p style={{ fontSize: 14.5, lineHeight: 1.5, color: colors.text.secondary, fontFamily: typography.fontFamily.display, margin: 0 }}>
            Diskalkuli için uyarlanabilir, oyunlaştırılmış matematik yolculuğu
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ModeBar
            tone="purple"
            icon="🧒"
            title="Öğrenci Girişi"
            desc="Profilini seç, oyununa kaldığın yerden devam et"
            onClick={onStudent}
          />
          <ModeBar
            tone="teal"
            icon="🧑‍🏫"
            title="Öğretmen / Uzman Girişi"
            desc="Numap hesabınızla (getnumap.com) ya da bu cihazdaki hesapla girin"
            onClick={onAdult}
          />
        </div>

        {/* Yön levhası — iki ürünün ilişkisini TEK cümlede anlat (kafa karışıklığını azalt) */}
        <p style={{
          marginTop: 18, fontSize: 12, lineHeight: 1.5, textAlign: 'center',
          color: colors.text.tertiary, fontFamily: typography.fontFamily.display,
        }}>
          🔗 Numap, tarama ve raporlama platformudur — orada değerlendirdiğiniz öğrenciler
          GalakSay'da otomatik listelenir ve oyun ilerlemeleri Numap'e işlenir.
          Numap hesabınız yoksa tüm oyunu yerel hesapla kullanabilirsiniz.
        </p>
      </div>
    </div>
  );
}
