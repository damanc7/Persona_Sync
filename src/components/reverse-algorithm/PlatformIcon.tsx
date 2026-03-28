import { cn } from '@/lib/utils'

interface PlatformIconProps {
  platformId: string
  platformName: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const colorMap: Record<string, string> = {
  linkedin: 'bg-blue-600 text-white',
  github: 'bg-gray-700 text-white',
  google: 'bg-red-500 text-white',
  spotify: 'bg-green-500 text-white',
  amazon: 'bg-amber-500 text-white',
  instagram: 'bg-pink-500 text-white',
}

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

export function PlatformIcon({ platformId, platformName, size = 'md', className }: PlatformIconProps) {
  const colors = colorMap[platformId] ?? 'bg-violet-600 text-white'
  return (
    <div className={cn('rounded-full flex items-center justify-center font-bold shrink-0', sizeMap[size], colors, className)}>
      {platformName.charAt(0).toUpperCase()}
    </div>
  )
}
