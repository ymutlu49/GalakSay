// GalakSay Pro — 2026-03-19 — Öğretmen/Ebeveyn Dashboard Ana Ekranı (DS entegrasyonu)
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getFullPerformanceProfile, CATEGORIES } from '../analytics/PerformanceAnalyzer.js';
import { getCurrentLTLevels, getLearningMap } from '../analytics/LTProgressEngine.js';
import { calculateRiskLevel } from '../analytics/RiskClassifier.js';
import { getStrengthWeaknessProfile, CATEGORY_LABELS } from '../analytics/StrengthWeaknessMapper.js';
import { generateRecommendations } from '../analytics/RecommendationEngine.js';
import { getAlertsByChild, markAlertRead, getSessionsByChild, getChildProfile } from '../analytics/database.js';
import { getDailySummaries } from '../analytics/database.js';
import { generatePDFReport } from '../analytics/PDFReportGenerator.js';
import SummaryCard from '../components/analytics/SummaryCard.jsx';
import CategoryTable from '../components/analytics/CategoryTable.jsx';
import TrendLineChart from '../components/analytics/TrendLineChart.jsx';
import RadarChartComponent from '../components/analytics/RadarChart.jsx';
import AlertList from '../components/analytics/AlertList.jsx';
import CategoryDetail from './CategoryDetail.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { spacing, layout } from '../design-system/spacing.js';
import { Button } from '../design-system/components/Button.jsx';
import { Card } from '../design-system/components/Card.jsx';
import { Skeleton } from '../design-system/components/Skeleton.jsx';

const VIEWS = { OVERVIEW: 'overview', CATEGORY: 'category', NUMAP: 'numap' };

