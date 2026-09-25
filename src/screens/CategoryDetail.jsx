// GalakSay Analytics — Kategori (alan) detay ekranı
// 2026-09-25: sıfır veride boş durum; "Hız" halkası medyan süreye dayalı; hiç üretilmeyen
// hint_completed olayına bağlı grafik yerine ipucu kademesi dağılımı + hata profili;
// hata örnekleri okunur biçimde; tasarım jetonları.
import React, { useEffect, useState } from 'react';
import { getCategoryStats, getCommonErrors, getRepresentationDistribution, getResponseTimeTrend, getConsistency, getErrorProfile, getAnsweredEvents, MIN_ITEMS_CATEGORY, ERROR_TYPE_LABELS } from '../analytics/PerformanceAnalyzer.js';
import { getCurrentLTLevels, LT_RANGES } from '../analytics/LTProgressEngine.js';
import { CATEGORY_LABELS } from '../analytics/StrengthWeaknessMapper.js';
import BarChartComponent from '../components/analytics/BarChartComponent.jsx';
import ProgressRing from '../components/analytics/ProgressRing.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { spacing, layout } from '../design-system/spacing.js';
import { Button } from '../design-system/components/Button.jsx';
import { Skeleton } from '../design-system/components/Skeleton.jsx';

const font = typography.fontFamily.display;
const sec = (ms) => (ms == null || !Number.isFinite(ms) || ms <= 0 ? '—' : `${(ms / 1000).toFixed(1)} sn`);
// Medyan yanıt süresi → 0–100 hız puanı: ≤2 sn = 100, ≥12 sn = 0 (doğrusal). Görsel özet içindir.
const speedScore = (ms) => (ms == null ? 0 : Math.max(0, Math.min(100, Math.round(((12000 - ms) / 10000) * 100))));

function fmtQuestion(q) {
  if (!q || typeof q !== 'object') return q == null ? '—' : String(q);
  const { type, num1, num2 } = q;
  if (num1 != null && num2 != null) {
    const op = /sub|cikar|remove|difference/i.test(type || '') ? '−' : /mul|carp|times|array|repeat/i.test(type || '') ? '×' : /div|bol|share/i.test(type || '') ? '÷' : /comp|karsi|order|less|more/i.test(type || '') ? ' ? ' : '+';
    return `${num1} ${op} ${num2}`;
  }
  if (num1 != null) return `${type ? type + ' ' : ''}${num1}`;
  return type || JSON.stringify(q);
}

