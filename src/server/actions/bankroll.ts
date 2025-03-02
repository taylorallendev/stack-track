"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { eq, and, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type InferSelectModel } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import {
  bankroll,
  bankrollTransactions,
  type transactionTypeEnum,
} from "../db/schema";

// Define the return type using Drizzle's inference
export type BankrollTransaction = InferSelectModel<typeof bankrollTransactions>;
export type Bankroll = InferSelectModel<typeof bankroll>;
export interface BankrollWithTransactions extends Bankroll {
  transactions: BankrollTransaction[];
}

/**
 * Fetches bankroll summary and all transactions for calculations
 */
export async function getBankrollSummary(): Promise<
  BankrollWithTransactions | undefined
> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Get bankroll with all transactions for proper calculations
    const userBankroll = await db.query.bankroll.findFirst({
      where: eq(bankroll.userId, userId),
      with: {
        transactions: {
          orderBy: (transactions, { desc }) => [desc(transactions.timestamp)],
        },
      },
    });

    return userBankroll;
  } catch (error) {
    console.error("Error fetching bankroll:", error);
    throw new Error("Failed to fetch bankroll data");
  }
}

/**
 * Initializes a new bankroll for a user (called during onboarding)
 */
export async function initializeBankroll(
  initialAmount: number,
  notes?: string,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (initialAmount < 0) {
    throw new Error("Initial amount cannot be negative");
  }

  try {
    // Check if user already has a bankroll
    const existingBankroll = await db.query.bankroll.findFirst({
      where: eq(bankroll.userId, userId),
    });

    if (existingBankroll) {
      throw new Error("User already has a bankroll initialized");
    }

    // Generate IDs
    const bankrollId = uuidv4();

    // Create new bankroll record
    await db.insert(bankroll).values({
      id: bankrollId,
      userId,
      currentAmount: initialAmount.toString(),
      lastUpdated: new Date(),
    });

    // If initial amount > 0, create initial deposit transaction
    if (initialAmount > 0) {
      await db.insert(bankrollTransactions).values({
        id: uuidv4(),
        bankrollId: bankrollId,
        type: "deposit" as (typeof transactionTypeEnum.enumValues)[number],
        amount: initialAmount.toString(),
        timestamp: new Date(),
        notes: notes ?? "Initial bankroll",
      });
    }

    // Revalidate relevant paths after creation
    revalidatePath("/dashboard");
    return { success: true, bankrollId };
  } catch (error) {
    console.error("Error initializing bankroll:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to initialize bankroll",
    );
  }
}

/**
 * Updates bankroll with a new transaction
 */
export async function updateBankroll(
  amount: number,
  type: "deposit" | "withdrawal",
  notes?: string,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  try {
    // Get user's bankroll
    const userBankroll = await db.query.bankroll.findFirst({
      where: eq(bankroll.userId, userId),
    });

    if (!userBankroll) {
      throw new Error(
        "No bankroll found for user. Please initialize your bankroll first.",
      );
    }

    // Calculate new balance based on transaction type
    const currentAmount = parseFloat(userBankroll.currentAmount);
    let newAmount: number;

    if (type === "deposit") {
      newAmount = currentAmount + amount;
    } else {
      // For withdrawals, check if sufficient funds
      if (currentAmount < amount) {
        throw new Error("Insufficient funds for withdrawal");
      }
      newAmount = currentAmount - amount;
    }

    // Update bankroll amount
    await db
      .update(bankroll)
      .set({
        currentAmount: newAmount.toString(),
        lastUpdated: new Date(),
      })
      .where(eq(bankroll.id, userBankroll.id));

    // Add transaction record
    await db.insert(bankrollTransactions).values({
      id: uuidv4(),
      bankrollId: userBankroll.id,
      type: type as (typeof transactionTypeEnum.enumValues)[number],
      amount: amount.toString(),
      timestamp: new Date(),
      notes: notes ?? null,
    });

    // Revalidate relevant paths after update
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating bankroll:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update bankroll",
    );
  }
}

/**
 * Gets transactions from the last 7 days
 */
export async function getRecentTransactions(
  days = 7,
): Promise<BankrollTransaction[]> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const userBankroll = await db.query.bankroll.findFirst({
      where: eq(bankroll.userId, userId),
    });

    if (!userBankroll) {
      return [];
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const transactions = await db.query.bankrollTransactions.findMany({
      where: and(
        eq(bankrollTransactions.bankrollId, userBankroll.id),
        gte(bankrollTransactions.timestamp, startDate),
      ),
      orderBy: (transactions, { desc }) => [desc(transactions.timestamp)],
    });

    return transactions;
  } catch (error) {
    console.error(`Error fetching transactions for last ${days} days:`, error);
    throw new Error("Failed to fetch recent transactions");
  }
}

/**
 * Checks if a user has an initialized bankroll
 * Used to determine if the user needs to go through onboarding
 */
export async function hasBankroll(): Promise<boolean> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const userBankroll = await db.query.bankroll.findFirst({
      where: eq(bankroll.userId, userId),
    });

    return !!userBankroll;
  } catch (error) {
    console.error("Error checking bankroll status:", error);
    throw new Error("Failed to check bankroll status");
  }
}
