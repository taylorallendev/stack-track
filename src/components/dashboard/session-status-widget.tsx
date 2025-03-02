"use client";

import { formatDuration } from "~/lib/format-duration";
import { useActiveSession } from "~/hooks/use-active-session";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";

export function SessionStatusWidget() {
  const { activeSession, isLoading, totalBuyIn } = useActiveSession();
  const [duration, setDuration] = useState("00:00:00");

  // Update timer every second when there's an active session
  useEffect(() => {
    if (!activeSession) {
      setDuration("00:00:00");
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const elapsed = now.getTime() - activeSession.startTime.getTime();
      setDuration(formatDuration(elapsed));
    };

    // Update immediately
    updateTimer();

    // Then update every second
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [activeSession]);

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="h-6 w-1/2 animate-pulse rounded bg-muted"></CardTitle>
        </CardHeader>
        <CardContent className="h-16 animate-pulse rounded bg-muted"></CardContent>
      </Card>
    );
  }

  if (!activeSession) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Session Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <p className="text-muted-foreground">No active session</p>
            <p className="text-sm">
              Start a session to begin tracking your play
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Active Session</CardTitle>
          <Badge variant="destructive" className="text-xs uppercase">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Stakes
              </div>
              <div className="text-lg font-semibold">
                {activeSession.stakes}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Site
              </div>
              <div className="text-lg font-semibold">
                {activeSession.site ?? "Unknown"}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Buy-in
              </div>
              <div className="text-lg font-semibold">
                ${totalBuyIn.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="border-t pt-2">
            <div className="text-sm font-medium text-muted-foreground">
              Duration
            </div>
            <div className="mt-1 font-mono text-2xl tabular-nums">
              {duration}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
