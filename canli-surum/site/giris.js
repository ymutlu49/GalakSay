/* GalakSay giriş sayfası: NuMap hesabıyla lisanslı giriş (NuMap /auth/login → /api/lisans/oturum). */
(function () {
  'use strict';
  var q = new URLSearchParams(location.search);
  var geri = q.get('geri') || '/oyna/';
  if (!/^\/oyna(\/|$)/.test(geri)) geri = '/oyna/';
  var uyari = document.getElementById('uyari');
  function goster(msg, iyi) { uyari.textContent = msg; uyari.hidden = !msg; uyari.className = 'uyari' + (iyi ? ' iyi' : ''); }
  var hata = q.get('hata');
  if (hata === 'lisans') goster('Bu NuMap hesabında GalakSay lisansı yok. Lisans için kurumunuzun NuMap yöneticisine başvurun.');
  else if (hata === 'sso') goster('NuMap bağlantısı doğrulanamadı ya da süresi doldu. GalakSay\'ı NuMap\'ten yeniden açın ya da aşağıdan giriş yapın.');

  // Lisansı zaten olan cihaz doğrudan oyuna geçer.
  fetch('/api/lisans/durum', { credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (d) {
    if (d && d.lisans && !hata) location.replace(geri);
  }).catch(function () {});

  // Giriş tarayıcıdan doğrudan NuMap'e yapılır (NuMap'in hatalı deneme sınırı bu cihaza uygulanır);
  // GalakSay sunucusu yalnız belirteci doğrulayıp HttpOnly lisans çerezini yazar.
  var NUMAP = 'https://getnumap.com/api';
  var form = document.getElementById('form'), btn = document.getElementById('gir');
  function bitti(msg) { goster(msg); btn.disabled = false; btn.textContent = 'NuMap ile giriş yap'; }
  function jsonYanit(r) { return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j || {} }; }); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.email.value.trim().toLowerCase(), password = form.password.value;
    if (!email || !password) { goster('E-posta ve şifrenizi yazın.'); return; }
    btn.disabled = true; btn.textContent = 'Giriş yapılıyor…'; goster('');
    fetch(NUMAP + '/auth/login', {
      method: 'POST', credentials: 'omit',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
    }).then(jsonYanit).then(function (x) {
      if (x.s === 429) return bitti(x.j.error || 'Çok fazla deneme. Birkaç dakika sonra yeniden deneyin.');
      if (x.s !== 200 || !x.j.token) return bitti(x.s === 401 ? 'E-posta ya da şifre hatalı.' : (x.j.error || 'Giriş yapılamadı.'));
      var ent = Array.isArray(x.j.entitlements) ? x.j.entitlements : [];
      if (ent.indexOf('galaksay') < 0) {
        fetch(NUMAP + '/auth/logout', { method: 'POST', credentials: 'omit', headers: { Authorization: 'Bearer ' + x.j.token } }).catch(function () {});
        return bitti('Bu NuMap hesabında GalakSay lisansı yok. Lisans için kurumunuzun NuMap yöneticisine başvurun.');
      }
      return fetch('/api/lisans/oturum', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token: x.j.token }),
      }).then(jsonYanit).then(function (y) {
        if (y.s !== 200 || !y.j.ok) return bitti(y.j.error || 'Giriş tamamlanamadı.');
        try {
          var u = x.j.user || {};
          u.assessmentRemaining = x.j.assessmentRemaining == null ? null : x.j.assessmentRemaining;
          u.plan = x.j.plan == null ? null : x.j.plan;
          u.entitlements = ent;
          localStorage.setItem('numap_token', x.j.token);
          localStorage.setItem('numap_user', JSON.stringify(u));
          sessionStorage.setItem('gs_devir_taze', '1');
        } catch (err) { /* depolama kapalı: oyun yine açılır, öğretmen uygulamada yeniden girer */ }
        goster('Giriş başarılı. GalakSay açılıyor…', true);
        location.replace(geri);
      });
    }).catch(function () { bitti('Bağlantı kurulamadı. İnternetinizi denetleyip yeniden deneyin.'); });
  });
})();
