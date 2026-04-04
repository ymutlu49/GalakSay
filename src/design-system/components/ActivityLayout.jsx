// GalakSay Pro — 2026-03-20 — Etkinlik ekranı ortak şablonu (Bölüm 2.4)
// Tüm etkinlik/oyun ekranları bu düzeni kullanır — FeedbackOverlay entegrasyonu
import React, { useState, useCallback } from 'react';
import { colors } from '../colors.js';
import { layout, spacing } from '../spacing.js';
import { Button } from './Button.jsx';
import { ProgressBar } from './ProgressBar.jsx';
import { typography } from '../typography.js';
import { FeedbackOverlay } from './FeedbackOverlay.jsx';

// ═══ ÜST BAR ═══════════════════════════════════════════════════════════════════
function TopBar({
  categoryName,
  ltLevel,
  onBack,
  onSettings,
  onSound,
  onHelp,
  soundEnabled = true,
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${spacing[3]}px ${spacing[4]}px`,
      borderBottom: `1px solid ${colors.surface.divider}`,
      background: 'rgba(11, 14, 45, 0.6)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      position: 'relative',
      zIndex: 10,
      flexShrink: 0,
    }}>
      {/* Sol: Geri butonu */}
      <button
        onClick={onBack}
        aria-label="Geri"
        style={{
          width: 40,
          height: 40,
          borderRadius: layout.borderRadius.md,
          border: 'none',
          background: 'rgba(108,99,255,.1)',
          color: colors.text.primary,
          fontSize: 18,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 150ms ease',
          flexShrink: 0,
        }}
      >
        {'\u2190'}
      </button>

      {/* Orta: Kategori + LT düzeyi */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        justifyContent: 'center',
      }}>
        {categoryName && (
          <span style={{
            fontSize: 14,
            fontWeight: 700,
            color: colors.text.secondary,
            fontFamily: typography.fontFamily.display,
          }}>
            {categoryName}
          </span>
        )}
        {ltLevel != null && (
          <span style={{
            fontSize: 12,
            fontWeight: 800,
            color: colors.accent.primary,
            background: `${colors.accent.primary}15`,
            padding: '2px 8px',
            borderRadius: 6,
            fontFamily: typography.fontFamily.display,
          }}>
            L{ltLevel}
          </span>
        )}
      </div>

      {/* Sag: Ayarlar, ses, yardim */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        {onSettings && (
          <IconButton onClick={onSettings} label="Ayarlar">{'\u2699\uFE0F'}</IconButton>
        )}
        {onSound && (
          <IconButton onClick={onSound} label={soundEnabled ? 'Sesi kapat' : 'Sesi ac'}>
            {soundEnabled ? '\uD83D\uDD0A' : '\uD83D\uDD07'}
          </IconButton>
        )}
        {onHelp && (
          <IconButton onClick={onHelp} label="Yardim">{'\u2753'}</IconButton>
        )}
      </div>
    </div>
  );
}

// ═══ IKON BUTON ════════════════════════════════════════════════════════════════
function IconButton({ children, onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: 36,
        height: 36,
        borderRadius: layout.borderRadius.sm,
        border: 'none',
        background: 'transparent',
        color: colors.text.secondary,
        fontSize: 16,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 150ms ease',
      }}
    >
      {children}
    </button>
  );
}

// ═══ ALT KONTROL BARI ══════════════════════════════════════════════════════════
function BottomBar({
  representationMode = 'concrete',
  onRepresentationChange,
  showRepresentationToggle = true,
  onHint,
  hintDisabled = false,
  currentQuestion = 0,
  totalQuestions = 10,
}) {
  const modes = [
    { key: 'concrete', icon: '\uD83D\uDD35', label: 'Somut' },
    { key: 'visual', icon: '\uD83D\uDCCA', label: 'Gorsel' },
    { key: 'symbolic', icon: '\uD83D\uDD22', label: 'Sembolik' },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: `${spacing[3]}px ${spacing[4]}px ${spacing[4]}px`,
      borderTop: `1px solid ${colors.surface.divider}`,
      background: 'rgba(11, 14, 45, 0.6)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Temsil katmani toggle'lari */}
        {showRepresentationToggle && (
          <div style={{ display: 'flex', gap: 4 }}>
            {modes.map(m => (
              <button
                key={m.key}
                onClick={() => onRepresentationChange?.(m.key)}
                aria-label={m.label}
                aria-pressed={representationMode === m.key}
                style={{
                  padding: '6px 12px',
                  borderRadius: layout.borderRadius.sm,
                  border: representationMode === m.key
                    ? `2px solid ${colors.accent.primary}`
                    : '1px solid rgba(148,163,184,.12)',
                  background: representationMode === m.key
                    ? `${colors.accent.primary}15`
                    : 'rgba(30,27,75,.3)',
                  color: representationMode === m.key
                    ? colors.accent.primary
                    : colors.text.tertiary,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: typography.fontFamily.display,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 14 }}>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        )}
        {!showRepresentationToggle && <div />}

        {/* Ipucu butonu */}
        {onHint && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onHint}
            disabled={hintDisabled}
            icon={'\uD83D\uDEF8'}
            style={{
              border: `1px solid ${colors.feedback.hint}30`,
              color: colors.feedback.hint,
            }}
          >
            Ipucu
          </Button>
        )}
      </div>

      {/* Ilerleme cubugu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ProgressBar
          value={currentQuestion}
          max={totalQuestions}
          height={6}
        />
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          color: colors.text.tertiary,
          fontFamily: typography.fontFamily.display,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {currentQuestion}/{totalQuestions}
        </span>
      </div>
    </div>
  );
}

// ═══ ANA ETKİNLİK ALANI ═══════════════════════════════════════════════════════
/**
 * ActivityLayout — Tüm etkinlik ekranları için ortak şablon.
 *
 * Düzen:
 * ┌──────────────────────────────────────────┐
 * │  <- Geri  [Kategori: Sayma] [L8]  ⚙️ 🔊 ❓ │  <- Üst bar
 * ├──────────────────────────────────────────┤
 * │                                          │
 * │           ANA ETKİNLİK ALANI             │  <- %70-80
 * │                                          │
 * ├──────────────────────────────────────────┤
 * │  [Somut][Görsel][Sembolik]  [İpucu]      │  <- Alt bar
 * │  ────── İlerleme: 3/10 ──────            │
 * └──────────────────────────────────────────┘
 */
export function ActivityLayout({
  children,
  // Üst bar props
  categoryName,
  ltLevel,
  onBack,
  onSettings,
  onSound,
  onHelp,
  soundEnabled = true,
  // Alt bar props
  representationMode,
  onRepresentationChange,
  showRepresentationToggle = true,
  onHint,
  hintDisabled = false,
  currentQuestion = 0,
  totalQuestions = 10,
  // Geri bildirim overlay
  feedbackType = null, // 'correct' | 'wrong' | 'hint' | null
  feedbackMessage,
  onFeedbackComplete,
  // Stil
  showTopBar = true,
  showBottomBar = true,
  contentStyle,
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '100vh',
      minHeight: '100dvh',
      background: colors.gradient.background,
      fontFamily: typography.fontFamily.display,
      position: 'relative',
    }}>
      {/* Üst bar */}
      {showTopBar && (
        <TopBar
          categoryName={categoryName}
          ltLevel={ltLevel}
          onBack={onBack}
          onSettings={onSettings}
          onSound={onSound}
          onHelp={onHelp}
          soundEnabled={soundEnabled}
        />
      )}

      {/* Ana etkinlik alanı */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[6],
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        position: 'relative',
        background: colors.background.secondary,
        ...contentStyle,
      }}>
        {children}

        {/* Doğru/yanlış geri bildirim overlay */}
        <FeedbackOverlay
          type={feedbackType}
          message={feedbackMessage}
          onComplete={onFeedbackComplete}
        />
      </div>

      {/* Alt kontrol barı */}
      {showBottomBar && (
        <BottomBar
          representationMode={representationMode}
          onRepresentationChange={onRepresentationChange}
          showRepresentationToggle={showRepresentationToggle}
          onHint={onHint}
          hintDisabled={hintDisabled}
          currentQuestion={currentQuestion}
          totalQuestions={totalQuestions}
        />
      )}
    </div>
  );
}
