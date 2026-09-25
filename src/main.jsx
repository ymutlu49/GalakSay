// GalakSay Pro — Uygulama giriş noktası + SplashScreen + ErrorBoundary + SessionResume + OfflineIndicator
// Lazy loading: ekranlar ve Game ayrı chunk'larda yüklenir
import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './assets/fonts/fonts.css' // Nunito + Atkinson Hyperlegible (kendi sunucumuzdan)
import { SplashScreen } from './design-system/components/SplashScreen.jsx'
import { colors } from './design-system/colors.js'
import { typography } from './design-system/typography.js'
import { layout } from './design-system/spacing.js'
import { getResumeInfo } from './hooks/useAutoSave.js'
import { useAccessibility } from './hooks/useAccessibility.js'

// Lazy loaded screens — code splitting
const GalaksayGame = lazy(() => import('../GalakSay.jsx'))
const TeacherLogin = lazy(() => import('./screens/TeacherLogin.jsx'))
const ChildSelect = lazy(() => import('./screens/ChildSelect.jsx'))
const WelcomeScreen = lazy(() => import('./screens/WelcomeScreen.jsx'))
const StudentPicker = lazy(() => import('./screens/StudentPicker.jsx'))

import { loadConsent, saveConsent } from './utils/consent.js'
import {
  getToken,
  clearToken,
  readCachedUser,
  clearCachedUser,
  me as numapMe,
  logout as numapLogout,
  ssoExchange as numapSsoExchange,
  ApiError,
} from './services/numapApi.js'

// ── NuMap SSO: ?sso=<bilet> ile gelen tek-oturum bileti ──
// NuMap (getnumap.com) geçiş menüsünden Galaksay'a kısa-ömürlü bir bilet ekler; burada
// okunur, doğrulanır ve URL'den temizlenir → öğretmen tekrar giriş yapmaz.
function readSsoTicketFromUrl() {
  try {
    return new URLSearchParams(window.location.search).get('sso') || null
  } catch {
    return null
  }
}
function stripSsoParam() {
  try {
    const url = new URL(window.location.href)
    url.searchParams.delete('sso')
    window.history.replaceState({}, document.title, url.pathname + url.search + url.hash)
  } catch {
    /* tarihçe yazılamadı — kritik değil */
  }
}

