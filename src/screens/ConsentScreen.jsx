// GalakSay Pro — KVKK md.5/6 açık rıza ekranı.
// Çocuk verisi (ad, sınıf, performans) işlendiği için ebeveyn açık rızası alınır.
// Onboarding'in ilk adımıdır; reddedilirse uygulama "rızasız mod"a geçer (sadece çocuk profili,
// analitik kayıt YOK). Bu da KVKK'da "veri minimizasyonu" prensibini destekler.

import React, { useEffect, useState } from 'react';
import { Button } from '../design-system/components/Button.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { saveConsent } from '../utils/consent.js';

export { CONSENT_KEY, loadConsent, saveConsent } from '../utils/consent.js';

const PRIVACY_TEXT = `GalakSay, çocuğunuzun matematik öğrenme deneyimini kişiselleştirmek için aşağıdaki verileri işler. Varsayılan olarak veriler yalnızca cihazda kalır; sunucuya gönderilmez, üçüncü taraflarla paylaşılmaz. Yalnızca aşağıdaki "merkezi senkron" rızasını işaretlerseniz, performans verisi öğretmenin Numap hesabına bağlı güvenli sunucuya (getnumap.com) aktarılır.

İşlenen veriler:
• Profil bilgileri: ad (rumuz olarak kullanılabilir), avatar, sınıf düzeyi.
• Performans verileri: doğru/yanlış cevaplar, tepki süreleri, ipucu kullanımı, oturum süresi.
• Tarama sonuçları: erken sayısal beceri risk düzeyi (yalnızca tarama yapılırsa).

Saklama biçimi:
• Hassas veriler cihazda AES-GCM ile şifrelenir.
• Veriler yalnızca bu cihazda kalır; cihazı sıfırlarsanız veriler de silinir.

Haklarınız (KVKK md.11):
• Verileri istediğiniz zaman dışa aktarma (JSON dosyası).
• Verileri kalıcı olarak silme (Ayarlar → Gizlilik).
• Açık rızayı geri çekme.

Öğretmen girişi:
• Öğretmen/uzman Numap hesabıyla giriş yapar; bu sırada öğretmenin kimlik bilgileri (e-posta, şifre) Numap (getnumap.com) sunucusuna iletilir.

Merkezi senkron (opsiyonel — siz işaretlemezseniz KAPALIDIR):
• İşaretlerseniz çocuğun oyun performans verisi (doğru/yanlış cevaplar, süreler, ilerleme, demografik bilgiler) getnumap.com sunucusuna güvenli aktarılır.
• Amaç: kurumsal/sınıf raporlaması, cihazlar arası birleştirme ve akademik analiz.
• İstediğiniz zaman Ayarlar → Gizlilik'ten kapatabilir ve sunucudaki veriyi sildirebilirsiniz.
• İşaretlemezseniz çocuğun verileri yalnızca cihazda kalır.

Veri sorumlusu: GalakSay yerel uygulama (çocuk verisi) + öğretmen hesabı doğrulaması ve (yalnız rıza verilirse) merkezi senkron için Numap.`;

