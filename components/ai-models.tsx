'use client'

import { EditableText } from '@/components/editor/editor-mode'
import { useContent } from '@/components/providers/content-provider'
import { getModelIcon } from '@/lib/content/model-icons'

export function AiModels() {
  const { content } = useContent()
  const { models } = content

  return (
    <section aria-labelledby="models-heading" className="flex flex-col gap-2.5">
      <h2
        id="models-heading"
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
      >
        <EditableText path="models.heading" value={models.heading} />
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {models.items.map(({ id, iconKey, name, level, status }, i) => {
          const Icon = getModelIcon(iconKey)
          return (
            <div
              key={id}
              className="rise-in flex flex-col gap-2 rounded-lg border border-border bg-card p-3"
              style={
                { '--rise-delay': `${0.1 + i * 0.04}s` } as React.CSSProperties
              }
            >
              <div className="flex items-center justify-between">
                <Icon
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <span
                  className={
                    status === 'Production'
                      ? 'font-mono text-[10px] text-primary'
                      : 'font-mono text-[10px] text-muted-foreground'
                  }
                >
                  {status}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-sm font-medium">
                  <EditableText
                    path={`models.items.${i}.name`}
                    value={name}
                  />
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {level}%
                </span>
              </div>
              <div
                className="h-1 w-full overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={level}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${name} proficiency`}
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${level}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
