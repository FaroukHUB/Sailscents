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
// Son d'ouverture : un glissement de bois (comme un panneau shoji qui
// coulisse) suivi d'un léger « toc » quand le battant arrive en butée.
// Synthétisé via Web Audio (pas de fichier externe), volume bas, joué au clic.
let audioCtx: AudioContext | null = null
function playShojiSlide() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    audioCtx = audioCtx ?? new AC()
    const ctx = audioCtx
    if (ctx.state === 'suspended') void ctx.resume()

    const now = ctx.currentTime
    const dur = 0.7

    // Frottement du bois : bruit filtré qui enfle puis s'éteint.
    const size = Math.floor(ctx.sampleRate * dur)
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate)
    const channel = buffer.getChannelData(0)
    for (let i = 0; i < size; i++) channel[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 430
    band.Q.value = 0.7
    const slideGain = ctx.createGain()
    slideGain.gain.setValueAtTime(0.0001, now)
    slideGain.gain.linearRampToValueAtTime(0.1, now + 0.12)
    slideGain.gain.linearRampToValueAtTime(0.06, now + 0.45)
    slideGain.gain.linearRampToValueAtTime(0.0001, now + dur)
    noise.connect(band).connect(slideGain).connect(ctx.destination)
    noise.start(now)
    noise.stop(now + dur)

    // « Toc » de bois : le battant touche le cadre.
    const knockAt = now + dur * 0.9
    const knock = ctx.createOscillator()
    knock.type = 'triangle'
    knock.frequency.setValueAtTime(190, knockAt)
    knock.frequency.exponentialRampToValueAtTime(120, knockAt + 0.12)
    const knockGain = ctx.createGain()
    knockGain.gain.setValueAtTime(0.0001, knockAt)
    knockGain.gain.exponentialRampToValueAtTime(0.07, knockAt + 0.008)
    knockGain.gain.exponentialRampToValueAtTime(0.0001, knockAt + 0.16)
    knock.connect(knockGain).connect(ctx.destination)
    knock.start(knockAt)
    knock.stop(knockAt + 0.18)
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
