import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { workoutsHistory } from "~/server/db/schema";
import { eq, gt, and, desc } from "drizzle-orm";

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  const workoutId = params.id;

  if (!workoutId || isNaN(Number(workoutId))) {
    return new NextResponse("Invalid or missing workout ID", { status: 400 });
  }

  try {
    const fourWeeksAgo = new Date(Date.now() - 4 * 7 * 24 * 60 * 60 * 1000);

    const history = await db
      .select()
      .from(workoutsHistory)
      .where(
        and(
          eq(workoutsHistory.workoutId, Number(workoutId)),
          gt(workoutsHistory.createdAt, fourWeeksAgo),
        ),
      )
      .orderBy(desc(workoutsHistory.createdAt));

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching workout history:", error);
    return new NextResponse("Failed to fetch workout history", { status: 500 });
  }
};
