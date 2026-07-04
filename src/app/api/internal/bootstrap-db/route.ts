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
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const payload = await getPayloadClient()
  await pushDevSchema(payload.db as unknown as DrizzleAdapter)

  return NextResponse.json({ ok: true, message: 'Schema pousse avec succes.' })
}
