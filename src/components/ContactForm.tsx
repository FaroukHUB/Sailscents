'use client'

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export type ContactLabels = {
  name: string
  email: string
  subject: string
  message: string
  send: string
  sending: string
  sentTitle: string
  sentBody: string
  hp: string
  errors: {
    missing_fields: string
    invalid_email: string
    contact_not_configured: string
    send_failed: string
    default: string
  }
}

export function ContactForm({ labels }: { labels: ContactLabels }) {
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
      const key = (json?.error as keyof ContactLabels['errors']) ?? 'default'
      setMessage(labels.errors[key] ?? labels.errors.default)
    } catch {
      setStatus('error')
      setMessage(labels.errors.default)
    }
  }

  if (status === 'sent') {
    return (
      <div className="contact-form__done" role="status">
        <p className="text-lg">{labels.sentTitle}</p>
        <p className="mt-2 text-[color:var(--color-muted)]">{labels.sentBody}</p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      {/* Champ piège anti-spam : masqué aux humains. */}
      <div aria-hidden="true" className="contact-form__hp">
        <label>
          {labels.hp}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="contact-form__row">
        <label className="contact-field">
          <span>{labels.name}</span>
          <input type="text" name="name" required maxLength={200} autoComplete="name" />
        </label>
        <label className="contact-field">
          <span>{labels.email}</span>
          <input type="email" name="email" required maxLength={200} autoComplete="email" />
        </label>
      </div>

      <label className="contact-field">
        <span>{labels.subject}</span>
        <input type="text" name="subject" maxLength={200} />
      </label>

      <label className="contact-field">
        <span>{labels.message}</span>
        <textarea name="message" required rows={6} maxLength={5000} />
      </label>

      {status === 'error' && (
        <p className="contact-form__error" role="alert">
          {message}
        </p>
      )}

      <button type="submit" className="btn-gold" disabled={status === 'sending'}>
        {status === 'sending' ? labels.sending : labels.send}
      </button>
    </form>
  )
}
