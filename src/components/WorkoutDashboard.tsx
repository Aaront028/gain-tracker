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
  show_workout: boolean;
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

  const scrollableStyle = {
    overflowY: 'auto' as const,
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  };

  return (
    <div className="p-6 bg-gray-900">
      <div className="text-white w-full max-w-7xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Workout Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groupedWorkouts.size === 0 ? (
            <p className="text-center col-span-full text-lg">No workouts found.</p>
          ) : (
            Array.from(groupedWorkouts.entries()).map(([userId, userWorkouts]: [string, Workout[]]) => {
              const userName = userWorkouts[0]?.userName;
              const userAvatar = userWorkouts[0]?.userAvatar;
              return (
                <div key={userId} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 bg-gray-700">
                    <h3 className="text-xl font-semibold flex items-center">
                      <Image
                        src={userAvatar ?? '/default-avatar.png'}
                        alt={`${userName}'s Avatar`}
                        width={48}
                        height={48}
                        className="rounded-full mr-4 border-2 border-gray-600"
                      />
                      <span className="text-white">{userName}&apos;s Workouts</span>
                    </h3>
                  </div>
                  <div style={scrollableStyle} className="p-4 h-[300px]">
                    {userWorkouts.map((workout) => (
                      <div key={workout.id} className="mb-4 last:mb-0">
                        <WorkoutCard workout={workout} isUser={false} />
                      </div>
                    ))}
                  </div>
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
