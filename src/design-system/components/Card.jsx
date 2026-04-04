// GalakSay Pro — 2026-03-20 — Merkezi kart bileşeni (a11y + active press efekti)
import React, { useState, useCallback } from 'react';

export function Card({
  children,
  onClick,
  hover = true,
  glow = false,
  glowColor = 'rgba(108,99,255,0.3)',
  padding = 24,
  selected = false,
  style: sx,
  ...rest
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const interactive = !!onClick;

  const handlePointerDown = useCallback(() => { if (interactive) setPressed(true); }, [interactive]);
  const handlePointerUp = useCallback(() => setPressed(false), []);

  const getTransform = () => {
    if (pressed && interactive) return 'scale(0.98)';
    if (hovered && interactive) return 'scale(1.02)';
    return 'scale(1)';
  };

  const getBoxShadow = () => {
    if (glow) return `0 0 20px ${glowColor}, 0 4px 12px rgba(0,0,0,.4)`;
    if (selected) return `0 0 16px ${glowColor}, 0 4px 12px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.08)`;
    if (hovered) return '0 8px 32px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.08)';
    return '0 4px 12px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.05)';
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive && selected ? true : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } } : undefined}
      style={{
        background: 'rgba(30,27,75,.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 16,
        border: selected
          ? '1px solid rgba(108,99,255,.5)'
          : '1px solid rgba(148,163,184,.12)',
        boxShadow: getBoxShadow(),
        padding,
        cursor: interactive ? 'pointer' : 'default',
        transition: 'all 200ms ease-out',
        transform: getTransform(),
        filter: hovered && interactive ? 'brightness(1.05)' : 'brightness(1)',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
