import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Integration } from '@/types'

const SOURCE_COLORS: Record<string, string> = {
  google: 'bg-red-500/20 text-red-400',
  linkedin: 'bg-blue-500/20 text-blue-400',
  twitter: 'bg-sky-500/20 text-sky-400',
  facebook: 'bg-indigo-500/20 text-indigo-400',
  amazon: 'bg-orange-500/20 text-orange-400',
  spotify: 'bg-green-500/20 text-green-400',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface IntegrationCardProps {
  integration: Integration
  onToggle: (id: string) => void
  loading?: boolean
}

export function IntegrationCard({ integration, onToggle, loading }: IntegrationCardProps) {
  const colorClass = SOURCE_COLORS[integration.icon] ?? 'bg-white/10 text-[var(--color-text-secondary)]'
  const initial = integration.name.charAt(0).toUpperCase()

  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${colorClass}`}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{integration.name}</p>
          <Badge
            variant={integration.connected ? 'success' : 'muted'}
            className="mt-0.5"
          >
            {integration.connected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
      </div>

      {integration.connected && (
        <div className="text-xs text-[var(--color-text-muted)] space-y-0.5">
          {integration.lastScan && (
            <p>Last scan: {formatDate(integration.lastScan)}</p>
          )}
          {integration.itemCount !== undefined && (
            <p>{integration.itemCount} items found</p>
          )}
        </div>
      )}

      <Button
        variant={integration.connected ? 'danger' : 'secondary'}
        size="sm"
        loading={loading}
        onClick={() => onToggle(integration.id)}
        className="w-full"
      >
        {integration.connected ? 'Disconnect' : 'Connect'}
      </Button>
    </Card>
  )
}
