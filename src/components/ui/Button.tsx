import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({
  variant = 'primary', size = 'md', loading, className, children, disabled, ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading ? true : undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-violet)] disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-5 py-2.5 text-base',
        variant === 'primary' && 'bg-[var(--color-accent-violet)] hover:bg-[var(--color-accent-violet-bright)] text-white shadow-lg shadow-violet-900/30',
        variant === 'secondary' && 'bg-white/10 hover:bg-white/15 text-[var(--color-text-primary)] border border-[var(--color-border-default)]',
        variant === 'ghost' && 'bg-transparent hover:bg-white/8 text-[var(--color-text-secondary)]',
        variant === 'danger' && 'bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20',
        className
      )}
      {...props}
    >
      {loading ? <span aria-hidden="true" className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : null}
      {children}
    </button>
  )
}
