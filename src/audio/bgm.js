// ═══ ARKA PLAN MÜZİĞİ (BGM) — Kategori bazlı ambient ═════════════════════
// Rapor §4.1: Müzik atmosfer yaratır, karakter temaları bağlanma sağlar
export const BGM = (() => {
  let ctx = null, gainNode = null, oscillators = [], playing = false, currentCat = null;
  let loopTimer = null;
  const catThemes = {
    // ═══ GEZEGEN TEMALARI — Her gezegenin kendine ozgu kozmik melodisi ═══
    level1: { notes: [261, 392, 329, 523, 392], tempo: 2.2, type: "sine", vol: 0.025 },     // Sayalon: Sakin akan nehir melodisi (C-G-E-C5-G)
    level2: { notes: [329, 493, 659, 493, 329], tempo: 1.4, type: "sine", vol: 0.025 },     // Simseron: Hizli elektrik titresimi (E-B-E5-B-E)
    level3: { notes: [349, 440, 349, 523, 440], tempo: 1.8, type: "triangle", vol: 0.02 },  // Terazya: Sallanan denge melodisi (F-A-F-C5-A)
    level4: { notes: [261, 329, 440, 523, 659], tempo: 1.6, type: "triangle", vol: 0.02 },  // Bilesya: Yapi taslari gibi yukselen (C-E-A-C5-E5)
    level8: { notes: [196, 261, 392, 523, 392, 261], tempo: 2.0, type: "sine", vol: 0.02 }, // Basamara: Derin piramit tinisi (G3-C-G-C5-G-C)
    level5: { notes: [349, 523, 440, 659, 523], tempo: 1.5, type: "sine", vol: 0.025 },     // Toplarya: Iki yarimkure melodisi (F-C5-A-E5-C5)
    level6: { notes: [392, 587, 493, 784, 587], tempo: 1.3, type: "triangle", vol: 0.02 },  // Carpanya: Ritmik izgara paterni (G-D5-B-G5-D5)
    level7: { notes: [220, 330, 440, 330, 523, 440], tempo: 1.8, type: "sine", vol: 0.02 }, // Orunya: Tekrarli desen melodisi (A3-E-A-E-C5-A)
    menu:   { notes: [261, 392, 523, 659, 523, 392, 261], tempo: 2.8, type: "sine", vol: 0.015 }, // Galaksi haritasi: Genis, sakin, uzay ambiyansi
  };
  const stop = () => {
    playing = false;
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    oscillators.forEach(o => { try { o.stop(); } catch {} });
    oscillators = []; currentCat = null;
  };
  const play = (catKey) => {
    if (currentCat === catKey && playing) return;
    stop();
    try {
      if (!ctx || ctx.state === "closed") ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      gainNode = ctx.createGain();
      gainNode.gain.value = 0;
      gainNode.connect(ctx.destination);
      const theme = catThemes[catKey] || catThemes.menu;
      const loopDur = theme.notes.length * theme.tempo;
      const scheduleLoop = () => {
        if (!playing) return;
        // Durmuş oscillator'ları temizle (bellek sızıntısını önle — onended ile de temizleniyor)
        oscillators = oscillators.filter(o => {
          try { return o.context && o.context.state !== 'closed'; } catch { return false; }
        });
        theme.notes.forEach((freq, i) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = theme.type; o.frequency.value = freq;
          const startT = ctx.currentTime + i * theme.tempo;
          g.gain.setValueAtTime(0, startT);
          g.gain.linearRampToValueAtTime(theme.vol, startT + 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, startT + theme.tempo * 0.9);
          o.connect(g); g.connect(gainNode);
          o.start(startT); o.stop(startT + theme.tempo);
          // Biten oscillator'ı otomatik temizle
          o.onended = () => {
            const idx = oscillators.indexOf(o);
            if (idx !== -1) oscillators.splice(idx, 1);
          };
          oscillators.push(o);
        });
        loopTimer = setTimeout(scheduleLoop, loopDur * 1000);
      };
      playing = true; currentCat = catKey;
      gainNode.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.5);
      scheduleLoop();
    } catch {}
  };
  const setVolume = (v) => { if (gainNode) gainNode.gain.value = v; };
  return { play, stop, setVolume, isPlaying: () => playing };
})();
