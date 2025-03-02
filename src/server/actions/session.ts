"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { type InferSelectModel } from "drizzle-orm";
import {
  sessions,
  sessionRebuys,
  sessionNotes,
  pokerSites,
  type gameTypes,
  bankroll,
  bankrollTransactions,
} from "~/server/db/schema";

// Define the return types using Drizzle's inference
export type Session = InferSelectModel<typeof sessions>;
export type SessionRebuy = InferSelectModel<typeof sessionRebuys>;
export type SessionNote = InferSelectModel<typeof sessionNotes>;
export type PokerSite = InferSelectModel<typeof pokerSites>;
export type GameType = InferSelectModel<typeof gameTypes>;

export interface SessionWithDetails extends Omit<Session, "notes"> {
  rebuys?: SessionRebuy[];
  notes?: SessionNote[] | string | null;
  site?: PokerSite;
  gameType?: GameType;
}

// Validation schemas
const createSessionSchema = z.object({
  gameTypeId: z.string().optional(),
  siteId: z.string().optional(),
  stakes: z.string(),
  buyIn: z.coerce.number().positive(),
  notes: z.string().optional(),
});

const endSessionSchema = z.object({
  sessionId: z.string(),
  cashOut: z.coerce.number().min(0),
  notes: z.string().optional(),
});

const rebuySchema = z.object({
  sessionId: z.string(),
  amount: z.coerce.number().positive(),
  notes: z.string().optional(),
});

/**
 * Fetches active session for the current user if exists
 */
export async function getActiveSession(): Promise<SessionWithDetails | null> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const activeSession = await db.query.sessions.findFirst({
      where: and(eq(sessions.userId, userId), eq(sessions.status, "active")),
      with: {
        site: true,
        gameType: true,
      },
    });

    if (!activeSession) return null;

    // Transform the result to match SessionWithDetails interface
    return {
      ...activeSession,
      site: activeSession.site ?? undefined,
      gameType: activeSession.gameType ?? undefined,
    };
  } catch (error) {
    console.error("Error fetching active session:", error);
    throw new Error("Failed to fetch active session");
  }
}

/**
 * Fetches all poker sites from the database
 */
export async function getPokerSites(): Promise<PokerSite[]> {
  try {
    const sites = await db.query.pokerSites.findMany({
      where: eq(pokerSites.active, true),
      orderBy: (sites) => [sites.name],
    });

    return sites;
  } catch (error) {
    console.error("Error fetching poker sites:", error);
    throw new Error("Failed to fetch poker sites");
  }
}

/**
 * Fetches all game types from the database
 */
export async function getGameTypes(): Promise<GameType[]> {
  try {
    const types = await db.query.gameTypes.findMany({
      orderBy: (types) => [types.name],
    });

    return types;
  } catch (error) {
    console.error("Error fetching game types:", error);
    throw new Error("Failed to fetch game types");
  }
}

/**
 * Fetches recent completed sessions for the current user
 */
export async function getRecentSessions(
  limit = 5,
): Promise<SessionWithDetails[]> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const recentSessions = await db.query.sessions.findMany({
      where: and(eq(sessions.userId, userId), eq(sessions.status, "completed")),
      orderBy: [desc(sessions.endTime)],
      limit,
      with: {
        site: true,
        gameType: true,
      },
    });

    // Fetch rebuys and notes separately since the relation inference is failing
    const sessionsWithDetails = await Promise.all(
      recentSessions.map(async (session) => {
        const sessionRebuysData = await db.query.sessionRebuys.findMany({
          where: eq(sessionRebuys.sessionId, session.id),
        });

        const sessionNotesData = await db.query.sessionNotes.findMany({
          where: eq(sessionNotes.sessionId, session.id),
        });

        return {
          ...session,
          rebuys: sessionRebuysData,
          notes: sessionNotesData,
          site: session.site ?? undefined,
          gameType: session.gameType ?? undefined,
        };
      }),
    );

    return sessionsWithDetails;
  } catch (error) {
    console.error("Error fetching recent sessions:", error);
    throw new Error("Failed to fetch recent sessions");
  }
}

/**
 * Creates a new poker session
 */
