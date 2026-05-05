# Drama — Dashboard de production

Dashboard de suivi pour le jeu narratif **Drama** (repo
[teiki5320/drama](https://github.com/teiki5320/drama)).

**Live** : https://teiki5320.github.io/Dash/

## Ce qu'on suit

- **Timeline 208 semaines** (4 saisons) — état écrit / à écrire de chaque scène
- **Personnages** — apparitions par saison, première/dernière semaine
- **Photos** — 27 images existantes (référencées depuis `drama/ressources`) +
  liste des photos à shooter pour les beats majeurs restants
- **Lore figé** — garde-fou des 3 Lu (Senior / Mingzhe / Huan) pour pas
  les confondre, faits historiques 2002-2030
- **4 endings** (Justice / Argent / Vengeance / Paix)
- **Batches d'écriture** B1-B6 (priorité Saison 1)
- **Export JSON pivot** par scène (format décrit dans `drama/ROADMAP.md` §5)

## Tabs

- **Vue d'ensemble** : KPIs globaux, batches, prochains beats majeurs à écrire
- **Saison 1-4** : sous-onglets Timeline / Personnages / Photos
- **Lore & Endings** : faits figés, garde-fou Lu, fins

## Persistance

Les modifications locales (statut des photos, notes par semaine) sont
sauvées en `localStorage` du navigateur. Les données « source de
vérité » (timeline, personnages) viennent du fichier statique
`js/data.js`, qui est **synchro manuelle** avec
[`drama/ROADMAP.md`](https://github.com/teiki5320/drama/blob/main/ROADMAP.md).

Quand le ROADMAP évolue, mettre à jour `js/data.js` à la main.

## Stack

HTML + CSS + JS vanilla. Aucun build, aucun package.json. Déployé sur
GitHub Pages depuis `main` à la racine.

## Dev local

```sh
git clone git@github.com:teiki5320/Dash.git ~/Code/dash
open ~/Code/dash/index.html
```

## Historique

- Avant le 28 avril 2026 : dashboard auto-généré (cron + GitHub Actions)
- Du 28 avril au mai 2026 : console admin Kultiva
- Depuis mai 2026 : dashboard de production Drama (ce repo)

L'historique git est conservé.
