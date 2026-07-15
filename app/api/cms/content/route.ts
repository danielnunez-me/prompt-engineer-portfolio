import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { contentPatchSchema } from '@/lib/content'
import { DEFAULT_LOCALE, isValidLocaleCode, LOCALE_PARAM } from '@/lib/i18n'
import {
  getLocalizedPageContent,
  getPageContent,
  SESSION_COOKIE,
  updatePageContent,
  validateSession,
} from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const langParam = url.searchParams.get(LOCALE_PARAM)
    const hasEditKey = url.searchParams.has('edit_key')

    if (hasEditKey) {
      const content = await getPageContent()
      return NextResponse.json(content, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      })
    }

    const locale =
      langParam && isValidLocaleCode(langParam) ? langParam : DEFAULT_LOCALE

    const content = await getLocalizedPageContent(locale)
    return NextResponse.json(content, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    })
  } catch (error) {
    console.error('Failed to load page content:', error)
    return NextResponse.json({ error: 'Content not found' }, { status: 404 })
  }
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const isAuthed = await validateSession(token)

  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = contentPatchSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid patch', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  try {
    const content = await updatePageContent(parsed.data.path, parsed.data.value)
    return NextResponse.json(content, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    })
  } catch (error) {
    console.error('Failed to update page content:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
