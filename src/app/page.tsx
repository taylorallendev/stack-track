"use client";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { BarChart3, Clock, LineChart } from "lucide-react";
import Hero from "~/components/dashboard/hero/hero";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="md:pb-18 relative pb-12 pt-0 lg:pb-24">
        <Hero />
      </section>

      {/* Features Section */}
      <section id="features" className="md:py-18 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="p-4.5 flex flex-col items-center gap-2 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="p-2.25 rounded-full bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Track Performance</h3>
            <p className="text-center text-muted-foreground">
              Record session results, analyze win rates, and track your progress
              over time.
            </p>
          </div>

          <div className="p-4.5 flex flex-col items-center gap-2 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="p-2.25 rounded-full bg-primary/10">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Bankroll Management</h3>
            <p className="text-center text-muted-foreground">
              Monitor your bankroll growth, track deposits and withdrawals, and
              set financial goals.
            </p>
          </div>

          <div className="p-4.5 flex flex-col items-center gap-2 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="p-2.25 rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Session Insights</h3>
            <p className="text-center text-muted-foreground">
              Get detailed insights about your playing habits, optimal session
              length, and best performing sites.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="md:py-18 -mx-4 bg-muted px-4 py-12 md:-mx-6 md:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to improve your poker game?
          </h2>
          <p className="max-w-[42rem] text-muted-foreground sm:text-xl">
            Join thousands of players who are tracking their way to success.
          </p>
          <Button asChild size="lg">
            <Link href="/signup">Start Tracking Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
