import type { Field } from 'payload'

/**
 * Groupe SEO reutilisable, applique a toutes les collections indexables
 * (produits, categories, collections produits, pages, articles, ateliers).
 */
export const seoFields = (): Field => ({
  name: 'seo',
  type: 'group',
  label: 'Referencement (SEO)',
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Titre SEO (meta title)',
      admin: { description: '50-60 caracteres recommandes' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Description SEO (meta description)',
      admin: { description: '150-160 caracteres recommandes' },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Image Open Graph',
      admin: { description: 'Repli automatique sur l\'image principale si vide' },
    },
    {
      name: 'canonical',
      type: 'text',
      label: 'URL canonique (optionnel)',
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      label: "Exclure de l'indexation (noindex)",
      defaultValue: false,
    },
    {
      name: 'structuredData',
      type: 'json',
      label: 'Donnees structurees additionnelles (JSON-LD, optionnel)',
      admin: { description: 'Surcharge manuelle du balisage Schema.org genere automatiquement' },
    },
  ],
})
