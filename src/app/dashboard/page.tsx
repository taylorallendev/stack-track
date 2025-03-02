import { BankrollSummary } from "~/components/dashboard/bankroll-summary";
import { PerformanceSnapshot } from "~/components/dashboard/performance-snapshot";
import { RecentSessions } from "~/components/dashboard/recent-sessions";
import { ProtectedPageLayout } from "~/components/layout/page-layout";

export default function DashboardPage() {
  return (
    <ProtectedPageLayout>
      {/* <SessionControlCard /> */}

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <BankrollSummary />
        <PerformanceSnapshot />
      </div>

      <div className="mb-6">
        <RecentSessions />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-6">{/* Additional widgets can go here */}</div>
      </div>
    </ProtectedPageLayout>
  );
}
