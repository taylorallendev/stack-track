"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import {
  sessions,
  sessionRebuys,
  bankrollTransactions,
  bankroll,
} from "~/server/db/schema";

export interface DashboardStats {
  totalSessions: number;
  winRate: number;
  biggestWin: number;
  longestSession: number;
  profitLoss: number;
  averageProfit: number;
  winningPercentage: number;
  totalHoursPlayed: number;
  lastMonthProfit: number;
}

export async function getPerformanceMetrics(
  timeframe: "week" | "month" | "year" = "month",
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Calculate date range based on timeframe
  const now = new Date();
  const startDate = new Date();

  if (timeframe === "week") {
    startDate.setDate(now.getDate() - 7);
  } else if (timeframe === "month") {
    startDate.setMonth(now.getMonth() - 1);
  } else if (timeframe === "year") {
    startDate.setFullYear(now.getFullYear() - 1);
  }

  try {
    // Get completed sessions in the timeframe
    const completedSessions = await db.query.sessions.findMany({
      where: and(
        eq(sessions.userId, userId),
        eq(sessions.status, "completed"),
        gte(sessions.startTime, startDate),
        lte(sessions.endTime, now),
      ),
      with: {
        rebuys: true,
      },
    });

    // Calculate metrics
    const totalSessions = completedSessions.length;

    // Include rebuys in the calculation
    let totalBuyIn = 0;
    for (const session of completedSessions) {
      const sessionBuyIn = Number(session.buyIn);
      const rebuyTotal =
        session.rebuys?.reduce((sum, rebuy) => sum + Number(rebuy.amount), 0) ||
        0;
      totalBuyIn += sessionBuyIn + rebuyTotal;
    }

    const totalCashOut = completedSessions.reduce(
      (sum, session) => sum + Number(session.cashOut ?? 0),
      0,
    );
    const netProfit = totalCashOut - totalBuyIn;
    const winRate = totalSessions > 0 ? netProfit / totalSessions : 0;

    // Calculate win/loss ratio with rebuys included
    const winningSessions = completedSessions.filter((session) => {
      const totalInvested =
        Number(session.buyIn) +
        (session.rebuys?.reduce(
          (sum, rebuy) => sum + Number(rebuy.amount),
          0,
        ) || 0);
      return (Number(session.cashOut) || 0) > totalInvested;
    }).length;

    const losingSessions = totalSessions - winningSessions;

    return {
      totalSessions,
      netProfit,
      winRate,
      winningSessions,
      losingSessions,
      winLossRatio:
        losingSessions > 0 ? winningSessions / losingSessions : winningSessions,
    };
  } catch (error) {
    console.error("Error calculating performance metrics:", error);
    throw new Error("Failed to calculate performance metrics");
  }
}

