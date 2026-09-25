// GalakSay — Demo sınıfı (sunum/tanıtım için örnek öğrenciler).
//
// Yerel yönetim ekranından tek dokunuşla 4 örnek çocuk + son 24 günlük gerçekçi
// oyun geçmişi yüklenir; tek dokunuşla geri alınır. Çocuklar GERÇEK roster API'si
// (localProfiles.addChild) ile oluşturulur ve kayda `demo: true` bayrağı konur —
// kaldırma yalnız bu bayrağa bakar, gerçek çocuklara asla dokunmaz.
//
// Geçmiş, öğretmenin gördüğü HER yüzeyi besler:
//   • localStorage (oyun içi ekranlar: childHub/progress/devTrack/collection/rozetler/
//     yıldız parçası/seri) — GalakSay.jsx'in yazdığı biçimde:
//       dokunsay-user-<ns>   {stats:{totalGames,totalScore,totalCorrect,totalQ,modeStats,
//                             recent,starFragments,_maxStreak,_lastEarnedFrags},name,lastPlayed,roundsPerGame}
//       ds_ageGroup_<ns>, ds_streak_<ns>, ds_adaptive_<ns>, ds_cards_<ns>, ds_artifacts_<ns>,
//       ds_captainslog_<ns>, ds_onboarded_<ns>, dokunsay_story_v2_<ns>
//     (hepsi `_<ns>` / `-<ns>` sonekli → wipeChildData tek süpürmede temizler)
//   • IndexedDB (Sınıf Paneli, Gelişim Paneli, risk sınıflandırma, LT yörüngesi,
//     Numap karşılaştırma, PDF/CSV raporlar) — database.js şemasında:
//       game_sessions, game_events (EventCollector/AnalyticsBridge olay şekli),
//       lt_progress_history, daily_performance_summary, alerts, achievements, child_profiles
//
// Pedagojik hikâye (4 çocuk):
//   1) Elif  — 1. sınıf, sayma/karşılaştırmada güçlü ve hızla ilerliyor
//   2) Yusuf — 1. sınıf, diskalkuli risk profili: yavaş sayma, subitizing hataları,
//              sayı doğrusunda sapma, karşılaştırmada düşük doğruluk, çok ipucu; durağan
//   3) Zeynep — okul öncesi, yolun ortasında; düzenli gelişim
//   4) Mert  — 2. sınıf, sayı hissi iyi; toplama/çıkarmada akıcılık sorunu (yavaş, orta doğruluk)
//
// Üretim deterministiktir (tohumlu PRNG): aynı gün yüklendiğinde aynı veri çıkar.

import { addChild, updateChild, listChildren, removeChild } from './localProfiles.js';
import { STORES, putBatch, saveChildProfile, deleteChildRecords } from '../analytics/database.js';
import { MODE_TO_CATEGORY } from '../analytics/AnalyticsBridge.js';
import { AdaptiveEngine } from '../systems/adaptiveEngine.js';

export const DEMO_CHILD_NAMES = ['Elif', 'Yusuf', 'Zeynep', 'Mert'];

const DEMO_DAYS = 24;          // geçmiş penceresi (gün)
const ROUNDS = 10;             // oyun başına soru (roundsPerGame)
import { APP_VERSION } from '../version.js';
const DAY_MS = 86400000;

// GalakSay.jsx LEVELS.maxNum ile birebir (5 seviye)
const LEVEL_MAX = { 1: 5, 2: 10, 3: 15, 4: 20, 5: 20 };
// LTProgressEngine.LT_RANGES.min ile birebir
const LT_MIN = { sayma: 2, subitizing: 2, karsilastirma: 3, sayi_bilesimi: 4, basamak_degeri: 5, toplama_cikarma: 3, carpma_bolme: 3, oruntu: 2 };
const PLANET = { sayma: 'Sayalon', subitizing: 'Şimşeron', karsilastirma: 'Terazya', sayi_bilesimi: 'Bileşya', basamak_degeri: 'Basamara', toplama_cikarma: 'Toplarya', carpma_bolme: 'Çarpanya', oruntu: 'Örünya' };
// Kategori %80+ ise kazanılan eser (src/data/modeStories.js ALIEN_ARTIFACTS id'leri)
const PLANET_ARTIFACT = { sayma: 'sayalon_abacus', subitizing: 'simseron_lens', karsilastirma: 'terazya_scale' };
// Koleksiyon kartları — GalakSay.jsx MATH_CARDS ile aynı id/alanlar (koleksiyon ekranı bunları gösterir)
const DEMO_CARDS = [
  { id: 'zero', emoji: '0️⃣', name: 'Sıfırın Gücü', fact: 'Sıfır ne pozitif ne negatiftir. Özel bir sayı!', rarity: 'common', category: 'sayılar' },
  { id: 'triangle', emoji: '📐', name: 'Üçgen', fact: 'Bir üçgenin açılarının toplamı her zaman 180°', rarity: 'common', category: 'geometri' },
  { id: 'dozen', emoji: '📦', name: 'Düzine', fact: "12'li gruba düzine denir. 1 düzine yumurta = 12!", rarity: 'common', category: 'sayılar' },
  { id: 'percent', emoji: '💯', name: 'Yüzde', fact: "Yüzde demek 'yüzde bir' yani 100'de kaç demek!", rarity: 'common', category: 'kavramlar' },
  { id: 'clock', emoji: '🕐', name: 'Saat Matematiği', fact: 'Saat 12 tabanlı bir sayı sistemi kullanır', rarity: 'common', category: 'günlük' },
  { id: 'fraction', emoji: '🍕', name: 'Kesirler', fact: 'Pizzayı bölünce kesir yaparsın: 1/2, 1/4, 1/8...', rarity: 'common', category: 'kavramlar' },
  { id: 'pi', emoji: '🥧', name: 'Pi Sayısı', fact: 'π ≈ 3.14159... Hiçbir zaman bitmez!', rarity: 'rare', category: 'sayılar' },
  { id: 'abacus', emoji: '🧮', name: 'Abaküs', fact: 'İnsanlar 5000 yıldır abaküs ile hesap yapıyor!', rarity: 'rare', category: 'tarih' },
  { id: 'symmetry', emoji: '🦋', name: 'Simetri', fact: 'Kelebekler doğanın en güzel simetri örnekleri!', rarity: 'rare', category: 'geometri' },
  { id: 'cube', emoji: '🎲', name: 'Küp', fact: 'Zarın 6 yüzü var — karşılıklı yüzler hep 7 eder!', rarity: 'rare', category: 'geometri' },
  { id: 'prime', emoji: '⭐', name: 'Asal Sayı', fact: "Sadece 1'e ve kendisine bölünebilen sayılar: 2, 3, 5, 7...", rarity: 'epic', category: 'sayılar' },
  { id: 'fibonacci', emoji: '🌻', name: 'Fibonacci Dizisi', fact: '1, 1, 2, 3, 5, 8, 13... Doğada da var!', rarity: 'epic', category: 'diziler' },
];

