import { Sun, Moon } from 'lucide-react'
import { useHealth } from '@/hooks/useHealth'
import { Badge } from '@/components/ui/Badge'
import { useUIStore } from '@/stores/uiStore'

interface TopBarProps {
  title: string
  actions?: React.ReactNode
}

export function TopBar({ title, actions }: TopBarProps) {
  const { data: health } = useHealth()
  const theme = useUIStore((s) => s.theme)
  const toggleTheme = useUIStore((s) => s.toggleTheme)

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
        <button
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-glass)] transition-colors"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </div>
    </header>
  )
}
