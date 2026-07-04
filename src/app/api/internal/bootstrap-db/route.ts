import { pushDevSchema } from '@payloadcms/drizzle'
import type { DrizzleAdapter } from '@payloadcms/drizzle/types'
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

import { getPayloadClient } from '@/lib/payload'

/**
 * Route de diagnostic + bootstrap temporaire.
 * Rapporte precisement a quelle base (hote/nom, redacte) la fonction se
 * connecte reellement, liste les tables avant/apres le push, et n'avale
 * aucune erreur silencieusement. A supprimer une fois de vraies migrations
 * Payload en place.
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

  try {
    diagnostics.before = await listPublicTables()
  } catch (error) {
    diagnostics.beforeError = error instanceof Error ? { message: error.message, stack: error.stack } : String(error)
    return NextResponse.json(diagnostics, { status: 500 })
  }

  try {
    const payload = await getPayloadClient()
    await pushDevSchema(payload.db as unknown as DrizzleAdapter)
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
