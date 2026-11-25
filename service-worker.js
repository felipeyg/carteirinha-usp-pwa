const CACHE_NAME = 'credencial-cache-v2';
const urlsToCache = [
    '.',
    'index.html',
    'styles.css',
    'manifest.json',
    'script.js',
    'img/menu-icon.png',
    'img/photo-placeholder.png',
    'icons/icon-192x192.png',
    'icons/icon-512x512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            // addAll falha tudo se um recurso falhar; add individual é tolerante
            .then(cache => Promise.all(urlsToCache.map(url =>
                cache.add(url).catch(err => console.warn('Falha ao cachear', url, err))
            )))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(names => Promise.all(
            names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
        )).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(response => {
                // Guarda cópia das respostas válidas para uso offline
                if (response && response.status === 200 && response.type === 'basic') {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                }
                return response;
            }).catch(() => cached);
        })
    );
});
