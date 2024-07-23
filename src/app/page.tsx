import Link from "next/link";
import { db } from "~/server/db";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import SignInPrompt from "../components/SignInPrompt";
import WorkoutDashboard from "../components/WorkoutDashboard";

export const dynamic = "force-dynamic";

interface Exercise {
  id: number;
  name: string;
}

interface Workout {
  id: number;
  exerciseId: number;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
  userId: string;
  userName: string;
  userAvatar: string | null;
  show_workout: boolean;
}

export default async function HomePage() {
  const workouts = await db.query.workouts.findMany();
  const exercises = await db.query.exercises.findMany();
  const user = await currentUser();
  const currentUserId = user?.id; // Extract the user ID from the currentUser object
  const currentUserAvatar = user?.imageUrl
  console.log(workouts);


  return (
    <div className="flex flex-col">
      <SignedOut>
        <SignInPrompt />
      </SignedOut>
      <SignedIn>
        <WorkoutDashboard workouts={workouts} currentUserId={currentUserId} currentUserAvatar={currentUserAvatar} exercises={exercises} />
      </SignedIn>
    </div>
  );
}
