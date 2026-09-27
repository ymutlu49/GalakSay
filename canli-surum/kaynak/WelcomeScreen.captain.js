// GalakSay — Hesapsız kaptan girişi (canlı v5.10.x paketine takılan karşılama parçası).
//
// Bu dosya, canlı derlemedeki `oyna/assets/WelcomeScreen-BD-9Cs8v.js` parçasının yerine
// konur (aynı dosya adı; index parçası onu tembel yükler). JSX yoktur; derleme gerektirmez.
// Canlı paketin dışa verdiği yardımcıları kullanır:
//   r=React · j=jsx çalışma zamanı · N=listChildren · E=addChild · a1=touchChild ·
//   a2=getResumeInfo · a0=hasPin · L=avatarlar · f=üç dilli metin(tr,ku,en) · z=dil ·
//   $=konuşma dil etiketi · p=açık palet · t=tipografi · G=GalaksayLogo ·
//   h=yönetici şifresi var mı · k=yönetici şifresi kur · m=kurtarma kodu üret · n=yönetici şifresini doğrula ·
//   d/g/e=deneme sınırı (kalan süre / hata kaydı / sıfırla) · B=çocuk kaydını güncelle
// Kaynak (okunur sürüm) GitHub deposundaki src/screens/TitleScreen.jsx, CaptainCreate.jsx,
// CaptainPicker.jsx ile aynı tasarımdır.
//
// Akış: açılış → (kaptan yoksa) "Yolculuğa Başla" → 3 adımlı kaptan oluşturma → oyun
//                (kaptan varsa) "Devam et · son kaptan" → oyun | "Kaptanlar" → liste → oyun
// Şifreli profil seçilirse mevcut öğrenci seçiciye (şifre + kilit korumasıyla) gidilir.
// Öğretmen · Ebeveyn girişi alt bağlantıdadır.
import { r as React, j as J, N as listChildren, E as addChild, a1 as touchChild, a2 as getResumeInfo, a0 as hasPin, L as AVATARS, f as tt, z as getLang, $ as speechTag, p as C, t as TY, G as Logo,
  h as hasAdminPin, k as setAdminPin, m as makeRecoveryCode, n as verifyAdminPin, d as lockLeft, g as noteFail, e as clearFails, B as updateChild } from './index-pKper_0i.js';
import { S as SpaceBackground } from './SpaceBackground-CZeUKPCu.js';

const h = J.jsx;
const hs = J.jsxs;
const F = TY.fontFamily.display;
const NAME_MAX = 24;

function speak(tr, ku, en) {
  try {
    const text = tt(tr, ku, en);
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = speechTag();
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  } catch { /* ses desteklenmiyor */ }
}

const CSS = `
@keyframes gsFloat { 0%,100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-10px) rotate(-2deg); } }
@keyframes gsGlow { 0%,100% { box-shadow: 0 10px 28px rgba(124,58,237,.28), 0 0 0 0 rgba(124,58,237,.22); } 50% { box-shadow: 0 12px 32px rgba(124,58,237,.36), 0 0 0 10px rgba(124,58,237,0); } }
.gs-cta { animation: gsGlow 2.6s ease-in-out infinite; }
.gs-ship { animation: gsFloat 3.4s ease-in-out infinite; }
.gs-tap { transition: transform .12s ease, box-shadow .12s ease; }
.gs-tap:active { transform: scale(.97); }
@media (prefers-reduced-motion: reduce) { .gs-cta, .gs-ship { animation: none; } }
`;

const AGES = [
  { key: 'okuloncesi', icon: '🪐', tr: ['Okul öncesi', '5–6 yaş'], ku: ['Beriya dibistanê', '5–6 salî'], en: ['Preschool', 'age 5–6'] },
  { key: 'sinif1', icon: '⭐', tr: ['1. sınıf', '6–7 yaş'], ku: ['Pola 1.', '6–7 salî'], en: ['Grade 1', 'age 6–7'] },
  { key: 'sinif2', icon: '🚀', tr: ['2. sınıf', '7–8 yaş'], ku: ['Pola 2.', '7–8 salî'], en: ['Grade 2', 'age 7–8'] },
];
const ageText = (g, i) => tt(g.tr[i], g.ku[i], g.en[i]);

const card = { background: C.surface.card, border: `1px solid ${C.surface.divider}`, boxShadow: '0 2px 10px rgba(30,27,75,.06), 0 1px 2px rgba(30,27,75,.04)' };
const page = { position: 'relative', minHeight: '100vh', background: C.gradient.backgroundKids, padding: '14px 16px 16px', boxSizing: 'border-box', overflowY: 'auto', fontFamily: F };
// Genel düzen: sütun ekran yüksekliğini doldurur; içerik margin:auto ile dikeyde ortalanır, uzunsa üstten kayar.
const col = (max) => ({ position: 'relative', zIndex: 1, maxWidth: max, margin: '0 auto', minHeight: 'calc(100dvh - 30px)', display: 'flex', flexDirection: 'column' });
const ghostBtn = { ...card, minHeight: 44, padding: '0 12px', borderRadius: 12, color: C.text.primary, fontFamily: F, fontSize: 14, fontWeight: 800, cursor: 'pointer' };
const speakBtn = (onClick, label) => h('button', { type: 'button', onClick, 'aria-label': label, style: { border: 'none', background: 'rgba(124,58,237,.10)', borderRadius: 999, width: 44, height: 44, cursor: 'pointer', fontSize: 18, lineHeight: 1, flexShrink: 0 } }, '🔊');

