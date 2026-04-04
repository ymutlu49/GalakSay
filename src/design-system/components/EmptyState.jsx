// GalakSay Pro — 2026-03-18 — Bos durum (empty state) bileşeni
import React from 'react';
import { colors } from '../colors.js';
import { Button } from './Button.jsx';
import { typography } from '../typography.js';

export function EmptyState({
  icon = '🚀',
  title = 'Henüz veri yok',
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 48,
      textAlign: 'center',
      gap: 12,
    }}>
      <span style={{
        fontSize: 56,
        opacity: 0.4,
        display: 'block',
        marginBottom: 8,
      }}>
        {icon}
      </span>
      <h3 style={{
        color: colors.text.primary,
        fontSize: 20,
        fontWeight: 700,
        fontFamily: typography.fontFamily.display,
        margin: 0,
      }}>
        {title}
      </h3>
      {description && (
        <p style={{
          color: colors.text.tertiary,
          fontSize: 16,
          fontWeight: 500,
          margin: 0,
          maxWidth: 280,
          lineHeight: 1.5,
        }}>
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          onClick={onAction}
          style={{ marginTop: 8 }}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
