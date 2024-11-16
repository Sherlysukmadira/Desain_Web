const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/index.html',
    '/tugas1.html',
    '/style.css',
    '/patners.html',  
];

// Event install untuk caching
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return Promise.all(
                    urlsToCache.map(url => {
                        console.log('Caching:', url); // Logging URL yang dicoba untuk di-cache
                        return cache.add(url).catch((error) => {
                            console.error('Failed to cache:', error); // Menampilkan kesalahan jika gagal
                        });
                    })
                );
            })
    );
});

// Event fetch untuk mengambil resource dari cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Kembalikan cache jika ada, jika tidak ambil dari jaringan
                return response || fetch(event.request).catch(() => {
                    // Jika offline dan request gagal, tampilkan halaman offline
                    if (event.request.mode === 'navigate') {
                        return caches.match('/offline.html');
                    }
                });
            })
    );
});

// Event activate untuk menghapus cache lama
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]; // Hanya cache yang baru
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName); // Hapus cache lama
                    }
                })
            );
        })
    );
});
