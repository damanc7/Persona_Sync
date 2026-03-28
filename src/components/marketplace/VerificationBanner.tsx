import { ShieldCheck, ShieldAlert } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface VerificationBannerProps {
  verified: boolean
  completedAt?: string
}

export function VerificationBanner({ verified, completedAt }: VerificationBannerProps) {
  if (verified) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-emerald-300">Data Verified</p>
          {completedAt && (
            <p className="text-xs text-emerald-400/70 mt-0.5">
              Verified on {new Date(completedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>
        <Badge variant="success">Verified</Badge>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
      <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-300">Verification Required</p>
        <p className="text-xs text-amber-400/70 mt-0.5">
          Your data must be verified before you can create marketplace listings. Complete verification to unlock listing creation.
        </p>
      </div>
      <Button size="sm" variant="secondary" className="shrink-0 border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
        Get Verified
      </Button>
    </div>
  )
}
