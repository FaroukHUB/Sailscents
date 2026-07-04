# Sailscents — Avancement (Phase 3 : base technique réelle)

Suite de `ARCHITECTURE.md` et `PHASE-2-CMS-CONTENU-SEO.md`. Ce document remplace tout futur aller-retour de contexte : il décrit précisément ce qui existe dans le dépôt aujourd'hui.

Stack posée : **Next.js 15.4.11 (App Router) + Payload CMS 3.85.2 (embarqué) + PostgreSQL + Stripe (squelette)**, testée de bout en bout (build, admin, création de contenu, rendu front, sitemap) avant ce commit.

---

## 1. Ce qui a été créé

### Projet & configuration
- Projet Next.js 15 initialisé (TypeScript, App Router, Tailwind v4, ESLint).
- Next.js **volontairement fixé à `15.4.11`** (pas la dernière version 15.5/16 installée par défaut) car c'est la plage exacte supportée par Payload CMS `3.85.2`.
- Payload CMS 3 installé et intégré dans le même projet Next.js (`@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`), avec `withPayload()` dans `next.config.ts`.
- Alias `@payload-config` configuré (`tsconfig.json`) vers `src/payload.config.ts`.

### Payload CMS — 11 collections + champs SEO réutilisables
- `users` (auth + rôles), `media` (upload, alt obligatoire), `categories` (univers), `productCollections`, `products`, `pages` (page builder à blocs), `articles` (journal), `workshops` (ateliers + sessions), `faqs`, `redirects`, `orders` (squelette).
- Champ **`slug`** réutilisable (`src/fields/slug.ts`) : généré automatiquement depuis le titre si laissé vide, normalisé, unique.
- Groupe **`seo`** réutilisable (`src/fields/seo.ts`) appliqué à `products`, `categories`, `productCollections`, `pages`, `articles`, `workshops` : `metaTitle`, `metaDescription`, `ogImage`, `canonical`, `noIndex`, `structuredData` — exactement les champs demandés.
- Rôles utilisateurs Payload : Super Admin, Gérant boutique, Éditeur de contenu, Support client, avec `access control` empêchant un non-Super-Admin de modifier les rôles.

### Front (App Router)
Routes créées et **testées en local** (réponses HTTP 200) :
`/`, `/boutique`, `/boutique/[category]`, `/boutique/[category]/[product]`, `/collections`, `/collections/[slug]`, `/ateliers`, `/ateliers/[slug]`, `/journal`, `/journal/[slug]`, `/faq`, `/[slug]` (pages légales/statiques génériques).
Chaque route dynamique lit les données via la Local API Payload, génère ses métadonnées (`generateMetadata`) à partir du groupe `seo`, et injecte le JSON-LD pertinent (`Product`, `Event`, `BlogPosting`, `FAQPage`).

### SEO
- `src/app/sitemap.ts` — sitemap dynamique généré depuis les collections publiées (exclut les documents `noIndex`).
- `src/app/robots.ts` — exclut `/admin`, `/api`, `/panier`, `/commande`, `/compte`, `/recherche`.
- `src/lib/seo.ts` — construit un objet `Metadata` Next.js complet (title, description, canonical, robots, Open Graph, Twitter Card) à partir du groupe SEO d'un document, avec repli sur des valeurs par défaut.

### Base visuelle minimaliste
- Palette mauve profond / or mat en variables CSS (`src/app/(frontend)/globals.css`).
- Typographies : Cormorant Garamond (titres) + Jost (texte courant), via `next/font/google`.
- Layout global avec en-tête (navigation simple), pied de page (liens légaux), sans animation lourde.
- Page d'accueil minimaliste (message de marque + CTA vers la boutique) — pas de design final, juste une base cohérente.

### Stripe (architecture prête, intégration non finalisée)
- `src/lib/stripe.ts` — client Stripe partagé.
- `src/app/api/checkout/route.ts` — squelette de création de session Stripe Checkout.
- `src/app/api/webhooks/stripe/route.ts` — squelette de webhook (vérification de signature + création de commande via la Local API), avec TODO explicites pour la logique de stock et le détail des articles.

### Documentation
- `ARCHITECTURE.md`, `PHASE-2-CMS-CONTENU-SEO.md` (phases précédentes).
- Ce fichier, `PROGRESS.md`.
- `README.md` mis à jour avec les instructions de démarrage réelles.

---

## 2. Commandes à lancer

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
# renseigner DATABASE_URI (Neon) et PAYLOAD_SECRET (openssl rand -base64 32)

