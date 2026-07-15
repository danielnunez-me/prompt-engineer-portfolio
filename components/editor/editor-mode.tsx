'use client'

import {
  Suspense,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useSearchParams } from 'next/navigation'
import { Pencil, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { getAuthStatus, loginEditor } from '@/lib/cms-client'
import { useContent } from '@/components/providers/content-provider'
import { TranslationEditorFab } from '@/components/editor/translation-editor'
import {
  EditorModeContext,
  useEditorMode,
} from '@/components/editor/editor-context'

export { useEditorMode }

function EditorLoginDialog({
  open,
  editKey,
  onSuccess,
}: {
  open: boolean
  editKey: string
  onSuccess: () => void
}) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await loginEditor(password, editKey)
      onSuccess()
      setPassword('')
    } catch {
      setError('Contraseña incorrecta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Acceso de editor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editor-password">Contraseña</Label>
            <Input
              id="editor-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !password}>
              {loading ? 'Verificando...' : 'Entrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditorFab() {
  const { isEditorMode, setIsEditorMode } = useEditorMode()

  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger
          nativeButton={false}
          render={
            <button
              type="button"
              onClick={() => setIsEditorMode(!isEditorMode)}
              aria-label="Editar contenido"
              aria-pressed={isEditorMode}
              className={cn(
                'fixed bottom-6 left-6 z-50 flex size-12 items-center justify-center rounded-full',
                'border border-background/20 bg-foreground/80 text-background shadow-xl backdrop-blur-md',
                'transition-all duration-200 hover:scale-110 hover:bg-foreground',
                isEditorMode &&
                  'ring-2 ring-primary ring-offset-2 ring-offset-background',
              )}
            />
          }
        >
          {isEditorMode ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Pencil className="size-5" aria-hidden="true" />
          )}
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {isEditorMode ? 'Salir del modo edición' : 'Editar contenido'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function EditorProviderInner({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const editKey = searchParams.get('edit_key') ?? ''
  const { refreshContent } = useContent()
  const [canEdit, setCanEdit] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isEditorMode, setIsEditorMode] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!editKey) {
      setCanEdit(false)
      setChecked(true)
      return
    }

    getAuthStatus(editKey)
      .then(async (status) => {
        if (status.firebaseSynced) {
          await refreshContent()
          toast.success('Contenido sincronizado con Firebase')
        }

        if (status.canEdit) {
          setCanEdit(true)
          setIsEditorMode(true)
        } else if (status.hasValidEditKey) {
          setShowLogin(true)
        }
      })
      .finally(() => setChecked(true))
  }, [editKey, refreshContent])

  const handleLoginSuccess = useCallback(() => {
    setShowLogin(false)
    setCanEdit(true)
    setIsEditorMode(true)
  }, [])

  if (!checked) return <>{children}</>

  return (
    <EditorModeContext.Provider
      value={{
        isEditorMode: canEdit && isEditorMode,
        canEdit,
        setIsEditorMode,
      }}
    >
      {children}
      {canEdit && <EditorFab />}
      {canEdit && <TranslationEditorFab />}
      <EditorLoginDialog
        open={showLogin}
        editKey={editKey}
        onSuccess={handleLoginSuccess}
      />
    </EditorModeContext.Provider>
  )
}

export function EditorProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <EditorProviderInner>{children}</EditorProviderInner>
    </Suspense>
  )
}

function TextEditDialog({
  open,
  onOpenChange,
  path,
  value,
  multiline,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  path: string
  value: string
  multiline?: boolean
}) {
  const { updateField } = useContent()
  const [draft, setDraft] = useState(value)

  useEffect(() => setDraft(value), [value, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar texto</DialogTitle>
        </DialogHeader>
        {multiline ? (
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={5}
          />
        ) : (
          <Input value={draft} onChange={(e) => setDraft(e.target.value)} />
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              void updateField(path, draft).then(() => onOpenChange(false))
            }}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function EditableText({
  path,
  value,
  multiline = false,
  className,
  children,
}: {
  path: string
  value: string
  multiline?: boolean
  className?: string
  children?: ReactNode
}) {
  const { isEditorMode } = useEditorMode()
  const [open, setOpen] = useState(false)

  return (
    <>
      <span className={className}>
        {children ?? value}
        {isEditorMode && (
          <Pencil
            className="ml-1.5 inline-block size-3.5 shrink-0 cursor-pointer align-baseline opacity-60 transition-opacity hover:opacity-100"
            aria-label="Editar este texto"
            role="button"
            onClick={() => setOpen(true)}
          />
        )}
      </span>
      <TextEditDialog
        open={open}
        onOpenChange={setOpen}
        path={path}
        value={value}
        multiline={multiline}
      />
    </>
  )
}
