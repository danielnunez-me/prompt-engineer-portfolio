'use client'

import { Mail } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  GithubIcon,
  LinkedinIcon,
  WhatsappIcon,
  XIcon,
} from '@/components/brand-icons'

const descriptions = [
  'I turn language models into reliable, production-ready products.',
  'Designing prompts and AI agents that ship real value.',
  'Building multi-agent systems with precise context engineering.',
  'Crafting AI automations that scale from idea to production.',
  'Engineering prompts that make LLMs predictable and useful.',
  'Orchestrating AI agents to solve complex workflows.',
  'From raw model to refined product: prompt-driven development.',
  'Context engineering and agent design for modern AI stacks.',
]

const socials = [
  { icon: GithubIcon, label: 'GitHub', href: 'https://github.com/danielnunez-me' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/in/danielnunez-me/' },
  { icon: XIcon, label: 'X', href: 'https://x.com/danielnunez_me' },
  { icon: Mail, label: 'Email', href: 'mailto:hola@danielnunez.me' },
  { icon: WhatsappIcon, label: 'WhatsApp', href: 'https://wa.me/18292809250' },
]

export function ProfilePanel() {
  const [description, setDescription] = useState(descriptions[0])

  useEffect(() => {
    setDescription(
      descriptions[Math.floor(Math.random() * descriptions.length)],
    )
  }, [])

  return (
    <aside className="rise-in flex flex-col items-start gap-5 lg:sticky lg:top-0 lg:h-full lg:justify-center">
      <Image
        src="/images/avatar.png"
        alt="Portrait of Daniel E. Nuñez Mejia"
        width={96}
        height={96}
        priority
        className="size-20 rounded-full border border-border object-cover lg:size-24"
      />

      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance lg:text-3xl">
          Daniel E. Nuñez Mejia
        </h1>
        <p className="font-mono text-sm text-primary">Prompt Engineer</p>
      </div>

      <p className="max-w-xs min-h-10 text-sm leading-relaxed text-muted-foreground text-pretty">
        {description}
      </p>

      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        <span className="text-xs text-foreground">Available for projects</span>
      </div>

      <div className="flex items-center gap-4">
        {socials.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-muted-foreground transition-all duration-200 hover:scale-110 hover:text-primary"
          >
            <Icon className="size-5" aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </a>
        ))}
      </div>
    </aside>
  )
}
