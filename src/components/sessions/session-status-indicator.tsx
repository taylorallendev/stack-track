"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import type { SessionState } from "~/components/sessions/session-controls";
import { formatDuration } from "~/lib/format-duration";
import { useSessionStore } from "~/store/use-session-store";

interface SessionStatusIndicatorProps {
  sessionState: SessionState;
  startTime?: Date;
  onEndSession?: () => void;
}

export function SessionStatusIndicator({
  sessionState,
  startTime,
  onEndSession,
}: SessionStatusIndicatorProps) {
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const { activeSession } = useSessionStore();

  // Use startTime from props or from the activeSession in the store
  const sessionStartTime = startTime ?? activeSession?.startTime;

  useEffect(() => {
    if (sessionState === "inactive" || !sessionStartTime) {
      setElapsedTime("00:00:00");
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const elapsed = now.getTime() - sessionStartTime.getTime();
      setElapsedTime(formatDuration(elapsed));
    };

    // Update immediately
    updateTimer();

    // Then update every second
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [sessionState, sessionStartTime]);

  return (
    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <div className="text-center md:text-left">
        <h2 className="text-xl font-semibold">
          {sessionState === "inactive" && "No Active Session"}
          {sessionState === "active" && "Session In Progress"}
          {sessionState === "ending" && "Ending Session"}
        </h2>
        {(sessionState === "active" || sessionState === "ending") &&
          sessionStartTime && (
            <p className="text-muted-foreground">
              Started at{" "}
              {sessionStartTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
      </div>

      {(sessionState === "active" || sessionState === "ending") && (
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="font-mono text-3xl tabular-nums">{elapsedTime}</div>
            <p className="text-sm text-muted-foreground">Session Duration</p>
          </div>

          {sessionState === "active" && onEndSession && (
            <Button variant="destructive" onClick={onEndSession}>
              End Session
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
