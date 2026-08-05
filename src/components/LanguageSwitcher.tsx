'use client'

import { usePathname, useRouter } from 'next/navigation'

import { locales, localeShort, isLocale, type Locale } from '@/i18n/config'

/**
 * Bascule de langue (FR · EN). Remplace le préfixe de langue dans l'URL
 * courante et mémorise le choix (cookie posé par le middleware au chargement).
 */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const switchTo = (target: Locale) => {
    if (target === locale) return
    const segments = pathname.split('/')
    if (isLocale(segments[1])) {
      segments[1] = target
    } else {
      segments.splice(1, 0, target)
    }
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
    router.push(segments.join('/') || `/${target}`)
  }

  return (
    <div className="lang-switcher" role="group" aria-label={label}>
      {locales.map((code, index) => (
        <span key={code} className="lang-switcher__item">
          {index > 0 && <span aria-hidden="true" className="lang-switcher__sep">·</span>}
          <button
            type="button"
            onClick={() => switchTo(code)}
            aria-current={code === locale ? 'true' : undefined}
            className={`lang-switcher__btn${code === locale ? ' is-active' : ''}`}
          >
            {localeShort[code]}
          </button>
        </span>
      ))}
    </div>
  )
}
