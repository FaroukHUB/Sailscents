import type { GlobalConfig } from 'payload'

const imageField = (name: string, label: string) => ({
  name,
  type: 'upload' as const,
  relationTo: 'media' as const,
  label,
})

/**
 * Images des pages editoriales (Le Rituel, La Maison). Le texte de ces pages
 * reste gere dans le code ; seules les photos sont modifiables ici. Un champ
 * laisse vide conserve le visuel par defaut (aplat « Photo a venir »).
 */
export const PageMedia: GlobalConfig = {
  slug: 'pageMedia',
  label: 'Images des pages',
  admin: {
    description:
      'Photos des pages Le Rituel et La Maison. Laisser un champ vide conserve le visuel par défaut.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'rituel',
      type: 'group',
      label: 'Le Rituel',
      fields: [
        imageField('accueil', 'L’accueil — le tatami'),
        imageField('encens', 'L’encens — l’encensoir'),
        imageField('degustation', 'La dégustation — thé & café'),
        imageField('decouverte', 'La découverte — les essences'),
      ],
    },
    {
      name: 'maison',
      type: 'group',
      label: 'La Maison',
      fields: [
        imageField('matieres', 'Les matières — Oud & Attars'),
        imageField('sourcing', 'Le sourcing — la sélection'),
      ],
    },
  ],
}
