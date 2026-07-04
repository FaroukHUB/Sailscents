import type { CollectionConfig } from 'payload'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQ' },
  admin: { useAsTitle: 'question', defaultColumns: ['question', 'category', 'order'] },
  access: { read: () => true },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'richText', required: true },
    { name: 'category', type: 'text', label: 'Thème (ex : Livraison, Produits, Ateliers)' },
    { name: 'relatedProduct', type: 'relationship', relationTo: 'products' },
    { name: 'relatedWorkshop', type: 'relationship', relationTo: 'workshops' },
    { name: 'order', type: 'number', label: "Ordre d'affichage" },
  ],
}
