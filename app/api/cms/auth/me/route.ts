import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  ensurePageContentInitialized,
  isValidEditKey,
  isFirebaseConfigured,
  SESSION_COOKIE,
  validateSession,
} from '@/lib/cms'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const editKey =
    url.searchParams.get('edit_key') ??
    request.headers.get('x-edit-key') ??
    undefined

  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const hasValidKey = isValidEditKey(editKey)
  const isAuthed = await validateSession(token)

  let firebaseSynced = false

  if (hasValidKey && isFirebaseConfigured()) {
    try {
      const { seeded } = await ensurePageContentInitialized()
      if (seeded) {
        firebaseSynced = true
        console.log(
          '[CMS] Firebase sync: seeded pageContent/main with default content',
          { projectId: process.env.FIREBASE_PROJECT_ID },
        )
      }
    } catch (error) {
      console.error('[CMS] Firebase sync failed:', error)
    }
  }

  return NextResponse.json({
    hasValidEditKey: hasValidKey,
    isAuthenticated: isAuthed,
    canEdit: hasValidKey && isAuthed,
    firebaseSynced,
  })
}
