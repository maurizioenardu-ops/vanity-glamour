const CACHE = 'vg-full-v7_0-fontfix';
const APP_SHELL = [
  './',
  './index.html?v=v7_0_fontfix',
  './manifest.json?v=v7_0_fontfix',
  './icon-192.png',
  './icon-512.png',
  './reset.html'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) {
      client.postMessage({ type: 'VG_SW_UPDATED', version: CACHE });
    }
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const req = event.request;
  const url = new URL(req.url);

  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname === self.registration.scope.replace(location.origin,'')) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req, { cache: 'reload' });
        const cache = await caches.open(CACHE);
        cache.put('./index.html?v=v7_0_fontfix', fresh.clone());
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        return (await caches.match(req)) || (await caches.match('./index.html?v=v7_0_fontfix')) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    try {
      const fresh = await fetch(req, { cache: 'no-store' });
      return fresh;
    } catch {
      return (await caches.match(req)) || Response.error();
    }
  })());
});