// ── Giriş merkezi ────────────────────────────────────────────────────────────
// Tek merkez: çocuklar (devam et · kaptanlar · yeni kaptan) ve yetişkinler (öğretmen/uzman · ebeveyn)
// aynı ekrandan girer. Tanıtım sayfası buraya /oyna/?giris=ogretmen|ebeveyn|yetiskin|kaptanlar|yeni ile
// bağlanır. Yetişkin döşemesi rolü (galaksay_adult_role) kaydeder; giriş ve panel dili buna uyar.
// Yetişkin paneli 10 dakika hareketsiz kalırsa kilitlenir; merkez bunu bir kez bildirir (gs_locked).
// Görev adları (simge, TR, KU, EN): categories paketinden üretilmiştir; açılışı hafif tutmak için gömülü.
const MODES = {"matching":["🎯","Yıldız Eşle!","Stêrkan Hev Bike!","Star Match!"],"quantityMatch":["🎲","Göktaşı Eşle!","Meteoran Hev Bike!","Meteor Match!"],"counting":["🔢","Göktaşı Say!","Meteoran Bijmêre!","Count the Meteors!"],"buildNumber":["🔨","Yıldız Taşı Diz!","Kevirên Stêrkan Rêz Bike!","Line Up Star Stones!"],"ordinalCount":["🏅","Sıra Keşfi!","Keşfa Rêzê!","Order Quest!"],"backwardCount":["⏪","Geri Sayım!","Jimartina Paşve!","Countdown!"],"counterFromN":["🔁","Yörüngeden Say!","Ji Hejmarê Bijmêre!","Count from Orbit!"],"skipCount":["🎵","Galaktik Ritim!","Rîtma Galaktîk!","Galactic Rhythm!"],"decadeCount":["🌉","Onluk Geçidi!","Derbasa Dehekan!","Tens Gateway!"],"conservation":["🔄","Yanılsama mı?","Xapandin e?","Is It a Trick?"],"clockRead":["🕐","Görev Saati!","Demjimêra Erkê!","Mission Clock!"],"subitizing":["⚡","Işık Hızı!","Leza Ronahiyê!","Light Speed!"],"fivesFrame":["5️⃣","Beşli Radar!","Radara Pêncan!","Fives Radar!"],"tensFrame":["🔟","Onlu Radar!","Radara Dehan!","Tens Radar!"],"chipGuess":["👀","Uzay Hafızası!","Bîra Fezayê!","Space Memory!"],"rodBack":["🔄","Hafıza Şimşeği!","Birûska Bîrê!","Memory Flash!"],"estimateCount":["🎯","Galaktik Tahmin!","Texmîna Galaktîk!","Galactic Guess!"],"doubleTensFrame":["🔟🔟","Çift Onlu Radar!","Radara Cot-Dehan!","Double Tens Radar!"],"lessMoreEqual":["⚖️","Kozmik Terazi!","Mêzîna Kozmîk!","Cosmic Balance!"],"beforeAfter":["↔️","Yörünge Komşusu!","Cîranê Gerîngehê!","Orbit Neighbors!"],"comparison":["🏆","Gezegen Düellosu!","Dûeloya Gerstêrkan!","Planet Duel!"],"rulerRead":["📏","Cetvel Oku!","Pîvanê Bixwîne!","Read the Ruler!"],"lengthCompare":["📐","Uzunluk Dedektifi!","Dedektîfê Dirêjahiyê!","Length Detective!"],"fiveMore":["🖐️","5 Yıldız Skalası!","Skala 5 Stêrkan!","Five-Star Scale!"],"ordering":["📊","Yörünge Sırala!","Gerîngehê Rêz Bike!","Orbit Order!"],"numberLineEstimate":["📍","Galaktik Konum!","Cihê Galaktîk!","Galactic Position!"],"nlPlacement":["🎯","Yörüngeye Yerleştir!","Li Gerîngehê Bi Cî Bike!","Place It in Orbit!"],"numberLine":["🔍","Kayıp Kapsül!","Kapsula Winda!","Lost Capsule!"],"lengthGuess":["📏","Gizli Nebula!","Nebula Veşartî!","Hidden Nebula!"],"makeFive":["✋","5 Yıldız Taşı Topla!","5 Kevirên Stêrkan Berhev Bike!","Collect 5 Star Stones!"],"partWhole":["🧩","Parça-Bütün Puzzle!","Pazila Perçe-Giştî!","Part-Whole Puzzle!"],"makeTen":["🎯","10 Yıldız Taşı Topla!","10 Kevirên Stêrkan Berhev Bike!","Collect 10 Star Stones!"],"spaceKitchen":["🧪","Uzay Mutfağı!","Metbexa Fezayê!","Space Kitchen!"],"numbersInNumbers":["🔢","Sayı Galaksisi!","Galaksiya Hejmaran!","Number Galaxy!"],"rodSplit":["✂️","İkili Görev!","Peywira Cot!","Duo Mission!"],"bundleTens":["📦","Onluk Nebula!","Nebula Dehekan!","Tens Nebula!"],"placeValue":["🏛️","Katman Keşfet!","Qatê Keşf Bike!","Explore the Layers!"],"composeNumber":["🧱","Gezegen Oluştur!","Gerstêrk Çêbike!","Build a Planet!"],"expandForm":["🔭","Galaktik Açılım!","Vekirina Galaktîk!","Galactic Expansion!"],"addChips":["➕","Yıldız Taşı Birleştir!","Kevirên Stêrkan Yek Bike!","Join Star Stones!"],"countOnAdd":["🔢","Büyükten Say!","Ji Mezin Bijmêre!","Start Big, Count On!"],"addition":["🧮","Güç Birleştir!","Hêzê Yek Bike!","Combine Powers!"],"wpAdd":["📡","Toplama Problemi","Pirsgirêka Zêdekirinê","Addition Problem"],"wpSchema":["🧭","Hangi Şema?","Kîjan Şema?","Which Schema?"],"calendarRead":["📅","Takvim Yolcusu!","Rêwiyê Salnameyê!","Calendar Traveler!"],"removeChips":["➖","Yıldız Taşı Ayır!","Kevirên Stêrkan Veqetîne!","Take Away Star Stones!"],"difference":["🔍","Mesafe Ölç!","Dûrahiyê Bipîve!","Measure the Distance!"],"subtraction":["🧮","Enerji Ayır!","Enerjiyê Veqetîne!","Split the Energy!"],"inversePractice":["🔄","Ters Düşün!","Berevajî Bifikire!","Think in Reverse!"],"wpSub":["📡","Çıkarma Problemi","Pirsgirêka Kemkirinê","Subtraction Problem"],"wpCompare":["📡","Karşılaştırma Problemi","Pirsgirêka Berhevdanê","Comparison Problem"],"coinCount":["🛒","Uzay Marketi!","Bazara Fezayê!","Space Market!"],"equalShare":["🍕","Galaktik Paylaşım!","Parvekirina Galaktîk!","Galactic Sharing!"],"groupCount":["👥","Filo Grupla!","Filoyê Kom Bike!","Group the Fleet!"],"repeatAdd":["🔁","Galaktik Tekrar!","Dubarekirina Galaktîk!","Galactic Repeat!"],"multiplyVisual":["✖️","Çarpım Gücü!","Hêza Carkirinê!","Multiplying Power!"],"fractionPart":["🍕","Kesir Parçası!","Parçeya Kesrê!","Fraction Piece!"],"halfDouble":["✂️","Bölün-İkilen!","Nîvkirin-Ducarkirin!","Half It, Double It!"],"arrayDots":["📐","Yıldız Dizisi!","Rêza Stêrkan!","Star Array!"],"timesTable":["🧠","Strateji Ustası!","Hostayê Stratejiyê!","Strategy Master!"],"divisionBasic":["➗","Bölme Ustası!","Hostayê Parkirinê!","Division Master!"],"mulDivInverse":["🔄","Ters Bağlantı!","Girêdana Berevajî!","Reverse Link!"],"katConcept":["🔢","Kaç Kat?","Çend Car?","How Many Times?"],"wpMul":["📡","Çarpma Problemi","Pirsgirêka Carkirinê","Multiplication Problem"],"wpDiv":["📡","Bölme Problemi","Pirsgirêka Parkirinê","Division Problem"],"shapeCorners":["🔺","Şekil Dedektifi!","Detektîfê Şêweyan!","Shape Detective!"],"pictograph":["📊","Şekil Grafiği!","Grafika Şêweyan!","Picture Graph!"],"patternAB":["🔄","Galaktik Desen!","Şêweya Galaktîk!","Galactic Pattern!"],"patternTranslate":["🔀","Desen Çevirmen!","Wergêrê Şêweyê!","Pattern Translator!"],"growingPattern":["📈","Büyüyen Desen!","Şêweya Mezinbûyî!","Growing Pattern!"],"trueFalse":["⚖️","Denklem Dedektifi!","Detektîfê Hevkêşeyê!","Equation Detective!"],"spaceBalance":["⚖️","Uzay Terazisi!","Mêzîna Fezayê!","Space Balance!"],"missingNumber":["❓","Kayıp Yıldız!","Stêrka Winda!","Lost Star!"]};
const modeName = (m) => { const r = MODES[m]; return r ? `${r[0]} ${tt(r[1], r[2], r[3])}` : ''; };
const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);
function lastSeenText(iso) {
  if (!iso) return '';
  const d0 = new Date(iso); if (isNaN(d0)) return '';
  const days = Math.round((new Date(dayKey() + 'T12:00:00') - new Date(dayKey(d0) + 'T12:00:00')) / 864e5);
  if (days <= 0) return tt('bugün', 'îro', 'today');
  if (days === 1) return tt('dün', 'duh', 'yesterday');
  return tt(`${days} gün önce`, `${days} roj berê`, `${days} days ago`);
}
function todayPlan(ns) {
  try {
    const g = JSON.parse(localStorage.getItem(`ds_daymission_${ns}`) || 'null');
    if (!g || g.date !== dayKey()) return null;
    const total = g.m2 ? 2 : 1, done = (g.done1 ? 1 : 0) + (g.m2 && g.done2 ? 1 : 0);
    return { total, done };
  } catch { return null; }
}
const label = (text) => h('div', { style: { fontSize: 11.5, fontWeight: 900, letterSpacing: 1.6, textTransform: 'uppercase', color: C.text.secondary, margin: '0 4px 8px' }, children: text });
const line = (text) => h('span', { style: { display: 'block', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.94)', lineHeight: 1.45, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: text });

function setAdultRole(role) { try { localStorage.setItem('galaksay_adult_role', role); } catch { /* depolama kapalı */ } }
function takeLockedNote() { try { const v = sessionStorage.getItem('gs_locked'); sessionStorage.removeItem('gs_locked'); return v === '1'; } catch { return false; } }

function Title({ kids, lang, onLang, onResume, onCaptains, onNew, onAdult, onAdultRole, account, onSignOut }) {
  const [locked] = React.useState(takeLockedNote);
  const [confirmOut, setConfirmOut] = React.useState(false);
  const last = kids[0] || null;
  const resume = last ? getResumeInfo(last.ns) : null;
  const plan = last ? todayPlan(last.ns) : null;
  const langs = { tr: 'TR · Türkçe', ku: 'KU · Kurmancî', en: 'EN · English' };
  const lp = resume && resume.lastPlayed;
  const adultTile = (testid, role, icon, title, desc) => hs('button', { type: 'button', className: 'gs-tap', 'data-testid': testid, onClick: () => onAdultRole(role), style: { ...card, display: 'flex', alignItems: 'flex-start', gap: 12, textAlign: 'left', padding: '14px 14px', borderRadius: 16, cursor: 'pointer', fontFamily: F, minHeight: 84 }, children: [
    h('span', { 'aria-hidden': 'true', style: { fontSize: 28, lineHeight: 1, flexShrink: 0 }, children: icon }),
    hs('span', { style: { minWidth: 0 }, children: [
      h('span', { style: { display: 'block', fontSize: 15.5, fontWeight: 900, color: C.text.primary }, children: title }),
      h('span', { style: { display: 'block', marginTop: 3, fontSize: 12.5, lineHeight: 1.4, fontWeight: 600, color: C.text.secondary }, children: desc }),
    ] }),
  ] });
  const steps = [
    hesap() && !(account && account.verified)
      ? ['🔐', tt('Bir yetişkin cihazı kurar', 'Mezinek cîhazê saz dike', 'An adult sets up the device'), tt('E-posta doğrulamalı hesap ve yetişkin şifresi — bir kez', 'Hesabê bi e-nameya piştrastkirî û şîfreya mezinan — carekê', 'E-mail-verified account and adult password — once')]
      : ['🔐', tt('Yetişkin kaptanı ekler', 'Mezin kaptanê zêde dike', 'An adult adds the captain'), tt('Yetişkin şifresiyle; resim, ad ve yaş seçilir', 'Bi şîfreya mezinan; wêne, nav û temen tên hilbijartin', 'With the adult password; pick a picture, name and age')],
    ['⭐', tt('Her gün kısa bir görev', 'Her roj erkeke kurt', 'A short mission every day'), tt('10–15 dakika, haftada 3–4 gün', '10–15 xulek, heftê 3–4 roj', '10–15 minutes, 3–4 days a week')],
    ['🪐', tt('Gezegenleri keşfet', 'Gerstêrkan keşf bike', 'Explore the planets'), tt('Saymadan çarpmaya adım adım', 'Ji jimartinê heta lêkdanê gav bi gav', 'Step by step from counting to multiplying')],
  ];
  return hs('div', { lang, style: page, children: [
    h('style', { children: CSS }),
    h(SpaceBackground, { starCount: 48 }),
    hs('div', { style: col(520), children: [
      h('div', { style: { display: 'flex', justifyContent: 'flex-end' }, children: h('button', { type: 'button', onClick: onLang, 'data-testid': 'title-lang', 'aria-label': tt('Dil değiştir', 'Zimên biguherîne', 'Change language'), style: { ...card, minHeight: 40, padding: '0 14px', borderRadius: 999, color: C.text.primary, fontFamily: F, fontSize: 13, fontWeight: 800, cursor: 'pointer' }, children: '🌐 ' + langs[lang] }) }),
      hs('header', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 'auto', marginBottom: 18, paddingTop: 4 }, children: [
        h('div', { className: 'gs-ship', 'aria-hidden': 'true', style: { fontSize: 46, lineHeight: 1, marginBottom: 6, filter: 'drop-shadow(0 8px 14px rgba(124,58,237,.25))' }, children: '🚀' }),
        h(Logo, { width: 'min(300px, 76vw)' }),
        h('p', { style: { margin: '10px 0 0', fontSize: 16, lineHeight: 1.45, fontWeight: 800, color: C.text.primary }, children: tt('Sayılar Galaksisi seni bekliyor', 'Galaksiya Hejmaran li benda te ye', 'The Number Galaxy is waiting for you') }),
        h('p', { style: { margin: '4px 0 0', fontSize: 13, lineHeight: 1.45, fontWeight: 600, color: C.text.secondary }, children: tt('5–10 yaş için sayı hissi oyunu · Türkçe ve Kurmancî', 'Lîstika hesta hejmaran ji bo 5–10 salî · Tirkî û Kurmancî', 'Number sense game for ages 5–10 · Turkish and Kurmanji') }),
      ] }),

      locked ? h('p', { role: 'status', 'data-testid': 'locked-note', style: { ...card, margin: '0 0 14px', padding: '10px 14px', borderRadius: 14, fontSize: 13, lineHeight: 1.45, fontWeight: 700, color: C.text.primary }, children: tt('🔒 Yetişkin paneli 10 dakika işlem yapılmadığı için güvenlik amacıyla kapatıldı.', '🔒 Panela mezinan ji ber ku 10 xulekan tu kar nehat kirin, ji bo ewlehiyê hat girtin.', '🔒 The adult panel was closed for safety after 10 minutes without activity.') }) : null,
      // ── Çocuklar
      hs('section', { 'aria-label': tt('Çocuklar', 'Zarok', 'Children'), style: { marginBottom: 18 }, children: [
        label('🧒 ' + tt('Çocuklar · Oyna', 'Zarok · Bilîze', 'Children · Play')),
        last
          ? hs('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 }, children: [
            hs('button', { type: 'button', className: 'gs-cta gs-tap', 'data-testid': 'title-resume', onClick: () => onResume(last), 'aria-label': `${tt('Devam et', 'Bidomîne', 'Continue')}: ${last.name}`, style: { display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left', padding: '16px 18px', borderRadius: 22, border: 'none', background: C.gradient.accent, cursor: 'pointer', fontFamily: F }, children: [
              h('span', { style: { width: 62, height: 62, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.22)', fontSize: 36, lineHeight: 1 }, children: last.avatar || '🚀' }),
              hs('span', { style: { flex: 1, minWidth: 0 }, children: [
                h('span', { style: { display: 'block', fontSize: 12.5, fontWeight: 900, color: 'rgba(255,255,255,.9)', letterSpacing: .6, textTransform: 'uppercase' }, children: '▶ ' + tt('Devam et', 'Bidomîne', 'Continue') }),
                h('span', { style: { display: 'block', fontSize: 23, fontWeight: 900, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }, children: last.name }),
                resume && resume.hasProgress
                  ? line(`⭐ ${resume.stars} ${tt('yıldız', 'stêrk', 'stars')} · ${resume.totalGames} ${tt('görev', 'erk', 'missions')}` + (last.lastSeenAt ? ` · ${lastSeenText(last.lastSeenAt)}` : ''))
                  : line(tt('İlk görev seni bekliyor', 'Erka yekem li benda te ye', 'Your first mission is waiting')),
                lp && lp.mode && MODES[lp.mode] ? line(`${tt('Son görev', 'Erka dawî', 'Last mission')}: ${modeName(lp.mode)}${lp.level ? ` · ${tt('Sv.', 'Ast', 'Lv.')} ${lp.level}` : ''}`) : null,
                line(plan ? (plan.done >= plan.total ? `✅ ${tt('Bugünün görevi tamam', 'Erka îro temam e', "Today's mission done")}` : `📅 ${tt('Bugün', 'Îro', 'Today')}: ${plan.done}/${plan.total} ${tt('görev', 'erk', 'missions')}`) : `📅 ${tt('Bugünün görevi hazır', 'Erka îro amade ye', "Today's mission is ready")}`),
              ] }),
              h('span', { 'aria-hidden': 'true', style: { fontSize: 28, color: '#fff', flexShrink: 0 }, children: hasPin(last.ns) ? '🔒' : '›' }),
            ] }),
            hs('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }, children: [
              hs('button', { type: 'button', className: 'gs-tap', 'data-testid': 'title-captains', onClick: onCaptains, style: { ...card, minHeight: 54, borderRadius: 16, cursor: 'pointer', fontFamily: F, fontSize: 15, fontWeight: 800, color: C.text.primary }, children: ['👩‍🚀 ' + tt('Kaptanlar', 'Kaptan', 'Captains'), h('span', { style: { opacity: .65, fontWeight: 700 }, children: ` · ${kids.length}` })] }),
              h('button', { type: 'button', className: 'gs-tap', 'data-testid': 'title-new', onClick: onNew, style: { ...card, minHeight: 54, borderRadius: 16, cursor: 'pointer', fontFamily: F, fontSize: 15, fontWeight: 800, color: C.text.primary }, children: '➕ ' + tt('Yeni Kaptan', 'Kaptanê Nû', 'New Captain') }),
            ] }),
          ] })
          : hs('div', { style: { ...card, borderRadius: 22, padding: '16px 16px 18px' }, children: [
            h('ol', { style: { listStyle: 'none', margin: '0 0 14px', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }, children: steps.map(([ic, t1, t2], i) => hs('li', { key: i, style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [
              h('span', { 'aria-hidden': 'true', style: { width: 40, height: 40, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(124,58,237,.10)', fontSize: 21 }, children: ic }),
              hs('span', { children: [h('span', { style: { display: 'block', fontSize: 15, fontWeight: 900, color: C.text.primary }, children: `${i + 1}. ${t1}` }), h('span', { style: { display: 'block', fontSize: 12.5, fontWeight: 600, color: C.text.secondary }, children: t2 })] }),
            ] })) }),
            h('button', { type: 'button', className: 'gs-cta gs-tap', 'data-testid': 'title-start', onClick: onNew, style: { width: '100%', minHeight: 64, borderRadius: 18, border: 'none', cursor: 'pointer', fontFamily: F, fontSize: 22, fontWeight: 900, color: '#fff', background: C.gradient.accent }, children: '🚀 ' + tt('Yolculuğa Başla', 'Dest bi Rêwîtiyê Bike', 'Start the Journey') }),
            h('p', { style: { margin: '10px 0 0', textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: C.text.secondary }, children: tt('Çocuklar şifre kullanmaz; kaptanı bir yetişkin ekler · ilerleme bu cihazda kalır', 'Zarok şîfre bikar naynin; kaptanê mezinek zêde dike · pêşveçûn li vê cîhazê dimîne', 'Children never use passwords; an adult adds the captain · progress stays on this device') }),
          ] }),
      ] }),

      // ── Yetişkinler
      hs('section', { 'aria-label': tt('Yetişkin girişi', 'Têketina mezinan', 'Adult sign-in'), children: [
        label('🔐 ' + tt('Yetişkin girişi', 'Têketina mezinan', 'Adult sign-in')),
        hs('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }, children: [
          adultTile('title-adult', 'ogretmen', '👩‍🏫', tt('Öğretmen · Uzman', 'Mamoste · Pispor', 'Teacher · Specialist'), tt('Sınıf paneli, gelişim raporları, BEP taslağı ve araştırma verisi', 'Panela polê, raporên pêşveçûnê, pêşnûmeya BEP û daneyên lêkolînê', 'Class panel, progress reports, IEP draft and research data')),
          adultTile('title-parent', 'ebeveyn', '👪', tt('Ebeveyn', 'Dê û bav', 'Parent'), tt('Çocuğunuzun gelişimi, haftalık öneriler, ayarlar ve yedekleme', 'Pêşveçûna zarokê we, pêşniyarên heftane, mîheng û paşek', "Your child's progress, weekly tips, settings and backup")),
        ] }),
        account ? hs('div', { 'data-testid': 'hesap-rozet', style: { ...card, marginTop: 10, padding: '10px 12px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }, children: [
          h('span', { 'aria-hidden': 'true', style: { fontSize: 20 }, children: account.verified ? '✅' : '📧' }),
          hs('span', { style: { flex: 1, minWidth: 0 }, children: [
            h('span', { style: { display: 'block', fontSize: 14, fontWeight: 900, color: C.text.primary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: account.name || account.email }),
            h('span', { style: { display: 'block', fontSize: 12, fontWeight: 700, color: account.verified ? '#047857' : '#B45309' }, children: account.verified ? `${account.email} · ${tt('e-posta doğrulandı', 'e-name piştrast bû', 'e-mail verified')}` : `${account.email} · ${tt('doğrulama bekliyor', 'li benda piştrastkirinê', 'awaiting verification')}` }),
            account.verified ? h('span', { 'data-testid': 'hesap-bagli', style: { display: 'block', fontSize: 12, fontWeight: 700, color: C.text.secondary }, children: `👩‍🚀 ${boundCount(account.email)} ${tt('kaptan bu hesaba bağlı', 'kaptan bi vî hesabî ve girêdayî ne', 'captains linked to this account')}` }) : null,
          ] }),
          h('button', { type: 'button', onClick: () => { if (confirmOut) { setConfirmOut(false); onSignOut(); } else { setConfirmOut(true); setTimeout(() => setConfirmOut(false), 5000); } }, 'data-testid': 'hesap-cikis', style: { ...ghostBtn, minHeight: 40, fontSize: 13, ...(confirmOut ? { background: 'rgba(220,38,38,.10)', color: '#B91C1C' } : {}) }, children: confirmOut ? tt('Emin misiniz?', 'Hûn bawer in?', 'Are you sure?') : tt('Hesaptan çık', 'Ji hesabê derkeve', 'Sign out') }),
        ] }) : null,
        h('p', { style: { margin: '10px 4px 0', fontSize: 12, lineHeight: 1.5, fontWeight: 600, color: C.text.secondary }, children: hesap() ? tt('🔒 Yetişkin paneli e-posta doğrulamalı hesap ister. Çocuklar yetişkin paneline giremez; oyun verileri bu cihazda kalır.', '🔒 Panela mezinan hesabekî bi e-nameya piştrastkirî dixwaze. Zarok nikarin bikevin panela mezinan; daneyên lîstikê li vê cîhazê dimînin.', '🔒 The adult panel requires an e-mail-verified account. Children cannot open it; game data stays on this device.') : tt('🔒 İlk girişte bu cihaz için bir yönetici şifresi oluşturulur. Çocuklar yetişkin paneline giremez; veriler bu cihazda kalır.', '🔒 Di têketina yekem de ji bo vê cîhazê şîfreyeke rêveberiyê tê çêkirin. Zarok nikarin bikevin panela mezinan; dane li vê cîhazê dimînin.', '🔒 On first sign-in an admin password is created for this device. Children cannot open the adult panel; data stays on this device.') }),
      ] }),

      h('nav', { 'aria-label': tt('Bağlantılar', 'Girêdan', 'Links'), style: { marginTop: 22, marginBottom: 'auto', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 16px', fontSize: 12.5, fontWeight: 700 }, children: [
        ['/', tt('Tanıtım', 'Nasandin', 'About')], ['/kilavuz.html', tt('Kılavuz', 'Rêber', 'Guide')], ['/gizlilik.html', tt('Gizlilik', 'Nepenî', 'Privacy')], ['/erisilebilirlik.html', tt('Erişilebilirlik', 'Gihîştin', 'Accessibility')],
      ].map(([href, t]) => h('a', { key: href, href, style: { color: C.text.secondary, textDecoration: 'none', padding: '8px 2px' }, children: t })) }),
    ] }),
  ] });
}

