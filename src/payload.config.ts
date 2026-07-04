import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Articles } from './collections/Articles'
import { Categories } from './collections/Categories'
import { Faqs } from './collections/Faqs'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import { Pages } from './collections/Pages'
import { ProductCollections } from './collections/ProductCollections'
import { Products } from './collections/Products'
import { Redirects } from './collections/Redirects'
import { Users } from './collections/Users'
import { Workshops } from './collections/Workshops'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname, 'app', '(payload)') },
    meta: {
      titleSuffix: '— Sailscents Admin',
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    ProductCollections,
    Products,
    Pages,
    Articles,
    Workshops,
    Faqs,
    Redirects,
    Orders,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
})
