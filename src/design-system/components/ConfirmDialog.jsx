// GalakSay Pro — 2026-03-20 — Onay dialog bileşeni
// Çıkış, silme, baştan başlama gibi geri dönüşü olmayan işlemler için
import React from 'react';
import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';
import { colors } from '../colors.js';
import { typography } from '../typography.js';

/**
 * ConfirmDialog — Kullanıcıdan onay isteyen modal dialog.
 *
 * Props:
 * - open: Dialog açık mı
 * - onConfirm: Onay verildiğinde
 * - onCancel: İptal edildiğinde
 * - title: Dialog başlığı
 * - message: Açıklama mesajı
 * - confirmLabel: Onay butonu metni (varsayılan: "Evet")
 * - cancelLabel: İptal butonu metni (varsayılan: "Vazgeç")
 * - variant: 'danger' | 'warning' | 'info' (varsayılan: 'warning')
 * - icon: Opsiyonel ikon emoji
 */
export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title = 'Emin misin?',
  message,
  confirmLabel = 'Evet',
  cancelLabel = 'Vazgeç',
  variant = 'warning',
  icon,
}) {
  const variantConfig = VARIANT_CONFIG[variant] || VARIANT_CONFIG.warning;
  const displayIcon = icon || variantConfig.icon;

  return (
    <Modal
      open={open}
      onClose={onCancel}
      maxWidth={360}
      showClose={false}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        padding: '8px 0',
        fontFamily: typography.fontFamily.display,
        textAlign: 'center',
      }}>
        {/* İkon */}
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 20,
          background: `${variantConfig.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
        }}>
          {displayIcon}
        </div>

        {/* Başlık */}
        <h3 style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 800,
          color: colors.text.primary,
        }}>
          {title}
        </h3>

        {/* Mesaj */}
        {message && (
          <p style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 500,
            color: colors.text.secondary,
            lineHeight: 1.5,
            maxWidth: 280,
          }}>
            {message}
          </p>
        )}

        {/* Butonlar */}
        <div style={{
          display: 'flex',
          gap: 10,
          width: '100%',
          marginTop: 8,
        }}>
          <Button
            variant="secondary"
            size="md"
            onClick={onCancel}
            style={{ flex: 1 }}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            style={{ flex: 1 }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

const VARIANT_CONFIG = {
  danger: {
    icon: '\u26A0\uFE0F',
    color: colors.accent.tertiary,
  },
  warning: {
    icon: '\uD83E\uDD14',
    color: colors.feedback.warning,
  },
  info: {
    icon: '\u2139\uFE0F',
    color: colors.feedback.info,
  },
};
