"use client";

import { useEffect, useState } from "react";
import { getBankrollSummary } from "~/server/actions/bankroll";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { type BankrollWithTransactions } from "~/server/actions/bankroll";

// Extend the inferred type with calculated fields
interface BankrollData
  extends Omit<BankrollWithTransactions, "currentAmount" | "transactions"> {
  currentAmount: number;
  transactions: Array<
    Omit<BankrollWithTransactions["transactions"][number], "amount"> & {
      amount: number;
    }
  >;
  // Calculated fields that will be added in the component
  change?: number;
  isPositive?: boolean;
  totalBuyIns?: number;
  totalCashOuts?: number;
  lifetimeProfit?: number;
  totalHours?: number;
}

export function BankrollSummary() {
  const [bankrollData, setBankrollData] = useState<BankrollData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBankrollData() {
      try {
        const data = await getBankrollSummary();

        if (!data) {
          setError("No bankroll data found");
          setIsLoading(false);
          return;
        }

        // Calculate additional metrics based on the raw data
        const processedData: BankrollData = {
          ...data,
          id: data.id,
          userId: data.userId,
          currentAmount: parseFloat(data.currentAmount),
          // Convert transaction amounts from string to number
          transactions: data.transactions.map((transaction) => ({
            ...transaction,
            amount: parseFloat(transaction.amount),
          })),
          // Calculate 7-day change (this is a placeholder - implement actual calculation)
          change: 250.75, // Example value
          isPositive: true, // Example value
          // Calculate totals (these are placeholders - implement actual calculations)
          totalBuyIns: 5000.0, // Example value
          totalCashOuts: 6250.75, // Example value
          lifetimeProfit: 1250.75, // Example value
          totalHours: 120, // Example value
        };

        setBankrollData(processedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadBankrollData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Bankroll Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6">
            <div className="flex items-baseline">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="ml-4 h-6 w-24" />
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="mb-2 h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !bankrollData) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Bankroll Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            {error ?? "Failed to load bankroll data"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Bankroll Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">
              ${bankrollData.currentAmount.toFixed(2)}
            </span>
            <div
              className={`ml-4 flex items-center text-sm ${bankrollData.isPositive ? "text-green-500" : "text-red-500"}`}
            >
              {bankrollData.isPositive ? (
                <ArrowUpIcon className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4" />
              )}
              ${bankrollData.change?.toFixed(2)} (7 days)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Total Buy-ins
              </span>
              <span className="text-lg font-medium">
                ${bankrollData.totalBuyIns?.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Total Cash-outs
              </span>
              <span className="text-lg font-medium">
                ${bankrollData.totalCashOuts?.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Lifetime Profit
              </span>
              <span
                className={`text-lg font-medium ${(bankrollData.lifetimeProfit ?? 0) >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                ${bankrollData.lifetimeProfit?.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Hours</span>
              <span className="text-lg font-medium">
                {bankrollData.totalHours}h
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
