import Link from "next/link";
import { UserNav } from "~/components/dashboard/user-nav";
import { MainNav } from "~/components/dashboard/main-nav";
import { ModeToggle } from "~/components/ui/mode-toggle";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="hidden text-xl font-bold md:inline-block">
            StackTrack
          </span>
        </Link>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
