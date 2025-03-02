"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { bankroll, type bankrollTransactions } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type InferSelectModel } from "drizzle-orm";

// Define the return type using Drizzle's inference
export type BankrollTransaction = InferSelectModel<typeof bankrollTransactions>;
export type Bankroll = InferSelectModel<typeof bankroll>;
export interface BankrollWithTransactions extends Bankroll {
  transactions: BankrollTransaction[];
}

export async function getBankrollSummary(): Promise<
  BankrollWithTransactions | undefined
> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const userBankroll = await db.query.bankroll.findFirst({
      where: eq(bankroll.userId, userId),
      with: {
        transactions: {
          orderBy: (transactions, { desc }) => [desc(transactions.timestamp)],
          limit: 5,
        },
      },
    });

    return userBankroll;
  } catch (error) {
    console.error("Error fetching bankroll:", error);
    throw new Error("Failed to fetch bankroll data");
  }
}

export async function updateBankroll(
  amount: number,
  type: "deposit" | "withdrawal",
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Transaction logic here

    // Revalidate relevant paths after update
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating bankroll:", error);
    throw new Error("Failed to update bankroll");
  }
}
