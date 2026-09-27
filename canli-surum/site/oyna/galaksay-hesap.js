/* GalakSay — e-posta doğrulamalı yetişkin hesabı (okunur kaynak, derleme gerektirmez).
 *
 * Sağlayıcı: Firebase Authentication, REST arayüzü (SDK yok, sunucu yok).
 *   Kayıt              accounts:signUp
 *   Ad kaydı           accounts:update
 *   Doğrulama e-postası accounts:sendOobCode (VERIFY_EMAIL)
 *   Giriş              accounts:signInWithPassword
 *   Doğrulama denetimi accounts:lookup (emailVerified)
 *   Şifre sıfırlama    accounts:sendOobCode (PASSWORD_RESET)
 *   Oturum yenileme    securetoken token (refresh_token)
 *
 * Ayar: oyna/hesap-ayar.js içinde window.GALAKSAY_HESAP = { apiKey: '...' }.
 * Anahtar boşsa modül pasiftir; giriş merkezi eski akışla (yalnız cihaz şifresi) çalışır.
 *
 * Model: Hesap yetişkini tanımlar ve cihazı bir kez "kurar". Çocuk verisi yine bu cihazda kalır;
 * hesaba yalnız e-posta, ad ve rol bilgisi gider. Cihazdaki hızlı kilit yetişkin şifresi olarak sürer.
 */
