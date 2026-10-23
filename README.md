# 🥘 MaRecette

**Cuisine du quotidien** — Trouvez des recettes compatibles avec vos ingrédients, cuisinez de saison, composez votre menu de la semaine et votre liste de courses, créez et partagez vos propres recettes, sauvegardez vos favoris. Installable sur mobile comme une vraie application.

[![Ouvrir l'application](https://img.shields.io/badge/▶%20Ouvrir%20l'application-C4622D?style=for-the-badge)](https://a-rech.github.io/marecette/)

---

## Fonctionnalités

| | |
|---|---|
| 🔍 **Recherche par ingrédients** | Sélectionnez vos ingrédients (✔) et **excluez** ceux dont vous ne voulez pas (✕). Le nombre de recettes trouvées s'affiche en direct dans le bouton *Rechercher* |
| 📚 **Catalogue complet** | Plus de 460 recettes, filtrées par type de plat ou par culture culinaire (difficulté, prix, temps, végétarien, de saison) |
| 🌿 **De saison** | Un bandeau sur l'accueil change chaque mois : ingrédients de saison cliquables (ils ouvrent la recherche avec cet ingrédient) et une idée de recette à faire défiler. Les recettes du moment portent le badge « 🌿 De saison » et un filtre dédié est dans le catalogue |
| 🥦 **Profil végétarien** | À activer dans *Paramètres* (ou avec le bouton « Mode végé » de la recherche par ingrédients) : catalogue, recherche, recette aléatoire, recette de saison et menus générés ne proposent plus que des recettes végétariennes (œufs et produits laitiers conservés) |
| 🎲 **Recette aléatoire** | Un plat salé ou sucré au hasard, avec navigation par swipe dans toute la liste |
| 🛒 **Menu & courses** | Bouton « Ajouter à la liste » sur chaque fiche : les recettes prévues (sans jour) forment le menu, avec un semainier facultatif (affectation à un jour). La liste de courses fusionne automatiquement les ingrédients (portions ajustables, ingrédients décochables, ajouts manuels), se range par rayon ou de A à Z, met les basiques (sel, huile, farine…) dans un bloc « Placard » à vérifier, et se partage en texte. Un **mode magasin** garde l'écran allumé avec de grosses cases et replie les rayons terminés. Un bouton **↶ Annuler** corrige les erreurs. Le menu et la liste sont inclus dans l'export/import des données |
| 📅 **Créer un menu** | Le bouton **✨ Créer un menu**, à côté du semainier, propose 5 dîners variés et de saison. Vous relancez ou retirez les recettes qui ne vous plaisent pas, vous en ajoutez si besoin, puis vous choisissez pour chacune les ingrédients à acheter (voir [Créer un menu](#créer-un-menu)) |
| 🗓️ **Prévu aujourd'hui** | Si le semainier est activé et qu'une recette est prévue pour le jour même, un bandeau en haut de l'accueil la liste (cliquable). Plusieurs recettes s'empilent |
| ✨ **Créations & adaptations** | Créez vos recettes, ou adaptez une recette du catalogue. Retrouvez-les dans *Mes créations* (badge ✨ Création) |
| 📤 **Partage & import** | Partagez une recette en **texte lisible**, ou en **QR code / lien** pour vos créations. Importez celles de vos proches par scan (caméra ou image), lien ou code, ou faites transcrire une recette (photo, lien, texte) par une IA grâce au [prompt d'import](#transcrire-une-recette-avec-une-ia) |
| ❤️ **Favoris** | Sauvegardés localement, affichés en tête du catalogue |
| 📝 **Notes personnelles** | Ajoutez vos astuces sur chaque fiche recette |
| 👥 **Portions ajustables** | Boutons − / + sur la fiche : les quantités sont recalculées. Une recette ouverte depuis le menu ou depuis « Prévu aujourd'hui » s'affiche directement avec les portions choisies dans le menu |
| 🔥 **Mode Agrandir** | Ingrédients et étapes en grand, écran maintenu allumé pendant que vous cuisinez. Les durées citées dans les étapes (« 15 minutes ») deviennent des minuteurs ⏱, et une case à cocher à droite de chaque ingrédient permet de les valider au fur et à mesure |
| 💾 **Sauvegarde & restauration** | Export / import d'un fichier `.json` : créations, favoris, notes, menu et liste de courses, fusionnés sans rien écraser |
| 🎨 **Personnalisation** | Pseudo (salutation selon l'heure), thème clair / sombre, taille de police, profil alimentaire |
| 💡 **Lexique** | Techniques, ingrédients et matériel expliqués (réhydrater des PST, lier une sauce, choisir son riz…), avec recherche. Accessible depuis la recherche par ingrédients et depuis chaque fiche recette |
| 📱 **PWA** | Installable sur mobile, fonctionne hors ligne, mise à jour en un clic |

---

## De saison

Chaque mois a sa liste d'ingrédients de saison (définie dans `index.html`, constante `SEASON_MONTHS`). Une recette est dite **de saison** quand l'un de ses ingrédients principaux figure dans la liste du mois en cours. Ce critère alimente :

- le bandeau de l'accueil (ingrédients au hasard parmi ceux du mois, recette de saison au hasard) ;
- le badge « 🌿 De saison » sur les cartes de recettes ;
- le filtre « De saison » du catalogue ;
- le tirage du générateur de menu, qui **privilégie** la saison sans l'imposer.

Le profil végétarien est toujours respecté : en mode végétarien, le bandeau ne propose que des recettes végétariennes.

---

## Créer un menu

Dans *Menu & courses*, le bouton **✨ Créer un menu** (à côté du bouton Semainier) ouvre une page de propositions, puis une page de courses.

**1. Propositions.** L'application tire 5 dîners parmi les plats principaux, plats mijotés, soupes, tartes et salades :

- la **saison** est privilégiée (tirage pondéré, pas un filtre strict) et les **favoris** ont plus de chances de sortir ;
- les **types de plat** sont variés : volaille, viande, poisson, végétarien, soupe, tarte, salade, avec au plus 2 recettes du même type, et si possible une recette végétarienne et un poisson ;
- les recettes déjà au menu et celles validées lors des 2 dernières générations ne reviennent pas ;
- le **profil végétarien** est respecté sans exception, et le bouton « 🥦 Mode végé » de la page permet de le changer sans quitter la page ;
- les exclusions d'ingrédients de la recherche sont respectées.

Sur chaque carte, **🔄** propose une autre recette du même type et **✕** la retire. « **＋ Ajouter une proposition** » en ajoute une, « **🔄 Tout relancer** » refait tout le tirage. On peut valider avec plus ou moins de 5 recettes. Aucun jour n'est choisi à cette étape. Quitter la page sans valider abandonne les propositions.

**2. Courses.** Chaque recette est un bloc dépliable : portions réglables (− / +, par défaut celles de la recette) et liste d'ingrédients à cocher. Les basiques du placard (sel, huile…) sont décochés d'office.

**3. Validation.** Les recettes sont ajoutées au menu existant dans « À prévoir » (sans jour), avec leurs portions et leurs ingrédients décochés. Les jours se choisissent ensuite dans le semainier. Un seul **↶ Annuler** retire tout le lot.

---

## Partager une recette

Sur la fiche d'une recette, le bouton **📤 Partager** ouvre :

- **Texte à partager** — la recette lisible (ingrédients et étapes), à envoyer par SMS, mail ou messagerie. Disponible pour **toutes** les recettes.
- **QR code** et **lien** — réservés à vos **créations** (les recettes du catalogue sont déjà dans l'application de vos proches). Scanné avec l'appareil photo du téléphone, le QR code ouvre MaRecette et propose d'ajouter la recette.

Pour **importer** une recette : *Catalogue* → **✨ Créer** → **Importer une recette** (scan caméra, image, lien ou code collé). Les recettes reçues arrivent dans *Mes créations*, après un aperçu et une confirmation.

Une recette très longue peut être trop dense pour un QR code : utilisez alors le lien ou le texte.

### Transcrire une recette avec une IA

Le fichier `prompt-import-recette-marecette.md` contient les consignes à donner à une IA (capable d'exécuter du code) avec une **photo**, un **lien** ou un **texte** de recette. L'IA remplit la fiche selon les règles de l'application et renvoie un **lien** et un **code `mr1:`** à ouvrir ou à coller dans *Importer une recette* : aperçu, puis ajout dans *Mes créations*. Sans exécution de code, elle fournit seulement le JSON de la recette.

### Format des liens et des codes

Une recette est un objet JSON compact encodé en base64url :

- Lien : `https://a-rech.github.io/marecette/#r=<données>` (la partie après `#` n'est jamais envoyée au serveur)
- Code : `mr1:<données>`

---

## Sauvegarder vos données

*Paramètres → Données* : **Exporter** télécharge un fichier `marecette-sauvegarde-AAAA-MM-JJ.json` (créations, favoris, notes, menu et liste de courses). **Importer** le restaure par **fusion** : rien n'est supprimé, une création déjà présente n'est pas dupliquée, et une note locale différente est conservée à côté de la note importée.

Toutes vos données restent **sur votre appareil** (`localStorage`) : rien n'est envoyé à un serveur.

---

## Installer l'application

### Android

1. Ouvrez l'URL dans **Chrome**
2. Appuyez sur le menu **⋮** en haut à droite
3. Sélectionnez **"Ajouter à l'écran d'accueil"**
4. Cliquer sur **"Installer"**

### iPhone / iPad

1. Ouvrez l'URL dans **Safari**
2. Appuyez sur l'icône **Partager** en bas de l'écran
3. Sélectionnez **"Sur l'écran d'accueil"**
4. Confirmez — l'icône apparaît sur votre écran

---

## Mises à jour

Quand une nouvelle version est disponible, un bouton **🔄 Mettre à jour** apparaît : un clic recharge l'application. Rien n'est appliqué sans votre accord.

Côté développement, il suffit de changer `CACHE_VERSION` dans `sw.js` pour déclencher la mise à jour chez les utilisateurs.

---

## Structure du projet

```
├── index.html       Application (HTML + CSS + JS)
├── recipes.js       Données du catalogue (recettes, accompagnements, prix, végétarien)
├── lib/
│   ├── qrcode.min.js  Génération des QR codes (qrcode-generator)
│   └── jsqr.min.js    Lecture des QR codes (jsQR)
├── tests/           Tests automatiques (développement uniquement, voir ci-dessous)
├── manifest.json    Configuration PWA
├── CONTEXTE-IA.md   Présentation du projet et des attentes, pour Claude ou une autre IA
├── prompt-import-recette-marecette.md  Consignes pour faire transcrire une recette par une IA (lien d'import)
├── sw.js            Service Worker — cache hors ligne et mises à jour
├── icon-192.png     Icône 192 x 192 px
└── icon-512.png     Icône 512 x 512 px
```

---

## Tests automatiques (développement)

Le dossier `tests/` rejoue en quelques secondes les vérifications faites à la main après chaque modification (recherche, normalisation, sauvegarde, minuteurs, mode magasin, QR codes, mode hors ligne…). Il ne sert pas à utiliser l'application.

```bash
cd tests
npm install     # une seule fois (puppeteer-core, sans télécharger de navigateur)
npm test        # nécessite Chrome ou Chromium (sinon : CHROME_PATH=/chemin/vers/chrome npm test)
```

---

## Lancer en local

Le Service Worker et la caméra exigent `http://localhost` ou HTTPS (pas `file://`). Depuis le dossier du projet :

```bash
python3 -m http.server 8000
```

Puis ouvrez `http://localhost:8000`. Les liens de partage pointent toujours vers `a-rech.github.io/marecette`, même en test local.

---

## Technologies

- HTML / CSS / JavaScript — aucun framework, aucune étape de compilation
- PWA : Service Worker + Web App Manifest
- `localStorage` pour les favoris, notes, créations, préférences et exclusions d'ingrédients
- QR codes (générés et lus hors ligne) grâce à deux bibliothèques placées dans `lib/` :
  - [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (Kazuhiko Arase, licence MIT)
  - [jsQR](https://github.com/cozmo/jsQR) (Cosmo Wolfe, licence Apache-2.0)
- Seules les polices Google Fonts sont chargées en ligne
