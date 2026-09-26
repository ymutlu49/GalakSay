// GalakSay — Çocuk seçim ekranı (auth gate'in ikinci adımı).
//
// Giriş yapan öğretmenin Numap'te değerlendirdiği çocukları listeler
// (GET /api/sessions → distinct studentKey). Öğretmen süzgeçlerle (ad arama,
// sınıf, okul, şehir, cinsiyet, tarih, sıralama) listeyi daraltıp bir çocuk seçer
// → oturum numapProfile'a çevrilip (numapAdapter) onSelect ile oyuna geçer.
// Çevrimdışı: son başarılı liste localStorage cache'inden gösterilir.

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SpaceBackground } from '../design-system/components/SpaceBackground.jsx';
import { Button } from '../design-system/components/Button.jsx';
import { Card } from '../design-system/components/Card.jsx';
import { EmptyState } from '../design-system/components/EmptyState.jsx';
import { colors } from '../design-system/colors.js';
import { typography } from '../design-system/typography.js';
import { layout } from '../design-system/spacing.js';
import { getSessions } from '../services/numapApi.js';
import { summarizeSession, sessionToNumapProfile, sessionToChildMeta, makeNamespace } from '../systems/numapAdapter.js';
import {
  listChildren, AGE_GROUPS, upsertNumapChildren, listNumapChildren,
  linkNumapToChild, unlinkNumapFromChild, refreshNumapLinks, readNumapSessionPayload,
} from '../services/localProfiles.js';
import { loadDemoClass, removeDemoClass, isDemoLoaded } from '../services/demoData.js';
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

