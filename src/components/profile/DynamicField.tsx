import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import * as Select from '@radix-ui/react-select'
import * as Switch from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'
import type { ProfileField } from '@/types'
import { ChevronDown, Check } from 'lucide-react'

interface DynamicFieldProps {
  field: ProfileField
  value: string | boolean | null
  onChange: (value: string | boolean | null) => void
  error?: string
}

const inputClass = 'bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-violet)] w-full placeholder:text-[var(--color-text-muted)]'

export function DynamicField({ field, value, onChange, error }: DynamicFieldProps) {
  const [revealed, setRevealed] = useState(false)

  const inputId = `field-${field.id}`

  const labelEl = (
    <label htmlFor={inputId} className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
      {field.label}
      {field.required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
    </label>
  )

  const errorEl = error ? (
    <p className="text-xs text-[var(--color-error)] mt-1">{error}</p>
  ) : null

  if (field.type === 'boolean') {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-[var(--color-text-primary)]">{field.label}</span>
        <Switch.Root
          checked={value === true}
          onCheckedChange={(checked) => onChange(checked)}
          className={cn(
            'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-violet)] focus-visible:ring-offset-2',
            value === true
              ? 'bg-[var(--color-accent-violet)]'
              : 'bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)]'
          )}
        >
          <Switch.Thumb
            className={cn(
              'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform',
              value === true ? 'translate-x-4' : 'translate-x-0'
            )}
          />
        </Switch.Root>
      </div>
    )
  }

  if (field.type === 'select') {
    const strValue = (value as string | null) ?? ''
    return (
      <div>
        {labelEl}
        <Select.Root
          value={strValue || undefined}
          onValueChange={(v) => onChange(v)}
        >
          <Select.Trigger
            id={inputId}
            className={cn(
              inputClass,
              'flex items-center justify-between cursor-pointer',
              error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
            )}
          >
            <Select.Value placeholder="Select an option..." />
            <Select.Icon>
              <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              className="z-50 min-w-[8rem] overflow-hidden rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] shadow-xl"
              position="popper"
              sideOffset={4}
            >
              <Select.Viewport className="p-1">
                {field.options?.map((opt) => (
                  <Select.Item
                    key={opt}
                    value={opt}
                    className="relative flex cursor-pointer select-none items-center rounded-md px-8 py-2 text-sm text-[var(--color-text-primary)] outline-none hover:bg-white/8 data-[highlighted]:bg-white/8"
                  >
                    <Select.ItemIndicator className="absolute left-2 flex items-center">
                      <Check className="h-3.5 w-3.5 text-[var(--color-accent-violet)]" />
                    </Select.ItemIndicator>
                    <Select.ItemText>{opt}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        {errorEl}
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div>
        {labelEl}
        <textarea
          id={inputId}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={cn(
            inputClass,
            'resize-none',
            error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
          )}
          placeholder={`Enter ${field.label.toLowerCase()}...`}
        />
        {errorEl}
      </div>
    )
  }

  if (field.type === 'sensitive') {
    return (
      <div>
        {labelEl}
        <div className="relative">
          <input
            id={inputId}
            type={revealed ? 'text' : 'password'}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              inputClass,
              'pr-10',
              error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
            )}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
            tabIndex={-1}
            aria-label={revealed ? 'Hide value' : 'Reveal value'}
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errorEl}
      </div>
    )
  }

  // text, email, phone, date
  const inputType =
    field.type === 'email' ? 'email' :
    field.type === 'phone' ? 'tel' :
    field.type === 'date' ? 'date' :
    'text'

  return (
    <div>
      {labelEl}
      <input
        id={inputId}
        type={inputType}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          inputClass,
          error && 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
        )}
        placeholder={`Enter ${field.label.toLowerCase()}...`}
      />
      {errorEl}
    </div>
  )
}
