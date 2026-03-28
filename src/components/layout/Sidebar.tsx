import { NavLink } from 'react-router-dom'
import { LayoutDashboard, User, Database, Map, MessageSquare, ShoppingBag, FlipHorizontal2, ShieldCheck, Plug } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/profile', icon: User, label: 'Edit Profile' },
  { to: '/scraped', icon: Database, label: 'Imported Data' },
  { to: '/map', icon: Map, label: 'Profile Map' },
  { to: '/reverse', icon: FlipHorizontal2, label: 'Reverse Algorithm' },
  { to: '/collaborators', icon: MessageSquare, label: 'Conversations' },
  { to: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
  { to: '/data-rights', icon: ShieldCheck, label: 'Data Rights' },
  { to: '/agents', icon: Plug, label: 'Agent Connections' },
]

export function Sidebar() {
  return (
    <nav className="hidden md:flex flex-col w-56 shrink-0 border-r border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] h-full">
      <div className="h-14 flex items-center px-5 border-b border-[var(--color-border-subtle)]">
        <span className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
          <span className="text-[var(--color-accent-violet)]">Persona</span>Sync
        </span>
      </div>
      <div className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            aria-label={label}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-[var(--color-accent-violet)]/15 text-[var(--color-accent-violet-bright)] font-medium'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-overlay-dim)] hover:text-[var(--color-text-primary)]'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
