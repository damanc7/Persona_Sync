import * as RadixTooltip from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={300}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={5}
            className={cn(
              'z-50 rounded-lg border border-[var(--color-border-default)]',
              'bg-[var(--color-bg-elevated)] px-3 py-1.5',
              'text-xs text-[var(--color-text-secondary)] shadow-lg',
              'animate-in fade-in-0 zoom-in-95',
              className
            )}
          >
            {content}
            <RadixTooltip.Arrow className="fill-[var(--color-bg-elevated)]" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
