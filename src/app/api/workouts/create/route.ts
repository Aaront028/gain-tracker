import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { addWorkout } from "~/server/queries"; // Adjust the import path based on your project structure

// Define a type for the workout data
interface WorkoutData {
  exerciseId: number;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
  userName: string;
  userAvatar: string;
}

export async function POST(req: NextRequest) {
  try {
    const userId = auth().userId; // Get userId from auth

    // Parse the JSON body from the request
    const {
      exerciseId,
      exerciseName,
      weight,
      sets,
      reps,
      userName,
      userAvatar,
    }: WorkoutData = (await req.json()) as WorkoutData;

    console.log("Parsed Data:", {
      exerciseId,
      exerciseName,
      weight,
      sets,
      reps,
      userName,
      userAvatar,
    });

    // Validate the input data
    if (
      typeof exerciseId !== "number" ||
      typeof exerciseName !== "string" ||
      typeof weight !== "number" ||
      typeof sets !== "number" ||
      typeof reps !== "number" ||
      typeof userName !== "string" ||
      typeof userAvatar !== "string"
    ) {
      console.log("Validation Failed");
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 },
      );
    }

    console.log("Data is valid");

    // Call the function to add the workout to the database
    const newWorkout = await addWorkout({
      exerciseId,
      exerciseName,
      weight,
      sets,
      reps,
      userId: userId!,
      userName,
      userAvatar,
    });

    console.log("New Workout:", newWorkout);

    // Return a success response
    return NextResponse.json(newWorkout, { status: 201 });
  } catch (error) {
    console.error("Error adding workout:", error);
    return NextResponse.json(
      { error: "Failed to add workout" },
      { status: 500 },
    );
  }
}
