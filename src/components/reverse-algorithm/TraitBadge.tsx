import { cn } from '@/lib/utils'
import type { AlgorithmicTrait, AlgorithmicTraitCategory } from '@/types'

const categoryColorMap: Record<AlgorithmicTraitCategory, string> = {
  Professional: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  Consumer: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  Creative: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Behavioral: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Demographic: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Psychographic: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
}

interface TraitBadgeProps {
  trait: AlgorithmicTrait
  className?: string
}

export function TraitBadge({ trait, className }: TraitBadgeProps) {
  const colors = categoryColorMap[trait.category]
  return (
    <span
      className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono border', colors, className)}
      style={{ opacity: 0.5 + trait.weight * 0.5 }}
      title={`Category: ${trait.category}`}
    >
      {trait.label}
    </span>
  )
}