/**
 * Fetches summary stats for the dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Get total number of completed sessions
    const sessionsCountResult = await db
      .select({ count: count() })
      .from(sessions)
      .where(
        and(eq(sessions.userId, userId), eq(sessions.status, "completed")),
      );

    const totalSessions = sessionsCountResult[0]?.count ?? 0;

    // Get winning sessions
    const winningSessionsResult = await db
      .select({ count: count() })
      .from(sessions)
      .where(
        and(
          eq(sessions.userId, userId),
          eq(sessions.status, "completed"),
          sql`CAST(${sessions.cashOut} AS DECIMAL) > (CAST(${sessions.buyIn} AS DECIMAL) + COALESCE((
          SELECT SUM(CAST(amount AS DECIMAL))
          FROM ${sessionRebuys}
          WHERE ${sessionRebuys.sessionId} = ${sessions.id}
        ), 0))`,
        ),
      );

    const winningPercentage =
      totalSessions > 0
        ? ((winningSessionsResult[0]?.count ?? 0) / totalSessions) * 100
        : 0;

    // Get total profit/loss across all sessions
    const profitResult = await db.execute(sql`
      SELECT 
        COALESCE(SUM(
          CASE 
            WHEN ${sessions.cashOut} IS NOT NULL THEN 
              CAST(${sessions.cashOut} AS DECIMAL) - (
                CAST(${sessions.buyIn} AS DECIMAL) + 
                COALESCE((
                  SELECT SUM(CAST(amount AS DECIMAL))
                  FROM ${sessionRebuys}
                  WHERE ${sessionRebuys.sessionId} = ${sessions.id}
                ), 0)
              )
            ELSE 0
          END
        ), 0) AS total_profit
      FROM ${sessions}
      WHERE ${sessions.userId} = ${userId} AND ${sessions.status} = ${"completed"}
    `);

    const profitLoss = Number(profitResult.rows[0]?.total_profit ?? 0);

    // Calculate average profit per session
    const averageProfit = totalSessions > 0 ? profitLoss / totalSessions : 0;

    // Get total hours played
    const hoursPlayedResult = await db.execute(sql`
      SELECT 
        COALESCE(SUM(
          EXTRACT(EPOCH FROM (${sessions.endTime} - ${sessions.startTime})) / 3600
        ), 0) AS total_hours
      FROM ${sessions}
      WHERE ${sessions.userId} = ${userId} AND ${sessions.status} = ${"completed"}
    `);

    const totalHoursPlayed = Number(
      hoursPlayedResult.rows[0]?.total_hours ?? 0,
    );

    // Calculate win rate (profit per hour)
    const winRate = totalHoursPlayed > 0 ? profitLoss / totalHoursPlayed : 0;

    // Get biggest win in a single session
    const biggestWinResult = await db.execute(sql`
      SELECT 
        MAX(
          CAST(${sessions.cashOut} AS DECIMAL) - (
            CAST(${sessions.buyIn} AS DECIMAL) + 
            COALESCE((
              SELECT SUM(CAST(amount AS DECIMAL))
              FROM ${sessionRebuys}
              WHERE ${sessionRebuys.sessionId} = ${sessions.id}
            ), 0)
          )
        ) AS biggest_win
      FROM ${sessions}
      WHERE 
        ${sessions.userId} = ${userId} AND 
        ${sessions.status} = ${"completed"} AND
        ${sessions.cashOut} IS NOT NULL
    `);

    const biggestWin = Number(biggestWinResult.rows[0]?.biggest_win ?? 0);

    // Get longest session duration in hours
    const longestSessionResult = await db.execute(sql`
      SELECT 
        MAX(EXTRACT(EPOCH FROM (${sessions.endTime} - ${sessions.startTime})) / 3600) AS longest_session
      FROM ${sessions}
      WHERE ${sessions.userId} = ${userId} AND ${sessions.status} = ${"completed"}
    `);

    const longestSession = Number(
      longestSessionResult.rows[0]?.longest_session ?? 0,
    );

    // Get last month's profit
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthProfitResult = await db.execute(sql`
      SELECT 
        COALESCE(SUM(
          CASE 
            WHEN ${sessions.cashOut} IS NOT NULL THEN 
              CAST(${sessions.cashOut} AS DECIMAL) - (
                CAST(${sessions.buyIn} AS DECIMAL) + 
                COALESCE((
                  SELECT SUM(CAST(amount AS DECIMAL))
                  FROM ${sessionRebuys}
                  WHERE ${sessionRebuys.sessionId} = ${sessions.id}
                ), 0)
              )
            ELSE 0
          END
        ), 0) AS month_profit
      FROM ${sessions}
      WHERE 
        ${sessions.userId} = ${userId} AND 
        ${sessions.status} = ${"completed"} AND
        ${sessions.endTime} >= ${oneMonthAgo}
    `);

    const lastMonthProfit = Number(
      lastMonthProfitResult.rows[0]?.month_profit ?? 0,
    );

    return {
      totalSessions,
      winRate,
      biggestWin,
      longestSession,
      profitLoss,
      averageProfit,
      winningPercentage,
      totalHoursPlayed,
      lastMonthProfit,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard stats");
  }
}

/**
 * Fetches bankroll growth data for charts
 */
