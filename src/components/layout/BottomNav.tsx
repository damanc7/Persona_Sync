import { NavLink } from 'react-router-dom'
import { LayoutDashboard, User, Database, Map, MessageSquare, ShoppingBag, FlipHorizontal2, ShieldCheck, Plug } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/scraped', icon: Database, label: 'Data' },
  { to: '/map', icon: Map, label: 'Map' },
  { to: '/reverse', icon: FlipHorizontal2, label: 'Reverse' },
  // { to: '/collaborators', icon: MessageSquare, label: 'Chat' },
  { to: '/marketplace', icon: ShoppingBag, label: 'Market' },
  { to: '/data-rights', icon: ShieldCheck, label: 'Rights' },
  { to: '/agents', icon: Plug, label: 'Agents' },
]

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]/95 backdrop-blur-sm z-20">
      <div className="flex items-center justify-around px-2 py-1 safe-bottom">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => cn(
              'flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs transition-colors',
              isActive ? 'text-[var(--color-accent-violet-bright)]' : 'text-[var(--color-text-muted)]'
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
