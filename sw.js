/* Day Blocks service worker: works offline, updates when you tap Update. Bump VERSION on every release. */
const VERSION='day-blocks-1.1.1';
const SHELL=['./','index.html','config.js','manifest.webmanifest','icons/icon.svg','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)));
});
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    for(const k of await caches.keys())if(k!==VERSION)await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('message',e=>{if(e.data==='skipWaiting')self.skipWaiting()});

const fresh=async(req,ms)=>{   // network first, cached copy if slow or offline
  const c=await caches.open(VERSION);
  try{
    const res=await Promise.race([fetch(req),new Promise((_,no)=>setTimeout(()=>no(new Error('slow')),ms))]);
    if(res&&res.ok)c.put(req,res.clone());
    return res;
  }catch(err){
    return (await c.match(req,{ignoreSearch:true}))||(req.mode==='navigate'?await c.match('index.html'):undefined)||Response.error();
  }
};
const stale=async req=>{        // cached copy now, refresh in the background
  const c=await caches.open(VERSION),hit=await c.match(req);
  const net=fetch(req).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(req,res.clone());return res}).catch(()=>hit);
  return hit||net;
};

self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.origin===location.origin){
    if(req.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/config.js'))e.respondWith(fresh(req,3500));
    else e.respondWith(stale(req));
    return;
  }
  // fonts and the pinned Firebase SDK never change at a given URL, so keep them for offline starts
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'||(u.hostname==='www.gstatic.com'&&u.pathname.startsWith('/firebasejs/')))e.respondWith(stale(req));
});