// ── Kaptan listesi ───────────────────────────────────────────────────────────
function Captains({ kids, onPick, onNew, onBack, onAdult }) {
  const lang = getLang();
  React.useEffect(() => { const t = setTimeout(() => speak('Kim oynuyor? Kendi resmine dokun!', 'Kî dilîze? Dest bide wêneyê xwe!', "Who's playing? Tap your picture!"), 400); return () => clearTimeout(t); }, []);
  const cardBase = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px 10px 16px', borderRadius: 16, cursor: 'pointer', fontFamily: F, minHeight: 168 };
  return hs('div', { lang, style: page, children: [
    h('style', { children: CSS }),
    h(SpaceBackground, { starCount: 36 }),
    hs('div', { style: col(620), children: [
      hs('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }, children: [
        h('button', { type: 'button', 'data-testid': 'picker-back', onClick: onBack, style: ghostBtn, children: '← ' + tt('Geri', 'Vegere', 'Back') }),
        h('span', { style: { fontSize: 12, fontWeight: 800, color: C.text.secondary }, children: `👩‍🚀 ${tt('Kaptanlar', 'Kaptan', 'Captains')} · ${kids.length}` }),
      ] }),
      hs('div', { style: { textAlign: 'center', marginBottom: 20, marginTop: 'auto' }, children: [
        h('div', { style: { fontSize: 46, marginBottom: 6, lineHeight: 1 }, children: '🧒' }),
        h('h1', { style: { fontSize: 26, fontWeight: 900, color: C.text.primary, margin: '0 0 4px' }, children: tt('Kim oynuyor?', 'Kî dilîze?', "Who's playing?") }),
        hs('p', { style: { fontSize: 14, color: C.text.secondary, margin: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }, children: [
          tt('Kendi resmine dokun', 'Dest bide wêneyê xwe', 'Tap your picture'),
          speakBtn(() => speak('Kendi resmine dokun!', 'Dest bide wêneyê xwe!', 'Tap your picture!'), tt('Yönergeyi sesli dinle', 'Rêbernameyê bibihîze', 'Listen')),
        ] }),
      ] }),
      hs('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }, children: [
        ...kids.map((c) => {
          const r = getResumeInfo(c.ns);
          return hs('button', { key: c.ns, type: 'button', className: 'gs-tap', 'data-testid': `captain-${c.ns}`, onClick: () => onPick(c), style: { ...cardBase, ...card }, children: [
            h('div', { style: { fontSize: 44, width: 78, height: 78, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(124,58,237,.10)', lineHeight: 1 }, children: c.avatar || '🚀' }),
            h('div', { style: { fontSize: 16, fontWeight: 800, color: C.text.primary, maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: c.name }),
            h('div', { style: { fontSize: 12, fontWeight: 700, color: r && r.hasProgress ? C.accent.primaryLight : C.text.secondary }, children: (r && r.hasProgress ? `▶ ${tt('Devam et', 'Bidomîne', 'Continue')} · ⭐ ${r.stars}` : tt('Yeni başla', 'Nû dest pê bike', 'Start fresh')) + (hasPin(c.ns) ? '  🔒' : '') }),
          ] });
        }),
        hs('button', { key: '__new', type: 'button', className: 'gs-tap', 'data-testid': 'captain-new', onClick: onNew, style: { ...cardBase, border: '2px dashed rgba(124,58,237,.45)', background: 'rgba(255,255,255,.6)' }, children: [
          h('div', { style: { fontSize: 40, width: 78, height: 78, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: C.gradient.accent, lineHeight: 1, color: '#fff', fontWeight: 900 }, children: '＋' }),
          h('div', { style: { fontSize: 16, fontWeight: 800, color: C.text.primary }, children: tt('Yeni Kaptan', 'Kaptanê Nû', 'New Captain') }),
          h('div', { style: { fontSize: 12, fontWeight: 700, color: C.text.secondary }, children: '🚀' }),
        ] }),
      ] }),
      h('div', { style: { marginTop: 'auto' } }),
      h('p', { 'data-testid': 'backup-hint', style: { margin: '22px auto 0', maxWidth: 460, textAlign: 'center', fontSize: 12.5, lineHeight: 1.5, fontWeight: 700, color: C.text.secondary }, children: tt(
        '💾 İlerleme yalnız bu cihazda saklanır. Yedek almak ya da başka cihaza taşımak için: Öğretmen · Ebeveyn → Ayarlar → Verileri dışa aktar.',
        '💾 Pêşveçûn tenê li vê cîhazê tê tomarkirin. Ji bo paşekê: Mamoste · Dê û bav → Mîheng → Daneyan derxe.',
        '💾 Progress is stored only on this device. To back up or move it: Teacher · Parent → Settings → Export data.') }),
      h('div', { style: { marginTop: 8, textAlign: 'center' }, children: h('button', { type: 'button', 'data-testid': 'picker-adult', onClick: onAdult, style: { minHeight: 44, padding: '0 14px', borderRadius: 12, border: 'none', background: 'transparent', color: C.text.secondary, fontFamily: F, fontSize: 13.5, fontWeight: 800, cursor: 'pointer' }, children: '👩‍🏫 ' + tt('Öğretmen · Ebeveyn', 'Mamoste · Dê û bav', 'Teacher · Parent') }) }),
    ] }),
  ] });
}

