/* Service worker de "Cumpleaños Familia"
   Cachea el app-shell para que funcione sin conexión tras la primera visita. */
const CACHE = 'cumple-v3';
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

  // HTML (navegación / index.html) y data.json: network-first.
  // Así los cambios de código y de datos se ven al recargar; cae a caché sin red.
  const isHTML = e.request.mode === 'navigate'
    || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  const isData = url.pathname.endsWith('/data.json');

  if (isHTML || isData) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match(e.request).then(hit =>
        hit || caches.match(isData ? './data.json' : './index.html')))
    );
    return;
  }

  // Resto (CDN: three.js, gsap, fuentes): cache-first
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
