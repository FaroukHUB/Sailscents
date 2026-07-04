import type { CollectionConfig } from 'payload'

import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: { useAsTitle: 'title', description: 'Pages statiques : Maison, Contact, Mentions légales, CGV, Confidentialité, Livraison...' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      name: 'layout',
      type: 'blocks',
      label: 'Contenu de la page',
      blocks: [
        {
          slug: 'hero',
          labels: { singular: 'Bloc Héro', plural: 'Blocs Héro' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'subheading', type: 'text' },
            { name: 'image', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          slug: 'content',
          labels: { singular: 'Bloc Texte', plural: 'Blocs Texte' },
          fields: [{ name: 'richText', type: 'richText' }],
        },
        {
          slug: 'cta',
          labels: { singular: "Bloc Appel à l'action", plural: "Blocs Appel à l'action" },
          fields: [
            { name: 'text', type: 'text' },
            { name: 'buttonLabel', type: 'text' },
            { name: 'buttonHref', type: 'text' },
          ],
        },
      ],
    },
    seoFields(),
  ],
}
