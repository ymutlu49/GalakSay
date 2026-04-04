// GalakSay Pro — 2026-03-19 — Vite yapılandırması (code splitting + optimizasyon)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/GalakSay/',
  server: {
    port: 5173,
    open: true
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
          'vendor-pdf': ['html2canvas', 'jspdf'],
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
