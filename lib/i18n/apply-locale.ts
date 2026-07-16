import type { PageContent } from '@/lib/content/schema'
import {
  findByIdOrIndex,
  pickString,
  pickStringArray,
  type LocaleStrings,
} from './locale-strings'

/**
 * Applies text-only translations onto Spanish canonical content.
 * Structure (images, URLs, hrefs, IDs, levels) always comes from `base`.
 */
export function applyLocaleOverlay(
  base: PageContent,
  overlay: LocaleStrings | null | undefined,
  fallback: LocaleStrings,
): PageContent {
  const o = overlay ?? {}
  const f = fallback

  return {
    ...base,
    seo: {
      ...base.seo,
      title: pickString(base.seo.title, o.seo?.title, f.seo?.title),
      description: pickString(
        base.seo.description,
        o.seo?.description,
        f.seo?.description,
      ),
      openGraphTitle: pickString(
        base.seo.openGraphTitle,
        o.seo?.openGraphTitle,
        f.seo?.openGraphTitle,
      ),
      openGraphDescription: pickString(
        base.seo.openGraphDescription,
        o.seo?.openGraphDescription,
        f.seo?.openGraphDescription,
      ),
      openGraphSiteName: pickString(
        base.seo.openGraphSiteName,
        o.seo?.openGraphSiteName,
        f.seo?.openGraphSiteName,
      ),
    },
    profile: {
      ...base.profile,
      name: pickString(base.profile.name, o.profile?.name, f.profile?.name),
      role: pickString(base.profile.role, o.profile?.role, f.profile?.role),
      availabilityLabel: pickString(
        base.profile.availabilityLabel,
        o.profile?.availabilityLabel,
        f.profile?.availabilityLabel,
      ),
      descriptions: pickStringArray(
        base.profile.descriptions,
        o.profile?.descriptions,
        f.profile?.descriptions,
      ),
      socials: base.profile.socials.map((social, index) => {
        const overlaySocial = findByIdOrIndex(
          o.profile?.socials,
          social.id,
          index,
        )
        const fallbackSocial = findByIdOrIndex(
          f.profile?.socials,
          social.id,
          index,
        )
        return {
          ...social,
          label: pickString(
            social.label,
            overlaySocial?.label,
            fallbackSocial?.label,
          ),
        }
      }),
    },
    stats: {
      items: base.stats.items.map((item, index) => {
        const overlayItem = findByIdOrIndex(o.stats?.items, item.id, index)
        const fallbackItem = findByIdOrIndex(f.stats?.items, item.id, index)
        return {
          ...item,
          value: pickString(item.value, overlayItem?.value, fallbackItem?.value),
          label: pickString(item.label, overlayItem?.label, fallbackItem?.label),
        }
      }),
    },
    models: {
      heading: pickString(
        base.models.heading,
        o.models?.heading,
        f.models?.heading,
      ),
      items: base.models.items.map((item, index) => {
        const overlayItem = findByIdOrIndex(o.models?.items, item.id, index)
        const fallbackItem = findByIdOrIndex(f.models?.items, item.id, index)
        const statusOverlay = overlayItem?.status
        const statusFallback = fallbackItem?.status
        const status =
          statusOverlay === 'Production' || statusOverlay === 'Experimental'
            ? statusOverlay
            : statusFallback === 'Production' ||
                statusFallback === 'Experimental'
              ? statusFallback
              : item.status
        return {
          ...item,
          name: pickString(item.name, overlayItem?.name, fallbackItem?.name),
          status,
        }
      }),
    },
    skills: {
      heading: pickString(
        base.skills.heading,
        o.skills?.heading,
        f.skills?.heading,
      ),
      items: pickStringArray(
        base.skills.items,
        o.skills?.items,
        f.skills?.items,
      ),
    },
    projects: {
      heading: pickString(
        base.projects.heading,
        o.projects?.heading,
        f.projects?.heading,
      ),
    },
  }
}