export function ConsentScreen({ onAccept, onDecline }) {
  const [readMore, setReadMore] = useState(false);
  const [agreeDataProcessing, setAgreeDataProcessing] = useState(false);
  const [agreeAnalytics, setAgreeAnalytics] = useState(true);
  // Merkezi senkron — Numap akışında varsayılan AÇIK (rıza ekranı Numap girişinde gösterilir;
  // veri öğretmenin kendi Numap hesabına gider → kurumsal raporlama). Görünür + opt-out edilebilir.
  const [agreeDataSync, setAgreeDataSync] = useState(true);

  useEffect(() => {
    setReadMore(false);
  }, []);

  const accept = () => {
    saveConsent({
      dataProcessing: agreeDataProcessing,
      analytics: agreeAnalytics,
      dataSync: agreeDataSync,
      decision: 'accept',
    });
    onAccept?.({ analytics: agreeAnalytics, dataSync: agreeDataSync });
  };

  const decline = () => {
    saveConsent({
      dataProcessing: false,
      analytics: false,
      dataSync: false,
      decision: 'decline',
    });
    onDecline?.();
  };

  return (
    <div
      role="region"
      aria-label="Aydınlatma ve Açık Rıza"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        background: colors.gradient.background,
        color: colors.text.primary,
        fontFamily: typography.fontFamily.display,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div style={{ padding: '32px 20px 40px', maxWidth: 560, margin: '0 auto', width: '100%' }}>
        <div style={{ fontSize: 56, textAlign: 'center', marginBottom: 12 }}>
          {'🔒'}
        </div>
        <h1 style={{
          fontSize: 26,
          fontWeight: 900,
          textAlign: 'center',
          margin: '0 0 8px',
        }}>
          Aydınlatma ve Açık Rıza
        </h1>
        <p style={{
          fontSize: 14,
          color: colors.text.secondary,
          textAlign: 'center',
          margin: '0 0 20px',
        }}>
          KVKK kapsamında çocuğunuzun verilerini nasıl işlediğimizi ebeveyn olarak onaylamanız gerekir.
        </p>

        <div style={{
          background: 'rgba(30,27,75,.55)',
          border: `1px solid ${colors.surface.divider}`,
          borderRadius: 16,
          padding: 18,
          fontSize: 13,
          lineHeight: 1.6,
          color: colors.text.secondary,
          whiteSpace: 'pre-wrap',
          maxHeight: readMore ? 'none' : 220,
          overflow: 'hidden',
          position: 'relative',
        }}>
          {PRIVACY_TEXT}
          {!readMore && (
            <div style={{
              position: 'absolute',
              left: 0, right: 0, bottom: 0,
              height: 70,
              background: 'linear-gradient(to top, rgba(30,27,75,1), rgba(30,27,75,0))',
              pointerEvents: 'none',
            }} />
          )}
        </div>
        <button
          type="button"
          onClick={() => setReadMore(v => !v)}
          style={{
            display: 'block',
            margin: '8px auto 20px',
            background: 'transparent',
            border: 'none',
            color: colors.accent.primaryLight,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: typography.fontFamily.display,
          }}
        >
          {readMore ? 'Daha az göster' : 'Tümünü oku'}
        </button>

        <ConsentCheckbox
          required
          checked={agreeDataProcessing}
          onChange={setAgreeDataProcessing}
          label="Profil ve ilerleme verisinin cihazda işlenmesine açık rıza veriyorum (zorunlu)."
        />
        <ConsentCheckbox
          checked={agreeAnalytics}
          onChange={setAgreeAnalytics}
          label="Detaylı performans analizinin (hata türü, tepki süresi, ipucu kullanımı) kaydedilmesine rıza veriyorum (öneri kalitesini artırır, opsiyoneldir)."
        />
        <ConsentCheckbox
          checked={agreeDataSync}
          onChange={setAgreeDataSync}
          label="Merkezi senkron: çocuğun oyun performans verisinin getnumap.com sunucusuna güvenli aktarılmasına — kurumsal raporlama, cihazlar arası birleştirme ve akademik analiz için — rıza veriyorum (opsiyonel; istediğiniz zaman Ayarlar'dan kapatabilirsiniz)."
        />

        <div style={{
          marginTop: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <Button
            variant="primary"
            size="lg"
            full
            disabled={!agreeDataProcessing}
            onClick={accept}
          >
            Açık rıza veriyorum
          </Button>
          <Button
            variant="secondary"
            size="md"
            full
            onClick={decline}
            style={{ height: 'auto', minHeight: 44, paddingTop: 8, paddingBottom: 8, whiteSpace: 'normal', lineHeight: 1.25 }}
          >
            Rızasız devam et (analitik kapalı)
          </Button>
        </div>

        <p style={{
          marginTop: 16,
          fontSize: 11,
          color: colors.text.tertiary,
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          Rızanızı dilediğiniz zaman Ayarlar → Gizlilik bölümünden geri çekebilir,
          verilerinizi indirebilir veya silebilirsiniz.
        </p>
      </div>
    </div>
  );
}

function ConsentCheckbox({ checked, onChange, label, required }) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '12px 14px',
      borderRadius: 12,
      background: checked ? 'rgba(108,99,255,.10)' : 'rgba(30,27,75,.4)',
      border: `1px solid ${checked ? colors.accent.primary + '60' : colors.surface.divider}`,
      cursor: 'pointer',
      marginBottom: 10,
      transition: 'all 150ms ease',
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          marginTop: 2,
          width: 20,
          height: 20,
          accentColor: colors.accent.primary,
          cursor: 'pointer',
        }}
      />
      <span style={{
        fontSize: 13,
        lineHeight: 1.5,
        color: colors.text.primary,
        fontFamily: typography.fontFamily.display,
      }}>
        {label}
        {required && (
          <span style={{ color: '#f87171', marginLeft: 4, fontWeight: 800 }}>*</span>
        )}
      </span>
    </label>
  );
}

export default ConsentScreen;
