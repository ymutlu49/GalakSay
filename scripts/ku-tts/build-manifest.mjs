// Kürtçe (Kurmancî) TTS klip manifesti üretici — v2 (kelime + tam-cümle kapsamı).
// Oyun-içi konuşma (KU_TTS) tamamını kapsar: sabit cümleler tam-klip (iyi prozodi),
// dinamik (sayı içeren) cümleler kelime-kelime (kuAudio runtime'da birleştirir).
// Çıktı: manifest.json → generate.py facebook/mms-tts-kmr-script_latin ile .wav üretir.
// NOT: KU_TTS GalakSay.jsx'te değişirse buradaki SENTENCES'i güncelle.
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { numWordKu } from "../../src/data/numWords.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Latin Kurmancî → ASCII slug (klip id + dosya adı için; kuAudio.js ile AYNI olmalı) ──
const slug = (w) => String(w).toLowerCase()
  .replace(/ê/g, "e").replace(/î/g, "i").replace(/û/g, "u").replace(/ç/g, "c").replace(/ş/g, "s")
  .replace(/['']/g, "").replace(/[^a-z0-9]/g, "");

// ── Sabit (interpolasyonsuz) konuşma cümleleri → tam-klip (en iyi prozodi) ──
const SENTENCES = [
  // KU_TTS sabit prompt'ları
  "Di kapsula enerjiyê de çend kevirên stêrkan hene?",
  "Kevirên stêrkan bijmêre û reqemê rast bibîne!",
  "Ev kevirên stêrkan kîjan jimarê nîşan didin?",
  "Çend kevirên stêrkan hene? Bi reqemê re hev bike!",
  "Kevirên stêrkan bi baldarî bijmêre, dema veşart bîne bîra xwe!",
  "Baş binêre, dema veşart bîne bîra xwe!",
  "Baş binêre, çend lib?",
  "Di çarçoveya pêncan de çend kevirên stêrkan hene?",
  "Di çarçoveya dehan de çend kevirên stêrkan hene?",
  "Li du çarçoveyan binêre, 10 zêde çend?",
  "Aliyê çepê li gorî aliyê rastê çawa ye?",
  "Ji bo 5'an çend kevirên stêrkan lazim in?",
  "Ji bo 10'an çend kevirên stêrkan lazim in?",
  "Jimara winda bibîne",
  "Ev hevkêşe rast e?",
  "Kevirên stêrkan ên du koman wekhev in?",
  "Çend lib hene? Texmîn bike!",
  "Ev kapsul li gorî 5'an çawa ye?",
  "Bi 10'an kom bike! Çend dehek, çend yekek?",
  "Têkiliya berevajî: zêdekirin û kêmkirin",
  "Parçeya winda ya di nimûneya dubareker de bibîne!",
  "Nîşan kîjan jimarê nîşan dide?",
  "Di kapsula veşartî de çend kevirên stêrkan hene?",
  // Rehber selamları (GALAXY_THEME_KU guideGreet)
  "Ez Jimarok im! Bi destlêdana kevirên stêrkan jimaran keşif bike. Tu amade yî?",
  "Ez Nêrok im! Çavên xwe veke, bi lez bifikire — enerjî bi te re ye!",
  "Ez Mêzînvan im! Giran e an sivik e? Werin em bi hev re hevsengiyê bibînin!",
  "Ez Avaker im! Hejmaran perçe bike û yek bike — werin em avahiyan tamîr bikin!",
  "Mîaw! Ez Qatok im. Dehek û yekek — werin em pîramîdan tamîr bikin!",
  "Ez Dudil im! Kom bike û yek bike, jê bike û tariyê bişkîne!",
  "Bi 8 milên xwe kom dikim! Car bike, dabeş bike — Carcaryayê xilas bike!",
  "Ez Guherbar im! Nimûneyan bibîne û Nimûneyayê xilas bike!",
  // Geri bildirim (galaxyCorrect/wrong KU — emojisiz)
  "Aferîn, Keşifger!", "Mîna stêrkê dibiriqî!", "Galaksî ronî dibe!", "Tu super î, Keşifger!",
  "Gerîngeh hinekî şemitî... Dîsa biceribîne!", "Nêzîk bûyî! Careke din binêre",
  "Vê carê nebû, lê tu nêzîk î!", "Keşifger dest jê bernadin! Dîsa biceribîne",
];

