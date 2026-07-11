'use client'

import { motion } from 'framer-motion'
import { Bot, Brain, Cpu, Flame, Layers, Orbit, Sparkles, Zap } from 'lucide-react'

const models = [
  { icon: Sparkles, name: 'GPT-5.5', level: 95, status: 'Production' },
  { icon: Brain, name: 'Claude', level: 92, status: 'Production' },
  { icon: Orbit, name: 'Gemini', level: 88, status: 'Production' },
  { icon: Zap, name: 'Grok', level: 80, status: 'Production' },
  { icon: Cpu, name: 'DeepSeek', level: 78, status: 'Experimental' },
  { icon: Layers, name: 'Qwen', level: 72, status: 'Experimental' },
  { icon: Bot, name: 'Llama', level: 85, status: 'Production' },
  { icon: Flame, name: 'Mistral', level: 75, status: 'Experimental' },
] as const

export function AiModels() {
  return (
    <section aria-labelledby="models-heading" className="flex flex-col gap-2.5">
      <h2
        id="models-heading"
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
      >
        AI Models
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {models.map(({ icon: Icon, name, level, status }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.04, ease: 'easeOut' }}
            className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3"
          >
            <div className="flex items-center justify-between">
              <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
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
              <span className="text-sm font-medium">{name}</span>
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
          </motion.div>
        ))}
      </div>
    </section>
  )
}
