// GalakSay Analytics — 2026-03-18 — Uyarı listesi bileşeni
import React from 'react';
import { motion } from 'framer-motion';

const TYPE_STYLES = {
  positive: { bg: 'rgba(52,211,153,0.1)', border: '#34d399', icon: '✅', label: 'Olumlu' },
  attention: { bg: 'rgba(250,204,21,0.1)', border: '#facc15', icon: '⚠️', label: 'Dikkat' },
  critical: { bg: 'rgba(248,113,113,0.1)', border: '#f87171', icon: '🔴', label: 'Kritik' },
};

export default function AlertList({ alerts, onDismiss }) {
  if (!alerts || alerts.length === 0) {
    return <div style={{ color: '#cbd5e1', textAlign: 'center', padding: 20 }}>Bildirim yok</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {alerts.map((alert, i) => {
        const style = TYPE_STYLES[alert.type] || TYPE_STYLES.attention;
        return (
          <motion.div
            key={alert.alertId || i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: style.bg,
              border: `1px solid ${style.border}`,
              borderRadius: 8,
              padding: '10px 14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span>{style.icon}</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{alert.title}</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: 12, margin: '0 0 4px', lineHeight: 1.4 }}>{alert.message}</p>
                {alert.recommendation && (
                  <p style={{ color: '#a8b2d1', fontSize: 11, margin: 0, fontStyle: 'italic' }}>{alert.recommendation}</p>
                )}
              </div>
              {onDismiss && (
                <button
                  onClick={() => onDismiss(alert.alertId)}
                  style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}
                >
                  ×
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
