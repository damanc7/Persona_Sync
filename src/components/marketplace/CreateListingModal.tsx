import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronRight, ChevronLeft } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useCreateListing } from '@/hooks/useMarketplace'
import { cn } from '@/lib/utils'

const CATEGORIES = ['Professional', 'Consumer', 'Location', 'Media', 'Social', 'Commerce']

const fullSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(80, 'Title must be 80 characters or less'),
  category: z.string().min(1, 'Please select a category'),
  price: z.string().min(1, 'Price is required').refine(v => !isNaN(Number(v)) && Number(v) > 0, 'Price must be greater than 0').refine(v => Number(v) <= 10_000, 'Max price is $10,000'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500, 'Description must be 500 characters or less'),
  endsAt: z.string().min(1, 'Please select an end date'),
})

type FormData = z.infer<typeof fullSchema>

interface CreateListingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const STEPS = ['Details', 'Pricing', 'Review']

export function CreateListingModal({ open, onOpenChange, onSuccess }: CreateListingModalProps) {
  const [step, setStep] = useState(0)
  const createListing = useCreateListing()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      title: '',
      category: '',
      price: '',
      description: '',
      endsAt: '',
    },
  })

  const values = watch()

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      reset()
      setStep(0)
    }, 200)
  }

  const handleNext = async () => {
    const fields = step === 0
      ? (['title', 'category'] as const)
      : (['price', 'description', 'endsAt'] as const)
    const valid = await trigger(fields)
    if (valid) setStep(s => s + 1)
  }

  const onSubmit = async (data: FormData) => {
    try {
      await createListing.mutateAsync({
        title: data.title,
        category: data.category,
        price: Number(data.price),
        endsAt: new Date(data.endsAt).toISOString(),
      })
      handleClose()
      onSuccess?.()
    } catch {
      // error handled by mutation state
    }
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      title="Create Listing"
      description="List your persona data on the marketplace"
      className="max-w-md"
    >
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={cn(
              'flex items-center justify-center h-6 w-6 rounded-full text-xs font-semibold shrink-0 transition-colors',
              i < step && 'bg-violet-600 text-white',
              i === step && 'bg-violet-600 text-white ring-2 ring-violet-400/40',
              i > step && 'bg-white/10 text-[var(--color-text-muted)]'
            )}>
              {i < step ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            <span className={cn(
              'text-xs transition-colors',
              i === step ? 'text-[var(--color-text-primary)] font-medium' : 'text-[var(--color-text-muted)]'
            )}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={cn('flex-1 h-px', i < step ? 'bg-violet-600' : 'bg-[var(--color-border-subtle)]')} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Title and Category */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Listing Title
              </label>
              <input
                {...register('title')}
                placeholder="e.g. Professional Profile Bundle"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-violet)]"
              />
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setValue('category', cat, { shouldValidate: true })}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                      values.category === cat
                        ? 'bg-violet-600/30 border-violet-500/50 text-violet-300'
                        : 'bg-white/5 border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:bg-white/10'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category.message}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Pricing and Description */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Asking Price (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-muted)]">$</span>
                <input
                  {...register('price')}
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2 rounded-lg bg-white/5 border border-[var(--color-border-default)] text-sm font-mono text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-violet)]"
                />
              </div>
              {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Describe what data is included in this listing..."
                className="w-full resize-none px-3 py-2 rounded-lg bg-white/5 border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-violet)]"
              />
              {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
                Auction End Date
              </label>
              <input
                {...register('endsAt')}
                type="date"
                min={minDateStr}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-violet)]"
              />
              {errors.endsAt && <p className="text-xs text-red-400 mt-1">{errors.endsAt.message}</p>}
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 2 && (
          <div className="space-y-3">
            <div className="rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{values.title}</p>
                <Badge variant="violet">{values.category}</Badge>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{values.description}</p>
              <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border-subtle)]">
                <div>
                  <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Asking Price</p>
                  <p className="text-lg font-bold font-mono text-[var(--color-text-primary)]">${Number(values.price).toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Ends</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {values.endsAt ? new Date(values.endsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                  </p>
                </div>
              </div>
            </div>
            {createListing.isError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                Failed to create listing. Please try again.
              </p>
            )}
          </div>
        )}

        <div className="flex justify-between gap-2 mt-6">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={step === 0 ? handleClose : () => setStep(s => s - 1)}
          >
            {step === 0 ? 'Cancel' : (
              <>
                <ChevronLeft className="h-3.5 w-3.5" />
                Back
              </>
            )}
          </Button>
          {step < 2 ? (
            <Button type="button" size="sm" onClick={handleNext}>
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button type="submit" size="sm" loading={createListing.isPending}>
              <Check className="h-3.5 w-3.5" />
              Publish Listing
            </Button>
          )}
        </div>
      </form>
    </Modal>
  )
}
