// ========== SERVICE WORKER FOR PWA ==========
const CACHE_NAME = 'mazdoor-setu-v1.0.0';
const OFFLINE_CACHE = 'mazdoor-setu-offline-v1';

// Files to cache on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/firebase-config.js',
    '/manifest.json',
    '/pages/home.html',
    '/pages/home.css',
    '/pages/home.js',
    
    // Assets
    '/assets/icons/icon-72x72.png',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png',
    
    // External dependencies
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Hind:wght@400;500;600&display=swap'
];

// ========== INSTALL EVENT ==========
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('[Service Worker] Install completed');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[Service Worker] Install failed:', error);
            })
    );
});

// ========== ACTIVATE EVENT ==========
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('[Service Worker] Claiming clients');
            return self.clients.claim();
        })
    );
});

// ========== FETCH EVENT ==========
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip Chrome extensions
    if (event.request.url.startsWith('chrome-extension://')) return;
    
    // Skip Firebase and external APIs
    if (event.request.url.includes('firebase') || 
        event.request.url.includes('googleapis') ||
        event.request.url.includes('gstatic')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone the request
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest)
                    .then(response => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response
                        const responseToCache = response.clone();
                        
                        // Cache the response
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.log('[Service Worker] Fetch failed; returning offline page:', error);
                        
                        // Return offline page for HTML requests
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/offline.html');
                        }
                        
                        // Return cached assets for other requests
                        return caches.match(event.request);
                    });
            })
    );
});

// ========== PUSH NOTIFICATIONS ==========
self.addEventListener('push', event => {
    console.log('[Service Worker] Push received:', event);
    
    let data = {
        title: 'Mazdoor Setu',
        body: 'You have a new notification',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-72x72.png'
    };
    
    if (event.data) {
        try {
            data = { ...data, ...event.data.json() };
        } catch (e) {
            data.body = event.data.text();
        }
    }
    
    const options = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        },
        actions: [
            {
                action: 'explore',
                title: 'Open',
                icon: '/assets/icons/icon-72x72.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/icons/icon-72x72.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', event => {
    console.log('[Service Worker] Notification click received:', event);
    
    event.notification.close();
    
    if (event.action === 'close') {
        return;
    }
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(windowClients => {
                for (const client of windowClients) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});

// ========== BACKGROUND SYNC ==========
self.addEventListener('sync', event => {
    console.log('[Service Worker] Background sync:', event.tag);
    
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    console.log('[Service Worker] Syncing data in background');
    
    // Implement your sync logic here
    // This is called when the device comes back online
    
    try {
        // Get pending operations from IndexedDB
        // Process and sync with server
        // Clear pending operations
        
        console.log('[Service Worker] Background sync completed');
    } catch (error) {
        console.error('[Service Worker] Background sync failed:', error);
    }
}

// ========== PERIODIC SYNC ==========
self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-content') {
        console.log('[Service Worker] Periodic sync for content update');
        event.waitUntil(updateContent());
    }
});

async function updateContent() {
    console.log('[Service Worker] Updating content in background');
    
    try {
        // Update cached content
        const cache = await caches.open(CACHE_NAME);
        const updatedContent = await fetch('/api/latest-content');
        
        if (updatedContent.ok) {
            // Update cache with new content
            // Implement your update logic here
        }
        
        console.log('[Service Worker] Content update completed');
    } catch (error) {
        console.error('[Service Worker] Content update failed:', error);
    }
}

// ========== MESSAGE HANDLING ==========
self.addEventListener('message', event => {
    console.log('[Service Worker] Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(cache => {
                    return cache.addAll(event.data.payload);
                })
        );
    }
});

// ========== OFFLINE SUPPORT ==========
// Create offline page
const OFFLINE_HTML = `
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ऑफलाइन - Mazdoor Setu</title>
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
        }
        .offline-icon {
            font-size: 4rem;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }
        h1 {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        p {
            font-size: 1.1rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        button {
            background: white;
            color: #667eea;
            border: none;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s;
        }
        button:hover {
            transform: translateY(-2px);
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    </style>
</head>
<body>
    <div class="offline-icon">
        <i class="fas fa-wifi-slash"></i>
    </div>
    <h1>कोई इंटरनेट कनेक्शन नहीं</h1>
    <p>कृपया अपना इंटरनेट कनेक्शन चेक करें और पुनः प्रयास करें</p>
    <button onclick="window.location.reload()">पुनः प्रयास करें</button>
</body>
</html>
`;

// Cache offline page on install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(OFFLINE_CACHE)
            .then(cache => {
                const offlineResponse = new Response(OFFLINE_HTML, {
                    headers: { 'Content-Type': 'text/html' }
                });
                return cache.put('/offline.html', offlineResponse);
            })
    );
});
