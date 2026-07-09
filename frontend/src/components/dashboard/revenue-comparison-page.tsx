import { useEffect, useState } from 'react'
import { DateFilter } from '@/components/dashboard/date-filter'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  type MetricsFacets,
  type TopCategoryItem,
  type MetricsSummaryItem,
} from '@/lib/financial-types'
import { formatCurrency } from '@/lib/financial-utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""

interface ChartDataPoint {
  month: string
  b2b: number
  b2c: number
}

interface CategoryRow extends TopCategoryItem {
  percentage: number
}

interface TooltipPayload {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground ml-auto pl-4">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

function formatMonth(period: string): string {
  const [year, month] = period.split('-')
  return new Date(Number(year), Number(month) - 1, 1)
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function buildChartData(b2b: MetricsSummaryItem[], b2c: MetricsSummaryItem[]): ChartDataPoint[] {
  const b2bMap = new Map(b2b.map((item) => [item.period, item.income]))
  const b2cMap = new Map(b2c.map((item) => [item.period, item.income]))
  const allPeriods = [...new Set([...b2bMap.keys(), ...b2cMap.keys()])].sort()
  return allPeriods.map((period) => ({
    month: formatMonth(period),
    b2b: b2bMap.get(period) ?? 0,
    b2c: b2cMap.get(period) ?? 0,
  }))
}

function computePercentages(items: TopCategoryItem[]): CategoryRow[] {
  const total = items.reduce((sum, item) => sum + item.total_amount, 0)
  return items.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.total_amount / total) * 100 : 0,
  }))
}

async function checkResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
  return response.json()
}

export function RevenueComparisonPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [minDate, setMinDate] = useState("")
  const [maxDate, setMaxDate] = useState("")
  const [b2bRows, setB2bRows] = useState<CategoryRow[]>([])
  const [b2cRows, setB2cRows] = useState<CategoryRow[]>([])
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  async function fetchData(startDate?: string, endDate?: string) {
    const catParams = new URLSearchParams({ operation_type: 'income', limit: '5' })
    if (startDate) catParams.set('start_date', startDate)
    if (endDate) catParams.set('end_date', endDate)

    const sumParams = new URLSearchParams({ operation_type: 'income', group_by: 'month' })
    if (startDate) sumParams.set('start_date', startDate)
    if (endDate) sumParams.set('end_date', endDate)

    const responses = await Promise.all([
      fetch(`${API_BASE_URL}/api/metrics/categories/top?${catParams}&business_type=B2B`),
      fetch(`${API_BASE_URL}/api/metrics/categories/top?${catParams}&business_type=B2C`),
      fetch(`${API_BASE_URL}/api/metrics/summary?${sumParams}&business_type=B2B`),
      fetch(`${API_BASE_URL}/api/metrics/summary?${sumParams}&business_type=B2C`),
    ])

    const [b2bCat, b2cCat, b2bSum, b2cSum] = await Promise.all([
      checkResponse<TopCategoryItem[]>(responses[0]),
      checkResponse<TopCategoryItem[]>(responses[1]),
      checkResponse<MetricsSummaryItem[]>(responses[2]),
      checkResponse<MetricsSummaryItem[]>(responses[3]),
    ])

    return { b2bCat, b2cCat, b2bSum, b2cSum }
  }

  useEffect(() => {
    let cancelled = false

    async function initialLoad() {
      try {
        setLoading(true)
        setError(null)

        const facets = await checkResponse<MetricsFacets>(
          await fetch(`${API_BASE_URL}/api/metrics/facets`),
        )
        if (cancelled) return
        setMinDate(facets.min_date)
        setMaxDate(facets.max_date)

        const { b2bCat, b2cCat, b2bSum, b2cSum } = await fetchData()
        if (cancelled) return
        setB2bRows(computePercentages(b2bCat))
        setB2cRows(computePercentages(b2cCat))
        setChartData(buildChartData(b2bSum, b2cSum))
      } catch {
        if (!cancelled) setError('Failed to load revenue data. Check the API.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    initialLoad()
    return () => { cancelled = true }
  }, [])

  function handleDateFilter(startDate: string, endDate: string) {
    setLoading(true)
    setError(null)

    fetchData(startDate, endDate)
      .then(({ b2bCat, b2cCat, b2bSum, b2cSum }) => {
        setB2bRows(computePercentages(b2bCat))
        setB2cRows(computePercentages(b2cCat))
        setChartData(buildChartData(b2bSum, b2cSum))
      })
      .catch(() => setError('Failed to load revenue data. Check the API.'))
      .finally(() => setLoading(false))
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
          {error}
        </div>
      </div>
    )
  }

  const hasChartData = chartData.some((d) => d.b2b > 0 || d.b2c > 0)

  return (
    <div className="flex flex-col gap-8">
      {minDate && maxDate ? (
        <DateFilter
          minDate={minDate}
          maxDate={maxDate}
          onApply={handleDateFilter}
          loading={loading}
        />
      ) : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CategoryCard
          title="B2B — Top Income Categories"
          rows={b2bRows}
          loading={loading}
        />
        <CategoryCard
          title="B2C — Top Income Categories"
          rows={b2cRows}
          loading={loading}
        />
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Revenue Comparison: B2B vs B2C</CardTitle>
          <CardDescription>Monthly total income by business type</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[280px] w-full rounded-lg" />
          ) : !hasChartData ? (
            <div className="flex h-[280px] items-center justify-center text-muted-foreground text-sm">
              No data available to display
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.6} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  width={48}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="b2b"
                  name="B2B"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--chart-1)', strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="b2c"
                  name="B2C"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--chart-2)', strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function CategoryCard({
  title,
  rows,
  loading,
}: {
  title: string
  rows: CategoryRow[]
  loading: boolean
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        {loading ? (
          <>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-36 mt-1" />
          </>
        ) : (
          <>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            <CardDescription>Highest revenue categories</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-muted-foreground text-sm rounded-lg border border-dashed border-border">
            No data available
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground text-xs uppercase tracking-wider">
                <th className="py-3 pr-4 font-medium">Category</th>
                <th className="py-3 pr-4 font-medium text-right">Revenue</th>
                <th className="py-3 pr-4 font-medium text-right">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.category} className="border-b border-border/50 last:border-0">
                  <td className="py-3 pr-4 font-medium text-foreground capitalize">{row.category}</td>
                  <td className="py-3 pr-4 text-right text-foreground tabular-nums">
                    {formatCurrency(row.total_amount)}
                  </td>
                  <td className="py-3 pr-4 text-right tabular-nums text-muted-foreground">
                    {row.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
