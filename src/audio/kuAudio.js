// ═══ Kürtçe (Kurmancî) gerçek ses — klip oynatma katmanı ═══
// public/audio/ku/<id>.m4a kliplerini çalar (facebook/mms-tts-kmr-script_latin ile WAV üretilir,
// scripts/ku-audio-encode.sh ile AAC m4a'ya çevrilir; index.json "format":"m4a").
// Klip yoksa veya henüz üretilmemişse güvenli şekilde tarayıcı TTS'e düşer.
// Üretim: scripts/ku-tts/  (build-manifest.mjs + generate.py)
import { numWordKu } from "../data/numWords.js";

const BASE = ((typeof import.meta !== "undefined" && import.meta.env && import.meta.env.BASE_URL) || "/") + "audio/ku/";

let _index = null;          // Set<string> — üretilmiş klip id'leri (index.json'dan)
let _indexLoaded = false;
let _enabled = true;
const _cache = new Map();   // id -> HTMLAudioElement
const _numToId = new Map(); // KU SAYI kelimesi -> num/<n> (diğer kelimeler word/<slug> ile çözülür)
for (let n = 0; n <= 100; n++) _numToId.set(numWordKu(n), "num/" + n);

// Latin Kurmancî → ASCII slug (build-manifest.mjs ile AYNI olmalı: ê→e î→i û→u ç→c ş→s, ' kaldır)
const slug = (w) => String(w).toLowerCase()
  .replace(/ê/g, "e").replace(/î/g, "i").replace(/û/g, "u").replace(/ç/g, "c").replace(/ş/g, "s")
  .replace(/['']/g, "").replace(/[^a-z0-9]/g, "");

/** index.json'ı bir kez yükle (hangi klipler mevcut). Sessizce başarısız olur. */
export async function initKuAudio() {
  if (_indexLoaded) return;
  _indexLoaded = true;
  try {
    const res = await fetch(BASE + "index.json", { cache: "no-cache" });
    if (res.ok) {
      const j = await res.json();
      _index = new Set(j.ids || []);
      if (j.format) setKuAudioFormat(j.format); // "m4a" → AAC klipler (derleme betiği yazar), yoksa wav
    }
  } catch (_) { _index = null; }
}

export function setKuAudioEnabled(on) { _enabled = !!on; }
export function kuAudioReady() { return _enabled && _index && _index.size > 0; }
export function hasClip(id) { return !!(_index && _index.has(id)); }

const _CACHE_MAX = 30; // LRU: 343 klibin çözülmüş PCM'i bellekte tutulmasın
// Biçim: derleme m4a (AAC, ~%90 küçük) üretmişse onu, yoksa wav'ı kullan (index.json 'format' alanı)
let _ext = ".wav";
export function setKuAudioFormat(fmt) { _ext = fmt === "m4a" ? ".m4a" : ".wav"; }
function _audio(id) {
  let a = _cache.get(id);
  if (a) { _cache.delete(id); _cache.set(id, a); return a; } // en son kullanılanı sona al
  a = new Audio(BASE + id + _ext); a.preload = "auto"; _cache.set(id, a);
  if (_cache.size > _CACHE_MAX) { const oldest = _cache.keys().next().value; const o = _cache.get(oldest); try { o.src = ""; } catch { /* yok say */ } _cache.delete(oldest); }
  return a;
}

/** Tek klip çal. Promise<boolean> — başarıyla çalındıysa true. */
export function playClip(id) {
  return new Promise((resolve) => {
    if (!_enabled || !hasClip(id)) return resolve(false);
    try {
      const a = _audio(id);
      a.currentTime = 0;
      a.onended = () => resolve(true);
      a.onerror = () => resolve(false);
      const p = a.play();
      if (p && p.catch) p.catch(() => resolve(false));
    } catch (_) { resolve(false); }
  });
}

/** Klipleri sırayla çal (cümle = kelime klipleri). Biri eksikse false döner. */
export async function playSeq(ids) {
  if (!_enabled) return false;
  for (const id of ids) {
    if (!hasClip(id)) return false;
  }
  for (const id of ids) {
    const ok = await playClip(id);
    if (!ok) return false;
  }
  return true;
}

/** Bir sayıyı KU klibiyle söyle. */
export function speakNumberKu(n) { return playClip("num/" + n); }

/**
 * KU metni klip(ler)le söylemeyi dene. Metni kelimelere ayırır; HER kelimenin
 * klibi varsa sırayla çalar (Promise<true>). Aksi halde Promise<false> →
 * çağıran tarayıcı TTS'e düşmeli.
 */
const _EMOJI_RE = /(?:[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]|\u{FE0F})/gu;
const _PUNCT_RE = /[?!.,:;…]/g;

/** Bir metin parçasını klip id listesine çevir (rakam→num, KU sayı kelimesi→num, diğer→word/<slug>). */
function _toIds(s) {
  const ids = [];
  for (const raw of s.split(/\s+/)) {
    const w = raw.trim();
    if (!w) continue;
    if (/^\d+$/.test(w)) { ids.push("num/" + parseInt(w, 10)); continue; }
    const numId = _numToId.get(w);
    ids.push(numId || ("word/" + slug(w)));
  }
  return ids;
}

export async function trySpeakKu(text) {
  if (!_enabled || !_index || !text) return false;
  const noEmoji = String(text).replace(_EMOJI_RE, " ").replace(/\s+/g, " ").trim();
  if (!noEmoji) return false;
  const cleanFull = noEmoji.replace(_PUNCT_RE, " ").replace(/\s+/g, " ").trim();
  if (!cleanFull) return false;

  // 1) Tüm metin tek cümle klibi (en iyi prozodi — birleşik rehber selamları / tek cümle)
  if (hasClip("phrase/" + slug(cleanFull))) return playClip("phrase/" + slug(cleanFull));

  // 2) Cümle cümle: her cümleyi KENDİ phrase klibi VEYA kelime klipleriyle çal.
  //    Türkçe anlatımla aynı yapı (cümle cümle), pürüzsüz/tutarlı Kürtçe tonlama.
  //    Yalnızca TÜM cümleler kliplerle kapanabiliyorsa kullan (karışık dil/ton olmasın).
  const sentences = noEmoji.split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter(Boolean);
  if (sentences.length > 1) {
    const plan = [];
    let coverable = true;
    for (const sent of sentences) {
      const c = sent.replace(_PUNCT_RE, " ").replace(/\s+/g, " ").trim();
      if (!c) continue;
      const pid = "phrase/" + slug(c);
      if (hasClip(pid)) { plan.push(pid); continue; }
      const ids = _toIds(c);
      if (ids.length && ids.every((id) => hasClip(id))) { plan.push(ids); continue; }
      coverable = false; break;
    }
    if (coverable && plan.length) {
      for (const step of plan) {
        const ok = Array.isArray(step) ? await playSeq(step) : await playClip(step);
        if (!ok) return false;
      }
      return true;
    }
  }

  // 3) Tüm metin kelime-kelime (hepsi mevcutsa çalar; biri eksikse false → tarayıcı fallback)
  return playSeq(_toIds(cleanFull));
}
