import type { CollectionConfig } from 'payload'

import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'

export const Workshops: CollectionConfig = {
  slug: 'workshops',
  labels: { singular: 'Atelier', plural: 'Ateliers' },
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'Publié', value: 'published' },
        { label: 'Complet', value: 'full' },
        { label: 'Archivé', value: 'archived' },
      ],
    },
    { name: 'shortDescription', type: 'textarea' },
    { name: 'description', type: 'richText', label: 'Description longue (storytelling de l\'expérience)' },
    { name: 'location', type: 'text', label: 'Lieu' },
    { name: 'duration', type: 'text', label: 'Durée' },
    { name: 'capacity', type: 'number', label: 'Capacité maximale' },
    { name: 'price', type: 'number', label: 'Prix (€)' },
    {
      name: 'sessions',
      type: 'array',
      label: 'Sessions / dates disponibles',
      fields: [
        { name: 'date', type: 'date', required: true },
        { name: 'seatsAvailable', type: 'number', label: 'Places restantes' },
      ],
    },
    {
      name: 'host',
      type: 'group',
      label: 'Intervenant',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'bio', type: 'textarea' },
        { name: 'photo', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    seoFields(),
  ],
}
