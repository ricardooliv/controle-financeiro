const CACHE_NAME = "financeiro-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/login.html",
  "/css/style.css",
  "/js/app.js",
  "/js/auth.js",
  "/js/firebase.js"
];

// INSTALAR
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// USAR CACHE
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});