export interface UiStrings {
  toastLoadError: string
  toastSaveSuccess: string
  toastSaveError: string
}

const uiStrings = {
  es: {
    toastLoadError: 'No se pudo cargar el contenido',
    toastSaveSuccess: 'Contenido guardado',
    toastSaveError: 'Error al guardar',
  },
  en: {
    toastLoadError: 'Could not load content',
    toastSaveSuccess: 'Content saved',
    toastSaveError: 'Error saving',
  },
} satisfies Record<string, UiStrings>

export function getUiStrings(locale: string): UiStrings {
  if (locale in uiStrings) {
    return uiStrings[locale as keyof typeof uiStrings]
  }
  return uiStrings.en
}
