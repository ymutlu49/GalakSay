/* GalakSay — canlı sürüme eklenen çalışma zamanı davranışları (okunur kaynak, derleme gerektirmez).
 *
 * oyna/index.html bu dosyayı oyun paketinden ÖNCE yükler.
 *
 * 2) Yetişkin rolüne göre dil (window.__gsRoleText)
 *    Giriş merkezinde "Öğretmen · Uzman" ya da "Ebeveyn" seçilir (localStorage: galaksay_adult_role).
 *    Yetişkin girişi ve yönetim paneli metinlerini buradaki tablodan alır: ebeveyn "Çocuklarım",
 *    "Ebeveyn şifresi" görür; öğretmen "Öğrencilerim", "Yönetici şifresi". Ortak düzeltmeler: "Cihaz
 *    Hesabı" yerine "şifre" (çevrimiçi hesap yoktur; şifre yalnız bu cihazda, şifrelenmiş saklanır).
 *
 * 0) Seslendirme yalnız istenince: otomatik okuma yok; 🔊 / 🗣️ ya da "dinle" düğmesine basılınca konuşur.
 *    İstisna: çocuk kaydında yetişkinin açtığı "Sesli yönergeler" ya da "Okuma güçlüğü" bayrağı.
 *
 * 3) Göreve ve sorunun sayılarına uygun yanılgı ipucu (window.__gsTip)
 * 4) Göreve uygun maskot öyküsü (window.__gsStory)
 * 5) Kurmancî oyunda Türkçe kalan maskot cümleleri (window.__gsKuFix)
 * 6) Şık yazısının düğmeye sığması (aynı sorudaki şıklar aynı oranda)
 *    Gerekçeler: docs/MADDE_GORUNTU_DENETIMI.md
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

  // ── Seslendirme yalnız istenince (27 Eyl 2026) ─────────────────────────────
  // Oyun ve giriş ekranları kendiliğinden konuşmaz. Konuşma yalnız bir "dinle" denetimine basıldıktan
  // sonraki kısa pencerede çalışır: 🔊 / 🗣️ simgeli düğmeler ya da etiketi dinle/listen/guhdarî/sesli olanlar.
  // Başka bir yere dokunulunca pencere kapanır. Susturulan konuşmanın başlangıç/bitiş olayları tahmini
  // sürede tetiklenir; konuşmaya bağlı animasyonlar ve sıralı akışlar bozulmaz.
  var LISTEN_RE = /(🔊|🗣|🔈|🔉)/;
  var LABEL_RE = /(dinle|listen|guhdar|sesli|seslendir|read aloud|bixwîne)/i;
  var allowUntil = 0;
  function isListenControl(el) {
    var c = el && el.closest ? el.closest('button,[role="button"],a') : null;
    if (!c) return false;
    var lab = (c.getAttribute('aria-label') || '') + ' ' + (c.getAttribute('title') || '');
    var txt = (c.textContent || '').trim();
    return LISTEN_RE.test(txt) && txt.length <= 24 || LISTEN_RE.test(lab) || LABEL_RE.test(lab);
  }
  function onTap(ev) { allowUntil = isListenControl(ev.target) ? Date.now() + 15000 : 0; }
  window.addEventListener('pointerdown', onTap, true);
  window.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') onTap(ev); }, true);
  // İstisna: yetişkinin çocuk kaydında açtığı "Okuma güçlüğü" (sesli-öncelikli mod) ya da "Sesli yönergeler"
  // bayrağı. Oynayan çocuk, en son seçilen (lastSeenAt en yeni) kaptandır; bayrağı açıksa konuşma
  // kendiliğinden çalışır. Okumayan okul öncesi çocuğu ve okuma güçlüğü olan çocuk yönergeye ulaşabilsin.
  var autoCache = { t: 0, v: false };
  function autoReadOn() {
    var now = Date.now();
    if (now - autoCache.t < 1500) return autoCache.v;
    var v = false;
    try {
      var list = JSON.parse(localStorage.getItem('galaksay_local_children') || '[]'), cur = null;
      for (var i = 0; i < list.length; i++) if (list[i] && (!cur || String(list[i].lastSeenAt || '') > String(cur.lastSeenAt || ''))) cur = list[i];
      v = !!(cur && cur.lastSeenAt && cur.flags && (cur.flags.reading || cur.flags.autoRead));
    } catch (e) { v = false; }
    autoCache = { t: now, v: v };
    return v;
  }
  window.__gsSpeechAllowed = function () { return Date.now() < allowUntil || autoReadOn(); };

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
  function silent(u) {
    var words = String(u.text || '').trim().split(/\s+/).filter(Boolean).length;
    var ms = Math.min(6000, 250 + (words * 330) / (u.rate || 1));
    pending.push(setTimeout(function () { fire(u, 'start'); }, 0));
    pending.push(setTimeout(function () { fire(u, 'end'); }, ms));
  }

  ss.speak = function (u) {
    if (!u) return undefined;
    if (u.volume === 0) return nativeSpeak(u);            // ses motoru ısınması
    if (Date.now() >= allowUntil && !autoReadOn()) return silent(u); // istenmeyen (otomatik) konuşma
    if (currentLang() !== 'ku') return nativeSpeak(u);
    var voice = kurmanjiVoice();                           // Kurmancî: yalnız Kurmancî sesle
    if (voice) {
      try { u.voice = voice; u.lang = voice.lang; } catch (e) { /* ses atanamadı */ }
      return nativeSpeak(u);
    }
    return silent(u);
  };

  ss.cancel = function () {
    for (var i = 0; i < pending.length; i++) clearTimeout(pending[i]);
    pending = [];
    return nativeCancel();
  };

  // Kayıtlı ses dosyaları (HTMLAudio ile seslendirme) da aynı kurala uyar; efekt sesleri (Web Audio) etkilenmez.
  try {
    var AP = window.HTMLAudioElement && window.HTMLAudioElement.prototype;
    if (AP && AP.play) {
      var nativePlay = AP.play;
      AP.play = function () {
        var src = String(this.currentSrc || this.src || '');
        if (/\/audio\/(ku|tr|en)\//.test(src) && Date.now() >= allowUntil && !autoReadOn()) { var a = this; setTimeout(function () { try { a.dispatchEvent(new Event('ended')); } catch (e) { /* yok */ } }, 50); return Promise.resolve(); }
        return nativePlay.apply(this, arguments);
      };
    }
  } catch (e) { /* ses nesnesi yok */ }
})();

