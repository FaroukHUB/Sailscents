import type { Field } from 'payload'

const formatSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/**
 * Champ slug reutilisable : genere depuis `fieldToUse` si laisse vide,
 * sinon normalise tel quel. Unique et indexe pour servir de cle de routage.
 */
export const slugField = (fieldToUse = 'name'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL de la page, generee depuis le titre si laissee vide',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return formatSlug(value)
        const source = data?.[fieldToUse]
        return typeof source === 'string' ? formatSlug(source) : value
      },
    ],
  },
})
