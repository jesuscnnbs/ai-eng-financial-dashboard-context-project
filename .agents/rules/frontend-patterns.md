# Frontend Patterns

## Scope
React component patterns and data-fetching conventions.

## Component interface pattern
Every data-display component MUST accept these props when applicable:
```typescript
interface Props {
  data: SomeType[]
  loading?: boolean
}
```
The component MUST render:
- **Loading state**: `<Skeleton>` placeholders when `loading=true`
- **Empty state**: A fallback message when data is empty ("No data available to display")
- **Normal state**: The actual content

Examples: `IncomeOutcomeChart`, `ProfitPercentChart`, `KPICard`.

## Data fetching pattern
All API calls follow this pattern in container components:
```typescript
const [data, setData] = useState<Type | null>(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  fetchData()
    .then(setData)
    .catch(() => setError("message"))
    .finally(() => setLoading(false))
}, [])
```

## Chart pattern
All Recharts-based components MUST:
1. Wrap the chart in a shadcn `<Card>` with `<CardHeader>` and `<CardContent>`
2. Use a `<ResponsiveContainer width="100%" height={n}>`
3. Define a custom `<Tooltip>` component (not the default Recharts tooltip) styled with CSS variables
4. Use `var(--chart-*)` CSS variables for line/bar colors
5. Handle the no-data edge case before rendering the chart

## Icon pattern
Use `lucide-react` icons. Import by name: `import { TrendingUp } from 'lucide-react'`. Pass `size` as a prop. Wrap icons in styled containers when used as badges.

## Utility imports
Always use the `@/` path alias for imports within `frontend/src/`:
```typescript
import { cn } from '@/lib/utils'           // OK
import { cn } from '../../lib/utils'       // Avoid
```
