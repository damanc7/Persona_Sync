import { AlertCircle } from 'lucide-react'

interface ErrorBannerProps {
  message?: string
  onRetry?: () => void
}

export function ErrorBanner({ message = 'Something went wrong.', onRetry }: ErrorBannerProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span className="text-sm flex-1">{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="text-xs underline hover:no-underline">Retry</button>
      )}
    </div>
  )
}
