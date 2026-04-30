// ═══ SES EFEKTLERİ — Web Audio API ══════════════════════════════════════════
// §Çocuk dostu: Sıcak, samimi, ksilofon/çan tınısı, yumuşak geçişler
export const SFX = (() => {
  let ctx = null;
  const getCtx = () => {
    if (!ctx || ctx.state === "closed") ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };

  // Warm tone with harmonics — ksilofon/marimba benzeri
  const warm = (freq, dur, vol = 0.12, delay = 0) => {
    try {
      const c = getCtx(), t = c.currentTime + delay;
      // Fundamental
      const o1 = c.createOscillator(), g1 = c.createGain();
      o1.type = "sine"; o1.frequency.value = freq;
      g1.gain.setValueAtTime(0, t);
      g1.gain.linearRampToValueAtTime(vol, t + 0.01);
      g1.gain.exponentialRampToValueAtTime(vol * 0.6, t + dur * 0.3);
      g1.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o1.connect(g1); g1.connect(c.destination);
      o1.start(t); o1.stop(t + dur + 0.05);
      // 2nd harmonic (octave above, softer) — gives warmth
      const o2 = c.createOscillator(), g2 = c.createGain();
      o2.type = "sine"; o2.frequency.value = freq * 2;
      g2.gain.setValueAtTime(0, t);
      g2.gain.linearRampToValueAtTime(vol * 0.15, t + 0.005);
      g2.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.5);
      o2.connect(g2); g2.connect(c.destination);
      o2.start(t); o2.stop(t + dur * 0.5 + 0.05);
      // 3rd harmonic (adds brightness/bell quality)
      const o3 = c.createOscillator(), g3 = c.createGain();
      o3.type = "sine"; o3.frequency.value = freq * 4;
      g3.gain.setValueAtTime(0, t);
      g3.gain.linearRampToValueAtTime(vol * 0.06, t + 0.003);
      g3.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.15);
      o3.connect(g3); g3.connect(c.destination);
      o3.start(t); o3.stop(t + dur * 0.15 + 0.05);
    } catch {}
  };

  // Soft chime — can tinisi
  const chime = (freq, dur, vol = 0.08, delay = 0) => {
    try {
      const c = getCtx(), t = c.currentTime + delay;
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + dur + 0.05);
    } catch {}
  };

  // Playful boing — yay sesi
  const boing = (startFreq, endFreq, dur, vol = 0.1, delay = 0) => {
    try {
      const c = getCtx(), t = c.currentTime + delay;
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(startFreq, t);
      o.frequency.exponentialRampToValueAtTime(endFreq, t + dur * 0.4);
      o.frequency.exponentialRampToValueAtTime(endFreq * 0.8, t + dur);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + dur + 0.05);
    } catch {}
  };

  const noise = (dur, vol = 0.03) => {
    try {
      const c = getCtx(), buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
      const s = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter();
      s.buffer = buf; f.type = "highpass"; f.frequency.value = 4000;
      g.gain.setValueAtTime(vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      s.connect(f); f.connect(g); g.connect(c.destination);
      s.start(); s.stop(c.currentTime + dur + 0.05);
    } catch {}
  };

  return {
    // Dokunma — hafif, tatli tiklama
    click: () => { warm(1100, 0.08, 0.06); },

    // Seçenek seçme — yumuşak pop
    pop: () => { boing(600, 900, 0.12, 0.1); },

    // Dogru cevap — neseli ksilofon arpej (Do-Mi-Sol)
    correct: () => {
      warm(523, 0.18, 0.12);          // C5 — do
      warm(659, 0.18, 0.12, 0.1);     // E5 — mi
      warm(784, 0.28, 0.15, 0.2);     // G5 — sol (uzun, parlak)
      chime(1568, 0.4, 0.04, 0.25);   // ust tinirti
    },

    // Yanlis — nazik, uzgun ama korkutucu degil
    wrong: () => {
      warm(392, 0.2, 0.08);           // G4
      warm(349, 0.3, 0.06, 0.15);     // F4 — yarim ton asagi
    },

    // 3'lu seri — yukselen nese
    streak3: () => {
      warm(523, 0.12, 0.1);           // C5
      warm(659, 0.12, 0.1, 0.09);     // E5
      warm(784, 0.12, 0.1, 0.18);     // G5
      warm(1047, 0.35, 0.14, 0.27);   // C6 — parlak final
      chime(2093, 0.5, 0.03, 0.35);
    },

    // 5'li seri — ksilofon merdiveni
    streak5: () => {
      [523, 587, 659, 784, 880, 1047].forEach((f, i) =>
        warm(f, 0.14, 0.11, i * 0.08)
      );
      warm(1319, 0.5, 0.14, 0.52);    // E6
      chime(2637, 0.6, 0.03, 0.6);
    },

    // 7'li seri — gorkemli fanfar
    streak7: () => {
      [523, 659, 784, 1047, 1175, 1319, 1568].forEach((f, i) =>
        warm(f, 0.12, 0.12, i * 0.07)
      );
      warm(2093, 0.6, 0.14, 0.52);
      chime(2637, 0.8, 0.04, 0.6);
      chime(3136, 0.6, 0.02, 0.7);
    },

    // Sayma tiklamasi — her sayida yukselen nota
    countTick: (idx) => {
      const freq = 523 + idx * 50; // Do'dan yukari
      warm(freq, 0.1, 0.08);
    },

    // Gizleme — gizemli alcalan
    hide: () => {
      warm(880, 0.15, 0.06);
      warm(440, 0.2, 0.05, 0.08);
    },

    // Ortaya cikarma — neseli yukselen
    reveal: () => {
      warm(440, 0.1, 0.06);
      warm(880, 0.18, 0.08, 0.06);
      chime(1760, 0.3, 0.03, 0.12);
    },

    // Ipucu — yumusak can
    hint: () => {
      chime(880, 0.12, 0.06);
      chime(1175, 0.18, 0.07, 0.08);
    },

    // Oyun sonu — basariya gore farkli melodi
    gameComplete: (acc) => {
      if (acc >= 80) {
        // Zafer fanfari — sicak, gorkemli
        const notes = [523, 523, 659, 784, 784, 1047, 1319, 1568];
        const durs =  [0.1, 0.1, 0.12, 0.15, 0.1, 0.15, 0.2, 0.5];
        let t = 0;
        notes.forEach((f, i) => { warm(f, durs[i] + 0.08, 0.13, t); t += durs[i]; });
        chime(2093, 0.8, 0.04, t);
      } else if (acc >= 60) {
        // Iyi is — tesvik edici
        warm(392, 0.18, 0.1);
        warm(523, 0.18, 0.1, 0.14);
        warm(659, 0.35, 0.12, 0.28);
      } else {
        // Cesaret verici — uzgun degil, nazik
        warm(523, 0.25, 0.07);
        warm(494, 0.2, 0.06, 0.2);
        warm(523, 0.4, 0.08, 0.4); // do'ya donus — umut
      }
    },

    // Oyun baslangici — heyecanli uc nota
    startGame: () => {
      warm(523, 0.1, 0.1);
      warm(659, 0.1, 0.1, 0.08);
      warm(784, 0.2, 0.12, 0.16);
      boing(400, 800, 0.15, 0.04, 0.2);
    },

    // Seviye atlama — gorkemli yukselis
    levelUp: () => {
      [523, 659, 784, 1047, 1319].forEach((f, i) => warm(f, 0.18, 0.12, i * 0.1));
      warm(1568, 0.6, 0.15, 0.55);
      chime(3136, 0.8, 0.03, 0.7);
    },

    // Gorev tamamlama
    questComplete: () => {
      warm(784, 0.12, 0.1);
      warm(988, 0.12, 0.1, 0.09);
      warm(1175, 0.12, 0.1, 0.18);
      warm(1568, 0.4, 0.14, 0.27);
      chime(2093, 0.5, 0.04, 0.35);
    },

    // Rehber karsilama — sicak iki nota
    mascotGreet: () => {
      warm(660, 0.1, 0.07);
      warm(880, 0.15, 0.09, 0.08);
    },

    // Zorluk artisi
    adaptiveUp: () => {
      warm(660, 0.1, 0.08);
      warm(880, 0.15, 0.1, 0.08);
      chime(1320, 0.2, 0.04, 0.15);
    },

    // Zorluk dususu — nazik
    adaptiveDown: () => {
      warm(523, 0.12, 0.06);
      warm(440, 0.18, 0.05, 0.1);
    },

    // Buton tiklama — minik pop
    buttonPop: () => {
      boing(800, 1200, 0.06, 0.05);
    },

    // Toggle acma — kisa yukari tik
    toggleOn: () => {
      warm(880, 0.06, 0.06);
      chime(1320, 0.08, 0.04, 0.03);
    },

    // Toggle kapama — kisa asagi tik
    toggleOff: () => {
      warm(660, 0.06, 0.05);
    },

    // Navigasyon — hafif slide sesi
    navigate: () => {
      warm(700, 0.06, 0.04);
      warm(900, 0.08, 0.05, 0.03);
    },

    // Geri navigasyon — hafif ters slide
    navigateBack: () => {
      warm(900, 0.06, 0.04);
      warm(700, 0.08, 0.04, 0.03);
    },

    // Hata / uyari — kisa nötr uyari
    warning: () => {
      warm(440, 0.15, 0.06);
      warm(440, 0.15, 0.05, 0.12);
    },

    // Kart toplama
    cardCollect: () => {
      warm(880, 0.1, 0.08);
      warm(1175, 0.12, 0.1, 0.07);
      warm(1568, 0.18, 0.12, 0.15);
    },

    // ═══ UZAY GALAKSI SES EFEKTLERI ═══
    crystalCollect: () => {
      // Yıldız taşı tinirti — can arpej + parilti
      [1047, 1319, 1568, 2093].forEach((f, i) => warm(f, 0.25, 0.1, i * 0.12));
      chime(2637, 0.8, 0.06, 0.5);
      chime(3520, 0.6, 0.03, 0.6);
    },
    warp: () => {
      // Hyperspace — yukselen boing + tinirti
      boing(200, 1200, 0.3, 0.06);
      chime(1568, 0.4, 0.04, 0.2);
      noise(0.15, 0.02);
    },
    rocketLaunch: () => {
      // Roket — dusuk boing yukselen
      boing(150, 600, 0.4, 0.06);
      warm(800, 0.25, 0.06, 0.3);
      noise(0.3, 0.03);
    },
    planetLand: () => {
      // Gezegen inisi — nazik alcalan canlar
      warm(660, 0.18, 0.07);
      warm(523, 0.18, 0.07, 0.12);
      warm(440, 0.25, 0.06, 0.24);
      chime(880, 0.4, 0.03, 0.3);
    },
    guideGreet: () => {
      // Rehber selamlama — sicak, cana yakin uc nota
      warm(660, 0.12, 0.08);
      warm(880, 0.15, 0.1, 0.08);
      warm(1047, 0.08, 0.06, 0.18);
      boing(500, 700, 0.1, 0.03, 0.22);
    },
    galaxySaved: () => {
      // Galaksi kurtarildi — epik sicak fanfar
      const notes = [523, 659, 784, 1047, 784, 1047, 1319, 1568, 2093];
      const durs =  [0.12, 0.12, 0.12, 0.2, 0.1, 0.15, 0.15, 0.2, 0.7];
      let t = 0;
      notes.forEach((f, i) => { warm(f, durs[i] + 0.06, 0.12, t); t += durs[i]; });
      chime(2637, 1.0, 0.05, t - 0.2);
      chime(3520, 0.8, 0.03, t);
    },

    // ═══ GalakSay Pro — Ek Ses Efektleri ═══

    // Snap/oturma — kisa, tatmin edici tik
    snap: () => {
      warm(1400, 0.05, 0.08);
      chime(2800, 0.08, 0.04, 0.02);
    },

    // Kapsul birlesmesi — enerji sarj sesi
    capsuleMerge: () => {
      boing(400, 1200, 0.2, 0.08);
      chime(1568, 0.3, 0.05, 0.1);
      chime(2093, 0.2, 0.03, 0.15);
    },

    // Kapsul bolunmesi — kristal kirilma tınısı
    capsuleSplit: () => {
      warm(1200, 0.08, 0.06);
      warm(800, 0.12, 0.05, 0.04);
      chime(600, 0.15, 0.04, 0.06);
    },

    // Yıldız taşı dokunma — metalik ting (artan pitch)
    stampTick: (idx = 0) => {
      const baseFreq = 800 + idx * 80;
      chime(baseFreq, 0.12, 0.07);
      chime(baseFreq * 2.5, 0.08, 0.03, 0.02);
    },

    // Surukleme baslangici — hafif whoosh
    dragStart: () => {
      noise(0.08, 0.02);
      warm(600, 0.06, 0.03);
    },

    // Modul tamamlama — 1.5sn melodi
    moduleComplete: () => {
      const notes = [523, 659, 784, 1047, 1319, 1568];
      const durs =  [0.12, 0.12, 0.15, 0.15, 0.2, 0.5];
      let t = 0;
      notes.forEach((f, i) => { warm(f, durs[i] + 0.1, 0.13, t); t += durs[i]; });
      chime(2093, 0.8, 0.05, t - 0.1);
      chime(3136, 0.6, 0.03, t);
    },

    // Rozet kazanma — ozel fanfar (2sn)
    badgeEarned: () => {
      const notes = [392, 523, 659, 784, 659, 784, 1047, 1319, 1568, 2093];
      const durs =  [0.1, 0.1, 0.1, 0.15, 0.08, 0.12, 0.15, 0.15, 0.2, 0.6];
      let t = 0;
      notes.forEach((f, i) => { warm(f, durs[i] + 0.08, 0.12, t); t += durs[i]; });
      chime(2637, 1.0, 0.04, t - 0.2);
      chime(3520, 0.8, 0.03, t);
    },

    // Yildiz kazanma — her yildiz icin artan nota
    starEarned: (starIndex = 0) => {
      const freqs = [784, 1047, 1568];
      const f = freqs[Math.min(starIndex, 2)];
      warm(f, 0.25, 0.12);
      chime(f * 2, 0.4, 0.05, 0.1);
    },

    // ═══ DOKUNGSAY MATERYAL SES EFEKTLERI ═══
    // Yildiz parcasi toplama — kisa parlak cinlama
    starFragment: () => {
      chime(1760, 0.15, 0.08);
      chime(2349, 0.2, 0.06, 0.08);
      warm(2637, 0.25, 0.05, 0.15);
    },
    // Gemi yukseltme — gorkemli fanfar
    shipUpgrade: () => {
      [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => warm(f, 0.2, 0.13, i * 0.1));
      warm(2093, 0.6, 0.15, 0.65);
      chime(3136, 0.8, 0.04, 0.8);
      noise(0.1, 0.02);
    },
    // Yildiz tasi birakma — metalik tik
    chipDrop: () => {
      warm(1200, 0.06, 0.08);
      chime(2400, 0.08, 0.03, 0.02);
    },
    // Yildiz tasi secme — pop
    chipPop: () => {
      boing(800, 1100, 0.08, 0.06);
    },
    // Kapsul birlesmesi — enerji sarj sesi
    merge: () => {
      boing(300, 800, 0.25, 0.08);
      warm(880, 0.2, 0.06, 0.15);
      chime(1760, 0.3, 0.04, 0.25);
    },
    // Kapsul bolunmesi — kristal kirik
    split: () => {
      noise(0.08, 0.04);
      warm(1200, 0.08, 0.07);
      warm(800, 0.12, 0.06, 0.05);
      chime(600, 0.15, 0.04, 0.08);
    },
    // Manyetik snap — hafif tik
    magnetSnap: () => {
      warm(1400, 0.04, 0.05);
      chime(2100, 0.06, 0.02, 0.01);
    },
    // Materyal birakma — yumusak oturma
    drop: () => {
      warm(600, 0.08, 0.06);
      boing(400, 200, 0.06, 0.03, 0.03);
    },
    // Yildiz tasi eslesmesi — parlak cinlama
    starDrop: () => {
      warm(1047, 0.12, 0.08);
      chime(2093, 0.18, 0.06, 0.06);
      chime(2637, 0.12, 0.03, 0.12);
    },
    // 10 yildiz tasi → kapsul donusum — enerji birikimi + patlama
    pulToKapsul: () => {
      [523, 587, 659, 784, 880, 988, 1047, 1175, 1319, 1568].forEach((f, i) =>
        warm(f, 0.08, 0.06 + i * 0.005, i * 0.05)
      );
      chime(2093, 0.5, 0.06, 0.55);
      boing(300, 1200, 0.15, 0.04, 0.5);
    },
  };
})();
