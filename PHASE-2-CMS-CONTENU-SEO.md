# SAILSCENTS — Phase 2 : Contenu, CMS & SEO

*« Du palais au nez »*

Suite de `ARCHITECTURE.md`. Toujours aucune ligne de code : ce document fige le **modèle de contenu**, la **structure SEO** et le **plan de rôles** avant toute intégration design ou développement. C'est le document que l'équipe éditoriale et l'équipe technique doivent valider ensemble avant la Phase 3.

---

## 0. Confirmation du choix : Payload CMS 3 embarqué

Avec l'exigence précisée — le client doit pouvoir **lui-même** modifier produits, collections, images, textes, ateliers, articles, FAQ et métadonnées SEO — le choix de Payload CMS 3 n'est pas seulement confirmé, il est **renforcé**. Trois raisons concrètes, spécifiques à ce besoin :

1. **Éditeur de texte riche natif (Lexical)** sur tous les champs de contenu long (descriptions produit, storytelling ateliers, articles de blog) — pas besoin de coder un éditeur, le client rédige directement dans le back-office avec mise en forme, images intégrées, citations.
2. **Plugin SEO officiel Payload (`@payloadcms/plugin-seo`)** : ajoute automatiquement, sur n'importe quelle collection, un groupe de champs meta title / meta description / image OG avec **aperçu visuel type Google** directement dans l'admin. C'est exactement le besoin exprimé ("métadonnées SEO" éditables par le client) sans rien construire sur mesure.
3. **Contrôle d'accès par rôle natif** (`access control` par collection et par champ) : on peut donner au client un accès complet aux produits/contenu tout en lui masquant les réglages techniques — ce qui répond directement au point "rôles utilisateurs" demandé plus bas.

À cela s'ajoutent des bénéfices déjà actés en Phase 1 : gratuit, auto-hébergé (pas de dépendance à des crédits comme Sanity), bibliothèque média intégrée (upload, recadrage, texte alternatif), versioning et brouillons (le client peut préparer un contenu sans le publier), et compatibilité totale avec l'architecture Next.js/Vercel déjà retenue.

**Conclusion : Payload CMS 3 reste le meilleur choix, et le devient encore davantage avec ce cahier des charges.**

---

## 1. Arborescence complète du site

```
/                                   Accueil
/maison                             Notre histoire / Manifeste Kōdō
/univers/oud                        Univers Oud (catégorie)
/univers/attars                     Univers Attars (catégorie)
/univers/encens                     Univers Encens (catégorie)
/univers/cafe                       Univers Café (catégorie)
/univers/the                        Univers Thé (catégorie)
/boutique                           Catalogue complet (filtrable)
/boutique/[categorie]               Liste produits par univers
/boutique/[categorie]/[produit]     Fiche produit
/collections                        Liste des collections curatées
/collections/[collection]           Page d'une collection (ex. "Coffret Découverte Kōdō")
/ateliers                           Liste des ateliers / expériences
/ateliers/[atelier]                 Fiche atelier + réservation
/journal                            Blog "Le Journal Sailscents"
/journal/[article]                  Article de blog
/journal/categorie/[categorie]      Archive par thème éditorial
/faq                                FAQ générale (accordéon par catégories)
/contact                            Contact
/livraison-et-retours               Politique de livraison/retours
/mentions-legales                   Page légale
/cgv                                Conditions générales de vente
/confidentialite                    Politique de confidentialité
/recherche                          Résultats de recherche
/panier                             Panier
/commande                           Tunnel de paiement
/commande/confirmation              Confirmation de commande
/compte                             Espace client (connexion/inscription)
/compte/commandes                   Historique de commandes
/compte/parametres                  Paramètres du compte
/compte/wishlist                    Liste d'envies (évolution future)
/compte/fidelite                    Programme fidélité (évolution future)
/sitemap.xml                        Sitemap technique (généré)
/robots.txt                         Directives d'indexation (généré)
```

