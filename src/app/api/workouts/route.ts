import { type NextRequest, NextResponse } from "next/server";
import { getAllWorkoutsGroupedByUser } from "~/server/queries";

export const GET = async (req: NextRequest) => {
  try {
    const groupedWorkouts = await getAllWorkoutsGroupedByUser();

    return NextResponse.json(groupedWorkouts);
  } catch (error) {
    console.error("Error fetching grouped workouts:", error);
    return new NextResponse("Failed to fetch workouts", { status: 500 });
  }
};
