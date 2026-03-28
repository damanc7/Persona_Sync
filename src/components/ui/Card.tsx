import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border transition-colors',
        variant === 'default' && 'bg-[var(--color-bg-surface)] border-[var(--color-border-subtle)]',
        variant === 'elevated' && 'bg-[var(--color-bg-elevated)] border-[var(--color-border-default)] shadow-lg shadow-black/30',
        variant === 'outlined' && 'bg-[var(--color-bg-glass)] border-[var(--color-border-default)] backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
