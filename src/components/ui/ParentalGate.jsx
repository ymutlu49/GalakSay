// GalakSay Pro — Ebeveyn kapısı (parental gate).
// Çocuğun erişmemesi gereken alanlardan (KVKK rızası, veri silme/dışa aktarma, dashboard ilk kurulum)
// önce ebeveynin yanında olduğunu doğrular. Çocuk dostu uygulama standardı (Apple/Google) gereği
// hesap işlemi/PII formu yerine yaş-uygun-olmayan bir matematik sorusu sorulur.
//
// Tek bir bileşen: <ParentalGate open onSuccess onClose />.
// Sorular iki basamaklı toplama/çıkarma — diskalkuli olan çocuk için "kolayca yapılır" sayılmaz, bu yüzden
// sayılar 23-89 aralığında ve 1+1 gibi triviallıktan uzak tutulur.

import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../design-system/components/Modal.jsx';
import { colors } from '../../design-system/colors.js';
import { typography } from '../../design-system/typography.js';
import { dialogButtonStyle } from '../../design-system/presets.js';

function generateProblem() {
  const a = 23 + Math.floor(Math.random() * 67); // 23..89
  const b = 23 + Math.floor(Math.random() * 67);
  const op = Math.random() < 0.5 ? '+' : '-';
  const [x, y] = op === '-' && b > a ? [b, a] : [a, b];
  const answer = op === '+' ? x + y : x - y;
  return { x, y, op, answer };
}

export function ParentalGate({ open, onSuccess, onClose, reason }) {
  const [problem, setProblem] = useState(() => generateProblem());
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (open) {
      setProblem(generateProblem());
      setInput('');
      setError('');
      setAttempts(0);
    }
  }, [open]);

  const lockedOut = attempts >= 3;

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (lockedOut) return;
    const num = parseInt(input, 10);
    if (Number.isNaN(num)) {
      setError('Sayı gir');
      return;
    }
    if (num === problem.answer) {
      onSuccess?.();
    } else {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= 3) {
        setError('3 deneme aşıldı, ebeveyn kapısı kilitlendi.');
      } else {
        setError('Yanlış. Yeni soru geldi.');
        setProblem(generateProblem());
        setInput('');
      }
    }
  };

  const helperText = useMemo(() => {
    return reason
      ? `Bu alan ebeveyn/öğretmen içindir. Devam etmek için soruyu yanıtla: ${reason}`
      : 'Bu alan ebeveyn/öğretmen içindir. Devam etmek için soruyu yanıtla.';
  }, [reason]);

  return (
    <Modal open={open} onClose={onClose} title="Ebeveyn / Öğretmen Doğrulaması" maxWidth={420}>
      <p style={{
        color: colors.text.secondary,
        fontSize: 14,
        margin: '0 0 16px',
        fontFamily: typography.fontFamily.display,
        lineHeight: 1.5,
      }}>
        {helperText}
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div
          aria-live="polite"
          style={{
            background: 'rgba(108,99,255,.08)',
            border: `1px solid ${colors.surface.divider}`,
            borderRadius: 14,
            padding: '18px 20px',
            textAlign: 'center',
            fontSize: 32,
            fontWeight: 900,
            color: colors.text.primary,
            fontFamily: typography.fontFamily.display,
            letterSpacing: 1,
          }}
        >
          {problem.x} {problem.op} {problem.y} = ?
        </div>

        <input
          type="number"
          inputMode="numeric"
          autoFocus
          aria-label="Cevap"
          value={input}
          disabled={lockedOut}
          onChange={(e) => { setInput(e.target.value); setError(''); }}
          placeholder="Cevap"
          style={{
            padding: '14px 16px',
            borderRadius: 12,
            border: `2px solid ${error ? '#ef4444' : colors.surface.divider}`,
            background: colors.surface.input,
            color: colors.text.primary,
            fontSize: 22,
            fontWeight: 700,
            fontFamily: typography.fontFamily.display,
            outline: 'none',
            textAlign: 'center',
          }}
        />

        {error && (
          <div role="alert" style={{
            color: '#f87171',
            fontSize: 13,
            fontWeight: 600,
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button type="button" onClick={onClose} style={dialogButtonStyle('secondary')}>
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={lockedOut || input === ''}
            style={{
              ...dialogButtonStyle('primary'),
              flex: 2,
              ...(lockedOut && {
                background: 'rgba(148,163,184,.25)',
                cursor: 'not-allowed',
              }),
            }}
          >
            Doğrula
          </button>
        </div>

        <p style={{
          fontSize: 11,
          color: colors.text.tertiary,
          textAlign: 'center',
          margin: 0,
          marginTop: 4,
        }}>
          Deneme: {attempts} / 3
        </p>
      </form>
    </Modal>
  );
}

export default ParentalGate;
