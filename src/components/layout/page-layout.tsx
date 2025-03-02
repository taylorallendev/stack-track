"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserNav } from "~/components/dashboard/user-nav";
import { cn } from "~/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
  className?: string;
}

export function PageLayout({
  children,
  showNav = true,
  showFooter = true,
  className,
}: PageLayoutProps) {
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/sessions",
      label: "Sessions",
      active: pathname === "/sessions",
    },
    {
      href: "/analytics",
      label: "Analytics",
      active: pathname === "/analytics",
    },
  ];

  // Check if we're on the landing page
  const isLandingPage = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center px-4 md:px-6">
          <Link
            href={isLandingPage ? "/" : "/dashboard"}
            className="flex items-center gap-2"
          >
            <span className="text-xl font-bold">StackTrack</span>
          </Link>

          {showNav && (
            <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    route.active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="ml-auto flex items-center space-x-4">
            {isLandingPage ? (
              <>
                <Link
                  href="/login"
                  className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:block"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <UserNav />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn("flex-1 py-6 md:py-8", className)}>
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="mt-auto border-t py-4">
          <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
            {isLandingPage ? (
              <>
                <p className="text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} StackTrack. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Terms
                  </Link>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Privacy
                  </Link>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="text-center text-sm text-muted-foreground">
                  Total Sessions: 42
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  StackTrack v1.0.0
                </p>
              </>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
