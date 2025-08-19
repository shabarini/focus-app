const CACHE_NAME = 'focus-task-manager-v1';
const STATIC_CACHE = 'focus-static-v1';
const DYNAMIC_CACHE = 'focus-dynamic-v1';

// Файлы для кеширования при установке
const STATIC_FILES = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.png',
  '/logo192.png',
  '/logo512.png'
];

// Стратегии кеширования
const CACHE_STRATEGIES = {
  // Кеширование статических ресурсов
  STATIC: 'cache-first',
  // Кеширование API запросов
  API: 'network-first',
  // Кеширование изображений
  IMAGES: 'cache-first',
  // Кеширование шрифтов
  FONTS: 'cache-first'
};

// Установка сервис-воркера
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Error caching static files:', error);
      })
  );
});

// Активация сервис-воркера
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Удаляем старые кеши
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Пропускаем неподдерживаемые запросы
  if (request.method !== 'GET') {
    return;
  }
  
  // Обработка разных типов запросов
  if (isStaticFile(url.pathname)) {
    event.respondWith(handleStaticRequest(request));
  } else if (isApiRequest(url.pathname)) {
    event.respondWith(handleApiRequest(request));
  } else if (isImageRequest(url.pathname)) {
    event.respondWith(handleImageRequest(request));
  } else {
    event.respondWith(handleDefaultRequest(request));
  }
});

// Определение типа файла
function isStaticFile(pathname) {
  return STATIC_FILES.includes(pathname) || 
         pathname.startsWith('/static/') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.json');
}

function isApiRequest(pathname) {
  return pathname.includes('/api/') || 
         pathname.includes('firebase') ||
         pathname.includes('googleapis');
}

function isImageRequest(pathname) {
  return pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i);
}

// Обработка статических файлов (cache-first)
async function handleStaticRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Error handling static request:', error);
    return new Response('Offline - Static file not available', { status: 503 });
  }
}

// Обработка API запросов (network-first)
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache for API request');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline - API not available', { status: 503 });
  }
}

// Обработка изображений (cache-first)
async function handleImageRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Error handling image request:', error);
    return new Response('Offline - Image not available', { status: 503 });
  }
}

// Обработка остальных запросов (network-first)
async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache for default request');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline - Resource not available', { status: 503 });
  }
}

// Обработка push-уведомлений
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление от FOCUS Task Manager',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Открыть приложение',
        icon: '/logo192.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/logo192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('FOCUS Task Manager', options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Синхронизация в фоне
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync());
  }
});

// Выполнение фоновой синхронизации
async function performBackgroundSync() {
  try {
    // Здесь можно добавить логику синхронизации данных
    console.log('[SW] Performing background sync...');
    
    // Пример: синхронизация с Firebase
    // const response = await fetch('/api/sync', { method: 'POST' });
    // if (response.ok) {
    //   console.log('[SW] Background sync completed successfully');
    // }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Обработка ошибок
self.addEventListener('error', (event) => {
  console.error('[SW] Service worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});