/* ── 2) Yetişkin rolüne göre dil ─────────────────────────────────────────── */
(function () {
  'use strict';
  var KEY = 'galaksay_adult_role';
  function role() { try { return localStorage.getItem(KEY) === 'ebeveyn' ? 'ebeveyn' : 'ogretmen'; } catch (e) { return 'ogretmen'; } }
  // Anahtar: paketteki Türkçe metin. Değer: { ogretmen: [tr, ku, en], ebeveyn: [tr, ku, en] }; biri yoksa paket metni kalır.
  var T = {
    // ── Yetişkin girişi
    'Cihaz Hesabı Oluştur': {
      ogretmen: ['Yönetici Şifresi Oluştur', 'Şîfreya Rêveber Çêke', 'Create Admin Password'],
      ebeveyn: ['Ebeveyn Şifresi Oluştur', 'Şîfreya Dê û Bav Çêke', 'Create Parent Password'] },
    'Bu cihaz için bir yönetici şifresi belirleyin. Çocuklar bu paneli açamaz.': {
      ogretmen: ['Yetişkin paneli için 4–8 rakamlı bir şifre belirleyin. Hesap ya da e-posta gerekmez: şifre yalnız bu cihazda, şifrelenmiş olarak saklanır. Çocuklar paneli açamaz.',
                 'Ji bo panela mezinan şîfreyeke 4–8 jimareyî diyar bikin. Hesab an e-name ne pêwîst e: şîfre tenê li vê cîhazê, bi şîfrekirî tê parastin. Zarok nikarin panelê vekin.',
                 'Set a 4–8 digit password for the adult panel. No account or e-mail is needed: the password is stored encrypted on this device only. Children cannot open the panel.'],
      ebeveyn: ['Çocuğunuzun gelişimini görmek ve ayarları yönetmek için 4–8 rakamlı bir şifre belirleyin. Hesap ya da e-posta gerekmez: şifre yalnız bu cihazda, şifrelenmiş olarak saklanır. Çocuklar paneli açamaz.',
                'Ji bo dîtina pêşveçûna zarokê xwe û birêvebirina mîhengan şîfreyeke 4–8 jimareyî diyar bikin. Hesab an e-name ne pêwîst e: şîfre tenê li vê cîhazê, bi şîfrekirî tê parastin. Zarok nikarin panelê vekin.',
                "Set a 4–8 digit password to see your child's progress and manage settings. No account or e-mail is needed: the password is stored encrypted on this device only. Children cannot open the panel."] },
    'Yönetim paneline girmek için yönetici şifrenizi girin.': {
      ebeveyn: ['Ebeveyn paneline girmek için şifrenizi girin.', 'Ji bo ketina panela dê û bav şîfreya xwe binivîsin.', 'Enter your password to open the parent panel.'] },
    'Yeni yönetici şifresi (4-8 rakam, 6+ önerilir)': {
      ebeveyn: ['Yeni şifre (4-8 rakam, 6+ önerilir)', 'Şîfreya nû (4-8 jimare, 6+ tê pêşniyarkirin)', 'New password (4-8 digits, 6+ recommended)'] },
    'Yönetici şifresi': { ebeveyn: ['Ebeveyn şifresi', 'Şîfreya dê û bav', 'Parent password'] },
    'Yönetim Paneline Gir': { ebeveyn: ['Ebeveyn Paneline Gir', 'Bikeve Panela Dê û Bav', 'Open Parent Panel'] },
    '🔑 Yönetici girişi': { ebeveyn: ['🔑 Ebeveyn girişi', '🔑 Têketina dê û bav', '🔑 Parent sign-in'] },
    '← Yönetici girişi': { ebeveyn: ['← Ebeveyn girişi', '← Têketina dê û bav', '← Parent sign-in'] },
    '🧒 Öğrenci Girişi': {
      ogretmen: ['🧒 Çocuk girişi', '🧒 Têketina zarokan', '🧒 Child entry'],
      ebeveyn: ['🧒 Çocuk girişi', '🧒 Têketina zarokan', '🧒 Child entry'] },
    '← Kullanıcı girişi': {
      ogretmen: ['👤 Kayıtlı öğretmen / uzman girişi', '👤 Têketina mamoste / pisporê tomarkirî', '👤 Registered teacher / specialist sign-in'],
      ebeveyn: ['👤 Başka bir yetişkin olarak gir', '👤 Wek mezinekî din bikeve', '👤 Sign in as another adult'] },
    'Yönetici şifresini unutursanız bu kurtarma kodu tek çıkış yoludur. Yazdırın veya güvenli bir yere not edin; bir daha gösterilmez.': {
      ebeveyn: ['Şifrenizi unutursanız bu kurtarma kodu tek çıkış yoludur. Fotoğrafını çekin ya da güvenli bir yere not edin; bir daha gösterilmez.',
                'Heke hûn şîfreya xwe ji bîr bikin, ev koda vegerandinê tekane rê ye. Wêneyê wê bikişînin an li cihekî ewle binivîsin; careke din nayê nîşandan.',
                'If you forget your password, this recovery code is the only way back. Take a photo or note it somewhere safe; it will not be shown again.'] },
    'Bu cihazda henüz hesap yok. Başlamak için önce bir': {
      ogretmen: ['Bu cihazda henüz kayıtlı kullanıcı yok. Önce bir', 'Li vê cîhazê hê bikarhênerê tomarkirî tune. Pêşî', 'There are no registered users on this device yet. First create an'] },
    ' oluşturun — sonra öğrenci ve (isterseniz) öğretmen hesapları ekleyebilirsiniz.': {
      ogretmen: [' oluşturun; ardından öğrenci profilleri ve (isterseniz) başka öğretmenler için kullanıcı ekleyebilirsiniz.', ' çêkin; paşê hûn dikarin profîlên xwendekaran û (heke bixwazin) bikarhêneran ji bo mamosteyên din zêde bikin.', '; then you can add student profiles and (optionally) users for other teachers.'] },
    '🔑 İlk hesabı oluştur': {
      ogretmen: ['🔑 Yönetici şifresi oluştur', '🔑 Şîfreya rêveber çêke', '🔑 Create admin password'],
      ebeveyn: ['🔑 Ebeveyn şifresi oluştur', '🔑 Şîfreya dê û bav çêke', '🔑 Create parent password'] },
    // ── Yönetim paneli (yalnız ebeveyn dili değişir)
    '💻 Yerel Yönetim': { ebeveyn: ['👪 Ebeveyn Paneli', '👪 Panela Dê û Bav', '👪 Parent Panel'] },
    'Cihazdaki öğrenci profilleri (çevrimdışı)': { ebeveyn: ['Bu cihazdaki çocuk profilleri (çevrimdışı)', 'Profîlên zarokan ên vê cîhazê (bêînternet)', 'Child profiles on this device (offline)'] },
    '👥 Öğrencilerim (bu cihaz)': { ebeveyn: ['👥 Çocuklarım (bu cihaz)', '👥 Zarokên min (ev cîhaz)', '👥 My Children (this device)'] },
    'Öğrenci Seç & Oynat': { ebeveyn: ['Çocuk Seç & Oynat', 'Zarokekî Hilbijêre û Bilîze', 'Pick a Child & Play'] },
    'Yeni Öğrenci': { ebeveyn: ['Yeni Çocuk', 'Zarokê Nû', 'New Child'] },
    '➕ Yeni Öğrenci Ekle': { ebeveyn: ['➕ Yeni Çocuk Ekle', '➕ Zarokekî Nû Zêde Bike', '➕ Add New Child'] },
    'Sınıf İlerlemesi': { ebeveyn: ['Gelişim Özeti', 'Kurteya Pêşveçûnê', 'Progress Overview'] },
    'Öğrenciler': { ebeveyn: ['Çocuklar', 'Zarok', 'Children'] },
    'Bir öğrenciye dokun, oyunu başlat • ✏️ ile düzenle': { ebeveyn: ['Bir çocuğa dokun, oyunu başlat • ✏️ ile düzenle', 'Li zarokekî bide, lîstikê dest pê bike • bi ✏️ serrast bike', 'Tap a child to start the game • edit with ✏️'] },
    'Öğrencilerin — çevrimdışı çalışır': { ebeveyn: ['Çocukların — çevrimdışı çalışır', 'Zarokên te — bêînternet jî dixebite', 'Your children — works offline'] },
  };
  // Numap notu yalnız öğretmen/uzman içindir; ebeveyne gösterilmez.
  var HIDE_FOR_PARENT = /^🔬 Numap hesabınız varsa/;
  window.__gsRole = role;
  window.__gsRoleText = function (tr) {
    if (typeof tr !== 'string') return null;
    var r = role();
    if (r === 'ebeveyn' && HIDE_FOR_PARENT.test(tr)) return ['', '', ''];
    var e = T[tr];
    return e ? (e[r] || null) : null;
  };
})();

