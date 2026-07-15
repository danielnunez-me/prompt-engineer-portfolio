import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { DEFAULT_LOCALE, isValidLocaleCode, LOCALE_PARAM } from '@/lib/i18n'
import {
  getLocaleTranslations,
  isTranslationLocaleEnabled,
  SESSION_COOKIE,
  updateLocaleTranslation,
  validateSession,
} from '@/lib/cms'

export const dynamic = 'force-dynamic'

const translationPatchSchema = z.object({
  lang: z.string().optional(),
  path: z.string(),
  value: z.unknown(),
})

async function resolveTranslationLocale(
  langParam: string | null,
): Promise<string | null> {
  if (
    !langParam ||
    !isValidLocaleCode(langParam) ||
    langParam === DEFAULT_LOCALE
  ) {
    return null
  }
  const enabled = await isTranslationLocaleEnabled(langParam)
  return enabled ? langParam : null
}

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const isAuthed = await validateSession(token)

  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const url = new URL(request.url)
    const locale = await resolveTranslationLocale(
      url.searchParams.get(LOCALE_PARAM),
    )

    if (!locale) {
      return NextResponse.json(
        { error: 'Invalid or disabled translation locale' },
        { status: 400 },
      )
    }

    const translations = await getLocaleTranslations(locale)
    return NextResponse.json(translations)
  } catch (error) {
    console.error('Failed to load translations:', error)
    return NextResponse.json(
      { error: 'Translations not found' },
      { status: 404 },
    )
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
  const parsed = translationPatchSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid patch', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const locale = await resolveTranslationLocale(parsed.data.lang ?? null)
  if (!locale) {
    return NextResponse.json(
      { error: 'Invalid or disabled translation locale' },
      { status: 400 },
    )
  }

  try {
    const translations = await updateLocaleTranslation(
      locale,
      parsed.data.path,
      parsed.data.value,
    )
    return NextResponse.json(translations)
  } catch (error) {
    console.error('Failed to update translation:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
