// Basit çevrimdışı önbellek: uygulama dosyaları bir kez yüklendikten sonra internetsiz de açılır.
const SURUM = "cicek-rehberi-v2";
const DOSYALAR = ["./", "./index.html", "./style.css", "./app.js", "./manifest.webmanifest", "./icon.svg"];

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
    caches.match(olay.request).then((kayit) => kayit || fetch(olay.request))
  );
});
