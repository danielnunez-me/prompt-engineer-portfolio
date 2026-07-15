import {
  Bot,
  Brain,
  Cpu,
  Flame,
  Layers,
  Orbit,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { ModelItem } from '@/lib/content'

const MODEL_ICONS: Record<ModelItem['iconKey'], LucideIcon> = {
  sparkles: Sparkles,
  brain: Brain,
  orbit: Orbit,
  zap: Zap,
  cpu: Cpu,
  layers: Layers,
  bot: Bot,
  flame: Flame,
}

export function getModelIcon(iconKey: ModelItem['iconKey']): LucideIcon {
  return MODEL_ICONS[iconKey] ?? Sparkles
}
