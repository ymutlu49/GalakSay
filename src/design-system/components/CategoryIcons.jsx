// GalakSay Pro — 2026-03-18 — 8 kategori ikonu (SVG, monochrome, 24x24 grid, 2px stroke)
import React from 'react';

const defaultProps = {
  size: 24,
  color: 'currentColor',
  strokeWidth: 2,
};

function Icon({ size, color, strokeWidth, children, label, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
      {...rest}
    >
      {children}
    </svg>
  );
}

// 1. Sayma — Rakam küpü / sayı dizisi
export function CountingIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Sayma">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <text x="6.5" y="8.5" textAnchor="middle" fontSize="6" fill={color} stroke="none" fontWeight="bold">1</text>
      <text x="17.5" y="8.5" textAnchor="middle" fontSize="6" fill={color} stroke="none" fontWeight="bold">2</text>
      <text x="6.5" y="19.5" textAnchor="middle" fontSize="6" fill={color} stroke="none" fontWeight="bold">3</text>
      <text x="17.5" y="19.5" textAnchor="middle" fontSize="6" fill={color} stroke="none" fontWeight="bold">4</text>
    </Icon>
  );
}

// 2. Subitizing — Zar / nokta kümesi
export function SubitizingIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Subitizing">
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <circle cx="7" cy="7" r="1.5" fill={color} stroke="none" />
      <circle cx="17" cy="7" r="1.5" fill={color} stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill={color} stroke="none" />
      <circle cx="7" cy="17" r="1.5" fill={color} stroke="none" />
      <circle cx="17" cy="17" r="1.5" fill={color} stroke="none" />
    </Icon>
  );
}

// 3. Karşılaştırma — Terazi / büyük-küçük ok
export function ComparingIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Karsilastirma">
      {/* Terazi direği */}
      <line x1="12" y1="2" x2="12" y2="22" />
      {/* Terazi kolu */}
      <line x1="4" y1="8" x2="20" y2="8" />
      {/* Sol kefe (ağır, aşağıda) */}
      <path d="M4 8 L2 14 Q2 16 6 16 Q10 16 10 14 L8 8" />
      {/* Sağ kefe (hafif, yukarıda) */}
      <path d="M16 8 L14 12 Q14 14 18 14 Q22 14 22 12 L20 8" />
      {/* Taban */}
      <line x1="8" y1="22" x2="16" y2="22" />
    </Icon>
  );
}

// 4. Sayı Bileşimi — Yapboz parçası / bölünmüş daire
export function ComposingIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Sayi bilesimi">
      {/* Bölünmüş daire */}
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="3" x2="12" y2="21" />
      {/* Sol yari - noktalar */}
      <circle cx="8" cy="9" r="1" fill={color} stroke="none" />
      <circle cx="8" cy="12" r="1" fill={color} stroke="none" />
      <circle cx="8" cy="15" r="1" fill={color} stroke="none" />
      {/* Sag yari - noktalar */}
      <circle cx="16" cy="10.5" r="1" fill={color} stroke="none" />
      <circle cx="16" cy="13.5" r="1" fill={color} stroke="none" />
    </Icon>
  );
}

// 5. Basamak Değeri — Tuğla / blok kule
export function PlaceValueIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Basamak degeri">
      {/* Yüzler bloğu (büyük) */}
      <rect x="2" y="14" width="8" height="8" rx="1" />
      {/* Onlar çubuğu (orta) */}
      <rect x="12" y="8" width="4" height="14" rx="1" />
      {/* Birler küpü (küçük) */}
      <rect x="18" y="17" width="4" height="5" rx="1" />
      {/* Etiketler */}
      <text x="6" y="11" textAnchor="middle" fontSize="5" fill={color} stroke="none" fontWeight="bold">100</text>
      <text x="14" y="6" textAnchor="middle" fontSize="5" fill={color} stroke="none" fontWeight="bold">10</text>
      <text x="20" y="15" textAnchor="middle" fontSize="5" fill={color} stroke="none" fontWeight="bold">1</text>
    </Icon>
  );
}

// 6. Toplama/Çıkarma — Artı-eksi sembolü
export function AddSubIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Toplama ve cikarma">
      {/* Artı */}
      <line x1="6" y1="4" x2="6" y2="12" />
      <line x1="2" y1="8" x2="10" y2="8" />
      {/* Eksi */}
      <line x1="14" y1="8" x2="22" y2="8" />
      {/* Eşittir */}
      <line x1="5" y1="17" x2="19" y2="17" />
      <line x1="5" y1="20" x2="19" y2="20" />
    </Icon>
  );
}

