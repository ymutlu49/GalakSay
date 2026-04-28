// GalakSay Pro — 2026-03-20 — Çocuğun "Benim Uzay Haritam" ekranı (DS entegrasyonu + SpaceBackground + CategoryIcon SVG)
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLearningMap } from '../analytics/LTProgressEngine.js';
import { getAchievementsByChild } from '../analytics/database.js';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { spacing, layout } from '../design-system/spacing.js';
import { Button } from '../design-system/components/Button.jsx';
import { ProgressBar } from '../design-system/components/ProgressBar.jsx';
import { Skeleton } from '../design-system/components/Skeleton.jsx';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import {
  CountingIcon, SubitizingIcon, ComparingIcon, ComposingIcon,
  PlaceValueIcon, AddSubIcon, MulDivIcon, PatternIcon,
} from '../design-system/components/CategoryIcons.jsx';

// Kategori → SVG ikon bileşeni eşlemesi
const CATEGORY_ICON_MAP = {
  sayma: CountingIcon,
  subitizing: SubitizingIcon,
  karsilastirma: ComparingIcon,
  sayi_bilesimi: ComposingIcon,
  basamak_degeri: PlaceValueIcon,
  toplama_cikarma: AddSubIcon,
  carpma_bolme: MulDivIcon,
  oruntu: PatternIcon,
};

const PLANET_CONFIGS = {
  sayma:           { color: '#22d3ee', label: 'Sayma', x: 50, y: 15 },
  subitizing:      { color: colors.feedback.hint, label: 'Subitizing', x: 20, y: 30 },
  karsilastirma:   { color: colors.accent.secondary, label: 'Karşılaştırma', x: 80, y: 28 },
  sayi_bilesimi:   { color: '#f472b6', label: 'Sayı Bileşimi', x: 15, y: 55 },
  basamak_degeri:  { color: colors.accent.orange, label: 'Basamak Değeri', x: 85, y: 52 },
  toplama_cikarma: { color: '#60a5fa', label: 'Toplama/Çıkarma', x: 35, y: 72 },
  carpma_bolme:    { color: colors.accent.gold, label: 'Çarpma/Bölme', x: 68, y: 75 },
  oruntu:          { color: colors.accent.tertiary, label: 'Örüntü', x: 50, y: 90 },
};

const STATUS_STYLES = {
  not_started: { scale: 0.6, opacity: 0.3, glow: 0, locked: false },
  locked:      { scale: 0.55, opacity: 0.2, glow: 0, locked: true },
  in_progress: { scale: 0.85, opacity: 0.8, glow: 8, locked: false },
  struggling:  { scale: 0.75, opacity: 0.6, glow: 4, locked: false },
  mastered:    { scale: 1.1, opacity: 1, glow: 20, locked: false },
};

