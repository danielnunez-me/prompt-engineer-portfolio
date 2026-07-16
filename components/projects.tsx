'use client'

import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { EditableText } from '@/components/editor/editor-mode'
import { useContent } from '@/components/providers/content-provider'
import type { GithubProject } from '@/lib/github/projects'

export function Projects({
  projects,
  error,
}: {
  projects: GithubProject[]
  error?: string | null
}) {
  const { content } = useContent()

  return (
    <section aria-labelledby="projects-heading" className="flex flex-col gap-2.5">
      <h2
        id="projects-heading"
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
      >
        <EditableText
          path="projects.heading"
          value={content.projects.heading}
        />
      </h2>
      {error ? (
        <p className="text-xs text-muted-foreground" role="alert">
          No se pudieron cargar los proyectos de GitHub.
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-3">
          {projects.map(({ name, description, topics, htmlUrl }, i) => (
            <a
              key={name}
              href={htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rise-in group flex flex-col gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
              style={
                { '--rise-delay': `${0.4 + i * 0.06}s` } as React.CSSProperties
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{name}</h3>
                <ArrowUpRight
                  className="size-3.5 text-muted-foreground transition-colors group-hover:text-primary"
                  aria-hidden="true"
                />
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
                {description || 'Sin descripción'}
              </p>
              {topics.length > 0 && (
                <div className="mt-auto flex flex-wrap gap-1">
                  {topics.slice(0, 6).map((topic) => (
                    <Badge
                      key={topic}
                      variant="secondary"
                      className="rounded px-1.5 py-0 text-[10px] font-normal"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}
            </a>
          ))}
          {projects.length === 0 &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex flex-col gap-2 rounded-lg border border-dashed border-border bg-card/50 p-3"
              >
                <p className="text-xs text-muted-foreground">
                  Sin repositorios públicos
                </p>
              </div>
            ))}
        </div>
      )}
    </section>
  )
}
