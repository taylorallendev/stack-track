"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { sessions } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for session creation
const createSessionSchema = z.object({
  gameTypeId: z.string(),
  siteId: z.string(),
  stakes: z.string(),
  buyIn: z.coerce.number(),
  notes: z.string().optional(),
});

export async function getRecentSessions(limit = 5) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const recentSessions = await db.query.sessions.findMany({
      where: eq(sessions.userId, userId),
      orderBy: [desc(sessions.startTime)],
      limit,
      with: {
        gameType: true,
        site: true,
      },
    });

    return recentSessions;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    throw new Error("Failed to fetch recent sessions");
  }
}

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

    // Generate a unique ID for the session
    const id = crypto.randomUUID();

    const { gameTypeId, siteId, stakes, buyIn } = validatedData;

    const newSession = await db
      .insert(sessions)
      .values({
        id,
        userId,
        gameTypeId,
        siteId,
        stakes,
        startTime: new Date(),
        buyIn: buyIn.toString(),
      })
      .returning();

    revalidatePath("/dashboard");
    return { success: true, session: newSession[0] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }

    console.error("Error creating session:", error);
    throw new Error("Failed to create session");
  }
}

export async function endSession(sessionId: string, cashOut: number) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Update session to completed status
    await db
      .update(sessions)
      .set({
        status: "completed",
        endTime: new Date(),
        cashOut: cashOut.toString(),
      })
      .where(eq(sessions.id, sessionId));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error ending session:", error);
    throw new Error("Failed to end session");
  }
}
