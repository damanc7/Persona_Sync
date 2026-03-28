import { useHealth } from '@/hooks/useHealth'
import { Badge } from '@/components/ui/Badge'

interface TopBarProps {
  title: string
  actions?: React.ReactNode
}

export function TopBar({ title, actions }: TopBarProps) {
  const { data: health } = useHealth()

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]/80 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h1>
      <div className="flex items-center gap-3">
        {health && (
          <Badge variant={health.status === 'healthy' ? 'success' : health.status === 'degraded' ? 'warning' : 'error'}>
            {health.status}
          </Badge>
        )}
        {actions}
      </div>
    </header>
  )
}
