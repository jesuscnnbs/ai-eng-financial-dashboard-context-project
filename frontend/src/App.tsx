import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DateFilter } from "@/components/dashboard/date-filter";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { IncomeOutcomeChart } from "@/components/dashboard/income-outcome-chart";
import { ProfitPercentChart } from "@/components/dashboard/profit-percent-chart";
import { AnomaliesTable } from "@/components/dashboard/anomalies-table";
import { RevenueComparisonPage } from "@/components/dashboard/revenue-comparison-page";
import {
  type FinancialMovement,
  type KPIMetrics,
  type MonthlyDataPoint,
  type MetricsFacets,
  type MetricsAlert,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function fetchFinancialData(
  startDate?: string,
  endDate?: string,
): Promise<FinancialMovement[]> {
  const params = new URLSearchParams();
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);
  const qs = params.toString();
  const response = await fetch(
    `${API_BASE_URL}/api/metrics${qs ? `?${qs}` : ""}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

async function fetchAlerts(
  threshold: number,
  startDate?: string,
  endDate?: string,
): Promise<MetricsAlert[]> {
  const params = new URLSearchParams();
  params.set("threshold", String(threshold));
  params.set("group_by", "month");
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);
  const response = await fetch(
    `${API_BASE_URL}/api/metrics/alerts?${params.toString()}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch alerts: ${response.status}`);
  }
  return response.json();
}

function App() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [alerts, setAlerts] = useState<MetricsAlert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [threshold, setThreshold] = useState(0.3);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [page, setPage] = useState<"overview" | "revenue-comparison">("overview");

  function loadAlerts(
    thr: number,
    startDate?: string,
    endDate?: string,
  ) {
    setAlertsLoading(true);
    fetchAlerts(thr, startDate, endDate)
      .then(setAlerts)
      .catch(() => setAlerts([]))
      .finally(() => setAlertsLoading(false));
  }

  useEffect(() => {
    setAlertsLoading(true);
    Promise.all([
      fetchFinancialData(),
      fetch(`${API_BASE_URL}/api/metrics/facets`).then<MetricsFacets>((r) =>
        r.json(),
      ),
      fetchAlerts(threshold),
    ])
      .then(([movements, facets, alertData]) => {
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
        setMinDate(facets.min_date);
        setMaxDate(facets.max_date);
        setAlerts(alertData);
      })
      .catch(() => {
        setError(
          "No se pudo cargar la informacion financiera. Revisa la API de backend.",
        );
      })
      .finally(() => {
        setLoading(false);
        setAlertsLoading(false);
      });
  }, []);

  function handleDateFilter(startDate: string, endDate: string) {
    setFilterStartDate(startDate);
    setFilterEndDate(endDate);
    setLoading(true);
    setError(null);
    fetchFinancialData(startDate, endDate)
      .then((movements) => {
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
      })
      .catch(() => {
        setError(
          "No se pudo cargar la informacion financiera. Revisa la API de backend.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
    loadAlerts(threshold, startDate, endDate);
  }

  function handleThresholdChange(newThreshold: number) {
    setThreshold(newThreshold);
    loadAlerts(
      newThreshold,
      filterStartDate || undefined,
      filterEndDate || undefined,
    );
  }

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <DashboardHeader period="2024 - Full Year" />

          <nav
            aria-label="Dashboard pages"
            className="flex gap-1 rounded-lg border border-border bg-card p-1"
          >
            <button
              type="button"
              onClick={() => setPage("overview")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                page === "overview"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard Overview
            </button>
            <button
              type="button"
              onClick={() => setPage("revenue-comparison")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                page === "revenue-comparison"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              B2B vs B2C Revenue
            </button>
          </nav>

          {page === "overview" ? (
            <>
              {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
                  {error}
                </div>
              ) : null}

              {minDate && maxDate ? (
                <DateFilter
                  minDate={minDate}
                  maxDate={maxDate}
                  onApply={handleDateFilter}
                  loading={loading}
                />
              ) : null}

              <section aria-label="Key performance indicators">
                <KPIRow metrics={metrics} loading={loading} />
              </section>

              <section
                aria-label="Financial charts"
                className="grid grid-cols-1 gap-4 xl:grid-cols-2"
              >
                <IncomeOutcomeChart data={monthlyData} loading={loading} />
                <ProfitPercentChart data={monthlyData} loading={loading} />
              </section>

              <section aria-label="Anomaly detection alerts">
                <AnomaliesTable
                  data={alerts}
                  loading={alertsLoading}
                  threshold={threshold}
                  onThresholdChange={handleThresholdChange}
                />
              </section>
            </>
          ) : (
            <RevenueComparisonPage />
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
