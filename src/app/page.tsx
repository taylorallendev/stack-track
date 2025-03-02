import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRight, BarChart3, Clock, LineChart } from "lucide-react";
import { PageLayout } from "~/components/layout/page-layout";

export default function HomePage() {
  return (
    <PageLayout showNav={false}>
      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Track your poker sessions with{" "}
            <span className="text-primary">precision</span>
          </h1>
          <p className="max-w-[42rem] text-muted-foreground sm:text-xl">
            Analyze your performance, track your bankroll, and improve your game
            with detailed statistics and insights.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="rounded-full bg-primary/10 p-3">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Track Performance</h3>
            <p className="text-center text-muted-foreground">
              Record session results, analyze win rates, and track your progress
              over time.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="rounded-full bg-primary/10 p-3">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Bankroll Management</h3>
            <p className="text-center text-muted-foreground">
              Monitor your bankroll growth, track deposits and withdrawals, and
              set financial goals.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="rounded-full bg-primary/10 p-3">
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
      <section className="-mx-4 bg-muted px-4 py-16 md:-mx-6 md:px-6 md:py-24">
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
    </PageLayout>
  );
}
