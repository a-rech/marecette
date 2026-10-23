# MaRecette — contexte pour une IA

> À lire en premier par Claude ou toute autre IA qui travaille sur ce dépôt. Ce fichier résume le projet, la façon de travailler avec Alex et le résultat attendu. Il complète le `README.md` (qui s'adresse aux utilisateurs) et ne le remplace pas.

## 1. Le projet en bref

- **MaRecette** : application web (PWA) de recettes de cuisine du quotidien, **en français**, installable sur mobile, qui fonctionne hors ligne. Toutes les données restent sur l'appareil (`localStorage`).
- Hébergée sur GitHub Pages (`https://a-rech.github.io/marecette/`, dépôt `a-rech/marecette`) et **utilisée aussi en local** (`python3 -m http.server 8000`).
- Le catalogue compte environ 460 recettes dans `recipes.js`. Les recettes créées dans l'appli sont stockées à part, mais ont **exactement le même format** que celles du catalogue.
- Projet frère : **Foyer** (gestion du foyer, `a-rech.github.io/foyer`). Une recette peut déjà lui être envoyée depuis la fenêtre de partage (**🏠 Envoyer vers Foyer**, `sendToFoyer()`, lien `FOYER_BASE_URL#mr=<recette>`), mais ce bouton est **réservé au mode admin**. La liste de courses et le menu de MaRecette restent propres à MaRecette.

## 2. Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Toute l'application : HTML, CSS et JavaScript (~400 Ko) |
| `recipes.js` | Catalogue : `const RECIPES = [...]`, **une recette par ligne** en JSON compact |
| `sw.js` | Service Worker : cache hors ligne, mises à jour (`CACHE_VERSION`) |
| `lib/` | `qrcode.min.js` (génération) et `jsqr.min.js` (lecture) des QR codes |
| `manifest.json`, `icon-*.png` | Configuration PWA |
| `README.md` | Présentation pour les utilisateurs |
| `prompt-import-recette-marecette.md` | Consignes à donner à une IA pour transcrire une recette (photo, lien, texte) en lien d'import |

Format d'une recette : `id, title, emoji, cat, origin, diff, prep, cook, portions, price (1-3), vegetarian, creator, ingredients [[nom, quantité, unité]], tags (ingrédients principaux), steps, acc (accompagnements), userCreated`. Catalogue : ids 1 à 9999. Créations de l'appli : ids à partir de 10000.

## 3. Comment travailler avec Alex

**Point de départ.** Alex fournit le dépôt en archive `.zip`. Il s'agit toujours de la version la plus récente : partir de cette archive, pas d'une version que tu aurais en mémoire. Si tu as livré des fichiers modifiés, vérifie que son archive les contient bien.

**Gros chantier : proposer avant de coder.** Pour une nouvelle fonctionnalité, Alex écrit souvent « des suggestions ou questions ? ». Il attend alors une analyse du code existant, une solution proposée avec des choix par défaut raisonnables, et quelques questions regroupées, numérotées, auxquelles il répond point par point. Il valide, puis tu codes. Les réponses « comme tu proposes » sont fréquentes : fais des propositions franches plutôt que des questions ouvertes.

**Petit ajustement précis : coder directement.** Quand la demande est claire (un style, un comportement), implémente-la et signale en fin de réponse les hypothèses que tu as faites, pour qu'il puisse les corriger.

**Livraison.**

1. Une courte explication de la solution retenue.
2. La liste des fichiers modifiés.
3. Le contenu **complet** uniquement des fichiers modifiés (en pratique : les fichiers livrés en pièces jointes).
4. Les instructions pour tester en local.
5. Les limites et les points à vérifier à la main.

Pas de fichier supplémentaire « pour expliquer » les modifications (ce fichier-ci a été demandé explicitement). **À chaque livraison qui modifie `index.html` ou `recipes.js`, augmente `CACHE_VERSION` dans `sw.js`** (format `marecette-vX.Y.Z`), sinon le Service Worker sert l'ancienne version en cache.

**Avant de livrer.** Analyse le code avant de modifier, respecte l'architecture existante, anticipe les effets de bord et teste réellement (voir § 7). Ne casse pas ce qui marche : une modification doit s'insérer dans la structure actuelle, pas la remplacer.

**Langue.** Français partout : interface, commentaires du code, échanges.

**Secrets.** Le code d'accès du mode admin ne s'écrit jamais en clair : ni dans un fichier, ni dans un commit, ni dans la mémoire d'une IA. Seule son empreinte (`ADMIN_HASH`) figure dans `index.html`, et le dépôt est public.

## 4. Ce qu'Alex attend

- **Simplicité et liberté.** Rien d'obligatoire : le semainier est facultatif, car un planning imposé a été jugé contraignant. Les nouveautés doivent rester discrètes tant qu'on ne les utilise pas.
- **Réversibilité.** Les actions importantes sont annulables (↶ Annuler dans le menu) ou demandent confirmation.
- **Respect strict du profil végétarien** quand il est actif : aucune recette avec viande ou poisson ne doit apparaître, nulle part.
- **La saison est un coup de pouce, pas une contrainte** : on la privilégie dans les tirages sans vider le choix.
- **Code simple et minimal.** Une application en fichier unique + données, JavaScript natif, **aucun framework, aucune étape de compilation**, peu de fichiers, pas de dépendance en ligne (hors polices Google). Tout doit fonctionner hors ligne et en local.
- **Cohérence visuelle et mobile d'abord.** Réutiliser les composants et les classes CSS existants (cartes `menu-item`, bandeaux dégradés, titres Playfair, variables de thème clair/sombre). Vérifier le rendu sur petit écran : pas de coupure disgracieuse (les pastilles « 🌿 De saison » et les durées ne doivent jamais se couper en deux).
- **Cohérence des données.** Catalogue et créations s'écrivent exactement de la même façon (mêmes champs, même ordre).
- **Documentation à jour.** Alex a demandé que le `README.md` et le message de bienvenue suivent les nouvelles fonctionnalités (saisons, création de menus…). Après une évolution visible, propose de les mettre à jour, ainsi que ce fichier.

## 5. Repères techniques (`index.html`)

- **Pages** : `page-home`, `search`, `catalogue`, `random`, `recipe`, `menu`, `menugen`, `lexique`, `import`. On navigue avec `navigateTo(id)` (empile dans `pageStack` + historique du navigateur), `goBack()` et `showPage(id)` (affiche sans empiler). Le bouton retour du téléphone est géré par `popstate`.
- **Données (`localStorage`)** : `marecette_favs`, `marecette_notes`, `marecette_user_recipes`, `marecette_menu`, `marecette_courses`, `marecette_menu_opts`, `marecette_veg_mode_v1` (profil végétarien), `marecette_excl_v1` (exclusions d'ingrédients), `marecette_prefs`, `marecette_welcome_hide`, `marecette_menugen_hist_v1` (recettes validées lors des 2 dernières générations de menu, non sauvegardée dans l'export).
- **Sauvegarde** : `BACKUP_VERSION = 3` ; export/import par fusion (créations, favoris, notes, menu, liste de courses).
- **Saison** : `SEASON_MONTHS` (liste d'ingrédients par mois), `isInSeason(r)` (un ingrédient principal figure dans la liste du mois), `renderSeasonBanner()`.
- **Profil végétarien** : `isVegProfile()`, `passesDietProfile(r)`, `toggleVegMode()`. Un seul réglage partagé par les Paramètres, la recherche par ingrédients et le générateur de menu. Tout changement passe par `onDietChanged()`.
- **Menu** : `_menu` = liste d'éléments `{ rid, portions, excl: [clés d'ingrédients décochés], day? }` ; `day` va de 0 (lundi) à 6 (dimanche) et son absence signifie « À prévoir ». `_menuOpts.week` indique si le semainier est affiché. Toujours appeler `_loadMenuData()` avant de lire `_menu`, et `_undoPush(libellé)` avant toute modification pour que l'annulation fonctionne ; sauvegarder avec `_saveMenuData()`.
- **Fiche recette** : `showRecipe(recipeId, swipeList, animDir, portionsMap)`. `portionsMap` (`{ idRecette: portions }`) impose les portions du menu à l'ouverture depuis Menu & courses ou le bandeau « Prévu aujourd'hui ». Il reste actif tant qu'on est sur la fiche (balayage, rafraîchissement) et s'efface dès qu'une recette est ouverte depuis ailleurs. Le sélecteur caché `#portions-selector` est lu par le mode Agrandir et par « Ajouter à la liste ».
- **Générateur de menu** : fonctions `menuGen*`, état `_gen`. Constantes `GEN_CATS` (catégories « dîner »), `GEN_COUNT` (5) et `GEN_MAX_PER_TYPE` (2). Le type de plat est déduit des rayons des ingrédients (`_genType`) car les `tags` du catalogue sont irréguliers. `_genIsDinner` écarte les fonds de pâte, sauces et tartes sucrées rangés dans les mêmes catégories.
- **Bandeau « Prévu aujourd'hui »** : `renderTodayBanner()`, appelé par `showPage('home')`. Visible seulement si le semainier est activé et qu'au moins une recette a le jour courant (lundi = 0).
- **Partage et import** : une recette voyage en JSON compact à clés courtes (`v, t, e, c, o, d, p, k, n, i, s, pr, vg, cr, a`), encodé en base64url : lien `SHARE_BASE_URL#r=…` ou code `mr1:…` (`buildSharePayload`, `normalizeImportedRecipe`). À l'import, `id`, `tags` (via `deriveTags`) et `userCreated` sont calculés par l'appli. **Le fichier `prompt-import-recette-marecette.md` doit rester synchronisé avec ce code** : 11 catégories (`f-cat`) et 36 origines (`f-culture`) du formulaire, difficultés en minuscules, limites de longueur (titre 100, ingrédient 80, unité 20, 60 étapes de 600 caractères, 80 ingrédients, 3 accompagnements de 40), adresse de l'appli. Si l'un change, mets l'autre à jour. Vérifié au 23/10/2026 : ils sont d'accord (seule l'origine « Salvadorienne », présente dans le catalogue mais absente du formulaire, n'est pas dans le prompt, ce qui est sans conséquence).
- **Mode admin** : champ « Accès avancé » en bas de Paramètres → À propos (`renderAdminBox`, `adminUnlock`, `adminLock`). `isAdmin()` compare `localStorage['marecette_admin_v1']` à `ADMIN_HASH` (SHA-256 de `'marecette-admin-v1:' + code`, calculé par `_sha256Hex`, sans Web Crypto pour fonctionner aussi hors https). `featureOn('nom')` renvoie vrai pour tous si `nom` n'est pas dans `ADMIN_FEATURES`, et seulement en admin s'il y figure. Aujourd'hui : `foyer` (bouton Envoyer vers Foyer) et `catalogue-copy` (bouton Copier pour le catalogue). **Tester une nouveauté** : ajouter son nom à `ADMIN_FEATURES` et l'envelopper dans `featureOn('nom')` ; **l'ouvrir à tous** : retirer le nom de la liste. **Changer de code** : `python3 -c "import hashlib;print(hashlib.sha256(('marecette-admin-v1:'+input('code: ')).encode()).hexdigest())"`, puis remplacer `ADMIN_HASH` (les accès admin déjà activés sont alors désactivés). Ce n'est pas une vraie sécurité : cela masque des boutons, rien de plus. Le drapeau n'est pas inclus dans la sauvegarde.
- **Message de bienvenue** : `#welcome-overlay` ; il est réaffichable depuis Paramètres → À propos.

