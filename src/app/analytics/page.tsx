import { AnalyticsContent } from "~/components/analytics/analytics-content";
import { ProtectedPageLayout } from "~/components/layout/page-layout";

export default function AnalyticsPage() {
  return (
    <ProtectedPageLayout>
      <AnalyticsContent />
    </ProtectedPageLayout>
  );
}