**Principe directeur** : chaque univers (Oud, Attars, Encens, Café, Thé) est une porte d'entrée éditoriale à part entière — pas un simple filtre — pour permettre un maillage SEO thématique fort et une navigation par grands panneaux (inspiration Diser) sans copier sa structure.

---

## 2. Structure SEO complète

### 2.1 Règles d'URL
- Slugs en français, minuscules, tirets (`kebab-case`), sans accents ni ID numérique.
- Un produit garde une URL stable même s'il change de collection (301 gérée via la collection *Redirects*).
- Profondeur maximale : 3 niveaux (`/boutique/oud/nom-du-produit`).

### 2.2 Gabarits de métadonnées par type de page

| Type de page | Title (gabarit) | Description (gabarit) |
|---|---|---|
| Produit | `{Nom du produit} — {Univers} \| Sailscents` | Chapô produit (150-160 car.) |
| Catégorie/Univers | `{Univers} — {accroche} \| Sailscents` | Description de l'univers |
| Collection | `{Nom collection} \| Sailscents` | Description de la collection |
| Atelier | `{Nom de l'atelier} — Atelier Kōdō \| Sailscents` | Chapô atelier |
| Article | `{Titre article} \| Le Journal Sailscents` | Extrait de l'article |
| Page statique | `{Titre page} \| Sailscents` | Champ SEO dédié |

Tous surchargeables manuellement via le champ SEO (voir section 10).

### 2.3 Balisage Schema.org (JSON-LD) par type de page

| Page | Types Schema.org appliqués |
|---|---|
| Toutes les pages | `Organization`, `WebSite` + `SearchAction`, `BreadcrumbList` |
| Fiche produit | `Product`, `Offer`, `AggregateRating` (dès activation des avis) |
| Liste catégorie/collection | `CollectionPage`, `ItemList` |
| Fiche atelier | `Event` (date, lieu, prix, disponibilité), `Offer` |
| Article de blog | `Article` / `BlogPosting`, `Person` (auteur) |
| FAQ | `FAQPage` |
| Page "Maison"/Contact | `LocalBusiness` (si point de vente physique) |

### 2.4 Sitemap & robots
- `sitemap.xml` généré dynamiquement (index si volumétrie importante), alimenté en temps réel par les collections Payload publiées (produits, collections, ateliers, articles, pages).
- Champs `lastmod` reflétant la date de mise à jour Payload.
- `robots.txt` : autorise l'indexation du catalogue et du journal, exclut `/compte`, `/panier`, `/commande`, `/recherche`.
- Collection **Redirects** dans Payload pour que le client puisse créer des redirections 301 sans intervention technique (produit retiré, url changée...).

### 2.5 Maillage interne
- Fil d'Ariane (`BreadcrumbList`) sur toutes les pages profondes.
- Bloc "produits associés" sur chaque fiche produit.
- Liaison bidirectionnelle article de blog ↔ produits cités ("contenu shoppable").
- Liens contextuels FAQ ↔ produit/atelier concerné.

### 2.6 Exigences transverses
- Texte alternatif **obligatoire** sur chaque média (champ requis dans la collection Media).
- `next/image` : formats AVIF/WebP automatiques, image héro en `priority` (LCP).
- `next/font` auto-hébergées (aucun CLS lié aux polices).
- Hreflang prêt dès l'activation du multilingue (FR par défaut, EN puis AR envisageables).
- Audit Lighthouse/Core Web Vitals à chaque nouveau gabarit de page, pas seulement en fin de projet.

---

## 3. Collections Payload nécessaires

