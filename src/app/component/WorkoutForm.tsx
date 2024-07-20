'use client'
import { useClerk } from '@clerk/nextjs';
import React, { useState } from 'react';

const WorkoutForm: React.FC = () => {
  const { user } = useClerk();
  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("user>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", user);
    // Assuming you have an API endpoint for adding workouts
    const response = await fetch('/api/workouts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exerciseName,
        weight: parseFloat(weight),
        sets: parseInt(sets, 10),
        reps: parseInt(reps, 10),
        userName: user?.firstName, // Clerk user's first name
        userAvatar: user?.imageUrl

      }),
    });

    if (response.ok) {
      // Clear the form or provide feedback
      setExerciseName('');
      setWeight('');
      setSets('');
      setReps('');
      // alert('Workout added successfully!');
    } else {
      alert('Failed to add workout.');
    }
  };
  console.log("user", user)
  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
      <div>
        <label htmlFor="exerciseName" className="block text-white">Exercise Name:</label>

        <input
          type="text"
          id="exerciseName"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          className="w-full p-2 mt-1 bg-gray-700 text-white rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="weight" className="block text-white">Weight (kgs):</label>
        <input
          type="number"
          id="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full p-2 mt-1 bg-gray-700 text-white rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="sets" className="block text-white">Sets:</label>
        <input
          type="number"
          id="sets"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          className="w-full p-2 mt-1 bg-gray-700 text-white rounded-md"
          required
        />
      </div>
      <div>
        <label htmlFor="reps" className="block text-white">Reps:</label>
        <input
          type="number"
          id="reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="w-full p-2 mt-1 bg-gray-700 text-white rounded-md"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Add Workout
      </button>
    </form>
  );
};

export default WorkoutForm;
