// GalakSay Pro — 2026-03-18 — Mikro etkileşim animasyon yardımcıları
// CSS animasyonları ve JavaScript geçiş tanımları

// ═══ SAYAÇ ANİMASYONU — Slot machine / ticker efekti ═══════════════════════
// Sayı değiştiğinde eski yukarı kayar, yeni aşağıdan gelir
export const counterAnimation = {
  exit: {
    transform: 'translateY(-100%)',
    opacity: 0,
    transition: 'all 150ms ease-out',
  },
  enter: {
    transform: 'translateY(100%)',
    opacity: 0,
  },
  active: {
    transform: 'translateY(0)',
    opacity: 1,
    transition: 'all 150ms ease-out',
  },
};

// ═══ LİSTE ÖĞESİ ANİMASYONLARI ═══════════════════════════════════════════
export const listItemAnimation = {
  add: {
    initial: { opacity: 0, transform: 'translateY(-10px)', maxHeight: 0 },
    animate: { opacity: 1, transform: 'translateY(0)', maxHeight: 200 },
    duration: 250,
    easing: 'ease-out',
  },
  remove: {
    initial: { opacity: 1, transform: 'translateX(0)' },
    animate: { opacity: 0, transform: 'translateX(-100%)' },
    duration: 200,
    easing: 'ease-in',
  },
};

// ═══ BİLDİRİM / TOAST ANİMASYONU ══════════════════════════════════════════
export const toastAnimation = {
  enter: {
    initial: { opacity: 0, transform: 'translateY(-100%)', maxHeight: 0 },
    animate: { opacity: 1, transform: 'translateY(0)', maxHeight: 200 },
    duration: 300,
  },
  exit: {
    initial: { opacity: 1, transform: 'translateY(0)' },
    animate: { opacity: 0, transform: 'translateY(-20px)' },
    duration: 200,
  },
  stayDuration: 3000,
};

// ═══ KART SEÇİMİ ANİMASYONU ═══════════════════════════════════════════════
export const cardSelectAnimation = {
  selected: {
    transform: 'scale(1.02)',
    boxShadow: (color) => `0 0 20px ${color}40, 0 0 40px ${color}20`,
    borderColor: (color) => color,
    transition: 'all 200ms ease-out',
  },
  deselected: {
    transform: 'scale(1)',
    boxShadow: 'none',
    borderColor: 'transparent',
    transition: 'all 150ms ease-out',
  },
};

// ═══ KONFETİ PARÇACIK OLUŞTURUCU ══════════════════════════════════════════
// Canvas tabanlı konfeti efekti
export function createConfettiParticles(canvas, {
  count = 30,
  colors: particleColors = ['#6C63FF', '#00D4AA', '#FFD93D', '#FF8C42', '#EC4899', '#38bdf8'],
  duration = 1500,
  gravity = 0.15,
  spread = 0.6,
} = {}) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = canvas.offsetHeight;

  const particles = Array.from({ length: count }, () => ({
    x: W / 2 + (Math.random() - 0.5) * W * spread,
    y: H * 0.3,
    vx: (Math.random() - 0.5) * 8,
    vy: -Math.random() * 10 - 3,
    size: Math.random() * 6 + 3,
    color: particleColors[Math.floor(Math.random() * particleColors.length)],
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 12,
    life: 1,
    decay: 0.005 + Math.random() * 0.005,
  }));

  let raf;
  const startTime = performance.now();

  const animate = (now) => {
    const elapsed = now - startTime;
    if (elapsed > duration) {
      ctx.clearRect(0, 0, W, H);
      return;
    }

    ctx.clearRect(0, 0, W, H);
    let alive = false;

    for (const p of particles) {
      if (p.life <= 0) continue;
      alive = true;
      p.x += p.vx;
      p.vy += gravity;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }

    if (alive) raf = requestAnimationFrame(animate);
  };

  raf = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(raf);
}

// ═══ YILDIZ PARÇACIK PATLAMASI ═══════════════════════════════════════════
export function createStarBurst(canvas, {
  count = 12,
  color = '#FFD93D',
  centerX,
  centerY,
  radius = 80,
  duration = 800,
} = {}) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = canvas.offsetHeight;
  const cx = centerX ?? W / 2;
  const cy = centerY ?? H / 2;

  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    return {
      x: cx,
      y: cy,
      vx: Math.cos(angle) * (2 + Math.random() * 3),
      vy: Math.sin(angle) * (2 + Math.random() * 3),
      size: 2 + Math.random() * 3,
      life: 1,
    };
  });

  let raf;
  const startTime = performance.now();

  const animate = (now) => {
    const elapsed = now - startTime;
    if (elapsed > duration) {
      ctx.clearRect(0, 0, W, H);
      return;
    }

    ctx.clearRect(0, 0, W, H);
    const progress = elapsed / duration;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.97;
      p.vy *= 0.97;

      const alpha = 1 - progress;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fill();
    }

    raf = requestAnimationFrame(animate);
  };

  raf = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(raf);
}

// ═══ STAGGER ANİMASYON YARDIMCISI ═══════════════════════════════════════
// Öğelerin sırayla animasyonla girmesi için gecikme hesapla
export function staggerDelay(index, baseDelay = 50, maxDelay = 500) {
  return Math.min(index * baseDelay, maxDelay);
}

// ═══ SPRING ANİMASYON HESAPLAYICI ═══════════════════════════════════════
// CSS cubic-bezier yaklaşımlı spring eğrileri
export const springs = {
  gentle: 'cubic-bezier(0.34, 1.56, 0.64, 1)',   // Yumuşak bounce
  bouncy: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Belirgin bounce
  stiff: 'cubic-bezier(0.5, 1.5, 0.5, 1)',        // Sert spring
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',     // Smooth ease-out
};

// ═══ REDUCED MOTION KONTROL ══════════════════════════════════════════════
// prefers-reduced-motion durumuna göre animasyon değerlerini ayarla
export function getMotionSafe(animValue, fallback = 'none') {
  if (typeof window === 'undefined') return animValue;
  const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  return mq?.matches ? fallback : animValue;
}
