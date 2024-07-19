import Link from "next/link";
import { db } from "~/server/db";
import WorkoutCard from "./component/WorkoutCard";
import WorkoutForm from "./component/WorkoutForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {

  const workouts = await db.query.workouts.findMany();

  console.log(workouts);

  return (
    <main className="flex flex-wrap">

      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">Workout Details</h2>
        <div className="space-y-4">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      </div>
      <WorkoutForm />

    </main>
  );
}
