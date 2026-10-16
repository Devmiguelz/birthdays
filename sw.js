/* Service worker de "Cumpleaños Familia"
   Cachea el app-shell para que funcione sin conexión tras la primera visita. */
const CACHE = 'cumple-v4';
const SHELL = ['./', './index.html', './styles.css', './data.json'];

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

  const url = new URL(e.request.url);
  const sameOrigin = url.origin === self.location.origin;

  // Nuestros propios archivos (HTML, CSS, data.json): NETWORK-FIRST.
  // Así los cambios de código y de datos se ven al recargar; cae a caché sin red.
  if (sameOrigin) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match(e.request).then(hit =>
        hit || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined)))
    );
    return;
  }

  // CDN externas (three.js, gsap, fuentes): CACHE-FIRST (rápidas y offline)
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit || fetch(e.request).then(res => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      }).catch(() => undefined)
    )
  );
});
