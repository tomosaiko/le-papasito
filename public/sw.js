const CACHE_NAME = 'le-papasito-v1.0.0'
const STATIC_CACHE_NAME = 'le-papasito-static-v1.0.0'
const DYNAMIC_CACHE_NAME = 'le-papasito-dynamic-v1.0.0'

// Ressources statiques à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/images/logo.png',
  '/placeholder.jpg',
  '/globals.css',
  '/offline.html'
]

// Ressources dynamiques importantes
const DYNAMIC_ROUTES = [
  '/search',
  '/dashboard',
  '/messages',
  '/escort-dashboard',
  '/login',
  '/signup'
]

// Installation du service worker
self.addEventListener('install', event => {
  console.log('[SW] Installation du service worker')
  
  event.waitUntil(
    Promise.all([
      // Cache statique
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('[SW] Mise en cache des ressources statiques')
        return cache.addAll(STATIC_ASSETS)
      }),
      
      // Cache dynamique pour les routes importantes
      caches.open(DYNAMIC_CACHE_NAME).then(cache => {
        console.log('[SW] Pré-cache des routes importantes')
        return cache.addAll(DYNAMIC_ROUTES)
      })
    ])
  )
  
  // Forcer l'activation immédiate
  self.skipWaiting()
})

// Activation du service worker
self.addEventListener('activate', event => {
  console.log('[SW] Activation du service worker')
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Supprimer les anciens caches
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME && 
              cacheName !== CACHE_NAME) {
            console.log('[SW] Suppression ancien cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  // Prendre le contrôle immédiatement
  self.clients.claim()
})

// Stratégies de cache
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return
  }
  
  // Stratégie pour les images
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME))
    return
  }
  
  // Stratégie pour les API
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE_NAME))
    return
  }
  
  // Stratégie pour les pages statiques
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME))
    return
  }
  
  // Stratégie pour les pages dynamiques
  if (DYNAMIC_ROUTES.includes(url.pathname)) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE_NAME))
    return
  }
  
  // Stratégie par défaut : Network First
  event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE_NAME))
})

// Stratégie Cache First (pour les ressources statiques)
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      console.log('[SW] Cache hit:', request.url)
      return cachedResponse
    }
    
    console.log('[SW] Cache miss, fetch:', request.url)
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('[SW] Cache First error:', error)
    return getOfflineResponse(request)
  }
}

// Stratégie Network First (pour les ressources dynamiques)
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
      console.log('[SW] Network success, cached:', request.url)
    }
    
    return networkResponse
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url)
    
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      console.log('[SW] Cache fallback:', request.url)
      return cachedResponse
    }
    
    return getOfflineResponse(request)
  }
}

// Réponse offline
function getOfflineResponse(request) {
  const url = new URL(request.url)
  
  // Page HTML offline
  if (request.destination === 'document') {
    return caches.match('/offline.html')
  }
  
  // Image placeholder
  if (request.destination === 'image') {
    return caches.match('/placeholder.jpg')
  }
  
  // API response générique
  if (url.pathname.startsWith('/api/')) {
    return new Response(
      JSON.stringify({
        error: 'Connexion internet requise',
        offline: true,
        timestamp: new Date().toISOString()
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
  
  // Réponse par défaut
  return new Response('Contenu non disponible hors ligne', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  })
}

// Gestion des messages depuis l'application
self.addEventListener('message', event => {
  const { type, payload } = event.data
  
  switch (type) {
    case 'CACHE_URLS':
      handleCacheUrls(payload.urls)
      break
    case 'CLEAR_CACHE':
      handleClearCache()
      break
    case 'GET_CACHE_SIZE':
      handleGetCacheSize()
      break
    default:
      console.log('[SW] Message non géré:', type)
  }
})

// Mettre en cache des URLs spécifiques
async function handleCacheUrls(urls) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME)
    await cache.addAll(urls)
    console.log('[SW] URLs mises en cache:', urls.length)
  } catch (error) {
    console.error('[SW] Erreur cache URLs:', error)
  }
}

// Vider le cache
async function handleClearCache() {
  try {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map(name => caches.delete(name)))
    console.log('[SW] Cache vidé')
  } catch (error) {
    console.error('[SW] Erreur vidage cache:', error)
  }
}

// Obtenir la taille du cache
async function handleGetCacheSize() {
  try {
    const cacheNames = await caches.keys()
    let totalSize = 0
    
    for (const name of cacheNames) {
      const cache = await caches.open(name)
      const keys = await cache.keys()
      totalSize += keys.length
    }
    
    console.log('[SW] Taille cache:', totalSize, 'éléments')
    return totalSize
  } catch (error) {
    console.error('[SW] Erreur taille cache:', error)
    return 0
  }
}

// Nettoyage périodique du cache
setInterval(async () => {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME)
    const keys = await cache.keys()
    
    // Supprimer les anciennes entrées (plus de 7 jours)
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    
    for (const request of keys) {
      const response = await cache.match(request)
      if (response) {
        const dateHeader = response.headers.get('date')
        if (dateHeader && new Date(dateHeader).getTime() < oneWeekAgo) {
          await cache.delete(request)
          console.log('[SW] Suppression entrée expirée:', request.url)
        }
      }
    }
  } catch (error) {
    console.error('[SW] Erreur nettoyage cache:', error)
  }
}, 24 * 60 * 60 * 1000) // Une fois par jour

console.log('[SW] Service Worker Le Papasito chargé') 