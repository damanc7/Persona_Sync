import { useState } from 'react'
import * as Select from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useInviteCollaborator } from '@/hooks/useCollaborators'
import { cn } from '@/lib/utils'

interface InviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const roles = [
  { value: 'editor', label: 'Editor', description: 'Can view and edit data' },
  { value: 'viewer', label: 'Viewer', description: 'Can view data only' },
]

export function InviteModal({ open, onOpenChange, onSuccess }: InviteModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('viewer')
  const [error, setError] = useState('')
  const invite = useInviteCollaborator()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    try {
      await invite.mutateAsync({ email, role })
      setEmail('')
      setRole('viewer')
      onOpenChange(false)
      onSuccess?.()
    } catch {
      setError('Failed to send invitation. Please try again.')
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Invite Collaborator" description="Send an invitation to collaborate on your persona data.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="colleague@example.com"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-violet)] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Role
          </label>
          <Select.Root value={role} onValueChange={setRole}>
            <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-violet)]">
              <Select.Value />
              <Select.Icon>
                <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                className="z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] shadow-xl shadow-black/40"
                position="popper"
                sideOffset={4}
              >
                <Select.Viewport className="p-1">
                  {roles.map(r => (
                    <Select.Item
                      key={r.value}
                      value={r.value}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer outline-none',
                        'data-[highlighted]:bg-white/10 text-[var(--color-text-primary)]'
                      )}
                    >
                      <Select.ItemText>{r.label}</Select.ItemText>
                      <Select.ItemIndicator className="ml-auto">
                        <Check className="h-3.5 w-3.5 text-violet-400" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" size="sm" loading={invite.isPending}>
            Send Invitation
          </Button>
        </div>
      </form>
    </Modal>
  )
}