export default function CategoryDetail({ childId, category, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const label = CATEGORY_LABELS[category] || category;

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [st, errors, repDist, rtTrend, consistency, ltLevels, errorProfile, events] = await Promise.all([
          getCategoryStats(childId, category),
          getCommonErrors(childId, category),
          getRepresentationDistribution(childId, category),
          getResponseTimeTrend(childId, category),
          getConsistency(childId, category),
          getCurrentLTLevels(childId),
          getErrorProfile(childId, category),
          getAnsweredEvents(childId, category),
        ]);
        const hintHist = [0, 0, 0, 0, 0, 0];
        for (const e of events) { const h = Math.max(0, Math.min(5, Math.round(Number(e.data?.hintLevelUsed) || 0))); hintHist[h]++; }
        if (!active) return;
        setData({
          st, errors, repDist, rtTrend, consistency, errorProfile, hintHist,
          ltLevel: ltLevels[category]?.level ?? LT_RANGES[category]?.min ?? 0,
          ltProgress: ltLevels[category]?.progress || 0,
          ltRange: LT_RANGES[category] || { min: 0, max: 18 },
        });
      } catch (err) {
        console.error('CategoryDetail load error:', err);
        if (active) setError('Alan verisi yüklenemedi.');
      }
      if (active) setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [childId, category]);

  if (loading) {
    return (
      <div style={pageStyle}>
        <Header label={label} onBack={onBack} />
        <div style={{ padding: spacing[4], display: 'grid', gap: spacing[3] }} aria-busy="true">
          <Skeleton variant="card" width="100%" height={72} />
          <Skeleton variant="card" width="100%" height={120} />
          <Skeleton variant="card" width="100%" height={160} />
        </div>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div style={pageStyle}>
        <Header label={label} onBack={onBack} />
        <div style={{ padding: spacing[6], textAlign: 'center', color: colors.text.secondary }}>{error || 'Veri bulunamadı.'}</div>
      </div>
    );
  }

  const { st } = data;
  const n = st.n;
  const hasData = n > 0;
  const ltPct = Math.max(0, Math.min(100, ((data.ltLevel - data.ltRange.min) / Math.max(1, data.ltRange.max - data.ltRange.min)) * 100));
  const repData = [
    { name: 'Somut', value: data.repDist.somut },
    { name: 'Görsel', value: data.repDist.gorsel },
    { name: 'Sembolik', value: data.repDist.sembolik },
  ];
  const hintData = data.hintHist.map((c, i) => ({ name: i === 0 ? 'İpucusuz' : `Kademe ${i}`, value: n ? Math.round((c / n) * 100) : 0 }));
  const trendText = !hasData || data.rtTrend.direction === 'insufficient' || n < 5 ? 'az veri'
    : data.rtTrend.direction === 'improving' ? '↑ Hızlanıyor' : data.rtTrend.direction === 'declining' ? '↓ Yavaşlıyor' : '→ Sabit';
  const consText = { tutarli: 'Tutarlı', dalgali: 'Dalgalı', tutarsiz: 'Tutarsız' }[data.consistency?.consistency] || '—';

  return (
    <div style={pageStyle}>
      <Header label={label} onBack={onBack} />

      <div style={{ overflow: 'auto', flex: 1, padding: spacing[4], paddingBottom: spacing[8] }}>
        {!hasData && (
          <div style={{ ...cardStyle, textAlign: 'center', padding: spacing[6] }}>
            <div style={{ fontSize: 40, marginBottom: 8 }} aria-hidden="true">🪐</div>
            <div style={{ color: colors.text.primary, fontWeight: 700, fontSize: 15, fontFamily: font }}>Bu alanda henüz soru cevaplanmadı</div>
            <p style={{ color: colors.text.secondary, fontSize: 13, margin: '6px 0 0', lineHeight: 1.5 }}>
              {label} gezegeninde en az {MIN_ITEMS_CATEGORY} soru oynandığında doğruluk, hız, ipucu kullanımı ve hata profili burada görünür.
            </p>
          </div>
        )}

        {/* LT düzeyi */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: colors.text.secondary, fontSize: 12, fontWeight: 600 }}>Öğrenme yörüngesi düzeyi</span>
            <span style={{ color: colors.accent.primaryLight, fontWeight: 800, fontFamily: font }}>{hasData ? `L${data.ltLevel} / L${data.ltRange.max}` : 'başlanmadı'}</span>
          </div>
          <div style={{ height: 10, background: 'rgba(255,255,255,.08)', borderRadius: 5, overflow: 'hidden' }} role="progressbar" aria-valuenow={Math.round(ltPct)} aria-valuemin={0} aria-valuemax={100} aria-label="Düzey ilerlemesi">
            <div style={{ height: '100%', width: `${hasData ? ltPct : 0}%`, background: colors.gradient.accent, borderRadius: 5 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: colors.text.tertiary }}>
            <span>L{data.ltRange.min}</span>
            <span>{hasData ? `Düzey içi ilerleme: %${data.ltProgress}` : ''}</span>
            <span>L{data.ltRange.max}</span>
          </div>
        </div>

        {hasData && (
          <>
            {/* Özet halkalar */}
            <div style={{ display: 'flex', gap: spacing[3], marginBottom: spacing[3], justifyContent: 'center', flexWrap: 'wrap' }}>
              <ProgressRing value={(st.accuracy || 0) * 100} color={colors.accent.secondary} label="Doğruluk" sublabel={`${n} soru${st.sufficient ? '' : ' (az veri)'}`} />
              <ProgressRing value={Math.max(0, 100 - (st.avgHint || 0) * 20)} color={colors.accent.primaryLight} label="Bağımsızlık" sublabel={`Ort. ipucu ${(st.avgHint || 0).toFixed(1)}`} />
              <ProgressRing value={speedScore(st.medianRT)} color={colors.feedback.success} label="Hız" sublabel={`Medyan ${sec(st.medianRT)}`} />
            </div>

            {/* Detay metrikleri */}
            <div style={cardStyle}>
              <h3 style={sectionTitle}>Detaylı metrikler</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
                <MetricRow label="Cevaplanan soru" value={`${n}${st.sufficient ? '' : ` (en az ${MIN_ITEMS_CATEGORY} gerekli)`}`} />
                <MetricRow label="Doğru / yanlış" value={`${st.correct} / ${n - st.correct}`} />
                <MetricRow label="Ortalama yanıt süresi" value={sec(st.avgRT)} />
                <MetricRow label="Medyan yanıt süresi" value={sec(st.medianRT)} />
                <MetricRow label="İpucu kullanılan soru" value={`%${Math.round((st.hintDep || 0) * 100)}`} />
                <MetricRow label="Somut gösterim oranı" value={`%${Math.round((st.concreteRate || 0) * 100)}`} />
                <MetricRow label="Yanıt süresi eğilimi" value={trendText} />
                <MetricRow label="Tutarlılık (son 20)" value={consText} />
              </div>
            </div>

            {/* Hata profili */}
            <div style={cardStyle}>
              <h3 style={sectionTitle}>Hata profili</h3>
              {!data.errorProfile.wrong ? (
                <p style={emptyText}>Bu alanda yanlış cevap yok.</p>
              ) : !data.errorProfile.hasErrorTypes ? (
                <p style={emptyText}>{data.errorProfile.wrong} yanlış cevap var; hata tipi sınıflandırması bu kayıtlarda yok.</p>
              ) : (
                <>
                  <BarChartComponent data={data.errorProfile.top.map(e => ({ name: e.label, value: e.pct }))} title="En sık hata tipleri (yanlışlar içindeki %)" horizontal height={40 + data.errorProfile.top.length * 40} />
                  {data.errorProfile.top.map(e => (
                    <div key={e.type} style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(255,255,255,.03)', borderLeft: `3px solid ${colors.accent.orange}`, borderRadius: layout.borderRadius.sm }}>
                      <div style={{ color: colors.text.primary, fontSize: 13, fontWeight: 700 }}>{e.label} <span style={{ color: colors.accent.orange }}>%{e.pct} ({e.count})</span></div>
                      <div style={{ color: colors.text.secondary, fontSize: 12, lineHeight: 1.45 }}>{e.guidance}</div>
                    </div>
                  ))}
                </>
              )}
              {data.errors.slice(0, 2).map((err, i) => (
                <div key={i} style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(248,113,113,0.08)', borderRadius: layout.borderRadius.sm }}>
                  <div style={{ color: colors.accent.tertiary, fontSize: 11, fontWeight: 600 }}>Örnek — {ERROR_TYPE_LABELS[err.errorType] || err.errorType.replace(/_/g, ' ')}</div>
                  {err.examples.slice(0, 1).map((ex, j) => (
                    <div key={j} style={{ color: colors.text.primary, fontSize: 12, overflowWrap: 'anywhere' }}>
                      Soru: {fmtQuestion(ex.question)} · Verilen: {ex.given ?? '—'} · Doğru: {ex.correct ?? '—'}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* İpucu kademesi dağılımı */}
            <div style={cardStyle}>
              <BarChartComponent data={hintData} title="İpucu kademesi dağılımı (soruların %'si)" height={200} />
              <div style={{ color: colors.text.tertiary, fontSize: 11, textAlign: 'center', marginTop: 4 }}>0 = ipucusuz çözüldü · 5 = tam rehberlik</div>
            </div>

            {/* Temsil dağılımı */}
            <div style={cardStyle}>
              <BarChartComponent data={repData} title="Temsil katmanı kullanımı (%)" height={180} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Header({ label, onBack }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: `${spacing[3]}px ${spacing[4]}px`, borderBottom: `1px solid ${colors.surface.divider}` }}>
      <Button variant="ghost" size="sm" onClick={onBack}>← Geri</Button>
      <h2 style={{ color: colors.text.primary, fontSize: 16, margin: 0, fontFamily: font, fontWeight: 800, flex: 1, textAlign: 'center', minWidth: 0 }}>{label}</h2>
      <div style={{ width: 64 }} />
    </div>
  );
}

function MetricRow({ label, value }) {
  return (
    <div style={{ padding: '6px 0' }}>
      <div style={{ color: colors.text.tertiary, fontSize: 11 }}>{label}</div>
      <div style={{ color: colors.text.primary, fontSize: 14, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

const pageStyle = { display: 'flex', flexDirection: 'column', height: '100%', background: colors.gradient.background, color: colors.text.primary, fontFamily: typography.fontFamily.primary };
const cardStyle = { background: colors.gradient.card, border: `1px solid ${colors.surface.divider}`, borderRadius: layout.borderRadius.lg, padding: spacing[4], marginBottom: spacing[3], boxShadow: layout.shadow.sm };
const sectionTitle = { color: colors.text.primary, fontSize: 14, fontWeight: 700, fontFamily: font, margin: `0 0 ${spacing[3]}px` };
const emptyText = { color: colors.text.tertiary, fontSize: 13, margin: 0 };
