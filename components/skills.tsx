'use client'

import { Badge } from '@/components/ui/badge'
import { EditableText } from '@/components/editor/editor-mode'
import { useContent } from '@/components/providers/content-provider'

export function Skills() {
  const { content } = useContent()
  const { skills } = content

  return (
    <section aria-labelledby="skills-heading" className="flex flex-col gap-2.5">
      <h2
        id="skills-heading"
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
      >
        <EditableText path="skills.heading" value={skills.heading} />
      </h2>
      <div
        className="rise-in flex flex-wrap gap-1.5"
        style={{ '--rise-delay': '0.3s' } as React.CSSProperties}
      >
        {skills.items.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-normal text-foreground"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </section>
  )
}
