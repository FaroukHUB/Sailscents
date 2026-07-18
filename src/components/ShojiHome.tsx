'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Panel = {
  href: string
  title: string
  subtitle: string
  imageUrl?: string
  imageAlt?: string
}

type Props = {
  panels: Panel[]
}

/**
 * Accueil « rangee de portes shoji ».
 *
 * Chaque banniere est une porte shoji (deux battants) avec, derriere elle, sa
 * propre image (revelee a l'ouverture). Au clic sur une banniere, SA porte
 * s'ouvre, son image se revele, puis on navigue vers la page. En mouvement
 * reduit, un simple fondu vers le noir remplace le coulissement.
 */
export function ShojiHome({ panels }: Props) {
  const router = useRouter()
  const [openingHref, setOpeningHref] = useState<string | null>(null)
  const [fastExit, setFastExit] = useState(false)

  const enter = (event: React.MouseEvent, href: string) => {
    event.preventDefault()
    if (openingHref || fastExit) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setFastExit(true)
      window.setTimeout(() => router.push(href), 650)
      return
    }

    setOpeningHref(href)
    // Ouverture des battants (~1150 ms) + pause sur l'image (~1 s) + montee du
    // voile (voir globals.css). La navigation se fait une fois le voile plein.
    window.setTimeout(() => router.push(href), 2750)
  }

  return (
    <div className={`shoji-home${openingHref ? ' is-opening' : ''}${fastExit ? ' is-fast' : ''}`}>
      <nav className="shoji-cols" aria-label="Navigation principale">
        {panels.map((panel) => (
          <a
            key={panel.href}
            href={panel.href}
            className={`shoji-col${openingHref === panel.href ? ' is-opening' : ''}`}
            onClick={(e) => enter(e, panel.href)}
          >
            {/* La scene de la banniere : son image (revelee a l'ouverture).
                Fond flou + image entiere (contain) pour dezoomer sans rogner. */}
            <span className="col-scene" aria-hidden="true">
              {panel.imageUrl && (
                <>
                  <Image
                    src={panel.imageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 20vw, 100vw"
                    className="col-scene-bg"
                  />
                  <Image
                    src={panel.imageUrl}
                    alt={panel.imageAlt ?? ''}
                    fill
                    sizes="(min-width: 768px) 20vw, 100vw"
                    className="col-scene-img"
                  />
                </>
              )}
            </span>

            {/* La porte : deux battants qui coulissent. */}
            <span className="col-door" aria-hidden="true">
              <span className="col-leaf col-leaf-left" />
              <span className="col-leaf col-leaf-right" />
            </span>

            <span className="panel-label">
              <span className="panel-title block uppercase">{panel.title}</span>
              <span className="panel-subtitle mt-2 block font-[family-name:var(--font-display)] italic text-[color:var(--color-muted)]">
                {panel.subtitle}
              </span>
            </span>
          </a>
        ))}
      </nav>

      {/* Voile d'entree : recouvre l'ecran juste avant la navigation. */}
      <div className="shoji-veil" aria-hidden="true" />
    </div>
  )
}
