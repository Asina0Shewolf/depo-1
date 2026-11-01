// Çevrimdışı önbellek: önce internetten çeker (güncellemeler hemen görünür),
// internet yoksa önbellekteki son sürümü kullanır.
const SURUM = "cicek-rehberi-v3";
const DOSYALAR = [
  "./", "./index.html", "./style.css", "./app.js",
  "./manifest.webmanifest", "./icon.svg", "./icon-192.png", "./icon-512.png", "./icon-180.png",
];

self.addEventListener("install", (olay) => {
  olay.waitUntil(caches.open(SURUM).then((onbellek) => onbellek.addAll(DOSYALAR)));
  self.skipWaiting();
});

self.addEventListener("activate", (olay) => {
  olay.waitUntil(
    caches.keys().then((anahtarlar) =>
      Promise.all(anahtarlar.filter((a) => a !== SURUM).map((a) => caches.delete(a)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (olay) => {
  if (olay.request.method !== "GET") return;
  olay.respondWith(
    fetch(olay.request)
      .then((yanit) => {
        if (yanit.ok && new URL(olay.request.url).origin === location.origin) {
          const kopya = yanit.clone();
          caches.open(SURUM).then((onbellek) => onbellek.put(olay.request, kopya));
        }
        return yanit;
      })
      .catch(() => caches.match(olay.request))
  );
});
