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
