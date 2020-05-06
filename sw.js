const staticPM = "power-meter-v1";
const assets = [
  "/",
  "./index.html",
  "./styles/style.css",
  "./scripts/script.js",
  "./scripts/comedApi.js",
  "./scripts/db.js",
  "./scripts/energyStarApi.js",
  "./scripts/energyUsage.js",
  "https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.css",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.js",
  "https://unpkg.com/dexie@latest/dist/dexie.js"
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticPM).then(cache => {
      cache.addAll(assets);
    })
  )
});
self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});