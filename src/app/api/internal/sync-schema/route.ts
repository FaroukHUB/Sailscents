import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

/**
 * Route temporaire a usage unique : synchronise le schema Postgres en
 * production apres ajout d'une collection/global (ex: le Global "homepage").
 * Payload ne pousse le schema automatiquement qu'en developpement ; sans
 * migrations generees, chaque changement de schema doit etre rejoue ainsi
 * en production. Voir PROGRESS.md pour le detail du contournement
 * (createRequire de @payloadcms/drizzle resout un chemin fige au build,
 * invalide a l'execution sur Vercel — d'ou l'import direct de drizzle-kit/api
 * ci-dessous plutot que pushDevSchema).
 * A supprimer une fois de vraies migrations Payload en place.
 */
export const maxDuration = 60

type PostgresAdapterShape = {
  schema: Record<string, unknown>
  drizzle: Parameters<typeof import('drizzle-kit/api').pushSchema>[1]
  schemaName?: string
  tablesFilter?: string[]
  extensions?: Record<string, boolean>
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const { pushSchema } = await import('drizzle-kit/api')
    const payload = await getPayloadClient()
    const adapter = payload.db as unknown as PostgresAdapterShape

    const { apply, warnings, hasDataLoss } = await pushSchema(
      adapter.schema,
      adapter.drizzle,
      adapter.schemaName ? [adapter.schemaName] : undefined,
      adapter.tablesFilter,
      adapter.extensions?.postgis ? ['postgis'] : undefined,
    )
    await apply()

    return NextResponse.json({ ok: true, warnings, hasDataLoss })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