// ── Kaptan oluşturma (3 adım) ────────────────────────────────────────────────
function Create({ onDone, onCancel }) {
  const [step, setStep] = React.useState(0);
  const [avatar, setAvatar] = React.useState('');
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const V = [
    ['Kaptanını seç! Beğendiğin resme dokun.', 'Kaptanê xwe hilbijêre! Dest bide wêneyê ku tu jê hez dikî.', 'Choose your captain! Tap the picture you like.'],
    ['Adın ne? Adını yaz ya da boş bırak.', 'Navê te çi ye? Navê xwe binivîse an vala bihêle.', "What's your name? Type it or leave it empty."],
    ['Kaç yaşındasın? Sana uyan gezegene dokun.', 'Tu çend salî yî? Dest bide gerstêrka ku li te tê.', 'How old are you? Tap the planet that fits you.'],
  ];
  const T = [
    tt('Kaptanını seç', 'Kaptanê xwe hilbijêre', 'Choose your captain'),
    tt('Adın ne?', 'Navê te çi ye?', "What's your name?"),
    tt('Kaç yaşındasın?', 'Tu çend salî yî?', 'How old are you?'),
  ];
  React.useEffect(() => { const t = setTimeout(() => speak(...V[step]), 350); return () => { clearTimeout(t); try { window.speechSynthesis.cancel(); } catch { /* yok */ } }; }, [step]); // eslint-disable-line
  const canNext = step === 0 ? !!avatar : step === 1 ? true : !!age;
  const fallbackName = tt('Kaptan', 'Kaptan', 'Captain');
  const finish = () => {
    if (saving) return;
    setSaving(true);
    const n = name.trim().slice(0, NAME_MAX) || fallbackName;
    const rec = addChild({ name: n, avatar, ageGroup: age });
    speak(`Hoş geldin Kaptan ${n}! Yolculuk başlıyor.`, `Bi xêr hatî Kaptan ${n}! Rêwîtî dest pê dike.`, `Welcome, Captain ${n}! The journey begins.`);
    onDone(rec);
  };
  const next = () => { if (!canNext) return; if (step < 2) setStep(step + 1); else finish(); };
  const back = () => { if (step === 0) onCancel(); else setStep(step - 1); };
  const opt = (sel) => ({ borderRadius: 20, cursor: 'pointer', fontFamily: F, color: sel ? '#fff' : C.text.primary, border: sel ? `3px solid ${C.accent.primary}` : `2px solid ${C.surface.divider}`, background: sel ? C.gradient.accent : C.surface.card, boxShadow: sel ? '0 10px 30px rgba(124,58,237,.18)' : card.boxShadow, transform: sel ? 'scale(1.04)' : 'none', transition: 'transform .12s ease, background .12s ease' });
  const dots = h('div', { 'aria-hidden': 'true', style: { display: 'flex', gap: 8, justifyContent: 'center' }, children: [0, 1, 2].map((i) => h('span', { key: i, style: { width: i === step ? 26 : 10, height: 10, borderRadius: 999, background: i <= step ? C.accent.primary : 'rgba(30,27,75,.14)', transition: 'width .2s ease' } })) });
  const preview = hs('div', { style: { ...card, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 14px 8px 8px', borderRadius: 999 }, children: [
    h('span', { style: { width: 40, height: 40, borderRadius: '50%', background: 'rgba(124,58,237,.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, lineHeight: 1 }, children: avatar || '❔' }),
    h('span', { style: { fontSize: 15, fontWeight: 800, color: C.text.primary }, children: name.trim() || fallbackName }),
  ] });
  let body;
  if (step === 0) {
    body = h('div', { role: 'radiogroup', 'aria-label': T[0], style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: 10, maxWidth: 430, margin: '0 auto' }, children: AVATARS.map((a) => h('button', { key: a, type: 'button', role: 'radio', 'aria-checked': avatar === a, 'data-testid': `avatar-${a}`, onClick: () => setAvatar(a), style: { ...opt(avatar === a), aspectRatio: '1 / 1', minHeight: 84, fontSize: 44, lineHeight: 1 }, children: a })) });
  } else if (step === 1) {
    body = hs('div', { style: { textAlign: 'center' }, children: [
      h('input', { type: 'text', value: name, maxLength: NAME_MAX, autoFocus: true, autoComplete: 'off', placeholder: fallbackName, 'aria-label': T[1], 'data-testid': 'create-name', onChange: (ev) => setName(ev.target.value), onKeyDown: (ev) => { if (ev.key === 'Enter') next(); }, style: { ...card, width: '100%', boxSizing: 'border-box', fontSize: 30, fontWeight: 900, textAlign: 'center', padding: '16px 18px', borderRadius: 20, border: '2px solid rgba(124,58,237,.35)', color: C.text.primary, fontFamily: F, outline: 'none' } }),
      h('p', { style: { marginTop: 12, fontSize: 14, color: C.text.secondary }, children: tt('Takma ad da olur; bu ad cihazda kalır.', 'Nasnav jî dibe; ev nav di cîhazê de dimîne.', 'A nickname is fine; the name stays on this device.') }),
    ] });
  } else {
    body = h('div', { role: 'radiogroup', 'aria-label': T[2], style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }, children: AGES.map((g) => hs('button', { key: g.key, type: 'button', role: 'radio', 'aria-checked': age === g.key, 'data-testid': `age-${g.key}`, onClick: () => { setAge(g.key); speak(`${g.tr[0]}, ${g.tr[1]}`, `${g.ku[0]}, ${g.ku[1]}`, `${g.en[0]}, ${g.en[1]}`); }, style: { ...opt(age === g.key), padding: '18px 10px', minHeight: 132, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }, children: [
      h('span', { style: { fontSize: 44, lineHeight: 1 }, children: g.icon }),
      h('span', { style: { fontSize: 17, fontWeight: 900 }, children: ageText(g, 0) }),
      h('span', { style: { fontSize: 13, fontWeight: 700, opacity: .8 }, children: ageText(g, 1) }),
    ] })) });
  }
  return hs('div', { style: page, children: [
    h('style', { children: CSS }),
    h(SpaceBackground, { starCount: 36, showMeteors: false }),
    hs('div', { style: col(520), children: [
      hs('div', { style: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8 }, children: [
        h('button', { type: 'button', 'data-testid': 'create-back', onClick: back, style: { ...ghostBtn, justifySelf: 'start' }, children: '← ' + tt('Geri', 'Vegere', 'Back') }),
        dots,
        h('span', { style: { justifySelf: 'end', fontSize: 12, fontWeight: 800, color: C.text.secondary }, children: tt(`Adım ${step + 1} / 3`, `Gav ${step + 1} / 3`, `Step ${step + 1} / 3`) }),
      ] }),
      hs('div', { style: { textAlign: 'center', margin: '18px 0 14px' }, children: [
        h('div', { style: { fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: C.accent.primaryLight, marginBottom: 4 }, children: tt('Kaptanını oluştur', 'Kaptanê xwe çêke', 'Create your captain') }),
        hs('h1', { style: { margin: 0, fontSize: 27, fontWeight: 900, color: C.text.primary, display: 'inline-flex', alignItems: 'center', gap: 10 }, children: [T[step], speakBtn(() => speak(...V[step]), tt('Yönergeyi sesli dinle', 'Rêbernameyê bibihîze', 'Listen'))] }),
        step > 0 ? h('div', { style: { marginTop: 10 }, children: preview }) : null,
      ] }),
      h('div', { style: { flex: 1, display: 'flex', flexDirection: 'column' }, children: h('div', { style: { marginTop: 'auto', marginBottom: 'auto' }, children: body }) }),
      h('button', { type: 'button', 'data-testid': 'create-next', onClick: next, disabled: !canNext || saving, style: { marginTop: 18, width: '100%', minHeight: 64, borderRadius: 22, border: 'none', fontFamily: F, fontSize: 22, fontWeight: 900, color: canNext ? '#fff' : C.text.tertiary, background: canNext ? C.gradient.success : '#ECE9F7', boxShadow: canNext ? '0 10px 26px rgba(5,150,105,.28)' : 'none', cursor: canNext ? 'pointer' : 'not-allowed' }, children: step < 2 ? `${tt('İleri', 'Pêş', 'Next')} →` : `🚀 ${tt('Hazırım!', 'Ez amade me!', "I'm ready!")}` }),
    ] }),
  ] });
}


