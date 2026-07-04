import type { CollectionConfig } from 'payload'

/**
 * Squelette minimal — les commandes sont créées côté serveur (webhook Stripe)
 * via la Local API, pas depuis l'admin ni depuis le front public.
 * Le détail (adresses, statut logistique, remboursements...) sera enrichi
 * quand l'intégration Stripe complète sera développée.
 */
export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Commande', plural: 'Commandes' },
  admin: { useAsTitle: 'stripeCheckoutSessionId', defaultColumns: ['customerEmail', 'total', 'status', 'createdAt'] },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => false,
    update: ({ req: { user } }) => Boolean(user),
    delete: () => false,
  },
  fields: [
    { name: 'stripeCheckoutSessionId', type: 'text', unique: true },
    { name: 'customerEmail', type: 'text' },
    { name: 'items', type: 'json', label: 'Détail des articles commandés' },
    { name: 'total', type: 'number' },
    { name: 'currency', type: 'text', defaultValue: 'eur' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Payée', value: 'paid' },
        { label: 'Expédiée', value: 'shipped' },
        { label: 'Annulée', value: 'cancelled' },
        { label: 'Remboursée', value: 'refunded' },
      ],
    },
  ],
}
