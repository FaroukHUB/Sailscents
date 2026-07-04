import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Client Payload Local API, mis en cache par le runtime Next.js
 * (un seul appel a getPayload par processus).
 */
export const getPayloadClient = async () => getPayload({ config })
