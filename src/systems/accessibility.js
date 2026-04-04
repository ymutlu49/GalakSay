// ═══ ERİŞİLEBİLİRLİK AYARLARI ═════════════════════════════════════════════
// Rapor §7: Renk körü modu, font boyutu, erişilebilirlik
export const A11Y_DEFAULTS = {
  colorBlind: false,    // Renk körü modu: desen tabanlı çip ayrımı
  largeText: false,     // Büyük yazı tipi
  reducedMotion: false, // Azaltılmış animasyon
  highContrast: false,  // Yüksek kontrast
  calmMode: false,      // Sakin mod: tüm animasyonlar + sesler minimize (diskalkuli-uyumlu)
};

// Renk körü modunda çip renkleri: mavi→daire+çizgili, kırmızı→kare+düz
export const CB_COLORS = { blue: "#93c5fd", red: "#b45309" }; // Açık mavi/Turuncu-kahve (deuteranopia safe)
export const CB_PATTERNS = { blue: "stripe", red: "dots" };

// §Subitizing: 5'erli gruplarla renk değişimi — bir bakışta miktar algılama
// 1-5: mavi, 6-10: kırmızı, 11-15: mavi, 16-20: kırmızı...
export const subColor = (i, a = "blue", b = "red") => Math.floor(i / 5) % 2 === 0 ? a : b;
export const subColorHex = (i) => Math.floor(i / 5) % 2 === 0 ? "#93c5fd" : "#dc2626";

// ═══ GalakSay Pro — Gelişmiş Erişilebilirlik ═════════════════════════════

// Enerji kapsülü desenleri — renk körlüğü modunda ikincil gösterge
// Her kapsül rengi farklı desen alır: 1=düz, 2=yatay çizgi, 3=dikey çizgi...
export const CAPSULE_PATTERNS = {
  1:  'solid',      // Beyaz — düz
  2:  'horizontal',  // Kırmızı — yatay çizgi
  3:  'vertical',    // Yeşil — dikey çizgi
  4:  'dots',        // Mor — noktalı
  5:  'diagonal',    // Sarı — çapraz çizgi
  6:  'checkerboard',// Koyu yeşil — dama
  7:  'zigzag',      // Siyah — zikzak
  8:  'wave',        // Kahverengi — dalga
  9:  'cross',       // Mavi — artı
  10: 'star',        // Turuncu — yıldız
};

// SVG desen üreteci — inline CSS background olarak kullanılır
export function getCapsulePattern(number, size = 6) {
  const patterns = {
    solid:       'none',
    horizontal:  `repeating-linear-gradient(0deg, transparent, transparent ${size}px, rgba(255,255,255,.3) ${size}px, rgba(255,255,255,.3) ${size + 1}px)`,
    vertical:    `repeating-linear-gradient(90deg, transparent, transparent ${size}px, rgba(255,255,255,.3) ${size}px, rgba(255,255,255,.3) ${size + 1}px)`,
    dots:        `radial-gradient(circle ${size/3}px at ${size}px ${size}px, rgba(255,255,255,.3) 1px, transparent 1px)`,
    diagonal:    `repeating-linear-gradient(45deg, transparent, transparent ${size}px, rgba(255,255,255,.25) ${size}px, rgba(255,255,255,.25) ${size + 1}px)`,
    checkerboard:`repeating-conic-gradient(rgba(255,255,255,.15) 0% 25%, transparent 0% 50%) 0 0 / ${size * 2}px ${size * 2}px`,
    zigzag:      `repeating-linear-gradient(135deg, transparent, transparent ${size}px, rgba(255,255,255,.2) ${size}px, rgba(255,255,255,.2) ${size + 1}px)`,
    wave:        `repeating-linear-gradient(-45deg, transparent, transparent ${size}px, rgba(255,255,255,.2) ${size}px, rgba(255,255,255,.2) ${size + 1}px)`,
    cross:       `repeating-linear-gradient(0deg, transparent, transparent ${size}px, rgba(255,255,255,.2) ${size}px, rgba(255,255,255,.2) ${size + 1}px), repeating-linear-gradient(90deg, transparent, transparent ${size}px, rgba(255,255,255,.2) ${size}px, rgba(255,255,255,.2) ${size + 1}px)`,
    star:        `radial-gradient(circle ${size/2}px at ${size}px ${size}px, rgba(255,255,255,.25) 1px, transparent 2px)`,
  };
  const patternName = CAPSULE_PATTERNS[number] || 'solid';
  return patterns[patternName] || 'none';
}

// Büyük metin modu — font ölçekleme çarpanı
export const getTextScale = (largeText) => largeText ? 1.3 : 1;

// Dokunma hedefi ölçekleme
export const getTouchScale = (largeText) => largeText ? 1.2 : 1;

// Azaltılmış hareket kontrolü — sistem tercihi + kullanıcı ayarı
export function prefersReducedMotion(userSetting) {
  if (userSetting !== undefined) return userSetting;
  if (typeof window !== 'undefined') {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
  }
  return false;
}

// Doğru/yanlış geri bildirim — renk + ikon (erişilebilir)
export const FEEDBACK_ICONS = {
  correct: '\u2713', // ✓
  wrong: '\u21BB',   // ↻ (tekrar dene)
  hint: '\uD83D\uDCA1', // 💡
};

// Kontrast kontrol yardımcısı
export function getContrastColor(bg, light = '#FFFFFF', dark = '#0B0E2D') {
  // Basit luminans hesabı
  const hex = bg.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? dark : light;
}
