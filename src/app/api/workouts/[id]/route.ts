import { type NextRequest, NextResponse } from "next/server";
import {
  deleteWorkout,
  toggleWorkoutVisibility,
  updateWorkout,
} from "~/server/queries";

interface WorkoutDataType {
  exerciseName?: string;
  weight?: number;
  sets?: number;
  reps?: number;
  show_workout?: boolean;
}

// export const PUT = async (req: NextRequest) => {
//   try {
//     console.log("i'm in the updateworking function");
//     const url = new URL(req.url);
//     const id = url.pathname.split("/").pop();

//     if (!id) {
//       return new NextResponse("ID parameter is required", { status: 400 });
//     }

//     const workoutData = (await req.json()) as WorkoutDataType;

//     await updateWorkout(Number(id), workoutData);

//     return new NextResponse("Workout updated successfully", { status: 200 });
//   } catch (error) {
//     console.error("Error updating workout:", error);
//     return new NextResponse("Failed to update workout", { status: 500 });
//   }
// };
export const PUT = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return new NextResponse("ID parameter is required", { status: 400 });
    }

    const workoutData = (await req.json()) as Partial<WorkoutDataType>;

    if (
      "show_workout" in workoutData &&
      Object.keys(workoutData).length === 1
    ) {
      // Ensure show_workout is a boolean
      const showWorkout = !!workoutData.show_workout;
      await toggleWorkoutVisibility(Number(id), showWorkout);
    } else {
      // Handle general update
      await updateWorkout(Number(id), workoutData);
    }

    return new NextResponse("Workout updated successfully", { status: 200 });
  } catch (error) {
    console.error("Error updating workout:", error);
    return new NextResponse("Failed to update workout", { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return new NextResponse("ID parameter is required", { status: 400 });
    }

    await deleteWorkout(Number(id));

    return new NextResponse("Workout deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting workout:", error);
    return new NextResponse("Failed to delete workout", { status: 500 });
  }
};
