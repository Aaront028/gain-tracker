import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { images, users, workouts, workoutsHistory } from "./db/schema";
import { and, eq } from "drizzle-orm";

export async function getMyImages() {
  const user = auth();

  // if (!user.userId) throw new Error("Unauthorized");

  const images = await db.query.images.findMany({
    // where: (model, {eq}) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.id),
  });
  return images;
}

export async function getImage(id: number) {
  const user = auth();

  // if (!user.userId) throw new Error("Unauthorized");

  const image = await db.query.images.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!image) throw new Error("Image not found");

  // if (image.userId !== user.userId) throw new Error("Unauthorized");

  return image;
}

export async function deleteImage(id: number) {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  await db
    .delete(images)
    .where(and(eq(images.id, id), eq(images.userId, user.userId)));

  redirect("/");
}

type NewWorkout = typeof workouts.$inferInsert;

export async function addWorkout(workout: NewWorkout) {
  const user = auth();

  console.log("user", user);

  if (!user.userId) throw new Error("Unauthorized");

  // Ensure that userId and other required fields are included
  const newWorkout = await db.insert(workouts).values({
    ...workout,
    userId: user.userId,
  });

  return newWorkout;
}

type UpdateWorkoutData = {
  exerciseName?: string;
  weight?: number;
  sets?: number;
  reps?: number;
};

export async function updateWorkout(id: number, data: UpdateWorkoutData) {
  console.log("i'm in the updateworking function");
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  const updatedWorkout = await db
    .update(workouts)
    .set(data)
    .where(eq(workouts.id, id))
    .returning();

  return updatedWorkout;
}

// export async function deleteWorkout(id: number) {
//   const deletedWorkout = await db.delete(workouts)
//     .where(eq(workouts.id, id))
//     .returning();

//   return deletedWorkout;
// }

export async function deleteWorkout(id: number) {
  try {
    // First, delete related records from workoutsHistory
    await db.delete(workoutsHistory).where(eq(workoutsHistory.workoutId, id));

    // Then, delete the workout from workouts
    const deletedWorkout = await db
      .delete(workouts)
      .where(eq(workouts.id, id))
      .returning();

    return deletedWorkout;
  } catch (error) {
    console.error("Error deleting workout:", error);
    throw error; // Ensure the error is propagated
  }
}
// Define interfaces
interface Workout {
  id: number;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
}

interface User {
  name: string;
}

interface WorkoutWithUser extends Workout {
  name: string; // user's name
}

type GroupedWorkouts = Record<string, Workout[]>;

// Fetch and group workouts
export async function getAllWorkoutsGroupedByUser(): Promise<GroupedWorkouts> {
  const user = auth();

  if (!user.userId) throw new Error("Unauthorized");

  // Fetch all workouts with their associated users
  const allWorkouts = (await db
    .select({
      id: workouts.id,
      exerciseName: workouts.exerciseName,
      weight: workouts.weight,
      sets: workouts.sets,
      reps: workouts.reps,
      name: users.name,
    })
    .from(workouts)
    .leftJoin(
      users,
      eq(workouts.userId, users.clerkUserId),
    )) as WorkoutWithUser[]; // Type assertion

  // Group workouts by user
  const groupedWorkouts: GroupedWorkouts = {};

  allWorkouts.forEach((workout) => {
    // Ensure the user's workouts array exists
    const userName = workout.name;
    if (userName) {
      // Ensure the workout has a name
      if (!groupedWorkouts[userName]) {
        groupedWorkouts[userName] = [];
      }
      groupedWorkouts[userName].push({
        id: workout.id,
        exerciseName: workout.exerciseName,
        weight: workout.weight,
        sets: workout.sets,
        reps: workout.reps,
      });
    }
  });

  return groupedWorkouts;
}
