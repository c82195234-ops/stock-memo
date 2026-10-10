// アプリを更新したら VERSION を変えると、新しいファイルに入れ替わります
const VERSION = 'stock-v9';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  // cache:'reload' でブラウザの古いHTTPキャッシュを無視して最新を取得
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin && !FONT_HOSTS.includes(url.hostname)) return;

  const isPage = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html');

  if (isPage) {
    // 画面本体：ネット優先（常に最新）。オフラインならキャッシュ
    e.respondWith(
      caches.open(VERSION).then(async cache => {
        try {
          const res = await fetch(req, { cache: 'no-cache' });
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        } catch (err) {
          return (await cache.match(req, { ignoreSearch: true })) || (await cache.match('./index.html'));
        }
      })
    );
    return;
  }

  // それ以外（アイコン・フォント等）：キャッシュ優先＋裏で更新
  e.respondWith(
    caches.open(VERSION).then(async cache => {
      const hit = await cache.match(req, { ignoreSearch: true });
      const net = fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
