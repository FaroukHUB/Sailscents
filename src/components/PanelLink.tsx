'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  href: string
  tint: string
  title: string
  subtitle: string
}

export function PanelLink({ href, tint, title, subtitle }: Props) {
  const router = useRouter()
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
    window.setTimeout(() => router.push(href), 480)
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      style={{ ['--panel-tint' as string]: tint }}
      className={leaving ? 'is-leaving' : undefined}
    >
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
      </span>
    </a>
  )
}
