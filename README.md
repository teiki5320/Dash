# Kultiva Admin

Console privée pour publier du contenu et gérer Kultivaprix / Kultiva.

**Live** : https://teiki5320.github.io/Dash/

## Outils

- **Publier un article** ([publier-article.html](publier-article.html)) — article long pour
  [kultivaprix.com/actualites](https://kultivaprix.com/actualites). Insert dans la table
  Supabase `articles` + upload de l'image dans le bucket Storage `news-images`.
- **Publier une news app + Instagram** — _à venir_.
- **Stats & santé** — _à venir_.

## Setup

Tout tourne côté navigateur. Pas de build, pas d'install.

1. Ouvre `https://teiki5320.github.io/Dash/`.
2. Première fois : déplie « Configuration Supabase », colle l'URL projet
   (`https://vkiwkeknfzwdvufcqbrp.supabase.co`) et la `service_role key`
   (Supabase → Project Settings → API). C'est stocké en `localStorage` du navigateur.
3. Remplis le formulaire et clique « Publier ».

La `service_role key` donne tous les droits sur la base : ne jamais la partager,
ne jamais l'utiliser sur un appareil partagé.

## Dev local

```sh
git clone git@github.com:teiki5320/Dash.git ~/Documents/Dash
open ~/Documents/Dash/index.html
```

GitHub Pages publie le contenu de `main` à la racine.

## Historique

Avant le 28 avril 2026, ce repo hébergeait un dashboard auto-généré (cron + GitHub Actions).
Le contenu a été remplacé par cette console admin Kultiva — l'historique git est conservé.
