'use client'

import { motion } from 'framer-motion'

const stats = [
  { value: '10+', label: 'AI Models' },
  { value: '50+', label: 'Agents Built' },
  { value: '100+', label: 'Automations' },
  { value: '3+', label: 'Years Experience' },
]

export function Stats() {
  return (
    <section aria-label="Stats" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {stats.map(({ value, label }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
          className="flex flex-col gap-0.5 rounded-lg border border-border bg-card px-3 py-2.5"
        >
          <span className="font-mono text-lg font-semibold text-foreground">
            {value}
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </motion.div>
      ))}
    </section>
  )
}
