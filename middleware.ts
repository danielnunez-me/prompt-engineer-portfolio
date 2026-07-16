import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  DEFAULT_LOCALE,
  LOCALE_HEADER,
  LOCALE_PARAM,
  resolveLocale,
} from '@/lib/i18n'

export function middleware(request: NextRequest) {
  const hasEditKey = request.nextUrl.searchParams.has('edit_key')
  const langParam = request.nextUrl.searchParams.get(LOCALE_PARAM)
  const acceptLanguage = request.headers.get('accept-language')

  const locale = hasEditKey
    ? DEFAULT_LOCALE
    : resolveLocale({ langParam, acceptLanguage })

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(LOCALE_HEADER, locale)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
