/* eslint-disable @typescript-eslint/no-base-to-string */
"use client";

import { useEffect, useState } from "react";
import { StartSessionPanel } from "~/components/sessions/start-session-panel";
import { ActiveSessionPanel } from "~/components/sessions/active-session-panel";
import { EndSessionForm } from "~/components/sessions/end-session-form";
import { RecentSessionsQuickView } from "~/components/sessions/recent-sessions-quick-view";
import { SessionHistoryAccess } from "~/components/sessions/session-history-access";
import { SessionStatusIndicator } from "~/components/sessions/session-status-indicator";
import { createSession, endSession } from "~/server/actions/session";
import { toast } from "sonner";
import { SessionStatsSummary } from "~/components/sessions/session-stats-summary";
import { useSessionStore } from "~/store/use-session-store";

export type SessionState = "inactive" | "active" | "ending" | "loading";

export interface SessionData {
  id?: string;
  stakes: string;
  buyIn: number;
  site: string;
  siteId?: string | null;
  gameTypeId?: string | null;
  notes: string;
  startTime: Date;
  endTime?: Date;
  duration?: string;
  rebuys: Array<{ id: string; amount: number; timestamp: Date }>;
  cashOut?: number;
  profit?: number;
  hourlyRate?: number;
  status?: string;
}

function createFormData(data: Record<string, unknown>) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "object" && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  return formData;
}

export function SessionControls() {
  const [sessionState, setSessionState] = useState<SessionState>("loading");
  const {
    activeSession,
    isLoading,
    fetchActiveSession,
    clearActiveSession,
    endSession: updateSessionEndInStore,
  } = useSessionStore();

  // Fetch active session on component mount
  useEffect(() => {
    const loadActiveSession = async () => {
      try {
        await fetchActiveSession();

        if (activeSession) {
          setSessionState("active");
        } else {
          setSessionState("inactive");
        }
      } catch (error) {
        console.error("Error fetching active session:", error);
        toast.error("Failed to load active session");
        setSessionState("inactive");
      }
    };

    void loadActiveSession();
  }, [fetchActiveSession, activeSession]);

  const handleStartSession = async (data: Partial<SessionData>) => {
    setSessionState("loading");

    try {
      // Ensure required fields are present
      if (!data.stakes || typeof data.buyIn !== "number") {
        throw new Error("Stakes and buy-in amount are required");
      }

      const formData = createFormData({
        stakes: data.stakes,
        buyIn: data.buyIn,
        siteId: data.siteId,
        gameTypeId: data.gameTypeId,
        notes: data.notes,
      });

      const result = await createSession(formData);

      if (result.success) {
        // Fetch session details through the store
        await fetchActiveSession();
        setSessionState("active");
        toast.success("Session started successfully");
      } else {
        setSessionState("inactive");
        toast.error("Failed to start session");
      }
    } catch (error) {
      console.error("Error starting session:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to start session",
      );
      setSessionState("inactive");
    }
  };

  const handleEndSession = () => {
    setSessionState("ending");
  };

  const handleCancelEndSession = () => {
    setSessionState("active");
  };

  const handleFinalizeSession = async (data: {
    cashOut: number;
    notes: string;
  }) => {
    if (!activeSession?.id) {
      toast.error("No active session found");
      return;
    }

    setSessionState("loading");

    try {
      const formData = createFormData({
        sessionId: activeSession.id,
        cashOut: data.cashOut,
        notes: data.notes,
      });

      const result = await endSession(formData);

      if (result.success) {
        // Calculate profit and other metrics
        const endTime = new Date();

        const totalBuyIn =
          activeSession.buyIn +
          activeSession.rebuys.reduce((sum, rebuy) => sum + rebuy.amount, 0);
        const profit = data.cashOut - totalBuyIn;

        // Update store with ended session
        updateSessionEndInStore(data.cashOut, endTime);

        toast.success(
          `Session ended with ${profit >= 0 ? "+" : ""}${profit.toFixed(2)}`,
        );

        // Reset state for new session and clear store
        setSessionState("inactive");
        clearActiveSession();
      } else {
        setSessionState("ending");
        toast.error("Failed to end session");
      }
    } catch (error) {
      console.error("Error ending session:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to end session",
      );
      setSessionState("ending");
    }
  };

  if (sessionState === "loading" || isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-6 animate-pulse rounded-md bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SessionStatusIndicator
        sessionState={sessionState}
        startTime={
          sessionState === "active" || sessionState === "ending"
            ? activeSession?.startTime
            : undefined
        }
      />

      {sessionState === "inactive" && (
        <>
          <StartSessionPanel onStartSession={handleStartSession} />
          <SessionStatsSummary />
        </>
      )}

      {sessionState === "active" && (
        <ActiveSessionPanel onEndSession={handleEndSession} />
      )}

      {sessionState === "ending" && activeSession && (
        <EndSessionForm
          sessionData={{
            id: activeSession.id,
            stakes: activeSession.stakes,
            buyIn: activeSession.buyIn,
            site: activeSession.site ?? "Unknown",
            notes: Array.isArray(activeSession.notes)
              ? activeSession.notes.map((note) => note.content).join("\n")
              : (activeSession.notes ?? ""),
            startTime: activeSession.startTime,
            rebuys: activeSession.rebuys.map((rebuy) => ({
              id: rebuy.id ?? "",
              amount: rebuy.amount,
              timestamp: rebuy.timestamp,
            })),
          }}
          onCancel={handleCancelEndSession}
          onSubmit={handleFinalizeSession}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <RecentSessionsQuickView />
        <SessionHistoryAccess />
      </div>
    </div>
  );
}
