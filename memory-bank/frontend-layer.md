# Frontend Layer

## Functionality

### Current Features

- **Dashboard header**: Title "Financial Overview" with period badge ("2024 — Full Year")
- **4 KPI cards**: Total Income, Total Outcome, Profit, Profit Margin — displayed in a responsive grid
- **Income vs. Outcome chart**: Line chart (Recharts) showing monthly revenue and expenditure evolution
- **Profit Margin chart**: Line chart with reference line at 0%, showing monthly profit percentage
- **Loading state**: Skeleton placeholders for all cards and charts while data is being fetched
- **Error state**: Inline error banner when the API call fails
- **Dark theme**: Applied via `.dark` CSS class on `<main>`

### Data Flow

1. `App.tsx` calls `GET /api/metrics` on mount
2. Response data (list of `FinancialMovement`) is processed:
   - `computeKPIs()` → `KPIMetrics` (totalIncome, totalOutcome, profit, profitPercent)
   - `computeMonthlyData()` → `MonthlyDataPoint[]` (month, income, outcome, profitPercent)
3. KPIs rendered in `KPIRow` → `KPICard`
4. Monthly data rendered in `IncomeOutcomeChart` and `ProfitPercentChart`

### Component Tree

```
<App>
  ├── <DashboardHeader>
  ├── <KPIRow>
  │   ├── <KPICard variant="income">
  │   ├── <KPICard variant="outcome">
  │   ├── <KPICard variant="profit">
  │   └── <KPICard variant="profitPercent">
  ├── <IncomeOutcomeChart>   (Recharts LineChart)
  └── <ProfitPercentChart>   (Recharts LineChart with ReferenceLine)
```

## Technologies

| Category | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build tool | Vite 8 |
| CSS | Tailwind CSS 4 (via `@tailwindcss/vite` plugin) |
| UI primitives | shadcn/ui (Card, Skeleton) |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Class utilities | clsx + tailwind-merge (via `cn()`) |
| Testing | Vitest |
| Linting | ESLint + typescript-eslint |

## Constraints & Observations

- **Single-page app**: No routing (React Router not installed). Only one view.
- **No state management**: Uses only `useState` + `useEffect`. No Redux, Zustand, or context.
- **Consumes only `/api/metrics`**: Ignores richer endpoints like `/summary`, `/comparison`, `/alerts`, `/categories/top`, `/b2b`, `/b2c`.
- **`mock-data.ts` exists but is unused**: The file contains static mock data but the app fetches from the real API.
- **No user input**: No filter controls, date pickers, or form elements. Pure visualization.
- **No component tests**: Only `financial-utils.test.ts` exists (unit tests for utility functions).
- **Dark theme hardcoded**: `.dark` class is always applied on `<main>`.
- **CSS variables in Oklch**: Modern color space used for all theme values (light + dark).
- **Proxy dependency**: In development, Vite proxies `/api` to backend. Requires backend running.
- **Edge case handling**: Charts show "No data available to display" when all values are zero.
