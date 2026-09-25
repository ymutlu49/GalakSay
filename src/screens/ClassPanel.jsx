// GalakSay — Sınıf Paneli (öğretmenin Numap çocuklarının oyun ilerleme özeti).
//
// ChildSelect'in alt-görünümü (view==='classPanel'). Öğretmenin Numap'te
// tanıladığı çocukların (children prop) GalakSay'da OYNADIĞI oyunların
// ilerlemesini IndexedDB'den (child_profiles + game_sessions + question_answered
// olayları) toplar — Dashboard.jsx'in tek-çocuk desenini N çocuğa uygular.
// Tanılama Numap'te kalır; bu panel onu TAMAMLAYAN müdahale-takibidir (oyun
// ilerlemesi, Numap'te olmayan veri). Yalnız bu öğretmenin çocukları okunur
// (children pivotu) → RBAC-temiz; kullanıcı yönetimi Numap'te olduğu için burada
// "Yönetim Paneli" KASTEN yoktur.

// 2026-09-25: avatar roster'dan (c.avatar), detay yükleme yarış hatası düzeltildi (effect'in
// kendi setDetail'i cleanup'ı tetikleyip sonucu düşürüyordu), doz çubuğu (n/42) + haftalık
// uyum bayrağı, genişletilmiş kartta n/risk/öncelikli alan, örneklem eşiğine saygılı kategori satırları.
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import { Button } from '../design-system/components/Button.jsx';
import { Card } from '../design-system/components/Card.jsx';
import { EmptyState } from '../design-system/components/EmptyState.jsx';
import { ProgressBar } from '../design-system/components/ProgressBar.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { layout } from '../design-system/spacing.js';
import { getChildProfile, getSessionsByChild } from '../analytics/database.js';
import { getFullPerformanceProfile, CATEGORIES, MIN_ITEMS_CATEGORY, computeDose, realSessions } from '../analytics/PerformanceAnalyzer.js';
import { calculateRiskLevel } from '../analytics/RiskClassifier.js';
import { CATEGORY_LABELS } from '../analytics/StrengthWeaknessMapper.js';

const AVATARS = ['🚀', '🪐', '⭐', '🌟', '🛸', '☄️', '🌙', '🌍'];
function avatarFor(name) {
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATARS[h % AVATARS.length];
}
function gradeLabel(g) {
  if (!g) return '';
  return /^\d+$/.test(String(g)) ? `${g}. sınıf` : g;
}
function dateLabel(ts) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

// Doğruluk (0-1, null=hiç oynamadı) → başarı kademesi.
function band(acc) {
  if (acc == null) return 'none';
  const p = acc * 100;
  if (p >= 80) return 'excellent';
  if (p >= 60) return 'good';
  if (p >= 40) return 'developing';
  return 'support';
}
const BANDS = {
  excellent:  { label: 'Mükemmel (%80+)',      color: colors.feedback.success },
  good:       { label: 'İyi (%60-79)',          color: '#eab308' },
  developing: { label: 'Gelişmeli (%40-59)',    color: colors.accent.orange },
  support:    { label: 'Destek gerekli (<%40)', color: colors.feedback.error },
  none:       { label: 'Henüz başlamadı',       color: colors.text.tertiary },
};
const BAND_ORDER = ['excellent', 'good', 'developing', 'support', 'none'];
function bandColor(acc) {
  return BANDS[band(acc)].color;
}

const font = typography.fontFamily.display;

