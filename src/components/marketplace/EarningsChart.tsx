import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

interface EarningsData {
  totalEarned: number
  pending: number
  thisMonth: number
  lastMonth: number
  history: { month: string; amount: number }[]
}

interface EarningsChartProps {
  data?: EarningsData
  loading?: boolean
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] shadow-xl text-xs">
      <p className="text-[var(--color-text-muted)] mb-0.5">{label}</p>
      <p className="text-violet-300 font-semibold font-mono">${payload[0]!.value.toLocaleString()}</p>
    </div>
  )
}

export function EarningsChart({ data, loading }: EarningsChartProps) {
  return (
    <Card variant="elevated" className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total Earnings</p>
          {loading ? (
            <Skeleton className="h-7 w-24" />
          ) : (
            <p className="text-2xl font-bold font-mono text-[var(--color-text-primary)]">
              ${data?.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
          <DollarSign className="h-4 w-4 text-violet-400" />
          <span className="text-xs text-violet-300 font-medium">
            {loading ? '...' : `$${data?.pending.toFixed(2)} pending`}
          </span>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-40 w-full rounded-lg" />
      ) : (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.history ?? []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `$${v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#7c3aed"
                strokeWidth={2}
                fill="url(#earningsGradient)"
                dot={{ r: 3, fill: '#7c3aed', strokeWidth: 0 }}
                activeDot={{ r: 4, fill: '#a78bfa' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && data && (
        <div className="flex gap-4 mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
          <div>
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">This Month</p>
            <p className="text-sm font-semibold font-mono text-[var(--color-text-primary)] mt-0.5">
              ${data.thisMonth.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Last Month</p>
            <p className="text-sm font-semibold font-mono text-[var(--color-text-primary)] mt-0.5">
              ${data.lastMonth.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
