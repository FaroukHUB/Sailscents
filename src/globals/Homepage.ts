import type { GlobalConfig } from 'payload'

const panelField = (name: string, label: string) => ({
  name,
  type: 'group' as const,
  label,
  fields: [
    { name: 'image', type: 'upload' as const, relationTo: 'media' as const, label: 'Image' },
  ],
})

/**
 * Page d'accueil : l'image revelee derriere chaque porte shoji quand elle
 * s'ouvre. On reutilise les 5 champs historiques (dont les colonnes existent
 * deja en base) plutot que d'ajouter des champs qui exigeraient une synchro de
 * schema en production. Seuls les libelles changent ; l'ordre suit les portes.
 */
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: "Page d'accueil",
  admin: {
    description:
      'Image révélée derrière chaque porte quand elle s’ouvre. Une image paysage par bannière ; un champ vide garde le fond par défaut.',
  },
  access: { read: () => true },
  fields: [
    panelField('boutiquePanel', 'Image — Les Parfums'),
    panelField('collectionsPanel', 'Image — Les Encens'),
    panelField('ateliersPanel', 'Image — Les Raretés'),
    panelField('journalPanel', 'Image — Nos Boutiques'),
    panelField('maisonPanel', 'Image — À propos de nous'),
  ],
}
