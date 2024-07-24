import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { workoutsHistory } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const GET = async (req: NextRequest) => {
  const workoutId = req.nextUrl.pathname.split("/")[3]; // Extract the workout ID from the URL

  if (!workoutId || isNaN(Number(workoutId))) {
    return new NextResponse("Invalid or missing workout ID", { status: 400 });
  }

  try {
    const history = await db
      .select()
      .from(workoutsHistory)
      .where(eq(workoutsHistory.workoutId, Number(workoutId)));

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching workout history:", error);
    return new NextResponse("Failed to fetch workout history", { status: 500 });
  }
};
