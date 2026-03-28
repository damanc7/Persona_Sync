import * as Avatar from '@radix-ui/react-avatar'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'
import type { PersonaProfile } from '@/types'

interface CollaboratorListProps {
  collaborators: PersonaProfile[]
  loading?: boolean
  selectedPersonas?: Set<string>
  onTogglePersona?: (id: string) => void
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const PERSONA_COLORS: Record<string, string> = {
  joe: 'bg-cyan-500/20 text-cyan-300',
  harish: 'bg-violet-500/20 text-violet-300',
  daman: 'bg-amber-500/20 text-amber-300',
}

function personaAvatarClass(id: string): string {
  return PERSONA_COLORS[id] ?? 'bg-violet-500/20 text-violet-300'
}

export function CollaboratorList({ collaborators, loading, selectedPersonas, onTogglePersona }: CollaboratorListProps) {
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
      {collaborators.map(c => {
        const isOwner = c.role === 'owner'
        const isSelected = isOwner || selectedPersonas?.has(c.id)
        const canToggle = !isOwner && onTogglePersona

        return (
          <li
            key={c.id}
            role={canToggle ? 'button' : undefined}
            tabIndex={canToggle ? 0 : undefined}
            onClick={() => canToggle && onTogglePersona(c.id)}
            onKeyDown={(e) => { if (canToggle && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onTogglePersona(c.id) } }}
            className={cn(
              'flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors',
              canToggle && 'cursor-pointer',
              isSelected
                ? 'bg-[var(--color-accent-violet)]/10 border border-[var(--color-accent-violet)]/20'
                : 'hover:bg-[var(--color-overlay-dim)] border border-transparent opacity-50',
            )}
          >
            <div className="relative shrink-0 mt-0.5">
              <Avatar.Root className={cn('h-9 w-9 rounded-full overflow-hidden flex items-center justify-center', personaAvatarClass(c.id))}>
                {c.avatarUrl && (
                  <Avatar.Image
                    src={c.avatarUrl}
                    alt={c.name}
                    className="h-full w-full object-cover"
                  />
                )}
                <Avatar.Fallback className="text-xs font-semibold select-none">
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
              {c.tagline && (
                <p className="text-[11px] text-[var(--color-text-muted)] leading-snug mt-0.5">{c.tagline}</p>
              )}
              {Object.keys(c.preferences).length > 0 && isSelected && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {Object.entries(c.preferences).slice(0, 3).map(([key, val]) => (
                    <span
                      key={key}
                      className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-overlay-dim)] text-[var(--color-text-secondary)]"
                    >
                      {val.length > 24 ? val.slice(0, 22) + '\u2026' : val}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
