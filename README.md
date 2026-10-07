# 🥘 MaRecette

**Cuisine du quotidien** — Trouvez des recettes compatibles avec vos ingrédients, explorez le catalogue, créez et partagez vos propres recettes, sauvegardez vos favoris. Installable sur mobile comme une vraie application.

[![Ouvrir l'application](https://img.shields.io/badge/▶%20Ouvrir%20l'application-C4622D?style=for-the-badge)](https://a-rech.github.io/marecette/)

---

## Fonctionnalités

| | |
|---|---|
| 🔍 **Recherche par ingrédients** | Sélectionnez vos ingrédients (✔) et **excluez** ceux dont vous ne voulez pas (✕). Le nombre de recettes trouvées s'affiche en direct dans le bouton *Rechercher* |
| 📚 **Catalogue complet** | Plus de 370 recettes, filtrées par type de plat ou par culture culinaire (difficulté, prix, temps, végétarien) |
| 🎲 **Recette aléatoire** | Un plat salé ou sucré au hasard, avec navigation par swipe dans toute la liste |
| 🛒 **Menu & courses** | Bouton « Ajouter à la liste » sur chaque fiche : les recettes prévues (sans jour) forment le menu, avec un semainier facultatif (affectation à un jour). La liste de courses fusionne automatiquement les ingrédients (portions ajustables, ingrédients décochables, ajouts manuels), se range par rayon ou de A à Z, met les basiques (sel, huile, farine…) dans un bloc « Placard » à vérifier, et se partage en texte. Le menu et la liste sont inclus dans l'export/import des données |
| ✨ **Créations & adaptations** | Créez vos recettes, ou adaptez une recette du catalogue. Retrouvez-les dans *Mes créations* (badge ✨ Création) |
| 📤 **Partage & import** | Partagez une recette en **texte lisible**, ou en **QR code / lien** pour vos créations. Importez celles de vos proches par scan (caméra ou image), lien ou code |
| ❤️ **Favoris** | Sauvegardés localement, affichés en tête du catalogue |
| 📝 **Notes personnelles** | Ajoutez vos astuces sur chaque fiche recette |
| 👥 **Portions ajustables** | Boutons − / + sur la fiche : les quantités sont recalculées |
| 🔥 **Mode Agrandir** | Ingrédients et étapes en grand, écran maintenu allumé pendant que vous cuisinez |
| 💾 **Sauvegarde & restauration** | Export / import d'un fichier `.json` : créations, favoris et notes, fusionnés sans rien écraser |
| 🎨 **Personnalisation** | Pseudo (salutation selon l'heure), thème clair / sombre, taille de police |
| 💡 **Lexique** | Les termes de cuisine expliqués |
| 📱 **PWA** | Installable sur mobile, fonctionne hors ligne, mise à jour en un clic |

---

## Partager une recette

Sur la fiche d'une recette, le bouton **📤 Partager** ouvre :

- **Texte à partager** — la recette lisible (ingrédients et étapes), à envoyer par SMS, mail ou messagerie. Disponible pour **toutes** les recettes.
- **QR code** et **lien** — réservés à vos **créations** (les recettes du catalogue sont déjà dans l'application de vos proches). Scanné avec l'appareil photo du téléphone, le QR code ouvre MaRecette et propose d'ajouter la recette.

Pour **importer** une recette : *Catalogue* → **✨ Créer** → **Importer une recette** (scan caméra, image, lien ou code collé). Les recettes reçues arrivent dans *Mes créations*, après un aperçu et une confirmation.

Une recette très longue peut être trop dense pour un QR code : utilisez alors le lien ou le texte.

### Format des liens et des codes

Une recette est un objet JSON compact encodé en base64url :

- Lien : `https://a-rech.github.io/marecette/#r=<données>` (la partie après `#` n'est jamais envoyée au serveur)
- Code : `mr1:<données>`

---

## Sauvegarder vos données

*Paramètres → Données* : **Exporter** télécharge un fichier `marecette-sauvegarde-AAAA-MM-JJ.json` (créations, favoris, notes). **Importer** le restaure par **fusion** : rien n'est supprimé, une création déjà présente n'est pas dupliquée, et une note locale différente est conservée à côté de la note importée.

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
├── index.html       Application complète (HTML + CSS + JS)
├── manifest.json    Configuration PWA
├── sw.js            Service Worker — cache hors ligne et mises à jour
├── icon-192.png     Icône 192 x 192 px
└── icon-512.png     Icône 512 x 512 px
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
- QR codes (générés et lus hors ligne) grâce à deux bibliothèques intégrées dans `index.html` :
  - [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (Kazuhiko Arase, licence MIT)
  - [jsQR](https://github.com/cozmo/jsQR) (Cosmo Wolfe, licence Apache-2.0)
- Seules les polices Google Fonts sont chargées en ligne
