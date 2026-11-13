const CACHE='orderbanao-shell-v1';
const ASSETS=['./','./index.html','./assets/base.css','./assets/order.css','./assets/app.mjs','./assets/core.mjs','./assets/store.mjs','./assets/i18n.mjs','./assets/config.js','./assets/icons.mjs','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png','./manifest.webmanifest','./privacy.html','./terms.html','./help.html','./contact.html','./about.html','./delete-data.html'];
self.addEventListener('install',evt=>{evt.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',evt=>{evt.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('orderbanao-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',evt=>{const req=evt.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(req.mode==='navigate'){evt.respondWith(fetch(req).then(res=>{if(res.ok){const clone=res.clone();caches.open(CACHE).then(c=>c.put(req,clone));}return res;}).catch(async()=>await caches.match(req)||await caches.match('./index.html')));return;}
 evt.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{if(res.ok){const clone=res.clone();caches.open(CACHE).then(c=>c.put(req,clone));}return res;})));
});
