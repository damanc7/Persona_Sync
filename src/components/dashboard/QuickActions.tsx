import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClipboardCheck, Map, ShoppingBag, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const actions = [
  { label: 'Review Imports', icon: <ClipboardCheck className="h-4 w-4" />, path: '/scraped' },
  { label: 'View Profile Map', icon: <Map className="h-4 w-4" />, path: '/map' },
  { label: 'Create Listing', icon: <ShoppingBag className="h-4 w-4" />, path: '/marketplace' },
  { label: 'Invite Collaborator', icon: <UserPlus className="h-4 w-4" />, path: '/collaborators' },
]

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <motion.div
          key={action.path}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.07 }}
        >
          <Button
            variant="secondary"
            className="w-full flex-col gap-2 h-auto py-4"
            onClick={() => navigate(action.path)}
          >
            <span className="text-[var(--color-accent-violet-bright)]">{action.icon}</span>
            <span className="text-xs">{action.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  )
}