// ── Dinamik (sayı içeren) konuşma şablonları — sadece KELİME hasadı için (${..} kaldırıldı) ──
const TEMPLATES = [
  "Kapsula bi kevirên stêrkan bibîne",
  "kevirên stêrkan bi cî bike",
  "kevirên stêrkan din zêde bike",
  "kevirên stêrkan derxe",
  "Ji an dest pê bike, lib din bijmêre!",
  "zêdek dike çend?", "kêmek dike çend?", "dibe zêdek çi?",
  "Kîjan kêmtir e?", "Kîjan zêdetir e?",
  "Stêrka biriqandî ji rastê di rêza çendan de ye?",
  "Stêrka biriqandî ji çepê di rêza çendan de ye?",
  "Ji an paşve bijmêre!", "Ji mezin bo biçûk rêz bike!", "Ji biçûk bo mezin rêz bike!",
  "Berî an çi tê?", "Piştî an çi tê?", "Di navbera û de çi heye?",
  "carek dike çend?", "parînek dike çend?",
  "kom, di her komê de, giştî çend?", "rêz, stûn, giştî çend?",
  "bi an bi rîtim bijmêre!",
  "liban li koman wekhev parve bike, di her komê de çend?",
  "liban li komên an veqetîne, çend kom?",
  "Nîvê an çend e?", "Ducarê an çend e?",
  "carê an çend e?", "çend carê an e?",
  "parînek dike çend?",
  "Mertebeya dehan ya jimara çend e?", "Mertebeya yekan ya jimara çend e?",
  "dehek û yekek, giştî çend?", "Vekirina jimara bibîne!",
  "Parçeyên jimara bibîne!",
  "Her gav zêde dibe, ya pêş çi ye?", "Her gav kêm dibe, ya pêş çi ye?",
  "Navika vê nimûneyê çi ye?", "Vê nimûneyê veguherîne jimaran!",
  "Pirsgirêkê guhdarî bike û bi zêdekirinê çareser bike!",
  "Pirsgirêkê guhdarî bike û bi kêmkirinê çareser bike!",
  "Pirsgirêkê guhdarî bike û bi carkirinê çareser bike!",
  "Pirsgirêkê guhdarî bike û bi parkirinê çareser bike!",
  "Pirsgirêkê guhdarî bike û berhev bike!",
  "Di kîjan kapsulê de kevirên stêrkan hene?",
  "li xeta jimarî li ku ye?",
  "Ji an dest pê bike û bijmêre!",
  "Ji an ber bi pêş bijmêre!", "Ji an ber bi paş bijmêre!",
];

const clips = {};

// 1) Sayılar 0-100 → num/<n>
for (let n = 0; n <= 100; n++) clips["num/" + n] = numWordKu(n);

// 2) Sabit cümleler → phrase/<slug> (tam-klip, iyi prozodi)
for (const s of SENTENCES) { const id = "phrase/" + slug(s); if (!clips[id]) clips[id] = s; }

// 3) Tüm kelimeler (cümleler + şablonlar) → word/<slug> (dinamik cümleler için)
const wordSet = new Map(); // slug -> orijinal kelime
for (const s of [...SENTENCES, ...TEMPLATES]) {
  for (const raw of s.split(/\s+/)) {
    const w = raw.replace(/[?!.,:;…]/g, "").trim();
    if (!w || /^\d+$/.test(w)) continue;       // saf sayı → num/ ile karşılanır
    const sg = slug(w);
    if (sg && !wordSet.has(sg)) wordSet.set(sg, w);
  }
}
for (const [sg, w] of wordSet) clips["word/" + sg] = w;

const manifest = {
  model: "facebook/mms-tts-kmr-script_latin",
  sampleRate: 16000,
  format: "wav",
  note: "num/<n>=sayı, phrase/<slug>=tam cümle, word/<slug>=tek kelime. Slug: ê→e î→i û→u ç→c ş→s, ' kaldır.",
  clips,
};
writeFileSync(join(__dirname, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("manifest.json:", Object.keys(clips).length, "klip");
console.log("  sayı:", 101, "| cümle:", SENTENCES.length, "| kelime:", wordSet.size);
