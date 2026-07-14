import { Badge } from '@/components/ui/badge'

const skills = [
  'Prompt Engineering',
  'AI Agents',
  'Multi-Agent Systems',
  'MCP',
  'RAG',
  'Function Calling',
  'Tool Calling',
  'Structured Outputs',
  'Context Engineering',
  'AI Automation',
  'Workflow Design',
  'LangGraph',
  'OpenAI SDK',
  'Claude SDK',
  'Python',
  'TypeScript',
  'Node.js',
  'Cursor',
  'v0',
  'Windsurf',
]

export function Skills() {
  return (
    <section aria-labelledby="skills-heading" className="flex flex-col gap-2.5">
      <h2
        id="skills-heading"
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
      >
        Skills
      </h2>
      <div
        className="rise-in flex flex-wrap gap-1.5"
        style={{ '--rise-delay': '0.3s' } as React.CSSProperties}
      >
        {skills.map((skill) => (
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
