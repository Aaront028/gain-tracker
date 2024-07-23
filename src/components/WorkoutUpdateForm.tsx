'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Exercise {
  id: number;
  name: string;
  category: string;
}

interface Workout {
  id: number;
  exerciseId: number;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
}

interface WorkoutUpdateFormProps {
  workout: Workout;
  onClose: () => void;
  exercises: Exercise[];
}

const WorkoutUpdateForm: React.FC<WorkoutUpdateFormProps> = ({ workout, onClose, exercises }) => {
  const router = useRouter();
  const [exerciseId, setExerciseId] = useState<number>(workout.exerciseId);
  const [exerciseName, setExerciseName] = useState<string>(workout.exerciseName);
  const [weight, setWeight] = useState<string>(workout.weight.toString());
  const [sets, setSets] = useState<string>(workout.sets.toString());
  const [reps, setReps] = useState<string>(workout.reps.toString());
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredExercises(exercises.filter(exercise => exercise.category === selectedCategory));
    } else {
      setFilteredExercises(exercises);
    }
  }, [selectedCategory, exercises]);

  useEffect(() => {
    if (exerciseId) {
      const selectedExercise = exercises.find(exercise => exercise.id === exerciseId);
      setExerciseName(selectedExercise?.name ?? '');
    } else {
      setExerciseName('');
    }
  }, [exerciseId, exercises]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`/api/workouts/${workout.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exerciseId,
        exerciseName,
        weight: parseFloat(weight),
        sets: parseInt(sets, 10),
        reps: parseInt(reps, 10),
      }),
    });

    if (response.ok) {
      toast.success('Workout updated successfully');
      onClose();
      router.refresh();
    } else {
      toast.error('Failed to update workout');
    }
  };

  // Get unique categories for the category dropdown
  const categories = Array.from(new Set(exercises.map(exercise => exercise.category)));

  return (
    <form onSubmit={handleUpdate} className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-md mx-auto space-y-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300">Muscle Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-3 mt-1 bg-gray-900 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="exerciseId" className="block text-sm font-medium text-gray-300">Exercise Name:</label>
        <select
          id="exerciseId"
          value={exerciseId ?? ''}
          onChange={(e) => setExerciseId(parseInt(e.target.value))}
          className="w-full p-3 mt-1 bg-gray-900 text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out"
          required
        >
          <option value="" disabled>Select an exercise</option>
          {filteredExercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-300">Weight (kgs):</label>
        <input
          type="number"
          id="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 text-gray-300 border border-gray-700 rounded-lg"
          required
        />
      </div>
      <div>
        <label htmlFor="sets" className="block text-sm font-medium text-gray-300">Sets:</label>
        <input
          type="number"
          id="sets"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 text-gray-300 border border-gray-700 rounded-lg"
          required
        />
      </div>
      <div>
        <label htmlFor="reps" className="block text-sm font-medium text-gray-300">Reps:</label>
        <input
          type="number"
          id="reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 text-gray-300 border border-gray-700 rounded-lg"
          required
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
