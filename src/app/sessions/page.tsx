import { SessionControls } from "~/components/sessions/session-controls";
import { ProtectedPageLayout } from "~/components/layout/page-layout";

export default function SessionsPage() {
  return (
    <ProtectedPageLayout>
      <main className="container mx-auto flex-1 space-y-6 p-4 md:p-6">
        <h1 className="text-3xl font-bold tracking-tight">Session Controls</h1>
        <SessionControls />
      </main>
    </ProtectedPageLayout>
  );
}
