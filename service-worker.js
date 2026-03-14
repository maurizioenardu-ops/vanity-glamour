const CACHE="vg-full-v6_1";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(["./","./index.html?v=v6_1","./manifest.json","./icon-192.png","./icon-512.png","./reset.html"])));});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{for(const k of await caches.keys()) if(k!==CACHE) await caches.delete(k); await self.clients.claim();})());});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  e.respondWith((async()=>{
    try{ return await fetch(e.request,{cache:"no-store"}); }
    catch(err){ return (await caches.match(e.request)) || Response.error(); }
  })());
});