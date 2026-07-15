import { defaultPageContent } from './defaults'
import type { PageContent } from './schema'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function mergeWithDefaults(
  data: unknown,
  defaults: PageContent = defaultPageContent,
): PageContent {
  if (Array.isArray(data) && Array.isArray(defaults)) {
    return (data.length > 0 ? data : defaults) as PageContent
  }

  if (!isPlainObject(data) || !isPlainObject(defaults)) {
    return (data ?? defaults) as PageContent
  }

  const result: Record<string, unknown> = { ...defaults }

  for (const key of Object.keys(defaults)) {
    const defaultValue = defaults[key as keyof PageContent]
    const incoming = data[key]

    if (incoming === undefined) {
      result[key] = defaultValue
      continue
    }

    if (Array.isArray(defaultValue)) {
      result[key] = Array.isArray(incoming) ? incoming : defaultValue
      continue
    }

    if (isPlainObject(defaultValue) && isPlainObject(incoming)) {
      result[key] = mergeWithDefaults(incoming, defaultValue as PageContent)
      continue
    }

    result[key] = incoming
  }

  return result as PageContent
}
