import { pushDevSchema } from '@payloadcms/drizzle'
import type { DrizzleAdapter } from '@payloadcms/drizzle/types'
import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

/**
 * Route temporaire a usage unique : cree les tables Postgres en production.
 * Payload ne synchronise le schema automatiquement qu'en developpement ; sans
 * cela, une base de production fraichement provisionnee reste vide.
 * A supprimer une fois les vraies migrations Payload en place.
 */
// Creer une vingtaine de tables via Neon peut depasser la limite par defaut (10s).
export const maxDuration = 60

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayloadClient()
    await pushDevSchema(payload.db as unknown as DrizzleAdapter)
    return NextResponse.json({ ok: true, message: 'Schema pousse avec succes.' })
  } catch (error) {
    console.error('Erreur bootstrap-db', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur inconnue', stack: error instanceof Error ? error.stack : undefined },
      { status: 500 },
    )
  }
}
