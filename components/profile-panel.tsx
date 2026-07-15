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
import { EditableText } from '@/components/editor/editor-mode'
import { useContent } from '@/components/providers/content-provider'
import type { SocialLink } from '@/lib/content'

const SOCIAL_ICONS = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  x: XIcon,
  email: Mail,
  whatsapp: WhatsappIcon,
} as const

function SocialIcon({ social }: { social: SocialLink }) {
  const Icon = SOCIAL_ICONS[social.iconKey] ?? Mail
  return <Icon className="size-5" aria-hidden="true" />
}

export function ProfilePanel() {
  const { content } = useContent()
  const { profile } = content
  const [description, setDescription] = useState(
    profile.descriptions[0] ?? '',
  )

  useEffect(() => {
    if (profile.descriptions.length === 0) return
    setDescription(
      profile.descriptions[
        Math.floor(Math.random() * profile.descriptions.length)
      ],
    )
  }, [profile.descriptions])

  return (
    <aside className="rise-in flex flex-col items-start gap-5 lg:sticky lg:top-0 lg:h-full lg:justify-center">
      <Image
        src={profile.avatarUrl}
        alt={`Portrait of ${profile.name}`}
        width={96}
        height={96}
        priority
        className="size-20 rounded-full border border-border object-cover lg:size-24"
      />

      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-balance lg:text-3xl">
          <EditableText path="profile.name" value={profile.name} />
        </h1>
        <p className="font-mono text-sm text-primary">
          <EditableText path="profile.role" value={profile.role} />
        </p>
      </div>

      <p className="max-w-xs min-h-10 text-sm leading-relaxed text-muted-foreground text-pretty">
        {description}
      </p>

      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        <span className="text-xs text-foreground">
          <EditableText
            path="profile.availabilityLabel"
            value={profile.availabilityLabel}
          />
        </span>
      </div>

      <div className="flex items-center gap-4">
        {profile.socials.map((social) => (
          <a
            key={social.id}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="text-muted-foreground transition-all duration-200 hover:scale-110 hover:text-primary"
          >
            <SocialIcon social={social} />
            <span className="sr-only">{social.label}</span>
          </a>
        ))}
      </div>
    </aside>
  )
}
