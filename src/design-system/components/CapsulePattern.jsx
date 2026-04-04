// GalakSay Pro — 2026-03-19 — Kapsül erişilebilirlik desenleri
// Renk körlüğü modunda kapsüllere desen ekler (CSS class + data-value ile)
// Kullanım: <CapsulePattern value={5}>{children}</CapsulePattern>

import React from 'react';

/**
 * Kapsül değerine göre erişilebilirlik deseni uygulayan sarmalayıcı.
 * CSS'teki .capsule-pattern[data-value="X"]::after kurallarını aktive eder.
 *
 * Desen haritası:
 *   1=düz, 2=yatay çizgi, 3=dikey çizgi, 4=noktalı, 5=çapraz çizgi,
 *   6=dama, 7=ters çapraz, 8=dalga, 9=artı, 10=çift çapraz
 *
 * @param {number} value — Kapsül değeri (1-10)
 * @param {React.ReactNode} children — Kapsül içeriği
 * @param {object} style — Ek stil
 */
export function CapsulePattern({ value, children, style, className = '', ...rest }) {
  return (
    <div
      className={`capsule-pattern ${className}`}
      data-value={value}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Kapsül desen bilgisi — ekran okuyucu ve tooltip için
 */
export const CAPSULE_PATTERN_LABELS = {
  1: 'düz',
  2: 'yatay çizgili',
  3: 'dikey çizgili',
  4: 'noktalı',
  5: 'çapraz çizgili',
  6: 'damalı',
  7: 'ters çapraz çizgili',
  8: 'dalgalı',
  9: 'artılı',
  10: 'çift çapraz çizgili',
};