export default function SpaceMap({ childId, onBack }) {
  const [mapData, setMapData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  // Stars now handled by SpaceBackground component

  useEffect(() => {
    if (!childId) return;
    getLearningMap(childId).then(setMapData).catch(console.error);
    getAchievementsByChild(childId).then(setAchievements).catch(console.error);
  }, [childId]);

  if (!mapData) {
    return (
      <div style={containerStyle}>
        <div style={{ padding: spacing[6], display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[4], marginTop: 80 }}>
          <Skeleton variant="circle" width={64} height={64} />
          <Skeleton variant="text" width={180} height={20} />
          <Skeleton variant="text" width={120} height={16} />
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Üst bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${spacing[3]}px ${spacing[4]}px` }}>
        <Button variant="ghost" size="sm" onClick={onBack}>← Geri</Button>
        <h2 style={{ color: colors.text.primary, fontSize: typography.fontSize.base, margin: 0, fontWeight: typography.fontWeight.bold, fontFamily: typography.fontFamily.display }}>Benim Uzay Haritam</h2>
        <div style={{ color: colors.text.secondary, fontSize: typography.fontSize.xs }}>%{mapData.overallProgress} tamamlandı</div>
      </div>

      {/* Genel ilerleme çubuğu */}
      <div style={{ padding: `0 ${spacing[4]}px ${spacing[3]}px`, position: 'relative' }}>
        <ProgressBar value={mapData.overallProgress} max={100} height={6} />
      </div>

      {/* Uzay haritası */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        {/* Yıldız arkaplanı — SpaceBackground bileşeni */}
        <SpaceBackground starCount={50} showNebula showMeteors showParallax />

        {/* Gezegenler arası yollar */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {mapData.categories.map((cat, i) => {
            if (i === 0) return null;
            const prev = mapData.categories[i - 1];
            const prevConfig = PLANET_CONFIGS[prev.name];
            const curConfig = PLANET_CONFIGS[cat.name];
            const prevCompleted = prev.status === 'mastered' || prev.status === 'in_progress';
            return (
              <line
                key={`path-${i}`}
                x1={`${prevConfig.x}%`} y1={`${prevConfig.y}%`}
                x2={`${curConfig.x}%`} y2={`${curConfig.y}%`}
                stroke={prevCompleted ? colors.surface.divider : colors.background.primary}
                strokeWidth={prevCompleted ? 2 : 1}
                strokeDasharray={prevCompleted ? 'none' : '4 4'}
                opacity={prevCompleted ? 0.6 : 0.2}
              />
            );
          })}
        </svg>

        {/* Gezegenler */}
        {mapData.categories.map((cat, catIdx) => {
          const config = PLANET_CONFIGS[cat.name];
          const statusStyle = STATUS_STYLES[cat.status] || STATUS_STYLES.not_started;
          const planetSize = 48 * statusStyle.scale;
          const isLocked = statusStyle.locked;
          const isMastered = cat.status === 'mastered';

          return (
            <motion.div
              key={cat.name}
              onClick={() => {
                if (isLocked) {
                  // Kilitli gezegene dokunulduğunda kısa bilgi göster
                  setSelectedPlanet({ ...cat, _lockedMessage: true });
                } else {
                  setSelectedPlanet(cat);
                }
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.1 + catIdx * 0.06, damping: 20, stiffness: 200 }}
              style={{
                position: 'absolute',
                left: `${config.x}%`,
                top: `${config.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                zIndex: 2,
              }}
            >
              {/* Parlaklık halkası */}
              {statusStyle.glow > 0 && (
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    width: planetSize + statusStyle.glow * 2,
                    height: planetSize + statusStyle.glow * 2,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${config.color}40 0%, transparent 70%)`,
                  }}
                />
              )}

              {/* Ustalaşma yıldız parçacıkları */}
              {isMastered && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    width: planetSize + 24,
                    height: planetSize + 24,
                    borderRadius: '50%',
                    border: `1px dashed ${config.color}40`,
                  }}
                />
              )}

              {/* Gezegen */}
              <div style={{
                width: planetSize, height: planetSize,
                borderRadius: '50%',
                background: isLocked
                  ? `radial-gradient(circle at 35% 35%, ${colors.text.disabled}, ${colors.background.tertiary})`
                  : `radial-gradient(circle at 35% 35%, ${config.color}, ${config.color}80)`,
                opacity: statusStyle.opacity,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: statusStyle.glow > 0 ? `0 0 ${statusStyle.glow}px ${config.color}` : 'none',
                filter: isLocked ? 'grayscale(0.8)' : 'none',
                position: 'relative',
              }}>
                {(() => {
                  const IconComp = CATEGORY_ICON_MAP[cat.name];
                  return IconComp
                    ? <IconComp size={Math.round(planetSize * 0.45)} color={isLocked ? colors.text.disabled : '#fff'} strokeWidth={2.5} />
                    : null;
                })()}
                {/* Kilit ikonu overlay */}
                {isLocked && (
                  <div style={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: colors.background.secondary,
                    border: `2px solid ${colors.surface.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                  }}>
                    {'\uD83D\uDD12'}
                  </div>
                )}
              </div>

              {/* Gezegen adı — etiket okunabilirliği için tam opaklık ve daha büyük font */}
              <span style={{
                color: isLocked ? colors.text.secondary : colors.text.primary,
                fontSize: 13,
                fontWeight: typography.fontWeight.bold,
                fontFamily: typography.fontFamily.display,
                /* opacity sabit: gezegen silik olsa bile etiket okunsun */
                textAlign: 'center',
                maxWidth: 100,
                textShadow: '0 1px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.7)',
                marginTop: 2,
              }}>
                {config.label}
              </span>

              {/* Mini ilerleme göstergesi — daha okunabilir */}
              {!isLocked && cat.modulesTotal > 0 && (
                <div style={{
                  fontSize: 12,
                  fontWeight: 800,
                  fontFamily: typography.fontFamily.display,
                  color: config.color,
                  textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                }}>
                  {cat.modulesCompleted}/{cat.modulesTotal}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Gezegen detay overlay */}
      <AnimatePresence>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              background: colors.gradient.card,
              borderTop: `2px solid ${PLANET_CONFIGS[selectedPlanet.name]?.color || colors.surface.divider}`,
              borderRadius: `${layout.borderRadius.lg}px ${layout.borderRadius.lg}px 0 0`,
              padding: spacing[5],
              maxHeight: '45%',
              zIndex: 10,
              boxShadow: layout.shadow.lg,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] }}>
              <h3 style={{ color: colors.text.primary, margin: 0, fontSize: typography.fontSize.sm, fontFamily: typography.fontFamily.display, fontWeight: typography.fontWeight.bold, display: 'flex', alignItems: 'center', gap: 8 }}>
                {(() => {
                  const IconComp = CATEGORY_ICON_MAP[selectedPlanet.name];
                  return IconComp
                    ? <IconComp size={20} color={PLANET_CONFIGS[selectedPlanet.name]?.color || colors.text.primary} />
                    : null;
                })()}
                {PLANET_CONFIGS[selectedPlanet.name]?.label}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPlanet(null)}>×</Button>
            </div>

            {/* İlerleme çubuğu */}
            <div style={{ marginBottom: spacing[3] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing[1] }}>
                <span style={{ color: colors.text.tertiary, fontSize: 11 }}>L{selectedPlanet.minLevel}</span>
                <span style={{ color: PLANET_CONFIGS[selectedPlanet.name]?.color, fontSize: 12, fontWeight: typography.fontWeight.semibold }}>L{selectedPlanet.currentLevel}</span>
                <span style={{ color: colors.text.tertiary, fontSize: 11 }}>L{selectedPlanet.maxLevel}</span>
              </div>
              <ProgressBar
                value={(selectedPlanet.currentLevel - selectedPlanet.minLevel)}
                max={(selectedPlanet.maxLevel - selectedPlanet.minLevel)}
                height={8}
              />
            </div>

            {/* Modül yıldızları */}
            <div style={{ display: 'flex', gap: spacing[2], flexWrap: 'wrap', marginBottom: spacing[3] }}>
              {Array.from({ length: selectedPlanet.modulesTotal }).map((_, i) => {
                const planetColor = PLANET_CONFIGS[selectedPlanet.name]?.color;
                const completed = i < selectedPlanet.modulesCompleted;
                return (
                  <div key={i} style={{
                    width: 24, height: 24,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14,
                    background: completed ? planetColor + '30' : colors.surface.input,
                    border: `1px solid ${completed ? planetColor : colors.surface.divider}`,
                    transition: 'all 200ms ease',
                  }}>
                    {completed ? '⭐' : ''}
                  </div>
                );
              })}
            </div>

            <div style={{ color: colors.text.secondary, fontSize: typography.fontSize.xs, marginBottom: spacing[3] }}>
              {selectedPlanet.modulesCompleted} / {selectedPlanet.modulesTotal} modül tamamlandı
            </div>

            {/* Kilitli gezegen mesajı */}
            {selectedPlanet._lockedMessage && (
              <div style={{
                padding: '12px 16px',
                borderRadius: layout.borderRadius.md,
                background: `${colors.feedback.warning}12`,
                border: `1px solid ${colors.feedback.warning}25`,
                color: colors.feedback.warning,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: typography.fontFamily.display,
                textAlign: 'center',
                marginBottom: spacing[2],
              }}>
                {'\uD83D\uDD12'} Bu gezegeni açmak için önce diğer kategorilerde ilerle!
              </div>
            )}

            {/* Aksiyon butonları */}
            {!selectedPlanet._lockedMessage && (
              <div style={{ display: 'flex', gap: spacing[2] }}>
                {selectedPlanet.modulesCompleted > 0 && selectedPlanet.modulesCompleted < selectedPlanet.modulesTotal && (
                  <Button variant="primary" size="md" onClick={() => { /* TODO: Devam et */ }} style={{ flex: 1 }}>
                    Devam Et
                  </Button>
                )}
                <Button
                  variant={selectedPlanet.modulesCompleted === 0 ? 'primary' : 'secondary'}
                  size="md"
                  onClick={() => { /* TODO: Başla */ }}
                  style={{ flex: 1 }}
                >
                  {selectedPlanet.modulesCompleted === 0 ? 'Başla' : 'Baştan Başla'}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rozet galerisi */}
      <div style={{ padding: `${spacing[3]}px ${spacing[4]}px`, borderTop: `1px solid ${colors.surface.divider}` }}>
        <div style={{ display: 'flex', gap: spacing[2], justifyContent: 'center' }}>
          {achievements.slice(0, 6).map((ach, i) => (
            <motion.div
              key={ach.achievementId || i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: colors.gradient.gold,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
                boxShadow: layout.shadow.glow(colors.accent.gold),
              }}
            >
              🏆
            </motion.div>
          ))}
          {achievements.length === 0 && (
            <span style={{ color: colors.text.tertiary, fontSize: typography.fontSize.xs, fontFamily: typography.fontFamily.display }}>Rozetler burada görünecek</span>
          )}
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  background: `radial-gradient(ellipse at center, ${colors.background.secondary} 0%, ${colors.background.primary} 100%)`,
  position: 'relative',
  overflow: 'hidden',
  fontFamily: typography.fontFamily.primary,
};
