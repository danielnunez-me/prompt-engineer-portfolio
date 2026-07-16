'use client'

import { EditableText } from '@/components/editor/editor-mode'
import { useContent } from '@/components/providers/content-provider'

export function Stats() {
  const { content } = useContent()

  return (
    <section aria-label="Stats" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {content.stats.items.map(({ id, value, label }, i) => (
        <div
          key={id}
          className="rise-in flex flex-col gap-0.5 rounded-lg border border-border bg-card px-3 py-2.5"
          style={{ '--rise-delay': `${i * 0.05}s` } as React.CSSProperties}
        >
          <span className="font-mono text-lg font-semibold text-foreground">
            <EditableText path={`stats.items.${i}.value`} value={value} />
          </span>
          <span className="text-xs text-muted-foreground">
            <EditableText path={`stats.items.${i}.label`} value={label} />
          </span>
        </div>
      ))}
    </section>
  )
}
