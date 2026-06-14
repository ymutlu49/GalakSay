/* Galaksay service worker
   - Tanıtım sayfası + /oyna/ uygulaması için çevrimdışı destek.
   - Strateji: gezinmelerde (navigate) network-first → cache fallback;
     diğer aynı-köken GET'lerde stale-while-revalidate.
   - Uygulama varlıkları hash'li olduğu için cache büyümesi kontrollüdür;
     yeni sürümde VERSION bump'la → eski cache temizlenir. */
const VERSION = 'galaksay-v3-20260611';

// İlk yüklemede çevrimdışı çalışması için önbelleğe alınan çekirdek kabuk.
const CORE = [
  '/',
  '/index.html',
  '/oyna/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      // Tek tek ekle: biri (ör. /oyna/ henüz yoksa) başarısız olursa install patlamasın.
      .then((cache) => Promise.all(CORE.map((u) => cache.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Sayfa gezinmeleri: önce ağ (taze index.html → yeni asset hash'leri),
  // çevrimdışıysa cache, o da yoksa ilgili kabuk.
  if (req.mode === 'navigate') {
    event.respondWith(
      // cache:'no-cache' → index.html DAİMA sunucudan doğrulanır (ara önbellek bayatlığı
      // "yeni sürüm görünmüyor / eski davranış sürüyor" şikâyetlerinin kaynağıydı).
      fetch(req, { cache: 'no-cache' })
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          const shell = url.pathname.startsWith('/oyna') ? '/oyna/' : '/';
          return (await caches.match(shell)) || Response.error();
        })
    );
    return;
  }

  // Diğer varlıklar: stale-while-revalidate.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
