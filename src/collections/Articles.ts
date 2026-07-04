import type { CollectionConfig } from 'payload'

import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Article', plural: 'Le Journal (Articles)' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'status', 'publishedDate'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'Publié', value: 'published' },
        { label: 'Archivé', value: 'archived' },
      ],
    },
    { name: 'publishedDate', type: 'date' },
    { name: 'author', type: 'relationship', relationTo: 'users' },
    { name: 'category', type: 'text', label: 'Thème éditorial' },
    { name: 'excerpt', type: 'textarea', label: 'Extrait / chapô (sert de description par défaut)' },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Image à la une' },
    { name: 'content', type: 'richText' },
    { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true, label: 'Produits associés' },
    seoFields(),
  ],
}
