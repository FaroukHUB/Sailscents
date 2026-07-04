import type { CollectionConfig } from 'payload'

const isSuperAdmin = (user: unknown): boolean =>
  (user as { role?: string } | null | undefined)?.role === 'superAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email', defaultColumns: ['name', 'email', 'role'] },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => isSuperAdmin(user),
    update: ({ req: { user } }) => isSuperAdmin(user),
    delete: ({ req: { user } }) => isSuperAdmin(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Super Admin', value: 'superAdmin' },
        { label: 'Gérant boutique', value: 'manager' },
        { label: 'Éditeur de contenu', value: 'editor' },
        { label: 'Support client', value: 'support' },
      ],
      access: {
        update: ({ req: { user } }) => isSuperAdmin(user),
      },
    },
  ],
}
