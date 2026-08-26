'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
// Son d'ouverture : enregistrement réel d'une porte coulissante japonaise
// (shoji). Joué via un élément <audio> — traité comme un média, donc audible
// sur iPhone MÊME en mode silencieux (contrairement à Web Audio). Déclenché au
// clic (geste utilisateur).
function playShojiSlide() {
  try {
    if (typeof window === 'undefined') return
    const audio = new Audio('/sounds/shoji-door.mp3')
    audio.volume = 0.5
    void audio.play().catch(() => {})
  } catch {
    // Le son est un bonus : en cas d'échec, on ignore silencieusement.
  }
}

export function ShojiHome({ panels }: Props) {
  const router = useRouter()
  const [openingHref, setOpeningHref] = useState<string | null>(null)
  const [fastExit, setFastExit] = useState(false)

  // Précharge les pages des portes dès l'accueil : au clic, la cible est déjà
  // récupérée, la navigation est quasi instantanée.
  useEffect(() => {
    panels.forEach((panel) => router.prefetch(panel.href))
  }, [panels, router])

  const enter = (event: React.MouseEvent, href: string) => {
    event.preventDefault()
    if (openingHref || fastExit) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setFastExit(true)
      window.setTimeout(() => router.push(href), 650)
      return
    }

    playShojiSlide()
    setOpeningHref(href)
    // Ouverture des battants, bref aperçu de l'image, puis navigation (la page
    // est déjà préchargée). Voile de couverture juste avant (voir globals.css).
    window.setTimeout(() => router.push(href), 1400)
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
            {/* La scene de la banniere : son image (revelee a l'ouverture),
                qui remplit toute la colonne. */}
            <span className="col-scene" aria-hidden="true">
              {panel.imageUrl && (
                <Image
                  src={panel.imageUrl}
                  alt={panel.imageAlt ?? ''}
                  fill
                  sizes="(min-width: 768px) 20vw, 100vw"
                  className="col-scene-img"
                />
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
