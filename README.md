# Sailscents — Du palais au nez

Plateforme e-commerce premium : Next.js 15 (App Router) + Payload CMS 3 (embarqué) + PostgreSQL.

Voir `ARCHITECTURE.md` et `PHASE-2-CMS-CONTENU-SEO.md` pour le raisonnement d'architecture, et `PROGRESS.md` pour l'état d'avancement détaillé.

## Démarrage local

1. Copier `.env.example` en `.env` et renseigner :
   - `DATABASE_URI` — chaîne de connexion PostgreSQL (Neon recommandé, offre gratuite)
   - `PAYLOAD_SECRET` — chaîne aléatoire longue (`openssl rand -base64 32`)
2. Installer les dépendances : `npm install`
3. Lancer le serveur de développement : `npm run dev`
4. Ouvrir [http://localhost:3000](http://localhost:3000) (site) et [http://localhost:3000/admin](http://localhost:3000/admin) (back-office Payload — la création du premier compte administrateur est proposée automatiquement).

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` / `npm run start` — build et démarrage en production
- `npm run lint` — vérification ESLint
- `npm run generate:types` — génère `src/payload-types.ts` à partir des collections Payload (nécessite une base connectée)
- `npm run generate:importmap` — régénère la carte d'import de l'admin après ajout de composants personnalisés

## Structure

- `src/collections/` — collections Payload (produits, univers, ateliers, articles, pages, FAQ...)
- `src/fields/` — champs réutilisables (`slug`, `seo`)
- `src/payload.config.ts` — configuration Payload (base de données, collections, éditeur)
- `src/app/(frontend)/` — pages publiques du site
- `src/app/(payload)/` — intégration de l'admin Payload dans Next.js
- `src/lib/` — utilitaires (client Payload, métadonnées SEO, Stripe)
