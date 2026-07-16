import {
  defaultPageContent,
  mergeWithDefaults,
  pageContentSchema,
  type PageContent,
} from '@/lib/content'
import { FieldValue } from 'firebase-admin/firestore'
import { getDb, isFirebaseConfigured } from './firebase'

const PAGE_CONTENT_DOC = 'main'

export async function getPageContent(): Promise<PageContent> {
  if (!isFirebaseConfigured()) {
    return defaultPageContent
  }

  const snapshot = await getDb()
    .collection('pageContent')
    .doc(PAGE_CONTENT_DOC)
    .get()

  if (!snapshot.exists) {
    return defaultPageContent
  }

  const data = snapshot.data()?.data
  return pageContentSchema.parse(mergeWithDefaults(data))
}

export async function updatePageContent(
  path: string,
  value: unknown,
): Promise<PageContent> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase credentials not configured')
  }

  const current = await getPageContent()
  const updated = setByPath(current, path.split('.'), value)
  const parsed = pageContentSchema.parse(updated)

  await getDb().collection('pageContent').doc(PAGE_CONTENT_DOC).set(
    {
      data: parsed,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )

  return parsed
}

export async function seedPageContent(content: PageContent): Promise<void> {
  const parsed = pageContentSchema.parse(content)

  await getDb().collection('pageContent').doc(PAGE_CONTENT_DOC).set(
    {
      data: parsed,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )
}

export async function ensurePageContentInitialized(): Promise<{
  seeded: boolean
}> {
  if (!isFirebaseConfigured()) {
    return { seeded: false }
  }

  const snapshot = await getDb()
    .collection('pageContent')
    .doc(PAGE_CONTENT_DOC)
    .get()

  if (snapshot.exists) {
    return { seeded: false }
  }

  await seedPageContent(defaultPageContent)
  return { seeded: true }
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
    if (typeof obj === 'object' && obj !== null) {
      return { ...(obj as Record<string, unknown>), [head]: value }
    }
    return obj
  }

  if (Array.isArray(obj)) {
    const index = Number(head)
    if (Number.isNaN(index)) return obj
    const copy = [...obj]
    copy[index] = setByPath(copy[index], rest, value)
    return copy
  }

  if (typeof obj === 'object' && obj !== null) {
    const record = obj as Record<string, unknown>
    return {
      ...record,
      [head]: setByPath(record[head], rest, value),
    }
  }

  return obj
}
