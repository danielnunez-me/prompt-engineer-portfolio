import { FieldValue } from 'firebase-admin/firestore'
import {
  DEFAULT_TRANSLATION_LOCALES,
  getDefaultLocaleStrings,
  isValidLocaleCode,
  LOCALE_CONFIG_DOC,
  type LocaleConfig,
  type LocaleEntry,
  type LocaleStrings,
} from '@/lib/i18n'
import { getDb, isFirebaseConfigured } from './firebase'

const LOCALES_COLLECTION = 'pageContentLocales'

export async function getLocaleConfig(): Promise<LocaleConfig> {
  if (!isFirebaseConfigured()) {
    return { locales: DEFAULT_TRANSLATION_LOCALES }
  }

  const snapshot = await getDb()
    .collection(LOCALES_COLLECTION)
    .doc(LOCALE_CONFIG_DOC)
    .get()

  if (!snapshot.exists) {
    return { locales: DEFAULT_TRANSLATION_LOCALES }
  }

  const data = snapshot.data() as LocaleConfig | undefined
  if (!data?.locales?.length) {
    return { locales: DEFAULT_TRANSLATION_LOCALES }
  }

  return {
    locales: data.locales.filter(
      (locale) => isValidLocaleCode(locale.code) && locale.code !== 'es',
    ),
  }
}

export async function getEnabledTranslationLocales(): Promise<LocaleEntry[]> {
  const config = await getLocaleConfig()
  return config.locales
}

export async function isTranslationLocaleEnabled(
  code: string,
): Promise<boolean> {
  if (code === 'es') return false
  const locales = await getEnabledTranslationLocales()
  return locales.some((locale) => locale.code === code)
}

export async function addTranslationLocale(
  code: string,
  label: string,
): Promise<LocaleConfig> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase credentials not configured')
  }

  const normalized = code.toLowerCase().trim()
  if (!isValidLocaleCode(normalized) || normalized === 'es') {
    throw new Error('Invalid locale code')
  }

  const config = await getLocaleConfig()
  if (config.locales.some((locale) => locale.code === normalized)) {
    throw new Error('Locale already exists')
  }

  const nextConfig: LocaleConfig = {
    locales: [...config.locales, { code: normalized, label: label.trim() }],
  }

  await getDb().collection(LOCALES_COLLECTION).doc(LOCALE_CONFIG_DOC).set(
    {
      ...nextConfig,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )

  const defaultStrings = await getDefaultLocaleStrings(normalized)
  if (Object.keys(defaultStrings).length > 0) {
    await getDb().collection(LOCALES_COLLECTION).doc(normalized).set(
      {
        data: defaultStrings,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
  }

  return nextConfig
}

export async function removeTranslationLocale(
  code: string,
): Promise<LocaleConfig> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase credentials not configured')
  }

  const normalized = code.toLowerCase().trim()
  const config = await getLocaleConfig()

  const nextConfig: LocaleConfig = {
    locales: config.locales.filter((locale) => locale.code !== normalized),
  }

  await getDb().collection(LOCALES_COLLECTION).doc(LOCALE_CONFIG_DOC).set(
    {
      ...nextConfig,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )

  await getDb().collection(LOCALES_COLLECTION).doc(normalized).delete()
  return nextConfig
}

export async function getLocaleTranslations(
  locale: string,
): Promise<LocaleStrings> {
  if (!isFirebaseConfigured()) {
    return getDefaultLocaleStrings(locale)
  }

  const snapshot = await getDb()
    .collection(LOCALES_COLLECTION)
    .doc(locale)
    .get()

  if (!snapshot.exists) {
    return {}
  }

  return (snapshot.data()?.data ?? {}) as LocaleStrings
}

export async function updateLocaleTranslation(
  locale: string,
  path: string,
  value: unknown,
): Promise<LocaleStrings> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase credentials not configured')
  }

  const enabled = await isTranslationLocaleEnabled(locale)
  if (!enabled) {
    throw new Error('Locale is not enabled')
  }

  const current = await getLocaleTranslations(locale)
  const updated = setByPath(current, path.split('.'), value) as LocaleStrings

  await getDb().collection(LOCALES_COLLECTION).doc(locale).set(
    {
      data: updated,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )

  return updated
}

function setByPath(obj: unknown, keys: string[], value: unknown): unknown {
  if (keys.length === 0) return value

  const [head, ...rest] = keys

  if (rest.length === 0) {
    if (Array.isArray(obj)) {
      const index = Number(head)
      if (Number.isNaN(index)) return obj
      const copy = [...obj]
      copy[index] = value
      return copy
    }
    const base =
      typeof obj === 'object' && obj !== null
        ? (obj as Record<string, unknown>)
        : {}
    return { ...base, [head]: value }
  }

  if (Array.isArray(obj)) {
    const index = Number(head)
    if (Number.isNaN(index)) return obj
    const copy = [...obj]
    copy[index] = setByPath(copy[index], rest, value)
    return copy
  }

  const record =
    typeof obj === 'object' && obj !== null
      ? { ...(obj as Record<string, unknown>) }
      : {}

  const nextKey = rest[0]
  const isNextIndex = !Number.isNaN(Number(nextKey))
  let child = record[head]
  if (child === undefined) {
    child = isNextIndex ? [] : {}
  }

  return {
    ...record,
    [head]: setByPath(child, rest, value),
  }
}
