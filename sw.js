/* Service worker de "Cumpleaños Familia"
   Cachea el app-shell para que funcione sin conexión tras la primera visita. */
const CACHE = 'cumple-v1';
const SHELL = ['./', './index.html'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit || fetch(e.request).then(res => {
        // Guarda en caché respuestas válidas (incluye CDN: three.js, gsap, fuentes)
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      }).catch(() =>
        // Sin red: si piden una página, devuelve la app
        e.request.mode === 'navigate' ? caches.match('./index.html') : undefined
      )
    )
  );
});