export async function createSession(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Parse and validate form data
  const rawData = {
    gameTypeId: formData.get("gameTypeId") as string,
    siteId: formData.get("siteId") as string,
    stakes: formData.get("stakes") as string,
    buyIn: formData.get("buyIn") as string,
    notes: formData.get("notes") as string,
  };

  try {
    const validatedData = createSessionSchema.parse(rawData);
    const { gameTypeId, siteId, stakes, buyIn, notes } = validatedData;

    // Check if user already has an active session
    const activeSession = await getActiveSession();
    if (activeSession) {
      throw new Error(
        "You already have an active session. Please end it before starting a new one.",
      );
    }

    // Generate a unique ID for the session
    const sessionId = uuidv4();
    const startTime = new Date();

    // Create the session
    const newSession = await db
      .insert(sessions)
      .values({
        id: sessionId,
        userId,
        gameTypeId: gameTypeId ?? null,
        siteId: siteId ?? null,
        stakes,
        startTime,
        buyIn: buyIn.toString(),
        notes: notes ?? null,
        status: "active",
      })
      .returning();

    // Update bankroll if it exists by creating a "loss" transaction
    const userBankroll = await db.query.bankroll.findFirst({
      where: eq(bankroll.userId, userId),
    });

    if (userBankroll) {
      // Calculate new balance after buy-in
      const currentAmount = parseFloat(userBankroll.currentAmount);
      const newAmount = currentAmount - buyIn;

      if (newAmount < 0) {
        // We allow negative bankroll for tracking purposes, but let's log it
        console.warn(`User ${userId} bankroll went negative: ${newAmount}`);
      }

      // Update bankroll and add transaction
      await db.transaction(async (tx) => {
        await tx
          .update(bankroll)
          .set({
            currentAmount: newAmount.toString(),
            lastUpdated: new Date(),
          })
          .where(eq(bankroll.id, userBankroll.id));

        await tx.insert(bankrollTransactions).values({
          id: uuidv4(),
          bankrollId: userBankroll.id,
          type: "loss",
          amount: buyIn.toString(),
          timestamp: new Date(),
          notes: `Buy-in for session: ${stakes}`,
        });
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/sessions");

    return { success: true, session: newSession[0] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }

    console.error("Error creating session:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create session",
    );
  }
}

/**
 * Adds a rebuy to an active session
 */
export async function addRebuy(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Parse and validate form data
  const rawData = {
    sessionId: formData.get("sessionId") as string,
    amount: formData.get("amount") as string,
    notes: formData.get("notes") as string,
  };

  try {
    const { sessionId, amount } = rebuySchema.parse(rawData);

    // Verify the session exists and belongs to the current user
    const session = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.id, sessionId),
        eq(sessions.userId, userId),
        eq(sessions.status, "active"),
      ),
    });

    if (!session) {
      throw new Error("Active session not found");
    }

    // Add the rebuy
    const rebuyId = uuidv4();
    const newRebuy = await db
      .insert(sessionRebuys)
      .values({
        id: rebuyId,
        sessionId,
        amount: amount.toString(),
        timestamp: new Date(),
      })
      .returning();

    // Update bankroll if it exists by creating a "loss" transaction
    const userBankroll = await db.query.bankroll.findFirst({
      where: eq(bankroll.userId, userId),
    });

    if (userBankroll) {
      // Calculate new balance after rebuy
      const currentAmount = parseFloat(userBankroll.currentAmount);
      const newAmount = currentAmount - amount;

      // Update bankroll and add transaction
      await db.transaction(async (tx) => {
        await tx
          .update(bankroll)
          .set({
            currentAmount: newAmount.toString(),
            lastUpdated: new Date(),
          })
          .where(eq(bankroll.id, userBankroll.id));

        await tx.insert(bankrollTransactions).values({
          id: uuidv4(),
          bankrollId: userBankroll.id,
          type: "loss",
          amount: amount.toString(),
          timestamp: new Date(),
          notes: `Rebuy for session: ${session.stakes}`,
        });
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/sessions");

    return { success: true, rebuy: newRebuy[0] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }

    console.error("Error adding rebuy:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to add rebuy",
    );
  }
}

/**
 * Adds a note to a session
 */
export async function addSessionNote(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const sessionId = formData.get("sessionId") as string;
  const content = formData.get("content") as string;

  if (!sessionId || !content.trim()) {
    throw new Error("Session ID and note content are required");
  }

  try {
    // Verify the session exists and belongs to the current user
    const session = await db.query.sessions.findFirst({
      where: and(eq(sessions.id, sessionId), eq(sessions.userId, userId)),
    });

    if (!session) {
      throw new Error("Session not found");
    }

    // Add the note
    const noteId = uuidv4();
    const newNote = await db
      .insert(sessionNotes)
      .values({
        id: noteId,
        sessionId,
        content,
        timestamp: new Date(),
      })
      .returning();

    revalidatePath("/dashboard");
    revalidatePath("/sessions");

    return { success: true, note: newNote[0] };
  } catch (error) {
    console.error("Error adding note:", error);
    throw new Error("Failed to add note");
  }
}

/**
 * Ends an active session
 */
export async function endSession(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Parse and validate form data
  const rawData = {
    sessionId: formData.get("sessionId") as string,
    cashOut: formData.get("cashOut") as string,
    notes: formData.get("notes") as string,
  };

  try {
    const { sessionId, cashOut, notes } = endSessionSchema.parse(rawData);

    // Verify the session exists and belongs to the current user
    const session = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.id, sessionId),
        eq(sessions.userId, userId),
        eq(sessions.status, "active"),
      ),
      with: {
        rebuys: true,
      },
    });

    if (!session) {
      throw new Error("Active session not found");
    }

    const endTime = new Date();
    const updatedNotes = notes
      ? session.notes
        ? `${session.notes}\n\nEnd notes: ${notes}`
        : notes
      : session.notes;

    // Calculate profit/loss
    const buyIn = parseFloat(session.buyIn);
    const totalRebuys =
      session.rebuys?.reduce(
        (sum, rebuy) => sum + parseFloat(rebuy.amount),
        0,
      ) || 0;
    const totalInvested = buyIn + totalRebuys;
    const profit = cashOut - totalInvested;

    // Update the session
    const updatedSession = await db
      .update(sessions)
      .set({
        cashOut: cashOut.toString(),
        endTime,
        notes: updatedNotes,
        status: "completed",
      })
      .where(eq(sessions.id, sessionId))
      .returning();

    // Update bankroll if it exists by creating a "winnings" transaction
    const userBankroll = await db.query.bankroll.findFirst({
      where: eq(bankroll.userId, userId),
    });

    if (userBankroll && cashOut > 0) {
      // Calculate new balance after cash out
      const currentAmount = parseFloat(userBankroll.currentAmount);
      const newAmount = currentAmount + cashOut;

      // Update bankroll and add transaction
      await db.transaction(async (tx) => {
        await tx
          .update(bankroll)
          .set({
            currentAmount: newAmount.toString(),
            lastUpdated: new Date(),
          })
          .where(eq(bankroll.id, userBankroll.id));

        await tx.insert(bankrollTransactions).values({
          id: uuidv4(),
          bankrollId: userBankroll.id,
          type: "winnings",
          amount: cashOut.toString(),
          timestamp: new Date(),
          notes: `Cash out from session: ${session.stakes} (${profit >= 0 ? "+" : ""}${profit.toFixed(2)})`,
        });
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/sessions");

    return { success: true, session: updatedSession[0] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }

    console.error("Error ending session:", error);
    throw new Error("Failed to end session");
  }
}

/**
 * Searches sessions with filters
 */
export async function searchSessions({
  siteId,
  gameTypeId,
  dateFrom,
  dateTo,
  stakesFilter,
  profitOnly,
  limit = 20,
  offset = 0,
}: {
  siteId?: string;
  gameTypeId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  stakesFilter?: string;
  profitOnly?: boolean;
  limit?: number;
  offset?: number;
}): Promise<SessionWithDetails[]> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Build the where clause
    let whereClause = and(
      eq(sessions.userId, userId),
      eq(sessions.status, "completed"),
    );

    if (siteId) {
      whereClause = and(whereClause, eq(sessions.siteId, siteId));
    }

    if (gameTypeId) {
      whereClause = and(whereClause, eq(sessions.gameTypeId, gameTypeId));
    }

    if (dateFrom) {
      whereClause = and(whereClause, gte(sessions.startTime, dateFrom));
    }

    if (dateTo) {
      whereClause = and(whereClause, lte(sessions.endTime, dateTo));
    }

    // Fetch the sessions
    const filteredSessions = await db.query.sessions.findMany({
      where: whereClause,
      orderBy: (sessions, { desc }) => [desc(sessions.endTime)],
      limit,
      offset,
      with: {
        site: true,
        gameType: true,
        rebuys: true,
      },
    });

    // Apply additional filters that can't be done in the query
    let result = filteredSessions.map((session) => ({
      ...session,
      site: session.site ?? undefined,
      gameType: session.gameType ?? undefined,
    }));

    if (stakesFilter) {
      result = result.filter((session) =>
        session.stakes.toLowerCase().includes(stakesFilter.toLowerCase()),
      );
    }

    if (profitOnly) {
      result = result.filter((session) => {
        const buyIn = parseFloat(session.buyIn);
        const cashOut = session.cashOut ? parseFloat(session.cashOut) : 0;
        const totalRebuys =
          session.rebuys?.reduce(
            (sum, rebuy) => sum + parseFloat(rebuy.amount),
            0,
          ) || 0;
        return cashOut > buyIn + totalRebuys;
      });
    }

    return result;
  } catch (error) {
    console.error("Error searching sessions:", error);
    throw new Error("Failed to search sessions");
  }
}

