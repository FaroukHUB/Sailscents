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
// Node.js requis (drizzle-kit n'est pas compatible edge) ; on demande le delai
// maximal (300 s sur les offres Pro, plafonne a 60 s sur Hobby — sans effet
// negatif). L'operation est idempotente : en cas de timeout a froid, il suffit
// de relancer, chaque essai ne rejoue que ce qui manque encore.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

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
    // Init Payload et import de drizzle-kit en parallele pour reduire le
    // temps de demarrage a froid (les deux sont lourds).
    const [{ pushSchema }, payload] = await Promise.all([
      import('drizzle-kit/api'),
      getPayloadClient(),
    ])
    const adapter = payload.db as unknown as PostgresAdapterShape

    const { apply, warnings, hasDataLoss, statementsToExecute } = await pushSchema(
      adapter.schema,
      adapter.drizzle,
      adapter.schemaName ? [adapter.schemaName] : undefined,
      adapter.tablesFilter,
      adapter.extensions?.postgis ? ['postgis'] : undefined,
    )
    await apply()

    return NextResponse.json({
      ok: true,
      applied: statementsToExecute?.length ?? 0,
      warnings,
      hasDataLoss,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
