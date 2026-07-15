/** Text-only overlay for a locale. Structure/URLs always come from Spanish. */

export interface LocaleStrings {
  seo?: {
    title?: string
    description?: string
    openGraphTitle?: string
    openGraphDescription?: string
    openGraphSiteName?: string
  }
  profile?: {
    name?: string
    role?: string
    availabilityLabel?: string
    descriptions?: string[]
    socials?: Array<{ id?: string; label?: string }>
  }
  stats?: {
    items?: Array<{ id?: string; value?: string; label?: string }>
  }
  models?: {
    heading?: string
    items?: Array<{ id?: string; name?: string; status?: string }>
  }
  skills?: {
    heading?: string
    items?: string[]
  }
  projects?: {
    heading?: string
  }
}

export interface LocaleEntry {
  code: string
  label: string
}

export interface LocaleConfig {
  locales: LocaleEntry[]
}

export const DEFAULT_TRANSLATION_LOCALES: LocaleEntry[] = [
  { code: 'en', label: 'English' },
]

export function isValidLocaleCode(code: string): boolean {
  return /^[a-z]{2}$/.test(code)
}

function hasId(value: unknown): value is { id: string } {
  return typeof value === 'object' && value !== null && 'id' in value
}

export function findByIdOrIndex<T>(
  items: T[] | undefined,
  id: string | undefined,
  index: number,
): T | undefined {
  if (!items?.length) return undefined
  if (id) {
    const byId = items.find(
      (item) => hasId(item) && item.id === id,
    ) as T | undefined
    if (byId) return byId
  }
  return items[index]
}

/** overlay → static fallback → Spanish CMS */
export function pickString(
  spanish: string,
  overlay?: string,
  fallback?: string,
): string {
  if (overlay !== undefined && overlay !== '') return overlay
  if (fallback !== undefined && fallback !== '') return fallback
  return spanish
}

export function pickStringArray(
  spanish: string[],
  overlay?: string[],
  fallback?: string[],
): string[] {
  if (overlay !== undefined && overlay.length > 0) return overlay
  if (fallback !== undefined && fallback.length > 0) return fallback
  return spanish
}
