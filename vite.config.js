// GalakSay Pro — Vite yapılandırması (code splitting + Vitest)
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'

// galaksay.com (Cloudflare Pages) build'i için PWA <head> etiketleri + SW kaydı.
// Yalnızca VITE_PWA=1 ile aktif olur → Her Çocuk Matematik Öğrenebilir umbrella (/galaksay/ alt yolu) build'i etkilenmez.
// Umbrella alan adı: hercocukmatematikogrenebilir.com (ürün domaini galaksay.com korunur).
// manifest/sw/ikonlar site kökünde (/) servis edilir, app alt yolda (/oyna/) olsa bile.
function pwaTags() {
  if (process.env.VITE_PWA !== '1') return null
  return {
    name: 'galaksay-pwa-tags',
    transformIndexHtml() {
      return [
        { tag: 'link', attrs: { rel: 'manifest', href: '/manifest.webmanifest' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#0B0E2D' }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/icons/favicon-32.png' }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-capable', content: 'yes' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'mobile-web-app-capable', content: 'yes' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'apple-mobile-web-app-title', content: 'Galaksay' }, injectTo: 'head' },
        {
          tag: 'script',
          children:
            "if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(function(){})})}",
          injectTo: 'body',
        },
      ]
    },
  }
}

export default defineConfig({
  plugins: [react(), pwaTags()].filter(Boolean),
  // VITE_BASE ile override edilir. Varsayılan /galaksay/ (Her Çocuk Matematik Öğrenebilir umbrella deploy'u).
  // galaksay.com build'i VITE_BASE=/oyna/ kullanır.
  base: process.env.VITE_BASE || '/galaksay/',
  server: {
    // Port: PORT env (preview tool / CI) → otherwise default 5173
    port: Number(process.env.PORT) || 5173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
  resolve: {
    // jspdf'in opsiyonel html2canvas bağımlılığı (doc.html() hiç kullanılmıyor) 410 KB — boş modülle değiştir
    alias: { html2canvas: fileURLToPath(new URL('./src/utils/empty.js', import.meta.url)) },
  },
  build: {
    target: ['es2020', 'safari14'], // tablet hedefi; Vite varsayılanıyla aynı, açıkça yazıldı
    // Chunk boyutu uyarı limiti (GalakSay.jsx büyük — monolitik oyun motoru)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // FONKSİYON formu (2026-09-24 performans denetimi): nesne formunda Rollup, listelenen
        // paketin bağımlılıklarını (react, react-dom, scheduler) ilk eşleşen chunk'a taşıyordu;
        // giriş chunk'ı bu yüzden vendor-pdf + vendor-charts + vendor-motion'ı (≈350 KB brotli)
        // karşılama ekranı görünmeden indiriyordu. Şimdi: giriş = index + vendor-react (~50 KB br);
        // PDF/grafik/animasyon kütüphaneleri yalnız kullanıldıkları ekranda iner.
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id) || id.includes('vite/preload-helper') || id.includes('vite/modulepreload-polyfill')) return 'vendor-react'
          if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return 'vendor-motion'
          if (/node_modules\/(recharts|d3-[a-z]+|es-toolkit|@reduxjs|redux|react-redux|immer|reselect|decimal\.js-light|eventemitter3|use-sync-external-store|internmap|redux-thunk|clsx|react-is|victory-vendor)\//.test(id)) return 'vendor-charts'
          if (/node_modules\/(jspdf|html2canvas|pako|fflate|fast-png|iobuffer|@babel\/runtime|dompurify|canvg|core-js|raf|rgbcolor|stackblur-canvas|svg-pathdata|performance-now)\//.test(id)) return 'vendor-pdf'
          // PDFReportGenerator bilerek DIŞARIDA: Dashboard onu dinamik import eder; analytics
          // chunk'ına girince syncEngine→analytics zinciri jspdf'i ilk yüklemeye çekiyordu.
          if (/\/src\/analytics\/(PerformanceAnalyzer|LTProgressEngine|RiskClassifier|StrengthWeaknessMapper|RecommendationEngine)\.js$/.test(id)) return 'analytics'
        },
      },
    },
  },
})
