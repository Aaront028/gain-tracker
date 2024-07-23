"use client";
import React from "react";
import WorkoutCard from "./WorkoutCard";
import { useRouter } from "next/navigation";
import Image from 'next/image';

interface Workout {
  id: number;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
  userId: string;
  userName: string;
  userAvatar: string | null;
  show_workout: boolean; // Add this line
}

interface Exercise {
  id: number;
  name: string;
}

interface WorkoutDashboardProps {
  workouts: Workout[];
  currentUserId: string | undefined;
  currentUserAvatar: string | undefined;
  exercises: Exercise[];
}

const WorkoutDashboard: React.FC<WorkoutDashboardProps> = ({ workouts, currentUserId, currentUserAvatar, exercises }) => {
  const router = useRouter();

  // Group workouts by userId using Map
  const groupedWorkouts = workouts.reduce((map, workout) => {
    const userWorkouts = map.get(workout.userId) ?? [];
    userWorkouts.push(workout);
    map.set(workout.userId, userWorkouts);
    return map;
  }, new Map<string, Workout[]>());

  return (
    <div className="p-6">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-7xl mx-auto space-y-4 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Workout Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedWorkouts.size === 0 ? (
            <p className="text-center">No workouts found.</p>
          ) : (
            Array.from(groupedWorkouts.entries()).map(([userId, userWorkouts]: [string, Workout[]]) => {
              const userName = userWorkouts[0]?.userName;
              const userAvatar = userWorkouts[0]?.userAvatar;
              return (
                <div key={userId} className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Image
                      src={userAvatar ?? '/default-avatar.png'}
                      alt={`${userName}'s Avatar`}
                      width={40}
                      height={40}
                      className="rounded-full mr-4"
                    />
                    {userName}&apos;s Workouts
                  </h3>
                  {userWorkouts.map((workout) => (
                    <div key={workout.id} className="mb-4">
                      <WorkoutCard workout={workout} />
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDashboard;
