"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { formatDistanceStrict } from "date-fns";
import { getRecentSessions } from "~/server/actions/session";

interface ProcessedSession {
  id: string;
  date: string;
  stakes: string;
  site: string;
  duration: string;
  profit: number;
}

export function RecentSessionsQuickView() {
  const [sessions, setSessions] = useState<ProcessedSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentSessions() {
      try {
        setIsLoading(true);
        const recentSessions = await getRecentSessions(5);

        // Process the sessions for display
        const processedSessions = recentSessions.map((session) => {
          // Calculate profit
          const buyIn = parseFloat(session.buyIn);
          const cashOut = session.cashOut ? parseFloat(session.cashOut) : 0;
          const rebuys =
            session.rebuys?.reduce(
              (sum, rebuy) => sum + parseFloat(rebuy.amount),
              0,
            ) ?? 0;
          const profit = cashOut - (buyIn + rebuys);

          // Calculate duration
          let duration = "N/A";
          if (session.startTime && session.endTime) {
            duration = formatDistanceStrict(
              new Date(session.startTime),
              new Date(session.endTime),
              { addSuffix: false },
            );
          }

          // Format date
          const date = new Date(
            session.endTime ?? session.startTime,
          ).toLocaleDateString(undefined, { month: "short", day: "numeric" });

          return {
            id: session.id,
            date,
            stakes: session.stakes,
            site: session.site?.name ?? "Unknown",
            duration,
            profit,
          };
        });

        setSessions(processedSessions);
      } catch (error) {
        console.error("Error fetching recent sessions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchRecentSessions();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">
                    {session.date} - {session.stakes}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session.site} • {session.duration}
                  </p>
                </div>
                <div
                  className={`font-medium ${session.profit >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  ${session.profit >= 0 ? "+" : ""}
                  {session.profit.toFixed(2)}
                </div>
              </div>
            ))}

            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/sessions">View All Sessions</Link>
            </Button>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">No completed sessions yet</p>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              <Link href="/sessions">Start a Session</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