/* ── 3) Göreve duyarlı ipucu metinleri (window.__gsTip) ──────────────────────
 * Oyunun yanılgı sınıflayıcısı bir yanılgı kimliği döndürür (ör. yon_karistirma, bir_fark) ve ipucu
 * metni tek bir tablodan gelir; metin göreve bakmaz. Görüntü düzeyindeki madde denetimi, bu yüzden
 * "sağdan kaçıncı" sorusunda "daha AZ mı, daha ÇOK mu?" gibi yersiz ipuçları çıktığını gösterdi.
 * Burada soru türüne göre doğru metin verilir; tabloda karşılığı yoksa oyunun kendi metni kalır.
 * Değer: { tr, ku, en }. Anahtar: soru türü → yanılgı kimliği ('*' = o türde her kimlik).
 */
(function () {
  'use strict';
  var T = {
    beforeAfter: {
      bir_fark: { tr: 'Önce = bir eksik, sonra = bir fazla. Soru hangisini istiyor? ⬅️➡️', ku: 'Berê = yek kêm, piştre = yek zêde. Pirs kîjanê dixwaze? ⬅️➡️', en: 'Before = one less, after = one more. Which one does the question ask? ⬅️➡️' },
    },
    makeFive: {
      bir_fark: { tr: 'Çerçevedeki boş kutuları say — 5 için o kadar lazım! ✋', ku: 'Qutiyên vala yên çarçoveyê bijmêre — ji bo 5an ew qas pêwîst e! ✋', en: 'Count the empty boxes in the frame — that many are needed to make 5! ✋' },
    },
    makeTen: {
      bir_fark: { tr: 'Onluk çerçevedeki boş kutuları say — 10 için o kadar lazım! 🔟', ku: 'Qutiyên vala yên çarçoveya dehê bijmêre — ji bo 10an ew qas pêwîst e! 🔟', en: 'Count the empty boxes in the ten-frame — that many are needed to make 10! 🔟' },
    },
    trueFalse: {
      bir_fark: { tr: 'İki tarafı ayrı ayrı hesapla, sonra karşılaştır: ikisi aynı mı? ⚖️', ku: 'Her du aliyan cuda hesab bike, paşê berhev bike: her du wek hev in? ⚖️', en: 'Work out each side separately, then compare: are they the same? ⚖️' },
    },
    difference: {
      islem_karistirma: { tr: "'Kaç fazla?' ve 'fark' toplamayla bulunmaz — iki kapsülü eşleştir, artanları say! 🔗", ku: "'Çend zêdetir?' û 'cudahî' bi zêdekirinê nayên dîtin — her du kapsulan li hev bîne, yên mayî bijmêre! 🔗", en: "'How many more?' and 'difference' are not found by adding — match the two capsules and count the extras! 🔗" },
    },
    lengthGuess: {
      bir_fark: { tr: 'Gizli kapsülü yanındaki kapsülle hizala — kaç taş boyu daha uzun ya da kısa? 🕵️', ku: 'Kapsula veşartî bi ya li kêleka wê re rêz bike — çend kevir dirêjtir an kurttir e? 🕵️', en: 'Line up the hidden capsule with the one beside it — how many stones longer or shorter? 🕵️' },
    },
    ordinalCount: {
      yon_karistirma: { tr: 'Hangi uçtan sayılıyor: SAĞDAN mı, SOLDAN mı? O uçtan başla: birinci, ikinci… 👉', ku: 'Ji kîjan aliyî tê jimartin: ji RASTÊ an ji ÇEPÊ? Ji wî aliyî dest pê bike: yekemîn, duyemîn… 👉', en: 'Which end are we counting from: RIGHT or LEFT? Start there: first, second… 👉' },
      bir_fark: { tr: 'Sırayla say: birinci, ikinci, üçüncü… Her yıldıza bir sıra! ☝️', ku: 'Bi rêzê bijmêre: yekemîn, duyemîn, sêyemîn… Ji her stêrkê re rêzek! ☝️', en: 'Count in order: first, second, third… one place for each star! ☝️' },
      onluk_hatasi: { tr: 'Sırayla say: birinci, ikinci, üçüncü… Her yıldıza bir sıra! ☝️', ku: 'Bi rêzê bijmêre: yekemîn, duyemîn, sêyemîn… Ji her stêrkê re rêzek! ☝️', en: 'Count in order: first, second, third… one place for each star! ☝️' },
    },
  };
  // bir_fark için göreve uygun genel metinler (önceki metin her görevde "her taşa bir sayı" diyordu)
  var BIR_FARK = {
    sayma: { tr: 'Bir fazla ya da bir eksik oldu — tek tek sayarak kontrol et! ☝️', ku: 'Yek zêde an yek kêm bû — yek bi yek bijmêre û kontrol bike! ☝️', en: 'One too many or one too few — count one by one to check! ☝️' },
    islem: { tr: 'Sonuç bir fazla ya da bir eksik çıktı — işlemi adım adım kontrol et! 🔍', ku: 'Encam yek zêde an yek kêm derket — karê gav bi gav kontrol bike! 🔍', en: 'The result is off by one — check the steps one at a time! 🔍' },
    olcme: { tr: 'Bir birim kaydı — başlangıç çizgisinden aralıkları say! 📏', ku: 'Yekîneyek şemitî — ji xeta destpêkê navberan bijmêre! 📏', en: 'Off by one unit — count the spaces from the starting line! 📏' },
    dogru: { tr: 'Bir adım kaydı — bilinen bir sayıdan başla, çentikleri birer birer say! 📍', ku: 'Gavek şemitî — ji hejmareke naskirî dest pê bike, xêzikan yek bi yek bijmêre! 📍', en: 'Off by one step — start from a known number and count the marks one by one! 📍' },
    saat: { tr: 'Kısa ok (akrep) saati, uzun ok (yelkovan) dakikayı gösterir — önce akrebe bak! 🕐', ku: 'Destê kurt saetê, yê dirêj deqeyan nîşan dide — pêşî li destê kurt binêre! 🕐', en: 'The short hand shows the hour, the long hand the minutes — look at the short hand first! 🕐' },
    takvim: { tr: 'Bir gün kaydı — bugünden başla, günleri parmağınla tek tek say! 📅', ku: 'Rojek şemitî — ji îro dest pê bike, rojan bi tiliyê yek bi yek bijmêre! 📅', en: 'Off by one day — start from today and count the days on your fingers! 📅' },
    basamak: { tr: 'Bir fazla ya da bir eksik — onlukları ve birlikleri ayrı ayrı say, sonra birleştir! 🏛️', ku: 'Yek zêde an yek kêm — dehek û yekekan cuda bijmêre, paşê bike yek! 🏛️', en: 'Off by one — count the tens and the ones separately, then put them together! 🏛️' },
    desen: { tr: 'Bir fazla ya da bir eksik — kuralı kontrol et: her adımda kaç artıyor ya da azalıyor? 🔢', ku: 'Yek zêde an yek kêm — rêgezê kontrol bike: her gav çend zêde an kêm dibe? 🔢', en: 'Off by one — check the rule: how much does it change at each step? 🔢' },
    sekil: { tr: 'Köşeleri tek tek işaretle — her köşeye bir sayı! 🔺', ku: 'Goşeyan yek bi yek nîşan bike — ji her goşeyê re hejmarek! 🔺', en: 'Mark the corners one by one — one number per corner! 🔺' },
  };
  var FAM = {
    sekil: ['shapeCorners'],
    olcme: ['rulerRead', 'lengthGuess', 'lengthCompare'],
    dogru: ['numberLineEstimate', 'nlPlacement', 'numberLine'],
    basamak: ['placeValue', 'composeNumber', 'expandForm', 'bundleTens'],
    desen: ['growingPattern', 'patternAB', 'patternTranslate'],
    saat: ['clockRead'],
    takvim: ['calendarRead'],
    islem: ['addition', 'subtraction', 'difference', 'countOnAdd', 'missingNumber', 'makeTen', 'makeFive', 'timesTable', 'multiplyVisual', 'arrayDots', 'repeatAdd', 'equalShare', 'groupCount', 'divisionBasic', 'halfDouble', 'mulDivInverse', 'katConcept', 'inversePractice', 'wpAdd', 'wpSub', 'wpCompare', 'wpMul', 'wpDiv', 'wordProblem', 'coinCount', 'fractionPart', 'spaceBalance', 'numbersInNumbers', 'partWhole', 'rodSplit', 'spaceKitchen'],
  };
  function family(qt) { for (var f in FAM) if (FAM[f].indexOf(qt) >= 0) return f; return 'sayma'; }
  // Sanbil (saymadan tanıma) görevlerinde "tek tek say" ipucu hedefle çelişir: yapıya bakmayı söyle.
  var SANBIL = {
    subitizing: { tr: 'Tek tek sayma — küçük grupları bir bakışta gör: 2 ve 1 = 3! ⚡', ku: 'Yek bi yek nejimêre — komên biçûk bi nêrînekê bibîne: 2 û 1 = 3! ⚡', en: 'Do not count one by one — see small groups at a glance: 2 and 1 = 3! ⚡' },
    fivesFrame: { tr: 'Çerçeveye bak: 5 kutudan kaçı dolu, kaçı boş? Tek tek saymadan bul! 5️⃣', ku: 'Li çarçoveyê binêre: ji 5 qutiyan çend tije, çend vala ne? Bê jimartin bibîne! 5️⃣', en: 'Look at the frame: of the 5 boxes, how many are full, how many empty? Find it without counting! 5️⃣' },
    tensFrame: { tr: 'Çerçeveye bak: üst sıra dolu mu? 5 ve kaç? Tek tek saymadan bul! 🔟', ku: 'Li çarçoveyê binêre: rêza jor tije ye? 5 û çend? Bê jimartin bibîne! 🔟', en: 'Look at the frame: is the top row full? 5 and how many? Find it without counting! 🔟' },
    chipGuess: { tr: 'Gördüğün grupları hatırla: 5 ve kaç? ⚡', ku: 'Komên ku te dîtin bîne bîra xwe: 5 û çend? ⚡', en: 'Remember the groups you saw: 5 and how many? ⚡' },
  };
  SANBIL.doubleTensFrame = SANBIL.tensFrame; SANBIL.rodBack = SANBIL.chipGuess;
  window.__gsTip = function (id, qt, q) {
    if (!id) return null;
    if (id === 'offByOne') return SANBIL[qt] || null;
    if (id === 'bir_fark' && SANBIL[qt]) return SANBIL[qt];
    if (id === 'bir_fark' && qt === 'shapeCorners' && q && q.ask === 'side') return { tr: 'Kenarları tek tek işaretle — her kenara bir sayı! 📐', ku: 'Kêlekan yek bi yek nîşan bike — ji her kêlekê re hejmarek! 📐', en: 'Mark the sides one by one — one number per side! 📐' };
    // Sorunun kendi sayılarıyla örnek ver (sabit "7… 8, 9" ya da "on-dört" örnekleri yanıltıyordu)
    if (id === 'onlu_sayi_okuma' && q && q.number > 10 && q.number < 20) {
      var n = q.number;
      return { tr: 'Önce bir onluk var, sonra birlikler: ' + n + ' = 10 ve ' + (n - 10) + '. 🔟', ku: 'Pêşî dehek heye, paşê yekek: ' + n + ' = 10 û ' + (n - 10) + '. 🔟', en: 'First a ten, then the ones: ' + n + ' = 10 and ' + (n - 10) + '. 🔟' };
    }
    if (id === 'baslangici_sayma' && q) {
      if (qt === 'backwardCount' && q.startNum > 2) {
        var b0 = q.startNum;
        return { tr: b0 + "'i SAYMA — bir gerisinden başla: " + (b0 - 1) + ', ' + (b0 - 2) + '… ⏪', ku: b0 + ' NEJIMÊRE — ji ya berê dest pê bike: ' + (b0 - 1) + ', ' + (b0 - 2) + '… ⏪', en: "Don't count " + b0 + ' — start one back: ' + (b0 - 1) + ', ' + (b0 - 2) + '… ⏪' };
      }
      if (q.bigNum > 0) {
        var g = q.bigNum;
        return { tr: g + "'ı söyle ama SAYMA — sonraki sayıdan başla: " + g + '… ' + (g + 1) + ', ' + (g + 2) + '! 🎯', ku: g + ' bibêje lê NEJIMÊRE — ji hejmara pêş dest pê bike: ' + g + '… ' + (g + 1) + ', ' + (g + 2) + '! 🎯', en: 'Say ' + g + " but don't count it — start from the next: " + g + '… ' + (g + 1) + ', ' + (g + 2) + '! 🎯' };
      }
    }
    if (id === 'bir_fark' && qt === 'counterFromN' && q && typeof q.start === 'number') {
      var fw = q.direction !== 'backward', s1 = q.start + (fw ? 1 : -1), s2 = q.start + (fw ? 2 : -2);
      return { tr: 'Başladığın sayıyı sayma — hemen ' + (fw ? 'sonrakinden' : 'öncekinden') + ' başla: ' + q.start + '… ' + s1 + ', ' + s2 + '! 🎯', ku: 'Hejmara destpêkê nejimêre — ji ya ' + (fw ? 'piştre' : 'berê') + ' dest pê bike: ' + q.start + '… ' + s1 + ', ' + s2 + '! 🎯', en: "Don't count the starting number — begin with the " + (fw ? 'next' : 'previous') + ' one: ' + q.start + '… ' + s1 + ', ' + s2 + '! 🎯' };
    }
    if (id === 'ritim_disi' && q && q.step > 1) {
      var st = q.step, seq = st + ', ' + 2 * st + ', ' + 3 * st;
      return { tr: 'Adım hep ' + st + ': ' + seq + '… Bir önceki sayıya ' + st + ' ekle! 🥁', ku: 'Gav her tim ' + st + ' e: ' + seq + '… ' + st + ' li hejmara berê zêde bike! 🥁', en: 'The step is always ' + st + ': ' + seq + '… add ' + st + ' to the number before! 🥁' };
    }
    var byType = T[qt];
    if (byType && (byType[id] || byType['*'])) return byType[id] || byType['*'];
    if (id === 'bir_fark') return BIR_FARK[family(qt)];
    return null;
  };
})();

