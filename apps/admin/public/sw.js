/* Share2Sells Panel — Service Worker
   - Precache app shell (manifest + icons) on install
   - Navigations: network-first, offline fallback to cached shell
   - Static assets: stale-while-revalidate
   - API requests: never cached (network only) */
"use strict";

const VERSION = "s2s-panel-v3";
const CORE_CACHE = `${VERSION}-core`;
const ASSETS_CACHE = `${VERSION}-assets`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const CORE_ASSETS = [
  "/",
  "/site.webmanifest",
  "/fav/maskable-icon-192x192.png",
  "/fav/maskable-icon-512x512.png",
  "/fav/android-icon-192x192.png",
  "/fav/android-icon-512x512.png",
];

const ASSET_EXT =
  /\.(js|css|png|jpe?g|gif|svg|ico|webp|avif|woff2?|ttf|otf|eot|json|txt|webmanifest)$/i;

/* Precache the app shell resiliently: don't abort install on a single miss */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CORE_CACHE)
      .then((cache) =>
        Promise.all(
          CORE_ASSETS.map((asset) =>
            fetch(asset, { cache: "no-cache" })
              .then((res) => {
                if (res.ok) cache.put(asset, res);
              })
              .catch(() => {})
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

/* Clean up old cache versions */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(VERSION))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  /* App pages (HTML) — network first, fall back to cached shell when offline */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match("/"))
        )
    );
    return;
  }

  /* Static assets — stale-while-revalidate */
  if (
    url.pathname.startsWith("/_next/static/") ||
    ASSET_EXT.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const refresh = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              const copy = response.clone();
              caches
                .open(ASSETS_CACHE)
                .then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);
        return cached || refresh;
      })
    );
    return;
  }

  /* Everything else — network first, cache for later */
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request))
  );
});