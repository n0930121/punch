// 查詢頁已併入打卡 App，這個舊的 service worker 會自我移除
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('uc-query')).map(k => caches.delete(k))))
    .then(() => self.registration.unregister())));
