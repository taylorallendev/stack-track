"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { PlusCircle, MinusCircle, Target, Play, Clock } from "lucide-react";
import { SessionStatusIndicator } from "~/components/sessions/session-status-indicator";
import type { SessionState } from "~/components/sessions/session-controls";

export function SessionControlCard() {
  // In a real app, this state would be fetched from your database or global state
  const [sessionState, setSessionState] = useState<SessionState>("inactive");
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);

  const handleQuickStart = () => {
    // In a real app, this would trigger an API call to start a session with default values
    setSessionState("active");
    setStartTime(new Date());
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Session Control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessionState === "inactive" ? (
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="flex-1" onClick={handleQuickStart}>
                <Play className="mr-2 h-4 w-4" />
                Quick Start Session
              </Button>
              <Button size="lg" className="flex-1" variant="outline" asChild>
                <Link href="/sessions/new">
                  <Clock className="mr-2 h-4 w-4" />
                  Custom Session
                </Link>
              </Button>
            </div>
          ) : (
            <SessionStatusIndicator
              sessionState={sessionState}
              startTime={startTime}
            />
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Record Deposit
            </Button>
            <Button variant="outline" size="sm">
              <MinusCircle className="mr-2 h-4 w-4" />
              Record Withdrawal
            </Button>
            <Button variant="outline" size="sm">
              <Target className="mr-2 h-4 w-4" />
              View Goals
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
