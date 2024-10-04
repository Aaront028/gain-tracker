import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import SignInPrompt from "../components/SignInPrompt";
import WorkoutDashboard from "../components/WorkoutDashboard";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const workouts = await db.query.workouts.findMany();
  const exercises = await db.query.exercises.findMany();
  const user = await currentUser();
  const currentUserId = user?.id;
  const currentUserAvatar = user?.imageUrl;

  return (
    <div className="container mx-auto px-4 py-8">
      <SignedOut>
        <SignInPrompt />
      </SignedOut>
      <SignedIn>
        <WorkoutDashboard
          workouts={workouts}
          currentUserId={currentUserId}
          currentUserAvatar={currentUserAvatar}
          exercises={exercises}
        />
      </SignedIn>
    </div>
  );
}