// 7. Çarpma/Bölme — Yıldız / bölme sembolü
export function MulDivIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Carpma ve bolme">
      {/* Çarpma (X) */}
      <line x1="3" y1="3" x2="10" y2="10" />
      <line x1="10" y1="3" x2="3" y2="10" />
      {/* Bölme */}
      <circle cx="18" cy="5" r="1.5" fill={color} stroke="none" />
      <line x1="14" y1="8" x2="22" y2="8" />
      <circle cx="18" cy="11" r="1.5" fill={color} stroke="none" />
      {/* Grid (çarpım tablosu) */}
      <rect x="3" y="15" width="18" height="6" rx="1" />
      <line x1="9" y1="15" x2="9" y2="21" />
      <line x1="15" y1="15" x2="15" y2="21" />
    </Icon>
  );
}

// 8. Örüntü — Zincir / desen
export function PatternIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Oruntu">
      {/* Tekrarlayan desen — daire-kare-daire-kare */}
      <circle cx="4" cy="6" r="2.5" />
      <rect x="9.5" y="3.5" width="5" height="5" rx="0.5" />
      <circle cx="20" cy="6" r="2.5" />
      {/* İkinci satır */}
      <rect x="1.5" y="14.5" width="5" height="5" rx="0.5" />
      <circle cx="12" cy="17" r="2.5" />
      {/* Soru işareti (devamı) */}
      <text x="20" y="19" textAnchor="middle" fontSize="8" fill={color} stroke="none" fontWeight="bold">?</text>
      {/* Bağlantı çizgileri */}
      <line x1="6.5" y1="6" x2="9.5" y2="6" strokeDasharray="2 1" />
      <line x1="14.5" y1="6" x2="17.5" y2="6" strokeDasharray="2 1" />
      <line x1="6.5" y1="17" x2="9.5" y2="17" strokeDasharray="2 1" />
      <line x1="14.5" y1="17" x2="17.5" y2="17" strokeDasharray="2 1" />
    </Icon>
  );
}

// ═══ DokunSay Materyal İkonları ════════════════════════════════════════════════

// Enerji Kapsülü mini ikonu
export function CapsuleIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Enerji kapsulu">
      <rect x="4" y="2" width="16" height="20" rx="8" />
      <line x1="4" y1="8" x2="20" y2="8" />
      <line x1="4" y1="16" x2="20" y2="16" />
      <circle cx="12" cy="12" r="2" fill={color} stroke="none" />
    </Icon>
  );
}

// Yıldız taşı mini ikonu
export function StampIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Yıldız taşı">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill={color} stroke="none" />
    </Icon>
  );
}

// Yıldız Taşı mini ikonu
export function StarGemIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Yildiz tasi">
      <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" />
    </Icon>
  );
}

// ═══ Navigasyon İkonları ══════════════════════════════════════════════════════

export function HomeIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Ana sayfa">
      <path d="M3 12L12 3L21 12" />
      <path d="M5 10V20C5 20.5 5.5 21 6 21H9V15H15V21H18C18.5 21 19 20.5 19 20V10" />
    </Icon>
  );
}

export function BackIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Geri">
      <polyline points="15 18 9 12 15 6" />
    </Icon>
  );
}

export function ForwardIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Ileri">
      <polyline points="9 18 15 12 9 6" />
    </Icon>
  );
}

export function SettingsIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Ayarlar">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </Icon>
  );
}

export function ProfileIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Profil">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21C4 17 7.5 14 12 14C16.5 14 20 17 20 21" />
    </Icon>
  );
}

export function ReportIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Rapor">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="7" y1="17" x2="7" y2="11" />
      <line x1="12" y1="17" x2="12" y2="7" />
      <line x1="17" y1="17" x2="17" y2="13" />
    </Icon>
  );
}

export function HintIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Ipucu">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </Icon>
  );
}

export function SoundOnIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Ses acik">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </Icon>
  );
}

export function SoundOffIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <Icon size={size} color={color} strokeWidth={strokeWidth} label="Ses kapali">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </Icon>
  );
}

// ═══ Kategori İkonu Lookup ══════════════════════════════════════════════════
export const CATEGORY_ICONS = {
  counting: CountingIcon,
  subitizing: SubitizingIcon,
  comparing: ComparingIcon,
  composing: ComposingIcon,
  placeValue: PlaceValueIcon,
  addSub: AddSubIcon,
  mulDiv: MulDivIcon,
  pattern: PatternIcon,
};

// Kısa yol fonksiyonu
export function CategoryIcon({ category, size = 24, color = 'currentColor', strokeWidth = 2 }) {
  const IconComponent = CATEGORY_ICONS[category];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} />;
}
