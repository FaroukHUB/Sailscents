'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useRitualExit } from '@/components/RitualTransition'

type Props = {
  href: string
  tint: string
  title: string
  subtitle: string
  imageUrl?: string
  imageAlt?: string
}

export function PanelLink({ href, tint, title, subtitle, imageUrl, imageAlt }: Props) {
  const router = useRouter()
  const beginRitual = useRitualExit()
  const [leaving, setLeaving] = useState(false)

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    if (leaving) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      router.push(href)
      return
    }

    setLeaving(true)
    beginRitual(href)
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      style={{ ['--panel-tint' as string]: tint }}
      className={leaving ? 'is-leaving' : undefined}
    >
      {imageUrl && (
        <>
          {/* Fond flou : meme image en cover, floutee et assombrie, pour
              remplir le bandeau sans vide quand la photo ne remplit pas tout. */}
          <Image
            src={imageUrl}
            alt=""
            fill
            aria-hidden="true"
            sizes="(min-width: 768px) 30vw, 100vw"
            className="panel-image-bg"
            priority={false}
          />
          {/* Image nette entiere (jamais rognee) au premier plan. */}
          <Image
            src={imageUrl}
            alt={imageAlt ?? ''}
            fill
            sizes="(min-width: 768px) 30vw, 100vw"
            className="panel-image"
            priority={false}
          />
        </>
      )}
      <span className="panel-label">
        <span className="panel-title block uppercase">{title}</span>
        <span className="panel-subtitle mt-2 block font-[family-name:var(--font-display)] italic text-[color:var(--color-muted)]">
          {subtitle}
        </span>
      </span>
      <span className="smoke" aria-hidden="true">
        <span className="smoke-puff smoke-puff-1" />
        <span className="smoke-puff smoke-puff-2" />
        <span className="smoke-puff smoke-puff-3" />
        <span className="smoke-puff smoke-puff-4" />
        <span className="smoke-puff smoke-puff-5" />
      </span>
    </a>
  )
}
