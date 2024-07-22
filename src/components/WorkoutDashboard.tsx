"use client";

import React, { useState } from "react";
import WorkoutCard from "./WorkoutCard";
import WorkoutForm from "./WorkoutForm";
import WorkoutUpdateForm from "./WorkoutUpdateForm";
import { useRouter } from "next/navigation";
import Modal from "../app/@modal/Modal";
import ConfirmationModal from "../app/@modal/ConfirmationModal";
import Image from 'next/image';
import { toast } from "sonner";


interface Workout {
  id: number;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
  userId: string;
  userName: string;
  userAvatar: string | null;
}

interface WorkoutDashboardProps {
  workouts: Workout[];
  currentUserId: string | undefined;
  currentUserAvatar: string | undefined;
}

const WorkoutDashboard: React.FC<WorkoutDashboardProps> = ({ workouts, currentUserId, currentUserAvatar }) => {
  const router = useRouter();

  // Group workouts by userId using Map
  const groupedWorkouts = workouts.reduce((map, workout) => {
    const userWorkouts = map.get(workout.userId) ?? [];
    userWorkouts.push(workout);
    map.set(workout.userId, userWorkouts);
    return map;
  }, new Map<string, Workout[]>());

  return (
    <div className="flex flex-col">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto space-y-4 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Workout Details</h2>
        <div className="space-y-4">
          {groupedWorkouts.size === 0 ? (
            <p className="text-center">No workouts found.</p>
          ) : (
            Array.from(groupedWorkouts.entries()).map(([userId, userWorkouts]: [string, Workout[]]) => {
              const userName = userWorkouts[0]?.userName;
              const userAvatar = userWorkouts[0]?.userAvatar;
              return (
                <div key={userId} className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
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
