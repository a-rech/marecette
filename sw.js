/* ════════════════════════════════════════════════════════════════════════
   MaRecette — Service Worker
   ────────────────────────────────────────────────────────────────────────
   Stratégie : Cache First + notification de mise à jour.

   Fonctionnement de la mise à jour :
   1. Le navigateur détecte que sw.js a changé (CACHE_VERSION ou contenu).
   2. Le nouveau SW s'installe mais NE prend PAS le contrôle tout de suite
      — il entre en état "waiting" pour ne pas casser la session en cours.
   3. Il envoie un message 'SW_WAITING' à tous les onglets ouverts.
   4. L'app reçoit ce message et affiche le bouton flottant "Mettre à jour".
   5. Quand l'utilisateur clique, l'app envoie 'SKIP_WAITING' au SW.
   6. Le SW appelle skipWaiting(), prend le contrôle, et l'app se recharge.

   Pour déclencher une mise à jour : il suffit de changer CACHE_VERSION.
   ════════════════════════════════════════════════════════════════════════ */

const CACHE_VERSION = 'marecette-v1.4.5';

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
        /* On NE fait PAS skipWaiting() ici — le SW reste en état "waiting".
           C'est l'utilisateur qui décidera via le bouton flottant.        */
        console.log('[SW] En attente d\'activation (waiting)');

        /* Notifier tous les onglets ouverts qu'une mise à jour est prête  */
        self.clients.matchAll({ includeUncontrolled: true }).then(function(clients) {
          clients.forEach(function(client) {
            client.postMessage({ type: 'SW_WAITING', version: CACHE_VERSION });
          });
        });
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
    console.log('[SW] skipWaiting() déclenché par l\'utilisateur');
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
