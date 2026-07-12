import type { GlobalConfig } from 'payload'

const panelField = (name: string, label: string) => ({
  name,
  type: 'group' as const,
  label,
  fields: [
    { name: 'image', type: 'upload' as const, relationTo: 'media' as const, label: 'Image du bandeau' },
  ],
})

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: "Page d'accueil",
  admin: {
    description: "Image de chaque bandeau de la page d'accueil (le texte reste gere dans le code, uniquement les images sont modifiables ici).",
  },
  access: { read: () => true },
  fields: [
    {
      name: 'background',
      type: 'upload',
      relationTo: 'media',
      label: 'Image de fond (scène unique, avec la porte)',
      admin: {
        description:
          'Une seule image paysage couvrant toute la rangée de bandeaux. Idéalement une scène japonaise avec la porte au centre.',
      },
    },
    panelField('boutiquePanel', 'Bandeau — Boutique'),
    panelField('collectionsPanel', 'Bandeau — Collections'),
    panelField('ateliersPanel', 'Bandeau — Le Rituel'),
    panelField('journalPanel', 'Bandeau — Le Journal'),
    panelField('maisonPanel', 'Bandeau — La Maison'),
  ],
}
