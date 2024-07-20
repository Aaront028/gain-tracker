// pages/api/workouts/route.ts
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { addWorkout } from "~/server/queries"; // Adjust the import path based on your project structure

// Define a type for the workout data
interface WorkoutData {
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
  userName: string; // Ensure this property exists
  userAvatar: string;
}

export async function POST(req: NextRequest) {
  try {
    const userId = auth().userId; // Get userId from auth

    console.log("req", req);
    // Parse the JSON body from the request
    const {
      exerciseName,
      weight,
      sets,
      reps,
      userName,
      userAvatar,
    }: WorkoutData = (await req.json()) as WorkoutData;

    // Validate the input data
    if (
      typeof exerciseName !== "string" ||
      typeof weight !== "number" ||
      typeof sets !== "number" ||
      typeof reps !== "number" ||
      typeof userName !== "string" ||
      typeof userAvatar !== "string"
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
      userId: userId!,
      userName,
      userAvatar,
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