### Collections de contenu
| Collection | Rôle |
|---|---|
| `products` | Catalogue produit (Oud, Attars, Encens, Café, Thé) |
| `categories` | Univers/catégories (Oud, Attars, Encens, Café, Thé) |
| `collections` | Collections curatées transversales (coffrets, éditions limitées) |
| `workshops` (ateliers) | Fiches ateliers/expériences Kōdō |
| `workshop-sessions` | Créneaux/dates réservables, liés à `workshops` |
| `articles` | Articles du Journal (blog) |
| `article-categories` | Thématiques éditoriales du blog |
| `faqs` | Questions/réponses, groupables par thème |
| `faq-categories` | Regroupement thématique de la FAQ |
| `pages` | Pages statiques flexibles à blocs (Maison, mentions légales, CGV...) |
| `testimonials` | Avis clients (activation ultérieure) |
| `redirects` | Redirections 301 gérées sans code |
| `media` | Bibliothèque d'images/vidéos (native Payload) |

### Collections d'accès et de données transactionnelles
| Collection | Rôle |
|---|---|
| `users` | Comptes back-office (staff), avec rôles (section 6) |
| `customers` | Comptes clients front (ou via fournisseur d'auth dédié — décision technique en Phase 3) |
| `orders` | Commandes (miroir des objets Stripe, lecture pour le support) |

### Globals (réglages uniques, pas de liste)
| Global | Rôle |
|---|---|
| `site-settings` | Coordonnées, réseaux sociaux, logo, informations `Organization`/`LocalBusiness` |
| `seo-defaults` | Title/description/image OG par défaut, fallback global |
| `navigation` | Structure du méga-menu à grands panneaux (header) et du footer |
| `homepage` | Contenu modulaire de la page d'accueil (blocs) |

---

## 4. Modèles de données (aperçu des champs clés)

### `categories` (Univers)
- `name`, `slug`, `description` (rich text court)
- `heroImage`, `heroVideo` (optionnel)
- `parentCategory` (optionnel, pour sous-univers futurs)
- `seo` (groupe SEO, voir section 10)

### `collections`
- `name`, `slug`, `description` (rich text)
- `products` (relation multiple vers `products`)
- `coverImage`
- `dateDebut` / `dateFin` (optionnel, pour éditions limitées)
- `seo`

### `pages` (page builder à blocs)
- `title`, `slug`
- `blocks` (liste polymorphe : Hero, Texte+Image, Citation, Galerie, CTA, Accordéon, Bloc produits mis en avant)
- `seo`

### `redirects`
- `sourcePath`, `destinationPath`, `type` (301/302), `active`

### `testimonials`
- `authorName`, `rating`, `content`, `relatedProduct` (optionnel), `dateApproved`, `status` (en attente/publié)

Les modèles détaillés de `products`, `workshops` et `articles` sont développés dans les sections 8, 9 et 10.

---

## 5. Types de pages (gabarits front)

| Gabarit | Source de contenu | Particularité |
|---|---|---|
| Accueil | Global `homepage` | Blocs modulaires réordonnables |
| Univers/catégorie | `categories` + requête `products` | Grille filtrable |
| Fiche produit | `products` | JSON-LD `Product`, variantes |
| Collection curatée | `collections` | Storytelling + grille produits |
| Liste ateliers | `workshops` | Filtrage par date/thème |
| Fiche atelier | `workshops` + `workshop-sessions` | Réservation, JSON-LD `Event` |
| Liste blog | `articles` + `article-categories` | Pagination, filtrage par thème |
| Article de blog | `articles` | Blocs de contenu riches, produits liés |
| FAQ | `faqs` + `faq-categories` | Accordéon, JSON-LD `FAQPage` |
| Pages statiques | `pages` | Page builder générique |
| Recherche | Requête transverse | Non indexée |
| Panier / Commande / Compte | Applicatif (hors CMS) | Non indexées, SSR pur |
| 404 | Statique | Suggestions de produits populaires |

---

## 6. Rôles utilisateurs

### Back-office (staff, gérés dans `users` avec `access control` Payload)

| Rôle | Accès |
|---|---|
| **Super Admin** | Accès total : utilisateurs, rôles, réglages techniques, toutes collections |
| **Gérant boutique** | Produits, collections, stocks, prix, commandes — pas d'accès aux réglages techniques ni à la gestion des utilisateurs |
| **Éditeur de contenu** | Articles, ateliers, FAQ, pages statiques, médias, champs SEO — pas d'accès aux prix/commandes/stocks |
| **Support client** | Lecture des commandes et fiches clients, gestion des retours — pas d'édition de contenu ni de catalogue |
| **Comptabilité** *(évolution future)* | Lecture seule des commandes et rapports financiers |

### Front (clients, collection `customers`)

| Rôle | Accès |
|---|---|
| **Visiteur anonyme** | Navigation, ajout au panier, pas de compte |
| **Client inscrit** | Historique de commandes, paramètres, wishlist *(à venir)* |
| **Client fidélité** *(évolution future)* | Avantages/paliers du programme de fidélité |
| **Membre VIP** *(évolution future)* | Accès à des contenus/ateliers exclusifs |

---

## 7. Structure des produits

| Groupe de champs | Détail |
|---|---|
| Identité | Nom, slug, référence interne, statut (brouillon/publié/rupture/archivé) |
| Classification | Univers (`categories`), collection(s) associée(s), tags d'accords (boisé, fumé, résineux, floral...) |
| Narration | Description courte (accroche), description longue (rich text storytelling), histoire/origine, méthode d'obtention (distillation, torréfaction, récolte) |
| Spécifique parfums/attars/encens | Pyramide olfactive (notes de tête / cœur / fond), provenance du bois/de la résine, intensité |
| Spécifique café/thé | Origine géographique, altitude, méthode de torréfaction/infusion, profil aromatique, intensité, accords de dégustation |
| Variantes | Format/contenance (ex. 3 ml, 12 ml, 50 g, 100 g), prix par variante, stock par variante, SKU par variante |
| Médias | Galerie d'images ordonnée (texte alternatif obligatoire), image principale (LCP/OG), vidéo optionnelle |
| Commerce | Prix, prix barré (promotion), devise, TVA applicable |
| Stock | Quantité, seuil d'alerte, statut de disponibilité, précommande possible |
| Relations | Produits complémentaires/associés, collection(s) parente(s) |
| Confiance | Certifications (naturel, artisanal, bio), avis clients *(évolution)* |
| SEO | Groupe SEO complet (section 10) |

---

## 8. Structure des ateliers

| Groupe de champs | Détail |
|---|---|
| Identité | Nom, slug, statut, niveau (initiation/perfectionnement) |
| Narration | Description courte, description longue (storytelling de l'expérience Kōdō), ce qui est inclus (liste) |
| Logistique | Lieu (adresse ou "en ligne"), durée, capacité maximale |
| Sessions | Relation vers `workshop-sessions` : date, heure, places restantes, statut (ouvert/complet/liste d'attente) |
| Intervenant | Nom, biographie courte, photo |
| Tarification | Prix, options (individuel/duo/groupe privé) |
| Médias | Galerie photo, vidéo d'ambiance |
| FAQ liée | Relation filtrée vers `faqs` |
| SEO | Groupe SEO + champs `Event` (date, lieu, prix, disponibilité pour le JSON-LD) |

---

## 9. Structure du blog (Le Journal)

| Groupe de champs | Détail |
|---|---|
| Identité | Titre, slug, statut, date de publication, date de mise à jour |
| Classification | Catégorie(s)/thème éditorial (`article-categories`), tags libres |
| Présentation | Image à la une (LCP/OG), extrait/chapô (sert aussi de meta description par défaut) |
| Contenu | Corps en blocs riches : paragraphe, image, citation, galerie, bloc produit intégré ("contenu shoppable") |
| Auteur | Relation vers `users` ou champ texte libre |
| Enrichissement | Temps de lecture (calculé), produits associés (relation vers `products`) |
| Workflow | Statut brouillon/publié/archivé, aperçu avant publication (preview Payload) |
| SEO | Groupe SEO complet |

---

## 10. Champs SEO obligatoires (groupe réutilisable)

Groupe `seo` appliqué via le plugin `@payloadcms/plugin-seo` sur : `products`, `categories`, `collections`, `workshops`, `articles`, `pages`.

| Champ | Statut | Détail |
|---|---|---|
| Meta Title | **Obligatoire** | 50-60 caractères, compteur visuel dans l'admin |
| Meta Description | **Obligatoire** | 150-160 caractères, compteur visuel |
| Image Open Graph | **Obligatoire** | Ratio 1200×630, repli automatique sur l'image principale si non renseignée |
| Slug/URL | **Obligatoire** | Généré automatiquement depuis le titre, modifiable manuellement, unicité vérifiée |
| Texte alternatif des images | **Obligatoire** | Porté par la collection `media`, pas seulement le groupe SEO |
| Canonical override | Optionnel | Pour les cas de contenu dupliqué |
| Noindex / Nofollow | Optionnel | Exclusion ponctuelle de l'indexation |
| Focus keyword | Optionnel | Aide à la rédaction pour l'équipe éditoriale, non exploité techniquement |
| Libellé du fil d'Ariane | Optionnel | Si différent du titre principal |
| Langue / hreflang | Optionnel, préparé | Activé lors du passage multilingue |

**Réglages globaux** (`seo-defaults`) : title/description de repli, image OG par défaut, nom et logo de l'organisation, liens des réseaux sociaux, données `LocalBusiness` — utilisés quand une page ne surcharge pas ses propres champs.

---

## 11. Plan de développement étape par étape (Phase 2 → mise en œuvre technique)

1. Installation et configuration de Payload CMS 3 dans le projet Next.js (connexion PostgreSQL/Neon).
2. Configuration des Globals : `site-settings`, `seo-defaults`, `navigation` (méga-menu à grands panneaux), `homepage`.
3. Mise en place de la collection `media` (upload, recadrage, texte alternatif obligatoire).
4. Création des collections de taxonomie : `categories`, `article-categories`, `faq-categories`.
5. Création de la collection `products` (champs, variantes, relations, groupe SEO).
6. Création des collections `collections` (curatées) et de leurs relations avec `products`.
7. Création des collections `workshops` et `workshop-sessions`.
8. Création des collections `articles` et `faqs`.
9. Création de la collection `pages` (page builder à blocs).
10. Création de la collection `redirects`.
11. Intégration du plugin SEO Payload sur toutes les collections concernées et validation des aperçus.
12. Configuration des rôles et de l'`access control` (Super Admin, Gérant, Éditeur, Support).
13. Génération dynamique de `sitemap.xml` et `robots.txt` à partir des données publiées.
14. Implémentation du JSON-LD par type de page (Organization, Product, Event, Article, FAQPage, BreadcrumbList).
15. Construction des gabarits de pages Next.js correspondant à l'arborescence (section 1).
16. Peuplement d'un jeu de contenu de démonstration (produits, ateliers, articles) pour valider la structure avant l'intégration design définitive.
17. Test des rôles et permissions (chaque profil ne voit et ne modifie que ce qui lui est destiné).
18. Validation SEO technique : Rich Results Test (Schema.org), validation du sitemap, audit Lighthouse sur chaque gabarit.
19. Documentation courte à destination du client : comment ajouter un produit, un atelier, un article, et renseigner le SEO.
20. Validation conjointe (client + équipe technique) avant passage à la Phase 3 — intégration du design final et des interactions.

---

## En résumé

Ce document fige un modèle de contenu complet, éditable de bout en bout par le client sans intervention technique, avec un SEO pensé dans chaque collection plutôt qu'ajouté après coup. Il sert de contrat de référence pour la Phase 3 (design et intégration) : rien ne devrait plus changer structurellement à partir de maintenant, seulement se remplir de contenu et de design.