(function () {
  'use strict';
  var STORE = 'galaksay_hesap';
  var ID = 'https://identitytoolkit.googleapis.com/v1/';
  var TOKEN = 'https://securetoken.googleapis.com/v1/token';

  function cfg() { return (window.GALAKSAY_HESAP && window.GALAKSAY_HESAP.apiKey) ? window.GALAKSAY_HESAP : null; }
  function lang() { try { var l = localStorage.getItem('ds_lang'); return l === 'ku' || l === 'en' ? l : 'tr'; } catch (e) { return 'tr'; } }
  function t3(tr, ku, en) { var l = lang(); return l === 'ku' ? ku : l === 'en' ? en : tr; }
  function load() { try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { return null; } }
  function save(s) { try { if (s) localStorage.setItem(STORE, JSON.stringify(s)); else localStorage.removeItem(STORE); } catch (e) { /* depolama kapalı */ } return s; }

  function HesapHatasi(code) { this.name = 'HesapHatasi'; this.code = code; this.message = hataMetni(code); }
  HesapHatasi.prototype = Object.create(Error.prototype);

  function hataMetni(code) {
    var c = String(code || '').split(' ')[0];
    var M = {
      EMAIL_EXISTS: ['Bu e-posta ile zaten bir hesap var. "Giriş yap" sekmesini kullanın.', 'Bi vê e-nameyê hesabek heye. Beşa "Têkeve" bikar bînin.', 'An account with this e-mail already exists. Use "Sign in".'],
      INVALID_LOGIN_CREDENTIALS: ['E-posta ya da şifre hatalı.', 'E-name an şîfre çewt e.', 'Incorrect e-mail or password.'],
      EMAIL_NOT_FOUND: ['Bu e-posta ile kayıtlı hesap bulunamadı.', 'Bi vê e-nameyê hesab nehat dîtin.', 'No account found for this e-mail.'],
      INVALID_PASSWORD: ['E-posta ya da şifre hatalı.', 'E-name an şîfre çewt e.', 'Incorrect e-mail or password.'],
      INVALID_EMAIL: ['Geçerli bir e-posta adresi yazın.', 'Navnîşaneke e-nameyê ya derbasdar binivîsin.', 'Enter a valid e-mail address.'],
      WEAK_PASSWORD: ['Şifre en az 8 karakter olmalı.', 'Divê şîfre herî kêm 8 tîp be.', 'The password must be at least 8 characters.'],
      TOO_MANY_ATTEMPTS_TRY_LATER: ['Çok fazla deneme yapıldı. Birkaç dakika sonra yeniden deneyin.', 'Gelek hewl hatin dayîn. Piştî çend xulekan dîsa biceribînin.', 'Too many attempts. Try again in a few minutes.'],
      USER_DISABLED: ['Bu hesap devre dışı bırakılmış.', 'Ev hesab hatiye rawestandin.', 'This account has been disabled.'],
      OPERATION_NOT_ALLOWED: ['E-posta ile giriş henüz etkinleştirilmemiş.', 'Têketina bi e-nameyê hê ne çalak e.', 'E-mail sign-in is not enabled yet.'],
      NETWORK: ['İnternet bağlantısı yok. Hesap işlemleri için bağlantı gerekir.', 'Girêdana înternetê tune. Ji bo karên hesabê girêdan pêwîst e.', 'No internet connection. Account actions need a connection.'],
      NOT_ACTIVE: ['Hesap sistemi henüz etkin değil.', 'Pergala hesabê hê ne çalak e.', 'The account system is not active yet.'],
      NO_SESSION: ['Önce giriş yapın.', 'Pêşî têkevin.', 'Please sign in first.'],
    };
    var m = M[c] || ['Bir sorun oluştu (' + c + '). Yeniden deneyin.', 'Pirsgirêkek çêbû (' + c + '). Dîsa biceribînin.', 'Something went wrong (' + c + '). Try again.'];
    return t3(m[0], m[1], m[2]);
  }

  function post(url, body, form) {
    var headers = { 'X-Firebase-Locale': lang() === 'en' ? 'en' : 'tr' };
    var payload;
    if (form) { headers['Content-Type'] = 'application/x-www-form-urlencoded'; payload = form; }
    else { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
    return fetch(url, { method: 'POST', headers: headers, body: payload, credentials: 'omit' })
      .catch(function () { throw new HesapHatasi('NETWORK'); })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (!r.ok) throw new HesapHatasi((j && j.error && j.error.message) || ('HTTP_' + r.status));
          return j;
        });
      });
  }
  function idt(method, body) { var c = cfg(); if (!c) return Promise.reject(new HesapHatasi('NOT_ACTIVE')); return post(ID + 'accounts:' + method + '?key=' + encodeURIComponent(c.apiKey), body); }
  function continueUrl() { try { return location.origin + '/oyna/?giris=' + (localStorage.getItem('galaksay_adult_role') === 'ebeveyn' ? 'ebeveyn' : 'ogretmen'); } catch (e) { return location.origin + '/oyna/'; } }

  function withToken(s, j) {
    s.idToken = j.idToken || j.id_token || s.idToken;
    s.refreshToken = j.refreshToken || j.refresh_token || s.refreshToken;
    var ttl = +(j.expiresIn || j.expires_in || 3600);
    s.exp = Date.now() + (ttl - 60) * 1000;
    return s;
  }
  function freshToken() {
    var s = load(), c = cfg();
    if (!s || !s.refreshToken) return Promise.reject(new HesapHatasi('NO_SESSION'));
    if (s.idToken && s.exp && Date.now() < s.exp) return Promise.resolve(s);
    return post(TOKEN + '?key=' + encodeURIComponent(c.apiKey), null, 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(s.refreshToken))
      .then(function (j) { return save(withToken(s, j)); });
  }
  function sendVerify(s) { return idt('sendOobCode', { requestType: 'VERIFY_EMAIL', idToken: s.idToken, continueUrl: continueUrl() }).catch(function (e) { if (/INVALID_CONTINUE_URI|UNAUTHORIZED_DOMAIN/.test(e.code)) return idt('sendOobCode', { requestType: 'VERIFY_EMAIL', idToken: s.idToken }); throw e; }); }

  var api = {
    active: function () { return !!cfg(); },
    session: function () { var s = load(); return s ? { email: s.email, name: s.name, role: s.role, verified: !!s.verified, verifiedAt: s.verifiedAt || null } : null; },
    isVerifiedAdult: function () { var s = load(); return !!(s && s.verified); },
    errorText: hataMetni,

    signUp: function (o) {
      var email = String(o.email || '').trim(), name = String(o.name || '').trim(), role = o.role === 'ebeveyn' ? 'ebeveyn' : 'ogretmen';
      if (String(o.password || '').length < 8) return Promise.reject(new HesapHatasi('WEAK_PASSWORD'));
      return idt('signUp', { email: email, password: o.password, returnSecureToken: true }).then(function (j) {
        var s = save(withToken({ uid: j.localId, email: j.email || email, name: name, role: role, verified: false, consentAt: new Date().toISOString() }, j));
        var steps = name ? idt('update', { idToken: s.idToken, displayName: name, returnSecureToken: false }).catch(function () { return null; }) : Promise.resolve();
        return steps.then(function () { return sendVerify(s); }).then(function () { return api.session(); });
      });
    },

    signIn: function (o) {
      var email = String(o.email || '').trim();
      return idt('signInWithPassword', { email: email, password: o.password, returnSecureToken: true }).then(function (j) {
        var prev = load() || {};
        var s = save(withToken({ uid: j.localId, email: j.email || email, name: j.displayName || prev.name || '', role: prev.role || (o.role === 'ebeveyn' ? 'ebeveyn' : 'ogretmen'), verified: false }, j));
        return api.refreshVerified().then(function () { return api.session(); });
      });
    },

    resendVerification: function () { return freshToken().then(sendVerify).then(function () { return true; }); },

    refreshVerified: function () {
      return freshToken().then(function (s) {
        return idt('lookup', { idToken: s.idToken }).then(function (j) {
          var u = (j.users || [])[0] || {};
          s.verified = !!u.emailVerified;
          if (u.displayName) s.name = u.displayName;
          if (s.verified && !s.verifiedAt) s.verifiedAt = new Date().toISOString();
          save(s);
          return s.verified;
        });
      });
    },

    resetPassword: function (email) { return idt('sendOobCode', { requestType: 'PASSWORD_RESET', email: String(email || '').trim() }).then(function () { return true; }); },

    setRole: function (role) { var s = load(); if (s) { s.role = role === 'ebeveyn' ? 'ebeveyn' : 'ogretmen'; save(s); } },

    signOut: function () { save(null); return Promise.resolve(); },
  };
  window.GalakSayHesap = api;
})();
