import { defaultLocale, isLocale, type Locale } from './config'
import { en } from './dictionaries/en'
import { fr, type Dictionary } from './dictionaries/fr'

const dictionaries: Record<Locale, Dictionary> = { fr, en }

/** Renvoie le dictionnaire de la langue (repli sur FR si inconnue). */
export const getDictionary = (locale: string): Dictionary =>
  dictionaries[isLocale(locale) ? locale : defaultLocale]

export type { Dictionary }
