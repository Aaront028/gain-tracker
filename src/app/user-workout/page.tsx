import Link from "next/link";
import { db } from "~/server/db";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import SignInPrompt from "~/components/SignInPrompt";
import UserWorkout from "~/components/UserWorkout";

export const dynamic = "force-dynamic";

export default async function UserWorkoutPage() {
  const workouts = await db.query.workouts.findMany();
  const exercises = await db.query.exercises.findMany();
  const user = await currentUser();
  const currentUserId = user?.id;
  const currentUserAvatar = user?.imageUrl;

  return (
    <div className="flex flex-col">
      <SignedOut>
        <SignInPrompt />
      </SignedOut>
      <SignedIn>
        <UserWorkout workouts={workouts} currentUserId={currentUserId} currentUserAvatar={currentUserAvatar} exercises={exercises} />
      </SignedIn>
    </div>
  );
}