// ── Çocuk profilleri (hikâye) ───────────────────────────────────────────────
// plan[kategori]: modes (AnalyticsBridge.MODE_TO_CATEGORY ile AYNI kategoriye düşen modlar),
// acc/rt/hint → [başlangıç, bitiş] (24 gün boyunca doğrusal + gürültü), weight → seçilme
// sıklığı, startDay → kaç gün önce başladı (opsiyonel), errors → yanlış cevap türü ağırlıkları.
const PROFILES = [
  {
    key: 'elif', name: 'Elif', avatar: '⭐', ageGroup: 'sinif1', grade: '1', ageMonths: 80, seed: 1101,
    sessionsPerWeek: [4, 5], gamesPerSession: [2, 4], startLevel: 1, maxLevel: 5, rtSpread: 0.35,
    rep: { somut: 0.1, gorsel: 0.3, sembolik: 0.6 },
    numap: { risk: 3, scores: { sayma: 3, subitizing: 3, karsilastirma: 4, sayi_bilesimi: 4, toplama_cikarma: 4 } },
    plan: {
      sayma:           { modes: ['counting', 'ordinalCount', 'counterFromN'], acc: [0.78, 0.96], rt: [4200, 2700], hint: [0.6, 0.1], weight: 3, errors: { off_by_one: 0.7, random: 0.3 } },
      subitizing:      { modes: ['subitizing', 'fivesFrame', 'tensFrame'], acc: [0.76, 0.94], rt: [3200, 2000], hint: [0.5, 0.1], weight: 2, errors: { off_by_one: 0.6, magnitude: 0.2, random: 0.2 } },
      karsilastirma:   { modes: ['comparison', 'lessMoreEqual', 'ordering'], acc: [0.74, 0.94], rt: [4500, 2900], hint: [0.8, 0.2], weight: 3, errors: { sign_error: 0.5, off_by_one: 0.3, random: 0.2 } },
      sayi_bilesimi:   { modes: ['makeFive', 'makeTen'], acc: [0.66, 0.88], rt: [5500, 3600], hint: [1.2, 0.4], weight: 2, errors: { off_by_one: 0.6, random: 0.4 } },
      toplama_cikarma: { modes: ['addChips', 'countOnAdd'], acc: [0.62, 0.84], rt: [6500, 4200], hint: [1.4, 0.6], weight: 1, startDay: 11, errors: { off_by_one: 0.5, operation_swap: 0.2, random: 0.3 } },
    },
    ltUps: [['sayma', 2, 3, 14], ['sayma', 3, 4, 5], ['subitizing', 2, 3, 9], ['karsilastirma', 3, 4, 7]],
    alerts: [
      ['positive', 'sayma', 'Yüksek Doğruluk!', 'sayma kategorisinde %94 doğruluğa ulaştı!', 'Bu kategoride bir üst düzeye geçmeyi değerlendirin.', 2],
      ['positive', 'sayma', 'Düzey Yükseldi!', 'sayma kategorisinde L4 düzeyine yükseldi!', 'Bu başarıyı kutlayın ve bir sonraki düzeye geçişi teşvik edin.', 5],
    ],
  },
  {
    key: 'yusuf', name: 'Yusuf', avatar: '🚀', ageGroup: 'sinif1', grade: '1', ageMonths: 82, seed: 2202,
    sessionsPerWeek: [3, 4], gamesPerSession: [2, 3], startLevel: 1, maxLevel: 2, rtSpread: 0.9,
    rep: { somut: 0.45, gorsel: 0.4, sembolik: 0.15 },
    numap: { risk: 5, scores: { sayma: 5, subitizing: 5, karsilastirma: 5, sayi_bilesimi: 4, toplama_cikarma: 5 } },
    plan: {
      sayma:           { modes: ['counting', 'ordinalCount', 'counterFromN'], acc: [0.46, 0.53], rt: [9200, 8600], hint: [3.3, 3.5], weight: 4, errors: { off_by_one: 0.6, magnitude: 0.2, random: 0.2 } },
      subitizing:      { modes: ['subitizing', 'fivesFrame'], acc: [0.38, 0.45], rt: [6200, 6000], hint: [3.0, 3.2], weight: 3, errors: { off_by_one: 0.5, magnitude: 0.3, random: 0.2 } },
      karsilastirma:   { modes: ['comparison', 'lessMoreEqual', 'numberLineEstimate'], acc: [0.40, 0.46], rt: [9800, 9400], hint: [3.2, 3.4], weight: 3, errors: { sign_error: 0.35, magnitude: 0.45, off_by_one: 0.2 } },
      toplama_cikarma: { modes: ['addChips'], acc: [0.34, 0.42], rt: [11500, 11000], hint: [3.7, 3.9], weight: 1, startDay: 12, errors: { operation_swap: 0.3, off_by_one: 0.4, random: 0.3 } },
    },
    ltUps: [],
    alerts: [
      ['attention', 'subitizing', 'Zorlanma Tespit Edildi', 'subitizing kategorisinde son hafta %42 doğruluk.', 'Bu kategoride zorluk düzeyini azaltmayı ve somut materyallerle çalışmayı değerlendirin.', 1],
      ['attention', 'sayma', 'Yüksek İpucu Bağımlılığı', 'sayma kategorisinde sürekli Kademe 3 ipucuna ihtiyaç duyuyor.', 'İpucu kademesini kademeli olarak azaltmayı ve bağımsız deneme fırsatları oluşturmayı değerlendirin.', 1],
      ['critical', null, 'Diskalkuli Göstergeleri', 'Birden fazla diskalkuli göstergesi tespit edildi: sayı_hissi_zayıflığı, sayma_ilkeleri_eksikliği, çalışma_belleği_göstergesi', 'Profesyonel değerlendirme için uzman görüşü alınması önerilir. Bu bir tanı değildir.', 3],
    ],
  },
  {
    key: 'zeynep', name: 'Zeynep', avatar: '🪐', ageGroup: 'okuloncesi', grade: '', ageMonths: 68, seed: 3303,
    sessionsPerWeek: [3, 4], gamesPerSession: [2, 3], startLevel: 1, maxLevel: 3, rtSpread: 0.5,
    rep: { somut: 0.35, gorsel: 0.45, sembolik: 0.2 },
    numap: null,
    plan: {
      sayma:         { modes: ['counting', 'ordinalCount'], acc: [0.60, 0.85], rt: [6500, 4600], hint: [1.8, 0.7], weight: 3, errors: { off_by_one: 0.7, random: 0.3 } },
      subitizing:    { modes: ['subitizing', 'fivesFrame'], acc: [0.55, 0.78], rt: [5000, 3700], hint: [1.5, 0.6], weight: 2, errors: { off_by_one: 0.6, magnitude: 0.2, random: 0.2 } },
      karsilastirma: { modes: ['lessMoreEqual', 'comparison'], acc: [0.50, 0.72], rt: [6000, 4500], hint: [1.6, 0.9], weight: 2, errors: { sign_error: 0.6, off_by_one: 0.2, random: 0.2 } },
      sayi_bilesimi: { modes: ['makeFive'], acc: [0.45, 0.64], rt: [7000, 5500], hint: [2.2, 1.3], weight: 1, startDay: 9, errors: { off_by_one: 0.6, random: 0.4 } },
    },
    ltUps: [['sayma', 2, 3, 8]],
    alerts: [
      ['positive', 'sayma', 'Düzey Yükseldi!', 'sayma kategorisinde L3 düzeyine yükseldi!', 'Bu başarıyı kutlayın ve bir sonraki düzeye geçişi teşvik edin.', 8],
    ],
  },
  {
    key: 'mert', name: 'Mert', avatar: '🛸', ageGroup: 'sinif2', grade: '2', ageMonths: 92, seed: 4404,
    sessionsPerWeek: [3, 5], gamesPerSession: [2, 4], startLevel: 2, maxLevel: 5, rtSpread: 0.4,
    rep: { somut: 0.1, gorsel: 0.35, sembolik: 0.55 },
    numap: { risk: 4, scores: { sayma: 2, subitizing: 2, karsilastirma: 3, sayi_bilesimi: 3, basamak_degeri: 3, toplama_cikarma: 5, carpma_bolme: 5 } },
    plan: {
      sayma:           { modes: ['skipCount', 'decadeCount', 'counterFromN'], acc: [0.86, 0.95], rt: [3500, 2600], hint: [0.4, 0.1], weight: 2, errors: { off_by_one: 0.6, random: 0.4 } },
      subitizing:      { modes: ['tensFrame', 'doubleTensFrame'], acc: [0.86, 0.96], rt: [2800, 2000], hint: [0.3, 0.1], weight: 2, errors: { off_by_one: 0.7, random: 0.3 } },
      karsilastirma:   { modes: ['ordering', 'numberLineEstimate', 'nlPlacement'], acc: [0.82, 0.93], rt: [4000, 3000], hint: [0.5, 0.2], weight: 2, errors: { off_by_one: 0.5, magnitude: 0.2, random: 0.3 } },
      basamak_degeri:  { modes: ['bundleTens', 'placeValue', 'expandForm'], acc: [0.78, 0.91], rt: [5000, 3800], hint: [0.8, 0.3], weight: 2, errors: { procedural: 0.5, magnitude: 0.2, random: 0.3 } },
      toplama_cikarma: { modes: ['addition', 'subtraction', 'countOnAdd', 'wpAdd'], acc: [0.58, 0.72], rt: [9800, 8200], hint: [2.2, 1.6], weight: 4, errors: { operation_swap: 0.3, off_by_one: 0.35, procedural: 0.2, random: 0.15 } },
      carpma_bolme:    { modes: ['repeatAdd', 'arrayDots'], acc: [0.50, 0.68], rt: [8800, 7600], hint: [2.4, 1.8], weight: 2, startDay: 12, errors: { magnitude: 0.4, off_by_one: 0.3, random: 0.3 } },
    },
    ltUps: [['subitizing', 2, 3, 15], ['subitizing', 3, 4, 4], ['sayma', 2, 3, 12], ['karsilastirma', 3, 4, 9], ['basamak_degeri', 5, 6, 10]],
    alerts: [
      ['positive', 'subitizing', 'Yüksek Doğruluk!', 'subitizing kategorisinde %93 doğruluğa ulaştı!', 'Bu kategoride bir üst düzeye geçmeyi değerlendirin.', 4],
      ['attention', 'carpma_bolme', 'Zorlanma Tespit Edildi', 'carpma_bolme kategorisinde son hafta %48 doğruluk.', 'Bu kategoride zorluk düzeyini azaltmayı ve somut materyallerle çalışmayı değerlendirin.', 6],
    ],
  },
];

