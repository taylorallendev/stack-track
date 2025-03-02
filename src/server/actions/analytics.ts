"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { sessions } from "~/server/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

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
    });

    // Calculate metrics
    const totalSessions = completedSessions.length;
    const totalBuyIn = completedSessions.reduce(
      (sum, session) => sum + Number(session.buyIn),
      0,
    );
    const totalCashOut = completedSessions.reduce(
      (sum, session) => sum + Number(session.cashOut ?? 0),
      0,
    );
    const netProfit = totalCashOut - totalBuyIn;
    const winRate = totalSessions > 0 ? netProfit / totalSessions : 0;

    // Calculate win/loss ratio
    const winningSessions = completedSessions.filter(
      (session) => (Number(session.cashOut) || 0) > Number(session.buyIn),
    ).length;
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
