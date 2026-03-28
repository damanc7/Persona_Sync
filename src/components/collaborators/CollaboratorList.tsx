import * as Avatar from '@radix-ui/react-avatar'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Collaborator } from '@/types'

interface CollaboratorListProps {
  collaborators: Collaborator[]
  loading?: boolean
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const roleVariant: Record<Collaborator['role'], 'violet' | 'cyan' | 'muted'> = {
  owner: 'violet',
  editor: 'cyan',
  viewer: 'muted',
}

export function CollaboratorList({ collaborators, loading }: CollaboratorListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-44" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <ul className="space-y-1">
      {collaborators.map(c => (
        <li
          key={c.id}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <div className="relative shrink-0">
            <Avatar.Root className="h-9 w-9 rounded-full overflow-hidden bg-violet-500/20 flex items-center justify-center">
              {c.avatarUrl && (
                <Avatar.Image
                  src={c.avatarUrl}
                  alt={c.name}
                  className="h-full w-full object-cover"
                />
              )}
              <Avatar.Fallback className="text-xs font-semibold text-violet-300 select-none">
                {getInitials(c.name)}
              </Avatar.Fallback>
            </Avatar.Root>
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-bg-surface)] ${
                c.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{c.name}</p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">{c.email}</p>
          </div>
          <Badge variant={roleVariant[c.role]}>{c.role}</Badge>
        </li>
      ))}
    </ul>
  )
}
