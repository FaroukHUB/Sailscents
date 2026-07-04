import type { CollectionConfig } from 'payload'

import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'category', 'status'] },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'Publié', value: 'published' },
        { label: 'Rupture de stock', value: 'outOfStock' },
        { label: 'Archivé', value: 'archived' },
      ],
    },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true, label: 'Univers' },
    { name: 'productCollections', type: 'relationship', relationTo: 'productCollections', hasMany: true, label: 'Collections' },
    { name: 'shortDescription', type: 'textarea', label: 'Description courte (accroche)' },
    { name: 'description', type: 'richText', label: 'Description longue / storytelling' },
    {
      name: 'olfactiveNotes',
      type: 'group',
      label: 'Pyramide olfactive (parfums / attars / encens)',
      fields: [
        { name: 'top', type: 'text', label: 'Notes de tête' },
        { name: 'heart', type: 'text', label: 'Notes de cœur' },
        { name: 'base', type: 'text', label: 'Notes de fond' },
      ],
    },
    {
      name: 'origin',
      type: 'group',
      label: 'Origine / provenance',
      fields: [
        { name: 'country', type: 'text', label: 'Pays / région' },
        { name: 'method', type: 'text', label: 'Méthode (distillation, torréfaction, récolte...)' },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Variantes (format / contenance)',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Format (ex : 12ml, 100g)' },
        { name: 'sku', type: 'text', label: 'Référence' },
        { name: 'price', type: 'number', required: true, label: 'Prix (€)' },
        { name: 'compareAtPrice', type: 'number', label: 'Prix barré (€)' },
        { name: 'stock', type: 'number', defaultValue: 0 },
      ],
    },
    { name: 'mainImage', type: 'upload', relationTo: 'media', label: 'Image principale (LCP / Open Graph)' },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galerie',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    { name: 'relatedProducts', type: 'relationship', relationTo: 'products', hasMany: true, label: 'Produits associés' },
    seoFields(),
  ],
}
