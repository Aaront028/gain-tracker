"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type Workout = {
  id: number;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
};

type WorkoutUpdateFormProps = {
  workout: Workout;
  onClose: () => void;
};

const WorkoutUpdateForm: React.FC<WorkoutUpdateFormProps> = ({ workout, onClose }) => {
  const router = useRouter();
  const [exerciseName, setExerciseName] = useState(workout.exerciseName);
  const [weight, setWeight] = useState(workout.weight.toString());
  const [sets, setSets] = useState(workout.sets.toString());
  const [reps, setReps] = useState(workout.reps.toString());

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`/api/workouts/${workout.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exerciseName,
        weight: parseFloat(weight),
        sets: parseInt(sets, 10),
        reps: parseInt(reps, 10),
      }),
    });

    if (response.ok) {
      onClose();
      router.refresh();
    } else {
      alert('Failed to update workout.');
    }
  };

  return (
    <form onSubmit={handleUpdate} className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Exercise Name</label>
        <input
          type="text"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 text-gray-300 border border-gray-700 rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Weight</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 text-gray-300 border border-gray-700 rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Sets</label>
        <input
          type="number"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 text-gray-300 border border-gray-700 rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Reps</label>
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 text-gray-300 border border-gray-700 rounded-lg"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-yellow-500 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
      >
        Update Workout
      </button>
    </form>
  );
};

export default WorkoutUpdateForm;
