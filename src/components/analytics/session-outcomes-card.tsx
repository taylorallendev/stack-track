"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type BarProps,
} from "recharts";

interface SessionOutcomesCardProps {
  dateRange: [Date | null, Date | null];
}

export function SessionOutcomesCard({}: SessionOutcomesCardProps) {
  // Mock data - replace with actual data fetching logic
  const data = [
    { date: "2024-01-01", profit: 50 },
    { date: "2024-01-15", profit: -30 },
    { date: "2024-02-01", profit: 75 },
    { date: "2024-02-15", profit: 100 },
    { date: "2024-03-01", profit: -20 },
    { date: "2024-03-15", profit: 60 },
  ];

  const winPercentage = (
    (data.filter((session) => session.profit > 0).length / data.length) *
    100
  ).toFixed(1);
  const avgWinningSession = (
    data
      .filter((session) => session.profit > 0)
      .reduce((sum, session) => sum + session.profit, 0) /
    data.filter((session) => session.profit > 0).length
  ).toFixed(2);
  const avgLosingSession = (
    data
      .filter((session) => session.profit < 0)
      .reduce((sum, session) => sum + session.profit, 0) /
    data.filter((session) => session.profit < 0).length
  ).toFixed(2);
  const biggestWin = Math.max(...data.map((session) => session.profit));
  const biggestLoss = Math.min(...data.map((session) => session.profit));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Outcomes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="profit"
                fill="#4ade80"
                shape={(props: BarProps) => {
                  const { x, y, width, height } = props;
                  return <rect x={x} y={y} width={width} height={height} />;
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Win Percentage</p>
            <p className="font-medium">{winPercentage}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Avg Winning Session</p>
            <p className="font-medium text-green-500">${avgWinningSession}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Avg Losing Session</p>
            <p className="font-medium text-red-500">${avgLosingSession}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Biggest Win/Loss</p>
            <p className="font-medium">
              <span className="text-green-500">${biggestWin}</span> /
              <span className="text-red-500">${biggestLoss}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
