/* galaksay.com tanıtım sayfası: yıl, PWA kurulum istemi, service worker.
 * Satır içi betik yerine dış dosya: CSP script-src 'unsafe-inline' gerektirmez. */
document.getElementById('yil').textContent = new Date().getFullYear();

// ── PWA kurulum istemi ──
var deferredPrompt = null;
var installButtons = [document.getElementById('install-btn'), document.getElementById('install-btn-2')];

function showInstall(show) {
  installButtons.forEach(function (b) { if (b) b.hidden = !show; });
}

window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  deferredPrompt = e;
  showInstall(true);
});

installButtons.forEach(function (btn) {
  if (!btn) return;
  btn.addEventListener('click', function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(function () {
      deferredPrompt = null;
      showInstall(false);
    });
  });
});

window.addEventListener('appinstalled', function () { showInstall(false); });

// ── iOS: beforeinstallprompt yok → manuel ipucu göster ──
(function () {
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var standalone = window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches;
  if (isIOS && !standalone) {
    var tip = document.getElementById('ios-tip');
    if (tip) tip.style.display = 'block';
  }
})();

// ── Service worker ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {});
  });
}
