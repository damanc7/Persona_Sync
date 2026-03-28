import { useEffect, useMemo, useCallback, useState } from 'react'
import { useBlocker } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as Progress from '@radix-ui/react-progress'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/Button'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { ProfileSection } from '@/components/profile/ProfileSection'
import { useProfileSchema, useProfile, useSaveProfile } from '@/hooks/useProfile'
import type { ProfileField } from '@/types'

// Zod schema is built dynamically and validated manually to avoid
// tying field IDs to static zod object keys at compile time.
function validateValues(
  fields: ProfileField[],
  values: Record<string, string | boolean | null>
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of fields) {
    const val = values[field.id]
    if (field.required) {
      if (val === null || val === undefined || val === '') {
        errors[field.id] = 'Required'
        continue
      }
    }
    if (field.type === 'email' && val && typeof val === 'string' && val.trim() !== '') {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRe.test(val)) {
        errors[field.id] = 'Invalid email'
      }
    }
  }
  return errors
}

function calcCompletion(
  fields: ProfileField[],
  values: Record<string, string | boolean | null>
): number {
  if (fields.length === 0) return 0
  const filled = fields.filter((f) => {
    const v = values[f.id]
    return v !== null && v !== undefined && v !== ''
  }).length
  return Math.round((filled / fields.length) * 100)
}

export function Profile() {
  const { data: schema, isLoading: schemaLoading, error: schemaError, refetch: refetchSchema } = useProfileSchema()
  const { data: profileData, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useProfile()
  const saveProfile = useSaveProfile()

  const [values, setValues] = useState<Record<string, string | boolean | null>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  // Seed local state from loaded profile data
  useEffect(() => {
    if (profileData) {
      setValues(profileData)
      setIsDirty(false)
    }
  }, [profileData])

  // Set initial active section
  useEffect(() => {
    if (schema && schema.length > 0 && !activeSection) {
      setActiveSection(schema[0].id)
    }
  }, [schema, activeSection])

  // Unsaved-changes guard: beforeunload
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  // React Router navigation blocker
  const blocker = useBlocker(isDirty)

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const confirmed = window.confirm('You have unsaved changes. Leave without saving?')
      if (confirmed) {
        blocker.proceed()
      } else {
        blocker.reset()
      }
    }
  }, [blocker])

  const allFields = useMemo(
    () => (schema ?? []).flatMap((s) => s.fields),
    [schema]
  )

  const completion = useMemo(
    () => calcCompletion(allFields, values),
    [allFields, values]
  )

  const handleChange = useCallback(
    (fieldId: string, value: string | boolean | null) => {
      setValues((prev) => ({ ...prev, [fieldId]: value }))
      setIsDirty(true)
      // Clear error for this field when user edits
      setErrors((prev) => {
        if (!prev[fieldId]) return prev
        const next = { ...prev }
        delete next[fieldId]
        return next
      })
    },
    []
  )

  const handleSave = async () => {
    const errs = validateValues(allFields, values)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast.error('Please fix the errors before saving.')
      return
    }
    setErrors({})
    try {
      await saveProfile.mutateAsync(values)
      setIsDirty(false)
      toast.success('Profile saved!')
    } catch {
      toast.error('Failed to save profile. Please try again.')
    }
  }

  const isLoading = schemaLoading || profileLoading
  const isError = schemaError || profileError

  const saveButton = (
    <Button
      variant="primary"
      size="sm"
      onClick={handleSave}
      loading={saveProfile.isPending}
      disabled={!isDirty}
    >
      <Save className="h-3.5 w-3.5" />
      Save
    </Button>
  )

  if (isLoading) {
    return (
      <div>
        <TopBar title="Profile" actions={saveButton} />
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-4">
          {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (isError || !schema) {
    return (
      <div>
        <TopBar title="Profile" actions={saveButton} />
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          <ErrorBanner
            message="Failed to load profile data."
            onRetry={() => { refetchSchema(); refetchProfile() }}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <TopBar title="Profile" actions={saveButton} />

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* Completion bar */}
        <motion.div
          className="mb-6 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--color-text-primary)]">Profile Completion</span>
            <span className="text-sm font-semibold text-[var(--color-accent-violet-bright)]">{completion}%</span>
          </div>
          <Progress.Root
            value={completion}
            className="relative overflow-hidden rounded-full h-2 bg-[var(--color-track-bg)] w-full"
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent-violet)] to-[var(--color-accent-violet-bright)]"
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </Progress.Root>
        </motion.div>

        <div className="flex gap-6">
          {/* Sticky section nav (desktop) */}
          <aside className="hidden md:block w-48 shrink-0">
            <nav className="sticky top-20 space-y-0.5">
              {schema.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id)
                    document.getElementById(`section-${section.id}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    })
                  }}
                  className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors ${
                    activeSection === section.id
                      ? 'bg-[var(--color-accent-violet)]/15 text-[var(--color-accent-violet-bright)] font-medium'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-overlay-dim)]'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* Section cards */}
          <div className="flex-1 space-y-4 min-w-0">
            {schema.map((section, idx) => {
              const sectionErrors: Record<string, string> = {}
              section.fields.forEach((f) => {
                if (errors[f.id]) sectionErrors[f.id] = errors[f.id]
              })
              return (
                <div id={`section-${section.id}`} key={section.id}>
                  <ProfileSection
                    section={section}
                    values={values}
                    errors={sectionErrors}
                    onChange={handleChange}
                    animationIndex={idx}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
