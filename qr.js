const CACHE_NAME = 'qr-utility-v1';
const ASSETS = [
  './qr.html',
  'https://cdn.jsdelivr.net/npm/qrcode-generator@2.0.4/dist/qrcode.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).then(networkRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, networkRes.clone());
          return networkRes;
        });
      });
    })
  );
});
