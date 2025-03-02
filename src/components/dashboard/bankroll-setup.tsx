"use client";

import { useState } from "react";
import {
  ArrowRight,
  DollarSign,
  LineChart,
  Wallet,
  BarChart3,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { initializeBankroll } from "~/server/actions/bankroll";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";

export function BankrollSetup() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSetupComplete = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) < 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      await initializeBankroll(parseFloat(amount), notes);
      toast.success("Bankroll initialized successfully");
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to initialize bankroll",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="group w-full border-2 border-dashed border-primary/20 bg-card shadow-lg transition duration-500 hover:bg-muted/50 hover:duration-200">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-2xl font-bold">
          Welcome to Stack Track
        </CardTitle>
        <CardDescription>
          Track your poker journey and maximize your profits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 py-6">
        <div className="isolate flex justify-center">
          <div className="relative left-2.5 top-1.5 grid size-14 -rotate-6 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:-translate-x-5 group-hover:-translate-y-0.5 group-hover:-rotate-12 group-hover:duration-200">
            <LineChart className="h-7 w-7 text-primary" />
          </div>
          <div className="relative z-10 grid size-14 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:-translate-y-1 group-hover:duration-200">
            <Wallet className="h-7 w-7 text-primary" />
          </div>
          <div className="relative right-2.5 top-1.5 grid size-14 rotate-6 place-items-center rounded-xl bg-background shadow-lg ring-1 ring-border transition duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-5 group-hover:rotate-12 group-hover:duration-200">
            <BarChart3 className="h-7 w-7 text-primary" />
          </div>
        </div>

        <div className="mx-auto max-w-md space-y-4 text-center">
          <p className="text-muted-foreground">
            Track your poker performance, manage your bankroll, and gain
            insights to improve your game.
          </p>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="mt-4 w-full shadow-sm active:shadow-none"
                size="lg"
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Setup Your Bankroll
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Set Your Initial Bankroll</DialogTitle>
                <DialogDescription>
                  Enter the current amount in your poker bankroll to start
                  tracking your progress.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Initial Amount ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="amount"
                      className="pl-10"
                      placeholder="1000.00"
                      type="number"
                      step="0.01"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any notes about your initial bankroll..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleSetupComplete}
                  disabled={isLoading}
                  className={cn(
                    "shadow-sm active:shadow-none",
                    isLoading && "opacity-70",
                  )}
                >
                  {isLoading ? "Initializing..." : "Start Tracking"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border/50 bg-muted/20 px-6 py-4 text-center">
        <p className="mx-auto text-sm text-muted-foreground">
          Setting up your bankroll is the first step to becoming a more
          profitable poker player.
        </p>
      </CardFooter>
    </Card>
  );
}
