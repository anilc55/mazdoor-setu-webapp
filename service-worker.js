const CACHE_NAME = 'mazdoor-setu-v1';
const urlsToCache = [
    '/',
    '/home.html',
    '/css/style.css',
    '/js/app.js',
    '/find-worker.html',
    '/find-job.html',
    '/find-room.html',
    '/post-job.html',
    '/emergency.html',
    '/support.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