// ═══ PROFESYONEL HATA SINIRI ═══════════════════════════════════════════════
// Çocuk dostu hata mesajları + hata loglama + kurtarma seçenekleri
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorCount: 0 }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('[GalakSay] Hata:', error.message, error.stack)
    // Hata sayacı — sürekli çökme durumunda farklı mesaj göster
    this.setState(prev => ({ errorCount: prev.errorCount + 1 }))
  }
  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }
  handleReload = () => {
    window.location.reload()
  }
  render() {
    if (this.state.hasError) {
      const isCritical = this.state.errorCount > 2
      return (
        <div style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #0B0E2D, #141852)',
          fontFamily: typography.fontFamily.display,
          color: '#fff',
          padding: 32,
          textAlign: 'center',
        }}>
          {/* Uzay arka planı — basit yıldızlar */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${(i * 37 + 13) % 100}%`,
                top: `${(i * 61 + 7) % 100}%`,
                width: 2,
                height: 2,
                borderRadius: '50%',
                background: '#fff',
                opacity: 0.3,
              }} />
            ))}
          </div>

          <div style={{ fontSize: 64, marginBottom: 16, position: 'relative' }}>
            {isCritical ? '\uD83D\uDEE0\uFE0F' : '\uD83D\uDE80'}
          </div>
          <h1 style={{
            fontSize: 24,
            fontWeight: 800,
            marginBottom: 8,
            color: '#A8B2D1',
            position: 'relative',
          }}>
            {isCritical
              ? 'Uzay gemimiz bakıma ihtiyaç duyuyor!'
              : 'Oops! Uzay gemimiz küçük bir sorunla karşılaştı.'}
          </h1>
          <p style={{
            fontSize: 16,
            color: '#A8B2D1',
            marginBottom: 24,
            maxWidth: 400,
            position: 'relative',
          }}>
            {isCritical
              ? 'Sayfayı yeniden yükle, her şey düzelecek!'
              : 'Endişe etme, hemen düzeltiyoruz!'}
          </p>

          {!isCritical && (
            <button
              onClick={this.handleRetry}
              style={{
                padding: '14px 32px',
                borderRadius: 14,
                border: 'none',
                background: 'linear-gradient(135deg, #6C63FF, #A78BFA)',
                color: '#fff',
                fontSize: 18,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(108,99,255,0.35)',
                marginBottom: 12,
                position: 'relative',
                fontFamily: typography.fontFamily.display,
              }}
            >
              Tekrar Dene
            </button>
          )}

          <button
            onClick={this.handleReload}
            style={{
              padding: '10px 24px',
              borderRadius: 12,
              border: '1px solid rgba(108,99,255,0.3)',
              background: isCritical ? 'linear-gradient(135deg, #6C63FF, #A78BFA)' : 'transparent',
              color: isCritical ? '#fff' : '#A8B2D1',
              fontSize: isCritical ? 18 : 14,
              fontWeight: isCritical ? 800 : 600,
              cursor: 'pointer',
              position: 'relative',
              fontFamily: typography.fontFamily.display,
              boxShadow: isCritical ? '0 4px 16px rgba(108,99,255,0.35)' : 'none',
            }}
          >
            {isCritical ? 'Sayfayı Yenile' : 'Ana Menüye Dön'}
          </button>

          {/* Geliştirici modu hata detayları */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre style={{
              marginTop: 24,
              padding: 16,
              borderRadius: 12,
              background: 'rgba(255,255,255,.05)',
              color: '#FF6B6B',
              fontSize: 11,
              textAlign: 'left',
              maxWidth: '90vw',
              overflow: 'auto',
              maxHeight: 200,
              position: 'relative',
            }}>
              {this.state.error.message + '\n' + this.state.error.stack}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}

// ═══ ÇEVRİMDIŞI GÖSTERGESİ ═══════════════════════════════════════════════
// Bağlantı kesildiğinde üst barda küçük gösterge
function OfflineIndicator() {
  const [offline, setOffline] = useState(!navigator.onLine)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const goOffline = () => { setOffline(true); setVisible(true) }
    const goOnline = () => {
      setOffline(false)
      // Kısa süre "yeniden bağlandı" mesajı göster, sonra gizle
      setTimeout(() => setVisible(false), 2000)
    }
    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [])

  if (!visible && !offline) return null

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100000,
        padding: '6px 16px',
        borderRadius: layout.borderRadius.full,
        background: offline ? 'rgba(255,140,66,.9)' : 'rgba(0,212,170,.9)',
        color: '#fff',
        fontSize: 12,
        fontWeight: 700,
        fontFamily: typography.fontFamily.display,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        boxShadow: '0 2px 12px rgba(0,0,0,.3)',
        animation: 'fadeUp 300ms ease-out',
        pointerEvents: 'none',
      }}
    >
      <span style={{ fontSize: 14 }}>{offline ? '\u26A0\uFE0F' : '\u2705'}</span>
      {offline ? 'Çevrimdışı — oyun devam ediyor' : 'Bağlantı kuruldu'}
    </div>
  )
}

// ═══ OTURUM DEVAM BİLDİRİMİ ════════════════════════════════════════════════
// Son kaldığı yerden devam etme seçeneği sunar
function ResumePrompt({ onDismiss }) {
  const [info, setInfo] = useState(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.resolve(getResumeInfo()).then(resumeInfo => {
      if (cancelled) return
      if (resumeInfo) {
        setInfo(resumeInfo)
        setTimeout(() => setEntered(true), 300)
      }
    }).catch(() => {})
    return () => { cancelled = true }
  }, [])

  if (!info) return null

  const categoryNames = {
    sayma: 'Sayma', subitizing: 'Anlık Algılama', karsilastirma: 'Karşılaştırma',
    sayi_bilesimi: 'Sayı Bileşimi', basamak_degeri: 'Basamak Değeri',
    toplama_cikarma: 'Toplama/Çıkarma', carpma_bolme: 'Çarpma/Bölme',
    oruntu: 'Örüntü',
  }

  const timeAgo = () => {
    const diff = Date.now() - info.timestamp
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins} dk önce`
    const hrs = Math.floor(mins / 60)
    return `${hrs} saat önce`
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: `translateX(-50%) translateY(${entered ? 0 : 20}px)`,
      zIndex: 99997,
      padding: '14px 20px',
      borderRadius: layout.borderRadius.lg,
      background: 'rgba(30,27,75,.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(108,99,255,.25)',
      boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      maxWidth: '90vw',
      opacity: entered ? 1 : 0,
      transition: 'all 400ms ease-out',
      fontFamily: typography.fontFamily.display,
    }}>
      <div style={{ fontSize: 28 }}>{'\uD83D\uDE80'}</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: colors.text.secondary,
          marginBottom: 2,
        }}>
          Son kaldığın yer ({timeAgo()})
        </div>
        <div style={{
          fontSize: 15,
          fontWeight: 800,
          color: colors.text.primary,
        }}>
          {categoryNames[info.category] || info.category} {info.currentQuestion > 0 ? `\u2014 Soru ${info.currentQuestion}/${info.totalQuestions}` : ''}
        </div>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Kapat"
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(255,255,255,.08)',
          color: colors.text.tertiary,
          fontSize: 14,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {'\u2715'}
      </button>
    </div>
  )
}

