import { z } from 'zod'

export const mediaAssetSchema = z.object({
  id: z.string(),
  url: z.string(),
  name: z.string(),
  createdAt: z.string(),
})

export const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
  openGraphTitle: z.string(),
  openGraphDescription: z.string(),
  openGraphSiteName: z.string(),
})

export const socialLinkSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
  iconKey: z.enum(['github', 'linkedin', 'x', 'email', 'whatsapp']),
})

export const profileSchema = z.object({
  name: z.string(),
  role: z.string(),
  avatarUrl: z.string(),
  availabilityLabel: z.string(),
  descriptions: z.array(z.string()),
  socials: z.array(socialLinkSchema),
})

export const statItemSchema = z.object({
  id: z.string(),
  value: z.string(),
  label: z.string(),
})

export const statsSchema = z.object({
  items: z.array(statItemSchema),
})

export const modelItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number().min(0).max(100),
  status: z.enum(['Production', 'Experimental']),
  iconKey: z.enum([
    'sparkles',
    'brain',
    'orbit',
    'zap',
    'cpu',
    'layers',
    'bot',
    'flame',
  ]),
})

export const modelsSchema = z.object({
  heading: z.string(),
  items: z.array(modelItemSchema),
})

export const skillsSchema = z.object({
  heading: z.string(),
  items: z.array(z.string()),
})

export const projectsSectionSchema = z.object({
  heading: z.string(),
})

export const pageContentSchema = z.object({
  seo: seoSchema,
  profile: profileSchema,
  stats: statsSchema,
  models: modelsSchema,
  skills: skillsSchema,
  projects: projectsSectionSchema,
  mediaLibrary: z.array(mediaAssetSchema),
})

export const contentPatchSchema = z.object({
  path: z.string().min(1),
  value: z.unknown(),
})

export type MediaAsset = z.infer<typeof mediaAssetSchema>
export type PageContent = z.infer<typeof pageContentSchema>
export type ContentPatch = z.infer<typeof contentPatchSchema>
export type SocialLink = z.infer<typeof socialLinkSchema>
export type ModelItem = z.infer<typeof modelItemSchema>
