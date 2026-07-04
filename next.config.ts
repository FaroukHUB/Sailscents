import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  // drizzle-kit est charge via `createRequire` (voir @payloadcms/drizzle), ce qui
  // echappe au tracage automatique des fichiers de Vercel : sans ceci, le module
  // est absent du bundle de la fonction serverless en production.
  serverExternalPackages: ['drizzle-kit'],
  outputFileTracingIncludes: {
    '/api/internal/bootstrap-db': ['./node_modules/drizzle-kit/**/*'],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
