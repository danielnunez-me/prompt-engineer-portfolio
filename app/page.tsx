import { headers } from 'next/headers'
import { Toaster } from 'sonner'
import { AiModels } from '@/components/ai-models'
import { EditorProvider } from '@/components/editor/editor-mode'
import { ProfilePanel } from '@/components/profile-panel'
import { Projects } from '@/components/projects'
import { ContentProvider } from '@/components/providers/content-provider'
import { Skills } from '@/components/skills'
import { Stats } from '@/components/stats'
import { getLocalizedPageContent, getPageContent } from '@/lib/cms'
import { getFeaturedGithubProjects } from '@/lib/github/projects'
import { DEFAULT_LOCALE, LOCALE_HEADER } from '@/lib/i18n'

export default async function Home() {
  const headerStore = await headers()
  const locale = headerStore.get(LOCALE_HEADER) ?? DEFAULT_LOCALE

  const initialContent =
    locale === DEFAULT_LOCALE
      ? await getPageContent()
      : await getLocalizedPageContent(locale)

  let projects: Awaited<ReturnType<typeof getFeaturedGithubProjects>> = []
  let projectsError: string | null = null

  try {
    projects = await getFeaturedGithubProjects()
  } catch (error) {
    projectsError =
      error instanceof Error ? error.message : 'GitHub fetch failed'
    console.error('[GitHub] Featured projects failed:', error)
  }

  return (
    <ContentProvider locale={locale} initialContent={initialContent}>
      <EditorProvider>
        <main className="mx-auto flex min-h-svh w-full max-w-[1400px] flex-col justify-center px-5 py-8 lg:h-svh lg:overflow-hidden lg:px-10 lg:py-0">
          <div className="grid gap-10 lg:h-full lg:grid-cols-[35%_1fr] lg:items-center lg:gap-12">
            <ProfilePanel />
            <div className="flex flex-col gap-5">
              <Stats />
              <AiModels />
              <Skills />
              <Projects projects={projects} error={projectsError} />
            </div>
          </div>
        </main>
        <Toaster theme="dark" position="bottom-right" />
      </EditorProvider>
    </ContentProvider>
  )
}