export async function getBankrollGrowthData() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Get user's bankroll
    const userBankroll = await db.query.bankroll.findFirst({
      where: eq(bankroll.userId, userId),
    });

    if (!userBankroll) {
      return { data: [] };
    }

    // Get bankroll transaction history
    const transactions = await db
      .select({
        id: bankrollTransactions.id,
        type: bankrollTransactions.type,
        amount: bankrollTransactions.amount,
        timestamp: bankrollTransactions.timestamp,
        notes: bankrollTransactions.notes,
      })
      .from(bankrollTransactions)
      .where(eq(bankrollTransactions.bankrollId, userBankroll.id))
      .orderBy(bankrollTransactions.timestamp);

    // Process data for chart
    let currentBalance = 0;
    const chartData = transactions.map((tx) => {
      if (tx.type === "deposit" || tx.type === "winnings") {
        currentBalance += Number(tx.amount);
      } else if (tx.type === "withdrawal" || tx.type === "loss") {
        currentBalance -= Number(tx.amount);
      }

      return {
        date: tx.timestamp,
        balance: currentBalance,
        type: tx.type,
        amount: Number(tx.amount),
        notes: tx.notes,
      };
    });

    return { data: chartData };
  } catch (error) {
    console.error("Error fetching bankroll growth data:", error);
    throw new Error("Failed to fetch bankroll growth data");
  }
}

/**
 * Fetches session performance metrics
 */
export async function getSessionPerformanceMetrics(days = 90) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Get session data
    const sessionsData = await db
      .select({
        id: sessions.id,
        startTime: sessions.startTime,
        endTime: sessions.endTime,
        buyIn: sessions.buyIn,
        cashOut: sessions.cashOut,
        stakes: sessions.stakes,
      })
      .from(sessions)
      .where(
        and(
          eq(sessions.userId, userId),
          eq(sessions.status, "completed"),
          gte(sessions.endTime, cutoffDate),
        ),
      )
      .orderBy(sessions.endTime);

    // Fetch rebuys for these sessions
    const sessionIds = sessionsData.map((session) => session.id);

    if (sessionIds.length === 0) {
      return { data: [] };
    }

    const rebuysData = await db
      .select({
        sessionId: sessionRebuys.sessionId,
        amount: sessionRebuys.amount,
      })
      .from(sessionRebuys)
      .where(sql`${sessionRebuys.sessionId} IN (${sessionIds.join(",")})`);

    // Group rebuys by session
    const rebuysBySession = rebuysData.reduce(
      (acc, rebuy) => {
        if (!acc[rebuy.sessionId]) {
          acc[rebuy.sessionId] = [];
        }
        acc[rebuy.sessionId]!.push(Number(rebuy.amount));
        return acc;
      },
      {} as Record<string, number[]>,
    );

    // Calculate metrics
    const sessionsWithMetrics = sessionsData.map((session) => {
      const sessionRebuys = rebuysBySession[session.id] ?? [];
      const totalRebuyAmount = sessionRebuys.reduce(
        (sum, amount) => sum + amount,
        0,
      );
      const totalBuyIn = Number(session.buyIn) + totalRebuyAmount;
      const cashOut = session.cashOut ? Number(session.cashOut) : 0;
      const profit = cashOut - totalBuyIn;

      const durationMs =
        session.endTime && session.startTime
          ? new Date(session.endTime).getTime() -
            new Date(session.startTime).getTime()
          : 0;
      const durationHours = durationMs / (1000 * 60 * 60);

      const hourlyRate = durationHours > 0 ? profit / durationHours : 0;

      return {
        id: session.id,
        date: session.endTime ?? session.startTime ?? new Date(),
        stakes: session.stakes,
        buyIn: totalBuyIn,
        cashOut: cashOut,
        profit: profit,
        durationHours: durationHours,
        hourlyRate: hourlyRate,
      };
    });

    return { data: sessionsWithMetrics };
  } catch (error) {
    console.error("Error fetching session performance metrics:", error);
    throw new Error("Failed to fetch session performance metrics");
  }
}
