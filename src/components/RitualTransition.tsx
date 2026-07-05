'use client'

import { useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useRef, useState } from 'react'

type Phase = 'idle' | 'darkening' | 'ember' | 'opening' | 'focusing'

type RitualContextValue = {
  begin: (href: string) => void
}

const RitualContext = createContext<RitualContextValue | null>(null)

/**
 * A appeler depuis un lien qui doit declencher le rituel de sortie
 * (obscurite -> filet dore -> ecrans qui s'ecartent -> mise au point)
 * avant de naviguer, plutot qu'un <Link> classique.
 */
export function useRitualExit(): (href: string) => void {
  const ctx = useContext(RitualContext)
  if (!ctx) throw new Error('useRitualExit doit etre utilise sous RitualTransitionProvider')
  return ctx.begin
}

// La navigation reelle se fait a "darkFullAt", cachee derriere le noir complet.
const TIMINGS = {
  darkFullAt: 1100,
  emberAt: 1100,
  openAt: 1500,
  focusingAt: 2000,
  idleAt: 2400,
}

export function RitualTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')
  const timeoutsRef = useRef<number[]>([])

  const begin = useCallback(
    (href: string) => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        router.push(href)
        return
      }

      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
      const schedule = (fn: () => void, delay: number) => {
        timeoutsRef.current.push(window.setTimeout(fn, delay))
      }

      setPhase('darkening')
      schedule(() => router.push(href), TIMINGS.darkFullAt)
      schedule(() => setPhase('ember'), TIMINGS.emberAt)
      schedule(() => setPhase('opening'), TIMINGS.openAt)
      schedule(() => setPhase('focusing'), TIMINGS.focusingAt)
      schedule(() => setPhase('idle'), TIMINGS.idleAt)
    },
    [router],
  )

  return (
    <RitualContext.Provider value={{ begin }}>
      {children}
      <div className={`ritual-overlay ritual-phase-${phase}`} aria-hidden="true">
        <div className="ritual-panel ritual-panel-left" />
        <div className="ritual-panel ritual-panel-right" />
        <div className="ritual-ember" />
        <div className="ritual-focus" />
      </div>
    </RitualContext.Provider>
  )
}
