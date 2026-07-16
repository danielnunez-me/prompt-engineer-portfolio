import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { isValidLocaleCode } from '@/lib/i18n'
import {
  addTranslationLocale,
  getLocaleConfig,
  removeTranslationLocale,
  SESSION_COOKIE,
  validateSession,
} from '@/lib/cms'

export const dynamic = 'force-dynamic'

const addLocaleSchema = z.object({
  code: z.string().min(2).max(2),
  label: z.string().min(1),
})

export async function GET() {
  try {
    const config = await getLocaleConfig()
    return NextResponse.json(config)
  } catch (error) {
    console.error('Failed to load locale config:', error)
    return NextResponse.json(
      { error: 'Failed to load locales' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const isAuthed = await validateSession(token)

  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = addLocaleSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid locale', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const code = parsed.data.code.toLowerCase()
  if (!isValidLocaleCode(code) || code === 'es') {
    return NextResponse.json({ error: 'Invalid locale code' }, { status: 400 })
  }

  try {
    const config = await addTranslationLocale(code, parsed.data.label)
    return NextResponse.json(config)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to add locale'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const isAuthed = await validateSession(token)

  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const code = url.searchParams.get('lang')?.toLowerCase()

  if (!code || !isValidLocaleCode(code) || code === 'es') {
    return NextResponse.json({ error: 'Invalid locale code' }, { status: 400 })
  }

  try {
    const config = await removeTranslationLocale(code)
    return NextResponse.json(config)
  } catch (error) {
    console.error('Failed to remove locale:', error)
    return NextResponse.json(
      { error: 'Failed to remove locale' },
      { status: 500 },
    )
  }
}
