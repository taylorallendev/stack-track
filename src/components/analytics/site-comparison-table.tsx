"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface SiteComparisonTableProps {
  dateRange: [Date | null, Date | null];
}

export function SiteComparisonTable({}: SiteComparisonTableProps) {
  // Mock data - replace with actual data fetching logic
  const siteData = [
    {
      site: "Bovada",
      sessions: 50,
      hours: 100,
      profit: 500,
      winRate: 5,
      winPercentage: 60,
    },
    {
      site: "PokerStars",
      sessions: 30,
      hours: 60,
      profit: 300,
      winRate: 5,
      winPercentage: 55,
    },
    {
      site: "PartyPoker",
      sessions: 20,
      hours: 40,
      profit: 100,
      winRate: 2.5,
      winPercentage: 50,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site/Location Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Win Rate</TableHead>
                <TableHead>Win %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {siteData.map((site) => (
                <TableRow key={site.site}>
                  <TableCell>{site.site}</TableCell>
                  <TableCell>{site.sessions}</TableCell>
                  <TableCell>{site.hours}</TableCell>
                  <TableCell>${site.profit}</TableCell>
                  <TableCell>${site.winRate}/hr</TableCell>
                  <TableCell>{site.winPercentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={siteData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="profit"
                >
                  {siteData.map((entry, index) => (
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
        </div>
      </CardContent>
    </Card>
  );
}
