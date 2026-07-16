import {
  DEFAULT_LOCALE,
  getTranslationLocaleCodes,
  isDefaultLocale,
} from './config'
import {
  DEFAULT_TRANSLATION_LOCALES,
  isValidLocaleCode,
  type LocaleEntry,
} from './locale-strings'
import { parseAcceptLanguage, primaryLanguageTag } from './parse-accept-language'

export interface ResolveLocaleInput {
  langParam?: string | null
  acceptLanguage?: string | null
  enabledLocales?: LocaleEntry[]
}

/**
 * Resolves locale with priority:
 * 1. ?lang= query param
 * 2. Accept-Language header
 * 3. DEFAULT_LOCALE fallback
 */
export function resolveLocale(input: ResolveLocaleInput): string {
  const { langParam, acceptLanguage } = input
  const enabledLocales = input.enabledLocales ?? DEFAULT_TRANSLATION_LOCALES
  const translationCodes = getTranslationLocaleCodes(enabledLocales)
  const allCodes = [DEFAULT_LOCALE, ...translationCodes]

  if (langParam) {
    const normalized = primaryLanguageTag(langParam.toLowerCase().trim())
    if (isDefaultLocale(normalized)) return DEFAULT_LOCALE
    if (isValidLocaleCode(normalized) && allCodes.includes(normalized)) {
      return normalized
    }
    return DEFAULT_LOCALE
  }

  const tags = parseAcceptLanguage(acceptLanguage ?? null)
  for (const tag of tags) {
    const primary = primaryLanguageTag(tag)
    if (allCodes.includes(primary)) {
      return primary
    }
  }

  return DEFAULT_LOCALE
}
