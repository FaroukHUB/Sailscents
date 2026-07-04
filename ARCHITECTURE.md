# SAILSCENTS — Note d'architecture

*« Du palais au nez »*

Document de réflexion stratégique, avant tout développement. Aucune ligne de code applicative n'est produite ici : il s'agit d'une analyse d'architecte destinée à arrêter un choix technique pour les 3 à 5 prochaines années.

---

## 1. Cadrage du problème

Avant de comparer des stacks, il faut nommer ce que Sailscents *est vraiment* techniquement, parce que ça élimine déjà plusieurs familles de solutions :

- **Un catalogue restreint et curaté** (Oud, Attars, encens, café, thé — probablement quelques dizaines à quelques centaines de références, pas 10 000 SKUs). Ce n'est pas un problème de volumétrie, c'est un problème de **narration produit**.
- **Un site où le contenu éditorial (texte, image, ambiance, storytelling Kōdō) pèse autant que la fiche produit elle-même.** Il faut donc un vrai CMS, pas juste une base produit.
- **Une feuille de route qui transforme progressivement un site vitrine + boutique en véritable application** : compte client, wishlist, fidélité, réservation d'ateliers, IA, multilingue. Ça veut dire qu'il ne faut *pas* choisir aujourd'hui une techno "site statique simple" qu'il faudra jeter dans 12 mois.
- **Contrainte budgétaire réelle** : gratuit ou quasi-gratuit, pas de Sanity (crédits épuisés), pas de Shopify/WordPress.
- **Le SEO et la performance sont non négociables** — pour une marque de niche premium, le trafic organique (recherches "attar de oud naturel", "encens artisanal", etc.) sera probablement le canal d'acquisition n°1, largement devant la pub payante.

Avec ça posé, voici les architectures que j'ai sérieusement considérées.

---

## 2. Les options envisagées

### Option 1 — Next.js + Payload CMS (embarqué) + PostgreSQL + Stripe
**Le CMS tourne dans le même repo que le site, pas de service tiers.**

Payload 3.0 s'installe directement à l'intérieur d'une app Next.js (App Router). Il génère un back-office admin complet (React) et une base de données typée (Postgres via Drizzle), sans dépendre d'un SaaS externe comme Sanity. Le catalogue, les ateliers, les articles de blog, les pages éditoriales sont tous des "collections" Payload gérables par un non-développeur.

- **Avantages** : zéro dépendance à un CMS payant ; TypeScript de bout en bout ; back-office prêt à l'emploi (pas besoin de coder un dashboard) ; un seul repo, un seul déploiement ; extensible à l'infini (auth, hooks, API REST/GraphQL auto-générée) ; contrôle total du HTML donc SEO parfait.
- **Inconvénients** : Payload est encore un framework "jeune" (v3 sortie en 2024) — communauté plus petite que WordPress ; ajoute une couche de complexité (migrations de schéma) ; demande une vraie base Postgres (pas de simple fichier).
- **Coût** : ~0€. Payload = open source/gratuit. Postgres via Neon ou Supabase (tier gratuit très généreux). Vercel Hobby gratuit. Seul coût réel = les frais Stripe à la transaction.
- **Maintenance** : modérée — il faut suivre les migrations de schéma Payload/Drizzle, mais pas de mises à jour "de sécurité" façon plugins WordPress.
- **Ajout de fonctionnalités futures** : excellent — wishlist, fidélité, compte client sont juste de nouvelles collections + routes.
- **Performance / SEO** : excellent — App Router = Server Components, SSG/ISR natifs, `generateMetadata`, `sitemap.ts`/`robots.ts` intégrés au framework.
- **Sécurité** : bonne, à condition de bien configurer l'auth admin et les webhooks Stripe (signature).
- **Rapidité de développement** : rapide pour le catalogue/CMS, un peu plus lent pour la logique panier/commande qu'il faut coder soi-même.
- **Vercel** : compatibilité native (Next.js = produit de Vercel).
- **Hostinger plus tard** : possible via un VPS Hostinger avec Node.js (build "standalone" de Next.js + Postgres géré séparément ou sur le même VPS). Impossible sur de l'hébergement mutualisé classique.

