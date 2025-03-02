"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface PerformanceMetricsPanelProps {
  dateRange: [Date | null, Date | null];
}

export function PerformanceMetricsPanel({}: PerformanceMetricsPanelProps) {
  // Mock data - replace with actual data fetching logic
  const winRateData = [
    { date: "2024-01", rate: 2.5 },
    { date: "2024-02", rate: 3.2 },
    { date: "2024-03", rate: 1.8 },
    { date: "2024-04", rate: 4.1 },
    { date: "2024-05", rate: 3.7 },
  ];

  const stakesData = [
    { name: "2NL", value: 10 },
    { name: "5NL", value: 30 },
    { name: "10NL", value: 45 },
    { name: "25NL", value: 15 },
  ];

  const sessionLengthData = [
    { length: 1, profit: 10 },
    { length: 2, profit: 25 },
    { length: 3, profit: 15 },
    { length: 4, profit: 40 },
    { length: 5, profit: 30 },
  ];

  const timeOfDayData = [
    { time: "00:00", rate: 1.5 },
    { time: "04:00", rate: 2.1 },
    { time: "08:00", rate: 3.2 },
    { time: "12:00", rate: 2.8 },
    { time: "16:00", rate: 3.5 },
    { time: "20:00", rate: 2.9 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="winRate">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="winRate">Win Rate</TabsTrigger>
            <TabsTrigger value="stakes">Stakes</TabsTrigger>
            <TabsTrigger value="sessionLength">Session Length</TabsTrigger>
            <TabsTrigger value="timeOfDay">Time of Day</TabsTrigger>
          </TabsList>
          <TabsContent value="winRate">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={winRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="stakes">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stakesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stakesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="sessionLength">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="length" name="Session Length (hours)" />
                  <YAxis dataKey="profit" name="Profit ($)" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter
                    name="Sessions"
                    data={sessionLengthData}
                    fill="#8884d8"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="timeOfDay">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeOfDayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="rate" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
