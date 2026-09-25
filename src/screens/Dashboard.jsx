// GalakSay Pro — Öğretmen/Ebeveyn Gelişim Paneli.
// 2026-09-25 yeniden yazım: sıfır veride anlamlı boş durumlar ("null"/"?" asla ekrana çıkmaz),
// örneklem eşiği (n) görünür, doz/uyum kartı (42 oturum hedefi), oturum bazlı hedef çizgisi +
// NCII 4-nokta kararı, hata profili, öğretmen adımları; 360px'te kart görünümlü alan tablosu.
// Recharts lazy yüklenir (~536 KB initial bundle azaltma).
import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { getFullPerformanceProfile, CATEGORIES, MIN_ITEMS_CATEGORY, MIN_ITEMS_OVERALL, computeDose, computeProgressMonitoring, realSessions } from '../analytics/PerformanceAnalyzer.js';
import { getCurrentLTLevels, getLearningMap, LT_RANGES } from '../analytics/LTProgressEngine.js';
import { calculateRiskLevel } from '../analytics/RiskClassifier.js';
import { getStrengthWeaknessProfile, CATEGORY_LABELS } from '../analytics/StrengthWeaknessMapper.js';
import { generateRecommendations } from '../analytics/RecommendationEngine.js';
import { getAlertsByChild, markAlertRead, getSessionsByChild, getChildProfile } from '../analytics/database.js';
import AlertList from '../components/analytics/AlertList.jsx';
import CategoryDetail from './CategoryDetail.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { spacing, layout } from '../design-system/spacing.js';
import { Button } from '../design-system/components/Button.jsx';
import { Skeleton } from '../design-system/components/Skeleton.jsx';
import { ProgressBar } from '../design-system/components/ProgressBar.jsx';

const TrendLineChart = lazy(() => import('../components/analytics/TrendLineChart.jsx'));
const RadarChartComponent = lazy(() => import('../components/analytics/RadarChart.jsx'));
const generatePDFReportLazy = () => import('../analytics/PDFReportGenerator.js').then(m => m.generatePDFReport);

const VIEWS = { OVERVIEW: 'overview', CATEGORY: 'category' };
const font = typography.fontFamily.display;
const pct = (x) => (x == null || !Number.isFinite(x) ? '—' : `%${Math.round(x * 100)}`);
const sec = (ms) => (ms == null || !Number.isFinite(ms) || ms <= 0 ? '—' : `${(ms / 1000).toFixed(1)} sn`);
const RISK_COLOR = (lvl) => lvl == null ? colors.text.tertiary : lvl <= 2 ? colors.feedback.success : lvl <= 4 ? colors.accent.gold : colors.accent.tertiary;
const ACC_COLOR = (acc) => acc == null ? colors.text.tertiary : acc >= 0.8 ? colors.feedback.success : acc >= 0.6 ? colors.accent.gold : colors.accent.tertiary;

function useViewportWidth() {
  const [w, setW] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return w;
}

function ChartLoader({ height = 260 }) {
  return (
    <div style={{ width: '100%', height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.text.tertiary, fontSize: 13 }}>
      Grafik yükleniyor…
    </div>
  );
}

function KpiCard({ title, value, sub, color = colors.accent.secondary, icon, children }) {
  return (
    <div style={{ ...cardStyle, marginBottom: 0, padding: `${spacing[3]}px ${spacing[4]}px`, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ color: colors.text.secondary, fontSize: 12, fontWeight: 600 }}>{title}</span>
        {icon && <span aria-hidden="true" style={{ fontSize: 16 }}>{icon}</span>}
      </div>
      <div style={{ color, fontSize: 22, fontWeight: 800, fontFamily: font, lineHeight: 1.1, overflowWrap: 'anywhere' }}>{value}</div>
      {sub && <div style={{ color: colors.text.tertiary, fontSize: 11, marginTop: 4 }}>{sub}</div>}
      {children}
    </div>
  );
}

