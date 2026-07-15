import { applyLocaleOverlay, getDefaultLocaleStrings } from '@/lib/i18n'
import type { PageContent } from '@/lib/content'
import { getPageContent } from './content'
import {
  getLocaleTranslations,
  isTranslationLocaleEnabled,
} from './locale-config'

export async function getLocalizedPageContent(
  locale: string,
): Promise<PageContent> {
  const spanish = await getPageContent()

  if (locale === 'es') {
    return spanish
  }

  const enabled = await isTranslationLocaleEnabled(locale)
  if (!enabled) {
    // Still apply static fallbacks for known locales (e.g. en) when config defaults
    const fallback = await getDefaultLocaleStrings(locale)
    if (Object.keys(fallback).length > 0) {
      return applyLocaleOverlay(spanish, null, fallback)
    }
    return spanish
  }

  const overlay = await getLocaleTranslations(locale)
  const fallback = await getDefaultLocaleStrings(locale)
  return applyLocaleOverlay(spanish, overlay, fallback)
}

export {
  getLocaleConfig,
  getEnabledTranslationLocales,
  isTranslationLocaleEnabled,
  addTranslationLocale,
  removeTranslationLocale,
  getLocaleTranslations,
  updateLocaleTranslation,
} from './locale-config'
