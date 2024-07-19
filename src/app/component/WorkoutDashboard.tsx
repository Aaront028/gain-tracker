"use client";

import React, { useState } from "react";
import WorkoutCard from "./WorkoutCard";
import WorkoutForm from "./WorkoutForm";
import WorkoutUpdateForm from "./WorkoutUpdateForm";

interface Workout {
  id: number;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
}

interface WorkoutDashboardProps {
  workouts: Workout[];
}

const WorkoutDashboard: React.FC<WorkoutDashboardProps> = ({ workouts }) => {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const handleEditClick = (workout: Workout) => {
    setSelectedWorkout(workout);
  };

  return (
    <div className="flex flex-col">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto space-y-4 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Workout Details</h2>
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div key={workout.id}>
              <WorkoutCard workout={workout} />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                onClick={() => handleEditClick(workout)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto space-y-4">
        <WorkoutForm />
        {selectedWorkout && <WorkoutUpdateForm workout={selectedWorkout} />}
      </div>
    </div>
  );
};

export default WorkoutDashboard;
