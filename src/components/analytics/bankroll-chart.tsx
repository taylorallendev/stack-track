"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

interface BankrollChartProps {
  dateRange: [Date | null, Date | null];
}

export function BankrollChart({}: BankrollChartProps) {
  const [showDepositsWithdrawals, setShowDepositsWithdrawals] = useState(true);
  const [useLogScale, setUseLogScale] = useState(false);

  // Mock data - replace with actual data fetching logic
  const data = [
    { date: "2024-01-01", bankroll: 1000, deposit: 500 },
    { date: "2024-01-15", bankroll: 1200 },
    { date: "2024-02-01", bankroll: 1100, withdrawal: 200 },
    { date: "2024-02-15", bankroll: 1300 },
    { date: "2024-03-01", bankroll: 1500, deposit: 100 },
    { date: "2024-03-15", bankroll: 1700 },
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Bankroll Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                scale={useLogScale ? "log" : "linear"}
                domain={["auto", "auto"]}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bankroll"
                stroke="#8884d8"
                name="Bankroll"
              />
              {showDepositsWithdrawals && (
                <>
                  <Line
                    type="step"
                    dataKey="deposit"
                    stroke="#82ca9d"
                    name="Deposit"
                  />
                  <Line
                    type="step"
                    dataKey="withdrawal"
                    stroke="#ffc658"
                    name="Withdrawal"
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDepositsWithdrawals(!showDepositsWithdrawals)}
          >
            {showDepositsWithdrawals ? "Hide" : "Show"} Deposits/Withdrawals
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUseLogScale(!useLogScale)}
          >
            {useLogScale ? "Linear" : "Log"} Scale
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
