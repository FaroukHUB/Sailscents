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
  // Cle large ('**') plutot que le chemin exact de la route, pour eliminer tout
  // risque de mauvaise correspondance avec la normalisation interne des routes.
  outputFileTracingIncludes: {
    '**': ['./node_modules/drizzle-kit/**/*'],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
