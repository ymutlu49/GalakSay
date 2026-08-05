// GalakSay — Çocuk seçim ekranı (auth gate'in ikinci adımı).
//
// Giriş yapan öğretmenin Numap'te değerlendirdiği çocukları listeler
// (GET /api/sessions → distinct studentKey). Öğretmen süzgeçlerle (ad arama,
// sınıf, okul, şehir, cinsiyet, tarih, sıralama) listeyi daraltıp bir çocuk seçer
// → oturum numapProfile'a çevrilip (numapAdapter) onSelect ile oyuna geçer.
// Çevrimdışı: son başarılı liste localStorage cache'inden gösterilir.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import { Button } from '../design-system/components/Button.jsx';
import { Card } from '../design-system/components/Card.jsx';
import { EmptyState } from '../design-system/components/EmptyState.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { layout } from '../design-system/spacing.js';
import { getSessions } from '../services/numapApi.js';
import { summarizeSession, sessionToNumapProfile, sessionToChildMeta, makeNamespace } from '../systems/numapAdapter.js';
import { listChildren, AGE_GROUPS } from '../services/localProfiles.js';
import ClassPanel from './ClassPanel.jsx';
import ChildForm from './ChildForm.jsx';
import UserManager from './UserManager.jsx';
import { Settings } from './Settings.jsx';

function ageGroupLabel(key) {
  const g = AGE_GROUPS.find((x) => x.key === key);
  return g ? g.label : '';
}

const AVATARS = ['🚀', '🪐', '⭐', '🌟', '🛸', '☄️', '🌙', '🌍'];

// Hub eylem kartı — MODÜL kapsamında (bileşen İÇİNDE tanımlanmaz). Render içinde
// tanımlanırsa her re-render'da yeni bileşen tipi olur → React kartları unmount+remount
// eder; load() (getSessions) bittiğinde re-render olduğundan tıklama DOM değişiminde
// kaybolur ("tek tıklama yetmiyor" hatası). Modül kapsamı bunu önler.
function HubCard({ icon, title, desc, onClick, primary, vertical }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="space-btn-hover"
      style={{
        display: 'flex', flexDirection: vertical ? 'column' : 'row',
        alignItems: 'center', gap: vertical ? 7 : 16, width: '100%',
        textAlign: vertical ? 'center' : 'left',
        padding: vertical ? '20px 12px' : '22px 22px',
        borderRadius: layout.borderRadius.lg, cursor: 'pointer',
        fontFamily: typography.fontFamily.display, transition: 'transform .15s ease, box-shadow .15s ease',
        border: primary ? 'none' : `1px solid ${colors.surface.divider}`,
        background: primary ? 'linear-gradient(135deg,#6c63ff,#8b5cf6)' : 'rgba(30,27,75,.55)',
        boxShadow: primary ? '0 8px 26px rgba(108,99,255,.38)' : '0 2px 10px rgba(0,0,0,.22)',
      }}
    >
      <span style={{ fontSize: primary ? 42 : 30, flexShrink: 0, lineHeight: 1 }}>{icon}</span>
      <span style={{ flex: vertical ? 'none' : 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: primary ? 20 : 15.5, fontWeight: 800, color: primary ? '#fff' : colors.text.primary }}>{title}</span>
        <span style={{ display: 'block', fontSize: 12.5, color: primary ? 'rgba(255,255,255,.88)' : colors.text.tertiary, marginTop: 3, lineHeight: 1.3 }}>{desc}</span>
      </span>
      {!vertical && <span style={{ fontSize: 24, color: primary ? '#fff' : colors.accent.primaryLight, flexShrink: 0 }}>›</span>}
    </button>
  );
}
function avatarFor(name) {
  let h = 0;
  for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATARS[h % AVATARS.length];
}

function ageLabel(ageMonths) {
  if (!ageMonths) return '';
  return `${Math.floor(ageMonths / 12)} yaş`;
}

function gradeLabel(g) {
  if (!g) return '';
  return /^\d+$/.test(g) ? `${g}. sınıf` : g;
}

