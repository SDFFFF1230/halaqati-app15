/* خدمة العمل دون إنترنت لتطبيق حلقتي
   - ملفات التطبيق: تُعرض فوراً من الذاكرة ثم تُحدَّث بالخلفية (يصل التحديث في التشغيل التالي)
   - المكتبات والخطوط الخارجية: تُحفظ بعد أول تشغيل ناجح بالإنترنت ثم تعمل دون اتصال
   عند إصدار نسخة جديدة غيّر رقم VERSION أدناه */
const VERSION = '1.1.0';
const CACHE = 'halaqati-' + VERSION;
const LOCAL = ['./', 'index.html', 'app.js', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/favicon.svg', 'icons/apple-touch-icon.png'];
const LIBS = [
  'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
  'https://unpkg.com/lucide@0.292.0',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(LOCAL.map((u) => cache.add(u).catch(() => {})));
    // المكتبات الخارجية: نخزّنها (قد تكون استجابة opaque فنستعمل put بدل add)
    await Promise.all(LIBS.map(async (u) => {
      try { const res = await fetch(new Request(u, { mode: 'no-cors' })); await cache.put(u, res); } catch (e) {}
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('halaqati-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (!/^https?:$/.test(url.protocol)) return;

  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req).then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
      if (cached) { event.waitUntil(network); return cached; }
      const res = await network;
      if (res) return res;
      if (req.mode === 'navigate') return (await cache.match('index.html')) || (await cache.match('./')) || Response.error();
      return Response.error();
    })());
    return;
  }

  // خارجي (مكتبات، خطوط Google): من الذاكرة أولاً ثم الشبكة مع الحفظ
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    } catch (e) {
      return Response.error();
    }
  })());
});
