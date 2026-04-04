// ═══════════════════════════════════════════════════════════════════════════════
// TEMSİL GEÇİŞ ANİMASYONU — Somut → Görsel Dönüşüm Animasyonları
// Kapsül → çubuk modeli, yıldız taşı → nokta dizisi, yıldız taşı grubu → on-çerçeve
// Renk kodlaması korunur, geçiş sırasında iki temsil yan yana görünür
// ═══════════════════════════════════════════════════════════════════════════════

import { ANIM_PRESETS } from '../DokunSayKit/MateryalFizik.js';
import { KAPSUL_RENKLERI } from '../DokunSayKit/EnerjiKapsulu.jsx';

// ── Geçiş Türleri ve Zamanlama ──────────────────────────────────────────────
export const GECIS_TURLERI = {
  // Kapsül → Çubuk modeli (yassılaşma)
  kapsul_to_cubuk: {
    id: 'kapsul_to_cubuk',
    duration: 800,
    easing: 'ease-in-out',
    description: 'Enerji kapsülü yavaşça yassılaşır → çubuk modeline dönüşür',
    steps: [
      { at: 0,   action: 'start',   desc: 'Kapsül 3D görünümde' },
      { at: 0.3, action: 'flatten', desc: 'Kapsül yassılaşmaya başlar (scaleY: 0.6)' },
      { at: 0.6, action: 'morph',   desc: 'Köşeler düzleşir, çubuk şekli alır' },
      { at: 1.0, action: 'settle',  desc: 'Çubuk modeli tamamlanır, birim işaretleri belirir' },
    ],
  },

  // Kapsül dizisi → Sayı doğrusu
  kapsul_to_sayi_dogrusu: {
    id: 'kapsul_to_sayi_dogrusu',
    duration: 1000,
    easing: 'ease-in-out',
    description: 'Kapsül dizisi düzleşir → sayı doğrusu oluşur, birim çentikleri işaretlere dönüşür',
    steps: [
      { at: 0,   action: 'align',    desc: 'Kapsüller yatay hizalanır' },
      { at: 0.3, action: 'flatten',  desc: 'Kapsüller ince çizgiye dönüşür' },
      { at: 0.6, action: 'marks',    desc: 'Birim bölmeleri sayı doğrusu işaretlerine dönüşür' },
      { at: 1.0, action: 'labels',   desc: 'Sayı etiketleri belirir' },
    ],
  },

  // Yıldız taşları → Düzenli nokta dizisi
  pul_to_nokta: {
    id: 'pul_to_nokta',
    duration: 600,
    easing: 'ease-in-out',
    description: 'Yıldız taşları küçülür → düzenli nokta dizisine dönüşür',
    steps: [
      { at: 0,   action: 'start',  desc: 'Yıldız taşları orijinal boyutlarında' },
      { at: 0.5, action: 'shrink', desc: 'Yıldız taşları küçülür (%40 boyut)' },
      { at: 1.0, action: 'grid',   desc: 'Düzenli ızgara konumuna yerleşir' },
    ],
  },

  // Yıldız taşı grubu → On-çerçeveye yerleşme
  pul_to_cerceve: {
    id: 'pul_to_cerceve',
    duration: 100, // Her yıldız taşı için — toplam = adet × 100ms
    stagger: 100,
    easing: 'ease-out',
    description: 'Her yıldız taşı sırayla on-çerçevenin bir kutusuna girer',
    steps: [
      { at: 0,   action: 'highlight', desc: 'Sıradaki yıldız taşı parlar' },
      { at: 0.5, action: 'move',      desc: 'Yıldız taşı kutuya doğru kayar (arc trajectory)' },
      { at: 1.0, action: 'settle',    desc: 'Yıldız taşı kutuya oturur (squash efekti)' },
    ],
  },

  // Somut → Sembolik bağlantı (ışıklı çizgi)
  somut_to_sembolik: {
    id: 'somut_to_sembolik',
    duration: 500,
    easing: 'ease-out',
    description: 'Somut materyalden sembolik ifadeye ince ışıklı çizgi çekilir',
    steps: [
      { at: 0,   action: 'start', desc: 'Bağlantı noktası belirir' },
      { at: 0.5, action: 'draw',  desc: 'Çizgi yukarıdan aşağıya çizilir' },
      { at: 1.0, action: 'glow',  desc: 'Çizgi parlayarak yerleşir' },
    ],
  },

  // Tüm katmanlar senkron bağlantı
  uc_katman_bagla: {
    id: 'uc_katman_bagla',
    duration: 600,
    easing: 'ease-in-out',
    description: 'Üç katman arasında renk kodlaması ve bağlantı çizgileri oluşur',
    steps: [
      { at: 0,   action: 'frame_all',   desc: 'Aynı değeri temsil eden öğeler aynı renkle çerçevelenir' },
      { at: 0.4, action: 'draw_lines',  desc: 'Katmanlar arası bağlantı çizgileri çekilir' },
      { at: 1.0, action: 'sync_pulse',  desc: 'Tüm bağlı öğeler aynı anda pulse yapar' },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CSS Stil Hesaplayıcıları — Animasyon Adımlarını Stile Dönüştür
// ═══════════════════════════════════════════════════════════════════════════════

// Kapsül → Çubuk morph stilleri
export function getKapsulMorphStyle(progress, value) {
  // progress: 0-1
  const renk = KAPSUL_RENKLERI[value] || KAPSUL_RENKLERI[1];

  if (progress <= 0.3) {
    // Aşama 1: Yassılaşma başlıyor
    const p = progress / 0.3;
    return {
      transform: `scaleY(${1 - p * 0.3}) scaleX(${1 + p * 0.1})`,
      borderRadius: `${14 - p * 6}px`,
      transition: 'none',
    };
  } else if (progress <= 0.6) {
    // Aşama 2: Köşeler düzleşir
    const p = (progress - 0.3) / 0.3;
    return {
      transform: `scaleY(${0.7 - p * 0.2}) scaleX(${1.1 + p * 0.05})`,
      borderRadius: `${8 - p * 4}px`,
      boxShadow: `0 2px 8px rgba(0,0,0,0.2)`,
      transition: 'none',
    };
  } else {
    // Aşama 3: Çubuk olarak yerleşir
    const p = (progress - 0.6) / 0.4;
    return {
      transform: `scaleY(${0.5}) scaleX(1.15)`,
      borderRadius: '4px',
      boxShadow: `0 2px 6px rgba(0,0,0,0.15)`,
      opacity: 1 - p * 0.3, // Kapsül solar, çubuk belirir
      transition: 'none',
    };
  }
}

// Yıldız taşı → Nokta küçülme stilleri
export function getPulShrinkStyle(progress, index, total) {
  const targetSize = 0.4; // %40 boyuta küçül
  const currentSize = 1 - (1 - targetSize) * progress;

  // Düzenli ızgara pozisyonu hesapla
  const cols = Math.min(total, 5);
  const row = Math.floor(index / cols);
  const col = index % cols;
  const gridX = col * 20; // px aralık
  const gridY = row * 20;

  return {
    transform: `scale(${currentSize}) translate(${gridX * progress}px, ${gridY * progress}px)`,
    transition: 'none',
  };
}

// On-çerçeveye yıldız taşı yerleşme (arc trajectory)
export function getPulToCerceveStyle(progress, index, frameRect) {
  if (!frameRect) return {};

  // Yay çizen hareket (arc trajectory)
  const arcHeight = -40; // Yukarı yay yüksekliği
  const x = progress; // 0-1 yatay ilerleme
  const y = 4 * arcHeight * x * (x - 1); // Parabolik yay

  return {
    transform: `translate(${x * 100}%, ${y}px) scale(${1 - progress * 0.2})`,
    transition: 'none',
  };
}

// Renk kodlaması çerçeve stili
export function getRenkKodlamaStyle(value, isActive) {
  const renk = KAPSUL_RENKLERI[value] || KAPSUL_RENKLERI[1];
  if (!isActive) return {};

  return {
    outline: `3px solid ${renk.bg}`,
    outlineOffset: '3px',
    borderRadius: '8px',
    boxShadow: `0 0 12px ${renk.glow}`,
    transition: `all ${ANIM_PRESETS.normal.duration}ms ${ANIM_PRESETS.normal.easing}`,
  };
}

// Bağlantı çizgisi hesaplama
export function getBaglantiCizgisi(sourceRect, targetRect, progress) {
  if (!sourceRect || !targetRect) return null;

  const sx = sourceRect.left + sourceRect.width / 2;
  const sy = sourceRect.bottom;
  const tx = targetRect.left + targetRect.width / 2;
  const ty = targetRect.top;

  // Çizgi progress'e göre uzar
  const currentTy = sy + (ty - sy) * progress;

  return {
    x1: sx,
    y1: sy,
    x2: sx + (tx - sx) * progress,
    y2: currentTy,
    opacity: Math.min(1, progress * 2),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANİMASYON ZAMANLAMA YÖNETİCİSİ
// ═══════════════════════════════════════════════════════════════════════════════
export class GecisAnimasyonYonetici {
  constructor(tip, onProgress, onComplete) {
    this.tip = GECIS_TURLERI[tip];
    this.onProgress = onProgress;
    this.onComplete = onComplete;
    this.progress = 0;
    this.isRunning = false;
    this._rafId = null;
    this._startTime = null;
  }

  start() {
    if (!this.tip) return;
    this.isRunning = true;
    this.progress = 0;
    this._startTime = performance.now();
    this._tick();
  }

  _tick() {
    if (!this.isRunning) return;

    const elapsed = performance.now() - this._startTime;
    this.progress = Math.min(1, elapsed / this.tip.duration);

    // Easing uygula
    const eased = this._easeInOut(this.progress);

    // Mevcut adımı bul
    let currentStep = this.tip.steps[0];
    for (const step of this.tip.steps) {
      if (step.at <= this.progress) currentStep = step;
    }

    this.onProgress?.(eased, currentStep);

    if (this.progress < 1) {
      this._rafId = requestAnimationFrame(() => this._tick());
    } else {
      this.isRunning = false;
      this.onComplete?.();
    }
  }

  stop() {
    this.isRunning = false;
    if (this._rafId) cancelAnimationFrame(this._rafId);
  }

  _easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// React Hook: useGecisAnimasyonu
// ═══════════════════════════════════════════════════════════════════════════════
export function useGecisAnimasyonu(gecisTipi) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const yoneticiRef = { current: null };

  const startTransition = () => {
    if (yoneticiRef.current) yoneticiRef.current.stop();

    setIsAnimating(true);
    setProgress(0);

    yoneticiRef.current = new GecisAnimasyonYonetici(
      gecisTipi,
      (p, step) => {
        setProgress(p);
        setCurrentStep(step);
      },
      () => {
        setIsAnimating(false);
        setProgress(1);
      }
    );
    yoneticiRef.current.start();
  };

  const stopTransition = () => {
    if (yoneticiRef.current) yoneticiRef.current.stop();
    setIsAnimating(false);
  };

  return { progress, currentStep, isAnimating, startTransition, stopTransition };
}

export default GECIS_TURLERI;
