import Link from "next/link";
import { db } from "~/server/db";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import SignInPrompt from "./component/SignInPrompt";
import WorkoutDashboard from "./component/WorkoutDashboard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const workouts = await db.query.workouts.findMany();
  const user = await currentUser();
  const currentUserId = user?.id; // Extract the user ID from the currentUser object
  console.log(workouts);


  return (
    <main className="flex flex-col">
      <SignedOut>
        <SignInPrompt />
      </SignedOut>
      <SignedIn>
        <WorkoutDashboard workouts={workouts} currentUserId={currentUserId} />
      </SignedIn>
    </main>
  );
}
