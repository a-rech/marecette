/* ════════════════════════════════════════════════════════════════════════
   MaRecette — Service Worker
   ────────────────────────────────────────────────────────────────────────
   Stratégie : Cache First + mise à jour automatique.

   Fonctionnement de la mise à jour :
   1. Le navigateur détecte que sw.js a changé (CACHE_VERSION ou contenu).
   2. Le nouveau SW s'installe, met l'app en cache puis appelle skipWaiting()
      : il prend le contrôle tout seul, sans action de l'utilisateur.
   3. L'app détecte le changement de contrôleur (controllerchange), se
      recharge (en attendant la fin d'une saisie en cours) et affiche un
      pop-up "Mise à jour effectuée".

   Pour déclencher une mise à jour : il suffit de changer CACHE_VERSION.
   ════════════════════════════════════════════════════════════════════════ */

const CACHE_VERSION = 'marecette-v1.6.0';

function getAssets() {
  const base = self.registration.scope;
  return [
    base,
    base + 'index.html',
    base + 'manifest.json',
    base + 'icon-192.png',
    base + 'icon-512.png',
  ];
}

/* ── Installation ─────────────────────────────────────────────────────── */
self.addEventListener('install', function(event) {
  console.log('[SW] Nouvelle version détectée :', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(function(cache) { return cache.addAll(getAssets()); })
      .then(function() {
        /* Cache prêt : activation immédiate, sans attendre de clic. */
        console.log('[SW] Cache prêt, activation automatique');
        return self.skipWaiting();
      })
      .catch(function(err) { console.error('[SW] Échec mise en cache :', err); })
  );
});

/* ── Activation ───────────────────────────────────────────────────────── */
self.addEventListener('activate', function(event) {
  console.log('[SW] Activation :', CACHE_VERSION);
  event.waitUntil(
    caches.keys()
      .then(function(keys) {
        return Promise.all(
          keys
            .filter(function(key) { return key !== CACHE_VERSION; })
            .map(function(key) {
              console.log('[SW] Suppression ancien cache :', key);
              return caches.delete(key);
            })
        );
      })
      .then(function() { return self.clients.claim(); })
  );
});

/* ── Messages reçus de l'app ──────────────────────────────────────────── */
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] skipWaiting() demandé par l\'app');
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'GET_VERSION') {
    // Répond avec la version sur le port fourni par MessageChannel
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({ version: CACHE_VERSION });
    }
  }
});

/* ── Fetch : Cache First ──────────────────────────────────────────────── */
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);
  var isThirdParty = url.origin !== self.location.origin;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;

      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || isThirdParty) return response;
        var toCache = response.clone();
        caches.open(CACHE_VERSION).then(function(cache) {
          cache.put(event.request, toCache);
        });
        return response;
      }).catch(function() {
        return new Response(
          [
            '<!DOCTYPE html><html lang="fr"><head>',
            '<meta charset="UTF-8">',
            '<meta name="viewport" content="width=device-width,initial-scale=1">',
            '<title>MaRecette — Hors ligne</title>',
            '<style>body{font-family:sans-serif;background:#FDFAF5;color:#C4622D;',
            'display:flex;flex-direction:column;align-items:center;',
            'justify-content:center;min-height:100vh;text-align:center;padding:24px}',
            'h2{font-size:28px;margin-bottom:12px}p{color:#6B5D4F;max-width:320px;line-height:1.6}',
            '</style></head><body><h2>🍳 MaRecette</h2>',
            '<p>Vous êtes hors ligne.<br>Ouvrez l\'app une première fois en ligne',
            ' pour activer le mode hors ligne.</p></body></html>'
          ].join(''),
          { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
      });
    })
  );
});