// ── Yetişkin hesabı (e-posta doğrulamalı) ───────────────────────────────────
// oyna/galaksay-hesap.js (Firebase Authentication REST) etkinse yetişkin paneli ve yeni kaptan
// oluşturma, bu cihazda doğrulanmış bir yetişkin hesabı ister. Hesap cihazı bir kez kurar; ardından
// cihaz şifresi hızlı kilit olarak kullanılır. Çocuk verisi cihazda kalır; hesaba ad, e-posta ve rol gider.
const hesap = () => (typeof window !== 'undefined' && window.GalakSayHesap && window.GalakSayHesap.active()) ? window.GalakSayHesap : null;
const inputStyle = { width: '100%', boxSizing: 'border-box', height: 50, padding: '0 14px', borderRadius: 14, border: '2px solid rgba(30,27,75,.14)', background: '#fff', color: C.text.primary, fontSize: 16, fontWeight: 600, fontFamily: F, outline: 'none' };
const fieldLabel = (text, htmlFor) => h('label', { htmlFor, style: { display: 'block', fontSize: 13, fontWeight: 800, color: C.text.secondary, margin: '12px 0 6px' }, children: text });
const linkBtn = { border: 'none', background: 'transparent', color: C.accent.primary, fontFamily: F, fontSize: 14, fontWeight: 800, cursor: 'pointer', minHeight: 44, padding: '0 6px' };

// ── Çocuk girişi yetişkine bağlı ─────────────────────────────────────────────
// Çocuklar hesap ya da şifre kullanmaz; kendi resimlerine dokunarak girer. Ancak her kaptanı bir
// yetişkin ekler ve kaptan o yetişkine bağlanır (kayıtta `hesap` alanı):
//   - e-posta hesabı etkinse: doğrulanmış hesap { tur: 'eposta', uid, email, name }
//   - değilse: bu cihazın yetişkin şifresi { tur: 'cihaz' }
// Yeni kaptan için her seferinde yetişkin şifresi istenir. Cihaz ilk kez kurulurken bağsız kaptanlar
// kuran yetişkine bağlanır. Bağ yalnız bu cihazda tutulur; çocuk verisi hesaba gönderilmez.
function bindInfo() {
  const H = hesap(); const s = H && H.isVerifiedAdult() ? H.session() : null;
  return s ? { tur: 'eposta', email: s.email, name: s.name || '', at: new Date().toISOString() } : { tur: 'cihaz', at: new Date().toISOString() };
}
if (typeof window !== 'undefined') window.__gsBindInfo = () => bindInfo(); // yetişkin panelindeki çocuk formu da kullanır
function bindChild(ns) { try { updateChild(ns, { hesap: bindInfo() }); } catch { /* kayıt güncellenemedi */ } }
function bindUnbound() {
  let n = 0;
  try { const info = bindInfo(); for (const c of listChildren()) if (!c.hesap || (info.tur === 'eposta' && c.hesap.tur === 'cihaz')) { updateChild(c.ns, { hesap: info }); n += 1; } } catch { /* yok */ }
  return n;
}
function boundCount(email) { try { return listChildren().filter((c) => c.hesap && c.hesap.tur === 'eposta' && c.hesap.email === email).length; } catch { return 0; } }
const weakPin = (v) => /^(\d)\1+$/.test(v) || ['1234', '4321', '0123', '123456', '654321', '12345678'].includes(v) || /^(19[5-9]\d|20[0-2]\d)$/.test(v);
const lockText = (ms) => { const sec = Math.max(1, Math.ceil(ms / 1000)); return tt(`Çok fazla deneme. ${sec} sn bekleyin.`, `Gelek hewl. ${sec} çirke bisekinin.`, `Too many attempts. Wait ${sec} s.`); };

