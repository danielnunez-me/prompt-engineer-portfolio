'use client'

import { useCallback, useEffect, useState } from 'react'
import type { LocaleConfig, LocaleStrings } from '@/lib/i18n'
import {
  applyLocaleOverlay,
  getDefaultLocaleStrings,
  isValidLocaleCode,
} from '@/lib/i18n'
import type { PageContent } from '@/lib/content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useContent } from '@/components/providers/content-provider'
import { useEditorMode } from '@/components/editor/editor-context'
import {
  addTranslationLocale,
  getLocaleConfig,
  getLocaleTranslations,
  removeTranslationLocale,
  updateLocaleTranslation,
} from '@/lib/cms-client'
import { toast } from 'sonner'
import { Languages, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { id: 'seo', label: 'SEO' },
  { id: 'profile', label: 'Perfil' },
  { id: 'stats', label: 'Stats' },
  { id: 'models', label: 'Modelos' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Proyectos' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined
    if (Array.isArray(acc)) {
      const index = Number(key)
      return Number.isNaN(index) ? undefined : acc[index]
    }
    if (typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

function TranslationField({
  label,
  spanishValue,
  translatedValue,
  multiline,
  onSave,
}: {
  label: string
  spanishValue: string
  translatedValue: string
  multiline?: boolean
  onSave: (value: string) => Promise<void>
}) {
  const [draft, setDraft] = useState(translatedValue)
  const [saving, setSaving] = useState(false)

  useEffect(() => setDraft(translatedValue), [translatedValue])

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(draft)
      toast.success('Traducción guardada')
    } catch {
      toast.error('Error al guardar traducción')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <Label className="font-medium">{label}</Label>
      <p className="text-xs text-muted-foreground">
        ES: <span className="text-foreground">{spanishValue || '—'}</span>
      </p>
      {multiline ? (
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
        />
      ) : (
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} />
      )}
      <Button size="sm" onClick={() => void handleSave()} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar traducción'}
      </Button>
    </div>
  )
}

function ArrayTranslationField({
  label,
  spanishValues,
  translatedValues,
  path,
  onSaveArray,
}: {
  label: string
  spanishValues: string[]
  translatedValues: string[]
  path: string
  onSaveArray: (path: string, value: string[]) => Promise<void>
}) {
  const [draft, setDraft] = useState(translatedValues.join('\n'))
  const [saving, setSaving] = useState(false)

  useEffect(() => setDraft(translatedValues.join('\n')), [translatedValues])

  async function handleSave() {
    setSaving(true)
    try {
      const lines = draft
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
      await onSaveArray(path, lines)
      toast.success('Traducción guardada')
    } catch {
      toast.error('Error al guardar traducción')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <Label className="font-medium">{label}</Label>
      <p className="text-xs text-muted-foreground">
        ES: {spanishValues.join(' · ') || '—'}
      </p>
      <Textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={4}
        placeholder="Un ítem por línea"
      />
      <Button size="sm" onClick={() => void handleSave()} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar traducción'}
      </Button>
    </div>
  )
}

function SectionEditor({
  section,
  content,
  translatedAt,
  translatedArrayAt,
  saveField,
}: {
  section: SectionId
  content: PageContent
  translatedAt: (path: string) => string
  translatedArrayAt: (path: string) => string[]
  saveField: (path: string, value: unknown) => Promise<void>
}) {
  if (section === 'seo') {
    return (
      <div className="space-y-3">
        {(
          [
            ['seo.title', 'Título', false],
            ['seo.description', 'Descripción', true],
            ['seo.openGraphTitle', 'OG Título', false],
            ['seo.openGraphDescription', 'OG Descripción', true],
            ['seo.openGraphSiteName', 'OG Site Name', false],
          ] as const
        ).map(([path, label, multiline]) => (
          <TranslationField
            key={path}
            label={label}
            spanishValue={String(getByPath(content, path) ?? '')}
            translatedValue={translatedAt(path)}
            multiline={multiline}
            onSave={(value) => saveField(path, value)}
          />
        ))}
      </div>
    )
  }

  if (section === 'profile') {
    return (
      <div className="space-y-3">
        <TranslationField
          label="Nombre"
          spanishValue={content.profile.name}
          translatedValue={translatedAt('profile.name')}
          onSave={(value) => saveField('profile.name', value)}
        />
        <TranslationField
          label="Rol"
          spanishValue={content.profile.role}
          translatedValue={translatedAt('profile.role')}
          onSave={(value) => saveField('profile.role', value)}
        />
        <TranslationField
          label="Disponibilidad"
          spanishValue={content.profile.availabilityLabel}
          translatedValue={translatedAt('profile.availabilityLabel')}
          onSave={(value) => saveField('profile.availabilityLabel', value)}
        />
        <ArrayTranslationField
          label="Descripciones"
          spanishValues={content.profile.descriptions}
          translatedValues={translatedArrayAt('profile.descriptions')}
          path="profile.descriptions"
          onSaveArray={saveField}
        />
      </div>
    )
  }

  if (section === 'stats') {
    return (
      <div className="space-y-3">
        {content.stats.items.map((item, index) => (
          <div key={item.id} className="space-y-2">
            <TranslationField
              label={`Valor (${item.id})`}
              spanishValue={item.value}
              translatedValue={translatedAt(`stats.items.${index}.value`)}
              onSave={(value) => saveField(`stats.items.${index}.value`, value)}
            />
            <TranslationField
              label={`Etiqueta (${item.id})`}
              spanishValue={item.label}
              translatedValue={translatedAt(`stats.items.${index}.label`)}
              onSave={(value) => saveField(`stats.items.${index}.label`, value)}
            />
          </div>
        ))}
      </div>
    )
  }

  if (section === 'models') {
    return (
      <div className="space-y-3">
        <TranslationField
          label="Título de sección"
          spanishValue={content.models.heading}
          translatedValue={translatedAt('models.heading')}
          onSave={(value) => saveField('models.heading', value)}
        />
        {content.models.items.map((item, index) => (
          <TranslationField
            key={item.id}
            label={`Modelo: ${item.name}`}
            spanishValue={item.name}
            translatedValue={translatedAt(`models.items.${index}.name`)}
            onSave={(value) => saveField(`models.items.${index}.name`, value)}
          />
        ))}
      </div>
    )
  }

  if (section === 'skills') {
    return (
      <div className="space-y-3">
        <TranslationField
          label="Título de sección"
          spanishValue={content.skills.heading}
          translatedValue={translatedAt('skills.heading')}
          onSave={(value) => saveField('skills.heading', value)}
        />
        <ArrayTranslationField
          label="Skills"
          spanishValues={content.skills.items}
          translatedValues={translatedArrayAt('skills.items')}
          path="skills.items"
          onSaveArray={saveField}
        />
      </div>
    )
  }

  return (
    <TranslationField
      label="Título de sección"
      spanishValue={content.projects.heading}
      translatedValue={translatedAt('projects.heading')}
      onSave={(value) => saveField('projects.heading', value)}
    />
  )
}

export function TranslationEditor() {
  const { content } = useContent()
  const [activeSection, setActiveSection] = useState<SectionId>('profile')
  const [localeConfig, setLocaleConfig] = useState<LocaleConfig>({
    locales: [],
  })
  const [selectedLocale, setSelectedLocale] = useState('en')
  const [overlay, setOverlay] = useState<LocaleStrings>({})
  const [fallback, setFallback] = useState<LocaleStrings>({})
  const [loading, setLoading] = useState(true)
  const [newLocaleCode, setNewLocaleCode] = useState('')
  const [newLocaleLabel, setNewLocaleLabel] = useState('')
  const [addingLocale, setAddingLocale] = useState(false)

  const loadTranslations = useCallback(async () => {
    setLoading(true)
    try {
      const config = await getLocaleConfig()
      setLocaleConfig(config)

      const locale =
        config.locales.find((entry) => entry.code === selectedLocale)?.code ??
        config.locales[0]?.code

      if (!locale) {
        setOverlay({})
        setFallback({})
        return
      }

      if (locale !== selectedLocale) {
        setSelectedLocale(locale)
      }

      const [translations, staticStrings] = await Promise.all([
        getLocaleTranslations(locale),
        getDefaultLocaleStrings(locale),
      ])
      setOverlay(translations)
      setFallback(staticStrings)
    } catch {
      toast.error('No se pudieron cargar las traducciones')
    } finally {
      setLoading(false)
    }
  }, [selectedLocale])

  useEffect(() => {
    void loadTranslations()
  }, [loadTranslations])

  const preview = applyLocaleOverlay(content, overlay, fallback)

  const translatedAt = useCallback(
    (path: string): string => {
      const value = getByPath(preview, path)
      return typeof value === 'string' ? value : ''
    },
    [preview],
  )

  const translatedArrayAt = useCallback(
    (path: string): string[] => {
      const value = getByPath(preview, path)
      return Array.isArray(value) ? (value as string[]) : []
    },
    [preview],
  )

  const saveField = useCallback(
    async (path: string, value: unknown) => {
      const updated = await updateLocaleTranslation(path, value, selectedLocale)
      setOverlay(updated)
    },
    [selectedLocale],
  )

  async function handleAddLocale() {
    const code = newLocaleCode.toLowerCase().trim()
    const label = newLocaleLabel.trim()

    if (!isValidLocaleCode(code) || code === 'es') {
      toast.error('Código de idioma inválido (usa 2 letras, ej: en, fr)')
      return
    }
    if (!label) {
      toast.error('Ingresa un nombre para el idioma')
      return
    }

    setAddingLocale(true)
    try {
      const config = await addTranslationLocale(code, label)
      setLocaleConfig(config)
      setSelectedLocale(code)
      setNewLocaleCode('')
      setNewLocaleLabel('')
      toast.success('Idioma añadido')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'No se pudo añadir el idioma',
      )
    } finally {
      setAddingLocale(false)
    }
  }

  async function handleRemoveLocale() {
    try {
      const config = await removeTranslationLocale(selectedLocale)
      setLocaleConfig(config)
      setSelectedLocale(config.locales[0]?.code ?? 'en')
      toast.success('Idioma eliminado')
    } catch {
      toast.error('No se pudo eliminar el idioma')
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6">
      <div className="flex flex-wrap items-end gap-2">
        <div className="space-y-1">
          <Label>Idioma</Label>
          <Select
            value={selectedLocale}
            onValueChange={(value) => {
              if (value) setSelectedLocale(value)
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {localeConfig.locales.map((locale) => (
                <SelectItem key={locale.code} value={locale.code}>
                  {locale.label} ({locale.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void handleRemoveLocale()}
          disabled={!selectedLocale || localeConfig.locales.length === 0}
        >
          <Trash2 className="size-3.5" />
          Quitar idioma
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border p-3">
        <div className="space-y-1">
          <Label htmlFor="new-locale-code">Código</Label>
          <Input
            id="new-locale-code"
            value={newLocaleCode}
            onChange={(e) => setNewLocaleCode(e.target.value)}
            placeholder="en"
            className="w-20"
            maxLength={2}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new-locale-label">Nombre</Label>
          <Input
            id="new-locale-label"
            value={newLocaleLabel}
            onChange={(e) => setNewLocaleLabel(e.target.value)}
            placeholder="English"
            className="w-36"
          />
        </div>
        <Button
          size="sm"
          onClick={() => void handleAddLocale()}
          disabled={addingLocale}
        >
          <Plus className="size-3.5" />
          Añadir
        </Button>
      </div>

      <div className="flex gap-1 overflow-x-auto">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors',
              activeSection === section.id
                ? 'bg-primary font-medium text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted',
            )}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : (
          <SectionEditor
            section={activeSection}
            content={content}
            translatedAt={translatedAt}
            translatedArrayAt={translatedArrayAt}
            saveField={saveField}
          />
        )}
      </div>
    </div>
  )
}

export function TranslationEditorFab() {
  const { isEditorMode } = useEditorMode()
  const [open, setOpen] = useState(false)

  if (!isEditorMode) return null

  return (
    <>
      <TooltipProvider delay={200}>
        <Tooltip>
          <TooltipTrigger
            nativeButton={false}
            render={
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Traducciones"
                className="fixed bottom-6 left-24 z-50 flex size-12 items-center justify-center rounded-full border border-background/20 bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-110"
              />
            }
          >
            <Languages className="size-5" aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            Traducciones
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-3xl">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Traducciones</DialogTitle>
          </DialogHeader>
          <TranslationEditor />
        </DialogContent>
      </Dialog>
    </>
  )
}
