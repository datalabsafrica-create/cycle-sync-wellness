const CACHE_NAME = 'cyclesync-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Just cache the root page index and basic assets
      return cache.addAll(['/']);
    })
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // We only want to handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        // Fallback to serving the app shell for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('', { status: 404, statusText: 'Not Found' });
      });
    })
  );
});
