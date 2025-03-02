import { useEffect } from "react";
import { toast } from "sonner";
import { useSessionStore } from "~/store/use-session-store";

/**
 * A hook that provides access to the active session with automatic fetching.
 *
 * This hook can be used in any component that needs access to the current
 * active session data.
 */
export function useActiveSession() {
  const { activeSession, isLoading, fetchActiveSession } = useSessionStore();

  useEffect(() => {
    // Fetch active session on component mount
    const loadActiveSession = async () => {
      try {
        await fetchActiveSession();
      } catch (error) {
        console.error("Error fetching active session:", error);
        toast.error("Failed to load active session");
      }
    };

    void loadActiveSession();
  }, [fetchActiveSession]);

  // Calculate total buy-in if we have an active session
  const totalBuyIn = activeSession
    ? activeSession.buyIn +
      activeSession.rebuys.reduce((sum, rebuy) => sum + rebuy.amount, 0)
    : 0;

  return {
    isLoading,
    activeSession,
    hasActiveSession: !!activeSession,
    totalBuyIn,
    // Calculate session duration in milliseconds
    durationMs: activeSession
      ? new Date().getTime() - activeSession.startTime.getTime()
      : 0,
  };
}
