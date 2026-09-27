/* GalakSay — canlı sürüme eklenen çalışma zamanı davranışları (okunur kaynak, derleme gerektirmez).
 *
 * oyna/index.html bu dosyayı oyun paketinden ÖNCE yükler.
 *
 * 1) Kurmancî seslendirme
 *    Oyun Kurmancî metinleri tarayıcının Türkçe sesine veriyordu (paket yalnız "tr-TR" ya da "en-US"
 *    istiyor; kayıtlı Kurmancî ses klasörü sunucuda yok). Sonuç: Kurmancî yönergeler bozuk Türkçe
 *    telaffuzla okunuyordu. Burada tek noktadan düzeltilir:
 *      - Dil Kurmancî ise ve cihazda Kurmancî bir sistem sesi varsa o ses kullanılır.
 *      - Yoksa okuma sessiz yapılır; ama konuşmanın başlangıç/bitiş olayları tahmini sürede
 *        tetiklenir. Böylece konuşmaya bağlı sayma animasyonları ve sıralı yönergeler akmaya devam eder.
 *      - Ses düzeyi 0 olan "ısınma" konuşmaları olduğu gibi geçer.
 */
(function () {
  'use strict';
  var ss = window.speechSynthesis;
  if (!ss || typeof window.SpeechSynthesisUtterance !== 'function') return;

  function currentLang() {
    try { return localStorage.getItem('ds_lang') || 'tr'; } catch (e) { return 'tr'; }
  }
  function kurmanjiVoice() {
    try {
      var list = ss.getVoices() || [];
      for (var i = 0; i < list.length; i++) {
        var v = list[i];
        if (/^(ku|kmr)([-_]|$)/i.test(v.lang || '') || /kurd|kurmanc/i.test(v.name || '')) return v;
      }
    } catch (e) { /* ses listesi alınamadı */ }
    return null;
  }

  var nativeSpeak = ss.speak.bind(ss);
  var nativeCancel = ss.cancel.bind(ss);
  var pending = [];

  function fire(u, name) {
    var fn = u && u['on' + name];
    if (typeof fn === 'function') {
      try { fn.call(u, { type: name, utterance: u, charIndex: 0, elapsedTime: 0 }); } catch (e) { /* oyun işleyicisi hatası */ }
    }
  }

  ss.speak = function (u) {
    if (!u || currentLang() !== 'ku' || u.volume === 0) return nativeSpeak(u);
    var voice = kurmanjiVoice();
    if (voice) {
      try { u.voice = voice; u.lang = voice.lang; } catch (e) { /* ses atanamadı */ }
      return nativeSpeak(u);
    }
    var words = String(u.text || '').trim().split(/\s+/).filter(Boolean).length;
    var ms = Math.min(6000, 250 + (words * 330) / (u.rate || 1));
    pending.push(setTimeout(function () { fire(u, 'start'); }, 0));
    pending.push(setTimeout(function () { fire(u, 'end'); }, ms));
  };

  ss.cancel = function () {
    for (var i = 0; i < pending.length; i++) clearTimeout(pending[i]);
    pending = [];
    return nativeCancel();
  };
})();
