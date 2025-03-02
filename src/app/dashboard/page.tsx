"use client";

import { useEffect, useState } from "react";
import { BankrollSummary } from "~/components/dashboard/bankroll-summary";
import { PerformanceSnapshot } from "~/components/dashboard/performance-snapshot";
import { RecentSessions } from "~/components/dashboard/recent-sessions";
import { ActionButtons } from "~/components/dashboard/action-buttons";
import { ProtectedPageLayout } from "~/components/layout/page-layout";
import { hasBankroll } from "~/server/actions/bankroll";
import { BankrollSetup } from "~/components/dashboard/bankroll-setup";
import { SessionStatusWidget } from "~/components/dashboard/session-status-widget";

export default function DashboardPage() {
  const [isBankrollInitialized, setIsBankrollInitialized] = useState<
    boolean | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkBankrollStatus() {
      try {
        const hasInitializedBankroll = await hasBankroll();
        setIsBankrollInitialized(hasInitializedBankroll);
      } catch (error) {
        console.error("Error checking bankroll status:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void checkBankrollStatus();
  }, []);

  return (
    <ProtectedPageLayout>
      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      ) : (
        <>
          {isBankrollInitialized ? (
            <>
              <div className="mb-6">
                <ActionButtons needsBankrollSetup={false} />
              </div>
              <div className="mb-6 grid gap-6 md:grid-cols-2">
                <BankrollSummary />
                <PerformanceSnapshot />
              </div>
            </>
          ) : (
            <div className="mb-6">
              <BankrollSetup />
            </div>
          )}

          <div className="mb-6">
            <RecentSessions />
          </div>

          {isBankrollInitialized && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-6">
                <SessionStatusWidget />
                {/* Additional widgets can go here */}
              </div>
            </div>
          )}
        </>
      )}
    </ProtectedPageLayout>
  );
}
