import type { GlobalConfig } from 'payload'

/**
 * Page d'accueil. Le nouveau design n'utilise plus qu'UNE image de fond (la
 * scène tatami révélée quand la porte shoji s'ouvre). On conserve le champ
 * historique `boutiquePanel` — dont la colonne existe déjà en base — plutôt
 * que d'ajouter un champ qui exigerait une synchro de schéma en production.
 * Seul le libellé change ; le texte des bandeaux reste géré dans le code.
 */
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: "Page d'accueil",
  admin: {
    description:
      'Image de fond de l’accueil : la scène (tatami / salon de thé) révélée quand la porte shoji s’ouvre. Une seule image paysage, sans porte à dessiner.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'boutiquePanel',
      type: 'group',
      label: 'Image de fond (scène tatami révélée derrière la porte)',
      fields: [
        { name: 'image', type: 'upload' as const, relationTo: 'media' as const, label: 'Image' },
      ],
    },
  ],
}