/* ── 4) Hata sonrası maskot öyküleri göreve uygun (window.__gsStory) ─────────
 * Maskot, hatadan sonra rastgele bir "ben de hata yapardım" öyküsü anlatıyordu; öykü göreve bakmıyordu
 * (ör. okul öncesi sayma görevinde "toplama ile çıkarmayı karıştırırdım", "7+8"). Öykü sırası oyunun
 * dizisindeki sıradır: 0 işlem işareti · 1 sayı doğrusu · 2 on'a tamamlama · 3 tek tek sayma · 4 genel.
 */
(function () {
  'use strict';
  var FOR = [
    ['addition', 'subtraction', 'missingNumber', 'trueFalse', 'inversePractice', 'spaceBalance', 'wpAdd', 'wpSub', 'wordProblem'],
    ['numberLine', 'nlPlacement', 'numberLineEstimate'],
    ['addition', 'makeTen', 'countOnAdd', 'addChips', 'doubleTensFrame'],
    ['counting', 'quantityMatch', 'matching', 'buildNumber', 'conservation', 'estimateCount', 'chipGuess', 'rodBack', 'subitizing', 'fivesFrame', 'tensFrame', 'backwardCount', 'counterFromN'],
  ];
  window.__gsStory = function (mode, list) {
    if (!list || !list.length) return '';
    var ok = [];
    for (var i = 0; i < FOR.length; i++) if (FOR[i].indexOf(mode) >= 0 && list[i]) ok.push(list[i]);
    ok.push(list[list.length - 1]); // genel öykü her görevde uygun
    return ok[Math.floor(Math.random() * ok.length)];
  };
})();

