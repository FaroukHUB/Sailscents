import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale, isLocale, type Locale } from '@/i18n/config'

const LOCALE_COOKIE = 'NEXT_LOCALE'

// Détermine la langue : cookie (choix mémorisé) → langue du navigateur → défaut.
function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (cookie && isLocale(cookie)) return cookie

  const accept = request.headers.get('accept-language') ?? ''
  const preferred = accept
    .split(',')
    .map((part) => part.split(';')[0].trim().slice(0, 2).toLowerCase())
  for (const code of preferred) {
    if (isLocale(code)) return code
  }
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const firstSegment = pathname.split('/')[1]

  // Le chemin porte déjà une langue valide : on sert la page et on mémorise le choix.
  if (isLocale(firstSegment)) {
    const response = NextResponse.next()
    if (request.cookies.get(LOCALE_COOKIE)?.value !== firstSegment) {
      response.cookies.set(LOCALE_COOKIE, firstSegment, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      })
    }
    return response
  }

  // Sinon : redirection vers la langue détectée, en conservant le chemin.
  const locale = detectLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

// On exclut les fichiers, les internes Next, l'API et l'admin Payload.
export const config = {
  matcher: ['/((?!_next|api|admin|.*\\..*).*)'],
}
