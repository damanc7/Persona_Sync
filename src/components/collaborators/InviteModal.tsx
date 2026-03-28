import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useInviteCollaborator } from '@/hooks/useCollaborators'

interface InviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function InviteModal({ open, onOpenChange, onSuccess }: InviteModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [tagline, setTagline] = useState('')
  const [error, setError] = useState('')
  const invite = useInviteCollaborator()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    try {
      await invite.mutateAsync({ email, role: 'editor', name: name.trim(), tagline: tagline.trim() })
      setName('')
      setEmail('')
      setTagline('')
      onOpenChange(false)
      onSuccess?.()
    } catch {
      setError('Failed to add profile. Please try again.')
    }
  }

  const inputClass = 'w-full px-3 py-2 rounded-lg bg-[var(--color-overlay-dim)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-violet)] transition-colors'

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Add a Profile" description="Add a friend or colleague's profile so they can join conversations with their perspective.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Joe, Harish, Daman"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="colleague@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Tagline / speciality
          </label>
          <input
            type="text"
            value={tagline}
            onChange={e => setTagline(e.target.value)}
            placeholder="e.g. Backend engineer, Go & Rust, prefers minimal abstractions"
            className={inputClass}
          />
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
            Add Profile
          </Button>
        </div>
      </form>
    </Modal>
  )
}
