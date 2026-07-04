import { NextResponse } from 'next/server'
import { Pool } from 'pg'

import { getPayloadClient } from '@/lib/payload'

/** Sous-ensemble des champs de l'adaptateur Postgres dont on a besoin ici. */
type PostgresAdapterShape = {
  schema: Record<string, unknown>
  drizzle: Parameters<typeof import('drizzle-kit/api').pushSchema>[1]
  schemaName?: string
  tablesFilter?: string[]
  extensions?: Record<string, boolean>
}

/**
 * Route de diagnostic + bootstrap temporaire.
 * Rapporte precisement a quelle base (hote/nom, redacte) la fonction se
 * connecte reellement, liste les tables avant/apres le push, et n'avale
 * aucune erreur silencieusement. A supprimer une fois de vraies migrations
 * Payload en place.
 *
 * N'utilise PAS `pushDevSchema` de @payloadcms/drizzle : cette fonction
 * charge drizzle-kit via `createRequire(import.meta.url)`, qui resout un
 * chemin fige au moment du build (`/vercel/path0/...`) inexistant a
 * l'execution sur Vercel (`/var/task/...`), meme quand drizzle-kit est
 * bien present et resoluble depuis notre propre code. On reimplemente donc
 * ici la meme logique via un import direct de drizzle-kit/api.
 */
export const maxDuration = 60

const describeConnection = () => {
  const raw = process.env.DATABASE_URI || ''
  try {
    const url = new URL(raw)
    return {
      host: url.hostname,
      database: url.pathname.replace(/^\//, ''),
      user: url.username,
      params: url.search,
      isPooler: url.hostname.includes('-pooler'),
    }
  } catch {
    return { error: 'DATABASE_URI absent ou invalide', raw: raw ? '(present mais invalide)' : '(absent)' }
  }
}

const needsSSL = () => {
  const raw = process.env.DATABASE_URI || ''
  return !raw.includes('localhost') && !raw.includes('127.0.0.1')
}

const listPublicTables = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URI,
    ssl: needsSSL() ? { rejectUnauthorized: false } : undefined,
  })
  try {
    const dbResult = await pool.query('SELECT current_database() AS db')
    const tablesResult = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`,
    )
    return {
      currentDatabase: dbResult.rows[0]?.db ?? null,
      tables: tablesResult.rows.map((r) => r.table_name),
    }
  } finally {
    await pool.end()
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const connection = describeConnection()
  const diagnostics: Record<string, unknown> = { connection }

  let pushSchema: typeof import('drizzle-kit/api').pushSchema
  try {
    ;({ pushSchema } = await import('drizzle-kit/api'))
    diagnostics.drizzleKitModule = { resolvable: true }
  } catch (error) {
    diagnostics.drizzleKitModule = {
      resolvable: false,
      error: error instanceof Error ? error.message : String(error),
    }
    return NextResponse.json(diagnostics, { status: 500 })
  }

  try {
    diagnostics.before = await listPublicTables()
  } catch (error) {
    diagnostics.beforeError = error instanceof Error ? { message: error.message, stack: error.stack } : String(error)
    return NextResponse.json(diagnostics, { status: 500 })
  }

  try {
    const payload = await getPayloadClient()
    const adapter = payload.db as unknown as PostgresAdapterShape
    const { apply, warnings, hasDataLoss } = await pushSchema(
      adapter.schema,
      adapter.drizzle,
      adapter.schemaName ? [adapter.schemaName] : undefined,
      adapter.tablesFilter,
      adapter.extensions?.postgis ? ['postgis'] : undefined,
    )
    diagnostics.warnings = warnings
    diagnostics.hasDataLoss = hasDataLoss
    await apply()
    diagnostics.pushResult = 'ok'
  } catch (error) {
    diagnostics.pushResult = 'error'
    diagnostics.pushError =
      error instanceof Error ? { message: error.message, stack: error.stack } : String(error)
  }

  try {
    diagnostics.after = await listPublicTables()
  } catch (error) {
    diagnostics.afterError = error instanceof Error ? { message: error.message, stack: error.stack } : String(error)
  }

  return NextResponse.json(diagnostics, { status: 200 })
}