### Option 2 — Next.js (storefront) + Medusa.js (moteur e-commerce open source)
Medusa est un "Shopify open source" : panier, commandes, stocks, remises, multi-devises livrés en standard, avec un vrai back-office.

- **Avantages** : logique e-commerce (panier, stock, remises, retours) déjà écrite et robuste — gain de temps énorme si le catalogue devient gros ou complexe ; écosystème de plugins.
- **Inconvénients** : Medusa nécessite un **serveur Node persistant + Postgres + Redis** — donc *pas* déployable en pur serverless sur Vercel. Il faut un hébergeur type Railway/Render/VPS pour le backend. C'est clairement du sur-dimensionnement pour un catalogue curaté de quelques dizaines/centaines de produits. Courbe d'apprentissage plus longue.
- **Coût** : backend ~5-20$/mois (ou VPS Hostinger plus tard) + Postgres/Redis. Plus cher et plus complexe que l'option 1 pour un gain qui ne se justifie pas encore.
- **Maintenance** : plus lourde (deux systèmes à faire évoluer ensemble : storefront + backend Medusa).
- **SEO/Perf** : identique à l'option 1 côté storefront Next.js.
- **Vercel** : le storefront oui, le backend non (il faut un service tiers).
- **Hostinger** : bon candidat *plus tard*, si le catalogue grossit énormément (ex. expansion multi-marques, multi-entrepôts).

### Option 3 — Next.js "sur-mesure" (sans CMS ni moteur e-commerce dédié)
Tout est codé à la main : schéma produit via Prisma/Postgres, panier en state client, paiement via Stripe Checkout, back-office minimal fait maison.

