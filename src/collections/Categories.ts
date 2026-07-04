import type { CollectionConfig } from 'payload'

import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Univers', plural: 'Univers' },
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Nom (ex : Oud, Attars, Encens, Café, Thé)' },
    slugField('name'),
    { name: 'description', type: 'richText' },
    { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Image de couverture' },
    seoFields(),
  ],
}
