import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { type MetricsAlert } from '@/lib/financial-types'
import { formatCurrency } from '@/lib/financial-utils'

interface AnomaliesTableProps {
  data: MetricsAlert[]
  loading?: boolean
  threshold: number
  onThresholdChange: (threshold: number) => void
}

function formatPeriod(period: string): string {
  const [year, month] = period.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function formatIncreaseRatio(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${(value * 100).toFixed(2)}%`
}

export function AnomaliesTable({ data, loading, threshold, onThresholdChange }: AnomaliesTableProps) {
  if (loading) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-72 mt-1" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-8 w-full rounded" />
          <Skeleton className="h-8 w-full rounded" />
          <Skeleton className="h-8 w-full rounded" />
        </CardContent>
      </Card>
    )
  }

  const hasData = data.length > 0

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Anomaly Detection</CardTitle>
        <CardDescription>
          Periods where the registered outcome exceeds the moving average of the 3 previous periods
          beyond the threshold
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <label htmlFor="alert-threshold" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Alert threshold:
          </label>
          <input
            id="alert-threshold"
            type="range"
            min={0.01}
            max={1.0}
            step={0.01}
            value={threshold}
            onChange={(e) => onThresholdChange(Number(e.target.value))}
            className="w-full max-w-48 accent-[var(--chart-outcome)]"
          />
          <span className="text-sm font-semibold text-foreground tabular-nums w-10 text-right">
            {threshold.toFixed(2)}
          </span>
        </div>

        {!hasData ? (
          <div className="flex h-24 items-center justify-center text-muted-foreground text-sm rounded-lg border border-dashed border-border">
            No anomalies detected with the current threshold
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="py-3 pr-4 font-medium">Period</th>
                  <th className="py-3 pr-4 font-medium">Registered Outcome</th>
                  <th className="py-3 pr-4 font-medium">Moving Average (3 prev.)</th>
                  <th className="py-3 pr-4 font-medium text-right">% Increment</th>
                </tr>
              </thead>
              <tbody>
                {data.map((alert) => (
                  <tr key={alert.period} className="border-b border-border/50 last:border-0">
                    <td className="py-3 pr-4 font-medium text-foreground">{formatPeriod(alert.period)}</td>
                    <td className="py-3 pr-4 text-foreground tabular-nums">{formatCurrency(alert.outcome_total)}</td>
                    <td className="py-3 pr-4 text-muted-foreground tabular-nums">{formatCurrency(alert.baseline_average)}</td>
                    <td className="py-3 pr-4 text-right tabular-nums font-semibold text-[var(--chart-outcome)]">
                      {formatIncreaseRatio(alert.increase_ratio)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