/* ── 5) Kurmancî oyunda Türkçe kalan maskot cümleleri (window.__gsKuFix) ────
 * Zorlanma sonrası destek cümleleri, "kolay soru geliyor" ve mola önerileri pakette yalnız Türkçe ve
 * İngilizce vardı; Kurmancî oyunda maskot bunları Türkçe söylüyordu. Maskot balonuna giden her metin
 * buradan geçer (paketteki Wt); dil Kurmancî ise bilinen Türkçe cümle Kurmancîsiyle değiştirilir.
 * Dil bilgisi paketin dil ayarından gelir (window.__gsLang).
 */
(function () {
  'use strict';
  var KU = {
    'Kolay soru geliyor — güvenini topla! ✨': 'Pirseke hêsan tê — bi xwe bawer be! ✨',
    'Derin bir nefes al, yavaşça düşün — yapabilirsin! 🧘': 'Bêhneke kûr bistîne, hêdî bifikire — tu dikarî! 🧘',
    'Her usta başlangıçta çıraktı! Devam et! 🌟': 'Her hosta di destpêkê de şagirt bû! Berdewam bike! 🌟',
    'Hatalar beynini güçlendiriyor — bilim böyle diyor! 🧠✨': 'Şaşî mejiyê te xurt dikin — zanist wisa dibêje! 🧠✨',
    'Ben sana inanıyorum! Bir daha dene! 💪': 'Ez bi te bawer im! Careke din biceribîne! 💪',
    'Beynin şu an yeni bağlantılar kuruyor — bu harika! 🧠✨': 'Mejiyê te niha girêdanên nû ava dike — ev pir xweş e! 🧠✨',
    'Zor sorular beynini daha güçlü yapıyor! 💪': 'Pirsên dijwar mejiyê te bihêztir dikin! 💪',
    'Her deneme bir adım ileri! Devam et 🌱': 'Her ceribandin gavek ber bi pêş e! Berdewam bike 🌱',
    'Derin bir nefes al... Hazır olduğunda deneyelim 🧘': 'Bêhneke kûr bistîne... Dema tu amade bî, em biceribînin 🧘',
    'Bu konu zor, ama sen öğreniyorsun! Adım adım gidelim 🐢': 'Ev mijar dijwar e, lê tu fêr dibî! Em gav bi gav biçin 🐢',
    'Hata yapmak çok normal — bilim insanları da böyle öğrenir! 🔬': 'Şaşî kirin pir asayî ye — zanyar jî wisa fêr dibin! 🔬',
    'Yavaşça düşünmek hızlı düşünmekten daha değerli 🌟': 'Hêdî fikirîn ji bilez fikirînê bi qîmettir e 🌟',
    'Bir mola verelim mi? Bazen dinlenmek beyni güçlendirir! ☕': 'Em bêhnvedanekê bidin? Carinan bêhnvedan mejî xurt dike! ☕',
    'Çok uğraşıyorsun — bu harika! Ama zorunda değilsin, istersen farklı bir mod deneyelim 🗺️': 'Tu pir hewl didî — ev pir xweş e! Lê ne mecbûr î; heke tu bixwazî, em lîstikeke din biceribînin 🗺️',
    'Hatalar öğrenmenin en doğal parçası. Beraber daha kolay bir adımdan başlayalım mı? 🤝': 'Şaşî beşa herî xwezayî ya fêrbûnê ne. Em bi hev re ji gaveke hêsantir dest pê bikin? 🤝',
    'Kaptanlar da hata yapar — önemli olan haritaya tekrar bakmak! 🗺️': 'Kaptan jî şaşî dikin — ya girîng ew e ku tu dîsa li nexşeyê binêrî! 🗺️'
  };
  window.__gsKuFix = function (s) {
    if (window.__gsLang !== 'ku' || typeof s !== 'string') return s;
    return Object.prototype.hasOwnProperty.call(KU, s) ? KU[s] : s;
  };
})();

