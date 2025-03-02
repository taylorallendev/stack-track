"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { getSessionStats } from "~/server/actions/session";
import {
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Calendar,
} from "lucide-react";

interface SessionStats {
  totalSessions: number;
  totalProfit: number;
  avgProfit: number;
  winRate: number;
  biggestWin: number;
  biggestLoss: number;
  totalHours: number;
  avgSessionLength: number;
}

export function SessionStatsSummary() {
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const sessionStats = await getSessionStats();
        setStats(sessionStats);
      } catch (error) {
        console.error("Error fetching session stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchStats();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Session Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.totalSessions === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Session Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-medium">No sessions yet</h3>
            <p className="text-sm text-muted-foreground">
              Start your first session to begin tracking your poker journey.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Session Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Sessions</p>
            <p className="text-xl font-medium">{stats.totalSessions}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Profit</p>
            <p
              className={`text-xl font-medium ${stats.totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {stats.totalProfit >= 0 ? "+" : ""}${stats.totalProfit.toFixed(2)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Win Rate</p>
            <p className="text-xl font-medium">{stats.winRate.toFixed(1)}%</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Avg Profit/Session</p>
            <p
              className={`text-xl font-medium ${stats.avgProfit >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {stats.avgProfit >= 0 ? "+" : ""}${stats.avgProfit.toFixed(2)}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <p className="text-xs text-muted-foreground">Biggest Win</p>
            </div>
            <p className="text-xl font-medium text-green-500">
              +${stats.biggestWin.toFixed(2)}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center">
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              <p className="text-xs text-muted-foreground">Biggest Loss</p>
            </div>
            <p className="text-xl font-medium text-red-500">
              ${stats.biggestLoss.toFixed(2)}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Total Hours</p>
            </div>
            <p className="text-xl font-medium">
              {stats.totalHours.toFixed(1)}h
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center">
              <BarChart2 className="mr-1 h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Avg Session</p>
            </div>
            <p className="text-xl font-medium">
              {stats.avgSessionLength.toFixed(1)}h
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