export default function ClassPanel({ roster = [], teacher, onBack, onSelectChild, onLogout, source = 'numap' }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null); // ns | null
  const [detail, setDetail] = useState({}); // ns -> {profile, risk} | 'loading' | null(yok)
  const inflight = useRef(new Set());
  const [exporting, setExporting] = useState(null); // null | 'csv' | 'csv-anon' | 'pdf'

  // Her çocuğun IndexedDB özetini paralel topla (Dashboard.jsx deseni × N).
  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all(
      (roster || []).map(async (c) => {
        try {
          const [profile, rawSessions, perf] = await Promise.all([
            getChildProfile(c.ns),
            getSessionsByChild(c.ns),
            getFullPerformanceProfile(c.ns),
          ]);
          const sessions = realSessions(rawSessions); // boş (0 soru, <1 dk) oturumlar sayılmaz
          const sessionCount = sessions.length;
          const lastPlayed = sessionCount
            ? sessions.reduce((m, s) => Math.max(m, new Date(s.startTime).getTime() || 0), 0)
            : 0;
          const n = perf?.totalAnswered || 0;
          return {
            child: c, ns: c.ns, name: c.name, grade: c.grade,
            played: sessionCount > 0 || n > 0,
            sessionCount,
            n,
            accuracy: n > 0 ? perf.overallAccuracyOrNull : null,
            lastPlayed,
            dose: computeDose(sessions || []),
            riskLevel: profile?.nuMapRiskLevel ?? null,
          };
        } catch {
          return {
            child: c, ns: c.ns, name: c.name, grade: c.grade,
            played: false, sessionCount: 0, n: 0, accuracy: null, lastPlayed: 0, dose: computeDose([]), riskLevel: null,
          };
        }
      }),
    ).then((r) => {
      if (!active) return;
      // Oynamışlar önce (son oynama desc), sonra oynamamışlar (ad A-Z).
      r.sort((a, b) => {
        if (a.played !== b.played) return a.played ? -1 : 1;
        if (a.played) return b.lastPlayed - a.lastPlayed;
        return (a.name || '').localeCompare(b.name || '', 'tr');
      });
      setRows(r);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [roster]);

  // Açılan kartın kategori detayını (ağır) tembel yükle — yalnız bir kez. Efekt yalnız
  // `expanded`'a bağlıdır; in-flight seti tekrar tetiklemeyi önler (eski sürümde setDetail
  // efekti yeniden çalıştırıp cleanup ile sonucu düşürüyordu → "yükleniyor" asılı kalıyordu).
  useEffect(() => {
    if (!expanded || inflight.current.has(expanded)) return;
    let known = false;
    setDetail((d) => { known = expanded in d && d[expanded] !== 'loading'; return known ? d : { ...d, [expanded]: 'loading' }; });
    if (known) return;
    inflight.current.add(expanded);
    Promise.all([getFullPerformanceProfile(expanded), calculateRiskLevel(expanded)])
      .then(([profile, risk]) => setDetail((d) => ({ ...d, [expanded]: { profile, risk } })))
      .catch(() => setDetail((d) => ({ ...d, [expanded]: null })))
      .finally(() => inflight.current.delete(expanded));
  }, [expanded]);

  const toggleExpand = useCallback((ns) => {
    setExpanded((cur) => (cur === ns ? null : ns));
  }, []);

  // Akademik CSV paketi (YALNIZ paneldeki roster, lazy import). anonymous → ham kimlik çıkarılır.
  const handleExportCSV = useCallback(async (anonymous) => {
    setExporting(anonymous ? 'csv-anon' : 'csv');
    try {
      const { exportAcademicCSV } = await import('../utils/csvExport.js');
      await exportAcademicCSV({ anonymous, childIds: (roster || []).map((c) => c.ns).filter(Boolean) });
    } catch (e) {
      console.error('[ClassPanel] CSV export hatası:', e);
    } finally {
      setExporting(null);
    }
  }, [roster]);

  // Sınıf-geneli profesyonel PDF rapor (ön-son etki dahil, lazy import).
  const handleClassPDF = useCallback(async () => {
    setExporting('pdf');
    try {
      const { generateClassPDFReport } = await import('../analytics/ClassReportGenerator.js');
      await generateClassPDFReport(roster, teacher, { anonymous: false });
    } catch (e) {
      console.error('[ClassPanel] PDF rapor hatası:', e);
    } finally {
      setExporting(null);
    }
  }, [roster, teacher]);

  const playedRows = rows.filter((r) => r.played);
  const playedCount = playedRows.length;
  const accRows = playedRows.filter((r) => r.accuracy != null);
  const avgAcc = accRows.length
    ? Math.round((accRows.reduce((s, r) => s + r.accuracy, 0) / accRows.length) * 100)
    : null;
  const weekMet = rows.filter((r) => r.dose?.weekStatus === 'met').length;

  // Başarı dağılımı (her çocuk bir kademede).
  const dist = { excellent: 0, good: 0, developing: 0, support: 0, none: 0 };
  for (const r of rows) dist[band(r.accuracy)]++;

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: colors.gradient.background,
        padding: '24px 16px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <SpaceBackground starCount={50} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
        {/* Başlık + geri + çıkış */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.text.primary, fontFamily: font, margin: '0 0 4px' }}>
              📊 Sınıf İlerlemesi
            </h1>
            <p style={{ fontSize: 13, color: colors.text.secondary, fontFamily: font, margin: 0 }}>
              {teacher?.name ? `${teacher.name} • ` : ''}GalakSay oyun ilerlemesi
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <Button variant="ghost" size="sm" onClick={onBack}>← Geri</Button>
            {onLogout && (
              <Button variant="ghost" size="sm" onClick={onLogout}>Çıkış</Button>
            )}
          </div>
        </div>

        {/* KPI özeti */}
        {!loading && rows.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 8,
              marginBottom: 16,
            }}
          >
            {[
              { v: rows.length, l: 'Çocuk' },
              { v: playedCount, l: 'Oynamış' },
              { v: avgAcc == null ? '—' : `%${avgAcc}`, l: 'Ort. başarı' },
              { v: `${weekMet}/${rows.length}`, l: 'Hafta hedefi' },
            ].map((k) => (
              <div
                key={k.l}
                style={{
                  background: 'rgba(15,23,42,.45)',
                  border: `1px solid ${colors.surface.divider}`,
                  borderRadius: layout.borderRadius.md,
                  padding: '12px 8px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800, color: colors.text.primary, fontFamily: font }}>{k.v}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: colors.text.tertiary, fontFamily: font, marginTop: 2 }}>{k.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Akademik veri araçları */}
        {!loading && rows.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <Button variant="secondary" size="sm" disabled={!!exporting} onClick={() => handleExportCSV(false)}>
              {exporting === 'csv' ? 'Hazırlanıyor…' : '📊 Veri (CSV)'}
            </Button>
            <Button variant="ghost" size="sm" disabled={!!exporting} onClick={() => handleExportCSV(true)}>
              {exporting === 'csv-anon' ? 'Hazırlanıyor…' : '🔒 Anonim CSV'}
            </Button>
            <Button variant="secondary" size="sm" disabled={!!exporting} onClick={handleClassPDF}>
              {exporting === 'pdf' ? 'Hazırlanıyor…' : '🖨 Sınıf raporu (PDF)'}
            </Button>
          </div>
        )}

        {/* İçerik */}
        {loading ? (
          <div style={{ textAlign: 'center', color: colors.text.secondary, fontFamily: font, padding: 48 }}>
            İlerleme yükleniyor…
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon="🧒"
            title="Henüz çocuk yok"
            description={source === 'local'
              ? 'Ana sayfadan "Yeni Öğrenci" ile profil ekleyin; oynadıkça ilerleme burada görünecek.'
              : 'Numap\'te bir tarama tamamlayın; çocuk burada görünecek.'}
            actionLabel="← Geri dön"
            onAction={onBack}
          />
        ) : (
          <>
            {/* Öğrenci kartları */}
            <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
              {rows.map((r) => {
                const open = expanded === r.ns;
                const pct = r.accuracy != null ? Math.round(r.accuracy * 100) : null;
                const full = detail[r.ns];
                return (
                  <Card key={r.ns} padding={0}>
                    {/* Özet satırı (tıkla → genişlet) */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleExpand(r.ns)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleExpand(r.ns)}
                      style={{ cursor: 'pointer', padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}
                    >
                      <div
                        style={{
                          fontSize: 26, width: 46, height: 46, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: '50%', background: 'rgba(108,99,255,.15)',
                        }}
                      >
                        {r.child?.avatar || avatarFor(r.name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: colors.text.primary, fontFamily: font, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {r.name}
                          </span>
                          {r.child?.demo && (
                            <span
                              title="Demo sınıfı — sunum için örnek öğrenci"
                              style={{ flexShrink: 0, fontSize: 10, fontWeight: 800, letterSpacing: 0.6, fontFamily: font, padding: '2px 7px', borderRadius: layout.borderRadius.full, background: 'rgba(255,217,61,.14)', border: '1px solid rgba(255,217,61,.45)', color: colors.accent.gold }}
                            >
                              DEMO
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: colors.text.tertiary, fontFamily: font, marginTop: 2 }}>
                          {r.played
                            ? [gradeLabel(r.grade), `${r.sessionCount} oturum`, r.lastPlayed ? `son: ${dateLabel(r.lastPlayed)}` : ''].filter(Boolean).join(' • ')
                            : [gradeLabel(r.grade), 'henüz oynamadı'].filter(Boolean).join(' • ')}
                        </div>
                        {r.played && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                            <div style={{ flex: 1, maxWidth: 160 }}>
                              <ProgressBar value={r.dose.pctSessions} max={100} height={5} shimmer={false} gradient={colors.accent.primaryLight} />
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 700, color: colors.text.tertiary, fontFamily: font, whiteSpace: 'nowrap' }}>
                              doz {r.dose.sessionsDone}/{r.dose.targetSessions}
                            </span>
                            <span
                              title={`Bu hafta ${r.dose.weekSessions}/${r.dose.weekTarget} oturum (hedef ≥3)`}
                              style={{
                                fontSize: 10, fontWeight: 800, fontFamily: font, whiteSpace: 'nowrap', padding: '1px 6px', borderRadius: layout.borderRadius.full,
                                color: r.dose.weekStatus === 'met' ? colors.feedback.success : r.dose.weekStatus === 'partial' ? colors.accent.gold : r.dose.weekStatus === 'early' ? colors.text.tertiary : colors.feedback.error,
                                background: r.dose.weekStatus === 'met' ? 'rgba(5,150,105,.14)' : r.dose.weekStatus === 'partial' ? 'rgba(255,217,61,.14)' : r.dose.weekStatus === 'early' ? 'rgba(255,255,255,.06)' : 'rgba(249,115,22,.14)',
                              }}
                            >
                              {r.dose.weekStatus === 'none' ? '⚑ ' : ''}hafta {r.dose.weekSessions}/{r.dose.weekTarget}
                            </span>
                          </div>
                        )}
                      </div>
                      {pct != null ? (
                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: bandColor(r.accuracy), fontFamily: font }}>%{pct}</div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: colors.text.tertiary, fontFamily: font }}>başarı</div>
                        </div>
                      ) : (
                        <span style={{ fontSize: 18, flexShrink: 0 }}>🆕</span>
                      )}
                      <span style={{ fontSize: 16, color: colors.accent.primaryLight, flexShrink: 0, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>›</span>
                    </div>

                    {/* Genişletilmiş detay */}
                    {open && (
                      <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${colors.surface.divider}`, marginTop: -2, paddingTop: 12 }}>
                        {!r.played ? (
                          <p style={{ fontSize: 13, color: colors.text.secondary, fontFamily: font, margin: '4px 0 12px' }}>
                            Bu çocuk henüz GalakSay'da oyun oynamadı. "Oyna" ile değerlendirme sonucuna göre kişiselleştirilmiş oyuna başlayabilirsiniz.
                          </p>
                        ) : full === 'loading' || full === undefined ? (
                          <p style={{ fontSize: 13, color: colors.text.tertiary, fontFamily: font, margin: '4px 0 12px' }} aria-busy="true">Kategori verisi yükleniyor…</p>
                        ) : full === null ? (
                          <p style={{ fontSize: 13, color: colors.text.tertiary, fontFamily: font, margin: '4px 0 12px' }}>Kategori verisi yüklenemedi.</p>
                        ) : (() => {
                          const cats = CATEGORIES
                            .map((cat) => ({ cat, m: full.profile?.categoryMetrics?.[cat] }))
                            .filter((x) => x.m && x.m.n > 0);
                          const rk = full.risk;
                          const riskColor = rk?.overallRisk == null ? colors.text.tertiary : rk.overallRisk <= 2 ? colors.feedback.success : rk.overallRisk <= 4 ? colors.accent.gold : colors.feedback.error;
                          const highFactors = [...new Set((rk?.riskFactors || []).filter((f) => f.severity === 'high').map((f) => f.label))].slice(0, 2);
                          const strong = [...new Set((rk?.protectiveFactors || []).map((f) => f.label))].slice(0, 2);
                          return (
                            <div style={{ margin: '4px 0 12px' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: 12, fontFamily: font, color: colors.text.secondary, marginBottom: 10 }}>
                                <span>{r.n} soru</span>
                                <span>Risk: <strong style={{ color: riskColor }}>{rk?.riskLabel || '—'}{rk?.overallRisk != null ? ` (${rk.overallRisk}/6)` : ''}</strong></span>
                                {strong.length > 0 && <span>Güçlü: <strong style={{ color: colors.feedback.success }}>{strong.join(', ')}</strong></span>}
                                {highFactors.length > 0 && <span>Öncelik: <strong style={{ color: colors.feedback.error }}>{highFactors.join(', ')}</strong></span>}
                              </div>
                              {cats.length === 0 ? (
                                <p style={{ fontSize: 13, color: colors.text.tertiary, fontFamily: font, margin: '4px 0 12px' }}>
                                  Kategori bazlı detay henüz oluşmadı (oyunlar sürdükçe dolacak).
                                </p>
                              ) : (
                                <div style={{ display: 'grid', gap: 8 }}>
                                  {cats.map(({ cat, m }) => {
                                    const cp = Math.round((m.accuracyOrNull ?? 0) * 100);
                                    const col = m.sufficient ? bandColor(m.accuracyOrNull) : colors.text.tertiary;
                                    return (
                                      <div key={cat}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: colors.text.secondary, fontFamily: font, marginBottom: 3 }}>
                                          <span>{CATEGORY_LABELS[cat] || cat} <span style={{ fontWeight: 500, color: colors.text.tertiary }}>· {m.n} soru</span></span>
                                          <span style={{ color: col }}>%{cp}{m.sufficient ? '' : '*'}</span>
                                        </div>
                                        <ProgressBar value={cp} max={100} height={7} gradient={col} shimmer={false} />
                                      </div>
                                    );
                                  })}
                                  {cats.some((x) => !x.m.sufficient) && (
                                    <div style={{ fontSize: 10, color: colors.text.tertiary, fontFamily: font }}>* {MIN_ITEMS_CATEGORY} sorudan az — yorumlanmamalı</div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                        <Button variant="primary" size="sm" onClick={() => onSelectChild?.(r.child)}>
                          ▶ {r.name} ile oyna
                        </Button>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Başarı dağılımı */}
            {playedCount > 0 && (
              <div
                style={{
                  background: 'rgba(30,27,75,.5)',
                  border: `1px solid ${colors.surface.divider}`,
                  borderRadius: layout.borderRadius.lg,
                  padding: 16,
                }}
              >
                <h2 style={{ fontSize: 15, fontWeight: 800, color: colors.text.primary, fontFamily: font, margin: '0 0 12px' }}>
                  Sınıf başarı dağılımı
                </h2>
                <div style={{ display: 'grid', gap: 9 }}>
                  {BAND_ORDER.map((key) => {
                    const n = dist[key];
                    const pctOfClass = rows.length ? Math.round((n / rows.length) * 100) : 0;
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ flex: '0 0 140px', fontSize: 12, fontWeight: 700, color: colors.text.secondary, fontFamily: font }}>
                          {BANDS[key].label}
                        </span>
                        <div style={{ flex: 1 }}>
                          <ProgressBar value={pctOfClass} max={100} height={9} gradient={BANDS[key].color} shimmer={false} />
                        </div>
                        <span style={{ flex: '0 0 28px', textAlign: 'right', fontSize: 13, fontWeight: 800, color: colors.text.primary, fontFamily: font }}>
                          {n}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
