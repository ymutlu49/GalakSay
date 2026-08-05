// GalakSay — Sınıf Paneli (öğretmenin Numap çocuklarının oyun ilerleme özeti).
//
// ChildSelect'in alt-görünümü (view==='classPanel'). Öğretmenin Numap'te
// tanıladığı çocukların (children prop) Galaksay'da OYNADIĞI oyunların
// ilerlemesini IndexedDB'den (child_profiles + game_sessions + question_answered
// olayları) toplar — Dashboard.jsx'in tek-çocuk desenini N çocuğa uygular.
// Tanılama Numap'te kalır; bu panel onu TAMAMLAYAN müdahale-takibidir (oyun
// ilerlemesi, Numap'te olmayan veri). Yalnız bu öğretmenin çocukları okunur
// (children pivotu) → RBAC-temiz; kullanıcı yönetimi Numap'te olduğu için burada
// "Yönetim Paneli" KASTEN yoktur.

import React, { useState, useEffect, useCallback } from 'react';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import { Button } from '../design-system/components/Button.jsx';
import { Card } from '../design-system/components/Card.jsx';
import { EmptyState } from '../design-system/components/EmptyState.jsx';
import { ProgressBar } from '../design-system/components/ProgressBar.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { layout } from '../design-system/spacing.js';
import { getChildProfile, getSessionsByChild } from '../analytics/database.js';
import { getOverallAccuracy, getFullPerformanceProfile, CATEGORIES } from '../analytics/PerformanceAnalyzer.js';
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
  const [detail, setDetail] = useState({}); // ns -> fullProfile | undefined(yükleniyor) | null(yok)
  const [exporting, setExporting] = useState(null); // null | 'csv' | 'csv-anon' | 'pdf'

  // Her çocuğun IndexedDB özetini paralel topla (Dashboard.jsx deseni × N).
  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all(
      (roster || []).map(async (c) => {
        try {
          const [profile, sessions, accuracy] = await Promise.all([
            getChildProfile(c.ns),
            getSessionsByChild(c.ns),
            getOverallAccuracy(c.ns),
          ]);
          const sessionCount = sessions?.length || 0;
          const lastPlayed = sessionCount
            ? sessions.reduce((m, s) => Math.max(m, new Date(s.startTime).getTime() || 0), 0)
            : 0;
          return {
            child: c, ns: c.ns, name: c.name, grade: c.grade,
            played: sessionCount > 0,
            sessionCount,
            accuracy: sessionCount > 0 ? accuracy : null,
            lastPlayed,
            riskLevel: profile?.nuMapRiskLevel ?? null,
          };
        } catch {
          return {
            child: c, ns: c.ns, name: c.name, grade: c.grade,
            played: false, sessionCount: 0, accuracy: null, lastPlayed: 0, riskLevel: null,
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

  // Açılan kartın kategori detayını (ağır) tembel yükle — yalnız bir kez.
  useEffect(() => {
    if (!expanded || expanded in detail) return;
    let active = true;
    setDetail((d) => ({ ...d, [expanded]: undefined })); // yükleniyor işareti
    getFullPerformanceProfile(expanded)
      .then((full) => active && setDetail((d) => ({ ...d, [expanded]: full })))
      .catch(() => active && setDetail((d) => ({ ...d, [expanded]: null })));
    return () => {
      active = false;
    };
  }, [expanded, detail]);

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
  const avgAcc = playedCount
    ? Math.round((playedRows.reduce((s, r) => s + (r.accuracy || 0), 0) / playedCount) * 100)
    : 0;

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
              {teacher?.name ? `${teacher.name} • ` : ''}Galaksay oyun ilerlemesi
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
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              marginBottom: 16,
            }}
          >
            {[
              { v: rows.length, l: 'Çocuk' },
              { v: playedCount, l: 'Oynamış' },
              { v: `%${avgAcc}`, l: 'Ort. başarı' },
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
                        {avatarFor(r.name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: colors.text.primary, fontFamily: font, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {r.name}
                        </div>
                        <div style={{ fontSize: 12, color: colors.text.tertiary, fontFamily: font, marginTop: 2 }}>
                          {r.played
                            ? [gradeLabel(r.grade), `${r.sessionCount} oturum`, r.lastPlayed ? `son: ${dateLabel(r.lastPlayed)}` : ''].filter(Boolean).join(' • ')
                            : [gradeLabel(r.grade), 'henüz oynamadı'].filter(Boolean).join(' • ')}
                        </div>
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
                            Bu çocuk henüz Galaksay'da oyun oynamadı. "Oyna" ile değerlendirme sonucuna göre kişiselleştirilmiş oyuna başlayabilirsiniz.
                          </p>
                        ) : full === undefined ? (
                          <p style={{ fontSize: 13, color: colors.text.tertiary, fontFamily: font, margin: '4px 0 12px' }}>Kategori verisi yükleniyor…</p>
                        ) : (() => {
                          const cats = CATEGORIES
                            .map((cat) => ({ cat, m: full?.categoryMetrics?.[cat] }))
                            .filter((x) => x.m && x.m.accuracy > 0);
                          if (cats.length === 0) {
                            return (
                              <p style={{ fontSize: 13, color: colors.text.tertiary, fontFamily: font, margin: '4px 0 12px' }}>
                                Kategori bazlı detay henüz oluşmadı (oyunlar sürdükçe dolacak).
                              </p>
                            );
                          }
                          return (
                            <div style={{ margin: '4px 0 12px', display: 'grid', gap: 8 }}>
                              {cats.map(({ cat, m }) => {
                                const cp = Math.round(m.accuracy * 100);
                                return (
                                  <div key={cat}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: colors.text.secondary, fontFamily: font, marginBottom: 3 }}>
                                      <span>{CATEGORY_LABELS[cat] || cat}</span>
                                      <span style={{ color: bandColor(m.accuracy) }}>%{cp}</span>
                                    </div>
                                    <ProgressBar value={cp} max={100} height={7} gradient={bandColor(m.accuracy)} shimmer={false} />
                                  </div>
                                );
                              })}
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
