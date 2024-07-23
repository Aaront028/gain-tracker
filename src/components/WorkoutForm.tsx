'use client';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface WorkoutFormProps {
  onClose: () => void;
  exercises: Exercise[];
}

interface Exercise {
  id: number;
  name: string;
  category: string;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onClose, exercises }) => {
  const router = useRouter();
  const { user } = useClerk();
  const [exerciseId, setExerciseId] = useState<number | null>(null);
  const [exerciseName, setExerciseName] = useState<string>('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/workouts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exerciseId,
        exerciseName, // Include exerciseName here
        weight: parseFloat(weight),
        sets: parseInt(sets, 10),
        reps: parseInt(reps, 10),
        userName: user?.firstName ?? user?.username,
        userAvatar: user?.imageUrl
      }),
    });

    if (response.ok) {
      setExerciseId(null);
      setWeight('');
      setSets('');
      setReps('');
      setSelectedCategory('');
      setFilteredExercises(exercises);

      router.refresh();
      toast.success('Workout added successfully');
      onClose();
    } else {
      toast.error('Failed to add workout');
    }
  };

  // Get unique categories for the category dropdown
  const categories = Array.from(new Set(exercises.map(exercise => exercise.category)));

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
      <div>
        <label htmlFor="category" className="block text-white text-sm font-medium">Muscle Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-3 mt-1 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="exerciseId" className="block text-white text-sm font-medium">Exercise Name:</label>
        <select
          id="exerciseId"
          value={exerciseId ?? ''}
          onChange={(e) => setExerciseId(parseInt(e.target.value))}
          className="w-full p-3 mt-1 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out"
          required
        >
          <option value="" disabled>Select an exercise</option>
          {filteredExercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="weight" className="block text-white text-sm font-medium">Weight (kgs):</label>
        <input
          type="number"
          id="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full p-3 mt-1 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out"
          required
        />
      </div>
      <div>
        <label htmlFor="sets" className="block text-white text-sm font-medium">Sets:</label>
        <input
          type="number"
          id="sets"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          className="w-full p-3 mt-1 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out"
          required
        />
      </div>
      <div>
        <label htmlFor="reps" className="block text-white text-sm font-medium">Reps:</label>
        <input
          type="number"
          id="reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-full p-3 mt-1 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
      >
        Add Workout
      </button>
    </form>
  );
};

export default WorkoutForm;
