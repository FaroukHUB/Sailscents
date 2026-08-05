import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

/**
 * Envoi du formulaire de contact par e-mail (SMTP).
 *
 * Variables d'environnement attendues (à définir dans Vercel) :
 *   SMTP_HOST      ex. smtp.gmail.com
 *   SMTP_PORT      ex. 465 (SSL) ou 587 (STARTTLS)
 *   SMTP_USER      identifiant SMTP (souvent l'adresse d'envoi)
 *   SMTP_PASS      mot de passe / mot de passe d'application
 *   CONTACT_TO     adresse qui reçoit les messages (défaut : SMTP_USER)
 *
 * Tant que ces variables ne sont pas renseignées, la route répond 503 et le
 * formulaire invite à réessayer plus tard (rien n'est perdu côté visiteur).
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim()
  const subject = String(body.subject ?? '').trim()
  const message = String(body.message ?? '').trim()
  const honeypot = String(body.company ?? '').trim() // champ piège anti-spam

  // Un bot a rempli le champ caché : on répond « ok » sans rien envoyer.
  if (honeypot) return NextResponse.json({ ok: true })

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }
  if (message.length > 5000 || name.length > 200 || subject.length > 200) {
    return NextResponse.json({ error: 'too_long' }, { status: 400 })
  }

  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const port = Number(process.env.SMTP_PORT || 465)
  const to = process.env.CONTACT_TO || user

  if (!host || !user || !pass || !to) {
    return NextResponse.json({ error: 'contact_not_configured' }, { status: 503 })
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    await transporter.sendMail({
      from: `"Sailscents — Contact" <${user}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject: subject ? `[Contact] ${subject}` : `[Contact] Message de ${name}`,
      text: `Nom : ${name}\nE-mail : ${email}\nSujet : ${subject || '(sans sujet)'}\n\n${message}`,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'send_failed', detail: error instanceof Error ? error.message : String(error) },
      { status: 502 },
    )
  }
}