export default function Dashboard({ childId, onBack }) {
  const [view, setView] = useState(VIEWS.OVERVIEW);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dashboard verileri
  const [profile, setProfile] = useState(null);
  const [childInfo, setChildInfo] = useState(null);
  const [risk, setRisk] = useState(null);
  const [ltLevels, setLtLevels] = useState(null);
  const [learningMap, setLearningMap] = useState(null);
  const [strengthWeakness, setStrengthWeakness] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const loadData = useCallback(async () => {
    if (!childId) return;
    setLoading(true);
    try {
      const [p, ci, r, lt, lm, sw, rec, al, sess] = await Promise.all([
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
      setProfile(p);
      setChildInfo(ci);
      setRisk(r);
      setLtLevels(lt);
      setLearningMap(lm);
      setStrengthWeakness(sw);
      setRecommendations(rec);
      setAlerts(al.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      setSessions(sess);

      // Trend verisi — son 30 günlük günlük özetler
      const endDate = new Date().toISOString().slice(0, 10);
      const startDate = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
      const dailies = await getDailySummaries(childId, startDate, endDate);

      // Günlere göre grupla
      const byDate = {};
      for (const d of dailies) {
        if (!byDate[d.date]) byDate[d.date] = {};
        byDate[d.date][d.category] = d.accuracy * 100;
      }
      const trend = Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, cats]) => ({
        date: date.slice(5), // MM-DD
        ...cats,
      }));
      setTrendData(trend);
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
    setLoading(false);
  }, [childId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDismissAlert = async (alertId) => {
    await markAlertRead(alertId);
    setAlerts(prev => prev.map(a => a.alertId === alertId ? { ...a, read: 1 } : a));
  };

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    setView(VIEWS.CATEGORY);
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
        <div style={{ padding: spacing[4], display: 'flex', flexDirection: 'column', gap: spacing[3], marginTop: spacing[6] }}>
          <Skeleton variant="card" width="100%" height={80} />
          <div style={{ display: 'flex', gap: spacing[2] }}>
            <Skeleton variant="card" width="48%" height={60} />
            <Skeleton variant="card" width="48%" height={60} />
          </div>
          <Skeleton variant="card" width="100%" height={120} />
          <Skeleton variant="card" width="100%" height={160} />
        </div>
      </div>
    );
  }

  // Hesaplanmış değerler
  const totalSessions = sessions.length;
  const totalTimeMs = sessions.reduce((s, x) => s + (x.durationMs || 0), 0);
  const avgSessionMin = totalSessions > 0 ? Math.round(totalTimeMs / totalSessions / 60000) : 0;
  const lastSessionDate = sessions.length > 0
    ? new Date(sessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))[0].startTime)
    : null;
  const daysAgo = lastSessionDate ? Math.round((Date.now() - lastSessionDate.getTime()) / 86400000) : null;

  // Kategori tablosu verisi
  const categoryRows = CATEGORIES.map(cat => ({
    name: cat,
    label: CATEGORY_LABELS[cat],
    accuracy: profile?.categoryMetrics?.[cat]?.accuracy || 0,
    avgRT: profile?.categoryMetrics?.[cat]?.avgRT || 0,
    avgHint: profile?.categoryMetrics?.[cat]?.avgHint || 0,
    ltLevel: ltLevels?.[cat]?.level || 0,
    trend: profile?.categoryMetrics?.[cat]?.rtTrend?.direction || 'stable',
  }));

  // Radar grafik verisi
  const radarData = {};
  for (const cat of CATEGORIES) {
    radarData[cat] = Math.round((profile?.categoryMetrics?.[cat]?.accuracy || 0) * 100);
  }

  const unreadAlerts = alerts.filter(a => !a.read);

  return (
    <div style={pageStyle}>
      {/* Başlık */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${spacing[3]}px ${spacing[4]}px`, borderBottom: `1px solid ${colors.surface.divider}` }}>
        <Button variant="ghost" size="sm" onClick={onBack}>← Geri</Button>
        <h2 style={{ color: colors.text.primary, fontSize: typography.fontSize.sm, margin: 0, fontFamily: typography.fontFamily.display, fontWeight: typography.fontWeight.bold }}>Gelişim Paneli</h2>
        <Button
          variant="secondary"
          size="sm"
          loading={pdfGenerating}
          onClick={async () => {
            setPdfGenerating(true);
            try {
              await generatePDFReport(childId);
            } catch (err) {
              console.error('PDF generation error:', err);
            }
            setPdfGenerating(false);
          }}
        >
          📄 PDF
        </Button>
      </div>

      <div style={{ overflow: 'auto', flex: 1, padding: spacing[4] }}>
        {/* Çocuk kimlik kartı */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: colors.gradient.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              👨‍🚀
            </div>
            <div>
              <div style={{ color: colors.text.primary, fontWeight: typography.fontWeight.bold, fontSize: 15, fontFamily: typography.fontFamily.display }}>{childInfo?.name || 'Uzay Kâşifi'}</div>
              <div style={{ color: colors.text.secondary, fontSize: typography.fontSize.xs }}>
                {childInfo?.gradeLevel ? `${childInfo.gradeLevel}. sınıf` : ''}
                {childInfo?.nuMapRiskLevel ? ` | NuMap Risk: ${childInfo.nuMapRiskLevel}` : ''}
                {risk ? ` → Güncel: ${risk.overallRisk}` : ''}
              </div>
              <div style={{ color: colors.text.tertiary, fontSize: 11, marginTop: 2 }}>
                Toplam: {totalSessions} oturum | {Math.round(totalTimeMs / 60000)} dk
                {daysAgo !== null ? ` | Son: ${daysAgo === 0 ? 'Bugün' : `${daysAgo} gün önce`}` : ''}
                {avgSessionMin > 0 ? ` | Ort: ${avgSessionMin} dk/oturum` : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Özet kartlar */}
        <div style={{ display: 'flex', gap: spacing[2], marginBottom: spacing[4], flexWrap: 'wrap' }}>
          <SummaryCard
            title="Doğruluk"
            value={`%${Math.round((profile?.overallAccuracy || 0) * 100)}`}
            trend="up"
            icon="🎯"
            color={colors.accent.secondary}
          />
          <SummaryCard
            title="İlerleme"
            value={`${learningMap?.totalModulesCompleted || 0}/${learningMap?.totalModules || 61}`}
            subtitle="modül"
            icon="📊"
            color={colors.feedback.hint}
          />
          <SummaryCard
            title="Risk"
            value={`Düzey ${risk?.overallRisk || '?'}`}
            trend={risk?.overallRisk <= 3 ? 'down' : 'up'}
            subtitle={risk?.overallRisk <= 3 ? 'iyi' : 'dikkat'}
            icon="🛡️"
            color={risk?.overallRisk <= 3 ? colors.feedback.success : colors.accent.tertiary}
          />
          <SummaryCard
            title="Aktiflik"
            value={`${totalSessions}`}
            subtitle="oturum"
            icon="📅"
            color={colors.accent.orange}
          />
        </div>

        {/* Bildirimler */}
        {unreadAlerts.length > 0 && (
          <div style={{ ...cardStyle, marginBottom: spacing[4] }}>
            <h3 style={sectionTitle}>Bildirimler ({unreadAlerts.length})</h3>
            <AlertList alerts={unreadAlerts.slice(0, 5)} onDismiss={handleDismissAlert} />
          </div>
        )}

        {/* Kategori tablosu */}
        <div style={{ ...cardStyle, marginBottom: spacing[4] }}>
          <h3 style={sectionTitle}>Kategori Performansı</h3>
          <CategoryTable categories={categoryRows} onCategoryClick={handleCategoryClick} />
        </div>

        {/* Radar grafik */}
        <div style={{ ...cardStyle, marginBottom: spacing[4] }}>
          <RadarChartComponent data={radarData} title="Performans Profili" />
        </div>

        {/* Trend grafik */}
        {trendData.length > 1 && (
          <div style={{ ...cardStyle, marginBottom: spacing[4] }}>
            <TrendLineChart
              data={trendData}
              lines={CATEGORIES.filter(c => trendData.some(d => d[c] != null)).map(c => ({ key: c, label: CATEGORY_LABELS[c] }))}
              title="Doğruluk Trendi (Son 30 Gün)"
              xKey="date"
            />
          </div>
        )}

        {/* Güçlü / Zayıf Alanlar */}
        {strengthWeakness && (
          <div style={{ display: 'flex', gap: spacing[3], marginBottom: spacing[4], flexWrap: 'wrap' }}>
            <div style={{ ...cardStyle, flex: 1, minWidth: 200 }}>
              <h3 style={sectionTitle}>Güçlü Alanlar</h3>
              {strengthWeakness.strengths.length === 0 && <p style={emptyText}>Henüz veri yok</p>}
              {strengthWeakness.strengths.map((s, i) => (
                <div key={i} style={{ marginBottom: spacing[2] }}>
                  <div style={{ color: colors.feedback.success, fontSize: 13, fontWeight: typography.fontWeight.semibold }}>✅ {s.area}</div>
                  <div style={{ color: colors.text.secondary, fontSize: 11 }}>{s.evidence}</div>
                </div>
              ))}
            </div>
            <div style={{ ...cardStyle, flex: 1, minWidth: 200 }}>
              <h3 style={sectionTitle}>Gelişim Alanları</h3>
              {strengthWeakness.weaknesses.length === 0 && <p style={emptyText}>Henüz veri yok</p>}
              {strengthWeakness.weaknesses.map((w, i) => (
                <div key={i} style={{ marginBottom: spacing[2] }}>
                  <div style={{ color: colors.accent.orange, fontSize: 13, fontWeight: typography.fontWeight.semibold }}>⚠️ {w.area}</div>
                  <div style={{ color: colors.text.secondary, fontSize: 11 }}>{w.evidence}</div>
                  {w.suggestedFocus && <div style={{ color: colors.text.tertiary, fontSize: 10, fontStyle: 'italic' }}>{w.suggestedFocus}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Öneriler */}
        {recommendations && (
          <div style={{ ...cardStyle, marginBottom: spacing[4] }}>
            <h3 style={sectionTitle}>Bu Hafta Öneriler</h3>
            {recommendations.activityRecommendations.slice(0, 4).map((r, i) => (
              <div key={i} style={{ marginBottom: spacing[2], paddingLeft: spacing[3], borderLeft: `3px solid ${r.priority === 'high' ? colors.accent.tertiary : r.priority === 'medium' ? colors.accent.gold : colors.feedback.success}` }}>
                <div style={{ color: colors.text.primary, fontSize: typography.fontSize.xs }}>{i + 1}. {r.reason}</div>
              </div>
            ))}
            {recommendations.scheduleRecommendations && (
              <div style={{ marginTop: spacing[2], padding: `${spacing[2]}px ${spacing[3]}px`, background: `${colors.accent.secondary}14`, borderRadius: layout.borderRadius.sm }}>
                <span style={{ color: colors.accent.secondary, fontSize: typography.fontSize.xs }}>⏰ {recommendations.scheduleRecommendations.recommendedFrequency}</span>
                {recommendations.scheduleRecommendations.breakSuggestion && (
                  <span style={{ color: colors.text.secondary, fontSize: 11, display: 'block' }}>{recommendations.scheduleRecommendations.breakSuggestion}</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Ebeveyn önerileri */}
        {recommendations?.parentGuidance && (
          <div style={{ ...cardStyle, marginBottom: spacing[4] }}>
            <h3 style={sectionTitle}>Ebeveyn İçin İpuçları</h3>
            {recommendations.parentGuidance.slice(0, 4).map((g, i) => (
              <div key={i} style={{ color: colors.text.secondary, fontSize: typography.fontSize.xs, marginBottom: spacing[2], paddingLeft: spacing[2] }}>
                💡 {g.tip}
              </div>
            ))}
          </div>
        )}

        {/* Profesyonel yönlendirme */}
        {recommendations?.professionalReferral?.needed && (
          <div style={{ ...cardStyle, marginBottom: spacing[4], border: `1px solid ${colors.accent.tertiary}` }}>
            <h3 style={{ ...sectionTitle, color: colors.accent.tertiary }}>Profesyonel Yönlendirme</h3>
            <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.xs }}>{recommendations.professionalReferral.reason}</p>
            <p style={{ color: colors.text.secondary, fontSize: 11 }}>Önerilen: {recommendations.professionalReferral.suggestedProfessional}</p>
            <p style={{ color: colors.text.tertiary, fontSize: 10, fontStyle: 'italic' }}>{recommendations.professionalReferral.disclaimer}</p>
          </div>
        )}
      </div>
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
  fontSize: typography.fontSize.xs,
  fontWeight: typography.fontWeight.semibold,
  fontFamily: typography.fontFamily.display,
  margin: `0 0 ${spacing[3]}px`,
};

const emptyText = { color: colors.text.tertiary, fontSize: typography.fontSize.xs, margin: 0 };