function AdultCheck({ role, onDone, onCancel }) {
  const [mode, setMode] = React.useState(() => (hasAdminPin() ? 'gir' : 'olustur'));
  const [p1, setP1] = React.useState('');
  const [p2, setP2] = React.useState('');
  const [code, setCode] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const parent = role === 'ebeveyn';
  const digits = (v) => v.replace(/\D/g, '').slice(0, 8);
  const pinInput = (id, value, set, testid, label) => [
    fieldLabel(label, id),
    h('input', { id, type: 'password', inputMode: 'numeric', autoComplete: 'off', value, onChange: (e) => set(digits(e.target.value)), 'data-testid': testid, style: { ...inputStyle, letterSpacing: 6, textAlign: 'center', fontSize: 22 } }),
  ];
  const submit = async () => {
    if (busy) return; setErr('');
    if (mode === 'gir') {
      const left = lockLeft('admin'); if (left > 0) { setErr(lockText(left)); return; }
      setBusy(true);
      const ok = await verifyAdminPin(p1);
      setBusy(false);
      if (ok) { clearFails('admin'); onDone(); return; }
      const lk = noteFail('admin'); setP1('');
      setErr(lk > 0 ? lockText(lk) : tt('Şifre yanlış.', 'Şîfre çewt e.', 'Incorrect password.'));
      return;
    }
    if (p1.length < 4) { setErr(tt('Şifre 4-8 rakam olmalı (6 ve üzeri önerilir).', 'Divê şîfre 4-8 jimare be (6 û zêdetir tê pêşniyarkirin).', 'The password must be 4-8 digits (6 or more recommended).')); return; }
    if (weakPin(p1)) { setErr(tt('Bu şifre çok kolay tahmin edilir (tekrar, sıra veya yıl). Başka bir şifre seçin.', 'Ev şîfre pir hêsan tê texmînkirin. Şîfreyeke din hilbijêrin.', 'This password is too easy to guess (repeat, sequence or year). Choose another.')); return; }
    if (p1 !== p2) { setErr(tt('Şifreler uyuşmuyor.', 'Şîfre li hev nayên.', 'The passwords do not match.')); return; }
    setBusy(true);
    await setAdminPin(p1);
    const rc = await makeRecoveryCode();
    setBusy(false);
    if (rc) { setCode(rc); setMode('kod'); } else onDone();
  };
  const title = mode === 'kod' ? tt('Kurtarma kodunuz', 'Koda we ya vegerandinê', 'Your recovery code')
    : mode === 'olustur' ? (parent ? tt('Ebeveyn Şifresi Oluştur', 'Şîfreya Dê û Bav Çêke', 'Create Parent Password') : tt('Yönetici Şifresi Oluştur', 'Şîfreya Rêveber Çêke', 'Create Admin Password'))
      : tt('Yetişkin Onayı', 'Pejirandina Mezinan', 'Adult Confirmation');
  const intro = mode === 'kod' ? tt('Şifrenizi unutursanız bu kod tek çıkış yoludur. Fotoğrafını çekin ya da güvenli bir yere not edin; bir daha gösterilmez.', 'Heke hûn şîfreya xwe ji bîr bikin, ev kod tekane rê ye. Wêneyê wê bikişînin an li cihekî ewle binivîsin; careke din nayê nîşandan.', 'If you forget your password, this code is the only way back. Take a photo or note it somewhere safe; it will not be shown again.')
    : mode === 'olustur' ? tt('Yeni kaptanı bir yetişkin ekler ve kaptan ona bağlanır. Önce bu cihaz için 4–8 rakamlı bir yetişkin şifresi belirleyin. Çocuklar bu şifreyi kullanmaz; kendi resimlerine dokunarak oynar.', 'Kaptanê nû ji aliyê mezinekî ve tê zêdekirin û bi wî ve tê girêdan. Pêşî ji bo vê cîhazê şîfreyeke mezinan a 4–8 jimareyî diyar bikin. Zarok vê şîfreyê bikar naynin; bi destdayîna wêneyê xwe dilîzin.', 'A new captain is added by an adult and linked to them. First set a 4–8 digit adult password for this device. Children never use it; they play by tapping their picture.')
      : tt('Yeni kaptanı bir yetişkin ekler. Devam etmek için bu cihazın yetişkin şifresini girin.', 'Kaptanê nû ji aliyê mezinekî ve tê zêdekirin. Ji bo domandinê şîfreya mezinan a vê cîhazê binivîsin.', "A new captain is added by an adult. Enter this device's adult password to continue.");
  const primaryBtn = (text, onClick, testid) => h('button', { type: 'submit', 'data-testid': testid, onClick: (ev) => { ev.preventDefault(); onClick(); }, disabled: busy, style: { width: '100%', minHeight: 54, marginTop: 16, borderRadius: 16, border: 'none', cursor: busy ? 'default' : 'pointer', fontFamily: F, fontSize: 17, fontWeight: 900, color: '#fff', background: busy ? '#A5A0C8' : C.gradient.accent }, children: busy ? tt('Lütfen bekleyin…', 'Ji kerema xwe bisekinin…', 'Please wait…') : text });
  let body;
  if (mode === 'kod') {
    body = hs('div', { style: { textAlign: 'center' }, children: [
      h('div', { 'data-testid': 'kurtarma-kodu', style: { margin: '10px 0 4px', padding: '16px 10px', borderRadius: 16, border: '2px dashed rgba(124,58,237,.45)', background: 'rgba(124,58,237,.06)', fontSize: 30, fontWeight: 900, letterSpacing: 3, color: C.text.primary, fontVariantNumeric: 'tabular-nums' }, children: code }),
      primaryBtn(tt('Kodu kaydettim, devam et', 'Min kod tomar kir, bidomîne', 'I saved the code, continue'), onDone, 'kod-kaydettim'),
    ] });
  } else {
    body = hs('form', { onSubmit: (e) => { e.preventDefault(); submit(); }, children: [
      ...pinInput('yetiskin-sifre', p1, setP1, 'yetiskin-sifre', mode === 'gir' ? tt('Yetişkin şifresi', 'Şîfreya mezinan', 'Adult password') : tt('Yeni şifre (4-8 rakam, 6+ önerilir)', 'Şîfreya nû (4-8 jimare, 6+ tê pêşniyarkirin)', 'New password (4-8 digits, 6+ recommended)')),
      ...(mode === 'olustur' ? pinInput('yetiskin-sifre2', p2, setP2, 'yetiskin-sifre2', tt('Şifreyi tekrar girin', 'Şîfreyê dîsa binivîsin', 'Enter it again')) : []),
      primaryBtn(mode === 'gir' ? tt('Onayla', 'Bipejirîne', 'Confirm') : tt('Şifre oluştur', 'Şîfre çêke', 'Create password'), submit, 'yetiskin-onayla'),
      mode === 'gir' ? h('p', { style: { margin: '10px 0 0', textAlign: 'center', fontSize: 12.5, lineHeight: 1.5, fontWeight: 600, color: C.text.secondary }, children: tt('Şifrenizi unuttuysanız: Öğretmen · Ebeveyn girişi → Şifremi unuttum (kurtarma kodu ile).', 'Heke we şîfre ji bîr kiriye: têketina Mamoste · Dê û bav → Min şîfre ji bîr kir (bi koda vegerandinê).', 'Forgot it? Teacher · Parent sign-in → I forgot my password (with the recovery code).') }) : null,
    ] });
  }
  return hs('div', { lang: getLang(), style: page, children: [
    h('style', { children: CSS }),
    h(SpaceBackground, { starCount: 30 }),
    hs('div', { style: col(460), children: [
      h('div', { style: { marginBottom: 10 }, children: mode === 'kod' ? null : h('button', { type: 'button', onClick: onCancel, 'data-testid': 'yetiskin-geri', style: ghostBtn, children: '← ' + tt('Geri', 'Vegere', 'Back') }) }),
      hs('main', { style: { ...card, borderRadius: 24, padding: '20px 18px 18px', marginTop: 'auto' }, children: [
        hs('header', { style: { textAlign: 'center', marginBottom: 8 }, children: [
          h('div', { 'aria-hidden': 'true', style: { fontSize: 40, lineHeight: 1, marginBottom: 6 }, children: mode === 'kod' ? '🗝️' : '🔐' }),
          h('h1', { style: { fontSize: 22, fontWeight: 900, color: C.text.primary, margin: '0 0 6px' }, children: title }),
          h('p', { style: { fontSize: 13.5, lineHeight: 1.5, fontWeight: 600, color: C.text.secondary, margin: 0 }, children: intro }),
        ] }),
        err ? h('div', { role: 'alert', 'data-testid': 'yetiskin-hata', style: { margin: '10px 0 0', padding: '10px 12px', borderRadius: 12, fontSize: 13.5, fontWeight: 700, background: 'rgba(220,38,38,.08)', color: '#B91C1C' }, children: err }) : null,
        body,
      ] }),
      h('div', { 'aria-hidden': 'true', style: { marginBottom: 'auto', height: 10 } }),
    ] }),
  ] });
}