/**
 * Gets session statistics for the current user
 */
export async function getSessionStats(): Promise<{
  totalSessions: number;
  totalProfit: number;
  avgProfit: number;
  winRate: number;
  biggestWin: number;
  biggestLoss: number;
  totalHours: number;
  avgSessionLength: number;
}> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Get all completed sessions for the user
    const completedSessions = await db.query.sessions.findMany({
      where: and(eq(sessions.userId, userId), eq(sessions.status, "completed")),
    });

    if (completedSessions.length === 0) {
      return {
        totalSessions: 0,
        totalProfit: 0,
        avgProfit: 0,
        winRate: 0,
        biggestWin: 0,
        biggestLoss: 0,
        totalHours: 0,
        avgSessionLength: 0,
      };
    }

    // Calculate statistics
    let totalProfit = 0;
    let winningSessionsCount = 0;
    let biggestWin = -Infinity;
    let biggestLoss = Infinity;
    let totalHours = 0;

    for (const session of completedSessions) {
      // Skip sessions without cashOut
      if (!session.cashOut) continue;

      const buyIn = parseFloat(session.buyIn);
      const cashOut = parseFloat(session.cashOut);
      const totalInvested = buyIn;
      const profit = cashOut - totalInvested;

      // Update statistics
      totalProfit += profit;

      if (profit > 0) {
        winningSessionsCount++;
      }

      if (profit > biggestWin) {
        biggestWin = profit;
      }

      if (profit < biggestLoss) {
        biggestLoss = profit;
      }

      // Calculate session duration in hours
      if (session.startTime && session.endTime) {
        const durationMs =
          new Date(session.endTime).getTime() -
          new Date(session.startTime).getTime();
        const durationHours = durationMs / (1000 * 60 * 60);
        totalHours += durationHours;
      }
    }

    // Calculate derived statistics
    const totalSessions = completedSessions.length;
    const avgProfit = totalProfit / totalSessions;
    const winRate = (winningSessionsCount / totalSessions) * 100;
    const avgSessionLength = totalHours / totalSessions;

    return {
      totalSessions,
      totalProfit,
      avgProfit,
      winRate,
      biggestWin: biggestWin === -Infinity ? 0 : biggestWin,
      biggestLoss: biggestLoss === Infinity ? 0 : biggestLoss,
      totalHours,
      avgSessionLength,
    };
  } catch (error) {
    console.error("Error fetching session statistics:", error);
    throw new Error("Failed to fetch session statistics");
  }
}
