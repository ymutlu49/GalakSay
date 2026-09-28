/* GalakSay aile bağlantısı: galaksay.com/aile#<davet>
 * Davet adres çubuğunun # kısmındadır; sunucu kayıtlarına ve yönlendirme başlıklarına düşmez.
 * Sayfa daveti /api/lisans/aile'ye gönderir (NuMap'te doğrulanır, cihaza HttpOnly lisans çerezi
 * yazılır), sonra # kısmını adresten siler. */
(function () {
  'use strict';
  var token = (location.hash || '').slice(1);
  try { history.replaceState(null, '', location.pathname); } catch (e) { /* yok say */ }
  var durum = document.getElementById('durum'), uyari = document.getElementById('uyari');
  function hata(msg) { durum.textContent = 'Bağlantı kullanılamadı.'; uyari.textContent = msg; uyari.hidden = false; }
  if (!token) {
    fetch('/api/lisans/durum', { credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (d) {
      if (d && d.lisans && d.lisans.tur === 'aile') { location.replace('/oyna/'); return; }
      hata('Bu sayfa, öğretmeninizin gönderdiği bağlantıyla açılır (galaksay.com/aile#…). Bağlantıyı yeniden açın ya da öğretmeninizden yenisini isteyin.');
    }).catch(function () { hata('Bağlantı eksik.'); });
    return;
  }
  fetch('/api/lisans/aile', {
    method: 'POST', credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token: token }),
  }).then(function (r) { return r.json().then(function (j) { return { s: r.status, j: j }; }); })
    .then(function (x) {
      if (x.s !== 200 || !x.j.ok) { hata((x.j && x.j.error) || 'Davet doğrulanamadı.'); return; }
      durum.textContent = 'Bağlantınız doğrulandı.';
      var kim = [x.j.ogretmen, x.j.kurum].filter(Boolean).join(' · ');
      document.getElementById('kimden').textContent = kim ? 'Davet eden: ' + kim + (x.j.etiket ? ' (' + x.j.etiket + ')' : '') : (x.j.etiket || 'Aile daveti');
      try {
        document.getElementById('bitis').textContent = 'Geçerlilik: ' + new Date(x.j.bitis).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) + ' tarihine kadar';
      } catch (e) { /* yok say */ }
      document.getElementById('tamam').hidden = false;
      document.getElementById('basla').addEventListener('click', function () {
        var paylas = document.getElementById('paylas').checked;
        try {
          localStorage.setItem('galaksay_aile', '1');
          var c = {};
          try { c = JSON.parse(localStorage.getItem('galaksay_consent_v1') || '{}') || {}; } catch (e) { c = {}; }
          // explicit: ebeveynin açık seçimi; uygulama açılışta bu kaydı varsayılana sıfırlamaz.
          c.essential = true; c.dataSync = paylas; c.decision = 'accept'; c.explicit = true; c.optInReset = true; c.optIn = 2; c.aile = true;
          c.grantedAt = new Date().toISOString(); c.version = 1;
          localStorage.setItem('galaksay_consent_v1', JSON.stringify(c));
        } catch (e) { /* depolama kapalı: oyun yine açılır, paylaşım olmaz */ }
        location.replace('/oyna/');
      });
    })
    .catch(function () { hata('Sunucuya ulaşılamadı. İnternetinizi denetleyip bağlantıyı yeniden açın.'); });
})();