// ═══ UYGULAMA WRAPPER — Splash → Numap auth gate → çocuk seçimi → GalakSay ═══
// Akış: splash → (token doğrulama) → TeacherLogin → ChildSelect → GalaksayGame.
// Zorunlu öğretmen girişi: yetişkin Numap hesabıyla girer, değerlendirdiği bir
// çocuğu seçer; oyun o çocuğun namespace'inde (key=ns) ve numapProfile'ıyla açılır.
// KVKK açık rızası ilk veri-işleyen aksiyona ertelenir (TeacherLogin submit'i
// `window.galaksayRequireConsent()` Promise'ını await eder).
function App() {
  // Erişilebilirlik ayarları — body class'larının her render'da senkron kalmasını garantiler
  useAccessibility()

  const [splashDone, setSplashDone] = useState(false)
  const [showResume, setShowResume] = useState(true)

  // ── NuMap SSO bileti (yalnız ilk render'da bir kez okunur) ──
  // URL'de ?sso=<bilet> varsa otomatik giriş denenecek; ekran 'loading'le başlar
  // (giriş ekranı bir an görünüp kaybolmasın diye).
  const [ssoTicket] = useState(() => readSsoTicketFromUrl())

  // ── Numap öğretmen oturumu ──
  // SSO bileti veya token varsa 'loading' (doğrulanır); yoksa doğrudan giriş ekranı.
  const [authStatus, setAuthStatus] = useState(() => (ssoTicket || getToken() ? 'loading' : 'unauthed'))
  const [teacher, setTeacher] = useState(null)
  // Seçili çocuk: { ns, name, grade, ageMonths, numapProfile, childMeta } | null
  const [selectedChild, setSelectedChild] = useState(null)

  // ── Giriş-yolu (Numap'siz front door) ──
  // Galaksay artık yalnız Numap'le sınırlı değil: çocuk self-login + yerel yönetim.
  const [entryView, setEntryView] = useState('welcome') // 'welcome' | 'adultLogin' | 'student'
  // Yerel (Numap'siz) oturum: null | { kind: 'admin' } | { kind: 'user', user }
  // admin = cihaz yöneticisi (PIN) — öğrenci + kullanıcı yönetir; user = tanımlı öğretmen/uzman.
  const [localSession, setLocalSession] = useState(null)

  // KVKK rıza EKRANI kaldırıldı (ürün kararı 2026-06-11: kimlik verisi toplanmıyor,
  // ad rumuz olabilir). Rıza kaydı otomatik verilir; gizlilik denetimi Ayarlar'daki
  // anahtarlarda kalır (dataSync oradan kapatılabilir — syncEngine yine ona bakar).
  useEffect(() => {
    const existing = loadConsent()
    // 2026-09-24 KVKK denetimi: kullanıcının Ayarlar'da verdiği 'kapalı' tercihi bir daha
    // otomatik açığa taşınmaz; yalnız hiç kayıt yoksa varsayılan yazılır (decision:'auto').
    if (existing === null) {
      saveConsent({ essential: true, analytics: true, dataSync: true, auto: true, autoMigrated: true, decision: 'auto' })
    }
    const w = /** @type {any} */ (window)
    w.galaksayRequireConsent = () => Promise.resolve(true) // eski çağıranlar için no-op köprü
    return () => { delete w.galaksayRequireConsent }
  }, [])

  // NuMap SSO: URL'de bilet varsa NuMap'a doğrulatıp otomatik giriş yap. Başarılı →
  // token + kullanıcı saklanır, oturum açılır. Başarısız (geçersiz/expired bilet) →
  // mevcut token BURADA doğrulanır (aşağıdaki me() efekti ssoTicket varken atlanır —
  // 2026-08-05 düzeltmesi: eski kod bu durumda authStatus'u 'loading'de bırakıyor,
  // süresi dolmuş biletle gelen öğretmen sonsuz "Yükleniyor" ekranında kalıyordu).
  // Her durumda bilet URL'den temizlenir (tarayıcı geçmişi/paylaşımla sızmasın).
  useEffect(() => {
    if (!ssoTicket) return
    let active = true
    stripSsoParam() // bilet state'te; URL'den HEMEN sil (geçmiş/paylaşım/Referer sızıntısı ağ dönüşünü beklemesin)
    numapSsoExchange(ssoTicket)
      .then(u => { if (active) { setTeacher(u); setAuthStatus('authed') } })
      .catch(() => {
        if (!active) return
        if (!getToken()) { setAuthStatus('unauthed'); return }
        // Bilet geçersiz ama eski token var → me() ile doğrula (me() efektiyle aynı mantık).
        numapMe()
          .then(u => { if (active) { setTeacher(u); setAuthStatus('authed') } })
          .catch(e => {
            if (!active) return
            const authFailed = e instanceof ApiError && (e.status === 401 || e.status === 403)
            const cached = readCachedUser()
            if (!authFailed && cached) { setTeacher(cached); setAuthStatus('authed') }
            else {
              if (authFailed) {
              clearToken(); clearCachedUser()
              // KVKK: token sunucuda ölmüş → kullanıcı bir daha "çıkış" tetikleyemez;
              // roster'daki numap PII'sini burada süpür (yeniden girişte geri gelir).
              import('./services/localProfiles.js').then(m => m.removeNumapChildren(null)).catch(() => {})
            }
              setAuthStatus('unauthed')
            }
          })
      })
      .finally(() => { stripSsoParam() })
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Numap soğuk-başlangıç: token varsa /auth/me ile doğrula. Çevrimdışı (ağ hatası +
  // önbellekli kullanıcı) → oturum korunur; 401/403 → token temizle + giriş ekranı.
  // NOT: SSO bileti varsa bunu ATLA — yukarıdaki SSO efekti oturumu kurar (yarış önlenir).
  useEffect(() => {
    if (ssoTicket) return
    if (!getToken()) return
    let active = true
    numapMe()
      .then(u => { if (active) { setTeacher(u); setAuthStatus('authed') } })
      .catch(e => {
        if (!active) return
        const authFailed = e instanceof ApiError && (e.status === 401 || e.status === 403)
        const cached = readCachedUser()
        if (!authFailed && cached) { setTeacher(cached); setAuthStatus('authed') }
        else {
          if (authFailed) { clearToken(); clearCachedUser() }
          setAuthStatus('unauthed')
        }
      })
    return () => { active = false }
  }, [])

  // Merkezi havuz: açılışta + ağ dönüşünde bekleyen senkron kuyruğunu boşalt
  // (syncEngine içinde dataSync rızası + token kontrol edilir; rıza yoksa no-op).
  useEffect(() => {
    const flush = () => { import('./services/syncEngine.js').then(m => m.flushQueue()).catch(() => {}) }
    flush()
    window.addEventListener('online', flush)
    return () => window.removeEventListener('online', flush)
  }, [])

  // HÇMÖ: portaldan çocuk-SSO ile (#hcmo_student=) gelinmişse push kimliğini yakala (bir kez).
  useEffect(() => { import('./services/portalBridge.js').then(m => m.capturePortalStudent()).catch(() => {}) }, [])

  const handleLoginSuccess = useCallback((u) => { setTeacher(u); setAuthStatus('authed') }, [])
  const handleSelectChild = useCallback((child) => { setSelectedChild(child); setShowResume(true) }, [])
  // Yerel (Numap'siz) çocuk → oyun child prop'una çevir. directPlay=true: çocuk
  // self-login (öğretmen panel araçları gizli); false: yerel hub'dan öğretmen başlattı.
  const handleSelectLocalChild = useCallback((rec, { directPlay = true } = {}) => {
    if (!rec) return
    setSelectedChild({
      ns: rec.ns,
      name: rec.name,
      avatar: rec.avatar,
      grade: rec.grade || '',
      ageMonths: 0,
      ageGroup: rec.ageGroup || null,
      numapProfile: null,
      childMeta: { name: rec.name, gradeLevel: rec.grade || '' },
      local: true,
      directPlay,
    })
    setShowResume(true)
  }, [])
  const handleSwitchChild = useCallback(() => {
    setSelectedChild(null)
    // Çocuk değişince portal çocuk-bağı düşer: kardeşin ilerlemesi öncekinin portal kaydına yazılmasın
    import('./services/portalBridge.js').then(pb => pb.clearPortalStudent()).catch(() => {})
  }, [])
  // Çıkış: Numap oturumu varsa sunucudan da çık; her durumda front door'a (Welcome) dön.
  const handleLogout = useCallback(async () => {
    if (authStatus === 'authed') {
      try { await numapLogout() } catch { /* yine de yerel oturumu temizle */ }
      // FAZ A + KVKK: numap-KAYNAKLI tüm roster kayıtları (ad/okul/şehir + oturum
      // payload'ları) cihazdan silinir — eski numap_children_cache_* süpürgesinin
      // wholesale semantiğiyle birebir: herhangi bir öğretmenin çıkışı, çıkışsız
      // ayrılmış önceki öğretmenin kalıntısını da temizler (veri yeniden çekilebilir).
      // KAPSAM DIŞI (bilinçli, Faz B): öğretmenin ELLE eklediği yerel profiller
      // (source:'local', ownerId 'numap:<id>') cihazda KALIR — çevrimdışı oynatma
      // vaadi bunu gerektirir; ChildForm bu kalıcılığı ekleme anında aydınlatır.
      // Oyun İLERLEMESİ ns-anahtarlıdır ve silinmez — sonraki girişte upsert aynı
      // ns'i kurunca kaldığı yerden devam eder.
      try {
        const m = await import('./services/localProfiles.js')
        m.removeNumapChildren(null)
      } catch { /* temizlik başarısızsa oturum kapatma yine tamamlanır */ }
      // KVKK (2026-09-24): IndexedDB child_profiles'taki NuMap-kaynaklı demografi de gitsin
      // (ad/doğum tarihi/okul/şehir/cinsiyet) — paylaşılan okul cihazında sonraki kullanıcıya kalmasın.
      try { const db = await import('./analytics/database.js'); await db.purgeChildDemographics('numap_') } catch { /* yok say */ }
    }
    // HÇMÖ çocuk jetonu/bağı her çıkışta temizlenir (12 saatlik jeton başka çocuğa yazmasın)
    try { const pb = await import('./services/portalBridge.js'); pb.clearPortalStudent() } catch { /* yok say */ }
    setSelectedChild(null); setTeacher(null); setAuthStatus('unauthed')
    setLocalSession(null); setEntryView('welcome')
  }, [authStatus])

  // Oyun-içi menüden çağrılacak köprüler (çıkış / çocuk değiştir).
  // NOT: `window`'u önce yerel `w`'ye al — aksi halde ardışık iki
  // `/** @type {any} */(window).x = fn` satırı arasında ASI noktalı virgül
  // EKLEMEZ ve `fn\n(window)` bir FONKSİYON ÇAĞRISI olarak ayrıştırılır
  // (handleLogout istemeden tetiklenir → girişten sonra Welcome'a sıçrama).
  useEffect(() => {
    const w = /** @type {any} */ (window)
    w.__galaksayLogout = handleLogout
    w.__galaksaySwitchChild = handleSwitchChild
    return () => {
      delete w.__galaksayLogout
      delete w.__galaksaySwitchChild
    }
  }, [handleLogout, handleSwitchChild])

  // Oyun gerçekten açık mı (resume bildirimi sadece o zaman) — Numap veya yerel çocuk.
  const inGame = splashDone && !!selectedChild

  // Suspense fallback — minimal loading indicator
  const loadingFallback = (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: colors.gradient.background,
      color: colors.text.secondary,
      fontFamily: typography.fontFamily.display,
      fontSize: 16,
    }}>
      Yükleniyor...
    </div>
  )

  // Splash sonrası gösterilecek ekran: loading → login → çocuk seçimi → oyun.
  const renderGate = () => {
    if (authStatus === 'loading') return loadingFallback

    // Oyun çalışıyor (Numap VEYA yerel çocuk) — her şeyin önünde.
    if (selectedChild) {
      return (
        <GalaksayGame
          key={selectedChild.ns}
          teacher={teacher}
          child={selectedChild}
          numapPlan={selectedChild.numapProfile}
          onExit={handleLogout}
          onSwitchChild={handleSwitchChild}
        />
      )
    }

    // Numap öğretmeni giriş yapmış → Numap hub'ı (tanıladığı çocuklar).
    if (authStatus === 'authed') {
      return <ChildSelect source="numap" user={teacher} onSelect={handleSelectChild} onLogout={handleLogout} />
    }

    // Yerel (Numap'siz) hub — yönetici TÜM profilleri + kullanıcıları yönetir;
    // yerel kullanıcı (öğretmen/uzman) YALNIZ kendi öğrencilerini yönetir + oynatır.
    if (localSession) {
      const isAdmin = localSession.kind === 'admin'
      const identity = isAdmin ? { name: 'Yönetici', isAdmin: true } : localSession.user
      return (
        <ChildSelect
          source="local"
          user={identity}
          onSelect={(rec) => handleSelectLocalChild(rec, { directPlay: false })}
          onLogout={() => { setLocalSession(null); setEntryView('welcome') }}
        />
      )
    }

    // Front door (oturum yok): iki yol — Öğrenci / Öğretmen-Uzman.
    if (entryView === 'adultLogin') {
      return (
        <TeacherLogin
          onSuccess={handleLoginSuccess}
          onLocalUser={(u) => setLocalSession({ kind: 'user', user: u })}
          onLocalAdmin={() => setLocalSession({ kind: 'admin' })}
          onBack={() => setEntryView('welcome')}
        />
      )
    }
    if (entryView === 'student') {
      return (
        <StudentPicker
          onPick={(rec) => handleSelectLocalChild(rec, { directPlay: true })}
          onBack={() => setEntryView('welcome')}
          onManage={() => setEntryView('adultLogin')}
        />
      )
    }
    return (
      <WelcomeScreen
        onStudent={() => setEntryView('student')}
        onAdult={() => setEntryView('adultLogin')}
      />
    )
  }

  return (
    <>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} duration={2000} />}

      <main style={{
        opacity: splashDone ? 1 : 0,
        transition: 'opacity 300ms ease',
        height: '100vh',
        pointerEvents: splashDone ? 'auto' : 'none',
      }}>
        <Suspense fallback={loadingFallback}>
          {splashDone && renderGate()}
        </Suspense>
      </main>

      {/* Çevrimdışı göstergesi — her zaman render */}
      <OfflineIndicator />

      {/* Oturum devam bildirimi — oyun açıkken göster */}
      {inGame && showResume && (
        <ResumePrompt onDismiss={() => setShowResume(false)} />
      )}
    </>
  )
}

// HMR-safe: aynı root'u tekrar tekrar yaratma — React 18 uyarısı engellenir.
const container = document.getElementById('root')
const w = /** @type {any} */ (window)
if (!w.__galaksayRoot) {
  w.__galaksayRoot = ReactDOM.createRoot(container)
}
w.__galaksayRoot.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
