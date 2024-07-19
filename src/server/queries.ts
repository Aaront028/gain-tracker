import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { images, workouts } from "./db/schema";
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
