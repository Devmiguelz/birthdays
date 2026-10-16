/* Service worker de "Cumpleaños Familia"
   Cachea el app-shell para que funcione sin conexión tras la primera visita. */
const CACHE = 'cumple-v2';
const SHELL = ['./', './index.html', './data.json'];

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

  // data.json: network-first (así los cambios se ven al recargar; cae a caché si no hay red)
  if (url.pathname.endsWith('/data.json')) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./data.json')))
    );
    return;
  }

  // Resto: cache-first
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit || fetch(e.request).then(res => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      }).catch(() =>
        e.request.mode === 'navigate' ? caches.match('./index.html') : undefined
      )
    )
  );
});
