import Link from "next/link";
import { db } from "~/server/db";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignInPrompt from "./component/SignInPrompt";
import WorkoutDashboard from "./component/WorkoutDashboard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const workouts = await db.query.workouts.findMany();

  console.log(workouts);

  return (
    <main className="flex flex-col">
      <SignedOut>
        <SignInPrompt />
      </SignedOut>
      <SignedIn>
        <WorkoutDashboard workouts={workouts} />
      </SignedIn>
    </main>
  );
}
