import type { CollectionConfig } from 'payload'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: { singular: 'Redirection', plural: 'Redirections' },
  admin: { useAsTitle: 'sourcePath', description: 'Redirections 301/302 gérables sans intervention technique' },
  access: { read: () => true },
  fields: [
    { name: 'sourcePath', type: 'text', required: true, unique: true, label: 'Chemin source (ex : /ancien-produit)' },
    { name: 'destinationPath', type: 'text', required: true, label: 'Chemin de destination' },
    {
      name: 'type',
      type: 'select',
      defaultValue: '301',
      options: [
        { label: '301 (permanente)', value: '301' },
        { label: '302 (temporaire)', value: '302' },
      ],
    },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}
