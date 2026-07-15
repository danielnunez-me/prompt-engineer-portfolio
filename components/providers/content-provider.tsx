'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { PageContent } from '@/lib/content'
import { defaultPageContent } from '@/lib/content'
import { getUiStrings } from '@/lib/i18n'
import { getPageContent, updatePageContent } from '@/lib/cms-client'
import { toast } from 'sonner'

interface ContentContextValue {
  content: PageContent
  locale: string
  isLoading: boolean
  updateField: (path: string, value: unknown) => Promise<void>
  refreshContent: () => Promise<void>
}

const ContentContext = createContext<ContentContextValue>({
  content: defaultPageContent,
  locale: 'es',
  isLoading: true,
  updateField: async () => {},
  refreshContent: async () => {},
})

export function useContent() {
  return useContext(ContentContext)
}

export function ContentProvider({
  children,
  locale,
  initialContent,
}: {
  children: ReactNode
  locale: string
  initialContent?: PageContent
}) {
  const [content, setContent] = useState<PageContent>(
    initialContent ?? defaultPageContent,
  )
  const [isLoading, setIsLoading] = useState(!initialContent)
  const ui = useMemo(() => getUiStrings(locale), [locale])

  const refreshContent = useCallback(async () => {
    try {
      const data = await getPageContent(locale)
      setContent(data)
    } catch {
      toast.error(ui.toastLoadError)
    } finally {
      setIsLoading(false)
    }
  }, [locale, ui.toastLoadError])

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent)
      setIsLoading(false)
      return
    }
    void refreshContent()
  }, [initialContent, refreshContent])

  const updateField = useCallback(
    async (path: string, value: unknown) => {
      try {
        const updated = await updatePageContent(path, value)
        setContent(updated)
        toast.success(ui.toastSaveSuccess)
      } catch {
        toast.error(ui.toastSaveError)
        throw new Error('Save failed')
      }
    },
    [ui.toastSaveError, ui.toastSaveSuccess],
  )

  const value = useMemo(
    () => ({
      content,
      locale,
      isLoading,
      updateField,
      refreshContent,
    }),
    [content, locale, isLoading, updateField, refreshContent],
  )

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  )
}
