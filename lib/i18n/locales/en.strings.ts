import type { LocaleStrings } from './locale-strings'

/** Static English overlay (original portfolio copy). */
export const enLocaleStrings: LocaleStrings = {
  seo: {
    title: 'Prompt Engineer — AI Agents & Automation',
    description:
      'Portfolio of a Prompt Engineer specialized in AI Agents, Multi-Agent Systems, and AI Automation.',
    openGraphTitle: 'Prompt Engineer — AI Agents & Automation',
    openGraphDescription:
      'Portfolio of a Prompt Engineer specialized in AI Agents, Multi-Agent Systems, and AI Automation.',
    openGraphSiteName: 'Daniel E. Nuñez Mejia',
  },
  profile: {
    name: 'Daniel E. Nuñez Mejia',
    role: 'Prompt Engineer',
    availabilityLabel: 'Available for projects',
    descriptions: [
      'I turn language models into reliable, production-ready products.',
      'Designing prompts and AI agents that ship real value.',
      'Building multi-agent systems with precise context engineering.',
      'Crafting AI automations that scale from idea to production.',
      'Engineering prompts that make LLMs predictable and useful.',
      'Orchestrating AI agents to solve complex workflows.',
      'From raw model to refined product: prompt-driven development.',
      'Context engineering and agent design for modern AI stacks.',
    ],
    socials: [
      { id: 'github', label: 'GitHub' },
      { id: 'linkedin', label: 'LinkedIn' },
      { id: 'x', label: 'X' },
      { id: 'email', label: 'Email' },
      { id: 'whatsapp', label: 'WhatsApp' },
    ],
  },
  stats: {
    items: [
      { id: 'models', value: '10+', label: 'AI Models' },
      { id: 'agents', value: '50+', label: 'Agents Built' },
      { id: 'automations', value: '100+', label: 'Automations' },
      { id: 'years', value: '3+', label: 'Years Experience' },
    ],
  },
  models: {
    heading: 'AI Models',
    items: [
      { id: 'gpt', name: 'GPT-5.5', status: 'Production' },
      { id: 'claude', name: 'Claude', status: 'Production' },
      { id: 'gemini', name: 'Gemini', status: 'Production' },
      { id: 'grok', name: 'Grok', status: 'Production' },
      { id: 'deepseek', name: 'DeepSeek', status: 'Experimental' },
      { id: 'qwen', name: 'Qwen', status: 'Experimental' },
      { id: 'llama', name: 'Llama', status: 'Production' },
      { id: 'mistral', name: 'Mistral', status: 'Experimental' },
    ],
  },
  skills: {
    heading: 'Skills',
  },
  projects: {
    heading: 'Featured Projects',
  },
}

export async function getDefaultLocaleStrings(
  locale: string,
): Promise<LocaleStrings> {
  if (locale === 'en') return enLocaleStrings
  return {}
}
