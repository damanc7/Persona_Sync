import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'violet' | 'cyan' | 'muted'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-mono',
      variant === 'default' && 'bg-white/10 text-[var(--color-text-secondary)]',
      variant === 'success' && 'bg-emerald-500/15 text-emerald-400',
      variant === 'warning' && 'bg-amber-500/15 text-amber-400',
      variant === 'error' && 'bg-red-500/15 text-red-400',
      variant === 'violet' && 'bg-violet-500/15 text-violet-400',
      variant === 'cyan' && 'bg-cyan-500/15 text-cyan-400',
      variant === 'muted' && 'bg-white/5 text-[var(--color-text-muted)]',
      className
    )}>
      {children}
    </span>
  )
}
