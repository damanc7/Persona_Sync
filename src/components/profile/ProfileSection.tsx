import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { DynamicField } from './DynamicField'
import type { ProfileSection as ProfileSectionType, ProfileField } from '@/types'

interface ProfileSectionProps {
  section: ProfileSectionType
  values: Record<string, string | boolean | null>
  errors: Record<string, string>
  onChange: (fieldId: string, value: string | boolean | null) => void
  animationIndex: number
}

export function ProfileSection({
  section,
  values,
  errors,
  onChange,
  animationIndex,
}: ProfileSectionProps) {
  const sectionErrors = section.fields
    .filter((f: ProfileField) => errors[f.id])
    .map((f: ProfileField) => ({ id: f.id, label: f.label, message: errors[f.id] }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationIndex * 0.07, ease: 'easeOut' }}
    >
      <Card variant="default" className="p-5 md:p-6">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-5">
          {section.title}
        </h2>

        {sectionErrors.length > 0 && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/8 px-3 py-2.5">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs text-red-400 space-y-0.5">
              {sectionErrors.map((e) => (
                <p key={e.id}><span className="font-medium">{e.label}:</span> {e.message}</p>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.fields.map((field: ProfileField) => (
            <div
              key={field.id}
              className={field.type === 'textarea' || field.type === 'boolean' ? 'md:col-span-2' : ''}
            >
              <DynamicField
                field={field}
                value={values[field.id] ?? null}
                onChange={(val) => onChange(field.id, val)}
                error={errors[field.id]}
              />
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
