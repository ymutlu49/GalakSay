// GalakSay — Giriş ekranları için hafif sesli yönerge (ön-okur desteği).
//
// Oyun-içi TTS altyapısı GalakSay.jsx'e gömülüdür; giriş ekranları (açılış, kaptan
// oluşturma, kaptan seçimi) o paket yüklenmeden görünür. Burada tarayıcının kendi
// speechSynthesis'i yeter. Gizlilik: çocuğun adı seslendirilebilir → cihaz-içi
// (localService) ses varsa o seçilir, bulut sesine düşülmez.
//
// Kürtçe (Kurmancî) tarayıcı sesi hemen hiçbir cihazda yoktur; ku için uygun ses
// bulunamazsa SESSİZ kalınır (yanlış dilde okumak çocuğu şaşırtır).

const LANG_TAG = { tr: 'tr-TR', ku: 'ku', en: 'en-US' };

export function speak(text, lang = 'tr') {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return false;
    const tag = LANG_TAG[lang] || LANG_TAG.tr;
    const voices = window.speechSynthesis.getVoices() || [];
    const prefix = tag.slice(0, 2).toLowerCase();
    const matching = voices.filter((v) => (v.lang || '').toLowerCase().startsWith(prefix));
    if (lang === 'ku' && matching.length === 0) return false;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = tag;
    const local = matching.find((v) => v.localService) || matching[0];
    if (local) u.voice = local;
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking() {
  try { window.speechSynthesis?.cancel(); } catch { /* yok say */ }
}
