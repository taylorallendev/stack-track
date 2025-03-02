"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

export function PerformanceSnapshot() {
  // Mock data - would be fetched from your database in a real app
  const bankrollHistory = [
    { day: "1", amount: 1000 },
    { day: "3", amount: 1025 },
    { day: "5", amount: 1010 },
    { day: "7", amount: 1050 },
    { day: "9", amount: 1040 },
    { day: "11", amount: 1075 },
    { day: "13", amount: 1090 },
    { day: "15", amount: 1110 },
    { day: "17", amount: 1095 },
    { day: "19", amount: 1130 },
    { day: "21", amount: 1150 },
    { day: "23", amount: 1175 },
    { day: "25", amount: 1160 },
    { day: "27", amount: 1200 },
    { day: "30", amount: 1250 },
  ];

  const performanceData = {
    winRate: 1.25,
    currentStreak: 3,
    isWinStreak: true,
    bestSession: {
      date: "01/15/24",
      amount: 45.75,
    },
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Performance Snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bankrollHistory}>
              <Tooltip
                formatter={(value: number) => [`$${value}`, "Bankroll"]}
                labelFormatter={() => ""}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Win Rate</span>
            <span className="text-lg font-medium">
              ${performanceData.winRate.toFixed(2)}/hr
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">
              {performanceData.isWinStreak ? "Win" : "Loss"} Streak
            </span>
            <span className="text-lg font-medium">
              {performanceData.currentStreak}
            </span>
          </div>
          <div className="col-span-2 flex flex-col">
            <span className="text-sm text-muted-foreground">Best Session</span>
            <span className="text-lg font-medium">
              ${performanceData.bestSession.amount.toFixed(2)} on{" "}
              {performanceData.bestSession.date}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
