'use client'

import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import Image from 'next/image'
import { GithubIcon, LinkedinIcon, XIcon } from '@/components/brand-icons'
import { Button } from '@/components/ui/button'

const socials = [
  { icon: GithubIcon, label: 'GitHub', href: 'https://github.com' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: XIcon, label: 'X', href: 'https://x.com' },
  { icon: Mail, label: 'Email', href: 'mailto:hello@example.com' },
]

export function ProfilePanel() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-start gap-5 lg:sticky lg:top-0 lg:h-full lg:justify-center"
    >
      <Image
        src="/images/avatar.png"
        alt="Portrait of Alex Rivera"
        width={96}
        height={96}
        priority
        className="size-20 rounded-full border border-border object-cover lg:size-24"
      />

      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance lg:text-3xl">
          Alex Rivera
        </h1>
        <p className="font-mono text-sm text-primary">Prompt Engineer</p>
      </div>

      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
        I design prompts, AI agents, and automation systems that turn language
        models into reliable products. Focused on multi-agent orchestration and
        context engineering.
      </p>

      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        <span className="text-xs text-foreground">Available for projects</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {socials.map(({ icon: Icon, label, href }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            asChild
            className="gap-2 bg-transparent"
          >
            <a href={href} target="_blank" rel="noopener noreferrer">
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </a>
          </Button>
        ))}
      </div>
    </motion.aside>
  )
}
