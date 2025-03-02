"use client";

import { useEffect, useState } from "react";
import {
  getBankrollSummary,
  getRecentTransactions,
} from "~/server/actions/bankroll";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, PlusCircle } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { type BankrollTransaction } from "~/server/actions/bankroll";
import { Button } from "~/components/ui/button";
import Link from "next/link";

// Simplified interface with proper types
interface BankrollSummaryData {
  currentAmount: number;
  recentTransactions: BankrollTransaction[];
  change: number;
  isPositive: boolean;
  totalBuyIns: number;
  totalCashOuts: number;
  lifetimeProfit: number;
  totalHours: number;
}

export function BankrollSummary() {
  const [summaryData, setSummaryData] = useState<BankrollSummaryData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBankrollData() {
      try {
        // Fetch bankroll data with transactions
        const bankrollData = await getBankrollSummary();

        if (!bankrollData) {
          // Instead of setting an error, create a default zero state
          setSummaryData({
            currentAmount: 0,
            recentTransactions: [],
            change: 0,
            isPositive: true,
            totalBuyIns: 0,
            totalCashOuts: 0,
            lifetimeProfit: 0,
            totalHours: 0,
          });
          setIsLoading(false);
          return;
        }

        // Current amount as number for calculations
        const currentAmount = parseFloat(bankrollData.currentAmount);

        // Calculate all metrics from transaction data
        const transactions = bankrollData.transactions.map((tx) => ({
          ...tx,
          amount: parseFloat(tx.amount),
        }));

        // Calculate deposit and withdrawal totals
        const deposits = transactions
          .filter((tx) => tx.type === "deposit")
          .reduce((sum, tx) => sum + tx.amount, 0);

        const withdrawals = transactions
          .filter((tx) => tx.type === "withdrawal")
          .reduce((sum, tx) => sum + tx.amount, 0);

        // Check for recent transactions to calculate 7-day change
        const recentTxs = await getRecentTransactions(7);

        const recentDeposits = recentTxs
          .filter((tx) => tx.type === "deposit")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

        const recentWithdrawals = recentTxs
          .filter((tx) => tx.type === "withdrawal")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

        // Calculate 7-day change (excluding deposits/withdrawals)
        const weekAgoAmount =
          currentAmount - recentDeposits + recentWithdrawals;
        const change = currentAmount - weekAgoAmount;

        // For demo purposes, include sessions data
        // In a real implementation, you would fetch this from sessions data
        const totalHours = 120; // Placeholder until session data is implemented

        const summaryData: BankrollSummaryData = {
          currentAmount,
          recentTransactions: recentTxs,
          change,
          isPositive: change >= 0,
          totalBuyIns: deposits,
          totalCashOuts: withdrawals,
          lifetimeProfit: currentAmount - (deposits - withdrawals),
          totalHours,
        };

        setSummaryData(summaryData);
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

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Bankroll Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  // If we have summary data but it shows a zero bankroll and no transactions,
  // display a friendly empty state with a call to action
  if (
    summaryData &&
    summaryData.currentAmount === 0 &&
    summaryData.recentTransactions.length === 0
  ) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Bankroll Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="mb-4 text-muted-foreground">
              Your bankroll is currently empty. Add funds to start tracking your
              poker journey.
            </p>
            <Button asChild>
              <Link href="/bankroll/deposit">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Funds
              </Link>
            </Button>
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
              ${summaryData?.currentAmount.toFixed(2)}
            </span>
            <div
              className={`ml-4 flex items-center text-sm ${
                summaryData?.isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {summaryData?.isPositive ? (
                <ArrowUpIcon className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4" />
              )}
              ${Math.abs(summaryData?.change ?? 0).toFixed(2)} (7 days)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Total Buy-ins
              </span>
              <span className="text-lg font-medium">
                ${summaryData?.totalBuyIns.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Total Cash-outs
              </span>
              <span className="text-lg font-medium">
                ${summaryData?.totalCashOuts.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Lifetime Profit
              </span>
              <span
                className={`text-lg font-medium ${
                  (summaryData?.lifetimeProfit ?? 0) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                ${summaryData?.lifetimeProfit.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Hours</span>
              <span className="text-lg font-medium">
                {summaryData?.totalHours}h
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
