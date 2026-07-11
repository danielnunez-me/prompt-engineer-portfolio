'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const projects = [
  {
    name: 'Atlas Agent Suite',
    description:
      'Multi-agent research system with planner, retriever, and writer agents.',
    tech: ['LangGraph', 'Python', 'RAG'],
    models: ['GPT-5.5', 'Claude'],
  },
  {
    name: 'FlowPilot',
    description:
      'AI workflow builder that converts natural language into automations.',
    tech: ['TypeScript', 'MCP', 'Node.js'],
    models: ['Gemini', 'GPT-5.5'],
  },
  {
    name: 'PromptForge',
    description:
      'Prompt evaluation platform with versioning and A/B benchmarks.',
    tech: ['Next.js', 'Structured Outputs'],
    models: ['Claude', 'Llama'],
  },
]

export function Projects() {
  return (
    <section aria-labelledby="projects-heading" className="flex flex-col gap-2.5">
      <h2
        id="projects-heading"
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
      >
        Featured Projects
      </h2>
      <div className="grid gap-2 sm:grid-cols-3">
        {projects.map(({ name, description, tech, models }, i) => (
          <motion.article
            key={name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.06, ease: 'easeOut' }}
            className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{name}</h3>
              <ArrowUpRight
                className="size-3.5 text-muted-foreground transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
              {description}
            </p>
            <div className="mt-auto flex flex-wrap gap-1">
              {tech.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="rounded px-1.5 py-0 text-[10px] font-normal"
                >
                  {t}
                </Badge>
              ))}
              {models.map((m) => (
                <Badge
                  key={m}
                  variant="outline"
                  className="rounded border-primary/30 px-1.5 py-0 text-[10px] font-normal text-primary"
                >
                  {m}
                </Badge>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