- **Avantages** : contrôle total, aucune dépendance à un framework tiers, la plus légère et la plus rapide en exécution, coût quasi nul.
- **Inconvénients** : il faut coder soi-même le back-office d'administration (pour que l'équipe Sailscents puisse éditer les fiches produits sans toucher au code) — c'est un vrai coût de développement qu'on sous-estime souvent. Sans CMS, chaque modification de contenu éditorial redevient un ticket dev.
- **Coût** : le plus bas (0€ d'infra).
- **Maintenance** : simple techniquement, mais opérationnellement pénible si les fondateurs veulent éditer eux-mêmes les textes/images (ce qui sera très probablement le cas pour une marque très narrative comme Sailscents).
- **Recommandation** : bonne base technique, mais **incomplète** sans un CMS — d'où l'option 1 qui la complète avec Payload sans en payer le prix (Sanity).

### Option 4 — Astro (islands) + Snipcart/Stripe
Astro pour un site quasi-statique, ultra-performant, avec quelques "îlots" React interactifs (panier, configurateur olfactif).

- **Avantages** : le meilleur score Lighthouse/Core Web Vitals possible par défaut (JS minimal envoyé au navigateur) — cohérent avec l'ADN "lenteur, silence, raffinement" de la marque. Hébergeable même sur du mutualisé Hostinger classique (export statique).
- **Inconvénients** : c'est le mauvais choix **à moyen terme**. Dès que la roadmap inclut compte client, espace membre, réservation d'ateliers avec auth, notifications, IA personnalisée — on a besoin d'une vraie application avec état serveur, sessions, logique métier. Astro n'est pas conçu pour ça ; on finirait par greffer une deuxième application à côté, ce qui fragmente l'architecture (deux stacks à maintenir).
- **Verdict** : excellent pour un site vitrine pur, mais **je le déconseille ici** car il faudrait le remplacer dans 12-18 mois quand l'espace membre arrivera. Autant partir directement sur une base qui absorbe cette évolution.

### Option 5 — Remix / SvelteKit
Alternatives sérieuses à Next.js sur le papier (SSR, performance comparable). Je ne les retiens pas parce que :
- Vercel est *le* produit de Next.js — l'intégration (ISR, Edge Functions, Image Optimization, Analytics) y est plus mature et mieux documentée pour Next.js que pour les autres.
- L'écosystème (Payload, Stripe, Auth.js, Vercel AI SDK, next-intl) est pensé Next.js en priorité.
- Pas d'avantage décisif qui justifierait de sortir de l'écosystème Vercel/Next pour ce projet.

---

## 3. Tableau comparatif synthétique

| Critère | Opt.1 Next+Payload | Opt.2 Next+Medusa | Opt.3 Next sur-mesure | Opt.4 Astro |
|---|---|---|---|---|
| Coût actuel | ~0€ | 5-20€/mois | ~0€ | ~0€ |
| Édition de contenu sans dev | ✅ Oui | ✅ Oui | ❌ Non (à coder) | ❌ Non |
| Complexité logique e-commerce | Moyenne (à coder) | ✅ Livrée | Moyenne (à coder) | Moyenne (via Snipcart) |
| Scalabilité fonctionnelle (membre, fidélité, IA...) | ✅ Excellente | ✅ Bonne | ✅ Bonne | ❌ Fragmente l'archi |
| SEO / Core Web Vitals | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅✅ Le meilleur, mais... |
| 100% Vercel dès aujourd'hui | ✅ Oui | ⚠️ Backend non | ✅ Oui | ✅ Oui |
| Migration Hostinger plus tard | ✅ VPS Node | ✅ VPS Node | ✅ VPS Node | ✅ Même mutualisé |
| Rapidité de mise en route | Rapide | Moyenne | Rapide | Rapide |
| Risque d'obsolescence à 2 ans | Faible | Faible | Moyen (sans CMS) | Élevé (à remplacer) |

---

## 4. Ma recommandation

**Option 1, affinée : Next.js 15 (App Router) + Payload CMS 3 embarqué + PostgreSQL (Neon) + Stripe.**

C'est le choix que je ferais si ce projet était le mien, pour une raison simple : Sailscents n'est pas *seulement* une boutique, c'est une marque qui vend une expérience racontée. Le contenu (textes, photographie, ambiance) va changer souvent, sera retouché par les fondateurs eux-mêmes, et doit rester impeccable en SEO. Il faut donc un CMS — mais un CMS gratuit, auto-hébergé, qui ne recrée pas le problème "plus de crédits" qu'on a eu avec Sanity. Payload coche cette case en restant 100% dans l'écosystème Next.js/Vercel.

Medusa (option 2) est une excellente techno, mais elle répond à un problème que Sailscents n'a pas encore (gérer un catalogue complexe multi-stock à grande échelle) et introduit une dépendance d'hébergement backend qui casse la simplicité "tout sur Vercel". On pourra toujours migrer vers Medusa plus tard si le catalogue explose — l'architecture proposée ne l'empêche pas.

Astro (option 4) est écarté malgré sa performance supérieure, car la feuille de route (compte membre, réservations, IA, notifications) est explicitly une trajectoire "application", pas "site vitrine". Partir sur Astro reviendrait à devoir migrer dans 12-18 mois.

### Stack finale recommandée

| Brique | Choix | Pourquoi |
|---|---|---|
| Framework | **Next.js 15 (App Router, React Server Components)** | SSR/SSG/ISR natifs, `generateMetadata`, `sitemap.ts`/`robots.ts` intégrés, écosystème Vercel |
| CMS | **Payload CMS 3** (embarqué, même repo) | Gratuit, open source, admin auto-généré, remplace Sanity sans coût |
| Base de données | **PostgreSQL via Neon** (serverless) | Tier gratuit généreux, compatible Vercel Edge, migration facile vers Hostinger/VPS plus tard |
| Paiement | **Stripe** (Checkout + webhooks) | Standard du marché, gère la conformité PCI, extensible (abonnements pour un futur programme fidélité) |
| Authentification | **Auth.js (NextAuth)** ou module auth Payload | Prêt pour l'espace membre futur |
| Internationalisation | **next-intl** | FR/EN (voire arabe pour le marché Oud/Attar) avec hreflang propre |
| IA (plus tard) | **Vercel AI SDK** | Quiz olfactif, recommandations personnalisées, chat conseiller |
| Images | **next/image** + Cloudinary (optionnel) | AVIF/WebP automatique, LCP optimisé |
| Emails transactionnels | **Resend** | Confirmations de commande, notifications, tier gratuit large |
| Analytics | **Vercel Analytics + Plausible** | Respect de la vie privée, cohérent avec le positionnement premium |
| Monitoring erreurs | **Sentry** (tier gratuit) | Fiabilité en production |
| Hébergement | **Vercel** (puis VPS Hostinger si besoin via build "standalone") | Le chemin de migration reste ouvert dès le premier jour |

**Coût total estimé au démarrage : 0€ à quelques euros/mois**, hors frais de transaction Stripe (~1,5-2,9%) et éventuellement un nom de domaine.

---

## 5. Le plan SEO intégré à l'architecture (pas ajouté après coup)

- **Rendu** : SSG + ISR pour les pages produits/collections (rapides, indexables, mises à jour périodiques) ; SSR pour les pages dynamiques (compte client, panier).
- **Sitemap & robots** : générés nativement via les conventions Next.js `app/sitemap.ts` et `app/robots.ts`, alimentés dynamiquement par les données Payload.
- **Métadonnées** : `generateMetadata` par page, title/description uniques, `alternates.canonical` systématique.
- **Open Graph & Twitter Cards** : générés automatiquement à partir des données produit/article (image, titre, description).
- **Schema.org (JSON-LD)** : `Product` + `Offer` sur les fiches produits, `BreadcrumbList` partout, `Organization`/`LocalBusiness` sur la page à propos, `Article` sur le blog, `Event` sur les ateliers.
- **Images** : `next/image`, formats AVIF/WebP, `priority` sur l'image héro (LCP), lazy loading natif ailleurs.
- **Polices** : `next/font` auto-hébergées, zéro layout shift (CLS).
- **URLs** : structure propre et sémantique en français (`/parfums/oud/nom-du-produit`, `/collections/...`, `/ateliers/...`, `/journal/...`).
- **Internationalisation** : `hreflang` correct dès l'introduction du multilingue.
- **Suivi continu** : audit Lighthouse/Core Web Vitals à chaque phase, pas seulement à la fin.

---

## 6. Grandes étapes de développement (du premier jour à la mise en production)

1. **Fondations** — repo, CI/CD Vercel, design tokens (typographie, palette silence/fumée/matière), squelette Next.js + Payload, nom de domaine.
2. **Identité & design system** — maquettes, système de navigation à grands panneaux (inspiré Diser, identité propre), composants UI premium, moodboard Kōdō.
3. **Modèle de données & CMS** — collections Payload (Produits, Collections, Ateliers, Pages éditoriales, Blog), schéma Postgres, contenu de démonstration.
4. **Catalogue & fiches produits** — pages SSR/ISR, filtres, recherche, images optimisées, JSON-LD `Product`.
5. **Panier & paiement** — état panier, Stripe Checkout, gestion des commandes, emails de confirmation (Resend), compte client basique.
6. **SEO technique** (en continu à partir d'ici) — sitemap, robots, metadata, OG, JSON-LD, audits Lighthouse.
7. **Ateliers & réservation** — système de réservation (intégration Cal.com ou développement dédié).
8. **Contenu éditorial / Journal (blog)** — pages narratives via Payload, storytelling de marque.
9. **QA, accessibilité, sécurité** — tests, audit accessibilité (WCAG), en-têtes de sécurité, vérification des signatures webhook Stripe.
10. **Mise en production** — DNS, domaine, Vercel production, monitoring (Sentry), lancement.
11. **Itérations post-lancement** — espace membre, wishlist, programme de fidélité, multilingue, fonctionnalités IA (quiz olfactif, recommandations).

---

## 7. En résumé

Le bon choix n'est pas la techno la plus impressionnante, c'est celle qui correspond à ce que Sailscents va devenir. Next.js + Payload CMS + Postgres + Stripe donne aujourd'hui la simplicité et la gratuité d'un site sur-mesure, tout en gardant, dès le premier commit, la capacité d'accueillir sans réécriture l'espace membre, la fidélité, le multilingue et l'IA prévus dans la feuille de route — sans jamais dépendre d'un service dont on pourrait épuiser les crédits.
