// GalakSay — Giriş ekranı metinleri (açılış, kaptan oluşturma, kaptan seçimi).
// Oyun-içi sözlük GalakSay.jsx içinde; giriş ekranları o paket yüklenmeden görünür,
// bu yüzden küçük ve bağımsız bir sözlük. TR varsayılan; KU (Kurmancî) tam karşılık;
// bilinmeyen dil TR'ye düşer.

export const ENTRY_LANG_KEY = 'ds_lang';

export const ENTRY_STR = {
  tr: {
    tagline: 'Sayılar Galaksisi seni bekliyor',
    play: 'OYNA',
    startJourney: 'Yolculuğa Başla',
    resume: 'Devam et',
    captains: 'Kaptanlar',
    newCaptain: 'Yeni Kaptan',
    adults: 'Öğretmen · Ebeveyn',
    adultsHint: 'Sınıf paneli, raporlar ve ayarlar',
    langName: 'Türkçe',
    back: 'Geri',
    next: 'İleri',
    ready: 'Hazırım!',
    whoPlays: 'Kim oynuyor?',
    tapYourPicture: 'Kendi resmine dokun',
    listen: 'Yönergeyi sesli dinle',
    newStart: 'Yeni başla',
    stars: 'yıldız',
    pinTitle: 'Şifreni gir',
    pinFail: 'Olmadı, tekrar dene!',
    hello: (name) => `Merhaba ${name}!`,
    helloPin: (name) => `Merhaba ${name}! Şifreni gir.`,
    step1: 'Kaptanını seç',
    step1Voice: 'Kaptanını seç! Beğendiğin resme dokun.',
    step2: 'Adın ne?',
    step2Hint: 'Takma ad da olur; bu ad cihazda kalır.',
    step2Voice: 'Adın ne? Adını yaz ya da boş bırak.',
    namePlaceholder: 'Kaptan',
    step3: 'Kaç yaşındasın?',
    step3Voice: 'Kaç yaşındasın? Sana uyan gezegene dokun.',
    ageHint: { okuloncesi: 'Okul öncesi', sinif1: '1. sınıf', sinif2: '2. sınıf' },
    ageYears: { okuloncesi: '5–6 yaş', sinif1: '6–7 yaş', sinif2: '7–8 yaş' },
    welcomeCaptain: (name) => `Hoş geldin, Kaptan ${name}!`,
    welcomeVoice: (name) => `Hoş geldin Kaptan ${name}! Yolculuk başlıyor.`,
    createTitle: 'Kaptanını oluştur',
    stepOf: (i, n) => `Adım ${i} / ${n}`,
    changeLang: 'Dil değiştir',
    version: 'Sürüm',
  },
  ku: {
    tagline: 'Galaksiya Hejmaran li benda te ye',
    play: 'BILÎZE',
    startJourney: 'Dest bi Rêwîtiyê Bike',
    resume: 'Bidomîne',
    captains: 'Kaptan',
    newCaptain: 'Kaptanê Nû',
    adults: 'Mamoste · Dê û bav',
    adultsHint: 'Panela polê, rapor û mîheng',
    langName: 'Kurmancî',
    back: 'Vegere',
    next: 'Pêş',
    ready: 'Ez amade me!',
    whoPlays: 'Kî dilîze?',
    tapYourPicture: 'Dest bide wêneyê xwe',
    listen: 'Rêbernameyê bibihîze',
    newStart: 'Nû dest pê bike',
    stars: 'stêrk',
    pinTitle: 'Şîfreya xwe binivîse',
    pinFail: 'Nebû, dîsa biceribîne!',
    hello: (name) => `Silav ${name}!`,
    helloPin: (name) => `Silav ${name}! Şîfreya xwe binivîse.`,
    step1: 'Kaptanê xwe hilbijêre',
    step1Voice: 'Kaptanê xwe hilbijêre! Dest bide wêneyê ku tu jê hez dikî.',
    step2: 'Navê te çi ye?',
    step2Hint: 'Nasnav jî dibe; ev nav di cîhazê de dimîne.',
    step2Voice: 'Navê te çi ye? Navê xwe binivîse an vala bihêle.',
    namePlaceholder: 'Kaptan',
    step3: 'Tu çend salî yî?',
    step3Voice: 'Tu çend salî yî? Dest bide gerstêrka ku li te tê.',
    ageHint: { okuloncesi: 'Beriya dibistanê', sinif1: 'Pola 1.', sinif2: 'Pola 2.' },
    ageYears: { okuloncesi: '5–6 salî', sinif1: '6–7 salî', sinif2: '7–8 salî' },
    welcomeCaptain: (name) => `Bi xêr hatî, Kaptan ${name}!`,
    welcomeVoice: (name) => `Bi xêr hatî Kaptan ${name}! Rêwîtî dest pê dike.`,
    createTitle: 'Kaptanê xwe çêke',
    stepOf: (i, n) => `Gav ${i} / ${n}`,
    changeLang: 'Zimên biguherîne',
    version: 'Guherto',
  },
};

export function readEntryLang() {
  try {
    const v = localStorage.getItem(ENTRY_LANG_KEY);
    return v && ENTRY_STR[v] ? v : 'tr';
  } catch {
    return 'tr';
  }
}

export function writeEntryLang(lang) {
  try { localStorage.setItem(ENTRY_LANG_KEY, lang); } catch { /* depolama kapalı */ }
}

export function entryStrings(lang) {
  return ENTRY_STR[lang] || ENTRY_STR.tr;
}