# 3. Lancer le serveur de développement
npm run dev
# -> site : http://localhost:3000
# -> admin Payload : http://localhost:3000/admin (création du premier compte proposée automatiquement)

# 4. Build de production (validé sans base de données connectée)
npm run build && npm run start
```

**Validation effectuée dans cet environnement** : une base PostgreSQL locale temporaire a été utilisée pour vérifier que Payload s'initialise, que l'admin se charge, qu'un compte admin et un produit de test ont pu être créés via l'API REST, et que la fiche produit + le sitemap reflètent bien ces données. Cette base locale n'existe pas en dehors de cette session — remplacez `DATABASE_URI` par votre instance Neon.

---

## 3. Fichiers importants

| Fichier | Rôle |
|---|---|
| `src/payload.config.ts` | Configuration centrale Payload (collections, base de données, éditeur) |
| `src/collections/*.ts` | Les 11 collections |
| `src/fields/seo.ts`, `src/fields/slug.ts` | Champs réutilisables |
| `src/app/(payload)/**` | Intégration admin Payload dans Next.js (ne pas modifier sans lire la doc Payload) |
| `src/app/(frontend)/**` | Pages publiques du site |
| `src/lib/payload.ts` | Client Payload Local API |
| `src/lib/seo.ts` | Générateur de métadonnées Next.js à partir du groupe SEO |
| `src/lib/stripe.ts` + `src/app/api/checkout`, `src/app/api/webhooks/stripe` | Squelette Stripe |
| `src/types/content.ts` | Types front provisoires (en attendant `generate:types`) |
| `next.config.ts` | Wrapper `withPayload()` |
| `.env.example` | Variables d'environnement requises |

**Compatibilité Vercel** : la collection `media` bascule automatiquement sur `@payloadcms/storage-vercel-blob` dès que `BLOB_READ_WRITE_TOKEN` est présent dans l'environnement (le disque local reste utilisé en développement). Nécessaire car le système de fichiers de Vercel est éphémère.

---

## 4. Ce qui reste à faire

- **Connecter une vraie base Neon** et exécuter `npm run generate:types` pour remplacer les types provisoires de `src/types/content.ts` par les types Payload générés.
- **Globals Payload** (`site-settings`, `seo-defaults`, `navigation`, `homepage`) évoqués en Phase 2 — pas encore créés, pour rester minimal à ce stade. À ajouter dès que le contenu réel arrive.
- **Intégration Stripe complète** : panier (état client), vérification des prix/stocks côté serveur avant paiement, détail des articles dans le webhook, décrément du stock.
- **Design final** : la base visuelle actuelle est volontairement minimaliste (pas d'animation, pas de mise en page travaillée) — c'est la Phase 4 (intégration design premium, navigation à grands panneaux).
- **ISR/SSG** : toutes les pages sont actuellement en rendu dynamique (`force-dynamic`) pour ne pas dépendre d'une base au moment du build. À basculer vers `generateStaticParams` + `revalidate` une fois la base de production connectée, pour la performance et le SEO.
- **Espace membre, wishlist, fidélité, multilingue, IA** : hors périmètre de cette phase, prévus dans l'architecture mais non commencés.
- **Déploiement Vercel** : projet non encore déployé — nécessite de configurer les variables d'environnement (`DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`) sur Vercel.

---

## 5. Points bloquants / à noter

- **`npm run generate:types` échoue actuellement dans cet environnement** avec une erreur Node.js (`ERR_REQUIRE_ASYNC_MODULE`) liée à l'interaction entre le chargeur `tsx` de Payload et Node 22 sur `@payloadcms/richtext-lexical`. Cela **n'affecte ni `npm run dev`, ni `npm run build`, ni l'admin** (tous validés fonctionnels) — uniquement la commande CLI de génération de types. Contournement en attendant un correctif amont : garder les types manuels de `src/types/content.ts`, ou générer les types depuis un environnement Node 20 si besoin.
- **Aucune base de données de production n'est configurée.** Le `DATABASE_URI` doit pointer vers une instance Neon réelle avant tout déploiement.
- **`@payloadcms/plugin-seo` a été délibérément écarté** au profit d'un groupe de champs SEO fait main (`src/fields/seo.ts`), pour obtenir exactement les noms de champs demandés (`metaTitle`, `metaDescription`, `canonical`, `ogImage`, `noIndex`, `structuredData`) plutôt que la structure par défaut du plugin (`meta.title/description/image`).
- **Aucun compte Stripe réel n'est nécessaire pour l'instant** : les routes Stripe échouent proprement (erreur explicite) tant que `STRIPE_SECRET_KEY` n'est pas renseignée — elles ne bloquent pas le reste du site.
