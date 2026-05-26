// Смета-Про — Service Worker
// Стратегия: cache-first. После первой загрузки приложение работает оффлайн.
// При обновлении версии — меняй CACHE_NAME, тогда старый кэш почистится.

const CACHE_NAME = 'smeta-pro-full-v34';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
  );
  // skipWaiting только если клиент явно попросит (через сообщение SKIP_WAITING).
  // Это позволяет показать баннер "Доступно обновление" вместо тихой подмены.
});

// Получаем сообщение из приложения когда юзер нажал "Обновить сейчас"
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // HTML, manifest.json, sw.js — network-first (всегда тянем свежее, кэш — fallback при offline).
  // Это критично, чтобы битый кэш не "застревал" у пользователя навсегда.
  const isFresh = req.mode === 'navigate'
    || (req.headers.get('accept') || '').includes('text/html')
    || url.pathname.endsWith('.html')
    || url.pathname.endsWith('/')
    || url.pathname.endsWith('manifest.json')
    || url.pathname.endsWith('sw.js');

  if (isFresh) {
    event.respondWith(
      fetch(req).then((resp) => {
        if (resp && resp.status === 200) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
        }
        return resp;
      }).catch(() => caches.match(req)) // нет сети → fallback на кэш
    );
    return;
  }

  // Остальное (картинки, шрифты, CDN-библиотеки) — cache-first (быстро, экономно).
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((resp) => {
        if (resp && (resp.status === 200 || resp.type === 'opaque')) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
        }
        return resp;
      }).catch(() => cached);
    })
  );
});
