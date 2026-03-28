import { NavLink } from 'react-router-dom'
import { LayoutDashboard, User, Database, Map, Users, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/scraped', icon: Database, label: 'Scraped Data' },
  { to: '/map', icon: Map, label: 'Data Map' },
  { to: '/collaborators', icon: Users, label: 'Collaborators' },
  { to: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
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
                : 'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)]'
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