function Account({ role, purpose, onDone, onCancel }) {
  const H = hesap();
  const sess = H ? H.session() : null;
  const [tab, setTab] = React.useState(sess && !sess.verified ? 'dogrula' : (sess ? 'giris' : 'kayit'));
  const [r, setR] = React.useState(role === 'ebeveyn' ? 'ebeveyn' : 'ogretmen');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState(sess ? sess.email : '');
  const [pw, setPw] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [consent, setConsent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState(null); // { kind: 'err' | 'ok', text }
  const [cool, setCool] = React.useState(0);
  React.useEffect(() => { if (cool <= 0) return undefined; const t = setTimeout(() => setCool(cool - 1), 1000); return () => clearTimeout(t); }, [cool]);
  const run = async (fn) => { setBusy(true); setMsg(null); try { await fn(); } catch (e) { setMsg({ kind: 'err', text: (e && e.message) || String(e) }); } setBusy(false); };
  const finish = () => { try { localStorage.setItem('galaksay_adult_role', r); } catch { /* yok */ } H.setRole(r); onDone(); };
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  const submitSignUp = () => run(async () => {
    if (!name.trim()) throw new Error(tt('Adınızı yazın.', 'Navê xwe binivîsin.', 'Enter your name.'));
    if (!emailOk) throw new Error(H.errorText('INVALID_EMAIL'));
    if (pw.length < 8) throw new Error(H.errorText('WEAK_PASSWORD'));
    if (!consent) throw new Error(tt('Devam etmek için aydınlatma metnini onaylayın.', 'Ji bo domandinê nivîsa agahdariyê bipejirînin.', 'Please accept the privacy notice to continue.'));
    await H.signUp({ email, password: pw, name, role: r });
    setPw(''); setTab('dogrula'); setCool(30);
  });
  const submitSignIn = () => run(async () => {
    if (!emailOk) throw new Error(H.errorText('INVALID_EMAIL'));
    const s = await H.signIn({ email, password: pw, role: r });
    setPw('');
    if (s && s.verified) finish(); else { setTab('dogrula'); }
  });
  const checkVerified = () => run(async () => {
    const ok = await H.refreshVerified();
    if (ok) finish();
    else setMsg({ kind: 'err', text: tt('E-posta henüz doğrulanmadı. Gelen kutunuzdaki bağlantıya tıklayın; göremiyorsanız "Gereksiz" klasörüne bakın.', 'E-name hê nehatiye piştrastkirin. Li girêdana di sindoqa xwe de bitikînin; heke nabînin, li peldanka "Spam" binêrin.', 'The e-mail is not verified yet. Click the link in your inbox; if you cannot see it, check the spam folder.') });
  });
  const resend = () => run(async () => { await H.resendVerification(); setCool(30); setMsg({ kind: 'ok', text: tt('Doğrulama bağlantısı yeniden gönderildi.', 'Girêdana piştrastkirinê dîsa hat şandin.', 'The verification link was sent again.') }); });
  const sendReset = () => run(async () => { if (!emailOk) throw new Error(H.errorText('INVALID_EMAIL')); await H.resetPassword(email); setMsg({ kind: 'ok', text: tt('Şifre sıfırlama bağlantısı e-postanıza gönderildi.', 'Girêdana nûkirina şîfreyê ji e-nameya we re hat şandin.', 'A password reset link was sent to your e-mail.') }); });

  const roleTitle = r === 'ebeveyn' ? tt('Ebeveyn Hesabı', 'Hesabê Dê û Bav', 'Parent Account') : tt('Öğretmen · Uzman Hesabı', 'Hesabê Mamoste · Pispor', 'Teacher · Specialist Account');
  const why = purpose === 'kurulum'
    ? tt('Yeni kaptanı bir yetişkin oluşturur. Önce hesabınızla bu cihazı kurun; sonra çocuklar kendi resimlerine dokunarak oynar.', 'Kaptanê nû ji aliyê mezinekî ve tê çêkirin. Pêşî bi hesabê xwe vê cîhazê saz bikin; paşê zarok bi destdayîna wêneyê xwe dilîzin.', 'A new captain is created by an adult. First set up this device with your account; then children play by tapping their picture.')
    : tt('Hesabınız sizi tanımlar ve bu cihazı güvenle kurar. Çocukların oyun verisi bu cihazda kalır; hesaba yalnız ad, e-posta ve rol bilgisi gider.', 'Hesabê we we dide nasîn û vê cîhazê bi ewlehî saz dike. Daneyên lîstikê yên zarokan li vê cîhazê dimînin; tenê nav, e-name û rol diçin hesabê.', "Your account identifies you and sets up this device securely. Children's game data stays on this device; only your name, e-mail and role go to the account.");

  const tabBtn = (id, text) => h('button', { type: 'button', role: 'tab', 'aria-selected': tab === id, 'data-testid': `hesap-sekme-${id}`, onClick: () => { setTab(id); setMsg(null); }, style: { flex: 1, minHeight: 44, borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: F, fontSize: 15, fontWeight: 900, background: tab === id ? '#fff' : 'transparent', color: tab === id ? C.text.primary : C.text.secondary, boxShadow: tab === id ? '0 2px 8px rgba(30,27,75,.12)' : 'none' }, children: text });
  const primary = (text, onClick, testid, disabled) => h('button', { type: 'submit', 'data-testid': testid, onClick: (ev) => { ev.preventDefault(); onClick(); }, disabled: busy || disabled, style: { width: '100%', minHeight: 54, marginTop: 16, borderRadius: 16, border: 'none', cursor: busy || disabled ? 'default' : 'pointer', fontFamily: F, fontSize: 17, fontWeight: 900, color: '#fff', background: busy || disabled ? '#A5A0C8' : C.gradient.accent }, children: busy ? tt('Lütfen bekleyin…', 'Ji kerema xwe bisekinin…', 'Please wait…') : text });
  const pwField = (id, autoc) => hs('div', { style: { position: 'relative' }, children: [
    h('input', { id, type: show ? 'text' : 'password', value: pw, onChange: (e) => setPw(e.target.value), autoComplete: autoc, 'data-testid': 'hesap-sifre', style: { ...inputStyle, paddingRight: 52 } }),
    h('button', { type: 'button', onClick: () => setShow(!show), 'aria-label': show ? tt('Şifreyi gizle', 'Şîfreyê veşêre', 'Hide password') : tt('Şifreyi göster', 'Şîfreyê nîşan bide', 'Show password'), style: { position: 'absolute', right: 4, top: 3, width: 44, height: 44, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18 }, children: show ? '🙈' : '👁️' }),
  ] });

  let body;
  if (!H) {
    body = null;
  } else if (tab === 'dogrula') {
    const s = H.session();
    body = hs('div', { style: { textAlign: 'center' }, children: [
      h('div', { 'aria-hidden': 'true', style: { fontSize: 46, margin: '4px 0 6px' }, children: '📧' }),
      h('h2', { style: { fontSize: 20, fontWeight: 900, color: C.text.primary, margin: '0 0 8px' }, children: tt('E-postanızı doğrulayın', 'E-nameya xwe piştrast bikin', 'Verify your e-mail') }),
      h('p', { style: { fontSize: 14.5, lineHeight: 1.55, color: C.text.secondary, margin: 0 }, children: tt(`${s ? s.email : ''} adresine bir doğrulama bağlantısı gönderdik. Bağlantıya tıkladıktan sonra aşağıdaki düğmeye dokunun.`, `Me girêdaneke piştrastkirinê ji ${s ? s.email : ''} re şand. Piştî ku hûn li girêdanê bitikînin, li bişkoka jêrîn bidin.`, `We sent a verification link to ${s ? s.email : ''}. After clicking the link, tap the button below.`) }),
      primary(tt('Doğruladım, devam et', 'Min piştrast kir, bidomîne', "I've verified, continue"), checkVerified, 'hesap-dogruladim'),
      hs('div', { style: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 4, marginTop: 8 }, children: [
        h('button', { type: 'button', style: { ...linkBtn, opacity: cool > 0 ? .5 : 1 }, disabled: cool > 0 || busy, onClick: resend, 'data-testid': 'hesap-yeniden', children: cool > 0 ? tt(`Yeniden gönder (${cool})`, `Dîsa bişîne (${cool})`, `Resend (${cool})`) : tt('Bağlantıyı yeniden gönder', 'Girêdanê dîsa bişîne', 'Resend the link') }),
        h('button', { type: 'button', style: linkBtn, onClick: () => { H.signOut(); setTab('kayit'); setMsg(null); }, children: tt('Farklı e-posta kullan', 'E-nameyeke din bikar bîne', 'Use a different e-mail') }),
      ] }),
    ] });
  } else if (tab === 'sifre') {
    body = hs('form', { onSubmit: (e) => { e.preventDefault(); sendReset(); }, children: [
      h('p', { style: { fontSize: 14.5, lineHeight: 1.55, color: C.text.secondary, margin: '0 0 4px' }, children: tt('Hesabınızın e-posta adresini yazın; şifre sıfırlama bağlantısı gönderelim.', 'Navnîşana e-nameya hesabê xwe binivîsin; em ê girêdana nûkirina şîfreyê bişînin.', "Enter your account's e-mail address and we'll send a reset link.") }),
      fieldLabel(tt('E-posta', 'E-name', 'E-mail'), 'hesap-eposta'),
      h('input', { id: 'hesap-eposta', type: 'email', inputMode: 'email', autoComplete: 'email', value: email, onChange: (e) => setEmail(e.target.value), 'data-testid': 'hesap-eposta', style: inputStyle }),
      primary(tt('Sıfırlama bağlantısı gönder', 'Girêdana nûkirinê bişîne', 'Send reset link'), sendReset, 'hesap-sifirla'),
      h('div', { style: { textAlign: 'center', marginTop: 6 }, children: h('button', { type: 'button', style: linkBtn, onClick: () => { setTab('giris'); setMsg(null); }, children: '← ' + tt('Girişe dön', 'Vegere têketinê', 'Back to sign-in') }) }),
    ] });
  } else {
    const isUp = tab === 'kayit';
    body = hs('form', { onSubmit: (e) => { e.preventDefault(); (isUp ? submitSignUp : submitSignIn)(); }, children: [
      hs('div', { role: 'tablist', style: { display: 'flex', gap: 4, padding: 4, borderRadius: 14, background: 'rgba(30,27,75,.06)', marginBottom: 4 }, children: [tabBtn('kayit', tt('Hesap oluştur', 'Hesab çêke', 'Create account')), tabBtn('giris', tt('Giriş yap', 'Têkeve', 'Sign in'))] }),
      isUp ? fieldLabel(tt('Adınız soyadınız', 'Nav û paşnavê we', 'Full name'), 'hesap-ad') : null,
      isUp ? h('input', { id: 'hesap-ad', type: 'text', autoComplete: 'name', value: name, maxLength: 60, onChange: (e) => setName(e.target.value), 'data-testid': 'hesap-ad', style: inputStyle }) : null,
      fieldLabel(tt('E-posta', 'E-name', 'E-mail'), 'hesap-eposta'),
      h('input', { id: 'hesap-eposta', type: 'email', inputMode: 'email', autoComplete: 'email', value: email, onChange: (e) => setEmail(e.target.value), 'data-testid': 'hesap-eposta', style: inputStyle }),
      fieldLabel(isUp ? tt('Şifre (en az 8 karakter)', 'Şîfre (herî kêm 8 tîp)', 'Password (at least 8 characters)') : tt('Şifre', 'Şîfre', 'Password'), 'hesap-sifre'),
      pwField('hesap-sifre', isUp ? 'new-password' : 'current-password'),
      isUp ? hs('div', { role: 'radiogroup', 'aria-label': tt('Rol', 'Rol', 'Role'), style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }, children: [['ogretmen', '👩‍🏫', tt('Öğretmen · Uzman', 'Mamoste · Pispor', 'Teacher · Specialist')], ['ebeveyn', '👪', tt('Ebeveyn', 'Dê û bav', 'Parent')]].map(([k, ic, lb]) => h('button', { key: k, type: 'button', role: 'radio', 'aria-checked': r === k, 'data-testid': `hesap-rol-${k}`, onClick: () => setR(k), style: { minHeight: 48, borderRadius: 12, cursor: 'pointer', fontFamily: F, fontSize: 14, fontWeight: 800, border: r === k ? `2px solid ${C.accent.primary}` : '2px solid rgba(30,27,75,.12)', background: r === k ? 'rgba(124,58,237,.08)' : '#fff', color: C.text.primary }, children: `${ic} ${lb}` })) }) : null,
      isUp ? hs('label', { style: { display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 14, fontSize: 13, lineHeight: 1.5, fontWeight: 600, color: C.text.secondary, cursor: 'pointer' }, children: [
        h('input', { type: 'checkbox', checked: consent, onChange: (e) => setConsent(e.target.checked), 'data-testid': 'hesap-onay', style: { width: 22, height: 22, marginTop: 1, flexShrink: 0, accentColor: C.accent.primary } }),
        hs('span', { children: [h('a', { href: '/gizlilik.html', target: '_blank', rel: 'noopener', style: { color: C.accent.primary, fontWeight: 800 }, children: tt('Aydınlatma metnini', 'Nivîsa agahdariyê', 'The privacy notice') }), tt(' okudum. Ad, e-posta ve rol bilgimin hesap için işlenmesini kabul ediyorum.', ' min xwend. Ez qebûl dikim ku nav, e-name û rola min ji bo hesabê were bikaranîn.', ' — I have read it and agree that my name, e-mail and role are processed for the account.')] }),
      ] }) : null,
      primary(isUp ? tt('Hesap oluştur', 'Hesab çêke', 'Create account') : tt('Giriş yap', 'Têkeve', 'Sign in'), isUp ? submitSignUp : submitSignIn, isUp ? 'hesap-olustur' : 'hesap-giris'),
      !isUp ? h('div', { style: { textAlign: 'center', marginTop: 6 }, children: h('button', { type: 'button', style: linkBtn, onClick: () => { setTab('sifre'); setMsg(null); }, 'data-testid': 'hesap-unuttum', children: tt('Şifremi unuttum', 'Min şîfre ji bîr kir', 'I forgot my password') }) }) : null,
    ] });
  }

  return hs('div', { lang: getLang(), style: page, children: [
    h('style', { children: CSS }),
    h(SpaceBackground, { starCount: 30 }),
    hs('div', { style: col(460), children: [
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }, children: h('button', { type: 'button', onClick: onCancel, 'data-testid': 'hesap-geri', style: ghostBtn, children: '← ' + tt('Geri', 'Vegere', 'Back') }) }),
      hs('main', { style: { ...card, borderRadius: 24, padding: '20px 18px 18px', marginTop: 'auto' }, children: [
        hs('header', { style: { textAlign: 'center', marginBottom: 12 }, children: [
          h(Logo, { width: 'min(200px, 56vw)' }),
          h('h1', { style: { fontSize: 22, fontWeight: 900, color: C.text.primary, margin: '10px 0 6px' }, children: roleTitle }),
          h('p', { style: { fontSize: 13.5, lineHeight: 1.5, fontWeight: 600, color: C.text.secondary, margin: 0 }, children: why }),
        ] }),
        msg ? h('div', { role: msg.kind === 'err' ? 'alert' : 'status', 'data-testid': 'hesap-mesaj', style: { margin: '10px 0 4px', padding: '10px 12px', borderRadius: 12, fontSize: 13.5, lineHeight: 1.45, fontWeight: 700, background: msg.kind === 'err' ? 'rgba(220,38,38,.08)' : 'rgba(5,150,105,.10)', color: msg.kind === 'err' ? '#B91C1C' : '#047857' }, children: msg.text }) : null,
        body,
      ] }),
      h('p', { style: { margin: '14px 6px 0', marginBottom: 'auto', textAlign: 'center', fontSize: 12, lineHeight: 1.5, fontWeight: 600, color: C.text.secondary }, children: tt('🔒 Hesap e-posta doğrulamasıyla açılır. Bu cihazda ayrıca kısa bir yetişkin şifresi hızlı kilit olarak kullanılır.', '🔒 Hesab bi piştrastkirina e-nameyê vedibe. Li vê cîhazê şîfreyeke mezinan a kurt jî wek kilîda bilez tê bikaranîn.', '🔒 The account opens after e-mail verification. On this device a short adult password also works as a quick lock.') }),
    ] }),
  ] });
}

