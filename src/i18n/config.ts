/**
 * Configuration des langues du site.
 * FR par défaut, EN disponible. (AR viendra en phase 2, avec la gestion RTL.)
 */
export const locales = ['fr', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'fr'

// Nom affiché dans le sélecteur (dans la langue elle-même).
export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
}

// Code court affiché dans l'en-tête (FR · EN).
export const localeShort: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
}

// Sens de lecture (préparé pour l'arabe en phase 2).
export const localeDir: Record<Locale, 'ltr' | 'rtl'> = {
  fr: 'ltr',
  en: 'ltr',
}

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value)
