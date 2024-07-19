import { type NextRequest, NextResponse } from "next/server";
import { updateWorkout } from "~/server/queries";

interface WorkoutDataType {
  exerciseName?: string;
  weight?: number;
  sets?: number;
  reps?: number;
}

export const PUT = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return new NextResponse("ID parameter is required", { status: 400 });
    }

    const workoutData = (await req.json()) as WorkoutDataType;

    await updateWorkout(Number(id), workoutData);

    return new NextResponse("Workout updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating workout:", error);
    return new NextResponse("Failed to update workout", { status: 500 });
  }
};