function EmptyNote({ children }) {
  return <p style={{ color: colors.text.tertiary, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{children}</p>;
}

export default function Dashboard({ childId, onBack }) {
  const width = useViewportWidth();
  const narrow = width < 520;
  const [view, setView] = useState(VIEWS.OVERVIEW);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profile, setProfile] = useState(null);
  const [childInfo, setChildInfo] = useState(null);
  const [risk, setRisk] = useState(null);
  const [ltLevels, setLtLevels] = useState(null);
  const [learningMap, setLearningMap] = useState(null);
  const [sw, setSw] = useState(null);
  const [recs, setRecs] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const loadData = useCallback(async () => {
    if (!childId) return;
    setLoading(true);
    setError(null);
    try {
      const [p, ci, r, lt, lm, s, rec, al, sess] = await Promise.all([
        getFullPerformanceProfile(childId),
        getChildProfile(childId),
        calculateRiskLevel(childId),
        getCurrentLTLevels(childId),
        getLearningMap(childId),
        getStrengthWeaknessProfile(childId),
        generateRecommendations(childId),
        getAlertsByChild(childId),
        getSessionsByChild(childId),
      ]);
      setProfile(p); setChildInfo(ci); setRisk(r); setLtLevels(lt); setLearningMap(lm);
      setSw(s); setRecs(rec);
      setAlerts((al || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      setSessions(realSessions(sess)); // boş (0 soru, <1 dk) oturumlar sayılmaz
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError('Veriler yüklenemedi. Sayfayı yenileyip tekrar deneyin.');
    }
    setLoading(false);
  }, [childId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDismissAlert = async (alertId) => {
    await markAlertRead(alertId);
    setAlerts(prev => prev.map(a => a.alertId === alertId ? { ...a, read: 1 } : a));
  };

  if (view === VIEWS.CATEGORY && selectedCategory) {
    return (
      <CategoryDetail
        childId={childId}
        category={selectedCategory}
        onBack={() => { setView(VIEWS.OVERVIEW); setSelectedCategory(null); }}
      />
    );
  }

  if (loading) {
    return (
      <div style={pageStyle}>
        <Header onBack={onBack} />
        <div style={{ padding: spacing[4], display: 'flex', flexDirection: 'column', gap: spacing[3] }} aria-busy="true">
          <Skeleton variant="card" width="100%" height={80} />
          <div style={{ display: 'flex', gap: spacing[2] }}>
            <Skeleton variant="card" width="48%" height={72} />
            <Skeleton variant="card" width="48%" height={72} />
          </div>
          <Skeleton variant="card" width="100%" height={140} />
          <Skeleton variant="card" width="100%" height={180} />
        </div>
      </div>
    );
  }

  if (error || !profile || !risk) {
    return (
      <div style={pageStyle}>
        <Header onBack={onBack} />
        <div style={{ padding: spacing[6], textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }} aria-hidden="true">📡</div>
          <p style={{ color: colors.text.secondary }}>{error || 'Veri bulunamadı.'}</p>
          <Button variant="secondary" size="sm" onClick={loadData}>Tekrar dene</Button>
        </div>
      </div>
    );
  }

  // ── Türetilmiş değerler ──
  const totalAnswered = profile.totalAnswered || 0;
  const hasData = totalAnswered > 0;
  const totalSessions = sessions.length;
  const totalTimeMin = Math.round(sessions.reduce((s, x) => s + (Number(x.durationMs) || 0), 0) / 60000);
  const dose = computeDose(sessions);
  const pm = computeProgressMonitoring(sessions);
  const unreadAlerts = alerts.filter(a => !a.read);
  const trend = profile.dailyTrend || [];
  const errorProfile = profile.errorProfile || { top: [], wrong: 0, n: 0, hasErrorTypes: false };
  const sufficientCats = CATEGORIES.filter(c => profile.categoryMetrics?.[c]?.sufficient);
  const numapRisk = Number(childInfo?.nuMapRiskLevel) >= 1 ? Number(childInfo.nuMapRiskLevel) : null;

  const radarData = {};
  for (const cat of CATEGORIES) radarData[cat] = Math.round((profile.categoryMetrics?.[cat]?.accuracyOrNull ?? 0) * 100);

  const pmChart = pm.points.map((p, i) => ({ x: `${p.index}`, 'Oturum doğruluğu': p.accuracy, 'Hedef çizgisi': pm.aimline[i]?.value }));
  const DECISION = {
    intensify: { text: 'Son 4 oturum hedef çizgisinin altında — öğretimi yoğunlaştırın (zorluk düşürme, somut destek, daha sık kısa oturum).', color: colors.accent.tertiary },
    raise_goal: { text: 'Son 4 oturum hedef çizgisinin üstünde — hedefi yükseltin (bir üst düzey / daha geniş sayı aralığı).', color: colors.feedback.success },
    continue: { text: 'Oturumlar hedef çizgisi etrafında — mevcut plana devam edin.', color: colors.accent.primaryLight },
    insufficient: { text: `Karar kuralı (NCII 4-nokta) için en az ${pm.minPoints} oturum gerekir; şimdi ${pm.points.length}.`, color: colors.text.tertiary },
  };
  const decision = DECISION[pm.decision] || DECISION.insufficient;
  const weekColor = dose.weekStatus === 'met' ? colors.feedback.success : dose.weekStatus === 'partial' ? colors.accent.gold : dose.weekStatus === 'early' ? colors.text.tertiary : hasData ? colors.accent.tertiary : colors.text.tertiary;
  const weekText = !hasData ? 'Henüz oturum yok'
    : dose.weekStatus === 'met' ? `Bu hafta ${dose.weekSessions}/${dose.weekTarget} — hedef karşılandı`
      : dose.weekStatus === 'partial' ? `Bu hafta ${dose.weekSessions}/${dose.weekTarget} — ${dose.weekTarget - dose.weekSessions} oturum kaldı`
        : dose.weekStatus === 'early' ? `Hafta yeni başladı — hedef ${dose.weekTarget} oturum`
          : `Bu hafta oturum yok${dose.daysSinceLast != null ? ` (son: ${dose.daysSinceLast} gün önce)` : ''}`;

  return (
    <div style={pageStyle}>
      <Header
        onBack={onBack}
        right={(
          <Button
            variant="secondary"
            size="sm"
            loading={pdfGenerating}
            aria-label="PDF rapor indir"
            onClick={async () => {
              setPdfGenerating(true);
              try {
                const generatePDFReport = await generatePDFReportLazy();
                await generatePDFReport(childId);
              } catch (err) {
                console.error('PDF generation error:', err);
              }
              setPdfGenerating(false);
            }}
          >
            📄 PDF rapor
          </Button>
        )}
      />

      <div style={{ overflow: 'auto', flex: 1, padding: spacing[4], paddingBottom: spacing[8] }}>
        {/* Çocuk kimlik kartı */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div aria-hidden="true" style={{ width: 48, height: 48, borderRadius: '50%', background: colors.gradient.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {childInfo?.avatar || '👨‍🚀'}
            </div>
            <div style={{ minWidth: 0, overflowWrap: 'anywhere', flex: 1 }}>
              <div style={{ color: colors.text.primary, fontWeight: 800, fontSize: 16, fontFamily: font }}>{childInfo?.name || 'İsimsiz Öğrenci'}</div>
              <div style={{ color: colors.text.secondary, fontSize: 12, marginTop: 2 }}>
                {[
                  childInfo?.gradeLevel ? `${String(childInfo.gradeLevel).replace(/\.?\s*sınıf$/i, '')}. sınıf` : null,
                  numapRisk ? `Numap başlangıç riski ${numapRisk}/6` : null,
                  `Güncel risk: ${risk.riskLabel}${risk.overallRisk != null ? ` (${risk.overallRisk}/6)` : ''}`,
                ].filter(Boolean).join(' · ')}
              </div>
              <div style={{ color: colors.text.tertiary, fontSize: 11, marginTop: 2 }}>
                {hasData
                  ? `${totalSessions} oturum · ${totalTimeMin} dk · ${totalAnswered} soru${dose.lastSession ? ` · son: ${dose.daysSinceLast === 0 ? 'bugün' : `${dose.daysSinceLast} gün önce`}` : ''}`
                  : 'Henüz oyun oynanmadı'}
              </div>
            </div>
          </div>
        </div>

        {!hasData && (
          <div style={{ ...cardStyle, borderColor: `${colors.accent.primaryLight}55`, background: `${colors.accent.primary}14` }}>
            <div style={{ color: colors.text.primary, fontWeight: 700, fontSize: 14, fontFamily: font }}>🚀 Henüz değerlendirme yok</div>
            <EmptyNote>
              Bu çocuk için kayıtlı oyun verisi yok. Her gezegende en az {MIN_ITEMS_CATEGORY} soru oynatıldığında (toplam {MIN_ITEMS_OVERALL}+) doğruluk, risk düzeyi ve öneriler burada oluşur.
            </EmptyNote>
          </div>
        )}

        {/* KPI kartları */}
        <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr 1fr' : 'repeat(4, minmax(0, 1fr))', gap: spacing[2], marginBottom: spacing[4] }}>
          <KpiCard title="Doğruluk" icon="🎯" value={hasData ? pct(profile.overallAccuracyOrNull) : '—'} sub={hasData ? `${totalAnswered} soru` : 'veri yok'} color={ACC_COLOR(profile.overallAccuracyOrNull)} />
          <KpiCard title="Risk" icon="🛡️" value={risk.riskLabel} sub={risk.overallRisk != null ? `Düzey ${risk.overallRisk}/6` : `${totalAnswered}/${MIN_ITEMS_OVERALL} soru`} color={RISK_COLOR(risk.overallRisk)} />
          <KpiCard title="Doz" icon="⏱️" value={`${dose.sessionsDone}/${dose.targetSessions}`} sub={`${totalTimeMin} dk · ${dose.remainingSessions} oturum kaldı`} color={colors.accent.primaryLight}>
            <div style={{ marginTop: 6 }}><ProgressBar value={dose.pctSessions} max={100} height={6} shimmer={false} /></div>
          </KpiCard>
          <KpiCard title="Bu hafta" icon="📅" value={`${dose.weekSessions}/${dose.weekTarget}`} sub={weekText} color={weekColor} />
        </div>

        {/* Risk açıklaması */}
        <div style={{ ...cardStyle, borderLeft: `4px solid ${RISK_COLOR(risk.overallRisk)}` }}>
          <h3 style={sectionTitle}>Risk değerlendirmesi — ne anlama geliyor?</h3>
          <p style={{ color: colors.text.secondary, fontSize: 13, margin: 0, lineHeight: 1.55 }}>{risk.explanation}</p>
          <p style={{ color: colors.text.tertiary, fontSize: 11, margin: '8px 0 0' }}>
            Ölçek 1–6 (1 = çok düşük risk): 1–2 Düşük · 3–4 Orta · 5–6 Yüksek. Doğruluk, ipucu kademesi, tutarlılık ve hız bileşenlerinden; alan başına en az {MIN_ITEMS_CATEGORY} soru.
          </p>
        </div>

        {/* Bildirimler */}
        {unreadAlerts.length > 0 && (
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Bildirimler ({unreadAlerts.length})</h3>
            <AlertList alerts={unreadAlerts.slice(0, 5)} onDismiss={handleDismissAlert} />
          </div>
        )}

        {/* İlerleme izleme: oturum bazlı doğruluk + hedef çizgisi */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>İlerleme izleme — oturum doğruluğu ve hedef çizgisi</h3>
          {pmChart.length >= 2 ? (
            <>
              <Suspense fallback={<ChartLoader height={240} />}>
                <TrendLineChart data={pmChart} xKey="x" height={240}
                  lines={[{ key: 'Oturum doğruluğu', label: 'Oturum doğruluğu' }, { key: 'Hedef çizgisi', label: `Hedef çizgisi (→ %${pm.goal})` }]} />
              </Suspense>
              <div style={{ marginTop: spacing[2], padding: `${spacing[2]}px ${spacing[3]}px`, borderLeft: `3px solid ${decision.color}`, background: 'rgba(255,255,255,.03)', borderRadius: layout.borderRadius.sm }}>
                <div style={{ color: colors.text.primary, fontSize: 13, lineHeight: 1.5 }}>{decision.text}</div>
                <div style={{ color: colors.text.tertiary, fontSize: 11, marginTop: 4 }}>X ekseni: oturum sırası. Hedef çizgisi ilk oturum doğruluğundan 42. oturumda %80'e doğrusal çıkar.</div>
              </div>
            </>
          ) : (
            <EmptyNote>{hasData ? 'Hedef çizgisi için en az iki oturum gerekir.' : 'İlk oturumlardan sonra oturum bazlı doğruluk ve hedef çizgisi burada çizilir.'}</EmptyNote>
          )}
        </div>

        {/* Alan tablosu */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Alan bazlı performans</h3>
          {!hasData ? (
            <EmptyNote>Henüz alan verisi yok. Alanlar oynandıkça soru sayısı, doğruluk, yanıt süresi ve düzey burada görünür.</EmptyNote>
          ) : narrow ? (
            <div style={{ display: 'grid', gap: spacing[2] }}>
              {CATEGORIES.map(cat => {
                const m = profile.categoryMetrics?.[cat] || {};
                const n = m.n || 0;
                return (
                  <button key={cat} type="button" onClick={() => { setSelectedCategory(cat); setView(VIEWS.CATEGORY); }}
                    style={{ ...rowBtn, opacity: n ? 1 : 0.6 }} aria-label={`${CATEGORY_LABELS[cat]} detayı`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ color: colors.text.primary, fontWeight: 700, fontSize: 14 }}>{CATEGORY_LABELS[cat]}</span>
                      <span style={{ color: ACC_COLOR(n ? m.accuracyOrNull : null), fontWeight: 800, fontSize: 15 }}>{n ? pct(m.accuracyOrNull) + (m.sufficient ? '' : '*') : '—'}</span>
                    </div>
                    <div style={{ color: colors.text.tertiary, fontSize: 11, marginTop: 2 }}>
                      {n ? `${n} soru · ${sec(m.medianRT)} · ipucu ${m.avgHint.toFixed(1)} · L${ltLevels?.[cat]?.level ?? LT_RANGES[cat].min}` : 'henüz oynanmadı'}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.surface.divider}` }}>
                    <th style={thStyle}>Alan</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Soru</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Doğruluk</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Medyan süre</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>İpucu</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Düzey</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Hız eğilimi</th>
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map((cat, i) => {
                    const m = profile.categoryMetrics?.[cat] || {};
                    const n = m.n || 0;
                    const dir = m.rtTrend?.direction;
                    const tr = !n ? '—' : dir === 'improving' ? '↑ hızlanıyor' : dir === 'declining' ? '↓ yavaşlıyor' : dir === 'insufficient' ? 'az veri' : '→ sabit';
                    return (
                      <tr key={cat} onClick={() => { setSelectedCategory(cat); setView(VIEWS.CATEGORY); }}
                        style={{ borderBottom: `1px solid ${colors.surface.divider}`, cursor: 'pointer', background: i % 2 ? 'rgba(255,255,255,.02)' : 'transparent', opacity: n ? 1 : 0.55 }}>
                        <td style={tdStyle}>{CATEGORY_LABELS[cat]}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>{n}</td>
                        <td style={{ ...tdStyle, textAlign: 'right', color: ACC_COLOR(n ? m.accuracyOrNull : null), fontWeight: 700 }}>{n ? pct(m.accuracyOrNull) + (m.sufficient ? '' : '*') : '—'}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>{n ? sec(m.medianRT) : '—'}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>{n ? m.avgHint.toFixed(1) : '—'}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>{n ? `L${ltLevels?.[cat]?.level ?? LT_RANGES[cat].min}` : '—'}</td>
                        <td style={{ ...tdStyle, textAlign: 'right', color: dir === 'improving' ? colors.feedback.success : dir === 'declining' ? colors.accent.tertiary : colors.text.tertiary }}>{tr}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {hasData && <div style={{ color: colors.text.tertiary, fontSize: 11, marginTop: 8 }}>* {MIN_ITEMS_CATEGORY} sorudan az — yorumlanmamalı. Satıra dokunarak alan detayını açın.</div>}
        </div>

        {/* Radar — yalnız yeterli veri olan alan varsa */}
        {sufficientCats.length >= 3 && (
          <div style={cardStyle}>
            <Suspense fallback={<ChartLoader height={320} />}>
              <RadarChartComponent data={radarData} title="Performans profili (doğruluk %)" height={320} />
            </Suspense>
            {sufficientCats.length < CATEGORIES.length && (
              <div style={{ color: colors.text.tertiary, fontSize: 11, textAlign: 'center' }}>Yeterli verisi olmayan alanlar 0 görünür.</div>
            )}
          </div>
        )}

        {/* Günlük eğilim */}
        {trend.length > 1 && (
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Günlük doğruluk (son 30 gün)</h3>
            <Suspense fallback={<ChartLoader height={240} />}>
              <TrendLineChart
                data={trend.map(t => ({ date: t.label, Doğruluk: t.accuracy }))}
                lines={[{ key: 'Doğruluk', label: 'Günlük doğruluk (%)' }]}
                xKey="date" height={240}
              />
            </Suspense>
            <div style={{ color: colors.text.tertiary, fontSize: 11, marginTop: 4 }}>Her nokta bir gün; günde az soru varsa dalgalanma doğaldır.</div>
          </div>
        )}

        {/* Güçlü / Gelişim alanları */}
        {sw && hasData && (
          <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: spacing[3], marginBottom: spacing[3] }}>
            <div style={{ ...cardStyle, marginBottom: 0 }}>
              <h3 style={sectionTitle}>Güçlü alanlar</h3>
              {sw.strengths.length === 0 && <EmptyNote>Henüz %80+ doğrulukla, ipucusuz çalışılan bir alan yok.</EmptyNote>}
              {sw.strengths.map((s) => (
                <div key={s.category} style={{ marginBottom: spacing[2] }}>
                  <div style={{ color: colors.feedback.success, fontSize: 13, fontWeight: 700 }}>✅ {s.area}</div>
                  <div style={{ color: colors.text.secondary, fontSize: 12 }}>{s.evidence}</div>
                </div>
              ))}
            </div>
            <div style={{ ...cardStyle, marginBottom: 0 }}>
              <h3 style={sectionTitle}>Gelişim alanları</h3>
              {sw.weaknesses.length === 0 && <EmptyNote>Değerlendirilen alanlarda engellenme düzeyi (&lt;%60) veya yoğun ipucu ihtiyacı yok.</EmptyNote>}
              {sw.weaknesses.map((w) => (
                <div key={w.category} style={{ marginBottom: spacing[2] }}>
                  <div style={{ color: colors.accent.orange, fontSize: 13, fontWeight: 700 }}>⚠️ {w.area}</div>
                  <div style={{ color: colors.text.secondary, fontSize: 12 }}>{w.evidence}</div>
                  {w.suggestedFocus && <div style={{ color: colors.text.tertiary, fontSize: 11, fontStyle: 'italic' }}>{w.suggestedFocus}</div>}
                </div>
              ))}
              {sw.notAssessed?.length > 0 && (
                <div style={{ color: colors.text.tertiary, fontSize: 11, marginTop: 4 }}>
                  Henüz değerlendirilmedi (&lt;{MIN_ITEMS_CATEGORY} soru): {sw.notAssessed.map(x => `${x.area} (${x.n})`).join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hata profili */}
        {hasData && (
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Hata profili</h3>
            {!errorProfile.wrong ? <EmptyNote>Yanlış cevap yok.</EmptyNote>
              : !errorProfile.hasErrorTypes ? <EmptyNote>{errorProfile.wrong} yanlış cevap var; hata tipi sınıflandırması bu kayıtlarda yok.</EmptyNote>
                : (
                  <>
                    <div style={{ color: colors.text.tertiary, fontSize: 12, marginBottom: 8 }}>{errorProfile.n} sorunun {errorProfile.wrong}'i yanlış. En sık hata tipleri (yanlışlar içindeki payı):</div>
                    {errorProfile.top.map(e => (
                      <div key={e.type} style={{ marginBottom: spacing[2], paddingLeft: spacing[3], borderLeft: `3px solid ${colors.accent.orange}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                          <span style={{ color: colors.text.primary, fontSize: 13, fontWeight: 700 }}>{e.label}</span>
                          <span style={{ color: colors.accent.orange, fontSize: 13, fontWeight: 800 }}>%{e.pct} ({e.count})</span>
                        </div>
                        <div style={{ color: colors.text.secondary, fontSize: 12, lineHeight: 1.45 }}>{e.guidance}</div>
                      </div>
                    ))}
                  </>
                )}
          </div>
        )}

        {/* Öğretmen için sonraki adımlar */}
        {recs && (
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Öğretmen için sonraki adımlar</h3>
            {(recs.teacherNextSteps || []).length === 0 && (
              <EmptyNote>{hasData ? 'Öncelikli bir gelişim alanı görülmedi; mevcut düzeyi pekiştirip güçlü alanlarda bir üst basamağa geçilebilir.' : 'İlk oturumlardan sonra öneriler burada oluşur.'}</EmptyNote>
            )}
            {(recs.teacherNextSteps || []).slice(0, 5).map((s, i) => (
              <div key={`${s.category}-${i}`} style={{ marginBottom: spacing[2], paddingLeft: spacing[3], borderLeft: `3px solid ${s.priority === 'high' ? colors.accent.tertiary : s.priority === 'medium' ? colors.accent.gold : colors.feedback.success}` }}>
                <div style={{ color: colors.text.primary, fontSize: 13, fontWeight: 700 }}>{i + 1}. {s.area} <span style={{ color: colors.text.tertiary, fontWeight: 500, fontSize: 11 }}>· {s.priority === 'high' ? 'yüksek' : s.priority === 'medium' ? 'orta' : 'düşük'} öncelik</span></div>
                <div style={{ color: colors.text.secondary, fontSize: 12, lineHeight: 1.45 }}>{s.step}</div>
                {s.evidence && <div style={{ color: colors.text.tertiary, fontSize: 11 }}>Kanıt: {s.evidence}</div>}
              </div>
            ))}
            {recs.scheduleRecommendations && (
              <div style={{ marginTop: spacing[2], padding: `${spacing[2]}px ${spacing[3]}px`, background: `${colors.accent.secondary}14`, borderRadius: layout.borderRadius.sm }}>
                <span style={{ color: colors.accent.secondary, fontSize: 13 }}>⏰ {recs.scheduleRecommendations.recommendedFrequency} · oturum {recs.scheduleRecommendations.optimalSessionDuration_min} dk</span>
                {recs.scheduleRecommendations.breakSuggestion && (
                  <span style={{ color: colors.text.secondary, fontSize: 11, display: 'block' }}>{recs.scheduleRecommendations.breakSuggestion}</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Öğrenme yörüngesi düzeyleri */}
        {ltLevels && hasData && (
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Öğrenme yörüngesi düzeyleri (Clements–Sarama)</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {CATEGORIES.map(cat => {
                const n = profile.categoryMetrics?.[cat]?.n || 0;
                const range = LT_RANGES[cat];
                const level = ltLevels[cat]?.level ?? range.min;
                const p = Math.max(0, Math.min(100, ((level - range.min) / Math.max(1, range.max - range.min)) * 100));
                return (
                  <div key={cat} style={{ opacity: n ? 1 : 0.5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                      <span style={{ color: colors.text.secondary, fontWeight: 600 }}>{CATEGORY_LABELS[cat]}</span>
                      <span style={{ color: colors.text.tertiary }}>{n ? `L${level} / L${range.max} · düzey içi %${ltLevels[cat]?.progress ?? 0}` : 'başlanmadı'}</span>
                    </div>
                    <ProgressBar value={n ? p : 0} max={100} height={6} shimmer={false} />
                  </div>
                );
              })}
            </div>
            <div style={{ color: colors.text.tertiary, fontSize: 11, marginTop: 8 }}>Keşfedilen oyun: {learningMap?.totalModulesCompleted || 0}/{learningMap?.totalModules || 65} oyun modu.</div>
          </div>
        )}

        {/* Ebeveyn notu */}
        {recs?.parentNote && (
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Ebeveyn için not</h3>
            <p style={{ color: colors.text.secondary, fontSize: 13, lineHeight: 1.55, margin: '0 0 8px' }}>{recs.parentNote}</p>
            {(recs.parentGuidance || []).slice(0, 3).map((g, i) => (
              <div key={i} style={{ color: colors.text.secondary, fontSize: 12, marginBottom: 6, paddingLeft: spacing[2] }}>💡 {g.tip}</div>
            ))}
          </div>
        )}

        {/* Profesyonel yönlendirme */}
        {(recs?.professionalReferral?.needed || recs?.professionalReferral?.reason) && (
          <div style={{ ...cardStyle, border: `1px solid ${recs.professionalReferral.needed ? colors.accent.tertiary : colors.accent.gold}` }}>
            <h3 style={{ ...sectionTitle, color: recs.professionalReferral.needed ? colors.accent.tertiary : colors.accent.gold }}>
              {recs.professionalReferral.needed ? 'Profesyonel değerlendirme önerilir' : 'İzleme önerilir'}
            </h3>
            <p style={{ color: colors.text.secondary, fontSize: 13, margin: '0 0 6px' }}>{recs.professionalReferral.reason}</p>
            {recs.professionalReferral.suggestedProfessional && <p style={{ color: colors.text.secondary, fontSize: 12, margin: '0 0 6px' }}>Önerilen: {recs.professionalReferral.suggestedProfessional}</p>}
            <p style={{ color: colors.text.tertiary, fontSize: 11, fontStyle: 'italic', margin: 0 }}>{recs.professionalReferral.disclaimer}</p>
          </div>
        )}

        <p style={{ color: colors.text.tertiary, fontSize: 11, textAlign: 'center', margin: `${spacing[4]}px 0 0` }}>
          Bu panel bir tanı aracı değildir; eğitsel izleme amaçlıdır. Veriler bu cihazda saklanır (KVKK).
        </p>
      </div>
    </div>
  );
}

function Header({ onBack, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: `${spacing[3]}px ${spacing[4]}px`, borderBottom: `1px solid ${colors.surface.divider}` }}>
      <Button variant="ghost" size="sm" onClick={onBack}>← Geri</Button>
      <h2 style={{ color: colors.text.primary, fontSize: 16, margin: 0, fontFamily: font, fontWeight: 800, textAlign: 'center', flex: 1, minWidth: 0 }}>Gelişim Paneli</h2>
      <div style={{ minWidth: 60, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  background: colors.gradient.background,
  color: colors.text.primary,
  fontFamily: typography.fontFamily.primary,
};

const cardStyle = {
  background: colors.gradient.card,
  border: `1px solid ${colors.surface.divider}`,
  borderRadius: layout.borderRadius.lg,
  padding: spacing[4],
  marginBottom: spacing[3],
  boxShadow: layout.shadow.sm,
};

const sectionTitle = {
  color: colors.text.primary,
  fontSize: 14,
  fontWeight: 700,
  fontFamily: font,
  margin: `0 0 ${spacing[3]}px`,
};

const thStyle = { textAlign: 'left', padding: '8px 10px', color: colors.text.secondary, fontWeight: 600, fontSize: 12, whiteSpace: 'nowrap' };
const tdStyle = { padding: '10px 10px', color: colors.text.primary, whiteSpace: 'nowrap' };
const rowBtn = {
  width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
  background: 'rgba(255,255,255,.03)', border: `1px solid ${colors.surface.divider}`, borderRadius: layout.borderRadius.md,
  padding: '10px 12px', minHeight: 44,
};
