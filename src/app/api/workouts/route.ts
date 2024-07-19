// pages/api/workouts/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { addWorkout } from "~/server/queries"; // Adjust the import path based on your project structure

// Define a type for the workout data
interface WorkoutData {
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
}

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body from the request
    const { exerciseName, weight, sets, reps }: WorkoutData =
      (await req.json()) as WorkoutData;

    // Validate the input data
    if (
      typeof exerciseName !== "string" ||
      typeof weight !== "number" ||
      typeof sets !== "number" ||
      typeof reps !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 },
      );
    }

    // Call the function to add the workout to the database
    const newWorkout = await addWorkout({
      exerciseName,
      weight,
      sets,
      reps,
      userId: "",
    });

    // Return a success response
    return NextResponse.json(newWorkout, { status: 201 });
  } catch (error) {
    // Handle errors and return a failure response
    console.error("Error adding workout:", error);
    return NextResponse.json(
      { error: "Failed to add workout" },
      { status: 500 },
    );
  }
}
