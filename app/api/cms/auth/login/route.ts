import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  createSession,
  isValidEditKey,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  verifyPassword,
} from '@/lib/cms'

export async function POST(request: Request) {
  const body = (await request.json()) as {
    password?: string
    editKey?: string
  }

  const url = new URL(request.url)
  const editKey =
    body.editKey ??
    request.headers.get('x-edit-key') ??
    url.searchParams.get('edit_key')

  if (!isValidEditKey(editKey ?? undefined)) {
    return NextResponse.json({ error: 'Invalid edit key' }, { status: 403 })
  }

  if (!body.password || !(await verifyPassword(body.password))) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = await createSession()
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })

  return NextResponse.json({ ok: true })
}
