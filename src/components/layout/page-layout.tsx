"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "~/lib/utils";
import { ModeToggle } from "../ui/mode-toggle";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

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
  const { isSignedIn } = useAuth();

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

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center px-4 md:px-6">
          <Link
            href={isSignedIn ? "/dashboard" : "/"}
            className="flex items-center gap-2"
          >
            <span className="text-xl font-bold">StackTrack</span>
          </Link>

          {showNav && isSignedIn && (
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
            <ModeToggle />
            <SignedOut>
              <SignInButton>
                <span className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:block">
                  Log in
                </span>
              </SignInButton>
              <SignUpButton>
                <span className="text-sm font-medium transition-colors hover:text-primary">
                  Sign up
                </span>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
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
            {!isSignedIn ? (
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

export function ProtectedPageLayout(props: PageLayoutProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isSignedIn, isLoaded, router]);

  // Don't render anything until auth is loaded to prevent flash of content
  if (!isLoaded) {
    return null;
  }

  // If not signed in, we'll redirect in the useEffect
  // This prevents content flash before redirect
  if (!isSignedIn) {
    return null;
  }

  // User is authenticated, render the page layout
  return <PageLayout {...props} />;
}