// ── Yardımcılar ─────────────────────────────────────────────────────────────
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const irand = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
function weighted(rng, weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rng() * total;
  for (const [k, w] of entries) { r -= w; if (r <= 0) return k; }
  return entries[entries.length - 1][0];
}
const isoDay = (ms) => new Date(ms).toISOString().slice(0, 10); // oyun içi seri anahtarı (GalakSay.jsx UTC gün kullanır)
// Yerel takvim günü (SummaryScheduler/PerformanceAnalyzer localDateKey ile aynı biçim)
const localDay = (ms) => { const d = new Date(ms); const p2 = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`; };

// GalakSay.jsx calcStarFragments ile birebir
function calcStarFragments(acc, streak, level, rounds) {
  let f = 0;
  if (acc === 100) f += 5; else if (acc >= 80) f += 3; else if (acc >= 60) f += 2; else if (acc >= 40) f += 1;
  f += Math.min(3, Math.floor(level / 2));
  if (streak >= 7) f += 3; else if (streak >= 5) f += 2; else if (streak >= 3) f += 1;
  if (rounds >= 15) f += 1;
  return f;
}
// GalakSay.jsx puanlama (hız bonusu yok; ipucu 3 hafif, 4-5 belirgin indirim; seri bonusu)
function pointsFor(level, hint, streak) {
  const base = hint >= 4 ? 5 + level : hint === 3 ? Math.round((10 + level * 2) * 0.8) : 10 + level * 2;
  const streakBonus = streak >= 7 ? 5 : streak >= 5 ? 3 : streak >= 3 ? 2 : 0;
  return base + streakBonus;
}

const ADD_MODES = new Set(['addition', 'addChips', 'countOnAdd', 'wpAdd']);
const SUB_MODES = new Set(['subtraction', 'removeChips', 'difference', 'wpSub']);
const MUL_MODES = new Set(['repeatAdd', 'multiplyVisual', 'arrayDots', 'timesTable']);

// Soru içeriği (AnalyticsBridge questionContent: {type,num1,num2} + targetAnswer)
function makeQuestion(rng, mode, level) {
  const max = LEVEL_MAX[level] || 10;
  if (ADD_MODES.has(mode)) {
    const n1 = irand(rng, 1, max), n2 = irand(rng, 1, Math.max(1, max - n1 > 0 ? max - n1 : 1));
    return { type: 'add', num1: n1, num2: n2, answer: n1 + n2 };
  }
  if (SUB_MODES.has(mode)) {
    const n1 = irand(rng, 2, max), n2 = irand(rng, 1, n1);
    return { type: 'sub', num1: n1, num2: n2, answer: n1 - n2 };
  }
  if (MUL_MODES.has(mode)) {
    const n1 = irand(rng, 2, 5), n2 = irand(rng, 2, 5);
    return { type: 'mul', num1: n1, num2: n2, answer: n1 * n2 };
  }
  if (mode === 'comparison' || mode === 'lessMoreEqual') {
    const n1 = irand(rng, 1, max); let n2 = irand(rng, 1, max); if (n2 === n1) n2 = n1 === max ? n1 - 1 : n1 + 1;
    return { type: mode, num1: n1, num2: n2, answer: Math.max(n1, n2) };
  }
  if (mode === 'makeFive') { const c = irand(rng, 0, 4); return { type: mode, num1: c, num2: 5, answer: 5 - c }; }
  if (mode === 'makeTen') { const c = irand(rng, 1, 9); return { type: mode, num1: c, num2: 10, answer: 10 - c }; }
  if (mode === 'bundleTens' || mode === 'placeValue' || mode === 'expandForm') {
    const n = irand(rng, 11, 99); return { type: mode, num1: n, num2: undefined, answer: n };
  }
  const n = irand(rng, 1, max);
  return { type: mode, num1: n, num2: undefined, answer: n };
}

const ERR_META = {
  off_by_one:     { severity: 'low',    evidence: 'sayma başlangıç/son hatası (±1)' },
  magnitude:      { severity: 'high',   evidence: 'sayı büyüklüğü algısında ciddi sapma' },
  operation_swap: { severity: 'high',   evidence: 'sembol/işlem karışıklığı' },
  sign_error:     { severity: 'medium', evidence: 'Karşılaştırma yönü ters' },
  procedural:     { severity: 'medium', evidence: 'basamak sırası karışık' },
  attention:      { severity: 'low',    evidence: 'Cevap çok hızlı' },
  random:         { severity: 'low',    evidence: 'Sistematik olmayan hata' },
};

// Yanlış cevap üret (hata türüne göre; utils/errorClassifier sınıflarıyla uyumlu)
function wrongAnswer(rng, q, errorType) {
  const a = q.answer;
  switch (errorType) {
    case 'off_by_one': return a <= 1 ? a + 1 : (rng() < 0.5 ? a - 1 : a + 1);
    case 'magnitude': return rng() < 0.5 || a < 2 ? a * 2 + irand(rng, 0, 2) : Math.max(0, Math.floor(a / 2) - irand(rng, 0, 1));
    case 'operation_swap':
      if (q.type === 'add') return Math.abs(q.num1 - q.num2) === a ? a + 2 : Math.abs(q.num1 - q.num2);
      if (q.type === 'sub') return q.num1 + q.num2;
      return a + 3;
    case 'sign_error': return q.num2 != null ? Math.min(q.num1, q.num2) : Math.max(0, a - 2);
    case 'procedural': {
      if (a >= 10) { const s = String(a).split('').reverse().join(''); const v = Number(s); if (v !== a) return v; }
      return a + 2;
    }
    default: { let v = irand(rng, 0, Math.max(3, a + 3)); if (v === a) v = a + 2; return v; }
  }
}

// Haftalık oturum günleri: hafta başına 3-5 gün; son oturum daima DÜN (seri devam etsin).
function sessionDays(rng, perWeek) {
  const days = new Set([1]);
  const weeks = [[23, 17], [16, 10], [9, 3]];
  for (const [hi, lo] of weeks) {
    const n = irand(rng, perWeek[0], perWeek[1]);
    const pool = []; for (let d = hi; d >= lo; d--) pool.push(d);
    for (let i = 0; i < n && pool.length; i++) days.add(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  }
  if (rng() < 0.6) days.add(2);
  return [...days].sort((a, b) => b - a); // eski → yeni
}

// ── Geçmiş üretimi (tek çocuk) ──────────────────────────────────────────────
function generateHistory(p, ns, now) {
  const rng = mulberry32(p.seed);
  const cats = Object.keys(p.plan);
  const modeLevel = {}; // mode → {level, hi}
  const stats = { totalGames: 0, totalScore: 0, totalCorrect: 0, totalQ: 0, modeStats: {}, recent: [], starFragments: 0, _maxStreak: 0, _lastEarnedFrags: 0 };
  let adaptive = {};
  const cards = [];
  const log = [];
  const sessions = [];
  const events = [];
  const answered = []; // {cat, day, ms, ok, rt, hint, rep, sessionId}
  let lastPlayed = null;
  let sessionSeq = 0;

  const ltLevelAt = (cat, dayAgo) => LT_MIN[cat] + p.ltUps.filter(([c, , , d]) => c === cat && d >= dayAgo).length;

  for (const dayAgo of sessionDays(rng, p.sessionsPerWeek)) {
    const t = clamp((DEMO_DAYS - dayAgo) / DEMO_DAYS, 0, 1);
    const dayStart = new Date(now - dayAgo * DAY_MS); dayStart.setHours(0, 0, 0, 0);
    const startMs = dayStart.getTime() + (9 + irand(rng, 0, 7)) * 3600000 + irand(rng, 0, 59) * 60000;
    const targetMs = irand(rng, 8, 15) * 60000; // 8-15 dk
    const sessionId = `demo_${ns}_s${++sessionSeq}`;
    let evSeq = 0;
    // Oturum içi olaylar önce GÖRELİ zamanla (ms) üretilir; sonda hedef süreye (8-15 dk)
    // ölçeklenir → durationMs her zaman aralıkta, olay sırası korunur.
    const sessionEvents = [];
    const ev = (eventType, data, ctx, rel) => {
      const e = {
        eventId: `${sessionId}_e${++evSeq}`, sessionId, childId: ns, timestamp: rel,
        category: ctx.category || null, moduleId: ctx.moduleId || null,
        ltLevel: ctx.ltLevel ?? data.ltLevel ?? null, difficulty: ctx.difficulty || null,
        questionId: null, eventType, data,
      };
      sessionEvents.push(e);
      return e;
    };
    const abs = (rel) => startMs + rel; // ikincil zaman damgaları (kart/günlük/adaptif) için yaklaşık mutlak zaman
    ev('session_start', { deviceType: 'tablet', screenSize: '1280x800', appVersion: APP_VERSION, nuMapProfileId: null, startingLTLevels: {} }, {}, 0);

    const nGames = irand(rng, p.gamesPerSession[0], p.gamesPerSession[1]);
    const available = cats.filter((c) => p.plan[c].startDay == null || dayAgo <= p.plan[c].startDay);
    const games = [];
    for (let g = 0; g < nGames; g++) {
      const cat = weighted(rng, Object.fromEntries(available.map((c) => [c, p.plan[c].weight])));
      games.push({ cat, mode: pick(rng, p.plan[cat].modes) });
    }
    let cursor = irand(rng, 20, 60) * 1000; // menü/gezegen seçimi
    const catsVisited = new Set();
    let qAttempted = 0, qCorrect = 0;

    for (const { cat: planCat, mode } of games) {
      const plan = p.plan[planCat];
      // Olay kategorisi AnalyticsBridge eşlemesinden türetilir (analitikle birebir; plan kategorisiyle aynı olmalı)
      const cat = MODE_TO_CATEGORY[mode] || planCat;
      catsVisited.add(cat);
      if (!modeLevel[mode]) modeLevel[mode] = { level: p.startLevel, hi: 0 };
      const level = modeLevel[mode].level;
      const moduleId = `${mode}_L${level}`;
      const difficulty = level <= 2 ? 'kolay' : 'orta';
      const pAcc = clamp(lerp(plan.acc[0], plan.acc[1], t) + (rng() - 0.5) * 0.08, 0.05, 0.99);
      const rtBase = lerp(plan.rt[0], plan.rt[1], t);
      const hBase = Math.max(0, lerp(plan.hint[0], plan.hint[1], t));
      const gameStart = cursor;
      let correct = 0, streak = 0, maxStreak = 0, score = 0, rtSum = 0, hintSum = 0;
      const rts = [];

      for (let r = 0; r < ROUNDS; r++) {
        const q = makeQuestion(rng, mode, level);
        ev('question_presented', { questionContent: { type: q.type, num1: q.num1, num2: q.num2 }, targetAnswer: q.answer, difficultyParams: { level, difficulty } }, { category: cat, moduleId, difficulty }, cursor);
        const ok = rng() < pAcc;
        // İpucu: kullanım olasılığı + kademe (ortalama ≈ hBase)
        const pHint = Math.min(0.9, hBase / 2.2);
        let hint = 0;
        if (hBase > 0 && rng() < pHint) hint = clamp(Math.round(hBase / pHint + (rng() - 0.5) * 1.5), 1, 5);
        let rt = Math.round(rtBase * (1 - p.rtSpread / 2 + rng() * p.rtSpread) * (ok ? 1 : 1.15) * (hint ? 1.2 : 1));
        let errorType = 'correct';
        if (!ok) {
          errorType = weighted(rng, plan.errors);
          if (errorType === 'attention') rt = irand(rng, 300, 700);
        }
        const given = ok ? q.answer : wrongAnswer(rng, q, errorType);
        const rep = weighted(rng, p.rep);
        if (hint > 0) ev('hint_requested', { hintLevel: hint, timeBeforeHint_ms: Math.round(rt * 0.45), wrongAttemptsBeforeHint: 0 }, { category: cat }, cursor + Math.round(rt * 0.45));
        const answerTs = cursor + rt;
        const meta = ok ? { severity: 'none', evidence: 'Doğru cevap' } : (ERR_META[errorType] || ERR_META.random);
        const answerEvt = ev('question_answered', {
          givenAnswer: given, isCorrect: ok, responseTime_ms: rt, attemptNumber: 1, hintLevelUsed: hint,
          representationUsed: rep, interactionCount: 0, targetAnswer: q.answer, category: cat,
          questionContent: { type: q.type, num1: q.num1, num2: q.num2 },
          errorType, errorSeverity: meta.severity, errorEvidence: meta.evidence,
        }, { category: cat, moduleId }, answerTs);
        answered.push({ cat, dayAgo, evt: answerEvt, ok, rt, hint, rep, sessionId });
        qAttempted++;
        if (ok) { qCorrect++; correct++; streak++; maxStreak = Math.max(maxStreak, streak); score += pointsFor(level, hint, streak); } else streak = 0;
        rtSum += rt; hintSum += hint; rts.push(rt / 1000);
        cursor += rt + irand(rng, 1500, 3000); // geri bildirim + animasyon
      }

      const acc = Math.round((correct / ROUNDS) * 100);
      ev('module_completed', { moduleId, category: cat, ltLevel: level, accuracy: correct / ROUNDS, avgResponseTime_ms: Math.round(rtSum / ROUNDS), avgHintLevel: Number((hintSum / ROUNDS).toFixed(2)), totalTime_ms: cursor - gameStart }, { category: cat, moduleId }, cursor);

      // ── localStorage istatistikleri (GalakSay.jsx oyun-sonu ile birebir) ──
      const ms = stats.modeStats;
      if (!ms[mode]) ms[mode] = { games: 0, correct: 0, total: 0, best: 0, levelBest: {} };
      ms[mode].games++; ms[mode].correct += correct; ms[mode].total += ROUNDS; ms[mode].best = Math.max(ms[mode].best, score);
      ms[mode].levelBest[level] = Math.max(ms[mode].levelBest[level] || 0, acc);
      const frags = calcStarFragments(acc, maxStreak, level, ROUNDS);
      stats.totalGames++; stats.totalScore += score; stats.totalCorrect += correct; stats.totalQ += ROUNDS;
      stats._maxStreak = Math.max(stats._maxStreak, maxStreak);
      stats.starFragments += frags; stats._lastEarnedFrags = frags;
      stats.recent = [{ mode, level, correct, total: ROUNDS, score, acc, starFragments: frags }, ...stats.recent.slice(0, 19)];
      adaptive = { ...adaptive, [mode]: AdaptiveEngine.updateModePerf(adaptive[mode], { acc, correct, total: ROUNDS, level, avgTime: rts.reduce((a, b) => a + b, 0) / rts.length, mode }) };
      if (adaptive[mode]) adaptive[mode].lastPlayed = abs(cursor);
      lastPlayed = { mode, level };
      // Seviye ilerlemesi: art arda iki %80+ oyun → bir üst seviye (tavan profile göre)
      if (acc >= 80) { modeLevel[mode].hi++; if (modeLevel[mode].hi >= 2 && level < p.maxLevel) { modeLevel[mode].level++; modeLevel[mode].hi = 0; } } else modeLevel[mode].hi = 0;
      // Koleksiyon kartı (%60+ başarıda şans)
      if (acc >= 60 && rng() < (acc >= 90 ? 0.6 : acc >= 75 ? 0.35 : 0.2)) {
        const owned = new Set(cards.map((c) => c.id));
        const pool = DEMO_CARDS.filter((c) => !owned.has(c.id));
        if (pool.length) cards.push({ ...pick(rng, pool), earnedAt: abs(cursor), earnedMode: mode, earnedLevel: level });
      }
      log.unshift({ entry: `${PLANET[cat]} görevi tamamlandı: %${acc} başarı, Sv.${level}${maxStreak >= 3 ? ` — ${maxStreak}'lü seri!` : ''}`, date: new Date(abs(cursor)).toISOString(), planet: PLANET[cat], acc, mode, level });
      cursor += irand(rng, 5, 12) * 1000; // sonuç ekranı / sonraki görev seçimi
    }

    // Göreli zamanları hedef süreye ölçekle (doğal süre hedefi aşarsa 1:1 kalır)
    const natural = cursor + irand(rng, 5, 15) * 1000;
    const total = Math.max(natural, targetMs);
    const factor = total / natural;
    for (const e of sessionEvents) e.timestamp = startMs + Math.round(e.timestamp * factor);
    const endMs = startMs + total;
    ev('session_end', { duration_ms: total, questionsAttempted: qAttempted, questionsCorrect: qCorrect, categoriesVisited: [...catsVisited], endingLTLevels: {} }, {}, endMs);
    sessionEvents[sessionEvents.length - 1].timestamp = endMs; // session_end ölçeklenmez
    events.push(...sessionEvents);
    sessions.push({
      sessionId, childId: ns, startTime: new Date(startMs).toISOString(), endTime: new Date(endMs).toISOString(),
      durationMs: endMs - startMs, questionsAttempted: qAttempted, questionsCorrect: qCorrect,
      categoriesVisited: [...catsVisited], deviceType: 'tablet', appVersion: APP_VERSION,
    });
  }

  // ── Günlük özetler (SummaryScheduler.calculateDailySummary şekli) ──
  const daily = [];
  const byDayCat = new Map();
  for (const a of answered) {
    const k = `${localDay(a.evt.timestamp)}|${a.cat}`;
    if (!byDayCat.has(k)) byDayCat.set(k, []);
    byDayCat.get(k).push(a);
  }
  for (const [k, rows] of byDayCat) {
    const [date, category] = k.split('|');
    const n = rows.length, c = rows.filter((r) => r.ok).length;
    daily.push({
      childId: ns, date, category, questionsAttempted: n, questionsCorrect: c, accuracy: c / n,
      avgResponseTimeMs: Math.round(rows.reduce((s, r) => s + r.rt, 0) / n),
      avgHintLevel: Number((rows.reduce((s, r) => s + r.hint, 0) / n).toFixed(2)),
      hintDependencyRate: Number((rows.filter((r) => r.hint > 0).length / n).toFixed(2)),
      concreteSupportRate: Number((rows.filter((r) => r.rep === 'somut').length / n).toFixed(2)),
      ltLevel: ltLevelAt(category, rows[0].dayAgo), sessionCount: new Set(rows.map((r) => r.sessionId)).size, totalTimeMs: 0,
    });
  }

  // ── LT yörünge geçmişi ──
  const ltHistory = p.ltUps.map(([category, from, to, dayAgo]) => {
    const ts = now - dayAgo * DAY_MS + 15 * 3600000;
    const rows = answered.filter((a) => a.cat === category && a.dayAgo >= dayAgo);
    const n = rows.length || 1, c = rows.filter((r) => r.ok).length;
    return {
      childId: ns, category, from_level: from, to_level: to, direction: 'up',
      criteria_snapshot: JSON.stringify({
        accuracyRequired: 0.8, accuracyCurrent: Number((c / n).toFixed(2)), maxHintLevelRequired: 2,
        avgHintLevelCurrent: Number((rows.reduce((s, r) => s + r.hint, 0) / n).toFixed(2)),
        minQuestionsRequired: 10, questionsCompleted: rows.length, concreteSupportMaxRate: 0.2,
        concreteSupportCurrentRate: Number((rows.filter((r) => r.rep === 'somut').length / n).toFixed(2)),
      }),
      timestamp: new Date(ts).toISOString(),
    };
  });

  // ── Uyarılar (AlertSystem.createAlert şekli) ──
  const alerts = p.alerts.map(([type, category, title, message, recommendation, dayAgo], i) => ({
    alertId: `demo_${ns}_a${i + 1}`, childId: ns, type, category, title, message, recommendation,
    timestamp: new Date(now - dayAgo * DAY_MS + 16 * 3600000).toISOString(), read: 0, data: '{}',
  }));

  // ── Başarımlar (rozetlerle uyumlu) ──
  const badges = [];
  if (stats.totalGames >= 1) badges.push(['firstGame', 'İlk Adım', '🎯']);
  if (stats.totalGames >= 5) badges.push(['fiveGames', 'Oyun Sever', '🎮']);
  if (stats.totalGames >= 20) badges.push(['twentyGames', 'Oyun Kurdu', '🕹️']);
  if (stats.recent.some((g) => g.acc === 100)) badges.push(['perfect', 'Mükemmelci', '💯']);
  if (Object.keys(stats.modeStats).length >= 5) badges.push(['explorer5', 'Kaşif', '🔭']);
  if (stats._maxStreak >= 3) badges.push(['streak3', 'Alevli', '🔥']);
  if (stats._maxStreak >= 7) badges.push(['streak7', 'Durdurulamaz', '☄️']);
  const achievements = badges.map(([achievementId, name, emoji], i) => ({
    childId: ns, achievementId, name, emoji, unlockedAt: new Date(now - (DEMO_DAYS - 2 - i * 3) * DAY_MS).toISOString(),
  }));

  // ── Eserler (kategori %80+) ──
  const catAcc = {};
  for (const a of answered) { (catAcc[a.cat] ||= { n: 0, c: 0 }).n++; if (a.ok) catAcc[a.cat].c++; }
  const artifacts = Object.entries(catAcc).filter(([c, v]) => PLANET_ARTIFACT[c] && v.c / v.n >= 0.8).map(([c]) => PLANET_ARTIFACT[c]);

  // ── Günlük giriş serisi: son oturum günü DÜN; geriye doğru ardışık gün sayısı ──
  const playedDays = new Set(sessions.map((s) => isoDay(new Date(s.startTime).getTime())));
  let current = 0;
  for (let d = 1; d <= DEMO_DAYS; d++) { if (playedDays.has(isoDay(now - d * DAY_MS))) current++; else break; }
  const streak = { current: Math.max(1, current), best: Math.max(3, current), lastDate: isoDay(now - DAY_MS), claimedToday: false };

  const lastSeenAt = sessions.length ? sessions[sessions.length - 1].endTime : new Date(now).toISOString();
  return { stats, lastPlayed, adaptive, cards, log: log.slice(0, 30), sessions, events, daily, ltHistory, alerts, achievements, artifacts, streak, lastSeenAt };
}

// ── localStorage yazımı ────────────────────────────────────────────────────
function writeLocal(ns, p, h) {
  const set = (k, v) => { try { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); } catch { /* depolama dolu */ } };
  set(`dokunsay-user-${ns}`, { stats: h.stats, name: p.name, lastPlayed: h.lastPlayed, roundsPerGame: ROUNDS });
  set(`ds_ageGroup_${ns}`, p.ageGroup);
  set(`ds_streak_${ns}`, h.streak);
  set(`ds_adaptive_${ns}`, h.adaptive);
  set(`ds_cards_${ns}`, h.cards);
  set(`ds_artifacts_${ns}`, h.artifacts);
  set(`ds_captainslog_${ns}`, h.log);
  set(`ds_onboarded_${ns}`, '1');
  set(`dokunsay_story_v2_${ns}`, '1');
}

// ── IndexedDB yazımı ───────────────────────────────────────────────────────
async function writeDb(ns, p, h, now) {
  await saveChildProfile({
    childId: ns, name: p.name, gradeLevel: p.grade || null, birthDate: null,
    nuMapProfileId: p.numap ? `demo_numap_${p.key}` : null,
    nuMapRiskLevel: p.numap ? p.numap.risk : null,
    nuMapAssessmentDate: p.numap ? new Date(now - (DEMO_DAYS + 4) * DAY_MS).toISOString() : null,
    nuMapCategoryScores: p.numap ? p.numap.scores : null,
    gender: null, school: null, city: null, district: null, ageMonths: p.ageMonths, demo: true,
    createdAt: new Date(now - DEMO_DAYS * DAY_MS).toISOString(),
  });
  await putBatch(STORES.SESSIONS, h.sessions);
  for (let i = 0; i < h.events.length; i += 500) await putBatch(STORES.EVENTS, h.events.slice(i, i + 500));
  if (h.ltHistory.length) await putBatch(STORES.LT_HISTORY, h.ltHistory);
  if (h.daily.length) await putBatch(STORES.DAILY_SUMMARY, h.daily);
  if (h.alerts.length) await putBatch(STORES.ALERTS, h.alerts);
  if (h.achievements.length) await putBatch(STORES.ACHIEVEMENTS, h.achievements);
}

// ── Dışa açık API ──────────────────────────────────────────────────────────
/** Roster'daki demo çocuklar (demo:true bayraklı; numap kayıtları zaten dışarıda). */
export function listDemoChildren() {
  return listChildren().filter((c) => c.demo === true);
}

export function isDemoLoaded() {
  return listDemoChildren().length > 0;
}

/**
 * Demo sınıfını yükle: 4 çocuk + 24 günlük geçmiş. Zaten yüklüyse mevcut kayıtlar döner.
 * @param {{ownerId?: string|null, now?: number}} [opts] ownerId: kaydı ekleyen yerel kullanıcı (admin=null)
 * @returns {Promise<Array>} oluşturulan roster kayıtları
 */
export async function loadDemoClass({ ownerId = null, now = Date.now() } = {}) {
  const existing = listDemoChildren();
  if (existing.length) return existing;
  const created = [];
  for (const p of PROFILES) {
    const child = addChild({ name: p.name, avatar: p.avatar, ageGroup: p.ageGroup, grade: p.grade, pin: '', ownerId });
    const h = generateHistory(p, child.ns, now);
    writeLocal(child.ns, p, h);
    const rec = updateChild(child.ns, { demo: true, lastSeenAt: h.lastSeenAt });
    try {
      await writeDb(child.ns, p, h, now);
    } catch (e) {
      // IndexedDB engelli/özel pencere: yerel istatistikler yine durur (oyun içi ekranlar dolu kalır).
      console.warn('[GalakSay demo] IndexedDB yazılamadı:', e);
    }
    created.push(rec || child);
  }
  return created;
}

/**
 * Demo sınıfını kaldır: YALNIZ demo:true bayraklı çocuklar; roster kaydı + tüm
 * ns-sonekli localStorage anahtarları + IndexedDB kayıtları silinir.
 * @returns {Promise<number>} silinen çocuk sayısı
 */
export async function removeDemoClass() {
  const demo = listDemoChildren();
  for (const c of demo) {
    removeChild(c.ns, true); // roster + localStorage süpürme (+ ateş-unut IndexedDB)
    try { await deleteChildRecords(c.ns); } catch { /* IndexedDB yok/engelli */ }
  }
  return demo.length;
}