## 6. Décisions de conception à ne pas défaire sans l'accord d'Alex

- Page de création de menu : **aucun jour**. Les recettes validées arrivent dans « À prévoir » et on **ajoute** à l'existant sans le remplacer. Les jours se gèrent uniquement dans Menu & courses.
- Générateur : 5 propositions au départ, mais on peut valider avec plus ou moins ; relancer remplace par une recette **du même type** ; favoris privilégiés ; propositions perdues si on quitte la page ; portions de base réglées à l'étape courses ; ingrédients du placard décochés d'office.
- Bandeau « Prévu aujourd'hui » : masqué si le semainier est désactivé, même si des jours sont enregistrés.
- Partage d'une recette : texte lisible pour toutes les recettes ; QR code et lien réservés aux créations.
- Mises à jour : c'est l'utilisateur qui clique sur « Mettre à jour », rien n'est appliqué sans son accord.
- Profil alimentaire : végétarien uniquement (pas d'autres régimes).
- Mode admin : activé par un code saisi dans Paramètres → À propos (champ discret) ; il masque aux utilisateurs lambda « Envoyer vers Foyer » et « Copier pour le catalogue », et sert à tester des nouveautés avant de les ouvrir à tous. Le README public n'en parle pas.

## 7. Tester

Le `README.md` évoque un dossier `tests/` (Puppeteer) qui n'était pas dans l'archive fournie. À défaut, une méthode légère fonctionne : **jsdom** (`npm i jsdom`) charge `index.html` et `recipes.js`, puis on appelle directement les fonctions de l'appli et on vérifie le DOM et `localStorage`. Quelques pièges rencontrés :

- avec `runScripts: 'outside-only'`, les `onclick` en ligne ne s'exécutent pas : appeler la fonction (`menuGenOpen()`…) ;
- il faut simuler `navigator.serviceWorker` et `window.scrollTo` ;
- appeler `window.onload()` puis fermer l'écran de bienvenue, qui bloque le balayage entre recettes ;
- vérifier la syntaxe du script principal avec `node --check` après chaque modification.

Les modifications d'`index.html` (fichier volumineux) se font par remplacements ciblés avec des ancres uniques, en contrôlant que chaque ancre n'apparaît qu'une fois.

## 8. Pistes non engagées

- Envoi du menu ou de la liste de courses vers Foyer (aujourd'hui, seules les recettes peuvent lui être envoyées).
- Réintégrer ou régénérer le dossier `tests/` dans le dépôt.
- Autres critères pour le générateur de menu (temps maximum, budget) : écartés pour l'instant.

## 9. Historique résumé

1. Création de recettes, adaptation, swipe entre fiches, recette aléatoire.
2. Recherche par ingrédients (sélection / exclusion), partage par texte, QR code et lien, import.
3. Message de bienvenue, pseudo, paramètres, sauvegarde / restauration et rappel de sauvegarde.
4. Menu & courses : bac à sable, semainier facultatif, rayons, placard, mode magasin, annulation.
5. Minuteurs et cases à cocher dans les étapes, mode Agrandir (thème, écran allumé).
6. Séparation des données (`recipes.js`) et des bibliothèques QR (`lib/`), harmonisation catalogue / créations (ids 10000+).
7. Accueil restylé, bandeau de saison, badge et filtre « De saison », profil végétarien global.
8. Générateur de menu (« ✨ Créer un menu »), bandeau « Prévu aujourd'hui », reprise des portions du menu sur la fiche.
9. Prompt d'import par IA documenté, mode admin (outils réservés et fonctions en test).

## Entretien de ce fichier

Mets-le à jour quand une décision de conception change ou qu'une fonctionnalité structurante est ajoutée : § 5 (repères), § 6 (décisions) et § 9 (historique). Garde-le court : c'est un point d'entrée, pas une documentation exhaustive.
