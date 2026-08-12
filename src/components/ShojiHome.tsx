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
// Son d'ouverture : un glissement de bois (panneau shoji qui coulisse) suivi
// d'un léger « toc » en butée. Généré une fois en WAV (pas de fichier externe)
// et joué via un élément <audio> — traité comme un média, donc audible sur
// iPhone MÊME en mode silencieux (contrairement à Web Audio, coupé par le
// bouton silence). Joué au clic (geste utilisateur).
let shojiUrl: string | null = null

function buildShojiWav(): string {
  const sr = 44100
  const dur = 0.7
  const n = Math.floor(sr * dur)
  const samples = new Float32Array(n)

  // Frottement du bois : bruit passé deux fois en passe-bas (grave, boisé),
  // avec une enveloppe qui enfle puis s'éteint.
  let lp1 = 0
  let lp2 = 0
  for (let i = 0; i < n; i++) {
    const t = i / sr
    let env: number
    if (t < 0.12) env = (t / 0.12) * 0.32
    else if (t < 0.45) env = 0.32 - ((t - 0.12) / 0.33) * (0.32 - 0.2)
    else env = 0.2 * Math.max(0, (dur - t) / (dur - 0.45))
    const white = Math.random() * 2 - 1
    lp1 += (white - lp1) * 0.16
    lp2 += (lp1 - lp2) * 0.16
    samples[i] = lp2 * 7 * env
  }

  // « Toc » de bois en fin de course (le battant touche le cadre).
  const knockStart = Math.floor(dur * 0.9 * sr)
  for (let i = knockStart; i < n; i++) {
    const t = (i - knockStart) / sr
    const freq = 150 * Math.exp(-t * 5) + 110
    const env = Math.exp(-t * 16) * 0.35
    samples[i] += Math.sin(2 * Math.PI * freq * t) * env
  }

  // Encodage WAV PCM 16 bits mono.
  const buffer = new ArrayBuffer(44 + n * 2)
  const view = new DataView(buffer)
  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i))
  }
  writeStr(0, 'RIFF')
  view.setUint32(4, 36 + n * 2, true)
  writeStr(8, 'WAVE')
  writeStr(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sr, true)
  view.setUint32(28, sr * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeStr(36, 'data')
  view.setUint32(40, n * 2, true)
  let off = 44
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(off, v < 0 ? v * 0x8000 : v * 0x7fff, true)
    off += 2
  }
  return URL.createObjectURL(new Blob([view], { type: 'audio/wav' }))
}

function playShojiSlide() {
  try {
    if (typeof window === 'undefined') return
    if (!shojiUrl) shojiUrl = buildShojiWav()
    const audio = new Audio(shojiUrl)
    audio.volume = 0.85
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
