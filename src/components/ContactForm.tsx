'use client'

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const ERRORS: Record<string, string> = {
  missing_fields: 'Merci de renseigner votre nom, votre e-mail et votre message.',
  invalid_email: 'Cette adresse e-mail ne semble pas valide.',
  contact_not_configured:
    'Le formulaire n’est pas encore actif. Réessayez un peu plus tard — nous mettons cela en place.',
  send_failed: 'L’envoi a échoué. Merci de réessayer dans un instant.',
  default: 'Une erreur est survenue. Merci de réessayer.',
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setMessage('')

    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json().catch(() => ({}))

      if (res.ok) {
        setStatus('sent')
        form.reset()
        return
      }
      setStatus('error')
      setMessage(ERRORS[json?.error] ?? ERRORS.default)
    } catch {
      setStatus('error')
      setMessage(ERRORS.default)
    }
  }

  if (status === 'sent') {
    return (
      <div className="contact-form__done" role="status">
        <p className="text-lg">Merci, votre message est parti.</p>
        <p className="mt-2 text-[color:var(--color-muted)]">
          Nous vous répondons dès que possible, à l’adresse que vous avez indiquée.
        </p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      {/* Champ piège anti-spam : masqué aux humains. */}
      <div aria-hidden="true" className="contact-form__hp">
        <label>
          Ne pas remplir
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="contact-form__row">
        <label className="contact-field">
          <span>Nom</span>
          <input type="text" name="name" required maxLength={200} autoComplete="name" />
        </label>
        <label className="contact-field">
          <span>E-mail</span>
          <input type="email" name="email" required maxLength={200} autoComplete="email" />
        </label>
      </div>

      <label className="contact-field">
        <span>Sujet (facultatif)</span>
        <input type="text" name="subject" maxLength={200} />
      </label>

      <label className="contact-field">
        <span>Message</span>
        <textarea name="message" required rows={6} maxLength={5000} />
      </label>

      {status === 'error' && (
        <p className="contact-form__error" role="alert">
          {message}
        </p>
      )}

      <button type="submit" className="btn-gold" disabled={status === 'sending'}>
        {status === 'sending' ? 'Envoi…' : 'Envoyer le message'}
      </button>
    </form>
  )
}