function genderLabel(g) {
  return g === 'female' ? 'Kız' : g === 'male' ? 'Erkek' : '';
}

function dateLabel(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}

// Türkçe-duyarlı arama anahtarı: küçük harf (tr) + diakritik sadeleştirme.
// "İsmail"→"ismail", "Şule"→"sule" → aksansız sorgu da eşleşir.
function fold(s) {
  return (s || '')
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ç/g, 'c').replace(/ö/g, 'o').replace(/ü/g, 'u')
    .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u');
}

// Yalnız tamamlanmış oturumlardan, studentKey bazlı tekilleştirme; her çocuk için
// en güncel (savedAt) oturum temsilci alınır.
function distinctChildren(sessions) {
  const byKey = new Map();
  for (const s of sessions || []) {
    if (s.status && s.status !== 'completed') continue;
    const sum = summarizeSession(s);
    const key = sum.studentKey || `${sum.name}|${sum.ageMonths}`;
    const existing = byKey.get(key);
    if (!existing || (sum.savedAt || '') > (existing.savedAt || '')) {
      byKey.set(key, { ...sum, session: s });
    }
  }
  return [...byKey.values()].sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
}

// Kimliksiz (user.id yok) önbellek YAZILMAZ/OKUNMAZ — eski 'unknown' ortak anahtarı
// iki öğretmenli cihazda çapraz liste sızdırıyordu (2026-08-05).
function cacheKey(userId) {
  return userId ? `numap_children_cache_${userId}` : null;
}
function writeCache(userId, distinct) {
  const key = cacheKey(userId);
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(distinct.map((d) => d.session)));
  } catch {
    /* depolama engelli */
  }
}
function readCache(userId) {
  const key = cacheKey(userId);
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const EMPTY_FILTERS = { q: '', grade: '', school: '', city: '', gender: '', dateFrom: '', dateTo: '', sort: 'recent' };

const inputStyle = {
  height: 40,
  padding: '0 12px',
  borderRadius: layout.borderRadius.md,
  border: `1px solid ${colors.surface.divider}`,
  background: colors.surface.input,
  color: colors.text.primary,
  fontSize: 14,
  fontWeight: 600,
  fontFamily: typography.fontFamily.display,
  outline: 'none',
  boxSizing: 'border-box',
};
const selectStyle = { ...inputStyle, cursor: 'pointer', flex: '1 1 130px', minWidth: 0 };

export default function ChildSelect({ user, onSelect, onLogout, source = 'numap' }) {
  const isLocal = source === 'local';
  // Yerel kimlik: admin (isAdmin) tüm sahipsiz öğrencilerini + kullanıcı yönetimini görür;
  // yerel kullanıcı (öğretmen) yalnız kendi öğrencilerini (ownerId === user.id) görür.
  const isAdmin = isLocal && !!user?.isAdmin;
  const ownerId = isLocal ? (user?.id || null) : undefined;
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showMore, setShowMore] = useState(false);
  const [view, setView] = useState('home'); // 'home' (hub) | 'list' | 'classPanel' | 'settings' | 'childForm'
  const [formChild, setFormChild] = useState(null); // childForm: düzenlenen yerel çocuk (null=yeni)

  const load = useCallback(() => {
    // Yerel mod: localProfiles roster'ından oku (ağ yok, senkron). Sahibe göre süz
    // (admin → sahipsiz/kendi; yerel kullanıcı → yalnız user.id'li öğrenciler).
    if (source === 'local') {
      const list = listChildren(user?.id || null).map((c) => ({ ...c, savedAt: c.lastSeenAt || c.createdAt }));
      setChildren(list);
      setLoading(false);
      setOffline(false);
      setError('');
      return () => {};
    }
    let active = true;
    setLoading(true);
    setError('');
    getSessions()
      .then((sessions) => {
        if (!active) return;
        const d = distinctChildren(sessions);
        setChildren(d);
        setOffline(false);
        writeCache(user?.id, d);
      })
      .catch(() => {
        if (!active) return;
        const cached = readCache(user?.id);
        if (cached) {
          setChildren(distinctChildren(cached));
          setOffline(true);
        } else {
          setError('Öğrenci listesi alınamadı — internet bağlantınızı kontrol edin.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, source]);

  useEffect(() => load(), [load]);

  // Yerel çocuk ekle/düzenle sonrası roster'ı tazele + listeye dön.
  const onFormSave = useCallback(() => { load(); setView('list'); }, [load]);
  const openAddChild = useCallback(() => { setFormChild(null); setView('childForm'); }, []);
  const openEditChild = useCallback((rec) => { setFormChild(rec); setView('childForm'); }, []);

  const setF = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  const clearFilters = () => setFilters(EMPTY_FILTERS);

  // Süzgeç açılır menüleri için tekilleştirilmiş değerler.
  const opts = useMemo(() => {
    const grades = new Set(), schools = new Set(), cities = new Set(), genders = new Set();
    for (const c of children) {
      if (c.grade) grades.add(c.grade);
      if (c.school) schools.add(c.school);
      if (c.city) cities.add(c.city);
      if (c.gender) genders.add(c.gender);
    }
    const tr = (a, b) => a.localeCompare(b, 'tr');
    return {
      grades: [...grades].sort(tr),
      schools: [...schools].sort(tr),
      cities: [...cities].sort(tr),
      genders: [...genders],
    };
  }, [children]);

  // Süzgeç + sıralama (risk yok → profil hesabı yok, hafif).
  const filtered = useMemo(() => {
    const q = fold(filters.q.trim());
    const out = children.filter((c) => {
      if (q && !(fold(c.name).includes(q) || fold(c.school).includes(q) || fold(c.city).includes(q))) return false;
      if (filters.grade && c.grade !== filters.grade) return false;
      if (filters.school && c.school !== filters.school) return false;
      if (filters.city && c.city !== filters.city) return false;
      if (filters.gender && c.gender !== filters.gender) return false;
      const d = (c.assessmentDate || c.savedAt || '').slice(0, 10);
      if (filters.dateFrom && d && d < filters.dateFrom) return false;
      if (filters.dateTo && d && d > filters.dateTo) return false;
      return true;
    });
    if (filters.sort === 'name') return [...out].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    return [...out].sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
  }, [children, filters]);

  const hasFilters =
    !!filters.q || !!filters.grade || !!filters.school || !!filters.city ||
    !!filters.gender || !!filters.dateFrom || !!filters.dateTo;

  const handleSelect = useCallback(
    (item) => {
      // Yerel mod: item zaten localProfiles kaydı — main.jsx oyun prop'una çevirir.
      if (source === 'local') {
        onSelect?.(item);
        return;
      }
      const session = item.session;
      const ns = makeNamespace(session);
      onSelect?.({
        ns,
        name: item.name,
        grade: item.grade,
        ageMonths: item.ageMonths,
        numapProfile: sessionToNumapProfile(session, ns),
        childMeta: sessionToChildMeta(session),
      });
    },
    [onSelect, source],
  );

  const showFilters = !loading && !error && children.length > 1 && !isLocal;

  // Yerel çocuk ekle/düzenle formu — yeni çocuk geçerli kullanıcının sahipliğiyle etiketlenir.
  if (view === 'childForm') {
    return <ChildForm child={formChild} ownerId={ownerId || null} onSave={onFormSave} onCancel={() => setView('list')} />;
  }

  // Kullanıcı yönetimi alt-görünümü (yalnız yönetici) — Numap'siz öğretmen/uzman hesapları.
  if (view === 'users') {
    return <UserManager onBack={() => setView('home')} />;
  }

  // Sınıf Paneli alt-görünümü — öğretmenin oynattığı çocukların oyun ilerlemesi.
  if (view === 'classPanel') {
    return (
      <ClassPanel
        roster={children}
        teacher={user}
        source={source}
        onBack={() => setView('home')}
        onSelectChild={handleSelect}
        onLogout={onLogout}
      />
    );
  }

  // Ayarlar alt-görünümü.
  if (view === 'settings') {
    return <Settings onClose={() => setView('home')} />;
  }

  // ═══ ANA EKRAN (HUB) — girişten sonraki sade, kullanıcı-dostu landing ═══
  // Araştırma (edu-dashboard UX): tek ekran, ≤5 kart, "less is more", net hiyerarşi
  // (1 birincil eylem öne çıkar, ikincil tuck). Öğrenci listesi artık ön kapı DEĞİL.
  if (view === 'home') {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', background: colors.gradient.background, padding: '20px 16px', boxSizing: 'border-box', overflowY: 'auto' }}>
        <SpaceBackground starCount={32} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 460, margin: '0 auto', minHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' }}>
          {/* Çıkış — köşe */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="ghost" size="sm" onClick={onLogout}>Çıkış</Button>
          </div>
          {/* Karşılama + eylemler — dikey ortalı */}
          <div style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 28 }}>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <div style={{ fontSize: 54, marginBottom: 10, lineHeight: 1 }}>🪐</div>
              <h1 style={{ fontSize: 27, fontWeight: 800, color: colors.text.primary, fontFamily: typography.fontFamily.display, margin: '0 0 6px' }}>
                {isAdmin ? '💻 Yerel Yönetim' : `Merhaba${user?.name ? `, ${user.name}` : ''}! 👋`}
              </h1>
              <p style={{ fontSize: 15, color: colors.text.secondary, fontFamily: typography.fontFamily.display, margin: 0 }}>
                {isAdmin ? 'Cihazdaki öğrenci profilleri (çevrimdışı)' : isLocal ? 'Öğrencilerin — çevrimdışı çalışır' : 'Bugün ne yapmak istersiniz?'}
              </p>
            </div>
            {/* İlk-kurulum sihirbazı (NN/g boş-durum + ClassDojo first-run deseni):
                hiç öğrenci yokken boş pano bırakma — 3 adımı göster, birincil eylemi değiştir */}
            {!loading && children.length === 0 && isLocal && (
              <div style={{
                background: 'rgba(108,99,255,.10)', border: '1px solid rgba(108,99,255,.35)',
                borderRadius: layout.borderRadius.lg, padding: '14px 16px', marginBottom: 14,
                fontFamily: typography.fontFamily.display,
              }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: colors.text.primary, marginBottom: 8 }}>
                  🚀 Hoş geldiniz! 3 adımda başlayın:
                </div>
                {[
                  ['1', 'İlk öğrencinizi ekleyin (ad/rumuz + avatar yeter)'],
                  ['2', 'İsterseniz 4 haneli giriş şifresi belirleyin'],
                  ['3', 'Çocuk, karşılama ekranındaki "Öğrenci Girişi"nden kendi resmine dokunarak oynar'],
                ].map(([n, t]) => (
                  <div key={n} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 5 }}>
                    <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: 'rgba(108,99,255,.35)', color: '#fff', fontSize: 11.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
                    <span style={{ fontSize: 12.5, lineHeight: 1.45, color: colors.text.secondary }}>{t}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {!loading && children.length === 0 && isLocal ? (
                <HubCard
                  icon="➕" primary
                  title="İlk Öğrencini Ekle"
                  desc="1 dakika sürer — ad ve avatar yeterli"
                  onClick={openAddChild}
                />
              ) : (
              <HubCard
                icon="👧" primary
                title={isLocal ? 'Öğrenci Seç & Oynat' : 'Öğrenci Seç & Başla'}
                desc={`Bir çocuk seç, oyuna başla${!loading && children.length > 0 ? ` · ${children.length} çocuk` : ''}`}
                onClick={() => setView('list')}
              />
              )}
              <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? 'repeat(2, 1fr)' : isLocal ? 'repeat(3, 1fr)' : '1fr 1fr', gap: 12 }}>
                {isLocal && <HubCard vertical icon="➕" title="Yeni Öğrenci" desc="Profil ekle" onClick={openAddChild} />}
                <HubCard vertical icon="📊" title="Sınıf İlerlemesi" desc="Gelişimi izle" onClick={() => setView('classPanel')} />
                {isAdmin && <HubCard vertical icon="👥" title="Kullanıcılar" desc="Öğretmen/uzman ekle" onClick={() => setView('users')} />}
                <HubCard vertical icon="⚙️" title="Ayarlar" desc="Erişim · veri · dil" onClick={() => setView('settings')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Geri (Ana Sayfa) + başlık — Sınıf İlerlemesi/Çıkış artık hub'da */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <Button variant="ghost" size="sm" onClick={() => setView('home')}>← Ana Sayfa</Button>
            {isLocal && <Button variant="primary" size="sm" onClick={openAddChild}>➕ Yeni Öğrenci</Button>}
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: colors.text.primary,
              fontFamily: typography.fontFamily.display,
              margin: '10px 0 4px',
            }}
          >
            {isLocal ? 'Öğrenciler' : 'Hangi çocukla çalışacaksınız?'}
          </h1>
          <p style={{ fontSize: 14, color: colors.text.secondary, fontFamily: typography.fontFamily.display, margin: 0 }}>
            {isLocal ? 'Bir öğrenciye dokun, oyunu başlat • ✏️ ile düzenle' : `${user?.name ? `${user.name} • ` : ''}Numap değerlendirmeleriniz`}
          </p>
        </div>

        {offline && (
          <div
            role="status"
            style={{
              background: 'rgba(255,140,66,.15)',
              border: '1px solid rgba(255,140,66,.5)',
              color: colors.text.secondary,
              borderRadius: layout.borderRadius.md,
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: typography.fontFamily.display,
              marginBottom: 16,
            }}
          >
            ⚠️ Çevrimdışısınız — en son alınan liste gösteriliyor.
          </div>
        )}

        {/* ── Süzgeç paneli ── */}
        {showFilters && (
          <div
            style={{
              background: 'rgba(30,27,75,.5)',
              border: `1px solid ${colors.surface.divider}`,
              borderRadius: layout.borderRadius.lg,
              padding: 14,
              marginBottom: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <input
              type="text"
              value={filters.q}
              onChange={(e) => setF('q', e.target.value)}
              placeholder="🔍 Ad, okul veya şehir ara…"
              autoCapitalize="none"
              spellCheck={false}
              style={{ ...inputStyle, width: '100%' }}
            />

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <select value={filters.grade} onChange={(e) => setF('grade', e.target.value)} style={selectStyle}>
                <option value="">Tüm sınıflar</option>
                {opts.grades.map((g) => (
                  <option key={g} value={g}>{gradeLabel(g)}</option>
                ))}
              </select>
              {opts.schools.length > 0 && (
                <select value={filters.school} onChange={(e) => setF('school', e.target.value)} style={selectStyle}>
                  <option value="">Tüm okullar</option>
                  {opts.schools.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              )}
              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                style={{
                  ...inputStyle,
                  flex: '0 0 auto',
                  cursor: 'pointer',
                  color: colors.accent.primaryLight,
                  background: 'transparent',
                  fontWeight: 700,
                }}
              >
                {showMore ? 'Daha az ▲' : 'Daha fazla ▼'}
              </button>
            </div>

            {showMore && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {opts.cities.length > 0 && (
                  <select value={filters.city} onChange={(e) => setF('city', e.target.value)} style={selectStyle}>
                    <option value="">Tüm şehirler</option>
                    {opts.cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                )}
                {opts.genders.length > 0 && (
                  <select value={filters.gender} onChange={(e) => setF('gender', e.target.value)} style={selectStyle}>
                    <option value="">Tüm cinsiyetler</option>
                    {opts.genders.map((g) => (
                      <option key={g} value={g}>{genderLabel(g) || g}</option>
                    ))}
                  </select>
                )}
                <select value={filters.sort} onChange={(e) => setF('sort', e.target.value)} style={selectStyle}>
                  <option value="recent">En yeni</option>
                  <option value="name">Ada göre (A-Z)</option>
                </select>
                <input type="date" value={filters.dateFrom} onChange={(e) => setF('dateFrom', e.target.value)} title="Başlangıç tarihi" style={{ ...inputStyle, flex: '1 1 130px', colorScheme: 'dark' }} />
                <input type="date" value={filters.dateTo} onChange={(e) => setF('dateTo', e.target.value)} title="Bitiş tarihi" style={{ ...inputStyle, flex: '1 1 130px', colorScheme: 'dark' }} />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: colors.text.tertiary, fontFamily: typography.fontFamily.display }}>
              <span>{filtered.length} çocuk{hasFilters ? ` (${children.length} içinden)` : ''}</span>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  style={{ border: 'none', background: 'transparent', color: colors.accent.primaryLight, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: typography.fontFamily.display }}
                >
                  Süzgeçleri temizle
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── İçerik ── */}
        {loading ? (
          <div style={{ textAlign: 'center', color: colors.text.secondary, fontFamily: typography.fontFamily.display, padding: 48 }}>
            Yükleniyor…
          </div>
        ) : error ? (
          <EmptyState icon="📡" title="Bağlantı sorunu" description={error} actionLabel="Tekrar dene" onAction={load} />
        ) : children.length === 0 ? (
          isLocal ? (
            <EmptyState
              icon="🧒"
              title="Henüz öğrenci yok"
              description="Yeni bir öğrenci profili ekleyerek başla — çocuk sonra kendi profiliyle girip oyununa devam eder."
              actionLabel="➕ Yeni Öğrenci"
              onAction={openAddChild}
            />
          ) : (
            <EmptyState
              icon="🧒"
              title="Henüz değerlendirilen çocuk yok"
              description="Numap'te bir tarama tamamlayın; çocuk burada otomatik görünecek. Taramasız oynatmak için çıkışta 'Yerel Hesap'la girip öğrenci ekleyebilirsiniz."
              actionLabel="Numap'te tarama başlat ↗"
              onAction={() => window.open('https://getnumap.com', '_blank', 'noopener')}
            />
          )
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="Süzgece uyan çocuk yok"
            description="Arama veya süzgeçleri gevşetmeyi deneyin."
            actionLabel="Süzgeçleri temizle"
            onAction={clearFilters}
          />
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {filtered.map((c) => {
              const avatarGlyph = c.avatar || avatarFor(c.name);
              const metaLine = isLocal
                ? [ageGroupLabel(c.ageGroup), gradeLabel(c.grade)].filter(Boolean).join(' • ')
                : [ageLabel(c.ageMonths), gradeLabel(c.grade), dateLabel(c.savedAt)].filter(Boolean).join(' • ');
              const sub2 = isLocal ? '' : [c.school, c.city, genderLabel(c.gender)].filter(Boolean).join(' · ');
              return (
                <Card key={c.ns} onClick={() => handleSelect(c)} padding={18}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                      style={{
                        fontSize: 32,
                        width: 52,
                        height: 52,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        background: 'rgba(108,99,255,.15)',
                      }}
                    >
                      {avatarGlyph}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: colors.text.primary,
                          fontFamily: typography.fontFamily.display,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {c.name}
                      </div>
                      {metaLine && (
                        <div style={{ fontSize: 13, color: colors.text.tertiary, fontFamily: typography.fontFamily.display, marginTop: 2 }}>
                          {metaLine}
                        </div>
                      )}
                      {sub2 && (
                        <div style={{ fontSize: 12, color: colors.text.tertiary, fontFamily: typography.fontFamily.display, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.8 }}>
                          {sub2}
                        </div>
                      )}
                    </div>
                    {isLocal && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openEditChild(c); }}
                        aria-label={`${c.name} düzenle`}
                        style={{
                          flexShrink: 0,
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          border: `1px solid ${colors.surface.divider}`,
                          background: 'rgba(255,255,255,.05)',
                          color: colors.text.secondary,
                          fontSize: 16,
                          cursor: 'pointer',
                        }}
                      >
                        ✏️
                      </button>
                    )}
                    <span style={{ fontSize: 22, color: colors.accent.primaryLight, flexShrink: 0 }}>›</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
