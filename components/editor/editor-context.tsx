'use client'

import { createContext, useContext } from 'react'

export interface EditorModeContextValue {
  isEditorMode: boolean
  canEdit: boolean
  setIsEditorMode: (value: boolean) => void
}

export const EditorModeContext = createContext<EditorModeContextValue>({
  isEditorMode: false,
  canEdit: false,
  setIsEditorMode: () => {},
})

export function useEditorMode() {
  return useContext(EditorModeContext)
}
