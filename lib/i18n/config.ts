import {
  DEFAULT_TRANSLATION_LOCALES,
  isValidLocaleCode,
  type LocaleEntry,
} from './locale-strings'

export const DEFAULT_LOCALE = 'es'

export const LOCALE_PARAM = 'lang'

export const LOCALE_HEADER = 'x-locale'

export const LOCALE_CONFIG_DOC = '_config'

export type SupportedLocale = string

export function isDefaultLocale(value: string): boolean {
  return value === DEFAULT_LOCALE
}

export function isSupportedLocale(
  value: string,
  enabledLocales: LocaleEntry[] = DEFAULT_TRANSLATION_LOCALES,
): boolean {
  if (isDefaultLocale(value)) return true
  if (!isValidLocaleCode(value)) return false
  return enabledLocales.some((locale) => locale.code === value)
}

export function getTranslationLocaleCodes(
  enabledLocales: LocaleEntry[] = DEFAULT_TRANSLATION_LOCALES,
): string[] {
  return enabledLocales.map((locale) => locale.code)
}
