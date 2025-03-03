"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "~/components/dashboard/stats-card";
import { getDashboardStats } from "~/server/actions/analytics";
import type { DashboardStats } from "~/server/actions/analytics";

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    }

    void fetchStats();
  }, []);

  // Format dollar amounts with 2 decimal places
  const formatMoney = (value: number) => {
    return value.toFixed(2);
  };

  // Format percentages with 1 decimal place
  const formatPercent = (value: number) => {
    return value.toFixed(1);
  };

  // Format hours as HH:MM
  const formatHours = (hours: number) => {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  };

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Sessions"
        value={stats?.totalSessions ?? 0}
        loading={loading}
        formatter={(val) => Math.round(val).toString()}
        description="Completed poker sessions"
      />

      <StatsCard
        title="Total Profit/Loss"
        value={stats?.profitLoss ?? 0}
        loading={loading}
        prefix="$"
        formatter={formatMoney}
        trend={
          stats?.profitLoss !== undefined
            ? stats.profitLoss > 0
              ? "up"
              : stats.profitLoss < 0
                ? "down"
                : "neutral"
            : undefined
        }
        description="All-time net profit"
      />

      <StatsCard
        title="Win Rate"
        value={stats?.winRate ?? 0}
        loading={loading}
        prefix="$"
        suffix="/hr"
        formatter={formatMoney}
        trend={
          stats?.winRate !== undefined
            ? stats.winRate > 0
              ? "up"
              : stats.winRate < 0
                ? "down"
                : "neutral"
            : undefined
        }
        description="Average profit per hour"
      />

      <StatsCard
        title="Average Session Profit"
        value={stats?.averageProfit ?? 0}
        loading={loading}
        prefix="$"
        formatter={formatMoney}
        trend={
          stats?.averageProfit !== undefined
            ? stats.averageProfit > 0
              ? "up"
              : stats.averageProfit < 0
                ? "down"
                : "neutral"
            : undefined
        }
      />

      <StatsCard
        title="Winning Percentage"
        value={stats?.winningPercentage ?? 0}
        loading={loading}
        suffix="%"
        formatter={formatPercent}
        description="Sessions with profit"
      />

      <StatsCard
        title="Biggest Win"
        value={stats?.biggestWin ?? 0}
        loading={loading}
        prefix="$"
        formatter={formatMoney}
        description="Largest single session profit"
      />

      <StatsCard
        title="Total Table Time"
        value={stats?.totalHoursPlayed ?? 0}
        loading={loading}
        formatter={formatHours}
        description="Total hours played"
      />

      <StatsCard
        title="Longest Session"
        value={stats?.longestSession ?? 0}
        loading={loading}
        formatter={formatHours}
        description="Duration of longest session"
      />
    </div>
  );
}
