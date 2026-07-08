import { useState } from "react";

function formatDateLabel(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface DateFilterProps {
  minDate: string
  maxDate: string
  onApply: (startDate: string, endDate: string) => void
  loading?: boolean
}

export function DateFilter({ minDate, maxDate, onApply, loading }: DateFilterProps) {
  const [startDate, setStartDate] = useState(minDate);
  const [endDate, setEndDate] = useState(maxDate);

  return (
    <section
      aria-label="Date range filter"
      className="flex flex-wrap items-end gap-4 rounded-lg border border-border bg-card p-4"
    >
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="filter-start-date"
          className="text-xs font-medium text-muted-foreground"
        >
          Start Date
        </label>
        <input
          id="filter-start-date"
          type="date"
          value={startDate}
          min={minDate}
          max={endDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="filter-end-date"
          className="text-xs font-medium text-muted-foreground"
        >
          End Date
        </label>
        <input
          id="filter-end-date"
          type="date"
          value={endDate}
          min={startDate}
          max={maxDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground"
        />
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={() => onApply(startDate, endDate)}
        className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {loading ? "Applying..." : "Apply"}
      </button>

      <p className="w-full text-xs text-muted-foreground">
        Available range: {formatDateLabel(minDate)} — {formatDateLabel(maxDate)}
      </p>
    </section>
  );
}
