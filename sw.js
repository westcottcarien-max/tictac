// Offline cache for the app shell (network-first so updates always arrive; cache is the fallback)
const CACHE = 'tictac-v6';
const SHELL = ['./', 'index.html', 'styles.css', 'js/data.js', 'js/render.js', 'js/export.js', 'js/app.js', 'logo-192.png', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'manifest.webmanifest'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
