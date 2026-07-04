import type { CollectionConfig } from 'payload'

import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'

export const ProductCollections: CollectionConfig = {
  slug: 'productCollections',
  labels: { singular: 'Collection produit', plural: 'Collections produits' },
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Nom (ex : Coffret Découverte Kōdō)' },
    slugField('name'),
    { name: 'description', type: 'richText' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true },
    seoFields(),
  ],
}
