"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getSessionPerformanceMetrics } from "~/server/actions/analytics";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface SessionMetrics {
  id: string;
  date: Date;
  stakes: string;
  buyIn: number;
  cashOut: number;
  profit: number;
  durationHours: number;
  hourlyRate: number;
}

export function PerformanceMetrics() {
  const [data, setData] = useState<SessionMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe] = useState(90); // Default to 90 days

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getSessionPerformanceMetrics(timeframe);
        setData(result.data);
      } catch (err) {
        console.error("Error fetching performance metrics:", err);
        setError("Failed to load performance data");
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, [timeframe]);

  // Format date for display on chart
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">No session data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for the chart - get most recent 10 sessions
  const chartData = [...data]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)
    .reverse()
    .map((session) => ({
      date: formatDate(session.date),
      profit: session.profit,
      hourlyRate: session.hourlyRate,
      stakes: session.stakes,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Session Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) => `$${value}`}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => `$${value}/hr`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: "rgba(16, 24, 39, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#f9fafb",
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="profit"
                name="Session Profit"
                fill="#4ade80" // green
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="hourlyRate"
                name="Hourly Rate"
                fill="#3b82f6" // blue
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