/* ── 6) Şık yazısı düğmeye sığsın ─────────────────────────────────────────────
 * Görüntü denetiminde uzun şık etiketleri telefonda düğmeden taşıyordu (ör. "Takvim Yolcusu"nda
 * "Perşembe", "Çarşamba", "Cumartesi"; Kurmancî etiketler daha da uzun). Yazı düğmeye sığmıyorsa
 * yazı boyu adım adım küçültülür (en fazla %45, en az 11 px). Aynı sorudaki bütün şıklar aynı oranda
 * küçültülür: farklı yazı boyu bir şıkkı öne çıkarıp biçim ipucu vermesin. Şık değişince boy geri gelir.
 */
(function () {
  'use strict';
  if (typeof MutationObserver !== 'function') return;
  function hasText(e) {
    for (var n = e.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.nodeValue.trim()) return true;
    return false;
  }
  function over(b) { return b.scrollWidth > b.clientWidth + 1; }
  function apply(b, k) {
    b.__gsBase.forEach(function (r) { r.e.style.fontSize = k >= 1 ? r.v : Math.max(11, Math.round(r.fs * k)) + 'px'; });
    b.__gsApplied = k;
  }
  function prep(b) {
    var txt = b.textContent;
    if (b.__gsFitText === txt) return;
    if (b.__gsBase) apply(b, 1);
    b.__gsFitText = txt; b.__gsK = 1; b.__gsApplied = 1;
    b.__gsBase = [b].concat([].slice.call(b.querySelectorAll('*'))).filter(hasText)
      .map(function (e) { return { e: e, v: e.style.fontSize, fs: parseFloat(getComputedStyle(e).fontSize) || 16 }; });
    if (!b.clientWidth) return;
    for (var k = 0.94; k >= 0.55 && over(b); k -= 0.06) { apply(b, k); b.__gsK = k; }
  }
  var pending = false;
  function run() {
    pending = false;
    var bs = document.querySelectorAll('.answer-option'), groups = [];
    for (var i = 0; i < bs.length; i++) {
      prep(bs[i]);
      var par = bs[i].parentElement, g = null;
      for (var j = 0; j < groups.length; j++) if (groups[j].p === par) g = groups[j];
      if (!g) groups.push(g = { p: par, b: [] });
      g.b.push(bs[i]);
    }
    groups.forEach(function (g) {
      var k = Math.min.apply(null, g.b.map(function (b) { return b.__gsK; }));
      g.b.forEach(function (b) { if (b.__gsApplied !== k) apply(b, k); });
    });
  }
  function start() {
    new MutationObserver(function () { if (!pending) { pending = true; requestAnimationFrame(run); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();

/* ── 7) NuMap'ten gelişte giriş olmadıysa nedenini göster ──────────────────────
 * Süresi dolmuş SSO bileti ya da GalakSay lisansı olmayan NuMap hesabı. İletiyi
 * uygulama sessionStorage'a yazar (gs_numap_msg); burada bir kez gösterilir.
 */
(function () {
  'use strict';
  function show() {
    var msg = null;
    try { msg = sessionStorage.getItem('gs_numap_msg'); sessionStorage.removeItem('gs_numap_msg'); } catch (e) { /* depolama kapalı */ }
    if (!msg || !document.body || document.getElementById('gs-numap-msg')) return;
    var box = document.createElement('div');
    box.id = 'gs-numap-msg';
    box.setAttribute('role', 'alert');
    box.style.cssText = 'position:fixed;left:50%;top:calc(12px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:2147483000;' +
      'max-width:min(92vw,460px);display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:14px;' +
      'background:#fff7ed;color:#7c2d12;border:1px solid #fdba74;box-shadow:0 8px 24px rgba(0,0,0,.18);font:600 14px/1.45 system-ui,sans-serif';
    var txt = document.createElement('div');
    txt.style.flex = '1';
    txt.textContent = msg;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '✕';
    btn.setAttribute('aria-label', 'Kapat');
    btn.style.cssText = 'border:0;background:transparent;color:inherit;font-size:16px;cursor:pointer;padding:0 2px';
    btn.onclick = function () { box.remove(); };
    box.appendChild(txt); box.appendChild(btn);
    document.body.appendChild(box);
    setTimeout(function () { if (box.parentNode) box.remove(); }, 15000);
  }
  window.addEventListener('gs-numap-msg', show);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
})();

/* ── 8) Service worker kaydı (index.html'deki satır içi betikten taşındı; CSP) ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {}); });
}
