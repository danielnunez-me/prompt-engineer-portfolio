import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import { getLocalizedPageContent, getPageContent } from '@/lib/cms'
import { DEFAULT_LOCALE, LOCALE_HEADER } from '@/lib/i18n'

const _geistSans = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#111111',
}

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers()
  const locale = headerStore.get(LOCALE_HEADER) ?? DEFAULT_LOCALE

  try {
    const content =
      locale === DEFAULT_LOCALE
        ? await getPageContent()
        : await getLocalizedPageContent(locale)

    return {
      title: content.seo.title,
      description: content.seo.description,
      openGraph: {
        title: content.seo.openGraphTitle,
        description: content.seo.openGraphDescription,
        siteName: content.seo.openGraphSiteName,
      },
      icons: {
        icon: [
          {
            url: '/icon-light-32x32.png',
            media: '(prefers-color-scheme: light)',
          },
          {
            url: '/icon-dark-32x32.png',
            media: '(prefers-color-scheme: dark)',
          },
          {
            url: '/icon.svg',
            type: 'image/svg+xml',
          },
        ],
        apple: '/apple-icon.png',
      },
    }
  } catch {
    return {
      title: 'Prompt Engineer — AI Agents & Automation',
      description:
        'Portfolio of a Prompt Engineer specialized in AI Agents, Multi-Agent Systems, and AI Automation.',
    }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerStore = await headers()
  const locale = headerStore.get(LOCALE_HEADER) ?? DEFAULT_LOCALE

  return (
    <html lang={locale} className="dark bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
