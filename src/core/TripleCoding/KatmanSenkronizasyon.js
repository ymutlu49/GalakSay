import { useState, useCallback, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// KATMAN SENKRONİZASYON — Üçlü Kodlama Katmanları Arası Senkron Güncelleme
// Somut (Enaktif) ↔ Görsel (İkonik) ↔ Sembolik (Soyut)
// Bir katmandaki değişiklik diğer ikisini anlık günceller
// ═══════════════════════════════════════════════════════════════════════════════

// ── Faz Tanımları ───────────────────────────────────────────────────────────
export const FAZLAR = {
  KESFET: 0,    // Sadece somut materyaller
  GOR: 1,       // Somut + görsel model (dönüşüm animasyonu)
  ADLANDIR: 2,  // + sembolik (YıldızTaşı sürükle)
  BAGLA: 3,     // Üçü birlikte, çapraz etkileşim aktif
};

export const FAZ_ETIKETLERI = ['Keşfet', 'Gör', 'Adlandır', 'Bağla'];
export const FAZ_IKONLARI = ['🔍', '👁️', '✏️', '🔗'];

// ── LT Düzeyine Göre Varsayılan Katman Ayarları ────────────────────────────
export const LT_KATMAN_AYARLARI = {
  // L2-5: Somut ağırlıklı
  low: {
    ltRange: [2, 5],
    defaults: { somut: true, gorsel: false, sembolik: false },
    startPhase: FAZLAR.KESFET,
    somutDestek: 'tam',         // Tüm materyaller büyük
    ipucuBaslangic: 1,          // Kademe 1 otomatik
  },
  // L6-8: Geçiş
  mid: {
    ltRange: [6, 8],
    defaults: { somut: true, gorsel: true, sembolik: false },
    startPhase: FAZLAR.GOR,
    somutDestek: 'gecis',       // Somut→görsel animasyonlar aktif
    ipucuBaslangic: 1,          // İkon 2 yanlışta belirir
  },
  // L9-12: Görsel-sembolik
  high: {
    ltRange: [9, 12],
    defaults: { somut: false, gorsel: true, sembolik: true },
    startPhase: FAZLAR.ADLANDIR,
    somutDestek: 'istege_bagli', // Butonla açılabilir
    ipucuBaslangic: 2,          // Görsel ipucu öncelikli
  },
  // L13-18: Sembolik ağırlıklı
  expert: {
    ltRange: [13, 18],
    defaults: { somut: false, gorsel: false, sembolik: true },
    startPhase: FAZLAR.ADLANDIR,
    somutDestek: 'istege_bagli',
    ipucuBaslangic: 3,          // Kısmi animasyon
  },
};

// LT düzeyinden ayar bloğu seç
export const getLTAyar = (ltLevel) => {
  if (ltLevel <= 5) return LT_KATMAN_AYARLARI.low;
  if (ltLevel <= 8) return LT_KATMAN_AYARLARI.mid;
  if (ltLevel <= 12) return LT_KATMAN_AYARLARI.high;
  return LT_KATMAN_AYARLARI.expert;
};

// ── Geçiş Kriterleri ────────────────────────────────────────────────────────
export const GECIS_KRITERLERI = {
  ilerleme: {
    dogrulukEsik: 0.80,        // %80+ doğruluk
    maxIpucuKademe: 2,          // Ortalama ipucu kademe ≤ 2
    maxSomutKullanim: 0.20,     // Son 10 soruda somut desteğe başvurma ≤ %20
    pencereBoyutu: 10,          // Son N soru
  },
  geriDusme: {
    dogrulukEsik: 0.50,         // İlk 5 soruda %50 altı
    pencereBoyutu: 5,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK: useTripleCoding — Üçlü kodlama durum yönetimi
// ═══════════════════════════════════════════════════════════════════════════════
export function useTripleCoding({
  ltLevel = 5,
  initialValue = 0,
  mode = '',
  onValueChange,
  onPhaseChange,
  onLayerToggle,
} = {}) {
  const ltAyar = getLTAyar(ltLevel);

  // Mevcut değer (tüm katmanların paylaştığı)
  const [value, setValue] = useState(initialValue);

  // Aktif faz
  const [phase, setPhase] = useState(ltAyar.startPhase);

  // Katman görünürlüğü
  const [layers, setLayers] = useState({ ...ltAyar.defaults });

  // Vurgulanan katman (çapraz etkileşimde)
  const [highlightedLayer, setHighlightedLayer] = useState(null);
  const highlightTimer = useRef(null);

  // Ek durum (ifade, sonuç, görsel model)
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [visualModel, setVisualModel] = useState('tenFrame');

  // Geçiş animasyonu durumu
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState(null); // 'somut_to_gorsel' | 'gorsel_to_sembolik' etc.

  // LT değiştiğinde katman ayarlarını güncelle
  useEffect(() => {
    const ayar = getLTAyar(ltLevel);
    setLayers({ ...ayar.defaults });
    setPhase(ayar.startPhase);
  }, [ltLevel]);

  // ── Değer Güncelleme (Senkron) ──────────────────────────────────────────
  const updateValue = useCallback((newValue, source = 'somut') => {
    setValue(newValue);
    onValueChange?.(newValue, source);

    // Çapraz etkileşim vurgulaması
    // Değişiklik kaynağı dışındaki katmanları vurgula
    const otherLayers = ['somut', 'gorsel', 'sembolik'].filter(l => l !== source);
    setHighlightedLayer(otherLayers);
    clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightedLayer(null), 800);
  }, [onValueChange]);

  // ── Faz İlerleme ────────────────────────────────────────────────────────
  const advancePhase = useCallback(() => {
    if (phase >= FAZLAR.BAGLA) return;

    const nextPhase = phase + 1;
    setIsTransitioning(true);

    // Geçiş türünü belirle
    if (nextPhase === FAZLAR.GOR) {
      setTransitionType('somut_to_gorsel');
    } else if (nextPhase === FAZLAR.ADLANDIR) {
      setTransitionType('gorsel_to_sembolik');
    } else if (nextPhase === FAZLAR.BAGLA) {
      setTransitionType('connect_all');
    }

    // Yeni katmanları aç
    const newLayers = { ...layers };
    if (nextPhase >= FAZLAR.KESFET) newLayers.somut = true;
    if (nextPhase >= FAZLAR.GOR) newLayers.gorsel = true;
    if (nextPhase >= FAZLAR.ADLANDIR) newLayers.sembolik = true;
    setLayers(newLayers);

    // Geçiş animasyonu süresi sonunda tamamla
    setTimeout(() => {
      setPhase(nextPhase);
      setIsTransitioning(false);
      setTransitionType(null);
      onPhaseChange?.(nextPhase);
    }, 800); // Geçiş animasyonu süresi
  }, [phase, layers, onPhaseChange]);

  // ── Faz Geri Dönme ──────────────────────────────────────────────────────
  const regressPhase = useCallback((targetPhase) => {
    if (targetPhase < FAZLAR.KESFET) return;
    setPhase(targetPhase);
    onPhaseChange?.(targetPhase);
  }, [onPhaseChange]);

  // ── Katman Açma/Kapama ──────────────────────────────────────────────────
  const toggleLayer = useCallback((layerName) => {
    setLayers(prev => {
      const next = { ...prev, [layerName]: !prev[layerName] };
      onLayerToggle?.(layerName, next[layerName]);
      return next;
    });
  }, [onLayerToggle]);

  // ── Soru Değişiminde Sıfırlama ─────────────────────────────────────────
  const resetForNewQuestion = useCallback((newValue, newExpression, newResult, newVisualModel) => {
    const ayar = getLTAyar(ltLevel);
    setValue(newValue ?? 0);
    setExpression(newExpression ?? '');
    setResult(newResult ?? null);
    setVisualModel(newVisualModel ?? 'tenFrame');
    setPhase(ayar.startPhase);
    setLayers({ ...ayar.defaults });
    setHighlightedLayer(null);
    setIsTransitioning(false);
    setTransitionType(null);
  }, [ltLevel]);

  // ── Katman Görünürlük Durumu (faz bazlı) ───────────────────────────────
  const showSomut = layers.somut || phase >= FAZLAR.KESFET;
  const showGorsel = layers.gorsel || phase >= FAZLAR.GOR;
  const showSembolik = layers.sembolik || phase >= FAZLAR.ADLANDIR;
  const showConnections = phase >= FAZLAR.BAGLA;

  return {
    // Durum
    value,
    phase,
    layers,
    expression,
    result,
    visualModel,
    highlightedLayer,
    isTransitioning,
    transitionType,

    // Görünürlük
    showSomut,
    showGorsel,
    showSembolik,
    showConnections,

    // Aksiyonlar
    updateValue,
    advancePhase,
    regressPhase,
    toggleLayer,
    resetForNewQuestion,
    setExpression,
    setResult,
    setVisualModel,

    // LT ayarı
    ltAyar,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK: useGecisKriterleri — İlerleme/geri düşme kriter kontrolü
// ═══════════════════════════════════════════════════════════════════════════════
export function useGecisKriterleri() {
  const historyRef = useRef([]);

  const addResult = useCallback(({ correct, hintLevel, usedConcrete }) => {
    historyRef.current.push({ correct, hintLevel, usedConcrete, timestamp: Date.now() });
    // Son 20 soruyu tut
    if (historyRef.current.length > 20) historyRef.current = historyRef.current.slice(-20);
  }, []);

  const shouldAdvance = useCallback(() => {
    const k = GECIS_KRITERLERI.ilerleme;
    const recent = historyRef.current.slice(-k.pencereBoyutu);
    if (recent.length < k.pencereBoyutu) return false;

    const dogruluk = recent.filter(r => r.correct).length / recent.length;
    const ortIpucu = recent.reduce((s, r) => s + (r.hintLevel || 0), 0) / recent.length;
    const somutOran = recent.filter(r => r.usedConcrete).length / recent.length;

    return dogruluk >= k.dogrulukEsik
      && ortIpucu <= k.maxIpucuKademe
      && somutOran <= k.maxSomutKullanim;
  }, []);

  const shouldRegress = useCallback(() => {
    const k = GECIS_KRITERLERI.geriDusme;
    const recent = historyRef.current.slice(-k.pencereBoyutu);
    if (recent.length < k.pencereBoyutu) return false;

    const dogruluk = recent.filter(r => r.correct).length / recent.length;
    return dogruluk < k.dogrulukEsik;
  }, []);

  const reset = useCallback(() => {
    historyRef.current = [];
  }, []);

  return { addResult, shouldAdvance, shouldRegress, reset };
}
