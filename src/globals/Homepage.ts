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
    panelField('boutiquePanel', 'Bandeau — Boutique'),
    panelField('collectionsPanel', 'Bandeau — Collections'),
    panelField('ateliersPanel', 'Bandeau — Ateliers'),
    panelField('journalPanel', 'Bandeau — Le Journal'),
    panelField('maisonPanel', 'Bandeau — La Maison'),
  ],
}
