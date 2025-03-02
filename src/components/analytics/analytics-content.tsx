"use client";

import { useState } from "react";
import { DateRangeSelector } from "~/components/analytics/date-range-selector";
import { BankrollChart } from "~/components/analytics/bankroll-chart";
import { SessionOutcomesCard } from "~/components/analytics/session-outcomes-card";
import { PerformanceMetricsPanel } from "~/components/analytics/performance-metrics-panel";
import { SiteComparisonTable } from "~/components/analytics/site-comparison-table";
import { DataExportOptions } from "~/components/analytics/data-export-options";
import { InsightsPanel } from "~/components/analytics/insights-panel";

export function AnalyticsContent() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(new Date().setDate(new Date().getDate() - 30)), // 30 days ago
    new Date(), // today
  ]);

  return (
    <div className="space-y-6">
      <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
      <div className="grid gap-6 md:grid-cols-2">
        <BankrollChart dateRange={dateRange} />
        <SessionOutcomesCard dateRange={dateRange} />
      </div>
      <PerformanceMetricsPanel dateRange={dateRange} />
      <SiteComparisonTable dateRange={dateRange} />
      <div className="grid gap-6 md:grid-cols-2">
        <DataExportOptions />
        <InsightsPanel dateRange={dateRange} />
      </div>
    </div>
  );
}
