'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Panel = { href: string; title: string; subtitle: string }

type Props = {
  panels: Panel[]
  backgroundUrl?: string
  backgroundAlt?: string
}

/**
 * Accueil « rangee de portes shoji ».
 *
 * Une scene unique (tatami) couvre toute la rangee. Chaque banniere est une
 * porte shoji (deux battants) qui garde sa categorie. Au clic sur une banniere,
 * SA porte s'ouvre (ses deux battants coulissent), la scene se revele derriere,
 * puis on navigue vers la page.
 */
export function ShojiHome({ panels, backgroundUrl, backgroundAlt }: Props) {
  const router = useRouter()
  const [openingHref, setOpeningHref] = useState<string | null>(null)
  const [fastExit, setFastExit] = useState(false)

  const enter = (event: React.MouseEvent, href: string) => {
    event.preventDefault()
    if (openingHref || fastExit) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // Mouvement reduit : pas de coulissement des battants, juste un fondu
      // doux vers le noir (l'opacite reste acceptable en reduced-motion).
      setFastExit(true)
      window.setTimeout(() => router.push(href), 650)
      return
    }

    setOpeningHref(href)
    // Ouverture des battants (~1150 ms) + pause sur le tatami (~1 s) + montee
    // du voile (voir globals.css). La navigation se fait une fois le voile plein.
    window.setTimeout(() => router.push(href), 2750)
  }

  return (
    <div className={`shoji-home${openingHref ? ' is-opening' : ''}${fastExit ? ' is-fast' : ''}`}>
      {/* La scene : une seule image de fond, partagee par toutes les portes. */}
      <div className="shoji-scene" aria-hidden="true">
        {backgroundUrl && (
          <Image
            src={backgroundUrl}
            alt={backgroundAlt ?? ''}
            fill
            priority
            sizes="100vw"
            className="shoji-scene-img"
          />
        )}
      </div>

      {/* Une porte shoji par banniere. */}
      <nav className="shoji-cols" aria-label="Navigation principale">
        {panels.map((panel) => (
          <a
            key={panel.href}
            href={panel.href}
            className={`shoji-col${openingHref === panel.href ? ' is-opening' : ''}`}
            onClick={(e) => enter(e, panel.href)}
          >
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
