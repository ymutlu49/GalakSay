// GalakSay Pro — 2026-03-19 — Uygulama giriş noktası + SplashScreen + ErrorBoundary + Onboarding + SessionResume + OfflineIndicator
// Lazy loading: Onboarding ve Game ayrı chunk'larda yüklenir
import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { SplashScreen } from './design-system/components/SplashScreen.jsx'
import { colors } from './design-system/colors.js'
import { typography } from './design-system/typography.js'
import { layout } from './design-system/spacing.js'
import { getResumeInfo } from './hooks/useAutoSave.js'

// Lazy loaded screens — code splitting
const GalaksayGame = lazy(() => import('../GalakSay.jsx'))
const Onboarding = lazy(() => import('./screens/Onboarding.jsx').then(m => ({ default: m.Onboarding })))

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
            color: '#6B7499',
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
    const resumeInfo = getResumeInfo()
    if (resumeInfo) {
      setInfo(resumeInfo)
      setTimeout(() => setEntered(true), 300)
    }
  }, [])

  if (!info) return null

  const categoryNames = {
    sayma: 'Sayma', subitizing: 'Subitizing', karsilastirma: 'Karşılaştırma',
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

// ═══ UYGULAMA WRAPPER — SplashScreen + Onboarding + Game + Resume + Offline ═
function App() {
  const [splashDone, setSplashDone] = useState(false)
  const [onboardingDone, setOnboardingDone] = useState(() => {
    try { return localStorage.getItem('galaksay_onboarding_done') === 'true' }
    catch { return false }
  })
  const [showResume, setShowResume] = useState(true)

  const handleOnboardingComplete = useCallback((profile) => {
    setOnboardingDone(true)
  }, [])

  // Eğer profil yoksa ve onboarding yapılmamışsa, onboarding göster
  const showOnboarding = splashDone && !onboardingDone
  const gameReady = splashDone && onboardingDone

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

  return (
    <>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} duration={2000} />}

      {showOnboarding && (
        <Suspense fallback={loadingFallback}>
          <Onboarding onComplete={handleOnboardingComplete} />
        </Suspense>
      )}

      <div style={{
        opacity: gameReady ? 1 : 0,
        transition: 'opacity 300ms ease',
        height: '100vh',
        pointerEvents: gameReady ? 'auto' : 'none',
      }}>
        <Suspense fallback={loadingFallback}>
          <GalaksayGame />
        </Suspense>
      </div>

      {/* Çevrimdışı göstergesi — her zaman render */}
      <OfflineIndicator />

      {/* Oturum devam bildirimi — oyun hazır olduğunda göster */}
      {gameReady && showResume && (
        <ResumePrompt onDismiss={() => setShowResume(false)} />
      )}
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