// ── Kök bileşen (App'in çağırdığı varsayılan dışa aktarım) ───────────────────
function CaptainEntry({ onStudent, onAdult, onPick }) {
  const [view, setView] = React.useState(() => {
    try {
      const g = new URLSearchParams(window.location.search).get('giris');
      if (g === 'kaptanlar' && listChildren().length) return 'captains';
    } catch { /* URL okunamadı */ }
    return 'title';
  });
  React.useEffect(() => {
    try {
      const u = new URL(window.location.href), g = u.searchParams.get('giris');
      if (!g) return;
      u.searchParams.delete('giris');
      window.history.replaceState(null, '', u.pathname + (u.search || '') + u.hash);
      if (g === 'ogretmen' || g === 'ebeveyn') adultRole(g);
      else if (g === 'yeni') newCaptain();
      else if (g === 'yetiskin') adultRole((() => { try { return localStorage.getItem('galaksay_adult_role') || 'ogretmen'; } catch { return 'ogretmen'; } })());
    } catch { /* geçmiş API yok */ }
  }, []);
  const [lang, setLang] = React.useState(() => getLang());
  const [kids, setKids] = React.useState(() => listChildren());
  React.useEffect(() => { const t = setTimeout(() => speak('Sayılar Galaksisi seni bekliyor!', 'Galaksiya Hejmaran li benda te ye!', 'The Number Galaxy is waiting for you!'), 600); return () => clearTimeout(t); }, []);
  const start = (c) => {
    if (!c) return;
    if (hasPin(c.ns) || typeof onPick !== 'function') { onStudent && onStudent(); return; } // şifreli profil: mevcut seçici (kilit korumalı)
    speak(`Merhaba ${c.name}!`, `Silav ${c.name}!`, `Hi ${c.name}!`);
    try { touchChild(c.ns); } catch { /* yok */ }
    onPick(c);
  };
  const [account, setAccount] = React.useState(() => { const H = hesap(); return H ? H.session() : null; });
  const [gate, setGate] = React.useState(null); // { role, purpose, then }
  const needAccount = () => { const H = hesap(); return !!H && !H.isVerifiedAdult(); };
  const adultRole = (role) => {
    setAdultRole(role);
    if (needAccount()) { setGate({ role, purpose: 'panel', then: 'adult' }); setView('account'); return; }
    onAdult && onAdult();
  };
  const lastRole = () => { try { return localStorage.getItem('galaksay_adult_role') || 'ebeveyn'; } catch { return 'ebeveyn'; } };
  const newCaptain = () => {
    const role = lastRole();
    setGate({ role, purpose: 'kurulum', then: 'create' });
    setView(needAccount() ? 'account' : 'adultcheck');
  };
  const signOut = () => { const H = hesap(); if (H) H.signOut(); setAccount(null); };
  const cycleLang = () => {
    const nx = lang === 'tr' ? 'ku' : lang === 'ku' ? 'en' : 'tr';
    try { localStorage.setItem('ds_lang', nx); } catch { /* depolama kapalı */ }
    setLang(nx);
  };
  const cancelGate = () => { setGate(null); setAccount(hesap() ? hesap().session() : null); setView(kids.length ? 'title' : 'title'); };
  if (view === 'account' && gate) {
    return h(Account, { role: gate.role, purpose: gate.purpose, onCancel: cancelGate, onDone: () => {
      bindUnbound(); setKids(listChildren()); setAccount(hesap() ? hesap().session() : null);
      if (gate.then === 'create') setView('adultcheck'); else { setGate(null); setView('title'); onAdult && onAdult(); }
    } });
  }
  if (view === 'adultcheck' && gate) {
    return h(AdultCheck, { role: gate.role, onCancel: cancelGate, onDone: () => { bindUnbound(); setKids(listChildren()); setGate(null); setView('create'); } });
  }
  if (view === 'create') {
    return h(Create, { onCancel: () => setView(kids.length ? 'captains' : 'title'), onDone: (rec) => { if (rec && rec.ns) bindChild(rec.ns); setKids(listChildren()); start(rec); } });
  }
  if (view === 'captains') {
    return h(Captains, { kids, onPick: start, onNew: newCaptain, onBack: () => setView('title'), onAdult: () => adultRole((() => { try { return localStorage.getItem('galaksay_adult_role') || 'ogretmen'; } catch { return 'ogretmen'; } })()) });
  }
  return h(Title, { kids, lang, onLang: cycleLang, onResume: start, onCaptains: () => setView('captains'), onNew: newCaptain, onAdult, onAdultRole: adultRole, account, onSignOut: signOut });
}

export { CaptainEntry as default };
