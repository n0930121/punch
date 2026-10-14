// UCHINO 打卡系統 — service worker
// 打卡頁一律走網路（確保拿到最新版、打卡一定送到後端）；
// 只有圖示這類靜態檔做快取，離線時頁面才至少打得開並提示沒有網路。
const CACHE = 'uc-punch-v4';
const STATIC = ['icons/icon-192-v4.png', 'icons/icon-512-v4.png', 'icons/apple-touch-icon-v4.png', 'manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('uc-punch') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  // 頁面：網路優先，失敗才用快取
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }
  // 靜態檔：快取優先
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
