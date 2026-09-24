// GalakSay Pro — Vite yapılandırması (code splitting + Vitest)
/// <reference types="vitest" />
import { defineConfig } from 'vite'
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
  build: {
    // Chunk boyutu uyarı limiti (GalakSay.jsx büyük — monolitik oyun motoru)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Üçüncü parti kütüphaneler ayrı chunk'larda
          // React shared — Vite otomatik ayırıyor, manuel belirtmeye gerek yok
          'vendor-motion': ['framer-motion'],
          'vendor-charts': ['recharts'],
          'vendor-pdf': ['jspdf'],
          // Analytics/dashboard ayrı chunk (lazy loaded)
          'analytics': [
            './src/analytics/PerformanceAnalyzer.js',
            './src/analytics/LTProgressEngine.js',
            './src/analytics/RiskClassifier.js',
            './src/analytics/StrengthWeaknessMapper.js',
            './src/analytics/RecommendationEngine.js',
            './src/analytics/PDFReportGenerator.js',
          ],
        },
      },
    },
  },
})
