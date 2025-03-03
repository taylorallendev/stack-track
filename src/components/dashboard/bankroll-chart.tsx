"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getBankrollGrowthData } from "~/server/actions/analytics";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface ChartData {
  date: Date;
  balance: number;
  type: string;
  amount: number;
  notes?: string | null;
}

export function BankrollChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getBankrollGrowthData();
        setData(result.data);
      } catch (err) {
        console.error("Error fetching bankroll data:", err);
        setError("Failed to load bankroll data");
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, []);

  // Format date for display on chart
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  // Format money for tooltip
  const formatMoney = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bankroll Growth</CardTitle>
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
          <CardTitle>Bankroll Growth</CardTitle>
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
          <CardTitle>Bankroll Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">No bankroll data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bankroll Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
                tickCount={5}
              />
              <YAxis
                tickFormatter={formatMoney}
                tick={{ fontSize: 12 }}
                width={80}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip
                formatter={(value: number) => formatMoney(value)}
                labelFormatter={(label) => formatDate(label as Date)}
                contentStyle={{
                  backgroundColor: "rgba(16, 24, 39, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#f9fafb",
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorBalance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
