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
 * Accueil « une seule image + porte shoji centrale ».
 *
 * Une scene unique couvre toute la rangee (plus aucun recadrage par bandeau).
 * Cinq colonnes cliquables la decoupent visuellement (liseres dores) en gardant
 * chacune sa categorie. Au clic, la porte shoji centrale s'ouvre (les deux
 * battants coulissent), le seuil s'assombrit, puis on navigue vers la page.
 */
export function ShojiHome({ panels, backgroundUrl, backgroundAlt }: Props) {
  const router = useRouter()
  const [opening, setOpening] = useState(false)

  const enter = (event: React.MouseEvent, href: string) => {
    event.preventDefault()
    if (opening) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      router.push(href)
      return
    }

    setOpening(true)
    // Doit correspondre a l'ouverture de la porte + montee du voile (voir globals.css).
    window.setTimeout(() => router.push(href), 1400)
  }

  return (
    <div className={`shoji-home${opening ? ' is-opening' : ''}`}>
      {/* La scene : une seule image de fond, partagee par tous les bandeaux. */}
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

      {/* Les 5 colonnes cliquables, avec libelle et liseres dores. */}
      <nav className="shoji-cols" aria-label="Navigation principale">
        {panels.map((panel) => (
          <a key={panel.href} href={panel.href} className="shoji-col" onClick={(e) => enter(e, panel.href)}>
            <span className="panel-label">
              <span className="panel-title block uppercase">{panel.title}</span>
              <span className="panel-subtitle mt-2 block font-[family-name:var(--font-display)] italic text-[color:var(--color-muted)]">
                {panel.subtitle}
              </span>
            </span>
          </a>
        ))}
      </nav>

      {/* La porte shoji centrale : deux battants qui coulissent. */}
      <div className="shoji-door" aria-hidden="true">
        <span className="shoji-threshold" />
        <span className="shoji-leaf shoji-leaf-left" />
        <span className="shoji-leaf shoji-leaf-right" />
        <span className="shoji-lintel" />
      </div>

      {/* Voile d'entree : recouvre l'ecran juste avant la navigation. */}
      <div className="shoji-veil" aria-hidden="true" />
    </div>
  )
}