// FAZ A (2026-08-05): Numap çocukları artık roster'da yaşar (localProfiles
// upsertNumapChildren/listNumapChildren) — ayrı numap_children_cache_* önbelleği
// ÖLDÜ. Aşağıdaki iki yardımcı yalnız ESKİ cache'i bir defalık roster'a taşımak
// için kaldı (okunur → upsert → anahtar silinir); birkaç sürüm sonra kaldırılabilir.
function readLegacyCache(userId) {
  if (!userId) return null;
  try {
    const raw = localStorage.getItem(`numap_children_cache_${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function clearLegacyCache(userId) {
  if (!userId) return;
  try {
    localStorage.removeItem(`numap_children_cache_${userId}`);
  } catch {
    /* depolama engelli */
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
  // FAZ B: Numap öğretmeni de yerel profil ekleyebilir — sahiplik "numap:<id>" ile
  // etiketlenir (yerel kullanıcı id'leriyle çakışmaz; RBAC: yalnız kendi eklediklerini görür).
  const ownerId = isLocal ? (user?.id || null) : user?.id ? `numap:${user.id}` : null;
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [numapDown, setNumapDown] = useState(false); // Numap listesi alınamadı, yalnız yerel gösteriliyor
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showMore, setShowMore] = useState(false);
  const [view, setView] = useState('home'); // 'home' (hub) | 'list' | 'classPanel' | 'settings' | 'childForm' | 'linkPicker'
  const [formChild, setFormChild] = useState(null); // childForm: düzenlenen yerel çocuk (null=yeni)
  // FAZ C: eşleme görünümü — numapPool tüm Numap öğeleri (mükerrer-gizleme ÖNCESİ),
  // linkChild eşlenecek/bağı yönetilecek yerel çocuk, linkError son bağlama hatası.
  const [numapPool, setNumapPool] = useState([]);
  const [linkChild, setLinkChild] = useState(null);
  const [linkError, setLinkError] = useState('');
  // Örtüşen load çağrılarında (🔄 + form-kaydet + Tekrar dene) SON istek kazanır —
  // closure-bazlı iptal yalnız useEffect cleanup'ında çalışıyordu; geç dönen bayat
  // istek listeyi/rozeti ezebiliyordu (Faz B doğrulama bulgusu).
  const reqSeq = useRef(0);
  // Demo sınıfı (yalnız yerel yönetici): sunum için örnek öğrenciler; demo:true bayrağıyla ayrışır.
  const [demoLoaded, setDemoLoaded] = useState(() => (isAdmin ? isDemoLoaded() : false));
  const [demoBusy, setDemoBusy] = useState(false);

  const load = useCallback(() => {
    // Yerel mod: localProfiles roster'ından oku (ağ yok, senkron). Sahibe göre süz
    // (admin → sahipsiz/kendi; yerel kullanıcı → yalnız user.id'li öğrenciler).
    if (source === 'local') {
      const list = listChildren(user?.id || null).map((c) => ({ ...c, source: 'local', savedAt: c.lastSeenAt || c.createdAt }));
      setChildren(list);
      setLoading(false);
      setOffline(false);
      setError('');
      return () => {};
    }
    // FAZ B (tek liste): Numap öğretmeninin listesi = Numap tarama çocukları
    // (kaynak rozeti 🛰️) + kendi eklediği yerel profiller (rozet 🏠, çevrimdışı
    // ekleme/oynatma her zaman mümkün — "Numap zorunlu değildir" vaadi tek listede).
    const myLocal = () =>
      user?.id
        ? listChildren(`numap:${user.id}`).map((c) => ({
            ...c,
            source: 'local',
            savedAt: c.lastSeenAt || c.createdAt,
            // FAZ C: bağlı çocuğun oturum payload'ı seçimde profil/baseline üretir.
            linkedSession: c.numapStudentKey ? readNumapSessionPayload(c.ns) : null,
          }))
        : [];
    // FAZ C mükerrer-gizleme: bir tarama yerel çocuğa BAĞLIYSA listede yalnız
    // yerel kart görünür (aynı çocuk iki kez listelenmez); tam havuz eşleme
    // görünümü için numapPool'da tutulur. Gizlenen kartın SÜZGEÇ alanları
    // (okul/şehir/cinsiyet/tarih — AD DEĞİL, rumuz korunur) yerel karta bellek-içi
    // kopyalanır: okul süzgeci bağlı çocuğu "kaybettirmez"; roster'a YAZILMAZ.
    const dedup = (numapItems, locals) => {
      const byKey = new Map(numapItems.filter((x) => x.studentKey).map((x) => [x.studentKey, x]));
      for (let i = 0; i < locals.length; i++) {
        const hit = locals[i].numapStudentKey ? byKey.get(locals[i].numapStudentKey) : null;
        if (hit) {
          locals[i] = {
            ...locals[i],
            school: hit.school || '',
            city: hit.city || '',
            district: hit.district || '',
            gender: hit.gender || '',
            assessmentDate: hit.assessmentDate || '',
          };
        }
      }
      const linkedKeys = new Set(locals.map((c) => c.numapStudentKey).filter(Boolean));
      return numapItems.filter((x) => !linkedKeys.has(x.studentKey));
    };
    // Payload'sız link onarımı: bağlı çocuğun müdahale planı eksikse (çevrimdışı/
    // kota-düşmüş bağlama) taze oturumdan yaz — çocuk self-login'de de kalibrasyon alır.
    const repairPlans = (numapItems, locals) => {
      for (const c of locals) {
        if (!c.numapStudentKey) continue;
        try {
          if (localStorage.getItem(`numap_intervention_${c.ns}`)) continue;
          const it = numapItems.find((x) => x.studentKey === c.numapStudentKey);
          // Kaynak sırası: taze havuz oturumu → çocuğun kendi payload'ı (linkedSession)
          const sess = it?.session || c.linkedSession || null;
          if (sess) {
            const prof = sessionToNumapProfile(sess, c.ns);
            prof.child.name = c.name; // gerçek ad değil, yerel rumuz
            localStorage.setItem(`numap_intervention_${c.ns}`, JSON.stringify(prof));
          }
        } catch { /* plan yazılamadıysa seçim yolu payload'dan üretir */ }
      }
    };
    const my = ++reqSeq.current; // son çağrı kazanır
    setLoading(true);
    setError('');
    getSessions()
      .then((sessions) => {
        if (reqSeq.current !== my) return;
        const d = distinctChildren(sessions).map((c) => ({ ...c, source: 'numap' }));
        refreshNumapLinks(d); // bağlı payload'ları tazele/onar (çıkış süpürmesi sonrası)
        const locals = myLocal();
        repairPlans(d, locals); // eksik müdahale planlarını tamamla (payload'sız link)
        setNumapPool(d);
        setChildren([...dedup(d, locals), ...locals]);
        setOffline(false);
        setNumapDown(false);
        // FAZ A: liste roster'a upsert edilir (ns korunur); eski cache YALNIZ
        // roster kalıcı yazılmışsa silinir (kota düşmesinde çevrimdışı yedek yanmasın).
        if (user?.id && upsertNumapChildren(user.id, d)) {
          clearLegacyCache(user.id);
        }
      })
      .catch(() => {
        if (reqSeq.current !== my) return;
        // Çevrimdışı/sunucu hatası → roster'dan oku; roster boşsa ESKİ cache'i
        // bir defalık taşı (kırılmasız geçiş: ilk Faz-A açılışı çevrimdışıysa bile
        // önceki oturumun listesi kaybolmaz).
        let list = user?.id ? listNumapChildren(user.id) : [];
        if (!list.length && user?.id) {
          const legacy = readLegacyCache(user.id);
          if (Array.isArray(legacy) && legacy.length) {
            list = distinctChildren(legacy);
            // Tek seferlik yedek ancak roster'a KALICI taşındıysa yakılır.
            if (upsertNumapChildren(user.id, list)) clearLegacyCache(user.id);
          }
        }
        const pool = list.map((c) => ({ ...c, source: 'numap' }));
        const locals = myLocal();
        repairPlans(pool, locals); // payload varsa eksik planı çevrimdışı da tamamla
        const merged = [...dedup(pool, locals), ...locals];
        setNumapPool(pool);
        if (merged.length) {
          setChildren(merged);
          // Bayat-liste rozeti yalnız Numap listesi varken; Numap listesi HİÇ yoksa
          // (yalnız yerel profiller) sessiz düşme yerine bilgi şeridi göster.
          setOffline(list.length > 0);
          setNumapDown(list.length === 0);
        } else {
          setError('Öğrenci listesi alınamadı. İnternet olmadan da sağ üstteki "➕ Yeni Öğrenci" ile profil ekleyip oynatabilirsiniz.');
        }
      })
      .finally(() => {
        if (reqSeq.current === my) setLoading(false);
      });
  }, [user, source]);

  useEffect(() => {
    load();
    return () => { reqSeq.current++; }; // unmount → uçuştaki istekler bayatlar
  }, [load]);

  // Yerel çocuk ekle/düzenle sonrası roster'ı tazele + listeye dön.
  const onFormSave = useCallback(() => { load(); setView('list'); }, [load]);
  // Korkuluk: numap modunda user.id yoksa (bozuk önbellek ucu) ekleme açılmaz —
  // ownerId null'a düşüp çocuğun yönetici havuzuna yazılması/kaybolması önlenir.
  const openAddChild = useCallback(() => {
    if (!isLocal && !user?.id) return;
    setFormChild(null);
    setView('childForm');
  }, [isLocal, user]);
  const openEditChild = useCallback((rec) => { setFormChild(rec); setView('childForm'); }, []);

  // Demo sınıfını yükle/kaldır → roster tazelenir. Yükleme IndexedDB yazımı içerir (async).
  const toggleDemo = useCallback(async () => {
    if (demoBusy) return;
    setDemoBusy(true);
    try {
      if (isDemoLoaded()) await removeDemoClass();
      else await loadDemoClass({ ownerId: ownerId || null });
    } catch (e) {
      console.error('[ChildSelect] demo sınıfı hatası:', e);
    } finally {
      setDemoLoaded(isDemoLoaded());
      setDemoBusy(false);
      load();
    }
  }, [demoBusy, ownerId, load]);

  // ── FAZ C: eşleme eylemleri ──
  const openLinkPicker = useCallback((rec) => { setLinkChild(rec); setLinkError(''); setView('linkPicker'); }, []);
  const handleLink = useCallback((numapItem) => {
    if (!linkChild) return;
    const r = linkNumapToChild(linkChild.ns, {
      studentKey: numapItem.studentKey,
      sessionId: numapItem.sessionId,
      savedAt: numapItem.savedAt,
      session: numapItem.session || null,
    });
    if (!r.ok) { setLinkError(r.error); return; }
    // Türetilmiş müdahale planı link ANINDA ns-anahtarına yazılır → CaptainPicker
    // self-login yolunda da (numapPlan prop'suz) oyun mount'u planı bulur.
    // Ad HEP yerel rumuz — gerçek ad cihazda plan içinde tutulmaz.
    if (numapItem.session) {
      try {
        const prof = sessionToNumapProfile(numapItem.session, linkChild.ns);
        prof.child.name = linkChild.name;
        localStorage.setItem(`numap_intervention_${linkChild.ns}`, JSON.stringify(prof));
      } catch { /* plan yazılamadıysa seçim anında payload'dan üretilir */ }
    }
    setLinkChild(null);
    setView('list');
    load();
  }, [linkChild, load]);
  const handleUnlink = useCallback(() => {
    if (!linkChild) return;
    unlinkNumapFromChild(linkChild.ns);
    // IndexedDB'deki baseline + gerçek demografi de gitmeli — merge deseni boş
    // geleni eskiyle doldurduğundan kendiliğinden silinmez; raporlar aksi hâlde
    // bayat Numap baseline'ıyla üretilmeye devam ederdi (ateş-unut, oyunu bloklamaz).
    import('../analytics/AnalyticsBridge.js')
      .then((m) => m.clearNuMapBaseline(linkChild.ns))
      .catch(() => {});
    setLinkChild(null);
    setView('list');
    load();
  }, [linkChild, load]);

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

  // opts.screen: oyunun açılacağı ilk ekran (ör. Sınıf Paneli → 'dashboard'); yoksa çocuk merkezi.
  const handleSelect = useCallback(
    (item, opts = null) => {
      const initialScreen = opts?.screen || null;
      // Yerel mod: item zaten localProfiles kaydı — main.jsx oyun prop'una çevirir.
      if (source === 'local') {
        onSelect?.(item, opts);
        return;
      }
      // FAZ B: Numap modundaki YEREL kayıt (öğretmenin eklediği profil) — main.jsx
      // handleSelectLocalChild ile birebir aynı oyun-prop şekline çevrilir.
      // FAZ C: kayda tarama BAĞLIYSA profil + baseline meta bağlı oturumdan üretilir
      // (ns local_N KALIR → ilerleme aynı; ad HEP yerel rumuz — veri minimizasyonu).
      if (item.source === 'local') {
        let numapProfile = null;
        let childMeta = { name: item.name, gradeLevel: item.grade || '' };
        if (item.numapStudentKey) {
          const session = item.linkedSession || null;
          if (session) {
            numapProfile = sessionToNumapProfile(session, item.ns);
            numapProfile.child.name = item.name; // gerçek ad yerine yerel rumuz
            childMeta = { ...sessionToChildMeta(session), name: item.name };
          } else {
            // Payload çıkış süpürmesinde gitmiş olabilir → link anında yazılan
            // müdahale planına düş (kalibrasyon korunur; baseline meta ilk
            // çevrimiçi yenilemede refreshNumapLinks ile geri gelir).
            try {
              const raw = localStorage.getItem(`numap_intervention_${item.ns}`);
              if (raw) numapProfile = JSON.parse(raw);
            } catch { /* plansız devam */ }
          }
        }
        onSelect?.({
          ns: item.ns,
          name: item.name,
          avatar: item.avatar,
          grade: item.grade || '',
          ageMonths: 0,
          ageGroup: item.ageGroup || null,
          numapProfile,
          childMeta,
          local: true,
          directPlay: false,
          initialScreen,
        });
        return;
      }
      const session = item.session || null;
      // ns kaynağı ÖNCE roster kaydı (FAZ A: kayıt zaten ns taşır) — session
      // payload'ı depolamadan düşmüş olsa bile çocuğun kimliği/ilerlemesi korunur.
      const ns = item.ns || makeNamespace(session);
      onSelect?.({
        ns,
        name: item.name,
        grade: item.grade,
        ageMonths: item.ageMonths,
        // session yoksa profil nötr varsayılanlarla kurulur (degraded ama güvenli);
        // çevrimiçi ilk yenilemede payload roster'a geri yazılır.
        numapProfile: session ? sessionToNumapProfile(session, ns) : null,
        childMeta: session ? sessionToChildMeta(session) : { name: item.name || null, gradeLevel: item.grade || null },
        initialScreen,
      });
    },
    [onSelect, source],
  );

  // Yenilemede (children doluyken) panel/liste yerinde kalır — yalnız İLK yüklemede gizli.
  const showFilters = !error && children.length > 1 && !isLocal;

  // Yerel çocuk ekle/düzenle formu — yeni çocuk geçerli kullanıcının sahipliğiyle etiketlenir.
  if (view === 'childForm') {
    return <ChildForm child={formChild} ownerId={ownerId || null} onSave={onFormSave} onCancel={() => setView('list')} />;
  }

  // ── FAZ C: eşleme görünümü — yerel çocuğa Numap taraması bağla/kaldır ──
  if (view === 'linkPicker' && linkChild) {
    const q = fold(linkChild.name);
    // Başka yerel çocuğa bağlı taramalar aday DEĞİL (bir tarama ↔ bir profil).
    const takenKeys = new Set(
      children
        .filter((c) => c.source === 'local' && c.numapStudentKey && c.ns !== linkChild.ns)
        .map((c) => c.numapStudentKey),
    );
    // Ad benzerliği önce (rumuz ↔ gerçek ad yakınlığı ipucu), sonra en yeni tarama.
    const rank = (x) => {
      const n = fold(x.name);
      if (!q || !n) return 3;
      if (n === q) return 0;
      if (n.startsWith(q) || q.startsWith(n)) return 1;
      if (n.includes(q) || q.includes(n)) return 2;
      return 3;
    };
    const candidates = numapPool
      .filter((x) => x.studentKey && !takenKeys.has(x.studentKey))
      .sort((a, b) => rank(a) - rank(b) || (b.savedAt || '').localeCompare(a.savedAt || ''));
    const F = typography.fontFamily.display;
    return (
      <div style={{ position: 'relative', minHeight: '100vh', background: colors.gradient.background, padding: '24px 16px', boxSizing: 'border-box', overflowY: 'auto' }}>
        <SpaceBackground starCount={40} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
          <Button variant="ghost" size="sm" onClick={() => { setLinkChild(null); setView('list'); }}>← Listeye dön</Button>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.text.primary, fontFamily: F, margin: '12px 0 4px' }}>
            🔗 Numap taramasıyla eşle
          </h1>
          <p style={{ fontSize: 14, color: colors.text.secondary, fontFamily: F, margin: '0 0 16px' }}>
            <b>{linkChild.name}</b> profiline bir tarama bağlayın — oyun taramaya göre kalibre edilir,
            ön-son karşılaştırma raporları açılır. İlerleme verisine dokunulmaz; adı yerel kalır.
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.5, color: colors.text.tertiary, fontFamily: F, margin: '-8px 0 16px' }}>
            ℹ️ Tarama verisi (gerçek ad dahil) bu cihazda saklanır ve Numap çıkışınızda otomatik
            silinir; çocuğun profil adı rumuz olarak kalır. Bağı kaldırırsanız tarama verisi ve
            raporlardaki taban çizgisi de bu cihazdan temizlenir.
          </p>

          {linkChild.numapStudentKey && (
            <div style={{ background: 'rgba(124,58,237,.12)', border: '1px solid rgba(124,58,237,.4)', borderRadius: layout.borderRadius.md, padding: '10px 14px', marginBottom: 14, fontFamily: F }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: colors.text.primary }}>
                🔗 Şu an bağlı: {dateLabel(linkChild.numapSavedAt) || 'tarama'}
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <Button variant="ghost" size="sm" onClick={handleUnlink}>Bağlantıyı kaldır</Button>
              </div>
              <p style={{ fontSize: 12, color: colors.text.tertiary, margin: '6px 0 0' }}>
                Aşağıdan başka bir tarama seçerseniz bağlantı onunla değiştirilir.
              </p>
            </div>
          )}

          {linkError && (
            <div role="alert" style={{ background: colors.feedback.errorGlow, border: `1px solid ${colors.feedback.error}`, color: colors.text.primary, borderRadius: layout.borderRadius.md, padding: '10px 14px', fontSize: 13.5, fontWeight: 600, fontFamily: F, marginBottom: 14 }}>
              {linkError}
            </div>
          )}

          {candidates.length === 0 ? (
            <EmptyState
              icon="🛰️"
              title="Eşlenecek tarama yok"
              description="Tamamlanmış Numap taramalarınız burada listelenir. Numap'te bir tarama tamamlayın, sonra '🔄 Numap'ten güncelle' ile listeyi tazeleyin."
              actionLabel="Numap'i aç ↗"
              onAction={() => window.open('https://getnumap.com', '_blank', 'noopener')}
            />
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {candidates.map((x) => {
                const isCurrent = linkChild.numapStudentKey === x.studentKey;
                return (
                  <div key={x.ns} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(30,27,75,.55)', border: `1px solid ${isCurrent ? 'rgba(124,58,237,.5)' : colors.surface.divider}`, borderRadius: layout.borderRadius.lg, padding: '12px 14px', fontFamily: F }}>
                    <span style={{ fontSize: 26, flexShrink: 0 }}>🛰️</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15.5, fontWeight: 800, color: colors.text.primary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.name}</div>
                      <div style={{ fontSize: 12.5, color: colors.text.tertiary, marginTop: 1 }}>
                        {[ageLabel(x.ageMonths), gradeLabel(x.grade), dateLabel(x.savedAt)].filter(Boolean).join(' • ')}
                      </div>
                    </div>
                    {isCurrent ? (
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#c4b5fd', flexShrink: 0 }}>Bağlı ✓</span>
                    ) : (
                      <Button variant="primary" size="sm" onClick={() => handleLink(x)}>Bağla</Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
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
                  ['3', 'Çocuk, açılış ekranındaki "Kaptanlar" listesinden kendi resmine dokunarak oynar'],
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
                  title="İlk Öğrencinizi Ekleyin"
                  desc="1 dakika sürer — ad ve avatar yeterli"
                  onClick={openAddChild}
                />
              ) : (
              <HubCard
                icon="👧" primary
                title={isLocal ? 'Öğrenci Seçin ve Oynatın' : 'Öğrenci Seçin ve Başlayın'}
                desc={`Bir çocuk seçin, oyunu başlatın${!loading && children.length > 0 ? ` · ${children.length} çocuk` : ''}`}
                onClick={() => setView('list')}
              />
              )}
              {/* FAZ B: "Yeni Öğrenci" artık Numap modunda da var — taramasız çocuk
                  eklemek için yerel hesaba geçmek gerekmiyor (tek liste). */}
              <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12 }}>
                <HubCard vertical icon="➕" title="Yeni Öğrenci" desc="Profil ekle" onClick={openAddChild} />
                <HubCard vertical icon="📊" title="Sınıf İlerlemesi" desc="Gelişimi izle" onClick={() => setView('classPanel')} />
                {isAdmin && <HubCard vertical icon="👥" title="Kullanıcılar" desc="Öğretmen/uzman ekle" onClick={() => setView('users')} />}
                <HubCard vertical icon="⚙️" title="Ayarlar" desc="Erişim · veri · dil" onClick={() => setView('settings')} />
              </div>
              {/* Demo sınıfı — sunum/tanıtım için örnek öğrenciler (yalnız yerel yönetici, sade kart) */}
              {isAdmin && (
                <div
                  style={{
                    marginTop: 4,
                    background: 'rgba(255,217,61,.06)',
                    border: '1px dashed rgba(255,217,61,.35)',
                    borderRadius: layout.borderRadius.lg,
                    padding: '12px 14px',
                    fontFamily: typography.fontFamily.display,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: colors.text.primary }}>🎓 Demo sınıfı</div>
                    <div style={{ fontSize: 12, lineHeight: 1.4, color: colors.text.tertiary, marginTop: 2 }}>
                      Sunum ve tanıtım için örnek öğrenciler; gerçek verilerle karışmaz.
                    </div>
                  </div>
                  <Button
                    variant={demoLoaded ? 'ghost' : 'secondary'}
                    size="sm"
                    disabled={demoBusy || loading}
                    onClick={toggleDemo}
                    aria-label={demoLoaded ? 'Demo sınıfını kaldır' : 'Demo sınıfını yükle'}
                  >
                    {demoBusy ? 'Hazırlanıyor…' : demoLoaded ? 'Demo sınıfını kaldır' : 'Demo sınıfını yükle'}
                  </Button>
                </div>
              )}
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
            <div style={{ display: 'flex', gap: 8 }}>
              {!isLocal && (
                <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
                  🔄 Numap'ten güncelle
                </Button>
              )}
              <Button variant="primary" size="sm" onClick={openAddChild}>➕ Yeni Öğrenci</Button>
            </div>
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
            {isLocal ? 'Bir öğrenciye dokunun, oyunu başlatın • ✏️ ile düzenleyin' : `${user?.name ? `${user.name} • ` : ''}🛰️ Numap taramalarınız + 🏠 eklediğiniz profiller tek listede`}
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

        {/* Numap listesi hiç alınamadıysa (yalnız yerel profiller görünüyorken) sessiz düşme yerine bilgi ver */}
        {numapDown && !offline && (
          <div
            role="status"
            style={{
              background: 'rgba(124,58,237,.12)',
              border: '1px solid rgba(124,58,237,.4)',
              color: colors.text.secondary,
              borderRadius: layout.borderRadius.md,
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: typography.fontFamily.display,
              marginBottom: 16,
            }}
          >
            🛰️ Numap listesi alınamadı — şimdilik yalnız cihazdaki profiller gösteriliyor. Bağlantı gelince "🔄 Numap'ten güncelle"ye dokunun.
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
        {loading && children.length === 0 ? (
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
              description="Yeni bir öğrenci profili ekleyerek başlayın — çocuk sonra kendi profiliyle girip oyununa devam eder."
              actionLabel="➕ Yeni Öğrenci"
              onAction={openAddChild}
            />
          ) : (
            // FAZ B: iki eşit yol — taramasız da başlanabilir (yerel profil bu
            // listede yaşar), tarama sonrası çocuk otomatik eklenir. Çıkmaz yok.
            <div>
              <EmptyState
                icon="🧒"
                title="Henüz öğrenci yok"
                description="Hemen bir profil ekleyip oynamaya başlayabilirsiniz. Numap'te tarama tamamlarsanız çocuk bu listeye otomatik gelir ve oyun ona göre kalibre edilir."
                actionLabel="➕ İlk Öğrencinizi Ekleyin"
                onAction={openAddChild}
              />
              <div style={{ textAlign: 'center', marginTop: -20 }}>
                <Button variant="ghost" size="sm" onClick={() => window.open('https://getnumap.com', '_blank', 'noopener')}>
                  🛰️ Numap'te tarama başlat ↗
                </Button>
              </div>
            </div>
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
              // Öğe-bazlı kaynak: Numap modundaki tek liste karışıktır (FAZ B) —
              // meta/rozet/düzenleme kartın kendi kaynağına göre belirlenir.
              const isLocalItem = c.source === 'local';
              // Yerel çocukta düzey ve sınıf aynı bilgiyi taşıyorsa ("1. Sınıf • 1. sınıf") tek kez göster
              const _ag = ageGroupLabel(c.ageGroup), _gr = gradeLabel(c.grade);
              const metaLine = isLocalItem
                ? [_ag, _gr].filter(Boolean).filter((x, i, a) => a.findIndex((y) => y.toLocaleLowerCase('tr') === x.toLocaleLowerCase('tr')) === i).join(' • ')
                : [ageLabel(c.ageMonths), gradeLabel(c.grade), dateLabel(c.savedAt)].filter(Boolean).join(' • ');
              const sub2 = isLocalItem ? '' : [c.school, c.city, genderLabel(c.gender)].filter(Boolean).join(' · ');
              return (
                <Card key={c.ns} padding={18}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                   {/* Ana seçim alanı gerçek <button>: kart role=button + iç düğmeler
                       (WCAG 4.1.2 nested-interactive) yerine tek bir erişilebilir isim */}
                   <button
                     type="button"
                     onClick={() => handleSelect(c)}
                     aria-label={`${c.name} ile çalış`}
                     style={{
                       flex: 1, minWidth: 0, minHeight: 52, display: 'flex', alignItems: 'center', gap: 16,
                       background: 'transparent', border: 'none', padding: 0, margin: 0,
                       textAlign: 'left', cursor: 'pointer', color: 'inherit', font: 'inherit', borderRadius: 12,
                     }}
                   >
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <span
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
                        </span>
                        {c.demo && (
                          <span
                            aria-label="Demo öğrenci"
                            title="Demo sınıfı — sunum için örnek öğrenci"
                            style={{
                              flexShrink: 0,
                              fontSize: 10,
                              fontWeight: 800,
                              letterSpacing: 0.6,
                              fontFamily: typography.fontFamily.display,
                              padding: '2px 7px',
                              borderRadius: layout.borderRadius.full,
                              background: 'rgba(255,217,61,.14)',
                              border: '1px solid rgba(255,217,61,.45)',
                              color: colors.accent.gold,
                            }}
                          >
                            DEMO
                          </span>
                        )}
                        {/* Kaynak rozeti — yalnız karışık listede (Numap modu) anlamlı.
                            FAZ C: bağlı yerel çocuk '🔗 Numap bağlı' rozetini taşır. */}
                        {!isLocal && (
                          <span
                            style={{
                              flexShrink: 0,
                              fontSize: 10.5,
                              fontWeight: 800,
                              fontFamily: typography.fontFamily.display,
                              padding: '2px 8px',
                              borderRadius: layout.borderRadius.full,
                              background: !isLocalItem ? 'rgba(124,58,237,.22)' : c.numapStudentKey ? 'rgba(124,58,237,.14)' : 'rgba(148,163,184,.16)',
                              border: `1px solid ${!isLocalItem ? 'rgba(124,58,237,.45)' : c.numapStudentKey ? 'rgba(124,58,237,.4)' : 'rgba(148,163,184,.35)'}`,
                              color: !isLocalItem ? '#c4b5fd' : c.numapStudentKey ? '#c4b5fd' : colors.text.secondary,
                            }}
                          >
                            {!isLocalItem ? '🛰️ Numap' : c.numapStudentKey ? '🔗 Numap bağlı' : '🏠 Yerel'}
                          </span>
                        )}
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
                   </button>
                    {/* FAZ C: eşleme yalnız Numap modunda (taramalar orada) — yerel modda 🔗 yok */}
                    {isLocalItem && !isLocal && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openLinkPicker(c); }}
                        aria-label={`${c.name} — Numap taramasıyla eşle`}
                        title={c.numapStudentKey ? 'Numap bağlantısını yönet' : 'Numap taramasıyla eşle'}
                        style={{
                          flexShrink: 0,
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          border: `1px solid ${c.numapStudentKey ? 'rgba(124,58,237,.5)' : colors.surface.divider}`,
                          background: c.numapStudentKey ? 'rgba(124,58,237,.15)' : 'rgba(255,255,255,.05)',
                          color: colors.text.secondary,
                          fontSize: 16,
                          cursor: 'pointer',
                        }}
                      >
                        🔗
                      </button>
                    )}
                    {isLocalItem && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openEditChild(c); }}
                        aria-label={`${c.name} düzenle`}
                        style={{
                          flexShrink: 0,
                          width: 44,
                          height: 44,
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
