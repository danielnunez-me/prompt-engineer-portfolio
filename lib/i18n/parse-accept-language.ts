/**
 * Lightweight Accept-Language parser (no dependencies).
 * Returns language tags ordered by quality (highest first).
 */
export function parseAcceptLanguage(header: string | null): string[] {
  if (!header) return []

  return header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      let quality = 1
      for (const param of params) {
        const qMatch = param.trim().match(/^q=(\d+(?:\.\d+)?)$/)
        if (qMatch) {
          quality = parseFloat(qMatch[1])
        }
      }
      return { tag: tag.toLowerCase(), quality }
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.quality - a.quality)
    .map((entry) => entry.tag)
}

/** Extracts the primary language subtag (e.g. "en-US" → "en"). */
export function primaryLanguageTag(tag: string): string {
  return tag.split('-')[0]
}
